# Shopify API Explorer

Tools for exploring the Shopify API

`.env`

```
SHOPIFY_TOKEN=6f...c4
SHOPIFY_NAME=mycoolstore
COUPON_CODE=FREESHIPPING

SHOPIFY_APP_API_KEY=384...132
SHOPIFY_APP_API_SECRET=shpss_0d7...39d
SHOPIFY_APP_API_SCOPE=read_products,write_products
```

Example output:

```
➜  shopify-api git:(main) node index.js

CODE: FREESHIPPING
- Usage: 12
- Created: 2021-06-08T18:54:46+02:00
- Updated: 2021-06-10T00:15:25+02:00

Price Rule:
- Usage Limit: 8
- Created: 2021-06-08T18:54:45+02:00
- Updated: 2021-06-10T00:15:27+02:00

CustomerSearch Details:
- Query: orders_count:0

➜  shopify-api git:(main)
```

## Shopify OAuth

Make sure to have the app variables set up in `.env`:

```
SHOPIFY_APP_API_KEY=384...132
SHOPIFY_APP_API_SECRET=shpss_0d7...39d
SHOPIFY_APP_API_SCOPE=read_products,write_products
```

1. Create a new app
1. Set the App URL to: `http://localhost:3000/oauth/authorize`
1. Set the Allowed redirection URL to: `http://localhost:3000/oauth/callback`
1. Use the Merchant Install Link to install the app. It looks like: `https://<shop>.myshopify.com/admin/oauth/install_custom_app?client_id=<redact>&signature=<redact>`
1. The link will redirect you to Shopify to authorize.
1. After authorization, it will redirect the browser back to the `/oauth/callback` route with a code.
1. The `/oauth/callback` route will call Shopify again to exchange the code for an access token.
1. The access token will be displayed in the browser and console log
