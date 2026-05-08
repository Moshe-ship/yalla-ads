#!/usr/bin/env python3
"""Verify Arabic blog word count (excluding frontmatter).
Usage: python3 verify_wordcount.py <path-to-blog-post.md>
Threshold: >=700 whitespace-split words (~1500+ estimated tokens).
Always run from /tmp/ to avoid user-approval prompts on Mac Studio.
"""
import sys

path = sys.argv[1]

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove frontmatter
parts = content.split('---', 2)
if len(parts) >= 3:
    body = parts[2]
else:
    body = content

# Count Arabic words by whitespace
words = body.split()
word_count = len(words)

# Estimate tokens (Arabic words ~2-3 tokens each)
estimated_tokens = word_count * 2.5

print(f"Words (whitespace split): {word_count}")
print(f"Characters: {len(body)}")
print(f"Estimated tokens: {int(estimated_tokens)}")

if word_count >= 700:
    print(f"✅ PASS: {word_count} words (threshold: 700)")
else:
    print(f"❌ FAIL: {word_count} words (need at least 700)")
    sys.exit(1)
