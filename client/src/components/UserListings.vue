<template>
  <v-layout>
    <v-flex xs12 sm8 md6 offset-sm3 mt-5>
      <v-card>
        <v-card-title primary-title>
          <h2 class="headline">Your Listings</h2>
          <v-layout justify-end>
            <v-btn flat icon @click="addListingDialog = true">
              <v-icon>add</v-icon>
            </v-btn>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>You don't have any listing yet!</v-card-text>
      </v-card>
    </v-flex>

    <add-listing
      :show="addListingDialog"
      @close="addListingDialog = false"
    ></add-listing>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import AddListing from '@/components/AddListing.vue';

export default Vue.extend({
  name: 'user-listings',
  components: {
    AddListing,
  },
  data: () => ({
    addListingDialog: false,
  }),
});
</script>
