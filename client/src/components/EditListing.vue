<template>
  <v-dialog v-model="show" max-width="700" persistent v-if="listingData">
    <v-card>
      <v-card-title>
        <h4 class="display-1">{{ listingData.address }}</h4>
        <v-layout justify-end>
          <v-btn icon flat @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-form @submit="editListing()">
            <v-text-field
              label="Owner's Name"
              type="text"
              v-model="listingData.ownersName"
              required
            />
            <v-text-field
              label="Asking Price"
              type="number"
              v-model="listingData.askingPrice"
              required
            />
            <v-text-field
              label="Image URL"
              type="string"
              v-model="listingData.imageUrl"
              required
            />
            <v-text-field
              label="Property Description"
              type="string"
              v-model="listingData.propertyDescription"
              required
            />
            <v-layout justify-end>
              <v-btn
                raised
                class="primary"
                type="submit"
                :disabled="saveDisabled"
              >
                <span class="text-uppercase">Save</span>
              </v-btn>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from '../utils/axios';

export default Vue.extend({
  props: {
    show: Boolean,
    listing: Object,
  },
  data() {
    return {
      askingPrice: null,
      listingData: { ...this.listing },
      isFetching: false,
    };
  },
  computed: {
    saveDisabled(): boolean {
      return (
        !this.listing.ownersName ||
        !this.listing.askingPrice ||
        !this.listing.imageUrl ||
        !this.listing.propertyDescription ||
        this.isFetching
      );
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },

    async editListing() {
      this.isFetching = true;
      await axios.put(`/listing/${this.listingData._id}`, this.listingData);
      this.isFetching = false;
      this.$emit('saved');
      this.$emit('close');
    },
  },
});
</script>
