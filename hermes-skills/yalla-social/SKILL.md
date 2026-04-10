---
name: yalla-social
description: Generate Arabic social media content for Instagram with bilingual hashtags and platform optimization
version: 1.0.0
author: Mousa Abu Mazin
license: MIT
platforms: [linux, macos]
prerequisites:
  commands: []
  env_vars: []
metadata:
  hermes:
    tags: [social-media, arabic, instagram, content, marketing, yalla-ads]
---
# Yalla Ads Social Media Content Generator

Generate Arabic social media content for Yalla Ads' Instagram account (@yallaadss). Supports multiple content formats with brand-consistent messaging and bilingual hashtags.

## Brand Guidelines (CRITICAL)

### Colors
- **Primary**: Orange (#E67E22)
- **Secondary**: Navy (#1B2E6E)
- **Accent**: White (#FFFFFF)
- **Background options**: Navy gradient, clean white, orange accent stripes

### Tone
- Professional yet approachable
- Confident, not arrogant
- Educational and value-driven
- Speaks to SMB owners and marketing managers in MENA
- Modern Standard Arabic for body text
- Brand slogan "منوصلك للزبون الصحيح" can be used as a tagline

### Visual Identity
- Play button triangle element in logo
- Glassmorphism design elements
- Clean, minimal layouts
- Arabic RTL text direction always

## Content Formats

### Format 1: Carousel Text (Slide Posts)

Generate text content for Instagram carousel posts (typically 5-10 slides).

**Structure:**
```
Slide 1 (Hook): Bold statement or question that stops scrolling
Slide 2-8 (Content): One key point per slide, short sentences
Slide 9 (Summary): Key takeaways
Slide 10 (CTA): Follow @yallaadss + website
```

**Rules:**
- Maximum 80 words per slide
- One idea per slide — do not cram
- Use Arabic numerals (١، ٢، ٣) for numbered lists
- Bold the key phrase or statistic on each slide
- Each slide should work standalone but flow as a story
- First slide must hook within 2 seconds of reading

**Example topic structure:**
```
Slide 1: "٩٠٪ من أصحاب المشاريع يخسرون ميزانيتهم الإعلانية — لا تكن منهم"
Slide 2: "السبب الأول: استهداف خاطئ"
Slide 3: [Explain targeting mistakes]
...
Slide 9: "الخلاصة: ٥ خطوات تحمي ميزانيتك"
Slide 10: "تابعنا @yallaadss | yalla-ads.com"
```

### Format 2: Story Captions

Generate caption text for Instagram Stories (text overlays and companion captions).

**Types:**
- **Quick tip**: one actionable marketing tip (under 30 words on-screen)
- **Poll/Question**: engagement-driving question with 2 options
- **Behind the scenes**: casual brand moment (still in MSA)
- **Stat of the day**: striking marketing statistic with source
- **Client win**: success metric celebration (anonymized)

**Rules:**
- On-screen text: maximum 30 words (stories are viewed fast)
- Use large, readable text against branded backgrounds
- Include sticker suggestions: poll, question box, quiz, countdown
- Every 3rd story should have a CTA (swipe up / link / DM)

**Output format for each story:**
```
Story [number]:
Type: [Quick tip / Poll / Stat / etc.]
On-screen text: "[Arabic text, 30 words max]"
Background: [Navy / Orange gradient / White]
Sticker: [Poll with options / Question box / Quiz / None]
Caption (if shared to feed): "[longer caption if applicable]"
CTA: [None / Swipe up to yalla-ads.com / DM us / etc.]
```

### Format 3: Reel Scripts

Generate scripts for short-form video Reels (30-60 seconds).

**Structure:**
```
Hook (0-3 sec): Pattern interrupt — bold claim or question
Problem (3-10 sec): Identify the pain point
Solution (10-25 sec): Teach the method/strategy
Proof (25-35 sec): Data point or quick case study
CTA (35-45 sec): Follow for more + visit yalla-ads.com
```

**Rules:**
- Total script: 100-180 words (spoken Arabic)
- Write it as spoken narration, not written text
- Still MSA but conversational register (formal but not stiff)
- Include on-screen text overlay suggestions for key moments
- Suggest background music mood (upbeat, corporate, dramatic)
- Include B-roll or visual suggestions for each segment

**Output format:**
```
Reel Title: "[Arabic title]"
Duration: [30s / 45s / 60s]
Music mood: [upbeat / corporate / dramatic / chill]

[Timecode] — [Segment]
Narration: "[spoken Arabic text]"
On-screen text: "[text overlay]"
Visual: [description of what should be shown]

[Repeat for each segment]

Caption: "[full Instagram caption with hashtags]"
```

### Format 4: Single Post Caption

Generate a caption for a single Instagram image or graphic post.

**Structure:**
```
Line 1: Hook (first line visible before "more")
Line 2-3: Value/insight (the meat of the post)
Line 4: CTA or question to drive comments
Line 5: [blank line]
Line 6: Hashtags
```

**Rules:**
- First line must be compelling (it's the only visible text before "...more")
- Total caption: 150-300 words
- End with a question to drive engagement
- Separate hashtags with a blank line

## Hashtag Strategy

Every post must include bilingual hashtags. Use this structure:

### Core Brand Hashtags (include on every post)
```
#يلا_ادز #YallaAds #تسويق_رقمي #DigitalMarketing
```

### Topic Hashtags (pick 5-8 relevant ones)

| Category | Arabic | English |
|----------|--------|---------|
| Google Ads | #إعلانات_قوقل #اعلانات_جوجل | #GoogleAds #PPC |
| SEO | #تحسين_محركات_البحث #سيو | #SEO #SearchEngine |
| Social Media | #سوشال_ميديا #وسائل_التواصل | #SocialMedia #SocialMediaMarketing |
| Content | #صناعة_المحتوى #محتوى_رقمي | #ContentMarketing #ContentCreation |
| E-commerce | #تجارة_الكترونية #متجر_الكتروني | #Ecommerce #OnlineStore |
| Business | #ريادة_اعمال #مشاريع | #Entrepreneurship #SmallBusiness |
| Saudi | #السعودية #رؤية_2030 | #SaudiArabia #Vision2030 |
| UAE | #الامارات #دبي | #UAE #Dubai |

### Location/Audience Hashtags (pick 3-5)
```
#تسويق_السعودية #تسويق_الامارات #اعلانات_رقمية
#MarketingTips #DigitalAgency #MENA
```

### Total Hashtags Per Post
- **Carousel/Single post**: 20-25 hashtags
- **Reel**: 15-20 hashtags
- **Story**: 3-5 hashtags (if any)

## Content Calendar Themes

When generating content, align with these weekly themes:

| Day | Theme | Content Type |
|-----|-------|-------------|
| Sunday | Marketing tip | Carousel or single post |
| Monday | Industry news / trends | Single post or reel |
| Tuesday | How-to tutorial | Carousel (educational) |
| Wednesday | Behind the brand | Story series |
| Thursday | Client results / case study | Single post or carousel |
| Friday | Engagement post (poll/question) | Story + post |
| Saturday | Weekend inspiration / motivation | Reel or single post |

## Execution Steps

1. **Determine format**: user specifies carousel, story, reel, or single post (or ask)
2. **Select topic**: use a trending topic from `yalla-trends` skill or user-provided topic
3. **Generate content**: write the content following the format-specific rules above
4. **Add hashtags**: compile bilingual hashtag set following the strategy
5. **Output**: present the final content in a clean, copy-paste ready format
6. **Batch option**: if the user asks, generate a full week of content (7 posts) following the calendar themes

## Output Template

For every piece of content generated, output:

```markdown
## [Format Type]: [Topic in Arabic]

**Platform:** Instagram (@yallaadss)
**Format:** [Carousel / Story / Reel / Single Post]
**Posting day:** [Suggested day based on calendar]
**Topic:** [Arabic topic name]

---

[Full content in the format-specific structure]

---

**Hashtags:**
[Full bilingual hashtag block]

**Design notes:**
- Primary color: Orange (#E67E22) or Navy (#1B2E6E) background
- [Any specific visual suggestions]
- [Font/layout notes]
```

## Notes

- All Arabic text must be RTL-ready and use Arabic quotation marks (« ») where appropriate
- Numbers can use either Arabic (١٢٣) or Western (123) numerals depending on context — use Arabic numerals for lists and rankings, Western for statistics and data
- Keep content educational and value-driven — avoid hard sells
- Reference the yalla-ads.com website and @yallaadss handle in CTAs
- For carousel posts, suggest when to reuse content as Reels or Stories
- Seasonal content (Ramadan, Eid, Saudi National Day, UAE National Day, White Friday) should be flagged and prioritized when those dates are within 4 weeks
