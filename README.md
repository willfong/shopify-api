# Shopify API Explorer

Tools for exploring the Shopify API

## Getting Started

If you need a Shopify access token, see the Oauth section.

Add the functions you need to `index.js` file and modify the last line on what you want to run.

## Set up

Example `.env` file:

```
SHOPIFY_TOKEN=6f...c4
SHOPIFY_NAME=mycoolstore
COUPON_CODE=FREESHIPPING

SHOPIFY_APP_API_KEY=384...132
SHOPIFY_APP_API_SECRET=shpss_0d7...39d
SHOPIFY_APP_API_SCOPE=read_products,write_products
```

## Shopify OAuth

Make sure to have the app variables set up in `.env`:

```
SHOPIFY_APP_API_KEY=384...132
SHOPIFY_APP_API_SECRET=shpss_0d7...39d
SHOPIFY_APP_API_SCOPE=read_products,write_products
```

1. Create a new app
1. Run `yarn server`
1. Set the App URL to: `http://localhost:3000/oauth/authorize`
1. Set the Allowed redirection URL to: `http://localhost:3000/oauth/callback`
1. Use the Merchant Install Link to install the app. It looks like: `https://<shop>.myshopify.com/admin/oauth/install_custom_app?client_id=<redact>&signature=<redact>`
1. The link will redirect you to Shopify to authorize.
1. After authorization, it will redirect the browser back to the `/oauth/callback` route with a code.
1. The `/oauth/callback` route will call Shopify again to exchange the code for an access token.
1. The access token will be displayed in the browser and console log
