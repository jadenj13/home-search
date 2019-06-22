<template>
  <div>
    <user-listings></user-listings>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import UserListings from '@/components/UserListings.vue';

export default Vue.extend({
  name: 'account',
  components: {
    UserListings,
  },
  computed: {
    ...mapState(['user']),
  },
  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      if (!vm.user) {
        vm.$router.replace('/');
      }
    });
  },
});
</script>
