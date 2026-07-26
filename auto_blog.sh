#!/bin/bash
set -e
# ERR-TRAP-v1
trap 'ec=$?; echo "[ERR] exit=$ec line=$LINENO cmd=${BASH_COMMAND}" >&2; exit $ec' ERR
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
- Add 2-3 relevant internal links inside the body using markdown to other يلا ادز topics where natural, e.g. [نص عربي](/blog/other-topic-slug) — link on descriptive Arabic anchor text, never 'اضغط هنا'.
- End with CTA for يلا ادز
- TAGS: pick EXACTLY 2-3 tags, using the EXACT Arabic words from THIS fixed list ONLY (so posts interlink by topic): تسويق رقمي | سيو | إعلانات جوجل | سوشيال ميديا | تسويق بالمحتوى | تجارة إلكترونية | تسويق بالبريد الإلكتروني | إعلانات ممولة | تحليلات | العلامة التجارية
- Start with frontmatter:
---
title: \"عنوان عربي\"
description: \"وصف عربي 120-160 حرف\"
date: \"$DATE\"
author: \"يلا ادز\"
image: \"/blog-images/$DATE.jpg\"
tags: [\"تسويق رقمي\", \"سيو\"]
---

SECOND-TO-LAST LINE: SLUG: a short English URL slug for this post (lowercase, hyphens only, 3-6 keywords describing the topic in English, e.g. google-ads-for-restaurants)
LAST LINE: IMAGE_QUERY: english search terms for stock photo

Write the complete Arabic post now."

RESULT=$(python3 "$SHARED/generate_blog.py" "$PROMPT" 2>/dev/null)
[ -z "$RESULT" ] && echo "ERROR: Empty response" && exit 1

IMAGE_QUERY=$(echo "$RESULT" | grep "^IMAGE_QUERY:" | sed 's/IMAGE_QUERY: *//')
[ -z "$IMAGE_QUERY" ] && IMAGE_QUERY="arabic digital marketing social media"
RESULT=$(echo "$RESULT" | grep -v "^IMAGE_QUERY:")

# Title-based English slug from the LLM (Arabic titles don't make clean URLs).
SLUG=$(echo "$RESULT" | grep -m1 "^SLUG:" | sed 's/SLUG: *//' | tr '[:upper:]' '[:lower:]' | tr -cd 'a-z0-9- ' | tr ' ' '-' | sed 's/--*/-/g;s/^-//;s/-$//' | cut -c1-60)
RESULT=$(echo "$RESULT" | grep -v "^SLUG:")
[ -z "$SLUG" ] && SLUG="yalla-$DATE"

# Per-slug image path (kills the date-keyed duplicate-image bug — every post its own picture).
IMAGE_PATH="/tmp/yalla_blog_$SLUG.jpg"
python3 "$SHARED/fetch_image.py" "$IMAGE_QUERY" "$IMAGE_PATH" yallaads 2>/dev/null
if [ -f "$IMAGE_PATH" ] && [ -s "$IMAGE_PATH" ]; then
  mkdir -p public/blog-images
  cp "$IMAGE_PATH" "public/blog-images/$SLUG.jpg"
fi
# Rewrite the frontmatter image path from the date-keyed default to the per-slug file.
RESULT=$(printf '%s' "$RESULT" | sed "s|/blog-images/${DATE}\.jpg|/blog-images/${SLUG}.jpg|g")

if [ "$DRY_RUN" = "--dry-run" ]; then
  WORDS=$(echo "$RESULT" | wc -w | tr -d ' ')
  echo "DRY RUN — Slug: $SLUG"
  echo "Words: ~$WORDS"
  echo "Image: $(ls -lh "$IMAGE_PATH" 2>/dev/null | awk '{print $5}')"
  echo "$RESULT" | head -5
  exit 0
fi

echo "$RESULT" > "$BLOG_DIR/$SLUG.md"
# --- Frontmatter validation guard (hardening after blog-2026-04-12 incident) ---
MIN_BLOG_WORDS=150 bash ~/Projects/shared/validate_blog_frontmatter.sh $BLOG_DIR/$SLUG.md || {
    echo "  FAIL: frontmatter validation rejected the generated post, not committing"
    exit 9
}

git add "$BLOG_DIR/$SLUG.md" public/blog-images/ 2>/dev/null || true
git commit -m "blog: $SLUG"
git push origin main
echo "PUBLISHED: $SLUG"

# ── Self-scoring (appended by session 2026-04-13) ─────────────────────────────
# After successful publish, submit the blog body to the content review webhook.
selfscore_blog() {
  local source_name="$1"
  local slug="$2"
  local body_file="$3"
  local word_count="$4"

  [ -f "$body_file" ] || return 0
  [ -f "$HOME/.webhook_token" ] || return 0

  local token payload rid response status
  token=$(cat "$HOME/.webhook_token")
  payload=$(python3 -c "
import json, sys
body = open(sys.argv[1]).read()
print(json.dumps({
    'keyword': sys.argv[2],
    'article': body,
    'word_count': int(sys.argv[3]),
    'seo_score': 0,
    'title_tag': '',
    'meta_description': '',
    'source': sys.argv[4] + '-selfscore',
}))
" "$body_file" "$slug" "$word_count" "$source_name")

  rid="${source_name}-selfscore-$(date +%Y%m%d-%H%M%S)"
  response=$(curl -sf -X POST "http://100.118.222.70:7438/review" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -H "X-Request-ID: $rid" \
    -d "$payload" 2>/dev/null || echo "{}")
  status=$(echo "$response" | python3 -c "import sys,json;print(json.load(sys.stdin).get(\"status\",\"unknown\"))" 2>/dev/null || echo "error")
  echo "  selfscore: status=$status request_id=$rid"
}

# Run self-score on the published blog (non-fatal on error)
selfscore_blog "yalla" "$SLUG" "$BLOG_DIR/$SLUG.md" "$(wc -w < "$BLOG_DIR/$SLUG.md" | tr -d ' ')" || true
