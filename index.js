require('dotenv').config()
const axios = require('axios');
const shopifyApi = axios.create({
    baseURL: `https://${process.env.SHOPIFY_NAME}.myshopify.com`,
    headers: {'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN}
});

const discountCodes_lookup = async (code) => {
    const response = await shopifyApi("/admin/api/2021-07/discount_codes/lookup.json", {params: {code}});
    return response.data.discount_code;
    /*
    {
        id: XXX,
        price_rule_id: YYY,
        code: 'ZZZ',
        usage_count: 12,
        created_at: '2021-06-08T18:54:46+02:00',
        updated_at: '2021-06-10T00:15:25+02:00'
    }
    */
}

const priceRules_details = async (id) => {
    const response = await shopifyApi(`/admin/api/2021-07/price_rules/${id}.json`);
    return response.data.price_rule;
    /*
    {
        id: XX,
        value_type: 'percentage',
        value: '-20.0',
        customer_selection: 'prerequisite',
        target_type: 'line_item',
        target_selection: 'entitled',
        allocation_method: 'across',
        allocation_limit: null,
        once_per_customer: true,
        usage_limit: 8,
        starts_at: '2021-06-08T18:54:45+02:00',
        ends_at: null,
        created_at: '2021-06-08T18:54:45+02:00',
        updated_at: '2021-06-10T00:15:27+02:00',
        entitled_product_ids: [],
        entitled_variant_ids: [],
        entitled_collection_ids: [ ZZZ ],
        entitled_country_ids: [],
        prerequisite_product_ids: [],
        prerequisite_variant_ids: [],
        prerequisite_collection_ids: [],
        prerequisite_saved_search_ids: [ ZZZ ],
        prerequisite_customer_ids: [],
        prerequisite_subtotal_range: { greater_than_or_equal_to: '25.0' },
        prerequisite_quantity_range: null,
        prerequisite_shipping_price_range: null,
        prerequisite_to_entitlement_quantity_ratio: { prerequisite_quantity: null, entitled_quantity: null },
        prerequisite_to_entitlement_purchase: { prerequisite_amount: null },
        title: 'YYY',
        admin_graphql_api_id: 'gid://shopify/PriceRule/ZZZ'
    }
    */
}

const customerSavedSearches_lookup = async (id) => {
    const response = await shopifyApi(`/admin/api/2021-07/customer_saved_searches/${id}.json`);
    return response.data.customer_saved_search;
    /*
    {
        id: XXX,
        name: 'New (ReferralCandy DO NOT DELETE)',
        created_at: '2019-09-16T09:52:32+02:00',
        updated_at: '2019-09-16T09:52:32+02:00',
        query: 'orders_count:0'
    }
    */
}


async function main() {
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
}
main()