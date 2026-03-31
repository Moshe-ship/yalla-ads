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
if (!CEREBRAS_KEY && !GEMINI_KEY) {
  console.error('Neither CEREBRAS_API_KEY nor GEMINI_API_KEY set');
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
1. Write ENTIRELY in Arabic — use a mix of Modern Standard Arabic with Shami/Khaleeji dialect touches (like the word يلا, شو, ليش, عشان)
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
description: "وصف قصير ١-٢ جملة"
date: "${today}"
author: "فريق يلا ادز"
tags: ["tag1", "tag2", "tag3"]
---

[Full blog post content here in markdown]`;

  let text = null;

  // ── Strategy 1: Cerebras (Qwen3 235B — free, best for Arabic) ──
  if (CEREBRAS_KEY && !text) {
    const cerebrasModels = ['qwen-3-235b', 'qwen-3-32b', 'llama-3.3-70b'];
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
