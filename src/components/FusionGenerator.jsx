import { useState } from 'react'
import './FusionGenerator.css'

function FusionGenerator({ onClose }) {
  const [pokemon1, setPokemon1] = useState(null)
  const [pokemon2, setPokemon2] = useState(null)
  const [search1, setSearch1] = useState('')
  const [search2, setSearch2] = useState('')
  const [fusion, setFusion] = useState(null)

  const searchPokemon = async (query, isPokemon1) => {
    if (!query) return
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      const data = await res.json()
      
      if (isPokemon1) {
        setPokemon1(data)
        setSearch1('')
      } else {
        setPokemon2(data)
        setSearch2('')
      }
      setFusion(null)
    } catch (err) {
      alert('Pokémon no encontrado')
    }
  }

  const generateFusion = () => {
    if (!pokemon1 || !pokemon2) return

    // Fusionar nombres
    const name1 = pokemon1.name
    const name2 = pokemon2.name
    const fusedName = name1.slice(0, Math.ceil(name1.length / 2)) + 
                      name2.slice(Math.floor(name2.length / 2))

    // Fusionar tipos (tomar tipos únicos)
    const types = [...pokemon1.types, ...pokemon2.types]
      .map(t => t.type.name)
      .filter((type, index, self) => self.indexOf(type) === index)
      .slice(0, 2)

    // Fusionar stats (promedio)
    const fusedStats = pokemon1.stats.map((stat, index) => ({
      name: stat.stat.name,
      value: Math.round((stat.base_stat + pokemon2.stats[index].base_stat) / 2)
    }))

    // Fusionar habilidades
    const abilities = [...pokemon1.abilities, ...pokemon2.abilities]
      .map(a => a.ability.name)
      .filter((ability, index, self) => self.indexOf(ability) === index)
      .slice(0, 3)

    setFusion({
      name: fusedName,
      types,
      stats: fusedStats,
      abilities,
      sprite1: pokemon1.sprites.front_default,
      sprite2: pokemon2.sprites.front_default,
      height: Math.round((pokemon1.height + pokemon2.height) / 2),
      weight: Math.round((pokemon1.weight + pokemon2.weight) / 2)
    })

    // Guardar en historial
    const fusions = JSON.parse(localStorage.getItem('fusionHistory') || '[]')
    fusions.unshift({
      name: fusedName,
      pokemon1: pokemon1.name,
      pokemon2: pokemon2.name,
      date: new Date().toISOString()
    })
    localStorage.setItem('fusionHistory', JSON.stringify(fusions.slice(0, 10)))
  }

  const randomFusion = async () => {
    const id1 = Math.floor(Math.random() * 898) + 1
    const id2 = Math.floor(Math.random() * 898) + 1
    
    try {
      const [res1, res2] = await Promise.all([
        fetch(`https://pokeapi.co/api/v2/pokemon/${id1}`),
        fetch(`https://pokeapi.co/api/v2/pokemon/${id2}`)
      ])
      
      const [data1, data2] = await Promise.all([res1.json(), res2.json()])
      
      setPokemon1(data1)
      setPokemon2(data2)
      setFusion(null)
    } catch (err) {
      console.error('Error generating random fusion:', err)
    }
  }

  const getTypeColor = (type) => {
    const colors = {
      normal: '#a8a878', fire: '#f08030', water: '#6890f0',
      electric: '#f8d030', grass: '#78c850', ice: '#98d8d8',
      fighting: '#c03028', poison: '#a040a0', ground: '#e0c068',
      flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
      rock: '#b8a038', ghost: '#705898', dragon: '#7038f8',
      dark: '#705848', steel: '#b8b8d0', fairy: '#ee99ac'
    }
    return colors[type] || '#777'
  }

  return (
    <div className="fusion-overlay">
      <div className="fusion-container">
        <button className="fusion-close" onClick={onClose}>✕</button>
        
        <h2 className="fusion-title">POKEMON FUSION</h2>

        <button className="random-fusion-btn" onClick={randomFusion}>
          🎲 RANDOM FUSION
        </button>

        <div className="fusion-grid">
          {/* Pokemon 1 */}
          <div className="fusion-section">
            <h3 className="section-title">POKEMON 1</h3>
            {!pokemon1 ? (
              <div className="pokemon-search">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pokemon name..."
                  value={search1}
                  onChange={(e) => setSearch1(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPokemon(search1, true)}
                />
                <button
                  className="search-btn"
                  onClick={() => searchPokemon(search1, true)}
                >
                  SEARCH
                </button>
              </div>
            ) : (
              <div className="pokemon-card">
                <img
                  src={pokemon1.sprites.front_default}
                  alt={pokemon1.name}
                  className="pokemon-sprite"
                />
                <div className="pokemon-name">{pokemon1.name}</div>
                <button
                  className="change-btn"
                  onClick={() => setPokemon1(null)}
                >
                  CHANGE
                </button>
              </div>
            )}
          </div>

          {/* Plus Sign */}
          <div className="fusion-plus">+</div>

          {/* Pokemon 2 */}
          <div className="fusion-section">
            <h3 className="section-title">POKEMON 2</h3>
            {!pokemon2 ? (
              <div className="pokemon-search">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pokemon name..."
                  value={search2}
                  onChange={(e) => setSearch2(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPokemon(search2, false)}
                />
                <button
                  className="search-btn"
                  onClick={() => searchPokemon(search2, false)}
                >
                  SEARCH
                </button>
              </div>
            ) : (
              <div className="pokemon-card">
                <img
                  src={pokemon2.sprites.front_default}
                  alt={pokemon2.name}
                  className="pokemon-sprite"
                />
                <div className="pokemon-name">{pokemon2.name}</div>
                <button
                  className="change-btn"
                  onClick={() => setPokemon2(null)}
                >
                  CHANGE
                </button>
              </div>
            )}
          </div>
        </div>

        {pokemon1 && pokemon2 && !fusion && (
          <button className="generate-btn" onClick={generateFusion}>
            ⚡ GENERATE FUSION
          </button>
        )}

        {fusion && (
          <div className="fusion-result">
            <div className="result-header">
              <h3 className="result-title">FUSION RESULT</h3>
            </div>

            <div className="result-sprites">
              <img src={fusion.sprite1} alt="Pokemon 1" className="result-sprite left" />
              <div className="fusion-arrow">→</div>
              <img src={fusion.sprite2} alt="Pokemon 2" className="result-sprite right" />
            </div>

            <div className="result-name">{fusion.name.toUpperCase()}</div>

            <div className="result-types">
              {fusion.types.map(type => (
                <span
                  key={type}
                  className="type-badge"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type.toUpperCase()}
                </span>
              ))}
            </div>

            <div className="result-info">
              <div className="info-item">
                <span className="info-label">HEIGHT:</span>
                <span className="info-value">{(fusion.height / 10).toFixed(1)}m</span>
              </div>
              <div className="info-item">
                <span className="info-label">WEIGHT:</span>
                <span className="info-value">{(fusion.weight / 10).toFixed(1)}kg</span>
              </div>
            </div>

            <div className="result-stats">
              <h4 className="stats-title">STATS</h4>
              {fusion.stats.map(stat => (
                <div key={stat.name} className="stat-row">
                  <span className="stat-name">{stat.name.toUpperCase()}:</span>
                  <span className="stat-value">{stat.value}</span>
                  <div className="stat-bar">
                    <div
                      className="stat-bar-fill"
                      style={{ width: `${(stat.value / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="stat-total">
                TOTAL: {fusion.stats.reduce((sum, s) => sum + s.value, 0)}
              </div>
            </div>

            <div className="result-abilities">
              <h4 className="abilities-title">ABILITIES</h4>
              <div className="abilities-list">
                {fusion.abilities.map(ability => (
                  <span key={ability} className="ability-badge">
                    {ability.replace('-', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <button className="new-fusion-btn" onClick={() => setFusion(null)}>
              CREATE NEW FUSION
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FusionGenerator
