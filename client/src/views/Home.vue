<template>
  <div class="home" style="height: 100%">
    <listings-map></listings-map>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ListingsMap from '@/components/ListingsMap.vue';

export default Vue.extend({
  name: 'home',
  components: {
    ListingsMap,
  },
});
</script>
