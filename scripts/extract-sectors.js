import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const portfolios = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/portfolio-data.json"), "utf-8"));
const toFunds = {};

for (const { sectorChartData, id } of portfolios) {
    for (const { name } of sectorChartData) {
        if (toFunds[name] === undefined) {
            toFunds[name] = [id];
        } else {
            toFunds[name].push(id);
        }
    }
}

writeFileSync(path.resolve(baseURL, "./assets/sectors.json"), JSON.stringify(Object.keys(toFunds), null, 4));
writeFileSync(path.resolve(baseURL, "./assets/sectors-funds.json"), JSON.stringify(toFunds, null, 4));
