import { writeFileSync } from "node:fs";
import path from "node:path";
import fetch from "node-fetch";

const baseURL = process.cwd();
let funds = [];

// Configurations
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

const makeRequest = async (index_) => {
    const payload = createPayload(index_);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": payload.length,
            },
            body: payload,
        });

        const json = await response.json();

        funds = [...funds, ...json.fundListViews];

        writeFileSync(path.resolve(baseURL, "./assets/funds.json"), JSON.stringify(funds, null, 4));

        if (index_ < numberOfFunds) {
            setTimeout(() => makeRequest(index_ + increment), timeout);
        }

        console.log("fetching at index: " + index_);
    } catch ({ message }) {
        console.error(`problem with request: ${message}`);
    }
};

// Start at index = 0
makeRequest(0);
