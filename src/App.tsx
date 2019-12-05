import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';
import PrivateRoute from "./PrivateRoute";
import AuthDialog from "./AuthDialog";
import SpellbookList from './SpellbookList';

const App: React.FC = () => (
  <Router>
    <div className="app">
      <Switch>
        <Route path="/login">
          <AuthDialog />
        </Route>
        <PrivateRoute path="/spellbooks">
        {/* <SpellbookList /> */}
        </PrivateRoute>
        <PrivateRoute path="/spellbooks/:spellbookName">
          
        </PrivateRoute>
      </Switch>
    </div>
  </Router>
);

export default App;
