<template>
  <div id="app">
    <b-tabs content-class="mt-3" style="width: 100%;" active-tab-class="test">
      <b-tab lazy title="Completion"><Completion /></b-tab>
      <b-tab lazy title="Answers"><Answers /></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import Completion from "./components/Completion.vue";
import Answers from "./components/Answers.vue";

Vue.use(BootstrapVue);

Vue.mixin({
  methods: {
    sleep(ms) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
      });
    }
  }
});

export default {
  name: "App",
  components: {
    Completion,
    Answers
  },
  methods: {
    async request(url, key = this.$root.key) {
      if (!key) return {body: null, status: "No API key", success: false};

      let headers = {authorization: "Bearer " + key};
      let response = await fetch(url, {headers: headers});

      if (!response.ok) return {body: null, status: response.status, success: false};

      let json = await response.json();

      return {body: json, status: response.status, success: true};
    }
  },
  async mounted() {
    await this.sleep(1500);
    if (!this.$root.key) {
      let key = "";

      while (!key) {
        let temp = "";
        do { temp = prompt("Enter your GPT-3 API key"); }
        while (!temp);
        console.log("got key");
      
        let b = await this.request("https://api.openai.com/v1/engines", temp);
        console.log(b);
        if (b.success) key = temp;
      }

      this.$root.key = key;
      console.log("API key innit");
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

.test {
  background-color: red;
  padding: 10px;
}
</style>
