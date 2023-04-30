/// <reference types="vite/client" />

type NumericValues = {
    [key: string]: number;
};

type SelectedColumn = {
    name: string;
    sortOrder: SortOrder;
};

type SortOrder = 1 | -1 | 0;

type Outlier = {
    outliers: number[];
    percentage: number;
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

type FundData = {
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
    Fee: number;
    Owners: number;
};

type Fund = {
    Id: string;
    ISIN: string;
    Name: string;
    Data: FundData;
    Benchmark: string;
    Category: string;
    Company: string;
};

type Point = {
    x: number;
    y: number;
};

type DataPoints = {
    dataSeries: Point[];
    id: string;
    name: string;
    fromDate: string;
    toDate: string;
};
