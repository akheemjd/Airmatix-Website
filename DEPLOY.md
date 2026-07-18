# Airmatix — deploy notes (rebuild batch 2)

WHAT'S HERE
  index.html                          rebuilt homepage (form upgraded: POST + honeypot)
  services/<5 slugs>/index.html       SEO service pages = your Google Ads landing pages
  lp/volumetrics/index.html           stripped ad LP (noindex) = Meta / aggressive campaigns
  thanks/index.html                   post-submit page — conversion tags fire here
  sitemap.xml, robots.txt             robots blocks /lp/, /thanks/, /api/
  lead-worker.js                      OPTIONAL /api/lead endpoint (see file header)

DEPLOY
  Drop everything except lead-worker.js into your Worker's static assets,
  same structure. /about/, /contact/ and the /services/ index keep the old
  design until the next batch. Forms work day one via mailto fallback;
  wire lead-worker.js when ready for real submits.

BEFORE ADS GO LIVE
  1. Conversion tags on /thanks/ — Zaraz: GA4 + Google Ads + Meta Pixel.
  2. Google campaigns -> /services/... pages. Meta campaigns -> /lp/volumetrics/.
  3. Meta requires a privacy policy link on pages collecting lead data —
     /privacy/ doesn't exist yet. Needed before Meta lead campaigns.
  4. Still open: phone number (call conversions), insurance wording in FAQ.
