import axios from "axios";
const shopifyApi = axios.create({
    baseURL: `https://${process.env.SHOPIFY_NAME}.myshopify.com`,
    headers: {'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN}
});

const products_list = async () => {
    // https://shopify.dev/api/admin-rest/2021-10/resources/product#[get]/admin/api/2021-10/products.json
    const response = await shopifyApi("/admin/api/2021-10/products.json");
    return response.data.products;
}

const variants_modify = async(id, params) => {
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
        }
    }
    console.log(`Total Variants: ${total}`);
}
