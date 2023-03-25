import { createApp } from "vue";
import App from "./App.vue";

// Material icons
import "@mdi/font/css/materialdesignicons.css";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Data table
import { VDataTable } from "vuetify/labs/VDataTable";

// Material blueprint
import { md3 } from "vuetify/blueprints";

const vuetify = createVuetify({
  components: {
    VDataTable,
    ...components,
  },
  directives,
  blueprint: md3,
});

createApp(App).use(vuetify).mount("#app");
