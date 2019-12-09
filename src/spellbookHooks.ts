import { useState, useEffect } from "react";
import { Spellbook } from "./types";

import {
    listenSpellbook,
    listenSpellbooks
} from "./firebase/spellbookStore";

export function useSpellbook(spellbookName: string): [Error?, Spellbook?] {
    const [spellbook, setSpellbook] = useState<Spellbook|undefined>();
    const [error, setError] = useState<Error|undefined>();

    useEffect(() => {
        const unsub = listenSpellbook(
            spellbookName,
            sb => {
                setError(undefined);
                setSpellbook(sb);
            },
            setError);

        return unsub;
    }, [spellbookName]);

    return [error, spellbook];
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
    });

    return [error, spellbooks];
}