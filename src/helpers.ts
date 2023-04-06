export const rankSort = (
    f1: NumericValues,
    f2: NumericValues,
    index: number,
    columnsSelected: SelectedColumn[],
    similarity: number,
    columnKeys: StringDict
): 0 | 1 | -1 => {
    const column = columnsSelected[index];
    const key = columnKeys[column.name];

    const v1 = f1[key];
    const v2 = f2[key];

    if (v1 > v2 - similarity) {
        return column.sortOrder;
    }

    if (v1 < v2 + similarity) {
        return -column.sortOrder as 1 | -1;
    }

    if (index === columnsSelected.length - 1) {
        return 0;
    }

    return rankSort(f1, f2, index + 1, columnsSelected, similarity, columnKeys);
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
