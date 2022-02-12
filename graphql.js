"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError("Generator is already executing.");
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
exports.__esModule = true;
var shopify_api_1 = require("@shopify/shopify-api");
var client = new shopify_api_1["default"].Clients.Graphql(
	process.env.SHOPIFY_NAME + ".myshopify.com",
	process.env.SHOPIFY_TOKEN
);
if (!client) {
	console.log("Could not access Shopify");
	process.exit(1);
}
var queryGetPriceRules =
	"\n{\n  priceRules(first: 10) {\n    edges {\n      node {\n        id,\n        createdAt,\n        discountCodes(first: 10) {\n          edges {\n            node {\n              id\n              code\n            }\n          }\n        }\n      }\n    }\n  }\n}";
var queryGetCodeDetails =
	"\nquery couponCode($id: ID!){\n  codeDiscountNode(id: $id) {\n    codeDiscount {\n      ... on DiscountCodeBasic {\n        title\n        customerGets {\n          appliesOnSubscription\n          appliesOnOneTimePurchase\n        }\n      }\n    }\n  }\n}\n";
var queryGetCouponId =
	"\nquery getCouponGid($code: String!){\n  codeDiscountNodeByCode(code: $code) {\n    id,\n  }\n}";
var mutationCustomerGets =
	"mutation discountCodeBasicUpdate($basicCodeDiscount: DiscountCodeBasicInput!, $id: ID!) {\n  discountCodeBasicUpdate(basicCodeDiscount: $basicCodeDiscount, id: $id) {\n    codeDiscountNode {\n      id\n    }\n  }\n}\n";
var variables = {
	basicCodeDiscount: {
		customerGets: {
			appliesOnSubscription: true,
			appliesOnOneTimePurchase: true,
		},
	},
	id: "gid://shopify/DiscountCodeNode/1057750450414",
	code: "THANKS-RRFBCPH",
};
(function () {
	return __awaiter(void 0, void 0, void 0, function () {
		var results, err_1;
		return __generator(this, function (_a) {
			switch (_a.label) {
				case 0:
					_a.trys.push([0, 2, , 3]);
					return [
						4 /*yield*/,
						client.query({
							data: { query: queryGetCouponId, variables: variables },
						}),
					];
				case 1:
					results = _a.sent();
					//console.log(results.body);
					console.log(JSON.stringify(results.body.data.codeDiscountNodeByCode.id));
					return [3 /*break*/, 3];
				case 2:
					err_1 = _a.sent();
					console.log("error");
					console.log(err_1);
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
})();
/*
// https://github.com/Shopify/shopify-node-api/issues/212
const graphqlResponse = await client.query({
  data: {
    query: `query myTestQuery($first: Int) {
      products (first: $first) {
        edges {
          node {
            id
            title
            descriptionHtml
          }
        }
      }
    }`,
    variables: {
      first: 10,
    },
  }
});
*/
