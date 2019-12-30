import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { SpellcasterClass, Spellbook } from "../types";

const isLiveUpdateEnabled = !!JSON.parse(process.env.REACT_APP_FIRESTORE_LIVEUPDATE_ENABLED || "false");

const validSpellbookKeys = [
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

function getCurrentUserId() {
    const user = firebase.auth().currentUser;

    if (user == null) {
        throw new Error("No user is logged in.");
    }

    return user.uid;
}

function getSpellbookDocRef(spellbookName: string) {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbookName);
}

function getSpellbooksColRef() {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks");
}

export async function getSpellbook(spellbookName: string): Promise<Spellbook|null> {
    const doc = await getSpellbookDocRef(spellbookName).get();
    
    if (!doc.exists) {
        return null;
    }

    return doc.data() as Spellbook;
}

export function listenSpellbook(spellbookName: string, onData: (spellbook: Spellbook|null) => void, onError: (error: Error) => void) {
    if (isLiveUpdateEnabled) {
        const unsub = getSpellbookDocRef(spellbookName)
            .onSnapshot(doc => onData(doc.data() as Spellbook), onError);

        return unsub;
    } else {
        // Only get the data now and return a noop unsub func
        getSpellbook(spellbookName).then(onData, onError);
        return () => undefined;
    }
}

export async function saveSpellbook(spellbook: Spellbook): Promise<void> {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbook.name)
        .set(spellbook, { mergeFields: validSpellbookKeys });
}

export async function getSpellbooks(): Promise<Spellbook[]> {
    const query = await getSpellbooksColRef().get();
    
    return query.docs.map(doc => doc.data() as Spellbook);
}

export function listenSpellbooks(onData: (spellbooks: Spellbook[]) => void, onError: (error: Error) => void) {
    if (isLiveUpdateEnabled) {
        const unsub = getSpellbooksColRef()
            .onSnapshot(query => onData(query.docs.map(doc => doc.data() as Spellbook)), onError);

        return unsub;
    } else {
        // Only get the data now and return a noop unsub func
        getSpellbooks().then(onData, onError);
        return () => undefined;
    }
}

export async function deleteSpellbook(spellbookName: string): Promise<void> {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbookName)
        .delete();
}
