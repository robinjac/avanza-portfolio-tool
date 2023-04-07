<script lang="ts">
import fundsData from "../assets/funds.json";
import { rankSort, formatColumnName, createColumnMap } from "./helpers";

const funds = fundsData as Fund[];

const defaultSelectedColumns: string[] = [
    "developmentOneYear",
    "developmentFiveYears",
    "rating",
    "risk",
    "totalFee",
].map(formatColumnName);

const numericOnlyColumns: string[] = Object.entries(funds[0])
    .filter(([, value]) => typeof value === "number")
    .map(([prop]) => prop);

const columnKeys: StringDict = createColumnMap({}, numericOnlyColumns);

export default {
    data() {
        return {
            columnsSelected: [] as SelectedColumn[],
            funds,
            page: 1,
            columnKeys,
            defaultSelectedColumns,
            selectedColumns: defaultSelectedColumns,
            availableColumns: numericOnlyColumns.map(formatColumnName),
            nrOfRows: 10,
            sensitivity: 1,
        };
    },
    methods: {
        handleColumnSelection(selectedColumn: string) {
            if (this.columnsContains(selectedColumn)) {
                this.columnsSelected = this.columnsSelected.filter((column) => column.name !== selectedColumn);
            } else {
                this.columnsSelected = [...this.columnsSelected, { name: selectedColumn, sortOrder: 1 }];
            }
        },
        columnsContains(columnName: string): boolean {
            if (this.columnsSelected.find(({ name }) => name === columnName) === undefined) {
                return false;
            } else {
                return true;
            }
        },
        columnRank(columnName: string): number {
            return this.columnsSelected.map(({ name }) => name).indexOf(columnName) + 1;
        },
        columnSortOrder(columnName: string): -1 | 1 {
            const column = this.columnsSelected.find(({ name }) => name === columnName);

            if (column !== undefined) {
                return column.sortOrder;
            } else {
                return 1;
            }
        },
        setSortOrder(columnName: string) {
            const column = this.columnsSelected.find(({ name }) => name === columnName);

            if (column !== undefined) {
                column.sortOrder = -column.sortOrder as -1 | 1;
            }
        },
        handleSort(fund1: Fund, fund2: Fund): 0 | 1 | -1 {
            if (this.columnsSelected.length > 0) {
                return rankSort(
                    fund1 as unknown as NumericValues,
                    fund2 as unknown as NumericValues,
                    0,
                    this.columnsSelected,
                    this.sensitivity,
                    columnKeys
                );
            } else {
                return 0;
            }
        },
        formatNumber(num: number | null): string {
            if (typeof num === "number") {
                return (Math.round(num * 10) / 10).toString();
            }

            return "-";
        },
    },
};
</script>

<template>
    <v-card>
        <v-row class="mb-4">
            <v-col cols="9">
                <v-select
                    label="Selected columns"
                    :items="availableColumns"
                    v-model="selectedColumns"
                    chips
                    closable-chips
                    multiple
                    variant="solo"
                    hide-details
                    class="mt-4 ml-4"
                ></v-select>
            </v-col>
            <v-col>
                <v-sheet class="d-flex justify-center my-4">
                    <v-btn
                        :disabled="selectedColumns.length === 0"
                        @click="() => (selectedColumns = [])"
                        size="small"
                        variant="outlined"
                    >
                        clear
                    </v-btn>
                    <v-btn
                        :disabled="selectedColumns === defaultSelectedColumns"
                        @click="() => (selectedColumns = defaultSelectedColumns)"
                        class="mx-2"
                        size="small"
                        variant="text"
                    >
                        default
                    </v-btn>
                </v-sheet>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="ml-4" cols="5">
                <v-btn @click="() => (columnsSelected = [])" size="small" variant="outlined" class="mx-2">Clear</v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col>
                <v-card>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left font-weight-bold">Name</th>
                                <th
                                    v-ripple
                                    @click="() => handleColumnSelection(column)"
                                    style="cursor: pointer"
                                    v-for="(column, index) in selectedColumns"
                                >
                                    <div
                                        :class="{
                                            'justify-end': index === selectedColumns.length - 1,
                                            'font-weight-bold d-flex align-center': true,
                                        }"
                                        style="padding-right: 0.75rem"
                                    >
                                        <v-btn
                                            @click.stop="() => setSortOrder(column)"
                                            :icon="columnSortOrder(column) < 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                                            variant="text"
                                            size="small"
                                            v-if="columnsContains(column)"
                                        ></v-btn>
                                        <v-badge v-if="columnsContains(column)" floating :content="columnRank(column)">
                                            {{ column }}
                                        </v-badge>
                                        <template v-else>
                                            {{ column }}
                                        </template>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="fund in [...funds]
                                    .sort(handleSort)
                                    .slice((page - 1) * nrOfRows, page * nrOfRows)"
                                :key="fund.isin"
                            >
                                <td style="min-width: 300px">
                                    {{ fund.name }}
                                </td>
                                <td
                                    v-for="(column, index) in selectedColumns"
                                    :class="{
                                        'text-right': index === selectedColumns.length - 1,
                                    }"
                                >
                                    {{ formatNumber((fund as unknown as NumericValues)[columnKeys[column]]) }}
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="d-flex justify-center align-center mt-4 pb-2">
                        <v-pagination v-model="page" total-visible="4" :length="funds.length / 10"></v-pagination>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>
