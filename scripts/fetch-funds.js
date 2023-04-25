import https from "node:https";
import { writeFileSync } from "node:fs";
import path from "node:path";

const baseURL = process.cwd();

let funds = [];
const numberOfFunds = 1369;
const timeout = 500; // In ms
const increment = 20; // 20 funds at at time

const url = "https://www.avanza.se/_api/fund-guide/list?shouldCheckFondExcludedFromPromotion=true";

const createPayload = (index_) =>
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

const makeRequest = (index_) => {
    const payload = createPayload(index_);

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": payload.length,
        },
    };

    const req = https.request(url, options, (res) => {
        let data = "";

        res.setEncoding("utf8");

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            funds = [...funds, ...JSON.parse(data).fundListViews];

            writeFileSync(path.resolve(baseURL, "./assets/funds.json"), JSON.stringify(funds, null, 4));

            if (index_ < numberOfFunds) {
                setTimeout(() => makeRequest(index_ + increment), timeout);
            }
        });
    });

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(payload);
    req.end();
    console.log("fetching at index: " + index_);
};

// Start at index = 0
makeRequest(0);
