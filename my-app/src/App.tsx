import React, { useContext } from 'react';
import StoreContext from './context/StoreContext';

import Search from './components/Search/Search';
import './App.css';

function App() {
  const { count, addCount, subtractCount } = useContext(StoreContext);

  return (
    <div className="App">
      <div>
        <p>{count}</p>
        <button onClick={() => { if (!!addCount) addCount() }}>+</button>
        <button onClick={() => { if (!!subtractCount) subtractCount() }}>-</button>
      </div>
      <Search />
    </div>
  );
}

export default App;
