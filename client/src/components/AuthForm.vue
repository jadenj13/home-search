<template>
  <v-card>
    <v-card-title>
      <span class="headline">{{ headline }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="text-md-center">
      <v-form @submit.prevent="$emit('submit', { email, password })">
        <v-text-field
          type="email"
          v-model="email"
          label="Email"
          required
          :rules="[requiredRule]"
        />
        <v-text-field
          v-model="password"
          label="Password"
          required
          :append-icon="showPassword ? 'visibility_off' : 'visibility'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          :rules="[requiredRule, inputRule]"
          :error="error"
        />
        <v-spacer></v-spacer>
        <v-layout justify-end>
          <v-btn
            color="darken-1"
            flat
            @click="$emit('close')"
            :disabled="isFetching"
            >Close</v-btn
          >
          <v-btn
            color="primary darken-1"
            flat
            type="submit"
            :disabled="isFetching || !email || !password"
          >
            {{ buttonText }}
          </v-btn>
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
    error: Boolean,
    isFetching: Boolean,
  },
  data: () => ({
    showPassword: false,
    email: '',
    password: '',
    requiredRule: (value: string) => !!value || 'Required.',
    inputRule: () => true as boolean | string,
  }),
  watch: {
    error(newValue: string) {
      if (newValue) {
        this.password = '';
        this.inputRule = () => 'Error logging in.';
      }
    },
  },
});
</script>
