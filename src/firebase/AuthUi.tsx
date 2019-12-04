import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuth } from "react-firebaseui";
import firebaseui from "firebaseui";

type AuthUiProps = {
    onSignIn: (authResult: any) => void
};

const AuthUi: React.FC<AuthUiProps> = (props) => {
    const uiConfig: firebaseui.auth.Config = {
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                props.onSignIn && props.onSignIn(authResult);
                
                return false;
            }
        }
    };    
        
    return <FirebaseAuth firebaseAuth={firebase.auth()} uiConfig={uiConfig} />;
}

export default AuthUi;