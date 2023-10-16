<template>
  <TopBar title="Fighting Fantasy Adventure Sheet" />
  <div class="tw-mb-14"></div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopBar from './components/Topbar.vue';

export default defineComponent({
  components: {
    TopBar,
  },
});
</script>
