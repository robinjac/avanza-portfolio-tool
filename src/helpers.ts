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
    columnsSelected: SelectedColumn[],
    columnKeys: StringDict
): 0 | 1 | -1 => {
    const column = columnsSelected[index];
    const key = columnKeys[column.name];

    const v1 = f1[key] ?? -Infinity;
    const v2 = f2[key] ?? -Infinity;

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
    return rankSort(f1, f2, index + 1, columnsSelected, columnKeys);
};

export const formatColumnName = (name: string): string => {
    return name
        .split(/(?=[A-Z])/)
        .map((name_) => name_.charAt(0).toUpperCase() + name_.slice(1))
        .join(" ");
};

export const createColumnMap = (columnMapping: StringDict, columns: string[]): StringDict => {
    for (const column of columns) {
        columnMapping[formatColumnName(column)] = column;
    }

    return columnMapping;
};

export const formatNumber = (num: number): number => Math.round(num * 10) / 10;
