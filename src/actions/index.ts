import debounce from "debounce";
import { Spellbook } from "../types";
import { saveSpellbook as _saveSpellbook } from "../firebase/spellbookStore";

const DEBOUNCE_TIME = 5000;

const _saveSpellbookDebounced = debounce(_saveSpellbook, DEBOUNCE_TIME);

export async function saveSpellbook(spellbook: Spellbook, now: boolean) {

}