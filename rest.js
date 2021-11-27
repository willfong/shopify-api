import axios from "axios";
// https://www.shopify.com.sg/partners/blog/getting-started-with-graphql

const shopifyApi = axios.create({
    baseURL: `https://${process.env.SHOPIFY_NAME}.myshopify.com`,
    headers: {'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN}
});

const products_list = async () => {
    // https://shopify.dev/api/admin-rest/2021-10/resources/product#[get]/admin/api/2021-10/products.json
    const response = await shopifyApi("/admin/api/2021-10/products.json");
    return response.data.products;
}

const variants_modify = async (id, params) => {
    // https://shopify.dev/api/admin-rest/2021-10/resources/product-variant#[put]/admin/api/2021-10/variants/{variant_id}.json
    // variants_modify(123456, {compare_at_price: '100.00'});
    const data = {variant: {id, ...params}}
    const response = await shopifyApi.put(`/admin/api/2021-10/variants/${id}.json`, data);
    return response.data;
}

const discountCodes_lookup = async (code) => {
    const response = await shopifyApi("/admin/api/2021-07/discount_codes/lookup.json", {params: {code}});
    return response.data.discount_code;
}

const priceRules_list = async () => {
    const response = await shopifyApi(`/admin/api/2021-07/price_rules.json`);
    return response.data.price_rules;
}

const priceRules_details = async (id) => {
    const response = await shopifyApi(`/admin/api/2021-07/price_rules/${id}.json`);
    return response.data.price_rule;
}

const customerSavedSearches_lookup = async (id) => {
    const response = await shopifyApi(`/admin/api/2021-07/customer_saved_searches/${id}.json`);
    return response.data.customer_saved_search;
}

const orders_lookup = async (id) => {
    const response = await shopifyApi(`/admin/api/2021-07/orders/${id}.json`);
    return response.data.order;
    // Reponse: https://shopify.dev/api/admin/rest/reference/orders/order#show-2021-07

}

async function coupon_code_lookup() {
    const CODE = process.env.COUPON_CODE;
    const discountCode = await discountCodes_lookup(CODE);
    const priceRule = await priceRules_details(discountCode.price_rule_id);
    const customerSearch = await customerSavedSearches_lookup(priceRule.prerequisite_saved_search_ids);

    console.log(`
CODE: ${CODE}
- Usage: ${discountCode.usage_count}
- Created: ${discountCode.created_at}
- Updated: ${discountCode.updated_at}

Price Rule:
- Usage Limit: ${priceRule.usage_limit}
- Created: ${priceRule.created_at}
- Updated: ${priceRule.updated_at}

CustomerSearch Details:
- Query: ${customerSearch.query}
`);
    [].forEach(async (id) => {
        const order = await orders_lookup(id);
        console.log(`${id}: ${order.confirmed}`);
    })

}

async function variant_list() {
    let total = 0;
    const products = await products_list();
    for ( let product of products) {
        console.log(`${product['id']}: ${product['title']}`);
        for ( let v of product['variants']) {
            total++;
            console.log(`  ${v['title']} (${v['id']}): ${v['compare_at_price']} -> ${v['price']}`);
            // Revert discount
            if (v['compare_at_price']) {
                await variants_modify(v['id'], {compare_at_price: '', price: v['compare_at_price']});
            }

        }
    }
    console.log(`Total Variants: ${total}`);
}

const shopifyGraphQL = async (data) => {
    const a = axios.create({
        baseURL: `https://${process.env.SHOPIFY_NAME}.myshopify.com`,
        headers: {'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN, 'Content-Type': 'application/graphql'}
    });
    const response = await a.post('/admin/api/2021-07/graphql.json', data);
    // TODO: Error handling
    return response.data;
}

async function testGraphQL() {
    const queryString = `{
        priceRules(first: 10) {
        edges {
          node {
            id,
            createdAt,
            discountCodes(first: 10) {
              edges {
                node {
                  id
                  code
                }
              }
            }
          }
        }
      }
    }`
    const response = await shopifyGraphQL(queryString);
    console.log(JSON.stringify(response.data, null, 2));
}

const showDiscounts = async () => {
    const response = await priceRules_details(1057750450414);
    console.log(response);
}
//showDiscounts();
//testGraphQL();
variant_list();