import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds.json"), "utf-8"));
const fundToCategories = {};
const categoryToFunds = {};

for (const fund of funds) {
    const categories = fund.category.split(",").map((cat) => cat.trim());

    for (const category of categories) {
        categoryToFunds[category] = [];
    }

    fundToCategories[fund.orderbookId] = categories;
}

const categoryLabels = Object.keys(categoryToFunds);

for (const category of categoryLabels) {
    for (const fund of funds) {
        if (fundToCategories[fund.orderbookId].includes(category)) {
            categoryToFunds[category].push(fund.orderbookId);
        }
    }
}

writeFileSync(path.resolve(baseURL, "./assets/categories.json"), JSON.stringify(categoryLabels, null, 4));
writeFileSync(path.resolve(baseURL, "./assets/categories-funds.json"), JSON.stringify(categoryToFunds, null, 4));
writeFileSync(path.resolve(baseURL, "./assets/funds-categories.json"), JSON.stringify(fundToCategories, null, 4));
