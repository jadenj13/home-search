<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Home Search</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="loginDialog = true">
        <span class="mr-2 text-uppercase">Login</span>
      </v-btn>
      <v-btn flat @click="registerDialog = true">
        <span class="mr-2 text-uppercase">Register</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

    <v-dialog v-model="loginDialog" max-width="400" persistent>
      <auth-form
        headline="Login to your Account"
        button-text="Login"
        @close="loginDialog = false"
      ></auth-form>
    </v-dialog>
    <v-dialog v-model="registerDialog" max-width="400" persistent>
      <auth-form
        headline="Register for an Account"
        button-text="Register"
        @close="registerDialog = false"
        @submit="register($event)"
      ></auth-form>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import AuthForm from '@/components/AuthForm.vue';

interface Credentials {
  email: string;
  password: string;
}

export default Vue.extend({
  name: 'App',
  data: () => ({
    loginDialog: false,
    registerDialog: false,
  }),
  components: {
    AuthForm,
  },
  methods: {
    async register(credentials: Credentials) {
      const res = await axios.post(
        'http://localhost:3000/api/register',
        credentials
      );
    },
    async login(credentials: Credentials) {
      const res = await axios.post(
        'http://localhost:3000/api/login',
        credentials
      );
    },
  },
});
</script>
