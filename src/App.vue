<script lang="ts">
import fundsData from "../assets/funds.json";

const funds = fundsData as Fund[];

const defaultSelectedColumns = [
  "developmentOneYear",
  "developmentFiveYears",
  "rating",
  "risk",
  "totalFee",
];

const numericOnlyColumns: string[] = Object.entries(funds[0])
  .filter(([, value]) => typeof value === "number")
  .map(([prop]) => prop);

export default {
  data() {
    return {
      funds,
      selectedColumns: defaultSelectedColumns,
      availableColumns: numericOnlyColumns,
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
      <v-col>
        <v-select
          label="Selected columns"
          :items="availableColumns"
          :model-value="selectedColumns"
          @update:model-value="handleSelect"
          multiple
          variant="solo"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-row align="end">
      <v-sheet class="pa-2 ma-2">
        <v-btn
          @click="handleClear"
          class="ml-6"
          size="small"
          variant="outlined"
        >
          Clear
        </v-btn>
        <v-btn @click="handleReset" class="mx-2" size="small" variant="text">
          Reset
        </v-btn>
      </v-sheet>
    </v-row>

    <v-row>
      <v-col>
        <v-card>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">name</th>
                <th v-for="column in selectedColumns" class="text-left">
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="fund in funds" :key="fund.isin">
                <td>{{ fund.name }}</td>
                <td v-for="column in selectedColumns">
                  {{ (fund as unknown as NumericValues)[column] }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
