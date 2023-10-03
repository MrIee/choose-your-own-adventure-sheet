<template>
  <img
    v-if="imgUrl"
    class="tw-hidden sm:tw-block tw-w-72 tw-mx-auto tw-mt-3 tw-mb-6"
    :src="imgUrl"
    alt="Sheet divider graphic"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    imgUrl: {
      type: String,
      default: undefined,
    },
  },
});
</script>
