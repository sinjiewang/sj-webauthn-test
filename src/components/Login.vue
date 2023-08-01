<template>
  <div class="hello">
    <input id="email" v-model="email" />
    <br>
    <button @click="getUser">user info</button>{{ message }}
    <br>
    <button @click="login">login</button>
  </div>
</template>

<script>
import Client from '../utils/Client';
import { Auth, Amplify } from 'aws-amplify';

export default {
  name: 'MultiLogin',
  data() {
    return {
      client: new Client(),
      email: '',
      message: '',
    }
  },
  methods: {
    async getUser() {
      const user = await Auth.currentAuthenticatedUser();

      console.log('user', user);

      this.message = user.username;
    },
    login() {
      // this.client.login({account: this.email}).then(() => {
      //   this.message = 'login success';
      // });
      this.signIn(this.email);
    },
    async signIn(username) {
      Amplify.configure({"aws_appsync_authenticationType": "API_KEY"});
      const challengeResponse = await this.client.login({ account: username })
        .catch(err => {
          console.error(err)
        });
      Amplify.configure({"aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS"});
      try {
        Auth.configure({
          authenticationFlowType: 'CUSTOM_AUTH',
        });
        Auth.signIn(username).then((user) => {
          if (user?.challengeName === 'CUSTOM_CHALLENGE') {
            try {
              // to send the answer of the custom challenge
              Auth.sendCustomChallengeAnswer(
                user,
                JSON.stringify(challengeResponse)
              ).then((challengeAnswerResponse) => {
                console.log(challengeAnswerResponse);

                this.getUser();
              });
            } catch (err) {
              console.error('Auth.sendCustomChallengeAnswer fail', err);
            }
          }
        });
      } catch (err) {
        console.error('Auth.signIn fail', err);
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hide {
    display: none;
  }
</style>
