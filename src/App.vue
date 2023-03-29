<script lang="ts">
import fundsData from "../assets/funds.json";

const funds = fundsData as Fund[];

// Capitalize the first letter in the first word and separate words by whitespace
const formatColumnName = (name: string): string => {
  return name
    .split(/(?=[A-Z])/)
    .map((name_) => name_.charAt(0).toUpperCase() + name_.slice(1))
    .join(" ");
};

const defaultSelectedColumns = [
  "developmentOneYear",
  "developmentFiveYears",
  "rating",
  "risk",
  "totalFee",
].map(formatColumnName);

const numericOnlyColumns: string[] = Object.entries(funds[0])
  .filter(([, value]) => typeof value === "number")
  .map(([prop]) => prop);

const columnKeys: StringDict = {};

// Create the mapping
for (const column of numericOnlyColumns) {
  columnKeys[formatColumnName(column)] = column;
}

const sorter = (
  f1: NumericValues,
  f2: NumericValues,
  index: number,
  columnsSelected: string[],
  similarity: number,
  dir: 1 | -1
): 0 | 1 | -1 => {
  const column = columnsSelected[index];
  const key = columnKeys[column];

  const v1 = f1[key];
  const v2 = f2[key];

  if (v1 > v2 + similarity) {
    return dir;
  }

  if (v1 < v2 - similarity) {
    return -dir as 1 | -1;
  }

  if (index === columnsSelected.length - 1) {
    return 0;
  }

  return sorter(f1, f2, index + 1, columnsSelected, similarity, dir);
};

export default {
  data() {
    return {
      columnsSelected: [] as string[],
      funds,
      page: 1,
      columnKeys,
      defaultSelectedColumns,
      selectedColumns: defaultSelectedColumns,
      availableColumns: numericOnlyColumns.map(formatColumnName),
      nrOfRows: 10,
    };
  },
  methods: {
    handleSelect(newSelectedColumns: string[]): void {
      this.selectedColumns = [...newSelectedColumns];
    },
    handleClear(): void {
      this.selectedColumns = [];
    },
    handleReset(): void {
      this.selectedColumns = defaultSelectedColumns;
    },
    handlePagination(newPage: number) {
      this.page = newPage;
    },
    handleColumnSelection(selectedColumn: string) {
      if (this.columnsSelected.includes(selectedColumn)) {
        this.columnsSelected = this.columnsSelected.filter(
          (column) => column !== selectedColumn
        );
      } else {
        this.columnsSelected = [...this.columnsSelected, selectedColumn];
      }
    },
    handleSort(fund1: Fund, fund2: Fund): 0 | 1 | -1 {
      if (this.columnsSelected.length > 0) {
        return sorter(
          fund1 as unknown as NumericValues,
          fund2 as unknown as NumericValues,
          0,
          this.columnsSelected,
          4,
          1
        );
      } else {
        return 0;
      }
    },
    formatNumber(num: number | null): number | null {
      if (typeof num === "number") {
        return Math.round(num * 100) / 100;
      }

      return num;
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
          :model-value="selectedColumns"
          @update:model-value="handleSelect"
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
            @click="handleClear"
            size="small"
            variant="outlined"
          >
            clear
          </v-btn>
          <v-btn
            :disabled="selectedColumns === defaultSelectedColumns"
            @click="handleReset"
            class="mx-2"
            size="small"
            variant="text"
          >
            default
          </v-btn>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row style="height: 100px">
      <v-col class="ml-4" cols="5">
        <v-btn size="small" variant="outlined" class="mx-2 mb-2">Clear</v-btn>
        <v-btn
          size="small"
          variant="text"
          class="mb-2"
          prepend-icon="mdi-arrow-up"
          >Highest</v-btn
        >
        <v-slider label="Sensitivity">
          <template v-slot:append>
            <v-chip size="large"> 50 </v-chip>
          </template>
        </v-slider>
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
                  :class="{
                    'text-right': index === selectedColumns.length - 1,
                    'font-weight-bold': true,
                  }"
                >
                  <v-badge
                    v-if="columnsSelected.includes(column)"
                    floating
                    :content="columnsSelected.indexOf(column) + 1"
                  >
                    {{ column }}
                  </v-badge>
                  <template v-else>
                    {{ column }}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fund in funds
                  .sort(handleSort)
                  .slice((page - 1) * nrOfRows, page * nrOfRows)"
                :key="fund.isin"
              >
                <td style="min-width: 300px">{{ fund.name }}</td>
                <td
                  v-for="(column, index) in selectedColumns"
                  :class="{
                    'text-right': index === selectedColumns.length - 1,
                  }"
                >
                  {{
                    formatNumber(
                      (fund as unknown as NumericValues)[columnKeys[column]]
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-center align-center mt-4 pb-2">
            <v-pagination
              @update:model-value="handlePagination"
              total-visible="4"
              :length="funds.length"
            ></v-pagination>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
