<template>
  <div
    class="tw:font-sans tw:py-3 tw:px-6 tw:rounded"
    :class="{
      'tw:bg-blue-400': variant === 'info',
      'tw:bg-red-400': variant === 'error',
      'tw:bg-green-400': variant === 'success',
      'tw:bg-yellow-400': variant === 'warning',
      'tw:text-grayscale-800': variant === 'warning',
    }"
  >
    <div class="tw:flex">
      <div class="tw:w-full tw:flex tw:flex-col tw:lg:flex-row">
        <div class="tw:lg:mr-8">
          <p
            v-if="description"
            class="tw:m-0 tw:leading-tight tw:mb-2 tw:lg:mb-0"
          >
            {{ description }}
          </p>
        </div>
      </div>
      <CrossIcon class="tw:cursor-pointer" @click="onClickClose()" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CrossIcon from './icons/Cross.vue';

export default defineComponent({
  components: {
    CrossIcon,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: undefined,
    },
    variant: {
      type: String, // info, error, success, warning
      required: false,
      default: 'success',
    },
  },
  methods: {
    onClickClose(): void {
      this.$emit('close', this.label);
    },
  },
});
</script>
