<template>
  <div class="box">
    <h3>{{ label }}</h3>
    <div class="tw:flex tw:mb-4">
      <span class="tw:mr-2">Add item</span>
      <input class="tw:mr-2" type="text" name="addItem" v-model="newItem" />
      <button @click="addItem(newItem)"><PlusIcon /></button>
    </div>
    <!-- <Draggable
      :ref="inventoryRef"
      class="tw:h-96 tw:overflow-auto"
      :list="itemsList"
      item-key="item"
      handle=".inventory__sort-icon"
    >
      <template #item="{ element, index }">
        <div class="tw:flex tw:items-center tw:mb-2">
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
    </Draggable> -->

    <Draggable :ref="inventoryRef" class="tw:h-96 tw:overflow-auto" :list="itemsList" handle=".inventory__sort-icon">
      <div v-for="(item, index) in itemsList" :key="item.id">
        <div class="tw:flex tw:items-center tw:mb-2">
          <span class="inventory__sort-icon"></span>
          <input class="inventory__item" type="text" v-model="item.name" />
          <NumberInput
            class="inventory__quantity"
            v-model="item.quantity"
            :min="1"
          />
          <span class="inventory__remove-icon" @click="removeItem(index)" />
        </div>
      </div>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { nanoid } from 'nanoid';
import PlusIcon from '../components/icons/Plus.vue';
import { VueDraggableNext } from 'vue-draggable-next';
import NumberInput from './inputs/NumberInput.vue';

const emptyItemNames: Array<string> = [
  'Pocket lint',
  'Air',
  'Dust bunnies',
  'Empty slot',
  '',
];

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
};

export default defineComponent({
  components: {
    PlusIcon,
    Draggable: VueDraggableNext,
    NumberInput,
  },
  props: {
    label: {
      type: String,
      default: 'Inventory',
    },
    items: {
      type: Array<InventoryItem>,
      default: (): Array<InventoryItem> => [],
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
      const inventoryEl: HTMLElement = (this.$refs[this.inventoryRef] as typeof this).$el;
      let newItemName: string = value;

      if (value === '') {
        newItemName = emptyItemNames[Math.floor(Math.random() * emptyItemNames.length)] || '';
      }

      this.itemsList.push({ id: nanoid(), name: newItemName, quantity: 1 });
      this.$nextTick(() => { inventoryEl.scrollTop = inventoryEl.scrollHeight; });
    },
  },
});
</script>

<style>
@reference '../assets/css/tailwind.css';

.inventory__sort-icon {
  @apply tw:inline-block  tw:h-2.5 tw:w-4 tw:mr-2 tw:cursor-n-resize tw:relative;
}

.inventory__sort-icon::before,
.inventory__sort-icon::after {
  height: 0.1875rem;
  content: '';

  @apply tw:w-full tw:absolute tw:bg-black tw:opacity-20;
}

.inventory__sort-icon::before {
  top: 0;
}

.inventory__sort-icon::after {
  bottom: 0;
}

.inventory__item {
  @apply tw:w-full tw:px-1 tw:mr-1;
}

input[type='number'].inventory__quantity {
  @apply tw:w-12;
}

.inventory__add-icon {
  @apply tw:inline-block
  tw:h-4
  tw:w-4
  tw:ml-2
  tw:cursor-pointer
  tw:relative
  tw:text-3xl
  tw:select-none;
}

.inventory__add-icon:before,
.inventory__add-icon:after {
  content: '';

  @apply tw:h-0.5 tw:w-full tw:absolute tw:bg-black tw:top-1/2 tw:-translate-y-1/2;
}

.inventory__add-icon:after {
  @apply tw:-rotate-90;
}

.inventory__remove-icon {
  @apply tw:inline-block tw:h-5 tw:w-5 tw:ml-2 tw:cursor-pointer tw:relative;
}

.inventory__remove-icon:before,
.inventory__remove-icon:after {
  content: '';

  @apply tw:h-0.5 tw:w-full tw:absolute tw:bg-black tw:top-1/2 tw:-translate-y-1/2;
}

.inventory__remove-icon:before {
  @apply tw:rotate-45;
}

.inventory__remove-icon:after {
  @apply tw:-rotate-45;
}
</style>
