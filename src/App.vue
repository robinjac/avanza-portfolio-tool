<script lang="ts">
import fundsData from "../assets/funds.json";

export default {
  data() {
    return {
      funds: fundsData as Array<Fund>,
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
          <th class="text-left">Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fund in funds" :key="fund.isin">
          <td>{{ fund.name }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>
