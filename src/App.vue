<template>
  <TopBar title="Fighting Fantasy Adventure Sheet" />
  <RouterView v-slot="{ Component }">
    <KeepAlive include="AdventureSheet">
      <Component :is="Component" />
    </KeepAlive>
  </RouterView>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TopBar from './components/Topbar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: {
    TopBar,
    Footer,
  },
});
</script>
