import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

export async function initialise() {
    return fetch('/__/firebase/init.json').then(async response => {
        firebase.initializeApp(await response.json());
    });
}

export function logEvent(event: string, params: any) {
    firebase.analytics().logEvent(event, params);
}