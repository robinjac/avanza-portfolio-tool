<script lang="ts">
type ItemList = Array<{ id: string; name: string }>;
import funds from "../assets/funds.json";

export default {
  data() {
    return {
      items: [] as ItemList,
    };
  },
  mounted() {
    // Fetch data from API
    console.log(funds);
  },
};
</script>

<template>
  <div>
    <h2>List of items:</h2>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>
