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

export const rankSort = (
    f1: NumericValues,
    f2: NumericValues,
    index: number,
    columnsSelected: SelectedColumn[]
): 0 | 1 | -1 => {
    const column = columnsSelected[index];

    const v1 = f1[column.name] ?? -Infinity;
    const v2 = f2[column.name] ?? -Infinity;

    if (distance(v1, v2) >= threshold(v1, 8)) {
        if (v1 < v2) {
            return column.sortOrder;
        }

        if (v1 > v2) {
            return -column.sortOrder as 1 | -1;
        }
    }

    if (index === columnsSelected.length - 1) {
        return 0;
    }

    // Values are considered equal, we check the next selected column
    return rankSort(f1, f2, index + 1, columnsSelected);
};

export const formatNumber = (num: number): number => Math.round(num * 10) / 10;
