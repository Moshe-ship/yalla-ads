#!/bin/bash
set -e
cd "$(dirname "$0")"
BLOG_DIR="src/content/blog"
DATE=$(date +%Y-%m-%d)
SHARED="$HOME/Projects/shared"
DRY_RUN="${1:-}"
mkdir -p "$BLOG_DIR"

git log --oneline --since="$DATE" | grep -q "blog:" && echo "Already published today." && exit 0

echo "[$DATE] Generating Yalla Ads Arabic blog via local LLM..."
PROMPT="Write a complete Arabic SEO blog post in markdown for yalla-ads.com (يلا ادز).

Rules:
- Write ENTIRELY in Arabic (فصحى واضحة وسهلة)
- Topic: digital marketing for Arab businesses (SEO, Google Ads, social media)
- Target: business owners in Saudi Arabia, UAE, Egypt, Jordan
- 1800+ words
- Include h2/h3 Arabic headers
- Real statistics and actionable Arabic advice
- End with CTA for يلا ادز
- Start with frontmatter:
---
title: \"عنوان عربي\"
description: \"وصف عربي 120-160 حرف\"
date: \"$DATE\"
author: \"يلا ادز\"
image: \"/blog-images/$DATE.jpg\"
tags: [\"تسويق رقمي\", \"سيو\"]
---

LAST LINE: IMAGE_QUERY: english search terms for stock photo

Write the complete Arabic post now."

RESULT=$(python3 "$SHARED/generate_blog.py" "$PROMPT" 2>/dev/null)
[ -z "$RESULT" ] && echo "ERROR: Empty response" && exit 1

IMAGE_QUERY=$(echo "$RESULT" | grep "^IMAGE_QUERY:" | sed 's/IMAGE_QUERY: *//')
[ -z "$IMAGE_QUERY" ] && IMAGE_QUERY="arabic digital marketing social media"
RESULT=$(echo "$RESULT" | grep -v "^IMAGE_QUERY:")

IMAGE_PATH="/tmp/yalla_blog_$DATE.jpg"
python3 "$SHARED/fetch_image.py" "$IMAGE_QUERY" "$IMAGE_PATH" yallaads 2>/dev/null
if [ -f "$IMAGE_PATH" ] && [ -s "$IMAGE_PATH" ]; then
  mkdir -p public/blog-images
  cp "$IMAGE_PATH" "public/blog-images/$DATE.jpg"
fi

SLUG="blog-$DATE"

if [ "$DRY_RUN" = "--dry-run" ]; then
  WORDS=$(echo "$RESULT" | wc -w | tr -d ' ')
  echo "DRY RUN — Slug: $SLUG"
  echo "Words: ~$WORDS"
  echo "Image: $(ls -lh "$IMAGE_PATH" 2>/dev/null | awk '{print $5}')"
  echo "$RESULT" | head -5
  exit 0
fi

echo "$RESULT" > "$BLOG_DIR/$SLUG.md"
git add "$BLOG_DIR/$SLUG.md" public/blog-images/ 2>/dev/null || true
git commit -m "blog: $SLUG"
git push origin main
echo "PUBLISHED: $SLUG"
