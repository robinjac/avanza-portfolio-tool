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
  },
};
</script>

<template>
  <v-container>
    <v-card>
      <v-toolbar flat color="blue-grey" dark> </v-toolbar>
      <v-row>
        <v-col cols="10">
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

      <v-row>
        <v-col>
          <v-card>
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th
                    v-ripple
                    @click="() => handleColumnSelection(column)"
                    class="text-left"
                    style="cursor: pointer"
                    v-for="column in selectedColumns"
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
                  v-for="fund in funds.slice(
                    (page - 1) * nrOfRows,
                    page * nrOfRows
                  )"
                  :key="fund.isin"
                >
                  <td style="min-width: 300px">{{ fund.name }}</td>
                  <td v-for="column in selectedColumns">
                    {{ (fund as unknown as NumericValues)[columnKeys[column]] }}
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div class="d-flex justify-center align-center mt-4 mb-2">
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
  </v-container>
</template>
