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
      defaultSelectedColumns,
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
