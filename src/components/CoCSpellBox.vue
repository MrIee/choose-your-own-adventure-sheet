<template>
  <div>
    <StatBox
      label="Magic"
      :current-stat="modelValue"
      show-roll-stats-button
      :disable-controls="true"
      :is-read-only="true"
      @update="onUpdateMagic"
      @randomize-stats="onClickRandomizeMagic"
    >
      <Modal size="large">
        <template #button>
          <button :disabled="isSpellsDisabled">Spells</button>
        </template>
        <template #header>Magic Spells</template>
        <template #body>
          <p v-if="isSpellsChosen">
            You can now use a spell by clicking on it. Not all of them have an
            effect on the adventure sheet however...
          </p>
          <p v-else>
            Choose the number of spells you will use during your adventure. You
            can only pick a number of spells equal to your magic points. You may
            however choose multiple instances of a single spell e.g. Your magic
            is 11, you can choose 3x stamina, 3x luck, 2x Creature Copy, 2x
            Illusion, 1x E.S.P and 1x Creature Copy.
          </p>
          <h3 v-if="!isSpellsChosen">
            <span class="tw:font-normal">Magic points remaining:</span>
            {{ magicPoints }}
          </h3>
          <div v-if="selectedSpell" class="spells__description">
            <div v-if="selectedSpell.description">
              <h3>{{ selectedSpell.name }}</h3>
              <p>{{ selectedSpell.description }}</p>
            </div>
            <p v-else>
              Hover over a spell to see a description of what it does
            </p>
          </div>

          <ul class="spells__list">
            <li
              class="tw:w-full tw:sm:w-1/2 tw:lg:w-full tw:inline-flex tw:justify-center tw:mb-3"
              v-for="(spell, index) in spells"
              :key="index"
            >
              <button
                v-if="isSpellsChosen"
                class="tw:w-4/5"
                @mouseover="selectedSpell = spell"
                @click="doSpellEffect(spell.name)"
              >
                {{ spell.name }}
              </button>
              <div
                v-else
                class="spells__spell-wrapper"
                @mouseover="selectedSpell = spell"
              >
                <span
                  class="texture-el tw:w-36 tw:rounded-tr-none tw:rounded-br-none"
                >
                  {{ spell.name }}
                </span>
                <NumberInput
                  v-if="!isSpellsChosen"
                  class="tw:-ml-px"
                  v-model="spell.quantity"
                  :is-left-side-rounded="false"
                  is-read-only
                  @increment="onIncrementSpellCount(index)"
                  @decrement="onDecrementSpellCount(index)"
                />
              </div>
            </li>
          </ul>
        </template>
        <template v-if="!isSpellsChosen" #footer>
          <button
            class="tw:px-20"
            :disabled="isDoneDisabled"
            @click="onClickDone"
          >
            Done
          </button>
        </template>
      </Modal>
    </StatBox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  COCSPELLS as spells,
  SPELL_NAMES as spellNames,
  CALLOUTS as callouts,
} from '../constants/constants';
import { mapActions } from 'pinia';
import { adventureSheetStore } from '../stores/AdventureSheetStore';
import Modal from './Modal.vue';
import StatBox from './StatBox.vue';
import NumberInput from './inputs/NumberInput.vue';

interface Spell {
  name: string;
  description: string;
  quantity: number;
}

export default defineComponent({
  components: {
    Modal,
    StatBox,
    NumberInput,
  },
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    stamina: {
      type: Number,
      default: 1,
    },
    skill: {
      type: Number,
      default: 1,
    },
    luck: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      spells: spells as Array<Spell>,
      magicPoints: 0,
      maxMagicPoints: 0,
      selectedSpell: {},
      isSpellsDisabled: true,
      isDoneDisabled: true,
      isSpellsChosen: false,
      oldQuantity: new Array<number>(),
    };
  },
  watch: {
    modelValue(value): void {
      console.log('magic changed', value);
      this.magicPoints = value;
      this.maxMagicPoints = value;
    },
    magicPoints(value): void {
      if (value > this.maxMagicPoints) {
        this.magicPoints = this.maxMagicPoints;
      }

      if (value < 0) {
        this.magicPoints = 0;
      }

      if (value === 0) {
        this.isDoneDisabled = false;
      } else {
        this.isDoneDisabled = true;
      }
    },
  },
  methods: {
    ...mapActions(adventureSheetStore, ['addCallout', 'addSkillBonus']),
    onUpdateMagic(value: number): void {
      console.log('value:', value);
      this.$emit('update:modelValue', value);
    },
    onClickRandomizeMagic(): void {
      this.isSpellsDisabled = false;
      this.spells.forEach((spell): void => {
        spell.quantity = 0;
      });
      this.$emit('randomize-magic');
    },
    onIncrementSpellCount(index: number): void {
      this.magicPoints -= 1;

      if (this.magicPoints < 0) {
        this.spells[index].quantity = this.spells[index].quantity - 1;
      }

      this.oldQuantity[index] = this.spells[index].quantity;
    },
    onDecrementSpellCount(index: number): void {
      const quantity = this.spells[index].quantity;

      if (quantity >= 0 && this.oldQuantity[index] > 0) {
        this.magicPoints += 1;
      }

      this.oldQuantity[index] = quantity;
    },
    onClickDone() {
      this.isSpellsChosen = true;
    },
    doSpellEffect(name: string): void {
      if (name === spellNames.STRENGTH) {
        console.log('Using strength!');
        const skillBonus = 3;
        this.addSkillBonus(skillBonus);
        this.addCallout(
          callouts.STRENGTH,
          'Strength spell active: +3 to attack roll during next combat'
        );
      }
    },
  },
});
</script>

<style>
@reference '../assets/css/tailwind.css';

.spells__description {
  border: 4px inset rgba(255, 255, 255, 0.4);
  background-color: rgba(255, 255, 255, 0.4);

  @apply tw:h-48 tw:p-2 tw:mb-4 tw:overflow-y-auto;
}

.spells__list {
  column-gap: 12px;

  @apply tw:lg:columns-2;
}

.spells__spell-wrapper {
  @apply tw:flex tw:justify-center;
}

.spells__spell-wrapper:hover {
  border: 4px outset rgba(238, 218, 167, 0.6);
  border-radius: 6px;

  @apply tw:-my-1;
}
</style>
