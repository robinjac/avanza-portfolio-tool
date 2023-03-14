<script lang="ts">
type ItemList = Array<{ id: string; name: string }>;

export default {
  data() {
    return {
      items: [] as ItemList,
    };
  },
  mounted() {
    // Fetch data from API
    fetch(
      "https://www.avanza.se/_api/fund-guide/list?shouldCheckFondExcludedFromPromotion=true",
      {
        method: "POST",
        body: JSON.stringify({
          startIndex: 0,
          managedType: "ANY",
          sustainabilityProfile: false,
          svanenMark: false,
          commonRegionFilter: [],
          otherRegionFilter: [],
          alignmentFilter: [],
          industryFilter: [],
          fundTypeFilter: [],
          interestTypeFilter: [],
          sortField: "developmentOneYear",
          sortDirection: "DESCENDING",
          name: "",
          recommendedHoldingPeriodFilter: [],
          companyFilter: [],
          productInvolvementsFilter: [],
          ratingFilter: [],
          riskFilter: [],
          sustainabilityRatingFilter: [],
          environmentalRatingFilter: [],
          socialRatingFilter: [],
          governanceRatingFilter: [],
          totalFeeMaxOnePercent: false,
          sustainableDevelopmentGoalsAlignmentFilter: [],
          euArticleTypeFilter: [],
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // this.items = data
      });
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
