// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, { useCallback, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary';
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

const PokemonInfo = ({ pokemonName }) => {
  const [state, setState] = useState({
    pokemon: null,
    status: 'idle',
    error: null
  });

  const { pokemon, status, error } = state;

  const loadPokemon = useCallback(async () => {
    setState({
      status: 'pending',
    });

    try {
      const pokemonData = await fetchPokemon(pokemonName);
      setState({
        pokemon: pokemonData,
        status: 'resolved',
      });
    } catch (error) {
      setState({
        status: 'rejected',
        error
      });
    }
  }, [pokemonName]);

  useEffect(() => {
    if (pokemonName) {
      loadPokemon();
    }
  }, [pokemonName, loadPokemon]);

  switch (status) {
    case 'idle':
      return 'Submit a pokemon!';
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />;
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />;
    case 'rejected':
      throw error;
    default:
      throw new Error('Unknown status has been given');
  }
};

const ErrorFallback = ({ error }) => (
  <div role="alert">
    There was an error: <pre style={{ whiteSpace: 'normal' }}>{error.message}</pre>
  </div>
);

const App = () => {
  const [pokemonName, setPokemonName] = useState('');

  const handleSubmit = (newPokemonName) => {
    setPokemonName(newPokemonName);
  };

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App
