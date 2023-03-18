const fs = require("node:fs");

const funds = JSON.parse(fs.readFileSync("./funds.json", "utf-8"));

console.log("Number of funds fetched: " + funds.length);
