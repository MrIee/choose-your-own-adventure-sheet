<template>
  <div class="box">
    <h3>{{ label }}</h3>
    <textarea
      class="tw-py-1 tw-px-2"
      rows="8"
      :value="modelValue"
      @input="onInput"
    ></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      default: 'Notes',
    },
    modelValue: {
      type: String,
      default: undefined,
    },
  },
  methods: {
    onInput(event: InputEvent): void {
      this.$emit('update:modelValue', (event.target as HTMLInputElement).value);
    },
  },
});
</script>
