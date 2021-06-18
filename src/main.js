import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  data: {
    key: "",
    engine: null,
    engines: [{text: "Select engine", value: null}],
    requesting: false
  },
  render: h => h(App),
}).$mount("#app");
