import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds-transformed.json"), "utf-8"));

console.log(funds);

const toURL = (id) => `https://www.avanza.se/_api/fund-guide/chart/${id}/infinity`;

const datapoints = [];

for (const { Id } of funds) {
    console.log("fetching datapoints for: " + Id);

    const response = await fetch(toURL(Id), {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const fundData = await response.json();

    datapoints.push(fundData);
}

writeFileSync(path.resolve(baseURL, "./assets/datapoints.json"), JSON.stringify(datapoints, null, 4));
