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
      funds,
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
  },
};
</script>

<template>
  <v-container>
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
                <th v-for="column in selectedColumns" class="text-left">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fund in funds.slice(0, nrOfRows)" :key="fund.isin">
                <td style="min-width: 300px">{{ fund.name }}</td>
                <td v-for="column in selectedColumns">
                  {{ (fund as unknown as NumericValues)[columnKeys[column]] }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="d-flex justify-center align-center mt-4 mb-2">
            <v-pagination :length="funds.length"></v-pagination>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
