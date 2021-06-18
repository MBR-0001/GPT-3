<template>
  <div>
    <b-form-textarea v-model="prompt" style="min-height: 150px; overflow: hidden;" placeholder="Prompt"></b-form-textarea>

    <div style="display: flex; align-content: center; justify-content: space-around; margin-top: 5px;">
      <div>
        <label for="range-1">Max tokens: {{tokens}}</label>
        <b-form-input id="range-1" v-model="tokens" type="range" min="1" max="2048" step="1"></b-form-input>
      </div>
      <div>
        <label for="range-2">Temperature: {{temp}}</label>
        <b-form-input id="range-2" v-model="temp" type="range" min="0" max="1" step="0.01"></b-form-input>
      </div>
      <div>
        <label for="range-3">Presence Penalty: {{pp}}</label>
        <b-form-input id="range-3" v-model="pp" type="range" min="0" max="1" step="0.01"></b-form-input>
      </div>
      <div>
        <label for="range-4">Frequency Penalty: {{fp}}</label>
        <b-form-input id="range-4" v-model="fp" type="range" min="0" max="1" step="0.01"></b-form-input>
      </div>
    </div>

    <b-button variant="success" style="width: 100%; margin: 5px 0;" @click="run" :disabled="!prompt || cannotRequest()">Send</b-button>
    <b-form-textarea v-model="response" style="height: 450px;" readonly placeholder="Response"></b-form-textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prompt: "",
      tokens: 1,
      temp: 1,
      pp: 0,
      fp: 0,
      response: ""
    };
  },
  methods: {
    async run() {
      let body = {
        prompt: this.prompt,
        max_tokens: Number(this.tokens),
        temperature: Number(this.temp),
        presence_penalty: Number(this.pp),
        frequency_penalty: Number(this.fp)
      };

      let res = await this.request("https://api.openai.com/v1/engines/" + this.$root.engine + "/completions", "POST", body);
      if (res.success) this.response = res.body.choices[0].text;
      else alert("Failed: " + res.status);
    }
  }
};
</script>
