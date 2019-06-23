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
        <v-card-text>
          <v-container column>
            <v-layout v-if="isFetching" justify-center my-5>
              <v-progress-circular
                indeterminate
                size="100"
                color="primary"
              ></v-progress-circular>
            </v-layout>
            <v-layout v-else>
              <v-flex v-if="listings.length === 0">
                <span class="title">You don't have any listings yet!</span>
              </v-flex>
              <v-layout v-else>
                <v-flex
                  v-for="listing in listings"
                  :key="listing._id"
                  justify-space-around
                >
                  <listing
                    :details="listing"
                    @deleteListing="deleteListing($event)"
                  ></listing>
                </v-flex>
              </v-layout>
            </v-layout>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>

    <add-listing
      :show="addListingDialog"
      @listingSubmitted="getListings()"
      @close="addListingDialog = false"
    ></add-listing>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import AddListing from '@/components/AddListing.vue';
import Listing from '@/components/Listing.vue';
import axios from '../utils/axios';

export default Vue.extend({
  name: 'user-listings',
  components: {
    AddListing,
    Listing,
  },
  data: () => ({
    addListingDialog: false,
    isFetching: false,
    listings: [],
  }),
  methods: {
    async getListings() {
      this.isFetching = true;
      const res = await axios.get('/user/listings');
      this.listings = res.data;
      this.isFetching = false;
    },

    async deleteListing(id: string) {
      this.isFetching = true;
      await axios.delete(`/listing/${id}`);
      await this.getListings();
    },
  },
  async mounted() {
    await this.getListings();
  },
});
</script>
