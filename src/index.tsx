import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as spellDatabase from "./SpellDatabase";
import * as firebase from "./firebase";

(async () => {
    await Promise.all([
        spellDatabase.initialise(),
        firebase.initialise()
    ]);

    console.log(JSON.stringify(await spellDatabase.findSpells("Druid", 3, { not: { descriptors: ["Evil"] } })));

    ReactDOM.render(<App />, document.getElementById('root'));
})();


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
