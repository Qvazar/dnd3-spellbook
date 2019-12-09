export type SpellDescriptorCasterLevelModifier = {
    descriptor: string,
    modifier: number
}

export type SpellCasterLevelModifier = SpellDescriptorCasterLevelModifier;

export type SpellSchoolDcModifier = {
    school: string,
    modifier: number
}

export type SpellDcModifier = SpellSchoolDcModifier;

export type Spellbook = {
    name: string,
    spellcasterClass: string,
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
