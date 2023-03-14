const https = require("node:https");
const fs = require("node:fs");

const funds = { fundListViews: [] };
const index = 0;
const numberOfFunds = 1369;
const delayUntilNextFetch = 500; // In ms

const requestBody = (index_) =>
  JSON.stringify({
    startIndex: index_,
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
      const funds_ = JSON.parse(data);
      funds.fundListViews = [...funds.fundListViews, ...funds_.fundListViews];

      fs.writeFileSync("./funds.json", JSON.stringify(funds));
    });
  }
);

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

const getData = (index_) => {
  if (index_ + 20 < numberOfFunds) {
    req.write(requestBody(index_));
    console.log("fetching at index: " + index_);

    setTimeout(() => getData(index_ + 20), delayUntilNextFetch);
  } else {
    req.end();
  }
};

// Start fetching funds data
getData(index);
