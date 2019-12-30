import { useState, useEffect, useReducer } from "react";
import { cloneDeep, debounce, remove, isEqual } from "lodash-es";
import { 
    Spellbook,
    SpellcasterClass,
    SpellSchoolDcModifier,
    SpellCasterLevelModifier
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

const saveSpellbookEventually = debounce(saveSpellbook, DEBOUNCE_TIME);

const LEVEL_SET = "level:set";
interface SpellbookReducerLevelAction {
    type: typeof LEVEL_SET,
    value: number
}

const CLASS_SET = "class:set";
interface SpellbookReducerClassAction {
    type: typeof CLASS_SET,
    value: SpellcasterClass
}

const ABILITYMODIFIER_SET = "abilityModifier:set";
interface SpellbookReducerAbilityModifierAction {
    type: typeof ABILITYMODIFIER_SET,
    value: number
}

const SPELLDCMODIFIER_ADD = "spellDcModifier:add";
const SPELLDCMODIFIER_REMOVE = "spellDcModifier:remove"
interface SpellbookReducerSpellDcModifierAction {
    type: typeof SPELLDCMODIFIER_ADD | typeof SPELLDCMODIFIER_REMOVE,
    value: SpellSchoolDcModifier
}

const CASTERLEVELMODIFIER_ADD = "casterLevelModifier:add";
const CASTERLEVELMODIFIER_REMOVE = "casterLevelModifier:remove";
interface SpellbookReducerCasterLevelModifierAction {
    type: typeof CASTERLEVELMODIFIER_ADD | typeof CASTERLEVELMODIFIER_REMOVE,
    value: SpellCasterLevelModifier
}

const BANNEDSPELLDESCRIPTOR_ADD = "bannedSpellDescriptor:add";
const BANNEDSPELLDESCRIPTOR_REMOVE = "bannedSpellDescriptor:remove";
interface SpellbookReducerBannedSpellDescriptorAction {
    type: typeof BANNEDSPELLDESCRIPTOR_ADD | typeof BANNEDSPELLDESCRIPTOR_REMOVE,
    value: string
}

const PREPAREDSPELL_ADD = "preparedSpell:add";
const PREPAREDSPELL_REMOVE = "preparedSpell:remove";
interface SpellbookReducerPreparedSpellAction {
    type: typeof PREPAREDSPELL_ADD | typeof PREPAREDSPELL_REMOVE,
    value: string
}

const KNOWNSPELL_ADD = "knownSpell:add";
const KNOWNSPELL_REMOVE = "knownSpell:remove";
interface SpellbookReducerKnownSpellAction {
    type: typeof KNOWNSPELL_ADD | typeof KNOWNSPELL_REMOVE,
    value: string
}

const CASTSPELL_ADD = "castSpell:add";
const CASTSPELL_REMOVE = "castSpell:remove";
interface SpellbookReducerCastSpellAction {
    type: typeof CASTSPELL_ADD | typeof CASTSPELL_REMOVE,
    value: string
}

const SPELLBOOK_LOAD = "spellbook:load";
interface SpellbookReducerLoadAction {
    type: typeof SPELLBOOK_LOAD,
    value: Spellbook
}

export type SpellbookReducerAction =
    SpellbookReducerAbilityModifierAction
    | SpellbookReducerBannedSpellDescriptorAction
    | SpellbookReducerCastSpellAction
    | SpellbookReducerCasterLevelModifierAction
    | SpellbookReducerKnownSpellAction
    | SpellbookReducerPreparedSpellAction
    | SpellbookReducerClassAction
    | SpellbookReducerLevelAction
    | SpellbookReducerSpellDcModifierAction
    | SpellbookReducerLoadAction;

const spellbookReducer = (commitFn: typeof saveSpellbook) => (spellbook: Spellbook, action: SpellbookReducerAction): Spellbook => {
    let commit = false;

    function cloneSpellbook() {
        spellbook = cloneDeep(spellbook);
        commit = true;
    }
    
    switch (action.type) {
        case CLASS_SET:
            cloneSpellbook();
            spellbook.spellcasterClass = action.value;
            break;
        case LEVEL_SET:
            cloneSpellbook();
            spellbook.spellcasterLevel = action.value;
            break;
        case ABILITYMODIFIER_SET:
            cloneSpellbook();
            spellbook.abilityModifier = action.value;
            break;
        case SPELLDCMODIFIER_ADD:
            cloneSpellbook();
            spellbook.spellDcModifiers.push(action.value);
            break;
        case SPELLDCMODIFIER_REMOVE:
            cloneSpellbook();
            remove(spellbook.spellDcModifiers, (dcMod) => dcMod.school == action.value.school);
            break;
        case CASTERLEVELMODIFIER_ADD:
            cloneSpellbook();
            spellbook.spellcasterLevelModifiers.push(action.value);
            break;
        case CASTERLEVELMODIFIER_REMOVE:
            cloneSpellbook();
            remove(spellbook.spellcasterLevelModifiers, (levelMod) => isEqual(levelMod, action.value));
            break;
        case BANNEDSPELLDESCRIPTOR_ADD:
            cloneSpellbook();
            spellbook.bannedSpellDescriptors.push(action.value);
            break;
        case BANNEDSPELLDESCRIPTOR_REMOVE:
            cloneSpellbook();
            remove(spellbook.bannedSpellDescriptors, action.value);
            break;
        case PREPAREDSPELL_ADD:
            cloneSpellbook();
            spellbook.preparedSpells.push(action.value);
            break;
        case PREPAREDSPELL_REMOVE:
            cloneSpellbook();
            remove(spellbook.preparedSpells, action.value);
            break;
        case KNOWNSPELL_ADD:
            cloneSpellbook();
            spellbook.knownSpells.push(action.value);
            break;
        case KNOWNSPELL_REMOVE:
            cloneSpellbook();
            remove(spellbook.knownSpells, action.value);
            break;
        case CASTSPELL_ADD:
            cloneSpellbook();
            spellbook.castSpells.push(action.value);
            break;
        case CASTSPELL_REMOVE:
            cloneSpellbook();
            remove(spellbook.castSpells, action.value);
            break;
        case SPELLBOOK_LOAD:
            spellbook = action.value;
            break;
    }

    if (commit) {
        commitFn(spellbook);
    }

    return spellbook;
}

export function useSpellbook(spellbookName: string) {
    const [error, setError] = useState<Error|undefined>();
    const [loading, setLoading] = useState(true);

    // Save on unmount or spellbook change
    useEffect(
        () => () => saveSpellbookEventually.flush(),
        [spellbookName]
    );
    
    const [spellbook, dispatch] = useReducer(spellbookReducer(saveSpellbookEventually), newSpellbook(spellbookName));

    useEffect(() => {
        const unsub = listenSpellbook(
            spellbookName,
            sb => {
                if (sb) {
                    dispatch({
                        type: SPELLBOOK_LOAD,
                        value: sb
                    });
                }

                setLoading(false);
                setError(undefined);
            },
            err => {
                setLoading(false);
                setError(err);
            });

        return unsub;
    }, [spellbookName]);

    return {
        error,
        loading,
        spellbook,
        dispatch
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
