<template>
  <div id="app">
    <b-overlay variant="dark" opacity="0.3" :show="$root.requesting" style="min-height: 100vh; width: 100%;">
      <b-navbar toggleable="lg" type="dark" variant="secondary" style="width: 100%;">
        <b-navbar-brand href="#">GPT-3</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-form-select v-model="$root.engine" :options="$root.engines"></b-form-select>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      
      <b-tabs active-tab-class="pad">
        <b-tab title="Completion">
          <b-container>
            <Completion />
          </b-container>
        </b-tab>
        <b-tab title="Answers">
          <b-container>
            <Answers />
          </b-container>
        </b-tab>
      </b-tabs>
    </b-overlay>
  </div>
</template>

<script>
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Completion from "./components/Completion.vue";
import Answers from "./components/Answers.vue";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.mixin({
  methods: {
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
      });
    },
    cannotRequest() {
      return !this.$root.engine || !this.$root.key;
    },
    async request(url, method, body = null, key = this.$root.key) {
      if (!key) return {body: null, status: "No API key", success: false};

      let headers = {authorization: "Bearer " + key};
      if (body) headers["content-type"] = "application/json";

      this.$root.requesting = true;
      let response = await fetch(url, {method, headers: headers, body: body ? JSON.stringify(body) : null}).catch(console.error);
      this.$root.requesting = false;

      if (!response) return {body: null, status: 600, success: false};
      if (!response.ok) return {body: null, status: response.status, success: false};

      let json = await response.json();

      return {body: json, status: response.status, success: true};
    }
  }
});

export default {
  name: "App",
  components: {
    Completion,
    Answers
  },
  async mounted() {
    await this.sleep(1000);

    if (!this.$root.key) {
      let key = "";

      while (!key) {
        let temp = "";
        do { temp = prompt("Enter your GPT-3 API key"); }
        while (!temp);
      
        let b = await this.request("https://api.openai.com/v1/engines", "GET", null, temp);
        if (b.success) {
          key = temp;
          this.$root.engines = [{text: "Select engine", value: null}, ...b.body.data.filter(x => x.ready).map(x => ({text: x.id, value: x.id}))];
        }
      }

      this.$root.key = key;
    }
  }
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.pad { padding: 10px; }
label { margin: 0; } 
</style>
