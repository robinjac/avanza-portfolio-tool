/// <reference types="vite/client" />

type NumericValues = {
    [key: string]: number;
};

type StringDict = {
    [key: string]: string;
};

type SelectedColumn = {
    name: string;
    sortOrder: 1 | -1;
};

type DataTableHead = {
    key: string;
    value?: SelectItemKey;
    title: string;

    colspan?: number;
    rowspan?: number;

    fixed?: boolean;
    align?: "start" | "end";

    width?: number;
    minWidth?: string;
    maxWidth?: string;

    sortable?: boolean;
    sort?: (a: T, b: T) => number;
};

interface ProductInvolvementView {
    product: string;
    productDescription: string;
    value: number;
}

interface FundTag {
    title: string;
    fundTagCategory: string;
}

type PartialFund = { [name: string]: string | number };

interface Fund {
    isin: string;
    name: string;
    rating: number;
    risk: number;
    developmentOneDay: number;
    developmentOneWeek: number;
    developmentOneMonth: number;
    developmentThreeMonths: number;
    developmentOneYear: number;
    developmentThisYear: number;
    developmentThreeYears: number;
    developmentFiveYears: number;
    developmentTenYears: number;
    lowCarbon: boolean;
    sharpeRatio: number;
    standardDeviation: number;
    capital: number;
    fossilFuelInvolvement: number;
    carbonRiskScore: number;
    primaryBenchmark: string;
    recommendedHoldingPeriod: string;
    esgScore: number;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    managementFee: number;
    totalFee: number;
    transactionFee: number;
    ongoingFee: number;
    otherFee: number;
    minimumBuy: number;
    minimumBuyMonthlySaving: number;
    hasCurrencyExchangeFee: boolean;
    nrOfOwners: number;
    orderbookId: string;
    tagList: FundTag[];
    category: string;
    indexFund: boolean;
    startDate: string;
    collateralValue: number;
    superloanOrderbook: boolean;
    fundType: string;
    companyName: string;
    matchesSustainabilityProfile: boolean;
    sustainabilityLevel: string;
    sustainabilityRating: number;
    sustainabilityRatingCategoryName: string;
    productInvolvements: string[];
    productInvolvementViews: ProductInvolvementView[];
}

interface ReducedFund {
    Id: number;
    ISIN: string;
    Name: string;
    Rating: number;
    Risk: number;
    "1 Day": number;
    "1 Week": number;
    "1 Month": number;
    "3 Months": number;
    "1 Year": number;
    "This Year": number;
    "3 Years": number;
    "5 Years": number;
    "10 Years": number;
    Sharpe: number;
    StdDev: number;
    Benchmark: string;
    Fee: number;
    Owners: number;
    Category: string;
    Company: string;
}

interface Point {
    x: number;
    y: number;
}

interface DataPoints {
    dataSeries: Point[];
    id: number;
    name: string;
    fromDate: string;
    toDate: string;
}
