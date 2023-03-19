const fs = require("node:fs");

const filePath = process.argv[2];

const funds = JSON.parse(fs.readFileSync(filePath, "utf-8"));

console.log("Number of funds: " + funds.length);
