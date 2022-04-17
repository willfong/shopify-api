import * as REST from "./rest.js";

let total = 0;
const products = await REST.products_list();
for (let product of products) {
	console.log(`${product["id"]}: ${product["title"]}`);
	for (let v of product["variants"]) {
		total++;
		console.log(`  ${v["title"]} (${v["id"]}): ${v["compare_at_price"]} -> ${v["price"]}`);
		// Revert discount
		/*
		if (v["compare_at_price"]) {
			await variants_modify(v["id"], { compare_at_price: "", price: v["compare_at_price"] });
		}
    */
	}
}
console.log(`Total Variants: ${total}`);
