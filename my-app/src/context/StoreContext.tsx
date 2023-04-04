import React, { useState } from 'react';

export interface StoreContextType {
  count: number,
  addCount?: () => void,
  subtractCount?: () => void
}

const defaultState = {
  count: 1
}

export const StoreContext = React.createContext<Partial<StoreContextType>>(defaultState);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [count, setCount] = useState(defaultState.count);

  const addCount = () => {
    setCount(count + 1);
  };

  const subtractCount = () => {
    setCount(count - 1);
  };

  return (
    <StoreContext.Provider value={{ count, addCount, subtractCount }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;