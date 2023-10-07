<template>
  <div class="box">
    <h3>{{ label }}</h3>
    <div class="tw-mb-4">
      <span class="tw-mr-2">Add item</span>
      <input type="text" class="tw-mb-2" name="addItem" v-model="newItem" />
      <span class="inventory__add-icon" @click="addItem(newItem)" />
    </div>
    <Draggable
      :ref="inventoryRef"
      class="tw-h-96 tw-overflow-auto"
      :list="itemsList"
      item-key="item"
      handle=".inventory__sort-icon"
    >
      <template #item="{ element, index }">
        <div class="tw-flex tw-items-center tw-mb-2">
          <span class="inventory__sort-icon"></span>
          <input class="inventory__item" type="text" v-model="element.name" />
          <NumberInput
            class="inventory__quantity"
            v-model="element.quantity"
            :min="1"
          />
          <span class="inventory__remove-icon" @click="removeItem(index)" />
        </div>
      </template>
      <template #footer>
        <div class="tw-pb-8" />
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Draggable from 'vuedraggable';
import NumberInput from './inputs/NumberInput.vue';

const emptyItemNames: Array<string> = [
  'Pocket lint',
  'Air',
  'Dust bunnies',
  'Empty slot',
  '',
];

export default defineComponent({
  components: {
    Draggable,
    NumberInput,
  },
  props: {
    label: {
      type: String,
      default: 'Inventory',
    },
    items: {
      type: Array,
      default: (): Array<object> => [],
    },
  },
  data() {
    return {
      inventoryRef: 'js-inventory',
      itemsList: this.items,
      newItem: '',
    };
  },
  methods: {
    removeItem(index: number): void {
      this.itemsList.splice(index, 1);
    },
    addItem(value: string): void {
      const inventory: typeof this = this.$refs[
        this.inventoryRef
      ] as typeof this;
      let newItemName: string = value;

      if (value === '') {
        newItemName =
          emptyItemNames[Math.floor(Math.random() * emptyItemNames.length)];
      }

      this.itemsList.push({ name: newItemName, quantity: 1 });
      inventory.$el.lastChild.scrollIntoView();
    },
  },
});
</script>

<style>
.inventory__sort-icon {
  @apply tw-inline-block  tw-h-2.5 tw-w-4 tw-mr-2 tw-cursor-n-resize tw-relative;
}

.inventory__sort-icon::before,
.inventory__sort-icon::after {
  height: 0.1875rem;
  content: '';

  @apply tw-w-full tw-absolute tw-bg-black tw-opacity-20;
}

.inventory__sort-icon::before {
  top: 0;
}

.inventory__sort-icon::after {
  bottom: 0;
}

.inventory__item {
  @apply tw-w-full tw-px-1 tw-mr-1;
}

.inventory__item:focus {
  @apply tw-bg-white;
}

input[type='number'].inventory__quantity {
  @apply tw-w-12;
}

.inventory__add-icon {
  @apply tw-inline-block
  tw-h-4
  tw-w-4
  tw-ml-2
  tw-cursor-pointer
  tw-relative
  tw-text-3xl
  tw-select-none;
}

.inventory__add-icon:before,
.inventory__add-icon:after {
  content: '';

  @apply tw-h-0.5 tw-w-full tw-absolute tw-bg-black tw-top-1/2 -tw-translate-y-1/2;
}

.inventory__add-icon:after {
  @apply -tw-rotate-90;
}

.inventory__remove-icon {
  @apply tw-inline-block tw-h-5 tw-w-5 tw-ml-2 tw-cursor-pointer tw-relative;
}

.inventory__remove-icon:before,
.inventory__remove-icon:after {
  content: '';

  @apply tw-h-0.5 tw-w-full tw-absolute tw-bg-black tw-top-1/2 -tw-translate-y-1/2;
}

.inventory__remove-icon:before {
  @apply tw-rotate-45;
}

.inventory__remove-icon:after {
  @apply -tw-rotate-45;
}
</style>
