import { normalize } from "./math";
import metadata from "../assets/metadata.json";

const meta = metadata as FundMeta;

const value = (a: NumericValues, column: SelectedColumn) => formatNumber(a[column.name] ?? -(Math.abs(meta[column.name].Max) + 1));

const direction = (x: number, y: number, column: SelectedColumn) =>
    (x > y ? -column.sortOrder : column.sortOrder) as SortOrder;

const notSimilar = (x: number, y: number, column: SelectedColumn) => {
    return Math.abs(x - y) > 0.01;
};

export const formatNumber = (num: number): number => Math.round(num * 10) / 10;

export const rankSort = (a: NumericValues, b: NumericValues, columns: SelectedColumn[]): SortOrder => {
    for (let index = 0; index < columns.length; index++) {
        const column = columns[index];
        const x = value(a, column);
        const y = value(b, column);

        if (notSimilar(x, y, column)) {
            if (index > 0) {
                const column_ = columns[index - 1];
                const x_ = value(a, column_);
                const y_ = value(b, column_);

                if (notSimilar(x_, y_, column)) {
                    return direction(x_, y_, column);
                }
            }

            return direction(x, y, column);
        }
    }

    return 0;
};
