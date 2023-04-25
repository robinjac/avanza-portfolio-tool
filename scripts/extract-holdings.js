import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const portfolios = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/portfolio-data.json"), "utf-8"));
const toFunds = {};
const toFundsBuyable = {};

for (const { holdingChartData, id } of portfolios) {
    for (const { name, orderbookId, y, previousY, deltaRank } of holdingChartData) {
        const holding = {
            fundId: id,
            id: orderbookId,
            y,
            y0: previousY,
            delta: deltaRank,
        };

        if (toFunds[name] === undefined) {
            toFunds[name] = [holding];
        } else {
            toFunds[name].push(holding);
        }

        if (holding.id) {
            if (toFundsBuyable[name] === undefined) {
                toFundsBuyable[name] = [holding];
            } else {
                toFundsBuyable[name].push(holding);
            }
        }
    }
}

writeFileSync(path.resolve(baseURL, "./assets/holdings.json"), JSON.stringify(Object.keys(toFunds), null, 4));
writeFileSync(
    path.resolve(baseURL, "./assets/holdings-buyable.json"),
    JSON.stringify(Object.keys(toFundsBuyable), null, 4)
);
writeFileSync(path.resolve(baseURL, "./assets/holdings-funds.json"), JSON.stringify(toFunds, null, 4));
