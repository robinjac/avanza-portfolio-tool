import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds.json"), "utf-8"));

// Select only these fields from the complete data
const fields = [
    "orderbookId",
    "isin",
    "name",
    "rating",
    "risk",
    "developmentOneDay",
    "developmentOneWeek",
    "developmentOneMonth",
    "developmentThreeMonths",
    "developmentOneYear",
    "developmentThisYear",
    "developmentThreeYears",
    "developmentFiveYears",
    "developmentTenYears",
    "totalFee",
    "nrOfOwners",
    "companyName",
    "category",
    "primaryBenchmark",
    "sharpeRatio",
    "standardDeviation",
];

const toLabel = {
    orderbookId: "Id",
    isin: "ISIN",
    name: "Name",
    rating: "Rating",
    risk: "Risk",
    developmentOneDay: "1 Day",
    developmentOneWeek: "1 Week",
    developmentOneMonth: "1 Month",
    developmentThreeMonths: "3 Months",
    developmentOneYear: "1 Year",
    developmentThisYear: "This Year",
    developmentThreeYears: "3 Years",
    developmentFiveYears: "5 Years",
    developmentTenYears: "10 Years",
    sharpeRatio: "Sharpe",
    standardDeviation: "StdDev",
    primaryBenchmark: "Benchmark",
    totalFee: "Fee",
    nrOfOwners: "Owners",
    category: "Category",
    companyName: "Company",
};

const numeric = [
    "1 Day",
    "1 Week",
    "1 Month",
    "3 Months",
    "1 Year",
    "This Year",
    "3 Years",
    "5 Years",
    "10 Years",
    "Sharpe",
    "StdDev",
    "Fee",
    "Owners",
    "Rating",
    "Risk",
];

const fundsTransformed = funds.map((fund) => {
    return Object.keys(fund)
        .filter((key) => fields.includes(key))
        .reduce(
            (obj, key) => {
                const label = toLabel[key];
                if (numeric.includes(label)) {
                    obj.Data[label] = fund[key];
                } else {
                    obj[label] = fund[key];
                }
                return obj;
            },
            { Data: {} }
        );
});

writeFileSync(path.resolve(baseURL, "./assets/funds-transformed.json"), JSON.stringify(fundsTransformed, null, 4));
