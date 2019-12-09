import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Loading from "./Loading";
import * as serviceWorker from './serviceWorker';
import * as spellDatabase from "./SpellDatabase";
import * as firebase from "./firebase";

(async () => {
    const rootElement = document.getElementById('root');

    ReactDOM.render(<Loading />, rootElement);

    await Promise.all([
        firebase.initialise(),
        spellDatabase.initialise()
    ]);

    ReactDOM.render(<App />, rootElement);
})();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
