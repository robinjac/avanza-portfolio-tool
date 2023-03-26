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

const mapToDataTableHead = (columnName: string): DataTableHead => ({
  title: columnName,
  key: columnKeys[columnName],
});

const selectColumnKeys =
  (selectedColumns: string[]) =>
  (fund: Fund): PartialFund => {
    const fund_: PartialFund = {};

    fund_.name = fund.name;

    for (const column of selectedColumns) {
      const key = columnKeys[column];

      fund_[key] = (fund as unknown as NumericValues)[key];
    }

    return fund_;
  };

const defaultItems = funds.map(selectColumnKeys(defaultSelectedColumns));

export default {
  data() {
    return {
      headers: [
        { title: "Name", key: "name" },
        ...defaultSelectedColumns.map(mapToDataTableHead),
      ],
      items: defaultItems,
      defaultSelectedColumns,
      selectedColumns: defaultSelectedColumns,
      availableColumns: numericOnlyColumns.map(formatColumnName),
    };
  },
  methods: {
    handleSelect(newSelectedColumns: string[]): void {
      this.selectedColumns = [...newSelectedColumns];
      this.headers = [
        { title: "Name", key: "name" },
        ...newSelectedColumns.map(mapToDataTableHead),
      ];

      this.items = funds.map(selectColumnKeys(newSelectedColumns));
    },
    handleClear(): void {
      this.selectedColumns = [];
      this.headers = [{ title: "Name", key: "name" }];

      this.items = funds.map(selectColumnKeys([]));
    },
    handleReset(): void {
      this.selectedColumns = defaultSelectedColumns;
      this.headers = [
        { title: "Name", key: "name" },
        ...defaultSelectedColumns.map(mapToDataTableHead),
      ];

      this.items = funds.map(selectColumnKeys(defaultSelectedColumns));
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
          <v-data-table
            :headers="headers"
            :items="items"
            multi-sort
          ></v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
