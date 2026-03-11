import { defineStore } from 'pinia';

interface Callouts {
  label: string;
  description: string;
}

const getRandomNumber = (max = 6): number => {
  return Math.ceil(Math.random() * max);
};

export const adventureSheetStore = defineStore('adventureSheetStore', {
  state: () => ({
    skill: 1,
    stamina: 1,
    luck: 1,
    initialSkill: 1,
    initialStamina: 1,
    initialLuck: 1,
    magic: 1,
    combatDamage: 2,
    playerTotalRoll: 0,
    monsterTotalRoll: 0,
    skillBonus: 0,
    staminaBonus: 0,
    luckBonus: 0,
    callouts: new Array<Callouts>(),
  }),
  getters: {
    isBonusesApplied: (state): boolean => {
      return (
        state.skillBonus > 0 || state.staminaBonus > 0 || state.luckBonus > 0
      );
    },
  },
  actions: {
    randomizeStats(): void {
      const statModifier = 6;
      const staminaStatModifier = 12;
      const skill = statModifier + getRandomNumber();
      const stamina =
        staminaStatModifier + getRandomNumber() + getRandomNumber();
      const luck = statModifier + getRandomNumber();

      this.initialSkill = skill;
      this.skill = skill;
      this.initialStamina = stamina;
      this.stamina = stamina;
      this.initialLuck = luck;
      this.luck = luck;
      // Possibly disable re-rolling stats in future
      // this.isRollStatsDisabled = true;
    },
    addCallout(label: string, description: string): void {
      const newCallout = { label, description };
      this.callouts.push(newCallout);
    },
    removeCallout(label: string): void {
      const index = this.callouts.findIndex((callout): boolean => {
        return callout.label === label;
      });

      if (index > -1) {
        this.callouts.splice(index, 1);
      }
    },
    addSkillBonus(bonus: number): void {
      this.skillBonus += bonus;
    },
    resetBonuses(): void {
      this.skillBonus = 0;
      this.staminaBonus = 0;
      this.luckBonus = 0;
    },
  },
});
