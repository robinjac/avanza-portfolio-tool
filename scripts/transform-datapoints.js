import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const data = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/datapoints.json"), "utf-8"));

// Select only these fields from the complete data
const fields = ["dataSerie", "id", "fromDate", "toDate"];

const toLabel = {
    id: "id",
    dataSerie: "data",
    fromDate: "from",
    toDate: "to",
};

const transformed = data.map((p) => {
    return Object.keys(p)
        .filter((key) => fields.includes(key))
        .reduce((obj, key) => {
            obj[toLabel[key]] = p[key];
            return obj;
        }, {});
});

writeFileSync(path.resolve(baseURL, "./assets/datapoints-transformed.json"), JSON.stringify(transformed, null, 4));
