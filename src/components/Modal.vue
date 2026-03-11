<template>
  <div @click="isVisible = true">
    <slot name="button" />
  </div>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="modal__background"
      @click.self="isVisible = false"
    />
    <div
      v-if="isVisible"
      :class="{
        modal: true,
        [size]: size,
      }"
    >
      <div class="modal__header">
        <slot name="header" />
        <div class="modal__cross-icon" @click="isVisible = false" />
      </div>
      <div
        :class="{
          modal__body: true,
          [size]: size,
        }"
      >
        <slot name="body" />
      </div>
      <div v-if="$slots.footer" class="modal__footer">
        <slot name="footer" />
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    size: {
      type: String,
      validator(value: string) {
        // The value must match one of these strings
        return ['small', 'regular', 'large'].includes(value);
      },
      default: 'regular',
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  watch: {
    isVisible(isVisible) {
      if (isVisible) {
        this.addCloseOnKeyDownEvent();
      } else {
        this.removeCloseOnKeyDownEvent();
      }
    },
  },
  unmounted() {
    document.removeEventListener('keydown', this.closeModalOnKeyDown);
  },
  methods: {
    enableBodyScroll(): void {
      document.body.style.overflow = 'auto';
    },
    disableBodyScroll(): void {
      document.body.style.overflow = 'hidden';
    },
    addCloseOnKeyDownEvent(): void {
      document.addEventListener('keydown', this.closeModalOnKeyDown);
      this.disableBodyScroll();
    },
    removeCloseOnKeyDownEvent(): void {
      document.removeEventListener('keydown', this.closeModalOnKeyDown);
      this.enableBodyScroll();
    },
    closeModalOnKeyDown(event: KeyboardEvent): void {
      const e = event || window.event;
      let isEscape = false;

      if ('key' in e) {
        isEscape = e.key === 'Escape' || e.key === 'Esc';
      } else {
        isEscape = (e as KeyboardEvent).keyCode === 27;
      }
      if (isEscape) {
        this.removeCloseOnKeyDownEvent();
        this.isVisible = false;
      }
    },
  },
});
</script>

<style>
@reference '../assets/css/tailwind.css';

@media (min-width: 768px) {
  .modal.small {
    width: 700px;
  }

  .modal__body {
    max-height: 550px;
  }

  .modal__body.small {
    max-height: 400px;
  }

  .modal__body.large {
    max-height: 700px;
  }
}

@media (min-width: 1024px) {
  .modal {
    width: 800px;
  }

  .modal.large {
    width: 900px;
  }
}

.modal {
  background-image: url('../assets/images/old-paper-texture.jpg');
  border-radius: 4px;

  @apply tw:md:w-3/4
  tw:flex
  tw:flex-col
  tw:fixed
  tw:md:top-1/2
  tw:md:-translate-y-1/2
  tw:top-0
  tw:left-0
  tw:right-0
  tw:md:bottom-auto
  tw:bottom-0
  tw:mx-auto
  tw:z-30;
}

.modal__background {
  background-color: rgba(0, 0, 0, 0.6);

  @apply tw:fixed
  tw:w-full
  tw:h-full
  tw:top-0
  tw:left-0
  tw:right-0
  tw:bottom-0
  tw:z-20;
}

.modal__header,
.modal__footer {
  /* background-color: rgb(252, 245, 229); */
  background-color: #f2e7c7;

  @apply tw:flex tw:justify-center tw:items-center tw:border-solid tw:border-gray-800;
}

.modal__header {
  @apply tw:relative tw:border-b tw:h-16 tw:text-xl tw:font-semibold;
}

.modal__body {
  @apply tw:h-full tw:flex-grow tw:p-5 tw:overflow-y-auto;
}

.modal__footer {
  @apply tw:border-t tw:p-3;
}

.modal__cross-icon {
  @apply tw:absolute tw:top-1/2 tw:-translate-y-1/2 tw:right-5 tw:hover:cursor-pointer;
}

.modal__cross-icon:before,
.modal__cross-icon:after,
.modal__cross-icon {
  @apply tw:w-4 tw:h-4;
}

.modal__cross-icon:before,
.modal__cross-icon:after {
  content: '';

  @apply tw:block
  tw:absolute
  tw:h-0.5
  tw:bg-gray-800
  tw:top-1/2
  tw:-translate-y-1/2
  tw:left-0
  tw:right-0
  tw:mx-auto;
}

.modal__cross-icon:before {
  @apply tw:rotate-45;
}

.modal__cross-icon:after {
  @apply tw:-rotate-45;
}
</style>
