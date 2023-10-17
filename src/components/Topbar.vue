<template>
  <div class="topbar">
    <div class="wrapper tw-flex tw-items-center">
      <h2 class="tw-text-base sm:tw-text-xl tw-mr-6">
        <router-link to="/">{{ title }}</router-link>
      </h2>
      <ul class="topbar__nav">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li><router-link to="/rules">Rules</router-link></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>

<style>
.topbar {
  @apply tw-h-14 tw-top-0;
}

.topbar__nav li {
  @apply tw-inline-block tw-mr-3 last:tw-mr-0;
}

.topbar__nav li > a {
  @apply tw-no-underline;
}
</style>
