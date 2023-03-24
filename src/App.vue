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
  },
};
</script>

<template>
  <v-container>
    <v-select
      clearable
      label="Selected columns"
      :items="availableColumns"
      :model-value="selectedColumns"
      @update:model-value="handleSelect"
      multiple
      variant="solo"
    ></v-select>
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
  </v-container>
</template>
