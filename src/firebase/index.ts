import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

export async function initialise() {
    const response = await fetch('/__/firebase/init.json');
    firebase.initializeApp(await response.json());
}

export function logEvent(event: string, params: any) {
    firebase.analytics().logEvent(event, params);
}

export function isSignedIn() {
    const user = firebase.auth().currentUser;
    return user != null;
}
