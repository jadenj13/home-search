<template>
  <v-dialog v-model="show" max-width="700" persistent>
    <v-card>
      <v-card-title>
        <h4 class="display-1">Add Listing</h4>
        <v-layout justify-end>
          <v-btn icon flat @click="close()">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text v-if="step === 'address'">
        <h6 class="title">Listing Address</h6>
        <v-container>
          <v-form>
            <v-text-field
              type="text"
              v-model="addressLine1"
              label="Address Line 1"
              required
            />
            <v-text-field
              type="text"
              v-model="addressLine2"
              label="Address Line 2"
            />
            <v-text-field type="text" v-model="city" label="City" required />
            <v-layout row wrap justify-space-between>
              <v-flex xs12 sm5>
                <v-select
                  v-model="state"
                  :items="states"
                  label="State"
                  single-line
                ></v-select>
              </v-flex>
              <v-flex xs12 sm5>
                <v-text-field
                  type="text"
                  v-model="zipCode"
                  label="Zip Code"
                  required
                />
              </v-flex>
            </v-layout>
            <v-layout justify-end>
              <v-btn
                raised
                class="primary"
                @click="submitAddress()"
                :disabled="addressFormDisabled"
              >
                <span class="text-uppercase">Next</span>
              </v-btn>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-text v-else-if="(step = 'confirmAddress')">
        <v-container v-show="isFetching" justify-center my-5>
          <v-progress-circular
            indeterminate
            size="100"
            color="primary"
          ></v-progress-circular>
        </v-container>
        <v-container v-show="!isFetching" column>
          <v-layout mb-4>
            <h6 class="title">Confirm Address</h6>
          </v-layout>
          <v-layout ref="map" style="height: 250px"></v-layout>
          <v-layout align-center column mt-3>
            <p class="subheading">{{ addressLine1 }}</p>
            <p v-if="addressLine2" class="subheading">{{ addressLine2 }}</p>
            <p class="subheading">{{ city }}, {{ state }} {{ zipCode }}</p>
          </v-layout>
        </v-container>
        <v-layout justify-end>
          <v-btn raised class="primary" @click="step = 'address'">
            <span class="text-uppercase">Previous</span>
          </v-btn>
          <v-btn raised class="primary" @click="step = 'details'">
            <span class="text-uppercase">Next</span>
          </v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import states from '../utils/states';

const geocoder = new (window as any).google.maps.Geocoder();

export default Vue.extend({
  props: {
    show: Boolean,
  },
  data: () => ({
    step: 'address',
    states,
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    isFetching: false,
    coordinates: null as null | { lat: number; lng: number },
    map: null as any,
    marker: null as any,
  }),
  computed: {
    addressFormDisabled(): boolean {
      return !this.addressLine1 || !this.city || !this.state || !this.zipCode;
    },
  },
  methods: {
    close() {
      this.$emit('close');
      this.step = 'address';
      this.addressLine1 = '';
      this.addressLine2 = '';
      this.city = '';
      this.state = '';
      this.zipCode = '';
      this.map = null;
      this.marker = null;
    },

    getListingCoordinates(): Promise<{ lat: number; lng: number }> {
      return new Promise((resolve, reject) => {
        const address = `${this.addressLine1} ${this.addressLine2}, ${
          this.city
        }, ${this.state} ${this.zipCode}`;

        geocoder.geocode({ address }, (res: any[], status: string) => {
          if (!res || !res.length || status !== 'OK') {
            reject('Address not found.');
          }

          const lat = res[0].geometry.location.lat();
          const lng = res[0].geometry.location.lng();
          resolve({ lat, lng });
        });
      });
    },

    async submitAddress() {
      this.step = 'confirmAddress';
      this.isFetching = true;
      this.coordinates = await this.getListingCoordinates();
      this.isFetching = false;

      this.map = new (window as any).google.maps.Map(this.$refs.map, {
        zoom: 16,
        center: this.coordinates,
      });
      this.marker = new (window as any).google.maps.Marker({
        position: this.coordinates,
        map: this.map,
      });
    },
  },
});
</script>
