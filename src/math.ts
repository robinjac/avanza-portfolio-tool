export const gaussianSimilarity = (x: number, y: number, variance: number): number =>
    Math.exp(-((x - y) ** 2) / (2 * variance));

export function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    let intersection = new Set([...set1].filter((x) => set2.has(x)));
    let union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
}

export function cosineSimilarity(vect1: number[], vect2: number[]): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vect1.length; i++) {
        dotProduct += vect1[i] * vect2[i];
        norm1 += vect1[i] ** 2;
        norm2 += vect2[i] ** 2;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

export const normalize = (min: number, max: number) => (val: number) => (val - min) / (max - min);

/**
 * Normalizes data between 0 and 1. Doesn't change the underlying distribution.
 *
 * eg. [1, 5, -3, 7, 2, 0] becomes [0.375, 0.625, 0.0, 0.875, 0.4375, 0.3125]
 *
 * @param data
 * @returns normalized data
 */
export function nomralizeData(data: number[]) {
    // Find the minimum and maximum values in the data
    const min = Math.min(...data);
    const max = Math.max(...data);

    // Return the normalized data
    return data.map(normalize(min, max));
}

/**
 * Tukey's fence method for detecting outliers. This works best when the data is normally distributed.
 *
 * eg. [1, 2, 3, 4, 5, 1000] gives { outliers: [1000], percentage: 16.666666666666668 }
 *
 * @param data
 * @returns Outlier
 */
export function tukeyOutliers(data: number[]): Outlier {
    const q1 = quantile(data, 0.25);
    const q3 = quantile(data, 0.75);
    const iqr = q3 - q1;
    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    const outliers = data.filter((x) => x < lowerFence || x > upperFence);
    const percentage = (outliers.length / data.length) * 100;

    return { outliers, percentage };
}

function quantile(data: number[], percentile: number) {
    const sortedData = data.slice().sort((a, b) => a - b);
    const index = Math.floor(percentile * sortedData.length);
    return sortedData[index];
}

/**
 * IQR method for detecting outliers.
 *
 * @param data
 * @returns Outlier
 */
export function IQROutliers(data: number[]): Outlier {
    const sorted = data.sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const isWithinBounds = (d: number) => d < lowerBound || d > upperBound;

    const outliers = data.filter(isWithinBounds);
    const percentage = (outliers.length / data.length) * 100;

    return { outliers, percentage };
}
