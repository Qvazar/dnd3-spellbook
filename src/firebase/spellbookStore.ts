import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { Spellbook } from "../types";

function getCurrentUserId() {
    const user = firebase.auth().currentUser;

    if (user == null) {
        throw new Error("No user is logged in.");
    }

    return user.uid;
}

export async function getSpellbook(spellbookName: string): Promise<Spellbook> {
    const doc = await firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbookName)
        .get();
    
    if (!doc.exists) {
        throw new Error(`Spellbook with name ${spellbookName} not found.`);
    }

    return doc.data() as Spellbook;
}

export function listenSpellbook(spellbookName: string, onData: (spellbook: Spellbook) => void, onError: (error: Error) => void) {
    const unsub = firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbookName)
        .onSnapshot(doc => onData(doc.data() as Spellbook), onError);

    return unsub;
}

export async function saveSpellbook(spellbook: Spellbook): Promise<void> {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbook.name)
        .set(spellbook);
}

export async function getSpellbooks(): Promise<Spellbook[]> {
    const query = await firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .get();
    
    return query.docs.map(doc => doc.data() as Spellbook);
}

export function listenSpellbooks(onData: (spellbooks: Spellbook[]) => void, onError: (error: Error) => void) {
    const unsub = firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .onSnapshot(query => onData(query.docs.map(doc => doc.data() as Spellbook)), onError);

    return unsub;
}

export async function deleteSpellbook(spellbookName: string): Promise<void> {
    return firebase.firestore()
        .collection("users")
        .doc(`${getCurrentUserId()}`)
        .collection("spellbooks")
        .doc(spellbookName)
        .delete();
}
