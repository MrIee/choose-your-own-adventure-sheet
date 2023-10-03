<template>
  <input
    :ref="inputRef"
    type="number"
    :value="modelValue || value"
    :max="max"
    :min="min"
    @mousewheel="() => {}"
    @input="limitValue"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 99,
    },
    min: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      inputRef: 'js-number-input',
      currentValue: this.value,
    };
  },
  watch: {
    value(value: number): void {
      this.currentValue = value;
    },
    max(newValue: number, oldValue: number): void {
      if (newValue < oldValue) {
        this.limitValue();
      }
    },
  },
  methods: {
    limitValue(): void {
      const regex = /^\d{3}$/;
      const divisor = 10;
      const inputElement = this.$refs[this.inputRef] as typeof this;
      const value = parseInt(inputElement.value.toString(), 10);

      this.currentValue = value;

      if (regex.test(this.currentValue.toString())) {
        this.currentValue = Math.floor(this.currentValue / divisor);
      }

      if (this.currentValue < this.min) {
        this.currentValue = this.min;
      }

      if (this.currentValue > this.max) {
        this.currentValue = this.max;
      }

      if (this.modelValue) {
        this.$emit('update:modelValue', value);
      }

      this.$emit('update', this.currentValue);
    },
  },
});
</script>
