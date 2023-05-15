import React, { useContext } from 'react';
import StoreContext from './context/StoreContext';

import Search from './components/Search/Search';
import './App.css';

function App() {
  const { breweries } = useContext(StoreContext);

  return (
    <div className="App">
      <Search />
      <ul>
        {breweries.map((brewery, i) => {
          return (
            <li key={`${brewery.id}-${i}`}>
              {brewery.name}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default App;
