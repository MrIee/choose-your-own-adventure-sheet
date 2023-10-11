<template>
  <div class="tw-w-full md:tw-w-1/2 box">
    <div class="tw-flex tw-justify-between">
      <h3>Monster Encounter</h3>
      <button
        v-if="isRemoveButtonVisible"
        class="tw-px-4"
        @click="onClickRemove"
      >
        Remove
      </button>
    </div>
    <div class="monster-box__field">
      <span class="monster-box__label">Name:</span>
      <input
        class="tw-max-w-full"
        type="text"
        :value="name"
        @input="onUpdateName"
      />
    </div>
    <div class="monster-box__field">
      <span class="monster-box__label">Skill:</span>
      <NumberInput type="number" :value="skill" @update="onUpdateSkill" />
    </div>
    <div class="monster-box__field">
      <span class="monster-box__label">Stamina:</span>
      <NumberInput type="number" :value="stamina" @update="onUpdateStamina" />
      <StatAnimation v-if="showAnimationForStamina" :stat-value="statChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NumberInput from './inputs/NumberInput.vue';
import StatAnimation from './StatAnimation.vue';

export default defineComponent({
  components: {
    NumberInput,
    StatAnimation,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    skill: {
      type: Number,
      default: 1,
    },
    stamina: {
      type: Number,
      default: 1,
    },
    isRemoveButtonVisible: {
      type: Boolean,
      default: undefined,
    },
    showAnimation: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      showAnimationForStamina: false,
      statChange: 0,
    };
  },
  watch: {
    stamina(newValue: number, oldValue: number): void {
      this.showAnimationForStamina = false;

      if (newValue !== oldValue && this.showAnimation) {
        this.statChange = newValue - oldValue;
        this.$nextTick(() => {
          this.showAnimationForStamina = true;
        });
      }
    },
  },
  methods: {
    onUpdateName(event: InputEvent): void {
      this.$emit('update:name', (event.target as HTMLInputElement).value);
    },
    onUpdateSkill(value: number): void {
      this.$emit('update:skill', value);
    },
    onUpdateStamina(value: number): void {
      this.$emit('update:stamina', value);
    },
    onClickRemove(): void {
      this.$emit('click-remove-button');
    },
  },
});
</script>

<style>
.monster-box__label {
  @apply tw-w-20;
}

.monster-box__field {
  @apply tw-flex tw-mb-2;
}
</style>
