<template>
  <div class="topbar">
    <div class="wrapper tw-flex tw-items-center tw-text-white">
      <h2 class="tw-text-base sm:tw-text-xl tw-mr-6">{{ title }}</h2>
      <ul class="topbar__nav">
        <li><router-link to="/">Home</router-link></li>
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
  @apply tw-w-full
  tw-flex
  tw-justify-center
  tw-fixed
  tw-top-0
  tw-z-10
  tw-h-14
  tw-px-4
  sm:tw-px-0
  tw-py-3
  tw-bg-gray-800;
}

.topbar__nav li {
  @apply tw-inline-block;
}

.topbar__nav li {
  @apply tw-mr-3 last:tw-mr-0;
}
</style>
