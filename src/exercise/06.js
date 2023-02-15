// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import * as ReactErrorBoundary from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonDataView,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      setState({status: 'idle'})
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon, status: 'resolved'})
      })
      .catch(error => {
        setState({error, status: 'rejected'})
      })
  }, [pokemonName])

  switch (status) {
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw error
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'idle':
    default:
      return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  function ErrorFallback({error, resetErrorBoundary}) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ReactErrorBoundary.ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={{pokemonName}} >
          <PokemonInfo pokemonName={pokemonName} />
        </ReactErrorBoundary.ErrorBoundary>
      </div>
    </div>
  )
}

export default App
