// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, { useState, useEffect, useRef } from 'react';

const useLocalStorageState = (key, defaultValue) => {
  const getInitialValue = () => {
    const localStorageValue = window.localStorage.getItem(key);
    return localStorageValue ? JSON.parse(localStorageValue) : defaultValue
  };

  const [state, setState] = useState(getInitialValue);

  const prevKeyRef = useRef(key);

  useEffect(() => {
    const prevKey = prevKeyRef.current;
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey);
    }

    prevKeyRef.current = key;
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const Greeting = ({ initialName = '' }) => {
  const [name, setName] = useLocalStorageState('name', initialName);

  const handleChange = (event) => {
    setName(event.target.value)
  };

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  );
};

const App = () => {
  return <Greeting />
};

export default App;
