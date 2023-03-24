<script lang="ts">
import fundsData from "../assets/funds.json";

const funds = fundsData as Fund[];

const defaultProps = [
  "developmentOneYear",
  "developmentFiveYears",
  "rating",
  "risk",
  "totalFee",
];

const numericOnlyProps: string[] = Object.entries(funds[0])
  .filter(([, value]) => typeof value === "number")
  .map(([prop]) => prop);

let selectedProps = defaultProps;

export default {
  data() {
    return {
      funds,
      selectedProps,
      availableProps: numericOnlyProps,
    };
  },
  methods: {
    handleSelect(selected: string[]): void {
      this.selectedProps = [...selected];
    },
  },
};
</script>

<template>
  <v-container>
    <v-select
      clearable
      label="Selected columns"
      :items="availableProps"
      :model-value="selectedProps"
      @update:model-value="handleSelect"
      multiple
      variant="solo"
    ></v-select>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">name</th>
          <th v-for="prop in selectedProps" class="text-left">{{ prop }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fund in funds" :key="fund.isin">
          <td>{{ fund.name }}</td>
          <td v-for="prop in selectedProps">
            {{ (fund as unknown as NumericValues)[prop] }}
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
