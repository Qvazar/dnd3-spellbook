import { Spellbook } from "./types";

const STORE_NAME = "spellbooks";

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
