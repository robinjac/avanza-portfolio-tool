const https = require("node:https");

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
  },
};

const req = https.request(
  "https://www.avanza.se/_api/fund-guide/list?shouldCheckFondExcludedFromPromotion=true",
  options,
  (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding("utf8");

    res.on("data", (chunk) => {
      console.log(`BODY: ${chunk}`);
    });

    res.on("end", () => {
      console.log("No more data in response.");
    });
  }
);

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(requestBody);
req.end();
