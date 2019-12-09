import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import { FirebaseAuth } from "react-firebaseui";
import firebaseui from "firebaseui";
import Error from "../Error";

function useAuth() {
    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        return firebase.auth().onAuthStateChanged(
            user => {
                setError(undefined);
                setUser(user);
            },
            error => {
                setError(error);
            }
        );
    });

    return [error, user];
}

type AuthUiProps = {
    signInSuccessUrl: string
};

const AuthUi: React.FC<AuthUiProps> = ({signInSuccessUrl}) => {
    const [error, user] = useAuth();

    if (error) {
        return <Error error={error} />;
    }

    if (user) {
        return <Redirect to={signInSuccessUrl} />;
    }

    const uiConfig: firebaseui.auth.Config = {
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl
    };
        
    return <FirebaseAuth firebaseAuth={firebase.auth()} uiConfig={uiConfig} />;
}

export default AuthUi;
