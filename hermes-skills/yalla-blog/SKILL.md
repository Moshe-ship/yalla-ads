---
name: yalla-blog
description: Generate 1800+ word Arabic blog posts about digital marketing for yalla-ads.com
version: 1.0.0
author: Mousa Abu Mazin
license: MIT
platforms: [linux, macos]
prerequisites:
  commands: [node, npm]
  env_vars: []
metadata:
  hermes:
    tags: [blog, arabic, seo, content, marketing, astro, yalla-ads]
---
# Yalla Ads Arabic Blog Generator

Generate high-quality, SEO-optimized Arabic blog posts about digital marketing for yalla-ads.com. This skill replaces the previous `auto-blog.mjs` script that used Cerebras/Gemini API fallback chains with native Hermes generation.

## Language Rules (CRITICAL)

- **Modern Standard Arabic (MSA / فصحى) ONLY** throughout the entire post
- **NO dialect whatsoever**: no Khaleeji (خليجي), no Shami (شامي), no Egyptian (مصري) slang
- **One exception only**: the brand slogan "منوصلك للزبون الصحيح" may appear ONCE as a brand accent
- Use dollars ($) for any pricing references
- Professional, clear, and accessible to all Arabic speakers across the region

## Data Sources

Before writing, gather trending topics from these sources using the browser tool (Camofox) or curl:

### Source 1: Google Trends (Saudi Arabia + UAE)

```bash
# Google Trends RSS — Saudi Arabia
curl -sL -A "Mozilla/5.0 (compatible; YallaAdsBot/1.0)" "https://trends.google.com/trending/rss?geo=SA" -o /tmp/yalla-trends-sa.xml

# Google Trends RSS — UAE
curl -sL -A "Mozilla/5.0 (compatible; YallaAdsBot/1.0)" "https://trends.google.com/trending/rss?geo=AE" -o /tmp/yalla-trends-ae.xml
```

Extract trending topics from the RSS XML. Look for titles inside `<title><![CDATA[...]]></title>` tags. Filter for topics that can be connected to digital marketing.

### Source 2: Reddit Marketing Subs

```bash
# Fetch hot posts from marketing subreddits
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/marketing/hot.json?limit=10" -o /tmp/yalla-reddit-marketing.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/digitalmarketing/hot.json?limit=10" -o /tmp/yalla-reddit-digital.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/SEO/hot.json?limit=10" -o /tmp/yalla-reddit-seo.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/PPC/hot.json?limit=5" -o /tmp/yalla-reddit-ppc.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/socialmedia/hot.json?limit=5" -o /tmp/yalla-reddit-social.json
```

Extract post titles from the JSON response at `data.children[].data.title`. Skip stickied posts.

### Source 3: Fallback Topics

If scraping fails or yields no relevant results, use these evergreen topics:

- التسويق الرقمي في السعودية والإمارات
- إعلانات قوقل للشركات الصغيرة
- تحسين محركات البحث (SEO) بالعربي
- إدارة وسائل التواصل الاجتماعي
- صناعة المحتوى الرقمي
- التجارة الإلكترونية في الشرق الأوسط
- تسويق المتاجر الإلكترونية
- استراتيجيات جذب العملاء

## Blog Post Requirements

### Frontmatter Format

Every post must use this exact Astro frontmatter:

```yaml
---
title: "العنوان بالعربي — يتضمن رقم أو سؤال للتشويق"
description: "وصف قصير ١-٢ جملة بين 120-160 حرف يتضمن الكلمة المفتاحية"
date: "YYYY-MM-DD"
author: "فريق يلا ادز"
tags: ["تسويق رقمي", "كلمة ثانية", "كلمة ثالثة"]
image: "https://images.unsplash.com/photo-RELEVANT_ID?w=800&q=80"
---
```

### Unsplash Image Selection

Choose the image URL based on the post topic:

| Topic | Photo ID |
|-------|----------|
| Digital marketing | photo-1460925895917-afdab827c52f |
| Social media | photo-1611162617474-5b21e879e113 |
| SEO/Analytics | photo-1562577309-4932fdd64cd1 |
| Content creation | photo-1542744094-3a31f272c490 |
| Business growth | photo-1432888622747-4eb9a8efeb07 |
| Technology | photo-1518770660439-4636190af475 |
| Strategy/Planning | photo-1454165804606-c3d57bc86b40 |
| Advertising | photo-1563986768609-322da13575f2 |
| E-commerce | photo-1556742049-0cfed4f6a45d |
| Data/Charts | photo-1551288049-bebda4e38f71 |

### Content Rules

1. **Minimum 1800 words** — this is critical. Count words and verify.
2. **Title must include a number or question** for SEO appeal (e.g., "٧ استراتيجيات..." or "كيف تضاعف...")
3. **Use `##` for H2 headings and `###` for H3** — descriptive headings that include keywords
4. **Bold (`**text**`) for emphasis** on key concepts
5. **Bullet points and numbered lists** for readability
6. **Include real statistics and data** — cite actual marketing data, conversion rates, platform stats
7. **Practical and actionable** — every section must give the reader something they can implement
8. **Reference Middle East market specifics** — Saudi Vision 2030 digital initiatives, UAE e-commerce growth, Ramadan marketing seasons, regional platform preferences
9. **Naturally mention Yalla Ads services** — Google Ads, social media management, SEO, content creation, lead generation
10. **End with a subtle CTA** — mention يلا ادز without being pushy, reference yalla-ads.com

### Topic Categories

Rotate through these subjects:

1. **إعلانات قوقل** — Google Ads setup, Performance Max, search vs display, budget strategies
2. **تحسين محركات البحث (SEO)** — on-page, technical SEO, Arabic keyword research, local SEO
3. **وسائل التواصل الاجتماعي** — Instagram, TikTok, Snapchat (popular in GCC), X/Twitter, content calendars
4. **صناعة المحتوى** — video marketing, copywriting in Arabic, content repurposing
5. **التجارة الإلكترونية** — Shopify Arabic, Salla, Zid, payment gateways, MENA marketplace strategies
6. **التسويق بالبريد الإلكتروني** — list building, automation, Arabic email marketing
7. **تحليلات البيانات** — Google Analytics, conversion tracking, ROI measurement
8. **اتجاهات التسويق الرقمي** — AI in marketing, voice search, AR/VR marketing trends

## Execution Steps

1. **Scrape trends**: fetch Google Trends (SA + UAE) and Reddit marketing subs
2. **Select topic**: pick the most relevant trending topic or accept user-provided topic
3. **Generate outline**: create H2/H3 structure with 6-10 sections
4. **Write the post**: generate the full Arabic blog post following all rules
5. **Create the file**: generate a URL-safe slug from the Arabic title
   - Format: `YYYY-MM-DD-arabic-words.md`
   - Arabic characters are acceptable in the slug
   - Ensure the slug is unique against existing files
6. **Write file** to `/Users/mousaabumazin/Projects/yalla-ads/src/content/blog/{slug}.md`
7. **Verify word count**: count words in the body (excluding frontmatter), confirm >= 1800
8. **Verify language**: re-read the post and confirm NO dialectal Arabic crept in

## Slug Generation

```
Title: "٧ استراتيجيات لتحسين إعلانات قوقل في ٢٠٢٦"
Slug:  2026-04-04-٧-استراتيجيات-لتحسين-إعلانات-قوقل.md
```

If the slug already exists in the blog directory, append `-2`, `-3`, etc.

## File Location

Posts go in: `/Users/mousaabumazin/Projects/yalla-ads/src/content/blog/`

## Existing Posts (avoid duplicate topics)

- تسويق الفيديو القصير — تيك توك وريلز
- أعظم ٧ أسرار في التسويق
- ٧ أسباب تدفعك تبدأ التسويق
- ٧ أسرار لا يعرفها الكثيرون
- ٧ أسرار لا تخبرك بها
- Content creation tips
- Google Ads guide (Arabic)
- SEO basics (Arabic)
- Why social media matters

## Brand Reference

- **Agency**: يلا ادز (Yalla Ads)
- **Slogan**: منوصلك للزبون الصحيح (use sparingly, max once per post)
- **Website**: yalla-ads.com
- **Instagram**: @yallaadss
- **Colors**: Orange (#E67E22) + Navy (#1B2E6E)
- **Author**: فريق يلا ادز
- **Target audience**: business owners and marketers in Saudi Arabia, UAE, and broader MENA region
