import { useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import PokemonCard from './components/PokemonCard'
import PokemonGrid from './components/PokemonGrid'
import PokemonGridView from './components/PokemonGridView'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import SplashScreen from './components/SplashScreen'
import BattleMode from './components/BattleMode'
import BattleSelector from './components/BattleSelector'
import PokemonDetail from './components/PokemonDetail'
import TeamView from './components/TeamView'
import PokemonHistory from './components/PokemonHistory'
import './App.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [pokemon, setPokemon] = useState(null)
  const [pokemonList, setPokemonList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchType, setSearchType] = useState('pokemon')
  const [battleMode, setBattleMode] = useState(false)
  const [battleOpponent, setBattleOpponent] = useState(null)
  const [showBattleSelector, setShowBattleSelector] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showDetail, setShowDetail] = useState(false)
  const [detailPokemon, setDetailPokemon] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'search'
  const [showTeam, setShowTeam] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const trackPokemonView = (pokemonData) => {
    const history = JSON.parse(localStorage.getItem('pokemonHistory') || '[]')
    const newEntry = {
      name: pokemonData.name,
      id: pokemonData.id,
      sprite: pokemonData.sprites.front_default,
      timestamp: new Date().toISOString()
    }
    history.unshift(newEntry)
    localStorage.setItem('pokemonHistory', JSON.stringify(history))
  }

  const handleLogoClick = () => {
    setShowSplash(true)
    setPokemon(null)
    setPokemonList([])
    setError('')
    setBattleMode(false)
    setBattleOpponent(null)
    setSuggestions([])
    setViewMode('grid')
  }

  const handleBattleClick = () => {
    setShowBattleSelector(true)
  }

  const handleBattleRandom = async () => {
    const randomId = Math.floor(Math.random() * 898) + 1
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      const data = await res.json()
      setBattleOpponent(data)
      setBattleMode(true)
      setShowBattleSelector(false)
    } catch (err) {
      setError('No se pudo cargar el oponente para la batalla')
    }
  }

  const handleBattleSelect = async (opponentName) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${opponentName.toLowerCase()}`)
      const data = await res.json()
      setBattleOpponent(data)
      setBattleMode(true)
      setShowBattleSelector(false)
    } catch (err) {
      setError('No se pudo cargar el oponente seleccionado')
    }
  }

  const searchPokemon = async (query) => {
    if (!query.trim()) {
      setError('Por favor ingresá un nombre válido')
      return
    }

    clearUI()
    setLoading(true)
    setViewMode('search')

    try {
      const normalizedQuery = query.toLowerCase().trim()
      
      // Intentar buscar como Pokémon individual
      let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedQuery}`)
      
      if (res.ok) {
        const data = await res.json()
        setPokemon(data)
        setSearchType('pokemon')
        return
      }

      // Si falla, intentar buscar como tipo
      res = await fetch(`https://pokeapi.co/api/v2/type/${normalizedQuery}`)
      
      if (res.ok) {
        const data = await res.json()
        
        // Obtener detalles de los primeros 12 Pokémon del tipo
        const pokemonPromises = data.pokemon
          .slice(0, 12)
          .map(p => fetch(p.pokemon.url).then(r => r.json()))
        
        const pokemonDetails = await Promise.all(pokemonPromises)
        setPokemonList(pokemonDetails)
        setSearchType('type')
        return
      }

      // Si no se encuentra, buscar sugerencias
      const allPokemonRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      const allPokemonData = await allPokemonRes.json()
      
      const similar = allPokemonData.results
        .filter(p => p.name.includes(normalizedQuery) || normalizedQuery.includes(p.name.substring(0, 3)))
        .slice(0, 6)
      
      if (similar.length > 0) {
        setSuggestions(similar.map(p => p.name))
        setError(`No se encontró "${query}". ¿Quisiste decir alguno de estos?`)
      } else {
        throw new Error('No encontrado')
      }

    } catch (err) {
      if (suggestions.length === 0) {
        setError('Pokémon o tipo no encontrado. Intentá con "pikachu", "charizard" o tipos como "fire", "water"')
      }
    } finally {
      setLoading(false)
    }
  }

  const clearUI = () => {
    setPokemon(null)
    setPokemonList([])
    setError('')
    setSuggestions([])
  }

  const handlePokemonClick = async (pokemonName) => {
    await searchPokemon(pokemonName)
  }

  const handleDetailClick = (pokemonData) => {
    trackPokemonView(pokemonData)
    setDetailPokemon(pokemonData)
    setShowDetail(true)
  }

  const handleGridPokemonClick = (pokemonData) => {
    trackPokemonView(pokemonData)
    setDetailPokemon(pokemonData)
    setShowDetail(true)
  }

  const handleBattleFromDetail = () => {
    if (detailPokemon) {
      setPokemon(detailPokemon)
      setShowBattleSelector(true)
    }
  }

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  return (
    <div className="app">
      <Header 
        onLogoClick={handleLogoClick}
        onTeamClick={() => setShowTeam(true)}
        onHistoryClick={() => setShowHistory(true)}
      />
      
      <main className="main-content">
        <SearchBar onSearch={searchPokemon} loading={loading} />
        
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onClose={() => { setError(''); setSuggestions([]); }} />}
        
        {suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions.map(name => (
              <button 
                key={name} 
                className="suggestion-button"
                onClick={() => searchPokemon(name)}
              >
                {name.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        
        {viewMode === 'grid' && !loading && !error && (
          <PokemonGridView onPokemonClick={handleGridPokemonClick} />
        )}
        
        {viewMode === 'search' && !loading && !error && pokemon && searchType === 'pokemon' && (
          <PokemonCard 
            pokemon={pokemon} 
            onBattleClick={handleBattleClick}
            onDetailClick={handleDetailClick}
          />
        )}
        
        {viewMode === 'search' && !loading && !error && pokemonList.length > 0 && searchType === 'type' && (
          <PokemonGrid pokemons={pokemonList} onPokemonClick={handlePokemonClick} />
        )}
      </main>

      {showBattleSelector && (
        <BattleSelector
          onRandom={handleBattleRandom}
          onSelect={handleBattleSelect}
          onClose={() => setShowBattleSelector(false)}
        />
      )}

      {battleMode && battleOpponent && (
        <BattleMode 
          pokemon1={pokemon} 
          pokemon2={battleOpponent} 
          onClose={() => {
            setBattleMode(false)
            setBattleOpponent(null)
          }} 
        />
      )}

      {showDetail && detailPokemon && (
        <PokemonDetail
          pokemon={detailPokemon}
          onClose={() => {
            setShowDetail(false)
            setDetailPokemon(null)
          }}
          onBattleClick={handleBattleFromDetail}
        />
      )}

      {showTeam && (
        <TeamView
          onPokemonClick={handleGridPokemonClick}
          onClose={() => setShowTeam(false)}
        />
      )}

      {showHistory && (
        <PokemonHistory
          onPokemonClick={handleGridPokemonClick}
          onClose={() => setShowHistory(false)}
        />
      )}

      <footer className="footer">
        <p>REACT + POKEAPI</p>
        <p className="footer-credits">
          BY: <a href="https://github.com/eske555" target="_blank" rel="noopener noreferrer">ESKE555</a> | 
          <a href="https://github.com/theotrosman" target="_blank" rel="noopener noreferrer">THEOTROSMAN</a> | 
          <a href="https://github.com/sebacalvino" target="_blank" rel="noopener noreferrer">SEBACALVINO</a>
        </p>
      </footer>
    </div>
  )
}

export default App
