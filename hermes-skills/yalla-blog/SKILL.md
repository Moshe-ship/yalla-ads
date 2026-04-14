---
name: yalla-blog
description: Generate Arabic RTL blog posts about digital marketing for yalla-ads.com
version: 1.0.0
author: Mousa Abu Mazin
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [blog, arabic, marketing, seo, rtl]
---
# Yalla Ads Arabic Blog Generator

Generate Arabic blog posts for yalla-ads.com targeting Arab business owners who need digital marketing help.

## Writing Rules

- Write in **Arabic (فصحى واضحة وسهلة)** — clear, professional Modern Standard Arabic
- Target: Arab business owners and marketers
- 1500-2000 words
- Include real statistics and actionable advice
- End with CTA for Yalla Ads services
- Bold propaganda-style tone — confident, direct, motivational

## Blog Structure

Use Astro frontmatter:

```yaml
---
title: "Arabic Title"
description: "Arabic meta description 120-160 chars"
date: "YYYY-MM-DD"
author: "يلا ادز"
image: "/blog-images/YYYY-MM-DD.jpg"
tags: ["tag1", "tag2"]
---
```

## Topics

Rotate through:
1. Google Ads for Arab businesses
2. Social media marketing (Instagram, TikTok, Snapchat for MENA)
3. SEO for Arabic websites
4. E-commerce in the Arab world
5. AI tools for Arab marketers
6. Content marketing in Arabic

## Execution

1. Research trending digital marketing topics relevant to Arab market
2. Write full post in Arabic with h2/h3 structure  
3. Generate hero image via Pollinations.ai (see Image Generation below)
4. Save post to `src/content/blog/YYYY-MM-DD-slug.md`
5. Save image to `public/blog-images/YYYY-MM-DD.jpg` — frontmatter `image` field must reference `/blog-images/YYYY-MM-DD.jpg`
6. Verify word count is at least ~700 Arabic words (~1500 total tokens). If short, add more sections.
7. `git add -A && git commit -m "New blog post: [Arabic title]" && git pull --rebase && git push`

## Image Generation (Pollinations.ai)

Use `requests` library (not `urllib` — it gets HTTP 403 from Pollinations).

**Working endpoint:**
```
https://image.pollinations.ai/prompt/{url_encoded_prompt}?width=1200&height=675&nologo=true&seed={number}
```

**PITFALLS:**
- `pollinations.ai/p/{prompt}` returns HTML, NOT an image. Always use `image.pollinations.ai/prompt/...`
- `image.pollinations.ai/prompt/` with `?enhance=true&model=flux` also returns errors. Keep it simple: `?width=1200&height=675&nologo=true&seed=N`
- **Always verify** the response: check `Content-Type` header contains `image/` AND file size > 10KB AND file header starts with `\xff\xd8` (JPEG) or `\x89PNG`
- Use `requests` with a User-Agent header to avoid 403 blocks
- Dark propaganda style prompt template: "Dark propaganda style digital art about [TOPIC], dramatic red and gold lighting, ominous power, 16:9, cinematic, high contrast, dark background with orange accents"

## File Location

Posts go in: /Users/majana-agent/Projects/yalla-ads/src/content/blog/
Images go in: /Users/majana-agent/Projects/yalla-ads/public/blog-images/
