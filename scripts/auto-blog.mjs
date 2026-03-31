#!/usr/bin/env node
/**
 * Yalla Ads Auto Blog Generator
 * Scrapes Google Trends + Reddit → generates 1800+ word Arabic blog → commits to repo
 * Runs 3x/week via GitHub Actions
 */

import fs from 'fs';
import path from 'path';

const CEREBRAS_KEY = process.env.CEREBRAS_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

let puter = null;
try {
  const puterModule = await import('@heyputer/puter.js');
  puter = puterModule.default || puterModule.puter || puterModule;
  console.log('Puter.js loaded');
} catch {
  console.log('Puter.js not available, using API providers');
}

if (!puter && !CEREBRAS_KEY && !GEMINI_KEY) {
  console.error('No AI provider available (Puter.js, Cerebras, or Gemini)');
  process.exit(1);
}

const BLOG_DIR = path.resolve('src/content/blog');

// ─── Scrape Google Trends (Arabic region) ───
async function fetchGoogleTrends() {
  console.log('Fetching Google Trends...');
  const topics = [];

  try {
    // Google Trends RSS for Saudi Arabia
    const urls = [
      'https://trends.google.com/trending/rss?geo=SA',
      'https://trends.google.com/trending/rss?geo=AE',
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YallaAdsBot/1.0)' },
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) continue;
        const xml = await res.text();
        // Extract titles from RSS items
        const matches = xml.matchAll(/<title><!\[CDATA\[(.+?)\]\]><\/title>/g);
        for (const m of matches) {
          if (m[1] && !m[1].includes('Daily Search Trends')) {
            topics.push(m[1].trim());
          }
        }
      } catch { /* skip on error */ }
    }
  } catch (e) {
    console.warn('Google Trends fetch failed:', e.message);
  }

  console.log(`Found ${topics.length} Google Trends topics`);
  return topics.slice(0, 15);
}

// ─── Scrape Reddit trending marketing topics ───
async function fetchRedditTrends() {
  console.log('Fetching Reddit trends...');
  const topics = [];

  const subs = ['marketing', 'digitalmarketing', 'socialmedia', 'SEO', 'PPC'];

  for (const sub of subs) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=5`, {
        headers: { 'User-Agent': 'YallaAdsBot/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const post of data.data?.children || []) {
        if (post.data?.title && !post.data.stickied) {
          topics.push(`[r/${sub}] ${post.data.title}`);
        }
      }
    } catch { /* skip */ }
  }

  console.log(`Found ${topics.length} Reddit topics`);
  return topics.slice(0, 15);
}

// ─── Generate blog post with Gemini ───
async function generateBlogPost(googleTrends, redditTrends) {
  console.log('Generating blog post with Gemini...');

  const today = new Date().toISOString().split('T')[0];

  const prompt = `You are a senior Arabic content writer for "يلا ادز" (Yalla Ads), a digital marketing agency.

TASK: Write a high-quality, SEO-optimized Arabic blog post about digital marketing. The post MUST be 1800+ words.

TRENDING TOPICS (use these for inspiration — pick the most relevant to digital marketing):
Google Trends (Saudi Arabia / UAE):
${googleTrends.map(t => `- ${t}`).join('\n')}

Reddit Marketing Discussions:
${redditTrends.map(t => `- ${t}`).join('\n')}

REQUIREMENTS:
1. Write ENTIRELY in formal Arabic (فصحى). Use Modern Standard Arabic throughout — professional, clear, and accessible to all Arabic speakers. NO dialect whatsoever (no Khaleeji, Shami, or Egyptian slang). Use dollars ($) for any pricing. The only exception: the brand slogan "منوصلك للزبون الصحيح" can appear once at most as a brand accent.
2. Title must be catchy and SEO-friendly (include a number or question)
3. Must be 1800+ words — this is CRITICAL. Count your words.
4. Use ## for h2 headings, ### for h3, **bold** for emphasis
5. Include practical, actionable advice — not generic fluff
6. Naturally mention services like Google Ads, social media management, SEO, content creation
7. End with a subtle CTA mentioning يلا ادز without being too salesy
8. Use bullet points and numbered lists for readability
9. Include real statistics or data points where possible
10. Write for business owners and marketers in the Middle East

OUTPUT FORMAT — return ONLY this, no extra text:
---
title: "العنوان هنا"
description: "وصف قصير ١-٢ جملة بين 120-160 حرف"
date: "${today}"
author: "فريق يلا ادز"
tags: ["تسويق رقمي", "tag2", "tag3"]
image: "https://images.unsplash.com/photo-RELEVANT_PHOTO_ID?w=800&q=80"
---

[Full blog post content here in markdown]

IMPORTANT for the image field: Pick a real Unsplash photo URL that matches the topic. Use one of these based on the subject:
- Digital marketing: photo-1460925895917-afdab827c52f
- Social media: photo-1611162617474-5b21e879e113
- SEO/Analytics: photo-1562577309-4932fdd64cd1
- Content creation: photo-1542744094-3a31f272c490
- Business growth: photo-1432888622747-4eb9a8efeb07
- Technology: photo-1518770660439-4636190af475
- Strategy/Planning: photo-1454165804606-c3d57bc86b40
- Advertising: photo-1563986768609-322da13575f2
- E-commerce: photo-1556742049-0cfed4f6a45d
- Data/Charts: photo-1551288049-bebda4e38f71`;

  let text = null;

  // ── Strategy 0: Puter.js (free, no API key, all models) ──
  if (puter && !text) {
    const puterModels = ['claude-sonnet-4', 'gpt-4o', 'gemini-2.0-flash'];
    for (const model of puterModels) {
      try {
        console.log(`Trying Puter.js ${model}...`);
        const response = await puter.ai.chat(prompt, { model, stream: false });
        text = typeof response === 'string' ? response : response?.message?.content || response?.toString();
        if (text) { console.log(`Success with Puter.js ${model}`); break; }
      } catch (e) {
        console.warn(`Puter.js ${model} failed: ${e.message}`);
      }
    }
  }

  // ── Strategy 1: Cerebras (Qwen3 235B — free, best for Arabic) ──
  if (CEREBRAS_KEY && !text) {
    const cerebrasModels = ['qwen-3-235b-a22b-instruct-2507', 'llama3.1-8b'];
    for (const model of cerebrasModels) {
      try {
        console.log(`Trying Cerebras ${model}...`);
        const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CEREBRAS_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 8192,
          }),
          signal: AbortSignal.timeout(120000),
        });

        if (res.status === 429) {
          console.warn(`Cerebras ${model} rate limited, trying next...`);
          continue;
        }
        if (!res.ok) {
          console.warn(`Cerebras ${model} error ${res.status}`);
          continue;
        }

        const data = await res.json();
        text = data.choices?.[0]?.message?.content;
        if (text) { console.log(`Success with Cerebras ${model}`); break; }
      } catch (e) {
        console.warn(`Cerebras ${model} failed: ${e.message}`);
      }
    }
  }

  // ── Strategy 2: Gemini fallback ──
  if (!text && GEMINI_KEY) {
    const geminiModels = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const model of geminiModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          console.log(`Trying Gemini ${model} (attempt ${attempt + 1})...`);
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
              }),
              signal: AbortSignal.timeout(90000),
            }
          );

          if (res.status === 429) {
            console.warn(`Gemini ${model} rate limited, waiting 15s...`);
            await new Promise(r => setTimeout(r, 15000));
            continue;
          }
          if (!res.ok) { console.warn(`Gemini ${model} error ${res.status}`); break; }

          const data = await res.json();
          text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) { console.log(`Success with Gemini ${model}`); break; }
        } catch (e) {
          console.warn(`Gemini ${model} failed: ${e.message}`);
        }
      }
      if (text) break;
    }
  }

  if (!text) throw new Error('All providers failed to generate content');

  console.log(`Generated ${text.length} chars`);
  return text.trim();
}

// ─── Create slug from Arabic title ───
function createSlug(title) {
  const date = new Date().toISOString().split('T')[0];
  // transliterate common Arabic marketing words or just use date-based slug
  const clean = title
    .replace(/[^\u0621-\u064A\u0660-\u06690-9a-zA-Z\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join('-');

  // If slug is too short or all Arabic (hard to use in URLs), use date-based
  if (clean.length < 3) return `blog-${date}`;
  return `${date}-${clean}`;
}

// ─── Check for duplicate slugs ───
function ensureUniqueSlug(slug) {
  let finalSlug = slug;
  let counter = 1;
  while (fs.existsSync(path.join(BLOG_DIR, `${finalSlug}.md`))) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  return finalSlug;
}

// ─── Main ───
async function main() {
  console.log('=== Yalla Ads Auto Blog Generator ===');
  console.log(`Date: ${new Date().toISOString()}`);

  // 1. Scrape trends
  const [googleTrends, redditTrends] = await Promise.all([
    fetchGoogleTrends(),
    fetchRedditTrends(),
  ]);

  if (googleTrends.length === 0 && redditTrends.length === 0) {
    console.warn('No trends found — using fallback topics');
    googleTrends.push('التسويق الرقمي', 'إعلانات قوقل', 'السوشال ميديا');
  }

  // 2. Generate blog post
  const content = await generateBlogPost(googleTrends, redditTrends);

  // 3. Extract title for slug
  const titleMatch = content.match(/title:\s*"(.+?)"/);
  const title = titleMatch ? titleMatch[1] : 'مقال-جديد';
  const slug = ensureUniqueSlug(createSlug(title));

  // 4. Write file
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Blog post written: ${filePath}`);

  // 5. Word count check
  const bodyOnly = content.split('---').slice(2).join('---');
  const wordCount = bodyOnly.trim().split(/\s+/).length;
  console.log(`Word count: ~${wordCount}`);

  if (wordCount < 1500) {
    console.warn('WARNING: Post might be shorter than target. Review recommended.');
  }

  console.log('=== Done ===');
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
