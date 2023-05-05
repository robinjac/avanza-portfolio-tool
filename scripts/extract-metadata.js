import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

const funds = JSON.parse(readFileSync(path.resolve(baseURL, "./assets/funds-transformed.json"), "utf-8"));
const metadata = {};

const mean = (data) => data.reduce((x, y) => x + y, 0) / data.length;

const variance = (data, mean) => data.reduce((x, v) => x + (v - mean) ** 2, 0) / (data.length - 1);

const median = (data) => {
    data.sort((a, b) => a - b);

    const half = Math.floor(data.length / 2);

    if (data.length % 2) {
        return data[half];
    } else {
        return (data[half - 1] + data[half]) / 2;
    }
};

const round = (num) => Math.round(num * 10) / 10;

const mode = (data) =>
    data.sort((a, b) => data.filter((v) => v === a).length - data.filter((v) => v === b).length).pop();

const IQROutliers = (data, k) => {
    const sorted = data.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - k * iqr;
    const upperBound = q3 + k * iqr;

    const isWithinBounds = (d) => d < lowerBound || d > upperBound;

    const outliers = data.filter(isWithinBounds);
    const percentage = (outliers.length / data.length) * 100;

    return { outliers, percentage };
};

const minmax = (min, max) => (x) => (x - min) / (max - min);

const percentile = (data, p) => {
    const sortedArr = data.slice().sort((a, b) => a - b);
    const index = Math.ceil((sortedArr.length - 1) * p);

    return sortedArr[index];
};

for (const { Data } of funds) {
    for (const [key, value] of Object.entries(Data)) {
        if (value !== null) {
            if (metadata[key]) {
                metadata[key].push(value);
            } else {
                metadata[key] = [value];
            }
        }
    }
}

for (let [key, values] of Object.entries(metadata)) {
    const { outliers, percentage } = IQROutliers(values, 1.5);

    if (percentage !== 0) {
        values = values.filter((val) => outliers.includes(val) === false);
    }

    const min = Math.min(...values);
    const max = Math.max(...values);

    const meta = {
        Min: round(min),
        Max: round(max),
        Mean: round(mean(values)),
        Mode: round(mode(values)),
        Median: round(median(values)),
        Percentile95: round(percentile(values.map(minmax(min, max)), 0.95)),
        OutliersPercentage: round(percentage),
        StdDev: round(Math.sqrt(variance(values, mean(values)))),
    };

    metadata[key] = meta;
}

writeFileSync(path.resolve(baseURL, "./assets/metadata.json"), JSON.stringify(metadata, null, 4));
