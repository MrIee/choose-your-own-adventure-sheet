<template>
  <div class="tw-relative tw-pointer-events-none">
    <span
      :class="{
        stats__animated: true,
        stats__damage: isDamage,
        stats__gain: !isDamage,
        stats__move: isAnimated,
      }"
    >
      {{ statChangeText }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    statValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      statChangeText: '',
      isDamage: false,
      isAnimated: false,
    };
  },
  mounted() {
    const plusSign = this.statValue > 0 ? '+' : '';
    this.isDamage = this.statValue < 0 ? true : false;
    this.statChangeText = `${plusSign}${this.statValue}`;

    // Use setTimeout to append '.stats__move' to '.stats__animated' after a delay
    // so that the css transition works

    setTimeout(() => {
      this.isAnimated = true;
    }, 100);
  },
});
</script>

<style>
.stats__damage {
  @apply tw-text-red-500;
}

.stats__gain {
  @apply tw-text-green-500;
}

.stats__animated {
  @apply tw-font-bold
  tw-transition-all
  tw-delay-200
  tw-duration-1000
  tw-absolute
  -tw-right-8;
}

span.stats__move {
  @apply tw-right-2 tw-opacity-0;
}
</style>
