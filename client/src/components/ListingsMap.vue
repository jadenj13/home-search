<template>
  <v-layout xs12 ref="map" style="height: 100%">
    <v-flex v-if="requestingLocation">
      <span>Attempting to get your location.</span>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from '../utils/axios';

export default Vue.extend({
  name: 'listings-map',
  data() {
    return {
      requestingLocation: false,
      map: null as any,
      listings: [] as any[],
    };
  },
  methods: {
    getMapCenter() {
      return new Promise(resolve => {
        let mapCenter = { lat: 0, lng: 0 };
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              mapCenter = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(mapCenter);
            },
            err => {
              resolve(mapCenter);
            },
          );
        } else {
          resolve(mapCenter);
        }
      });
    },

    async getListings() {
      const bounds = this.map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const upperLat = ne.lat();
      const upperLng = ne.lng();
      const lowerLat = sw.lat();
      const lowerLng = sw.lng();

      const res = await axios.get(
        `/listings?upper-lat=${upperLat}&lower-lat=${lowerLat}&upper-lng=${upperLng}&lower-lng=${lowerLng}`,
      );
      this.listings = res.data;
    },

    async initMap() {
      this.requestingLocation = true;
      const center = await this.getMapCenter();
      this.requestingLocation = false;
      this.map = new (window as any).google.maps.Map(this.$refs.map, {
        zoom: 13,
        center,
      });
      (window as any).google.maps.event.addListener(
        this.map,
        'idle',
        this.getListings,
      );
    },
  },
  async mounted() {
    await this.initMap();
  },
  watch: {
    listings(newValue) {
      newValue.forEach((listing: any) => {
        const content = `<div style="word-wrap: wrap; width: 275px;"><img src="${
          listing.imageUrl
        }" style="display: block; height: 150px; margin: 0 auto 10px auto;" /><ul><h4>${
          listing.address
        }</h4><li style="margin: 5px 0;">$${
          listing.askingPrice
        }</li><li style="margin: 5px 0;">${
          listing.ownersName
        }</li><li style="margin: 5px 0;">${
          listing.propertyDescription
        }</li></ul></div>`;

        const infoWindow = new (window as any).google.maps.InfoWindow({
          content,
        });

        const marker = new (window as any).google.maps.Marker({
          map: this.map,
          position: listing.coordinates,
        });

        marker.addListener('mouseover', () => {
          infoWindow.open(this.map, marker);
        });

        marker.addListener('mouseout', () => {
          infoWindow.close(this.map, marker);
        });
      });
    },
  },
});
</script>

