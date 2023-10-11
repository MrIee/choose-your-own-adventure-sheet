<template>
  <TopBar title="Fighting Fantasy Adventure Sheet" />
  <div class="tw-hidden sm:tw-block tw-mt-20 tw-text-center tw-font-semibold">
    <span class="tw-text-lg tw-opacity-50">
      Fighting Fantasy - Choose your own Adventure!
    </span>
    <br />
    <h1>Adventure Sheet</h1>
  </div>
  <div class="sheet container box">
    <div class="tw-w-full tw-flex tw-flex-col tw-mb-3">
      <Divider :img-url="require('@/assets/images/sword.png')" />
      <div class="tw-flex tw-justify-center tw-mb-4">
        <div class="tw-flex tw-flex-col">
          <strong
            v-if="diceMode === diceModeCombat || diceModeCombatLuck"
            class="tw-mx-auto"
          >
            Player
          </strong>
          <div class="tw-flex">
            <Dice
              v-for="(dice, index) in playerDice"
              :key="index"
              :roll-dice="rollForPlayer"
              @roll="getPlayerRoll"
            />
          </div>
        </div>
        <div v-if="monsterDice > 0" class="tw-flex tw-flex-col tw-ml-9">
          <strong
            v-if="diceMode === diceModeCombat || diceModeCombatLuck"
            class="tw-mx-auto"
          >
            {{ getMonsterName() }}
          </strong>
          <div class="tw-flex">
            <Dice
              v-for="(dice, index) in monsterDice"
              :key="index"
              :roll-dice="rollForMonster"
              @roll="getMonsterRoll"
            />
          </div>
        </div>
      </div>
      <div class="tw-flex tw-justify-center tw-mb-3">
        <select
          class="tw-h-14 tw-mr-3 tw-text-xl tw-px-1"
          :disabled="isRollDisabled"
          @change="onChangeDice"
        >
          <option
            v-for="(option, index) in diceOptions"
            :key="index"
            :value="option.value"
            :selected="option.value === defaultDiceOption"
          >
            {{ option.label }}
          </option>
        </select>
        <BigButton
          v-if="diceMode === diceModeCombat"
          :is-disabled="isCombatDiceDisabled"
          label="Roll!"
          @click="rollDice"
        />
        <BigButton
          v-else-if="diceMode === diceModeTestLuck"
          :is-disabled="isRollDisabled"
          label="Roll!"
          @click="rollDice"
        />
        <BigButton
          v-else
          :is-disabled="isRollDisabled"
          label="Roll!"
          @click="rollDice"
        />
      </div>
      <button
        v-if="showCombatLuck"
        class="tw-w-48 tw-mx-auto tw-mb-3"
        :disabled="isCombatLuckDisabled || monsterStamina === 0"
        @click="rollCombatLuckDice"
      >
        Use Luck
      </button>
      <div class="message-box">
        <span class="tw-mx-auto tw-text-center" v-html="fightMessage" />
        <span
          class="tw-mx-auto tw-text-center tw-text-green-600"
          v-html="successMessage"
        />
        <span
          class="tw-mx-auto tw-text-center tw-text-red-600"
          v-html="failMessage"
        />
        <span
          class="tw-mx-auto tw-text-center tw-text-green-600 tw-font-bold"
          v-html="victoryMessage"
        />
        <span
          class="tw-mx-auto tw-text-center tw-text-red-600 tw-font-bold"
          v-html="defeatMessage"
        />
      </div>
    </div>
    <div class="tw-flex tw-flex-col md:tw-flex-row">
      <StatsBox
        class="tw-mr-3"
        v-model:initial-skill="initialSkill"
        v-model:current-skill="skill"
        v-model:initial-stamina="initialStamina"
        v-model:current-stamina="stamina"
        v-model:initial-luck="initialLuck"
        v-model:current-luck="luck"
        :show-animation="showStatAnimation"
        @mouseenter="showStatAnimation = false"
      />
      <Monster
        v-model:name="monsterName"
        v-model:skill="monsterSkill"
        v-model:stamina="monsterStamina"
        :show-animation="showStatAnimation"
        @mouseenter="showStatAnimation = false"
      />
    </div>
    <!-- Temporarily disable additional encounters -->
    <!-- <div class="tw-flex tw-flex-row-reverse tw-flex-wrap">
      <div class="tw-w-full tw-flex tw-justify-center tw-mb-3">
        <button class="tw-px-4" @click="onClickAddMonster">
          Add Encounter
        </button>
      </div>
      <div
        v-for="(monster, index) in additionalMonsters"
        :key="index"
        class="monster-wrapper"
      >
        <Monster
          class="md:tw-w-full"
          v-model:name="monster.name"
          v-model:skill="monster.skill"
          v-model:stamina="monster.stamina"
          is-remove-button-visible
          @click-remove-button="onClickRemoveMonster(index)"
        />
      </div>
    </div> -->
    <Divider :img-url="require('@/assets/images/sword.png')" />
    <div class="tw-flex tw-flex-col md:tw-flex-row">
      <div class="tw-w-full md:tw-w-1/2 md:tw-mr-1.5">
        <InventoryBox :items="formattedSheetData.inventory" />
      </div>
      <div class="tw-w-full md:tw-w-1/2 md:tw-ml-1.5">
        <QuantityBox label="Gold" v-model="gold" />
        <QuantityBox label="Provisions" v-model="provisions" />
      </div>
    </div>
    <NotesBox v-model="notes" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { debounce } from 'lodash';
import TopBar from './components/Topbar.vue';
import Divider from './components/Divider.vue';
import StatsBox from './components/StatsBox.vue';
import Monster from './components/MonsterBox.vue';
import InventoryBox from './components/InventoryBox.vue';
import QuantityBox from './components/QuantityBox.vue';
import NotesBox from './components/NotesBox.vue';
import Dice from './components/Dice.vue';
import BigButton from './components/inputs/BigButton.vue';

interface SheetData {
  stats?: Array<Stat>;
  inventory?: Array<object>;
}

interface Stat {
  label: string;
  value: number;
  initialValue: number;
}

interface Monster {
  name: string;
  skill: number;
  stamina: number;
}

export default defineComponent({
  components: {
    TopBar,
    Divider,
    StatsBox,
    InventoryBox,
    QuantityBox,
    NotesBox,
    Monster,
    Dice,
    BigButton,
  },
  data() {
    return {
      combatDamage: 2,
      rollForPlayer: false,
      rollForMonster: false,
      defaultDiceOption: 2,
      diceOptions: {
        oneDice: {
          label: '1 dice',
          value: 1,
        },
        twoDice: {
          label: '2 dice',
          value: 2,
        },
        testYourLuck: {
          label: 'Test your luck',
          value: 3,
        },
        fight: {
          label: 'Fight',
          value: 4,
        },
      },
      diceMode: '',
      diceModeRegular: 'regular',
      diceModeTestLuck: 'testLuck',
      diceModeCombat: 'combat',
      diceModeCombatLuck: 'combatLuck',
      playerDice: 2,
      playerRoll: 0,
      playerTotalRoll: 0,
      monsterDice: 2,
      monsterRoll: 0,
      monsterTotalRoll: 0,
      additionalMonsters: new Array<Monster>(),
      showStatAnimation: false,
      isRollDisabled: false,
      showCombatLuck: false,
      isCombatLuckDisabled: true,
      fightMessage: '',
      successMessage: '',
      failMessage: '',
      victoryMessage: '',
      defeatMessage: '',
      skill: 1,
      stamina: 1,
      luck: 1,
      initialSkill: 1,
      initialStamina: 1,
      initialLuck: 1,
      monsterName: '',
      monsterSkill: 1,
      monsterStamina: 1,
      gold: 0,
      provisions: 0,
      notes: '',
      sheetData: [
        {
          label: 'stats',
          value: [
            {
              label: 'Skill',
              initialValue: 4,
              value: 4,
            },
            {
              label: 'Stamina',
              initialValue: 5,
              value: 5,
            },
            {
              label: 'Luck',
              initialValue: 6,
              value: 6,
            },
          ],
        },
        {
          label: 'monster',
          value: {
            name: '',
            skill: '',
            stamina: '',
          },
        },
        {
          label: 'inventory',
          value: [
            { name: 'Sword', quantity: 1 },
            { name: 'Medallion of Courage', quantity: 1 },
            { name: 'Charm of Dexterity', quantity: 1 },
            { name: 'Gem of Intelect', quantity: 1 },
            { name: 'Potion', quantity: 5 },
          ],
        },
      ],
    };
  },
  watch: {
    playerRoll(): void {
      if (this.playerRoll > 0) {
        switch (this.diceMode) {
          case this.diceModeTestLuck:
            this.testLuck(this);
            this.isRollDisabled = false;
            break;
          case this.diceModeRegular:
            this.isRollDisabled = false;
            break;
          case this.diceModeCombatLuck:
            if (this.playerTotalRoll < this.monsterTotalRoll) {
              this.useCombatLuckAfterDamage(this);
            }
            if (this.playerTotalRoll > this.monsterTotalRoll) {
              this.useCombatLuckAfterAttack(this);
            }
            break;
        }
      }
    },
    monsterRoll(): void {
      if (this.playerRoll > 0) {
        this.fight(this);
      }
    },
    monsterStamina(value: number): void {
      if (value <= 0) {
        this.monsterStamina = 0;
      }
    },
    stamina(value: number): void {
      if (value <= 0) {
        this.stamina = 0;
      }
    },
    luck(value: number): void {
      if (value <= 0) {
        this.luck = 0;
      }
    },
  },
  computed: {
    formattedSheetData(): SheetData {
      let formattedSheetData: Record<string, unknown> = {};

      this.sheetData.forEach((data) => {
        formattedSheetData[data.label] = data.value;
      });

      return formattedSheetData;
    },
    isCombatDiceDisabled(): boolean {
      return (
        this.isRollDisabled ||
        this.stamina <= 0 ||
        this.monsterStamina <= 0 ||
        (this.stamina <= 0 && this.monsterStamina > 0)
      );
    },
  },
  mounted(): void {
    this.initialiseStats();
    this.setDice(this.defaultDiceOption);
    this.monsterName = this.getMonsterName();
  },
  methods: {
    initialiseStats(): void {
      const stats = this.formattedSheetData.stats;

      if (stats) {
        const skillKey = 'skill';
        const staminaKey = 'stamina';
        const luckKey = 'luck';

        stats.forEach((stat) => {
          const label = stat?.label.toLowerCase();

          if (label === skillKey) {
            this.skill = stat.value;
            this.initialSkill = stat.initialValue;
          }

          if (label === staminaKey) {
            this.stamina = stat.value;
            this.initialStamina = stat.initialValue;
          }

          if (label === luckKey) {
            this.luck = stat.value;
            this.initialLuck = stat.initialValue;
          }
        });
      }
    },
    getMonsterName() {
      return this.monsterName ? this.monsterName : 'Monster';
    },
    setDice(option: number) {
      this.showCombatLuck = false;

      switch (option) {
        case this.diceOptions.oneDice.value:
          this.playerDice = 1;
          this.monsterDice = 0;
          this.diceMode = this.diceModeRegular;
          break;
        case this.diceOptions.fight.value:
          this.showCombatLuck = true;
          this.playerDice = 2;
          this.monsterDice = 2;
          this.diceMode = this.diceModeCombat;
          break;
        case this.diceOptions.testYourLuck.value:
          this.playerDice = 2;
          this.monsterDice = 0;
          this.diceMode = this.diceModeTestLuck;
          break;
        case this.diceOptions.twoDice.value:
        default:
          this.playerDice = 2;
          this.monsterDice = 0;
          this.diceMode = this.diceModeRegular;
          break;
      }
    },
    onChangeDice(event: InputEvent) {
      const value = (event.target as HTMLInputElement).value;
      this.setDice(parseInt(value, 10));
    },
    getPlayerRoll(roll: number): void {
      this.playerRoll += roll;
    },
    getMonsterRoll(roll: number): void {
      this.monsterRoll += roll;
    },
    clearMessages(): void {
      this.successMessage = '';
      this.failMessage = '';
      this.victoryMessage = '';
      this.defeatMessage = '';
    },
    disableRoll() {
      this.isRollDisabled = true;
      this.isCombatLuckDisabled = true;
    },
    enaleRoll() {
      this.isRollDisabled = false;
      this.isCombatLuckDisabled = false;
    },
    preRollConfiguration(): void {
      this.isRollDisabled = true;
      this.isCombatLuckDisabled = true;
      this.showStatAnimation = true;
      this.playerRoll = 0;
      this.monsterRoll = 0;
      this.fightMessage = '';
      this.clearMessages();
    },
    rollCombatDice(): void {
      this.rollForPlayer = !this.rollForPlayer;
      this.rollForMonster = !this.rollForMonster;
    },
    rollDice(): void {
      this.preRollConfiguration();

      if (this.diceModeCombat) {
        this.rollCombatDice();
      } else {
        this.rollForPlayer = !this.rollForPlayer;
      }
    },
    testPlayerRollAgainstLuck(onLucky: () => void, onUnlucky: () => void) {
      if (this.playerRoll <= this.luck) {
        onLucky();
      } else {
        onUnlucky();
      }

      this.luck -= 1;
    },
    testLuck: debounce((vm): void => {
      const onLucky = () => {
        vm.successMessage = 'You are lucky';
      };

      const onUnlucky = () => {
        vm.failMessage = 'You are unlucky';
      };

      vm.testPlayerRollAgainstLuck(onLucky, onUnlucky);
    }, 100),
    generateCombatStrengthMessages(): void {
      this.fightMessage = `Player attack strength: <strong>${this.playerTotalRoll}</strong>`;
      this.fightMessage += ' | ';
      this.fightMessage += `${this.getMonsterName()} attack strength: `;
      this.fightMessage += `<strong>${this.monsterTotalRoll}</strong>`;
    },
    generateCombatDamageMessages(): void {
      if (this.playerTotalRoll > this.monsterTotalRoll) {
        this.monsterStamina -= this.combatDamage;
        this.successMessage = `You wounded the ${this.getMonsterName()}, `;
        this.successMessage += `dealing ${this.combatDamage} damage`;
      } else if (this.playerTotalRoll < this.monsterTotalRoll) {
        this.stamina -= this.combatDamage;
        this.failMessage = `The ${this.getMonsterName()} has hit you, `;
        this.failMessage += `dealing ${this.combatDamage} damage`;
      }
    },
    generateCombatVictoryDefeatMessages(): void {
      if (this.monsterStamina <= 0) {
        this.victoryMessage = `You have slain the ${this.monsterName}`;
      }

      if (this.stamina <= 0) {
        this.defeatMessage = `Your story ends here, you have been slain by the ${this.monsterName}`;
      }
    },
    fight: debounce((vm): void => {
      vm.playerTotalRoll = vm.skill + vm.playerRoll;
      vm.monsterTotalRoll = vm.monsterSkill + vm.monsterRoll;
      vm.isRollDisabled = false;
      vm.isCombatLuckDisabled = false;

      vm.generateCombatStrengthMessages();
      vm.generateCombatDamageMessages();
      vm.generateCombatVictoryDefeatMessages();
    }, 100),
    rollCombatLuckDice(): void {
      this.diceMode = this.diceModeCombatLuck;
      this.playerRoll = 0;
      this.isCombatLuckDisabled = true;
      this.rollForPlayer = !this.rollForPlayer;
      this.clearMessages();
    },
    useCombatLuckAfterDamage: debounce((vm): void => {
      const onLucky = () => {
        vm.successMessage =
          'You have managed to avoid the full damage of the blow have only been dealt 1 damage';
        vm.stamina += 1;
      };

      const onUnlucky = () => {
        vm.failMessage =
          'You have taken a more serious blow and are dealt 1 extra damage';
        vm.stamina -= 1;
      };

      vm.testPlayerRollAgainstLuck(onLucky, onUnlucky);
      vm.generateCombatVictoryDefeatMessages();
      vm.diceMode = vm.diceModeCombat;
    }, 100),
    useCombatLuckAfterAttack: debounce((vm): void => {
      const onLucky = () => {
        vm.successMessage = `You have inflicted a severe wound and dealt an extra `;
        vm.successMessage += `${vm.combatDamage} damage`;
        vm.monsterStamina -= vm.combatDamage;
      };

      const onUnlucky = () => {
        vm.failMessage = 'The wound was a mere graze and only dealt 1 damage';
        vm.monsterStamina += 1;
      };

      vm.testPlayerRollAgainstLuck(onLucky, onUnlucky);
      vm.generateCombatVictoryDefeatMessages();
      vm.diceMode = vm.diceModeCombat;
    }, 100),
    onClickAddMonster(): void {
      const newMonster = {
        name: '',
        skill: 5,
        stamina: 5,
      };

      this.additionalMonsters.push(newMonster);
    },
    onClickRemoveMonster(index: number): void {
      this.additionalMonsters.splice(index, 1);
    },
  },
});
</script>

<style>
.fight-button {
  @apply tw-px-6
  tw-py-2
  tw-text-2xl
  tw-font-bold;
}

div.sheet {
  background-image: url('./assets/images/old-paper-texture.jpg');

  @apply tw-flex
  tw-flex-col
  tw-mx-auto
  sm:tw-mt-10
  tw-pb-8;
}

.message-box {
  background-color: rgba(255, 255, 255, 0.4);
  border: 4px inset rgba(255, 255, 255, 0.4);
  @apply tw-w-full tw-flex tw-flex-col tw-items-center tw-h-20 tw-mx-auto;
}

@media (min-width: 768px) {
  .message-box {
    width: 32rem;
  }
}

.monster-wrapper {
  @apply tw-w-full md:tw-w-1/2 md:[&:nth-child(even)]:tw-pl-1.5 md:[&:nth-child(odd)]:tw-pr-1.5;
}
</style>
