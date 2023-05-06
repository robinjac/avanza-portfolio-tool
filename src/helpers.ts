import metadata from "../assets/metadata.json";
import { normalize } from "./math";

const meta = metadata as FundMeta;

const initNormalize = (min: number, max: number) => (x: number) => normalize(min, max)(x);

// We need to compare the rounded values and not real values to match with the formatted ones in the table
const value = (a: NumericValues, column: SelectedColumn) => a[column.name] ?? meta[column.name].Min;

const direction = (x: number, y: number, column: SelectedColumn) =>
    (x > y ? -column.sortOrder : column.sortOrder) as SortOrder;

const notSimilar = (x: number, y: number, column: SelectedColumn) => {
    const { Min, Max } = meta[column.name];
    const n = initNormalize(Min, Max);

    return Math.abs(n(x) - n(y)) > 0.01;
};

export const round = (num: number): number => Math.round(num * 10) / 10;

export const rankSort = (a: NumericValues, b: NumericValues, columns: SelectedColumn[]): SortOrder => {
    for (let index = 0; index < columns.length; index++) {
        const column = columns[index];
        const x = value(a, column);
        const y = value(b, column);

        if (columns.length === 1) {
            if (x === y) {
                return 0;
            } else {
                return direction(x, y, column);
            }
        } else {
            if (notSimilar(x, y, column)) {
                if (index > 0) {
                    const column_ = columns[index - 1];
                    const x_ = value(a, column_);
                    const y_ = value(b, column_);

                    if (notSimilar(x_, y_, column_)) {
                        return direction(x_, y_, column_);
                    }
                }

                return direction(x, y, column);
            }
        }
    }

    return 0;
};
