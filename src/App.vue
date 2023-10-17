<template>
  <TopBar title="Fighting Fantasy Adventure Sheet" />
  <RouterView v-slot="{ Component }">
    <KeepAlive include="AdventureSheet">
      <Component :is="Component" />
    </KeepAlive>
  </RouterView>
  <footer class="footer tw-h-10 tw-bottom-0">
    <div class="wrapper tw-flex tw-items-center tw-justify-center">
      <span class="tw-mr-1">
        For more info or suggestions, visit the project page on
      </span>
      <a href="https://github.com/MrIee/choose-your-own-adventure-sheet">
        github
      </a>
    </div>
  </footer>
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
