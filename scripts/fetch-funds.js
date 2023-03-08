const https = require("node:https");
const fs = require("node:fs");

const requestBody = JSON.stringify({
  startIndex: 0,
  managedType: "ANY",
  sustainabilityProfile: false,
  svanenMark: false,
  commonRegionFilter: [],
  otherRegionFilter: [],
  alignmentFilter: [],
  industryFilter: [],
  fundTypeFilter: [],
  interestTypeFilter: [],
  sortField: "developmentOneYear",
  sortDirection: "DESCENDING",
  name: "",
  recommendedHoldingPeriodFilter: [],
  companyFilter: [],
  productInvolvementsFilter: [],
  ratingFilter: [],
  riskFilter: [],
  sustainabilityRatingFilter: [],
  environmentalRatingFilter: [],
  socialRatingFilter: [],
  governanceRatingFilter: [],
  totalFeeMaxOnePercent: false,
  sustainableDevelopmentGoalsAlignmentFilter: [],
  euArticleTypeFilter: [],
});

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": 627,
  },
};

const req = https.request(
  "https://www.avanza.se/_api/fund-guide/list?shouldCheckFondExcludedFromPromotion=true",
  options,
  (res) => {
    res.setEncoding("utf8");

    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      fs.writeFileSync("./funds.json", data);
    });
  }
);

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(requestBody);
req.end();
