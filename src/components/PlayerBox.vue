<template>
  <div class="tw-w-full md:tw-w-1/2 box">
    <h3 class="tw-mb-3">Player</h3>
    <div class="tw-flex tw-mb-3">
      <label class="tw-mr-2" for="playerName">Name:</label>
      <input
        class="tw-w-full sm:tw-w-auto"
        type="text"
        :value="playerName"
        @input="onUpdatePlayerName"
      />
    </div>
    <div class="tw-flex">
      <div>
        <div class="stats__cell" />
        <div class="stats__row stats__label stats__cell">Skill</div>
        <div class="stats__row stats__label stats__cell">Stamina</div>
        <div class="stats__row stats__label stats__cell">Luck</div>
      </div>
      <div class="stats__column">
        <div class="stats__cell">Initial</div>
        <div class="stats__row stats__cell">
          <NumberInput :value="initialSkill" @update="onUpdateInitialSkill" />
        </div>
        <div class="stats__row stats__cell">
          <NumberInput
            :value="initialStamina"
            @update="onUpdateInitialStamina"
          />
        </div>
        <div class="stats__row stats__cell">
          <NumberInput :value="initialLuck" @update="onUpdateInitialLuck" />
        </div>
      </div>
      <div class="stats__column">
        <div class="stats__cell">Current</div>
        <div class="stats__row stats__cell">
          <NumberInput
            :value="currentSkill"
            :max="initialSkill"
            @update="onUpdateSkill"
          />
        </div>
        <div class="stats__row stats__cell">
          <StatAnimation
            v-if="showAnimationForStamina"
            :is-damage="isDamageAnimation"
            :stat-value="statChange"
          />
          <NumberInput
            :value="currentStamina"
            :max="initialStamina"
            @update="onUpdateStamina"
          />
        </div>
        <div class="stats__row stats__cell">
          <StatAnimation v-if="showAnimationForLuck" :stat-value="statChange" />
          <NumberInput
            :value="currentLuck"
            :max="initialLuck"
            @update="onUpdateLuck"
          />
        </div>
      </div>
    </div>
    <div>
      <button
        class="tw-mt-3"
        @click="onClickRandomizeStats"
        :disabled="isRollStatsDisabled"
      >
        Roll Stats
      </button>
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
    playerName: {
      type: String,
      default: 'Player',
    },
    initialSkill: {
      type: Number,
      default: 1,
    },
    currentSkill: {
      type: Number,
      default: 1,
    },
    initialStamina: {
      type: Number,
      default: 1,
    },
    currentStamina: {
      type: Number,
      default: 1,
    },
    initialLuck: {
      type: Number,
      default: 1,
    },
    currentLuck: {
      type: Number,
      default: 1,
    },
    isRollStatsDisabled: {
      type: Boolean,
      default: false,
    },
    showAnimation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      statChange: 0,
      showAnimationForSkill: false,
      showAnimationForStamina: false,
      showAnimationForLuck: false,
      isDamageAnimation: false,
    };
  },
  watch: {
    currentStamina(newValue: number, oldValue: number): void {
      this.showAnimationForStamina = false;

      if (newValue !== oldValue && this.showAnimation) {
        this.statChange = newValue - oldValue;
        this.$nextTick(() => {
          this.showAnimationForStamina = true;
        });
      }
    },
    currentLuck(newValue: number, oldValue: number): void {
      this.showAnimationForLuck = false;

      if (newValue !== oldValue && this.showAnimation) {
        this.statChange = newValue - oldValue;
        this.$nextTick(() => {
          this.showAnimationForLuck = true;
        });
      }
    },
  },
  methods: {
    onUpdatePlayerName(event: Event): void {
      this.$emit(
        'update:player-name',
        (event.target as HTMLInputElement).value
      );
    },
    onUpdateInitialSkill(value: number): void {
      this.$emit('update:initialSkill', value);
    },
    onUpdateSkill(value: number): void {
      this.$emit('update:current-skill', value);
    },
    onUpdateInitialStamina(value: number): void {
      this.$emit('update:initialStamina', value);
    },
    onUpdateStamina(value: number): void {
      this.$emit('update:current-stamina', value);
    },
    onUpdateInitialLuck(value: number): void {
      this.$emit('update:initialLuck', value);
    },
    onUpdateLuck(value: number): void {
      this.$emit('update:current-luck', value);
    },
    onClickRandomizeStats() {
      this.$emit('randomize-stats');
    },
  },
});
</script>

<style>
.stats__label {
  @apply tw-mr-3;
}

.stats__cell {
  @apply tw-h-8;
}

.stats__row {
  @apply tw-mb-2 last:tw-mb-0;
}

.stats__column {
  @apply tw-flex tw-flex-col tw-mr-3;
}

.stats__damage {
  @apply tw-text-red-500;
}

.stats__gain {
  @apply tw-text-green-500;
}

.stats__animated {
  top: 6%;

  @apply tw-font-bold
  tw-transition-all
  tw-duration-1000
  tw-absolute
  -tw-right-8;
}

.stats__moved {
  @apply tw-right-2 tw-opacity-0;
}
</style>
