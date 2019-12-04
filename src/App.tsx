import React from 'react';
import './App.css';
import SpellbookList from './SpellbookList';

type AppProps = {
  // spellbooks: {
  //   name: string,
  //   spellcasterClass: string,
  //   spellcasterLevel: number
  // }[];
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div className="app">
      {/* <SpellbookList spellbooks={props.spellbooks} /> */}
    </div>
  );
}

export default App;
