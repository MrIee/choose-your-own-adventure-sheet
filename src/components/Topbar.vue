<template>
  <div class="topbar">
    <div class="container tw-flex tw-items-center tw-text-white">
      <h2 class="tw-text-base sm:tw-text-xl">{{ title }}</h2>
    </div>
  </div>
  <div class="tw-mb-14"></div>
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
</style>
