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
3. Generate image via Pollinations.ai with dark propaganda style
4. Save to src/content/blog/
5. Git commit and push

## File Location

Posts go in: /Users/majana-agent/Projects/yalla-ads/src/content/blog/
