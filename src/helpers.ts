function distance(num1: number, num2: number): number {
    return Math.abs(num1 - num2);
}

function threshold(num: number, sensitivity: number): number {
    const num_ = num.toString();

    if (num_.includes(".")) {
        if (num_.slice(0, 2) === "0.") {
            if (num_.slice(0, 3) === "0.0") {
                return sensitivity / 1000;
            } else {
                return sensitivity / 100;
            }
        } else {
            return sensitivity / 10;
        }
    } else {
        return 0;
    }
}

export const formatNumber = (num: number): number => Math.round(num * 10) / 10;

export const rankSort = (a: NumericValues, b: NumericValues, columns: SelectedColumn[]): SortOrder => {
    let comparison = 0;

    for (let index = 0; index < columns.length; index++) {
        const ratio = columns[index];
        const x = a[ratio.name] ?? -Infinity;
        const y = b[ratio.name] ?? -Infinity;

        if (distance(x, y) > threshold(x, 8)) {
            comparison = x < y ? columns[index].sortOrder : -columns[index].sortOrder;
        }
    }

    return comparison as SortOrder;
};
