<template>
  <div class="tw:inline-flex tw:relative">
    <button
      v-if="!disableControls"
      :class="{
        'number-input__button number-input__minus': true,
        'tw:rounded-tl-none tw:rounded-bl-none': !isLeftSideRounded,
      }"
      @click="decrementValue"
    >
      <MinusIcon />
    </button>
    <input
      :ref="inputRef"
      :class="{
        'number-input__input': true,
        'tw:cursor-default': isReadOnly,
      }"
      type="text"
      :value="modelValue || value"
      inputmode="numeric"
      @mousewheel="onMouseWheel"
      @keydown.up="incrementValue"
      @keydown.down="decrementValue"
      @input="validateInput"
      :readonly="isReadOnly"
    />
    <button
      v-if="!disableControls"
      :class="{
        'number-input__button number-input__plus': true,
        'tw:rounded-tr-none tw:rounded-br-none': !isRightSideRounded,
      }"
      @click="incrementValue"
    >
      <PlusIcon />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PlusIcon from '../icons/Plus.vue';
import MinusIcon from '../icons/Minus.vue';

export default defineComponent({
  components: {
    PlusIcon,
    MinusIcon,
  },
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
    disableControls: {
      type: Boolean,
      default: false,
    },
    isLeftSideRounded: {
      type: Boolean,
      default: true,
    },
    isRightSideRounded: {
      type: Boolean,
      default: true,
    },
    isReadOnly: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      inputRef: 'js-number-input',
      currentValue: this.value,
      oldValue: this.value,
    };
  },
  watch: {
    value(value: number): void {
      this.currentValue = value;
    },
    max(newValue: number, oldValue: number): void {
      if (newValue < oldValue) {
        this.$nextTick(() => {
          if (this.currentValue > this.max) {
            this.setInputElementValue(this.max);
          }
        });
      }
    },
  },
  methods: {
    getInputElementValue(): string {
      const inputElement = this.$refs[this.inputRef] as HTMLInputElement;
      return inputElement.value;
    },
    setInputElementValue(value: number): void {
      const inputElement = this.$refs[this.inputRef] as HTMLInputElement;
      inputElement.value = value.toString();
      this.currentValue = value;
    },
    decrementValue(): void {
      if (this.disableControls) {
        return;
      }

      this.setInputElementValue(parseInt(this.getInputElementValue()) - 1);
      this.validateInput();
      this.$emit('decrement');
    },
    incrementValue(): void {
      if (this.disableControls) {
        return;
      }

      this.setInputElementValue(parseInt(this.getInputElementValue()) + 1);
      this.validateInput();
      this.$emit('increment');
    },
    onMouseWheel(event: WheelEvent): void {
      if (this.isReadOnly || this.disableControls) {
        return;
      }

      const inputElement = this.$refs[this.inputRef] as HTMLInputElement;

      if (inputElement === document.activeElement) {
        event.preventDefault();
        const deltaY = (event as WheelEvent).deltaY;

        if (deltaY > 0) {
          this.setInputElementValue(this.currentValue - 1);
        } else {
          this.setInputElementValue(this.currentValue + 1);
        }

        this.validateInput();
      }
    },
    emitUpdateEvent(): void {
      if (this.modelValue) {
        this.$emit('update:modelValue', this.currentValue);
      }

      this.$emit('update', this.currentValue);
    },
    validateInput(): void {
      const value = this.getInputElementValue();
      const inputFilter = /^\d*$/.test(value);
      this.currentValue = parseInt(value);

      if (
        inputFilter &&
        this.currentValue >= this.min &&
        this.currentValue <= this.max
      ) {
        this.oldValue = this.currentValue;
      } else {
        this.setInputElementValue(this.oldValue);
      }

      if (value === '') {
        this.setInputElementValue(0);
      }

      this.$emit('update:modelValue', this.currentValue);
      this.$emit('update', this.currentValue);
    },
  },
});
</script>

<style>
@reference '../../assets/css/tailwind.css';
.number-input__button {
  padding-left: 9px;
  padding-right: 9px;
}

.number-input__minus {
  @apply tw:rounded-tr-none tw:rounded-br-none;
}
.number-input__plus {
  @apply tw:rounded-tl-none tw:rounded-bl-none;
}

.number-input__input {
  @apply tw:w-12 tw:p-1 tw:rounded-none tw:text-center;
}
</style>
