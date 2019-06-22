<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Home Search</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout v-if="!user" justify-end>
        <v-btn flat @click="loginDialog = true">
          <span class="mr-2 text-uppercase">Login</span>
        </v-btn>
        <v-btn flat @click="registerDialog = true">
          <span class="mr-2 text-uppercase">Register</span>
        </v-btn>
      </v-layout>
      <v-layout v-else justify-end>
        <v-btn flat to="/account">
          <span class="mr-2 text-uppercase">Account</span>
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
import axios from 'axios';
import { mapMutations, mapState } from 'vuex';
import AuthForm from '@/components/AuthForm.vue';

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
        const res = await axios.post(
          'http://localhost:3000/api/register',
          credentials,
          {
            withCredentials: true,
          },
        );

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
        const res = await axios.post(
          'http://localhost:3000/api/login',
          credentials,
          {
            withCredentials: true,
          },
        );

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
        const res = await axios.get('http://localhost:3000/api/current-user', {
          withCredentials: true,
        });

        this.setUser(res.data);
        this.isFetching = false;
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
