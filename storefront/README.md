# Tide & Bloom Storefront

This folder contains the current static storefront prototype.

## Pages

- `index.html` — brand homepage
- `amalfi.html` — Amalfi Citrus Club collection page

## Local Preview

Open `index.html` directly in a browser, or serve this folder with a local static server.

Examples:

```bash
python3 -m http.server 8000 --directory storefront
```

Then visit `http://localhost:8000`.

## Data Sources

- Collection definitions: `../collections/collections.json`
- Product catalog: `../production/product-catalog.json`
- Amalfi product-to-artwork mapping: `../collections/01-amalfi-citrus-club/product-asset-map.json`

## Image Placement

Approved website images should be stored under:

```text
storefront/assets/collections/amalfi-citrus-club/
```

Recommended naming:

```text
hero-desktop.webp
hero-mobile.webp
product-<handle>-front.webp
product-<handle>-back.webp
product-<handle>-detail.webp
product-<handle>-lifestyle.webp
```

Do not place regenerated approximations into this folder. Mockups must be produced from the exact approved source assets listed in the collection manifest.

## Deployment

The GitHub Pages workflow publishes the `storefront` directory whenever changes are pushed to `main`. GitHub Pages must be configured to use **GitHub Actions** in repository Settings → Pages.
