import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds-transformed.json"), "utf-8"));

const toURL = (id) => `https://www.avanza.se/_api/fund-reference/portfolio-data/${id}`;

const portfolioData = [];

for (const { Id } of funds) {
    console.log("fetching porfolio data for: " + Id);

    const response = await fetch(toURL(Id), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const fundData = await response.json();

    portfolioData.push(fundData);
}

writeFileSync(path.resolve(baseURL, "./assets/portfolio-data.json"), JSON.stringify(portfolioData, null, 4));
