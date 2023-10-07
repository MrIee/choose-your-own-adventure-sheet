<template>
  <div class="box">
    <h3>{{ label }}</h3>
    <NumberInput :value="modelValue" @update="onUpdateQuantity" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NumberInput from './inputs/NumberInput.vue';

export default defineComponent({
  components: {
    NumberInput,
  },
  props: {
    label: {
      type: String,
      default: 'Notes',
    },
    modelValue: {
      type: Number,
      default: undefined,
    },
  },
  methods: {
    onUpdateQuantity(value: number): void {
      this.$emit('update:modelValue', value);
    },
  },
});
</script>
