import * as REST from "./rest.js";

let total = 0;
const products = await REST.products_list();
for (let product of products) {
	console.log(`${product["id"]}: ${product["title"]}`);
	for (let v of product["variants"]) {
		total++;
		const discountedPrice = v["price"] * 0.8;
		console.log(`  ${v["title"]} (${v["id"]}): ${v["price"]} -> ${discountedPrice}`);

		//await variants_modify(v["id"], { compare_at_price: v["price"], price: v["compare_at_price"] });
	}
}
console.log(`Total Variants: ${total}`);
