# Shopify API Explorer

Tools for exploring the Shopify API 

`.env`
```
SHOPIFY_TOKEN=6f...c4
SHOPIFY_NAME=mycoolstore
COUPON_CODE=FREESHIPPING
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