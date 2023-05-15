import React, { useReducer } from 'react';
import { Brewery } from '../types';

export interface State {
  breweries: Pick<Brewery, 'id' | 'name'>[],
  dispatch?: any
}

export interface Action {
  type: string,
  id: string,
  name: string
}

const reducer = (prevState: State, action: Action): State => {
  switch (action.type) {
    case "ADD":
      const state = {
        breweries: [...prevState.breweries, { id: action.id, name: action.name }]
      }
      return state;
    default:
      throw new Error();
  }
};

const initialState: State = {
  breweries: []
};

export const StoreContext = React.createContext<State>(initialState);

export const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider value={{ ...state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContext;