<template>
  <v-card max-width="400">
    <v-img :src="details.imageUrl" aspect-ratio="1.5"></v-img>
    <v-card-title class="justify-end">
      <span class="title">{{ details.address }}</span>
    </v-card-title>
    <v-card-text>
      <v-layout pa-0 justify-end>
        <v-btn raised>
          <span class="text-uppercase">Edit</span>
        </v-btn>
        <v-btn
          raised
          color="error"
          @click="$emit('deleteListing', details._id)"
        >
          <span class="text-uppercase">Delete</span>
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from '../utils/axios';

export default Vue.extend({
  props: {
    details: Object,
  },
});
</script>
