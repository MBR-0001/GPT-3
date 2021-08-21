<template>
  <div>
    <b-form-input v-model="question" type="text" placeholder="Question"></b-form-input>
    <b-form-input v-model="example" type="text" placeholder="Example Question"></b-form-input>

    <div style="display: flex; align-content: center; justify-content: space-around; margin-top: 5px;">
      <div>
        <label for="range-1">Max tokens: {{tokens}}</label>
        <b-form-input id="range-1" v-model="tokens" type="range" min="1" max="2048" step="1"></b-form-input>
      </div>
      <div>
        <label for="range-2">Temperature: {{temp}}</label>
        <b-form-input id="range-2" v-model="temp" type="range" min="0" max="1" step="0.01"></b-form-input>
      </div>
    </div>

    <div style="display: flex; flex-wrap: wrap;">
      <div v-for="(item, i) in exampleList" v-bind:key="i" style="margin: 0 5px 10px;">
        <div style="display: flex;">
          <b-form-input v-model="item.question" type="text" placeholder="Question"></b-form-input>
          <b-button v-if="i != 0" variant="danger" @click="deleteExample(i - 1)">
            <b-icon-trash></b-icon-trash>
          </b-button>
          <b-button v-else variant="primary" :disabled="cannotAdd" @click="addExample">
            <b-icon-plus></b-icon-plus>
          </b-button>
        </div>
        <b-form-textarea v-model="item.answer" style="min-height: 175px;" placeholder="Answer"></b-form-textarea>
      </div>
    </div>

    <b-button variant="success" style="width: 100%; margin: -5px 0 5px;" @click="run" :disabled="!question || examples.length < 1 || cannotRequest()">Send</b-button>
    <b-form-textarea v-model="response" style="height: 150px;" readonly placeholder="Response"></b-form-textarea>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: "",
      examples: [],
      example: "",
      default: {question: "", answer: ""},
      current: {question: "", answer: ""},
      temp: 0,
      tokens: 16,
      response: ""
    };
  },
  computed: {
    cannotAdd() {
      return !this.current.question || !this.current.answer;
    },
    exampleList() {
      return  [this.current, ...this.examples];
    }
  },
  methods: {
    addExample() {
      this.examples.unshift({question: this.current.question, answer: this.current.answer});
      this.current = JSON.parse(JSON.stringify(this.default));
    },
    deleteExample(index) {
      this.examples.splice(index, 1);
    },
    async run() {
      let body = {
        model: this.$root.engine,
        question: this.question,
        examples: this.examples.map(x => ([x.question, x.answer])),
        examples_context: this.example,
        temperature: Number(this.temp),
        max_tokens: Number(this.tokens),
        documents: []
      };

      let res = await this.request("https://api.openai.com/v1/answers", "POST", body);
      if (res.success) this.response = res.body.answers[0];
      else alert("Failed: " + res.status);
    }
  }
};
</script>
