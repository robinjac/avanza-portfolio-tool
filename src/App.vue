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

const defaultColumnNames: string[] = [
  "developmentOneYear",
  "developmentFiveYears",
  "rating",
  "risk",
  "totalFee",
];

const defaultSelectedColumns: SelectedColumn[] = defaultColumnNames
  .map(formatColumnName)
  .map((name) => ({
    name,
    sortOrder: 1,
  }));

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
  columnsSelected: SelectedColumn[],
  similarity: number
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

  return sorter(f1, f2, index + 1, columnsSelected, similarity);
};

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
    handleColumnSelection(selectedColumn: SelectedColumn) {
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
          this.sensitivity
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
        <v-btn
          @click="() => (columnsSelected = [])"
          size="small"
          variant="outlined"
          class="mx-2"
          >Clear</v-btn
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
                    style="padding-right: 0.75rem"
                  >
                    <v-btn
                      @click.stop="() => (column.sortOrder = -column.sortOrder as -1 | 1)"
                      :icon="
                        column.sortOrder < 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'
                      "
                      variant="text"
                      size="small"
                      v-if="columnsSelected.includes(column)"
                    ></v-btn>
                    <v-badge
                      v-if="columnsSelected.includes(column)"
                      floating
                      :content="columnsSelected.indexOf(column) + 1"
                    >
                      {{ column.name }}
                    </v-badge>
                    <template v-else>
                      {{ column.name }}
                    </template>
                  </div>
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
                      (fund as unknown as NumericValues)[
                        columnKeys[column.name]
                      ]
                    )
                  }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-center align-center mt-4 pb-2">
            <v-pagination
              v-model="page"
              total-visible="4"
              :length="funds.length"
            ></v-pagination>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
