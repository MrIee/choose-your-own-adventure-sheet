<template>
  <div class="box">
    <h3>{{ label }}</h3>
    <div class="tw:flex">
      <div v-if="initialStat" class="tw:mr-3">
        <div class="stats__cell">Initial {{ label }}:</div>
        <div class="stats__cell">{{ label }}:</div>
      </div>
      <div>
        <div v-if="initialStat" class="stats__cell">
          <NumberInput
            :value="initialStat"
            :disable-controls="disableControls"
            :is-read-only="isReadOnly"
            @update="onUpdateInitialStat"
          />
          <StatAnimation
            v-if="showAnimationForStat"
            :stat-value="statChange"
          />
        </div>
        <div class="stats__cell">
          <NumberInput
            :value="currentStat"
            :max="max"
            :min="0"
            :disable-controls="disableControls"
            :is-read-only="isReadOnly"
            @update="onUpdateStat"
          />
        </div>
      </div>
    </div>
    <div v-if="showRollStatsButton" class="tw:flex tw:mt-3">
      <button
        class="tw:mr-3"
        :disabled="isRollStatsDisabled"
        @click="onClickRandomizeStats"
      >
        Roll {{ label }}
      </button>
      <slot />
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
    label: {
      type: String,
      default: 'Stat',
    },
    initialStat: {
      type: Number,
      default: 0,
    },
    currentStat: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 99,
    },
    showRollStatsButton: {
      type: Boolean,
      default: false,
    },
    isRollStatsDisabled: {
      type: Boolean,
      default: false,
    },
    showAnimation: {
      type: Boolean,
      default: false,
    },
    disableControls: {
      type: Boolean,
      default: false,
    },
    isReadOnly: {
      type: Boolean,
      default: undefined,
    },
  },
  data() {
    return {
      statChange: 0,
      showAnimationForStat: false,
    };
  },
  watch: {
    currentStat(newValue: number, oldValue: number): void {
      this.showAnimationForStat = false;

      if (newValue !== oldValue && this.showAnimation) {
        this.statChange = newValue - oldValue;
        this.$nextTick(() => {
          this.showAnimationForStat = true;
        });
      }
    },
  },
  methods: {
    onUpdateInitialStat(value: number): void {
      this.$emit('update:initial-stat', value);
    },
    onUpdateStat(value: number): void {
      this.$emit('update:current-stat', value);
      this.$emit('update', value);
    },
    onClickRandomizeStats() {
      this.$emit('randomize-stats');
    },
  },
});
</script>

<style>
@reference '../assets/css/tailwind.css';

.stats__cell {
  @apply tw:h-8 tw:flex tw:items-center;
}
</style>
