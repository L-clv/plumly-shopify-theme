# Plumly Shopify Theme

A custom Shopify Online Store 2.0 theme forked from [Shopify Horizon](https://github.com/Shopify/horizon), extended with Shrine-style conversion features (free-shipping progress, product badges, trust badges, FAQ blocks, icon features, discount popup).

## Tech

- Shopify Online Store 2.0 (sections + blocks + JSON templates)
- Liquid + vanilla JS modules (no build step)
- Horizon design system (CSS variables, color schemes, typography tokens)

## Local development

```bash
# One-time install
npm install -g @shopify/cli @shopify/theme

# Start hot-reload dev server against the dev store
shopify theme dev --store=plumlydev.myshopify.com
```

The first run opens a browser for Partner-account authentication. After that, file saves auto-reload the preview at `http://127.0.0.1:9292`.

## Common commands

```bash
shopify theme dev --store=plumlydev.myshopify.com   # hot-reload preview
shopify theme push --store=plumlydev.myshopify.com  # upload local -> Shopify
shopify theme pull --store=plumlydev.myshopify.com  # download remote -> local
shopify theme check                                 # lint
```

## Repo structure

```
layout/      Page wrapper (theme.liquid)
templates/   JSON page compositions (product.json, index.json, ...)
sections/    Top-level customizable modules
blocks/      Reusable, schema-driven theme blocks
snippets/    Reusable Liquid fragments (no schema)
assets/      CSS/JS/SVG static files
config/      Theme settings schema + saved settings
locales/     Translations
```

## Plumly extensions on top of Horizon

| Feature | Files |
|---|---|
| Free-shipping progress bar | `snippets/cart-shipping-progress.liquid`, `assets/cart-shipping-progress.js` |
| Product corner badges | `snippets/product-badges.liquid` |
| Trust / payment badges section | `sections/trust-badges.liquid` |
| Icon feature blocks section | `sections/icon-features.liquid` |
| FAQ section (metaobject-driven) | `sections/faq.liquid` |
| Newsletter discount popup | `sections/newsletter-popup.liquid`, `assets/newsletter-popup.js` |

## Updating from upstream Horizon

```bash
git fetch upstream
git merge upstream/main
```

## Distribution to production store

1. Create a `production` branch
2. Connect Shopify production store to the GitHub repo (Online Store -> Themes -> Connect from GitHub)
3. Merge `main` -> `production` to deploy
