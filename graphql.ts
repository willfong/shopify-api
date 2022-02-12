import Shopify from "@shopify/shopify-api";

const client = new Shopify.Clients.Graphql(`${process.env.SHOPIFY_NAME}.myshopify.com`, process.env.SHOPIFY_TOKEN);
if (!client) {
	console.log("Could not access Shopify");
	process.exit(1);
}

const queryGetPriceRules = `
{
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
}`;

const queryGetCodeDetails = `
query couponCode($id: ID!){
  codeDiscountNode(id: $id) {
    codeDiscount {
      ... on DiscountCodeBasic {
        title
        customerGets {
          appliesOnSubscription
          appliesOnOneTimePurchase
        }
      }
    }
  }
}
`;

const queryGetCouponId = `
query getCouponGid($code: String!){
  codeDiscountNodeByCode(code: $code) {
    id,
  }
}`;

const mutationCustomerGets = `mutation discountCodeBasicUpdate($basicCodeDiscount: DiscountCodeBasicInput!, $id: ID!) {
  discountCodeBasicUpdate(basicCodeDiscount: $basicCodeDiscount, id: $id) {
    codeDiscountNode {
      id
    }
  }
}
`;

const variables = {
	basicCodeDiscount: {
		customerGets: {
			appliesOnSubscription: true,
			appliesOnOneTimePurchase: true,
		},
	},
	id: "gid://shopify/DiscountCodeNode/1057750450414",
	code: "THANKS-RRFBCPH",
};

(async () => {
	try {
		const results = await client.query({
			data: { query: queryGetCouponId, variables },
		});
		console.log(JSON.stringify(results.body));
	} catch (err) {
		console.log("error");
		console.log(err);
	}
})();
