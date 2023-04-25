import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();
const trim = (cat) => cat.trim();
const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds-transformed.json"), "utf-8"));
const toCategories = {};
const toFunds = {};

for (const { Id, Category } of funds) {
    const categories = Category.split(",").map(trim);

    for (const category of categories) {
        if (toFunds[category] === undefined) {
            toFunds[category] = [Id];
        } else {
            toFunds[category].push(Id);
        }
    }

    toCategories[Id] = categories;
}

writeFileSync(path.resolve(baseURL, "./assets/categories.json"), JSON.stringify(Object.keys(toFunds), null, 4));
writeFileSync(path.resolve(baseURL, "./assets/categories-funds.json"), JSON.stringify(toFunds, null, 4));
writeFileSync(path.resolve(baseURL, "./assets/funds-categories.json"), JSON.stringify(toCategories, null, 4));
