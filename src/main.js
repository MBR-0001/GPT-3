import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  data: {
    key: ""
  },
  render: h => h(App),
}).$mount("#app");
