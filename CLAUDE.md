# CLAUDE.md — Yalla Ads يلا ادز

## What This Is
Arabic-first digital marketing agency website for yalla-ads.com. Targets Middle East market.

## Stack
- **Astro 6** static site, full Arabic RTL
- **Deploy:** Same pipeline as PMax (GitHub Actions + FTP to Hostinger) — needs setup
- **Domain:** yalla-ads.com

## Key Commands
```bash
npm run dev          # Local dev server
npm run build        # Build to dist/
```

## Branding
- Colors: Orange (#E67E22) + Navy (#1B2E6E)
- Play button triangle in logo
- Glassmorphism design, dark/light toggle
- Slogan: يلا ادز - منوصلك للزبون الصحيح
- Dialect: Mix of Shami + Khaleeji
- Instagram: @yallaadss

## Services
- Google Ads / إعلانات قوقل
- SEO / تحسين محركات البحث
- Social Media Management (main focus) / إدارة وسائل التواصل الاجتماعي
- Lead Generation / جذب العملاء
- Content Creation / صناعة المحتوى
- NO "Near Me" package (that's PMax only)

## Blog
- 7 Arabic posts in `src/content/blog/`
- Same auto-publishing model as PMax

## What's Left
- [ ] GitHub Actions auto-deploy pipeline
- [ ] Connect domain to Hostinger
- [ ] Arabic blog schedule
