const STORE_NAME = "spellbooks";

type SpellDescriptorCasterLevelModifier = {
    descriptor: string,
    modifier: number
}

type SpellCasterLevelModifier = SpellDescriptorCasterLevelModifier;

type SpellSchoolDcModifier = {
    school: string,
    modifier: number
}

type SpellDcModifier = SpellSchoolDcModifier;

type Spellbook = {
    name: string,
    spellcasterClass: string,
    spellcasterLevel: number,
    abilityModifier: number,
    spellDcModifiers: SpellDcModifier[],
    spellCasterLevelModifiers: SpellCasterLevelModifier[],
    knownSpells: string[],
    preparedSpells: string[],
    castSpells: string[],
    bannedSpellSchools: string[],
    bannedSpellDescriptors: string[]
};

export function getSpellbooks(): Spellbook[] {
    const json = localStorage.getItem(STORE_NAME);
    if (json) {
        return JSON.parse(json);
    } else {
        return [];
    }
}

export function getSpellbook(name: string) {
    return getSpellbooks().find(sb => sb.name === name) || null;
}
