<template>
  <div class="hello">
    <button @click="register">register</button>
    <br>
    <button @click="login">login</button>
    <br>
    {{ message }}
  </div>
</template>

<script>
import Client from '../utils/Client';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      client: new Client(),
      message: 'ready',
    }
  },
  methods: {
    register() {
      this.client.register().then(() => {
        this.message = 'register success';
      });
    },
    login() {
      this.client.login({account: 'sinjie.wang@vivotek.com'}).then(() => {
        this.message = 'login success';
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
