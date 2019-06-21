<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ headline }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="text-md-center">
      <v-form @submit.prevent="$emit('submit', { email, password })">
        <v-text-field type="email" v-model="email" label="Email" required />
        <v-text-field
          v-model="password"
          label="Password"
          required
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
        />
        <v-spacer></v-spacer>
        <v-layout justify-end>
          <v-btn color="darken-1" flat @click="$emit('close')">Close</v-btn>
          <v-btn color="primary darken-1" flat type="submit">{{
            buttonText
          }}</v-btn>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    headline: String,
    buttonText: String,
  },
  data: () => ({
    showPassword: false,
    email: '',
    password: '',
  }),
});
</script>
