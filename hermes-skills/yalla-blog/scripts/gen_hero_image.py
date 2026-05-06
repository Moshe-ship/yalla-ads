#!/usr/bin/env python3
"""Generate a Pollinations.ai hero image for a yalla-blog post.
Usage: python3 gen_hero_image.py <date> <topic_description>
Example: python3 gen_hero_image.py 2026-05-04 ecommerce dominance in the Arab world
"""
import sys, os, requests
from urllib.parse import quote

blog_dir = '/Users/majana-agent/Projects/yalla-ads'
os.chdir(blog_dir)

if len(sys.argv) < 3:
    print("Usage: python3 gen_hero_image.py <YYYY-MM-DD> <topic description>")
    sys.exit(1)

date_str = sys.argv[1]
topic = ' '.join(sys.argv[2:])

prompt = f'Dark propaganda style digital art about {topic}, dramatic red and gold lighting, ominous power, 16:9, cinematic, high contrast, dark background with orange accents'
encoded = quote(prompt, safe='')
url = f'https://image.pollinations.ai/prompt/{encoded}?width=1200&height=675&nologo=true&seed=42'

print(f'Fetching image for: {topic}')
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
resp = requests.get(url, headers=headers, timeout=120)

print(f'Status: {resp.status_code} | Size: {len(resp.content)} bytes | Type: {resp.headers.get("Content-Type", "?")}')

if len(resp.content) < 10240:
    print(f'ERROR: Image too small ({len(resp.content)} bytes). Response: {resp.content[:300]}')
    sys.exit(1)

hdr = resp.content[:4].hex()
valid = hdr.startswith(('ffd8', '89504e47'))
if not valid:
    print(f'ERROR: Not a valid image. Header: {hdr}')
    sys.exit(1)

output = f'public/blog-images/{date_str}.jpg'
os.makedirs('public/blog-images', exist_ok=True)
with open(output, 'wb') as f:
    f.write(resp.content)
print(f'Saved: {output} ({os.path.getsize(output)} bytes) ✓')
