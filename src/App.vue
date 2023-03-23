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

export default {
  data() {
    return {
      funds,
      defaultProps,
      availableProps: numericOnlyProps,
    };
  },
  mounted() {
    // Fetch data from API
  },
};
</script>

<template>
  <v-container>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">name</th>
          <th v-for="prop in defaultProps" class="text-left">{{ prop }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fund in funds" :key="fund.isin">
          <td>{{ fund.name }}</td>
          <td v-for="prop in defaultProps">{{ ((fund as unknown) as NumericValues)[prop] }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
