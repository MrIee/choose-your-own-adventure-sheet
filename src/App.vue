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
            {{ playerName }}
          </strong>
          <div class="tw-flex">
            <Dice
              v-for="(dice, index) in playerDice"
              :key="index"
              :number="dice"
            />
          </div>
        </div>
        <div v-if="monsterDice.length > 0" class="tw-flex tw-flex-col tw-ml-9">
          <strong
            v-if="diceMode === diceModeCombat || diceModeCombatLuck"
            class="tw-mx-auto"
          >
            {{ encounterName || validMonsterName }}
          </strong>
          <div class="tw-flex">
            <Dice
              v-for="(dice, index) in monsterDice"
              :key="index"
              :number="dice"
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
        @click="testCombatLuck"
      >
        Use Luck
      </button>
      <div :ref="messageBoxRef" class="message-box" v-html="messageBoxText" />
    </div>
    <div class="tw-flex tw-flex-col md:tw-flex-row">
      <PlayerBox
        class="tw-mr-3"
        v-model:player-name="playerName"
        v-model:initial-skill="initialSkill"
        v-model:current-skill="skill"
        v-model:initial-stamina="initialStamina"
        v-model:current-stamina="stamina"
        v-model:initial-luck="initialLuck"
        v-model:current-luck="luck"
        :show-animation="showStatAnimation"
        :is-roll-stats-disabled="isRollStatsDisabled"
        @mouseenter="showStatAnimation = false"
        @randomize-stats="randomizeStats"
      />
      <MonsterBox
        v-model:name="monsterName"
        v-model:skill="monsterSkill"
        v-model:stamina="monsterStamina"
        :show-animation="showStatAnimation"
        @mouseenter="showStatAnimation = false"
      />
    </div>
    <div class="tw-w-full tw-flex tw-justify-center tw-mb-3">
      <button @click="onClickAddMonster">Add Encounter</button>
    </div>
    <div class="tw-flex tw-flex-row-reverse tw-flex-wrap">
      <div
        v-for="(monster, index) in additionalEncounters"
        :key="index"
        class="monster-wrapper"
      >
        <MonsterBox
          class="md:tw-w-full"
          v-model:name="monster.name"
          v-model:skill="monster.skill"
          v-model:stamina="monster.stamina"
          is-remove-button-visible
          @click-remove-button="onClickRemoveMonster(index)"
        />
      </div>
    </div>
    <Divider :img-url="require('@/assets/images/sword.png')" />
    <div class="tw-flex tw-flex-col md:tw-flex-row">
      <div class="tw-w-full md:tw-w-1/2 md:tw-mr-1.5">
        <InventoryBox :items="[]" />
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
import TopBar from './components/Topbar.vue';
import Divider from './components/Divider.vue';
import PlayerBox from './components/PlayerBox.vue';
import MonsterBox from './components/MonsterBox.vue';
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
    PlayerBox,
    InventoryBox,
    QuantityBox,
    NotesBox,
    MonsterBox,
    Dice,
    BigButton,
  },
  data() {
    return {
      combatDamage: 2,
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
      playerDice: [0, 0],
      playerTotalRoll: 0,
      monsterDice: [0, 0],
      monsterTotalRoll: 0,
      additionalEncounters: new Array<Monster>(),
      showStatAnimation: false,
      isRollDisabled: false,
      showCombatLuck: false,
      isCombatLuckDisabled: true,
      messageBoxRef: 'js-message-box',
      messageBoxText: '',
      successMessage: '',
      failMessage: '',
      victoryMessage: '',
      defeatMessage: '',
      isRollStatsDisabled: false,
      playerName: 'Player',
      skill: 1,
      stamina: 1,
      luck: 1,
      initialSkill: 1,
      initialStamina: 1,
      initialLuck: 1,
      encounterName: '',
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
    playerRoll(): number {
      return this.playerDice.reduce(
        (sum: number, current: number) => sum + current,
        0
      );
    },
    monsterRoll(): number {
      return this.monsterDice.reduce(
        (sum: number, current: number) => sum + current,
        0
      );
    },
    validMonsterName(): string {
      return this.monsterName ? this.monsterName : 'Monster';
    },
  },
  mounted(): void {
    // Temporarily disable initialise stats until save/load is properly implemented
    // this.initialiseStats();
    this.setDice(this.defaultDiceOption);
    this.monsterName = this.validMonsterName;
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
    getRandomDiceNumber(sides = 6) {
      return Math.ceil(Math.random() * sides);
    },
    async makeDiceRoll(
      callback: (number: number) => void,
      delay = 150
    ): Promise<void> {
      let rolledNumber = 0;
      const numberOfSideOnDie = 6;
      const wait = (): Promise<void> =>
        new Promise((resolve) => setTimeout(resolve, delay));

      for (let i = 1; i <= numberOfSideOnDie; i++) {
        rolledNumber = this.getRandomDiceNumber();
        callback && callback(rolledNumber);
        await wait();
      }

      return Promise.resolve();
    },
    randomizeStats(): void {
      const statModifier = 6;
      const staminaStatModifier = 12;
      const skill = statModifier + this.getRandomDiceNumber();
      const stamina =
        staminaStatModifier +
        this.getRandomDiceNumber() +
        this.getRandomDiceNumber();
      const luck = statModifier + this.getRandomDiceNumber();

      this.initialSkill = skill;
      this.skill = skill;
      this.initialStamina = stamina;
      this.stamina = stamina;
      this.initialLuck = luck;
      this.luck = luck;
      // Possibly disable re-rolling stats in future
      // this.isRollStatsDisabled = true;
    },
    setDice(option: number) {
      this.showCombatLuck = false;

      switch (option) {
        case this.diceOptions.oneDice.value:
          this.playerDice = [0];
          this.monsterDice = [];
          this.diceMode = this.diceModeRegular;
          break;
        case this.diceOptions.fight.value:
          this.encounterName = this.monsterName;
          this.showCombatLuck = true;
          this.playerDice = [0, 0];
          this.monsterDice = [0, 0];
          this.diceMode = this.diceModeCombat;
          break;
        case this.diceOptions.testYourLuck.value:
          this.playerDice = [0, 0];
          this.monsterDice = [];
          this.diceMode = this.diceModeTestLuck;
          break;
        case this.diceOptions.twoDice.value:
        default:
          this.playerDice = [0, 0];
          this.monsterDice = [];
          this.diceMode = this.diceModeRegular;
          break;
      }

      this.rollEntityDice(this.playerDice, false);
      this.rollEntityDice(this.monsterDice, false);
    },
    onChangeDice(event: InputEvent) {
      const value = (event.target as HTMLInputElement).value;
      this.setDice(parseInt(value, 10));
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
      this.messageBoxText = '';
    },
    async rollEntityDice(
      entityDice: Array<number>,
      delay = true
    ): Promise<void> {
      return new Promise((resolve) => {
        entityDice.forEach(async (dice, index) => {
          const callback = (number: number) => {
            entityDice[index] = number;
          };

          if (delay) {
            await this.makeDiceRoll(callback);
          } else {
            await this.makeDiceRoll(callback, 0);
          }
          resolve();
        });
      });
    },
    async rollDiceForMode(): Promise<void> {
      switch (this.diceMode) {
        case this.diceModeTestLuck:
          await this.rollEntityDice(this.playerDice);
          this.testLuck();
          break;
        case this.diceModeRegular:
          await this.rollEntityDice(this.playerDice);
          break;
        case this.diceModeCombat:
          this.encounterName = this.monsterName;

          this.rollEntityDice(this.playerDice);
          await this.rollEntityDice(this.monsterDice);
          this.doCombat();
          break;
      }
      this.isRollDisabled = false;
    },
    async rollDice(): Promise<void> {
      this.preRollConfiguration();
      await this.rollDiceForMode();
    },
    scrollToBottomOfMessageBox() {
      const messageBox: typeof this = this.$refs[
        this.messageBoxRef
      ] as typeof this;

      (messageBox as unknown as HTMLElement).scrollTop = (
        messageBox as unknown as HTMLElement
      ).scrollHeight;
    },
    createMessageBoxSuccessText(text: string) {
      return `<span class="tw-text-green-600">${text}</span>`;
    },
    createMessageBoxFailureText(text: string) {
      return `<span class="tw-text-red-600">${text}</span>`;
    },
    createMessageBoxVictoryText(text: string) {
      return `<span class="tw-text-green-600 tw-font-bold">${text}</span>`;
    },
    createMessageBoxDefeatText(text: string) {
      return `<span class="tw-text-red-600 tw-font-bold">${text}</span>`;
    },
    testPlayerRollAgainstLuck(onLucky: () => void, onUnlucky: () => void) {
      if (this.playerRoll <= this.luck) {
        onLucky();
      } else {
        onUnlucky();
      }

      this.luck -= 1;
    },
    testLuck(): void {
      const onLucky = () => {
        this.messageBoxText = this.createMessageBoxSuccessText('You are lucky');
      };

      const onUnlucky = () => {
        this.messageBoxText =
          this.createMessageBoxFailureText('You are unlucky');
      };

      this.testPlayerRollAgainstLuck(onLucky, onUnlucky);
    },
    generateCombatStrengthMessages(): void {
      this.messageBoxText = `${this.playerName} attack strength: `;
      this.messageBoxText += `<strong>${this.playerTotalRoll}</strong>`;
      this.messageBoxText += ' | ';
      this.messageBoxText += `${this.validMonsterName} attack strength: `;
      this.messageBoxText += `<strong>${this.monsterTotalRoll}</strong>`;
    },
    generateCombatDamageMessages(): void {
      if (this.playerTotalRoll > this.monsterTotalRoll) {
        this.monsterStamina -= this.combatDamage;
        this.messageBoxText += this.createMessageBoxSuccessText(
          `<br />You wounded the ${this.validMonsterName}, dealing ${this.combatDamage} damage`
        );
      } else if (this.playerTotalRoll < this.monsterTotalRoll) {
        this.stamina -= this.combatDamage;
        this.messageBoxText += this.createMessageBoxFailureText(
          `<br />The ${this.validMonsterName} has hit you, dealing ${this.combatDamage} damage`
        );
      } else {
        this.isCombatLuckDisabled = true;
        this.messageBoxText += `<br />You and the ${this.validMonsterName} have parried `;
        this.messageBoxText += 'each others blows';
      }
    },
    generateCombatVictoryDefeatMessages(): void {
      if (this.monsterStamina <= 0) {
        this.messageBoxText += this.createMessageBoxVictoryText(
          `<br />You have slain the ${this.validMonsterName}`
        );
      }

      if (this.stamina <= 0) {
        this.messageBoxText += this.createMessageBoxDefeatText(
          `<br />Your story ends here, you have been slain by the ${this.validMonsterName}`
        );
      }
    },
    async doCombat(): Promise<void> {
      this.playerTotalRoll = this.skill + this.playerRoll;
      this.monsterTotalRoll = this.monsterSkill + this.monsterRoll;
      this.isCombatLuckDisabled = false;

      this.generateCombatStrengthMessages();
      this.generateCombatDamageMessages();

      if (this.additionalEncounters.length > 0) {
        if (this.encounterName === '') {
          this.encounterName = this.monsterName;
        }

        for (let i = 0; i < this.additionalEncounters.length; i++) {
          const encounter = this.additionalEncounters[i];
          this.encounterName = encounter.name;
          this.rollEntityDice(this.playerDice);
          await this.rollEntityDice(this.monsterDice);
          const playerTotalRoll = this.skill + this.playerRoll;
          const monsterTotalRoll = encounter.skill + this.monsterRoll;

          this.messageBoxText += '<br />';

          if (playerTotalRoll > monsterTotalRoll) {
            this.messageBoxText += this.createMessageBoxSuccessText(
              `You have successfully managed to parry an attack from the ${encounter.name}`
            );
          } else {
            this.messageBoxText += this.createMessageBoxFailureText(
              `You have been wounded by the ${encounter.name}`
            );
            this.stamina -= this.combatDamage;
          }
        }
      }

      this.generateCombatVictoryDefeatMessages();
      this.$nextTick(() => {
        this.scrollToBottomOfMessageBox();
      });
    },
    async testCombatLuck(): Promise<void> {
      this.diceMode = this.diceModeCombatLuck;
      this.isCombatLuckDisabled = true;

      await this.rollEntityDice(this.playerDice);

      if (this.playerTotalRoll < this.monsterTotalRoll) {
        this.useCombatLuckAfterDamage();
      }
      if (this.playerTotalRoll > this.monsterTotalRoll) {
        this.useCombatLuckAfterAttack();
      }
    },
    useCombatLuckAfterDamage(): void {
      const onLucky = () => {
        let message = '<br />You have managed to avoid the full damage of the ';
        message += 'blow and have only been dealt 1 damage';
        this.messageBoxText += this.createMessageBoxSuccessText(message);
        this.stamina += 1;
      };

      const onUnlucky = () => {
        this.messageBoxText += this.createMessageBoxFailureText(
          '<br />You have taken a more serious blow and are dealt 1 extra damage'
        );
        this.stamina -= 1;
      };

      this.scrollToBottomOfMessageBox();
      this.testPlayerRollAgainstLuck(onLucky, onUnlucky);
      this.generateCombatVictoryDefeatMessages();
      this.diceMode = this.diceModeCombat;
    },
    useCombatLuckAfterAttack(): void {
      const onLucky = () => {
        this.messageBoxText += this.createMessageBoxSuccessText(
          `<br />You have inflicted a severe wound and dealt an extra ${this.combatDamage} damage`
        );
        this.monsterStamina -= this.combatDamage;
      };

      const onUnlucky = () => {
        this.messageBoxText += this.createMessageBoxFailureText(
          '<br />The wound was a mere graze and only dealt 1 damage'
        );
        this.monsterStamina += 1;
      };

      this.scrollToBottomOfMessageBox();
      this.testPlayerRollAgainstLuck(onLucky, onUnlucky);
      this.generateCombatVictoryDefeatMessages();
      this.diceMode = this.diceModeCombat;
    },
    onClickAddMonster(): void {
      const newMonster = {
        name: '',
        skill: 5,
        stamina: 5,
      };

      this.additionalEncounters.push(newMonster);
    },
    onClickRemoveMonster(index: number): void {
      this.additionalEncounters.splice(index, 1);
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
  @apply tw-w-full tw-h-28 tw-mx-auto tw-text-center tw-overflow-y-auto;
}

@media (min-width: 768px) {
  .message-box {
    width: 32rem;
  }
}

.monster-wrapper {
  @apply tw-w-full md:tw-w-1/2 md:[&:nth-child(even)]:tw-pr-1.5 md:[&:nth-child(odd)]:tw-pl-1.5;
}
</style>
