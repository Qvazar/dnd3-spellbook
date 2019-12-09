import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import './App.css';
import PrivateRoute from "./PrivateRoute";
import LoginView from "./firebase/AuthUi";
import SpellbookListView from './SpellbookListView';
import SpellbookView from "./SpellbookView";

const App: React.FC = () => (
  <Router>
    <div className="app">
      <Switch>
        <PrivateRoute path="/spellbooks/:spellbookName">
          <SpellbookView />
        </PrivateRoute>
        <PrivateRoute path="/spellbooks">
          <SpellbookListView />
        </PrivateRoute>
        <Route path="/login">
          <LoginView signInSuccessUrl="/spellbooks" />
        </Route>
        <Route>
          <Redirect to="/spellbooks" />
        </Route>
      </Switch>
    </div>
  </Router>
);

export default App;
