<template>
  <button
    class="tw-px-7 tw-py-3 tw-text-xl tw-font-bold"
    :disabled="isDisabled"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick(): void {
      this.$emit('click');
    },
  },
});
</script>
