<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <router-link to="/">
          <h1 class="headline black--text">Home Search</h1>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout v-if="!user" justify-end>
        <v-btn flat @click="loginDialog = true">
          <span class="text-uppercase">Login</span>
        </v-btn>
        <v-btn flat @click="registerDialog = true">
          <span class="text-uppercase">Register</span>
        </v-btn>
      </v-layout>
      <v-layout v-else justify-end>
        <v-btn flat to="/account">
          <span class="text-uppercase">Account</span>
        </v-btn>
        <v-btn flat @click="logout()">
          <span class="text-uppercase">Logout</span>
        </v-btn>
      </v-layout>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

    <v-dialog v-model="loginDialog" max-width="400" persistent>
      <auth-form
        headline="Login to your Account"
        button-text="Login"
        :error="error"
        :is-fetching="isFetching"
        @close="loginDialog = false"
        @submit="login($event)"
      ></auth-form>
    </v-dialog>
    <v-dialog v-model="registerDialog" max-width="400" persistent>
      <auth-form
        headline="Register for an Account"
        button-text="Register"
        :error="error"
        :is-fetching="isFetching"
        @close="registerDialog = false"
        @submit="register($event)"
      ></auth-form>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import AuthForm from '@/components/AuthForm.vue';
import axios from './utils/axios';

interface Credentials {
  email: string;
  password: string;
}

export default Vue.extend({
  name: 'App',
  components: {
    AuthForm,
  },
  data: () => ({
    loginDialog: false,
    registerDialog: false,
    isFetching: true,
    error: false,
  }),
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['setUser']),

    async register(credentials: Credentials) {
      this.isFetching = true;

      try {
        const res = await axios.post('/register', credentials);

        this.setUser(res.data);
        this.registerDialog = false;
      } catch (error) {
        this.error = true;
      }

      this.isFetching = false;
    },

    async login(credentials: Credentials) {
      this.isFetching = true;

      try {
        const res = await axios.post('/login', credentials);

        this.setUser(res.data);
        this.loginDialog = false;
      } catch (error) {
        this.error = true;
      }

      this.isFetching = false;
    },

    async getCurrentUser() {
      this.isFetching = true;

      try {
        const res = await axios.get('/current-user');

        this.setUser(res.data);
        this.isFetching = false;
      } catch (error) {
        this.isFetching = false;
      }
    },

    async logout() {
      this.isFetching = true;

      try {
        await axios.get('/logout');
        this.setUser(null);
        this.isFetching = false;
        this.$router.push('/');
      } catch (error) {
        this.isFetching = false;
      }
    },
  },
  async mounted() {
    await this.getCurrentUser();
  },
});
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
