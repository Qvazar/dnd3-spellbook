export enum SpellcasterClass {
    Bard = "Bard",
    Cleric = "Cleric",
    Druid = "Druid",
    Paladin = "Paladin",
    Ranger = "Ranger",
    Sorcerer = "Sorcerer",
    Wizard = "Wizard"
}

export interface SpellDescriptorCasterLevelModifier {
    descriptor: string,
    modifier: number
}

export type SpellCasterLevelModifier = SpellDescriptorCasterLevelModifier;

export interface SpellSchoolDcModifier {
    school: string,
    modifier: number
}

export type SpellDcModifier = SpellSchoolDcModifier;

export interface Spellbook {
    name: string,
    spellcasterClass: SpellcasterClass,
    spellcasterLevel: number,
    abilityModifier: number,
    spellDcModifiers: SpellDcModifier[],
    spellcasterLevelModifiers: SpellCasterLevelModifier[],
    knownSpells: string[],
    preparedSpells: string[],
    castSpells: string[],
    bannedSpellSchools: string[],
    bannedSpellDescriptors: string[]
};
