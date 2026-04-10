---
name: yalla-trends
description: Scan Google Trends and Reddit for Arabic-market digital marketing topics ranked by relevance
version: 1.0.0
author: Mousa Abu Mazin
license: MIT
platforms: [linux, macos]
prerequisites:
  commands: [curl]
  env_vars: []
metadata:
  hermes:
    tags: [trends, arabic, marketing, research, google-trends, reddit, market-intelligence]
---
# Yalla Ads Arabic Trend Scanner

Scan Google Trends for Saudi Arabia and UAE, monitor Reddit marketing subreddits, and combine with local market intelligence to produce a ranked list of trending topics relevant to the Arab digital marketing market.

## How to Use

Run this skill to generate a fresh trending topics report. Optionally, the user can specify a focus area (e.g., "e-commerce trends" or "social media trends") to narrow the scan.

## Scanning Process

### Step 1: Google Trends (Saudi Arabia + UAE)

Fetch the Google Trends RSS feeds for both target countries:

```bash
# Saudi Arabia trends
curl -sL -A "Mozilla/5.0 (compatible; YallaAdsBot/1.0)" "https://trends.google.com/trending/rss?geo=SA" -o /tmp/trends-sa.xml

# UAE trends
curl -sL -A "Mozilla/5.0 (compatible; YallaAdsBot/1.0)" "https://trends.google.com/trending/rss?geo=AE" -o /tmp/trends-ae.xml
```

Extract all trending topics from the XML. For each topic, note:
- Topic name (from `<title>` tags)
- Approximate search volume (from `<ht:approx_traffic>` if available)
- Country of origin (SA or AE)

If RSS feeds fail, use the browser tool (Camofox) to visit:
- `https://trends.google.com/trending?geo=SA`
- `https://trends.google.com/trending?geo=AE`

### Step 2: Reddit Marketing Intelligence

Fetch hot and rising posts from marketing-related subreddits:

```bash
# Core marketing subs
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/marketing/hot.json?limit=15" -o /tmp/reddit-marketing.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/digitalmarketing/hot.json?limit=15" -o /tmp/reddit-digital.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/SEO/hot.json?limit=10" -o /tmp/reddit-seo.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/PPC/hot.json?limit=10" -o /tmp/reddit-ppc.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/socialmedia/hot.json?limit=10" -o /tmp/reddit-social.json

# Additional relevant subs
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/ecommerce/hot.json?limit=10" -o /tmp/reddit-ecom.json
curl -sL -A "YallaAdsBot/1.0" "https://www.reddit.com/r/content_marketing/hot.json?limit=10" -o /tmp/reddit-content.json
```

For each post, extract:
- Title (`data.children[].data.title`)
- Subreddit source
- Upvote count (`data.children[].data.ups`)
- Comment count (`data.children[].data.num_comments`)
- Skip stickied posts (`data.children[].data.stickied === true`)

High engagement (upvotes + comments) indicates the topic resonates with marketers.

### Step 3: Local Market Intelligence Layer

Apply these regional relevance filters to score each topic:

#### High Relevance Signals (boost score)
- Mentions of platforms popular in GCC: Snapchat, Instagram, TikTok, X/Twitter
- E-commerce topics (Saudi e-commerce is booming post-Vision 2030)
- Mobile-first marketing (MENA has 98%+ mobile penetration)
- Video marketing (highest engagement format in Arabic social media)
- Ramadan/Eid marketing (seasonal spikes, massive ad spend)
- Arabic language marketing or localization
- Google Ads / Performance Max campaigns
- Local SEO or Google Maps optimization
- WhatsApp marketing (widely used for business in MENA)
- Payment gateway topics (Mada, Apple Pay, Tamara, Tabby)

#### Medium Relevance Signals (standard score)
- General SEO strategies (applicable globally)
- Email marketing best practices
- Content marketing frameworks
- Analytics and data-driven marketing
- AI tools for marketing

#### Low Relevance Signals (reduce score)
- US/EU-specific regulations (GDPR details, FTC rules)
- Platforms with low MENA penetration (Pinterest, LinkedIn organic)
- B2B enterprise software marketing (Yalla Ads targets SMBs)
- Highly technical developer-focused topics

### Step 4: Scoring and Ranking

Score each topic on a 0-100 scale using this formula:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Google Trends presence | 30% | In SA trends: 30, In AE trends: 25, Both: 30 |
| Reddit engagement | 25% | High (100+ ups): 25, Medium (30-99): 15, Low (<30): 5 |
| MENA relevance | 30% | High signal: 30, Medium: 20, Low: 5 |
| Content potential | 15% | Can fill 1800+ word Arabic post: 15, Needs stretching: 8, Thin topic: 3 |

## Output Format

```markdown
# Trending Topics Report — Arab Digital Marketing
**Scan Date:** YYYY-MM-DD
**Sources:** Google Trends (SA, AE) + Reddit (r/marketing, r/digitalmarketing, r/SEO, r/PPC, r/socialmedia, r/ecommerce, r/content_marketing)

## Top 10 Trending Topics

### 1. [Topic Name in Arabic] — Score: XX/100
**Original source:** [Google Trends SA / Reddit r/marketing / etc.]
**Why it's relevant:** [1-2 sentences on why this matters for Arab market]
**Blog angle:** [Suggested blog post title in Arabic]
**Keywords:** [3-5 Arabic keywords for SEO]
**Content type:** [How-to guide / Case study / Listicle / Opinion / Tutorial]

### 2. [Topic Name in Arabic] — Score: XX/100
...

[Continue for all 10 topics]

## Seasonal Notes
[Any upcoming seasonal events that affect marketing in MENA]
- Ramadan dates and pre-Ramadan ad planning window
- Saudi National Day (September 23)
- UAE National Day (December 2)
- White Friday / Black Friday (November)
- Back to school season
- Summer sales

## Emerging Themes
[2-3 paragraph summary of broader trends observed across all sources]

## Recommended Blog Queue
Priority order for next 5 blog posts based on this scan:
1. [Arabic title] — [reason for priority]
2. [Arabic title] — [reason for priority]
3. [Arabic title] — [reason for priority]
4. [Arabic title] — [reason for priority]
5. [Arabic title] — [reason for priority]

## Raw Data Summary
| Source | Topics Found | Relevant to MENA |
|--------|-------------|------------------|
| Google Trends SA | X | X |
| Google Trends AE | X | X |
| r/marketing | X | X |
| r/digitalmarketing | X | X |
| r/SEO | X | X |
| r/PPC | X | X |
| r/socialmedia | X | X |
| r/ecommerce | X | X |
| r/content_marketing | X | X |
| **Total** | **X** | **X** |
```

## Integration with yalla-blog Skill

The output of this skill feeds directly into the `yalla-blog` skill. After generating the trends report:

1. The user can pick a topic from the ranked list
2. Pass it to the `yalla-blog` skill to generate a full 1800+ word Arabic blog post
3. The blog angle, keywords, and content type suggestions in this report provide a head start for the blog skill

## Notes

- Run this skill at least once per week to keep the blog content calendar fresh
- Google Trends data changes daily — the scan is a snapshot, not permanent
- Reddit engagement is a proxy for what marketers globally are talking about; always filter through the MENA relevance lens
- Some globally trending topics may not resonate in the Arab market and vice versa — the local intelligence layer is what makes this skill valuable
- All topic names in the output should be translated to Arabic, even if the source was English
