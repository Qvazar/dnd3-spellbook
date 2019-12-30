import { useState, useEffect } from "react";
import { cloneDeep, debounce, isFunction, reduce, pick } from "lodash-es";
import { 
    Spellbook,
    SpellcasterClass
} from "./types";
import {
    listenSpellbook,
    listenSpellbooks,
    saveSpellbook
} from "./firebase/spellbookStore";

const DEBOUNCE_TIME = 5000;

function newSpellbook(name: string) : Spellbook {
    return {
        name: name,
        spellcasterClass: SpellcasterClass.Wizard,
        spellcasterLevel: 1,
        abilityModifier: 0,
        spellDcModifiers: [],
        spellcasterLevelModifiers: [],
        bannedSpellDescriptors: [],
        bannedSpellSchools: [],
        preparedSpells: [],
        knownSpells: [],
        castSpells: []        
    };
}

const spellbookProps: (keyof Spellbook)[] = [
    "name",
    "spellcasterClass",
    "spellcasterLevel",
    "abilityModifier",
    "spellDcModifiers",
    "spellcasterLevelModifiers",
    "bannedSpellDescriptors",
    "bannedSpellSchools",
    "preparedSpells",
    "knownSpells",
    "castSpells"
];

function createSpellbookStates(spellbook: Spellbook|undefined = undefined) {
    // const states = spellbookProps.reduce((s, pn) => {
    //     const [v, set] = useState(spellbook && spellbook[pn]);
    //     Object.defineProperty(s, pn, { get: () => v});
    //     Object.defineProperty(s, `set${upperFirst(pn)}`, set);
    //     return s;
    // }, {});

    const [name, setName] = useState(spellbook?.name);
    const [spellcasterClass, setSpellcasterClass] = useState(spellbook?.spellcasterClass);
    const [spellcasterLevel, setSpellcasterLevel] = useState(spellbook?.spellcasterLevel);
    const [abilityModifier, setAbilityModifier] = useState(spellbook?.abilityModifier);
    const [spellDcModifiers, setSpellDcModifiers] = useState(spellbook?.spellDcModifiers);
    const [spellcasterLevelModifiers, setSpellcasterLevelModifiers] = useState(spellbook?.spellcasterLevelModifiers);
    const [bannedSpellDescriptors, setBannedSpellDescriptors] = useState(spellbook?.bannedSpellDescriptors);
    const [bannedSpellSchools, setBannedSpellSchools] = useState(spellbook?.bannedSpellSchools);
    const [preparedSpells, setPreparedSpells] = useState(spellbook?.preparedSpells);
    const [knownSpells, setKnownSpells] = useState(spellbook?.knownSpells);
    const [castSpells, setCastSpells] = useState(spellbook?.castSpells);

    return {
        name, setName,
        spellcasterClass, setSpellcasterClass,
        spellcasterLevel, setSpellcasterLevel,
        abilityModifier, setAbilityModifier,
        spellDcModifiers, setSpellDcModifiers,
        spellcasterLevelModifiers, setSpellcasterLevelModifiers,
        bannedSpellDescriptors, setBannedSpellDescriptors,
        bannedSpellSchools, setBannedSpellSchools,
        preparedSpells, setPreparedSpells,
        knownSpells, setKnownSpells,
        castSpells, setCastSpells
    };
}

function setSpellbookStatesFromSpellbook(sbs: SpellbookStates, sb: Spellbook|undefined) {
    sbs.setName(sb?.name);
    sbs.setSpellcasterClass(sb?.spellcasterClass);
    sbs.setSpellcasterLevel(sb?.spellcasterLevel);
    sbs.setAbilityModifier(sb?.abilityModifier);
    sbs.setSpellDcModifiers(cloneDeep(sb?.spellDcModifiers));
    sbs.setSpellcasterLevelModifiers(cloneDeep(sb?.spellcasterLevelModifiers));
    sbs.setBannedSpellDescriptors(cloneDeep(sb?.bannedSpellDescriptors));
    sbs.setBannedSpellSchools(cloneDeep(sb?.bannedSpellSchools));
    sbs.setPreparedSpells(cloneDeep(sb?.preparedSpells));
    sbs.setKnownSpells(cloneDeep(sb?.knownSpells));
    sbs.setCastSpells(cloneDeep(sb?.castSpells));
}

type SpellbookStates = ReturnType<typeof createSpellbookStates>;

async function saveSpellbookStates(sbs: SpellbookStates) {
    
}

export function useSpellbook(spellbookName: string) {
    let spellbookStates = createSpellbookStates();
    const [error, setError] = useState<Error|undefined>();
    const [loading, setLoading] = useState(true);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const saveLater = debounce(async (sb: Spellbook) => {
        await saveSpellbook(sb);
        setHasUnsavedChanges(false);
    }, DEBOUNCE_TIME);

    const enqueueSave = (sbs: SpellbookStates) => {
        setHasUnsavedChanges(true);
        saveLater(cloneDeep(pick(sbs, spellbookProps) as Spellbook));
    }

    // Save effect
    useEffect(() => {
        return () => saveLater.flush();
    }, [spellbookName]);

    useEffect(() => {
        const unsub = listenSpellbook(
            spellbookName,
            sb => {
                if (!sb) {
                    sb = newSpellbook(spellbookName);
                }

                setError(undefined);
                setLoading(false);

                if (!hasUnsavedChanges) {
                    // Don't overwrite current user changes!
                    setSpellbookStatesFromSpellbook(spellbookStates, sb);
                }
            },
            setError);

        return unsub;
    }, [spellbookName]);

    return {
        error,
        loading,
        ...spellbookStates,
        hasUnsavedChanges,
        save
    };
}

export function useSpellbooks(): [Error?, Spellbook[]?] {
    const [spellbooks, setSpellbooks] = useState<Spellbook[]|undefined>();
    const [error, setError] = useState<Error|undefined>();

    useEffect(() => {
        const unsub = listenSpellbooks(
            sb => {
                setError(undefined);
                setSpellbooks(sb);
            },
            setError
        );

        return unsub;
    }, []);

    return [error, spellbooks];
}
