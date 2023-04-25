import { readFileSync } from "node:fs";
import path from "node:path";

const filePath = process.argv[2];

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, filePath), "utf-8"));

console.log("Number of funds: " + funds.length);
