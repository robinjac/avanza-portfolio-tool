<script lang="ts">
import fundsData from "../assets/funds-transformed.json";
import { rankSort, formatNumber } from "./helpers";

const funds = fundsData as Fund[];

const defaultSelectedColumns: string[] = ["1 Year", "5 Years", "Rating", "Risk", "Fee"];

export default {
    data() {
        return {
            columnsSelected: [] as SelectedColumn[],
            funds,
            page: 1,
            defaultSelectedColumns,
            selectedColumns: defaultSelectedColumns,
            availableColumns: Object.keys(funds[0].Data),
            nrOfRows: 10,
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
        handleVSelect(selectedColumns: string[]) {
            this.selectedColumns = selectedColumns;

            this.columnsSelected = [];
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
        columnSortOrder(columnName: string): SortOrder {
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
        handleSort(fund1: Fund, fund2: Fund): SortOrder {
            return rankSort(
                fund1.Data as unknown as NumericValues,
                fund2.Data as unknown as NumericValues,
                this.columnsSelected
            );
        },
        formatNumber(num: number | null): string {
            if (typeof num === "number") {
                return formatNumber(num).toString();
            } else {
                return "-";
            }
        },
    },
};
</script>

<template>
    <v-card>
        <v-row class="mb-4">
            <v-col>
                <v-select
                    label="No selected columns"
                    :items="availableColumns"
                    v-model="selectedColumns"
                    @update:model-value="handleVSelect"
                    chips
                    closable-chips
                    multiple
                    clearable
                    single-line
                    variant="solo"
                    hide-details
                >
                </v-select>
                <v-btn
                    :disabled="selectedColumns === defaultSelectedColumns"
                    @click="() => handleVSelect(defaultSelectedColumns)"
                    size="small"
                    class="mt-2"
                    variant="text"
                >
                    default
                </v-btn>
                <v-btn
                    :disabled="columnsSelected.length === 0"
                    @click="() => (columnsSelected = [])"
                    size="small"
                    variant="text"
                    class="mt-2"
                    >reset</v-btn
                >
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
                                        :style="{
                                            'padding-right': columnsContains(column) ? '0.35rem' : undefined,
                                        }"
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
                                :key="fund.Id"
                            >
                                <td style="min-width: 300px">
                                    {{ fund.Name }}
                                </td>
                                <td
                                    v-for="(column, index) in selectedColumns"
                                    :class="{
                                        'text-right': index === selectedColumns.length - 1,
                                    }"
                                >
                                    {{ formatNumber((fund.Data as unknown as NumericValues)[column]) }}
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <div class="d-flex justify-center align-center mt-4 pb-2">
                        <v-pagination
                            v-model="page"
                            total-visible="4"
                            :length="Math.round(funds.length / nrOfRows)"
                        ></v-pagination>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>
