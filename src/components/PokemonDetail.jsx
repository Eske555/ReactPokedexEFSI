import { useState, useEffect } from 'react'
import './PokemonDetail.css'

function PokemonDetail({ pokemon, onClose, onBattleClick }) {
  const [species, setSpecies] = useState(null)
  const [description, setDescription] = useState('')
  const [evolutionChain, setEvolutionChain] = useState(null)
  const [showShiny, setShowShiny] = useState(false)
  const [activeTab, setActiveTab] = useState('info') // info, moves, evolution, locations
  const [allMoves, setAllMoves] = useState([])
  const [locations, setLocations] = useState([])
  const [isInTeam, setIsInTeam] = useState(false)

  useEffect(() => {
    fetchAllData()
    checkIfInTeam()
  }, [pokemon])

  const checkIfInTeam = () => {
    const team = JSON.parse(localStorage.getItem('pokemonTeam') || '[]')
    setIsInTeam(team.some(p => p.id === pokemon.id))
  }

  const toggleTeam = () => {
    let team = JSON.parse(localStorage.getItem('pokemonTeam') || '[]')
    
    if (isInTeam) {
      team = team.filter(p => p.id !== pokemon.id)
    } else {
      if (team.length >= 6) {
        alert('Tu equipo ya tiene 6 Pokémon! Elimina uno primero.')
        return
      }
      team.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.front_default,
        types: pokemon.types,
        stats: pokemon.stats
      })
    }
    
    localStorage.setItem('pokemonTeam', JSON.stringify(team))
    setIsInTeam(!isInTeam)
    
    // Disparar evento para actualizar otros componentes
    window.dispatchEvent(new Event('teamUpdated'))
  }

  const fetchAllData = async () => {
    try {
      // Species data
      const speciesRes = await fetch(pokemon.species.url)
      const speciesData = await speciesRes.json()
      setSpecies(speciesData)
      
      // Description
      const flavorText = speciesData.flavor_text_entries.find(
        entry => entry.language.name === 'es' || entry.language.name === 'en'
      )
      if (flavorText) {
        setDescription(flavorText.flavor_text.replace(/\f/g, ' '))
      }

      // Evolution chain
      const evolutionRes = await fetch(speciesData.evolution_chain.url)
      const evolutionData = await evolutionRes.json()
      setEvolutionChain(evolutionData.chain)

      // Locations
      const locationsRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`)
      const locationsData = await locationsRes.json()
      setLocations(locationsData)

      // Detailed moves
      const movesData = await Promise.all(
        pokemon.moves.slice(0, 20).map(m => 
          fetch(m.move.url).then(r => r.json())
        )
      )
      setAllMoves(movesData)
      
    } catch (err) {
      console.error('Error fetching data:', err)
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

  const formatHeight = (height) => {
    const meters = height / 10
    const feet = Math.floor(meters * 3.28084)
    const inches = Math.round((meters * 3.28084 - feet) * 12)
    return `${feet}'${inches}"`
  }

  const formatWeight = (weight) => {
    const kg = weight / 10
    const lbs = (kg * 2.20462).toFixed(1)
    return `${lbs} lbs.`
  }

  const getStatName = (stat) => {
    const names = {
      'hp': 'HP',
      'attack': 'ATK',
      'defense': 'DEF',
      'special-attack': 'SP.ATK',
      'special-defense': 'SP.DEF',
      'speed': 'SPD'
    }
    return names[stat] || stat.toUpperCase()
  }

  const parseEvolutionChain = (chain) => {
    const evolutions = []
    let current = chain

    const addEvolution = (evo) => {
      evolutions.push({
        name: evo.species.name,
        id: evo.species.url.split('/').slice(-2, -1)[0],
        trigger: evo.evolution_details[0]?.trigger?.name || 'level-up',
        minLevel: evo.evolution_details[0]?.min_level || null,
        item: evo.evolution_details[0]?.item?.name || null
      })
    }

    // Primera evolución
    evolutions.push({
      name: current.species.name,
      id: current.species.url.split('/').slice(-2, -1)[0]
    })

    // Siguientes evoluciones
    while (current.evolves_to.length > 0) {
      current = current.evolves_to[0]
      addEvolution(current)
    }

    return evolutions
  }

  const currentSprite = showShiny 
    ? (pokemon.sprites.front_shiny || pokemon.sprites.front_default)
    : (pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default)

  return (
    <div className="pokemon-detail-overlay">
      <div className="pokemon-detail-container">
        <div className="detail-header">
          <div className="detail-title-row">
            <div className="detail-title-left">
              <span className="detail-number">No. {String(pokemon.id).padStart(3, '0')}</span>
              <span className="detail-name">{pokemon.name}</span>
            </div>
            <div className="detail-title-right">
              <button 
                className={`team-button ${isInTeam ? 'in-team' : ''}`}
                onClick={toggleTeam}
                title={isInTeam ? 'Quitar del equipo' : 'Agregar al equipo'}
              >
                {isInTeam ? '★' : '☆'}
              </button>
              {onBattleClick && (
                <button 
                  className="battle-detail-button"
                  onClick={() => {
                    onClose()
                    onBattleClick()
                  }}
                  title="Iniciar batalla"
                >
                  BATTLE
                </button>
              )}
              <button className="detail-close" onClick={onClose}>X</button>
            </div>
          </div>
          <div className="detail-category">
            {species?.genera?.find(g => g.language.name === 'en')?.genus || 'Pokemon'}
          </div>
        </div>

        <div className="detail-tabs">
          <button 
            className={`tab-button ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            INFO
          </button>
          <button 
            className={`tab-button ${activeTab === 'moves' ? 'active' : ''}`}
            onClick={() => setActiveTab('moves')}
          >
            MOVES
          </button>
          <button 
            className={`tab-button ${activeTab === 'evolution' ? 'active' : ''}`}
            onClick={() => setActiveTab('evolution')}
          >
            EVOLUTION
          </button>
          <button 
            className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            LOCATIONS
          </button>
        </div>

        <div className="detail-content">
          {activeTab === 'info' && (
            <div className="detail-main">
              <div className="detail-left">
                <div className="detail-sprite-container">
                  <img 
                    src={currentSprite}
                    alt={pokemon.name}
                    className="detail-sprite"
                  />
                  <button 
                    className="shiny-toggle"
                    onClick={() => setShowShiny(!showShiny)}
                  >
                    {showShiny ? '✨ SHINY' : '⭐ NORMAL'}
                  </button>
                </div>

                <div className="detail-types">
                  {pokemon.types.map(t => (
                    <span 
                      key={t.type.name}
                      className="detail-type-badge"
                      style={{ backgroundColor: getTypeColor(t.type.name) }}
                    >
                      {t.type.name.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="detail-measurements">
                  <div className="measurement-box">
                    <div className="measurement-label">Height</div>
                    <div className="measurement-value">{formatHeight(pokemon.height)}</div>
                  </div>
                  <div className="measurement-box">
                    <div className="measurement-label">Weight</div>
                    <div className="measurement-value">{formatWeight(pokemon.weight)}</div>
                  </div>
                </div>

                <div className="detail-description">
                  {description || 'Loading description...'}
                </div>
              </div>

              <div className="detail-right">
                <div className="detail-stats-section">
                  <div className="stats-title">BASE STATS</div>
                  {pokemon.stats.map(stat => (
                    <div key={stat.stat.name} className="stat-row">
                      <div className="stat-name">{getStatName(stat.stat.name)}</div>
                      <div className="stat-value">{stat.base_stat}</div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill"
                          style={{ 
                            width: `${(stat.base_stat / 255) * 100}%`,
                            backgroundColor: stat.base_stat > 100 ? '#00ff00' : stat.base_stat > 50 ? '#ffcc00' : '#ff0000'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="stat-total">
                    TOTAL: {pokemon.stats.reduce((sum, s) => sum + s.base_stat, 0)}
                  </div>
                </div>

                <div className="detail-abilities-section">
                  <div className="abilities-title">ABILITIES</div>
                  {pokemon.abilities.map(ability => (
                    <div key={ability.ability.name} className="ability-item">
                      <span className="ability-icon">⚡</span>
                      <span className="ability-name">
                        {ability.ability.name.replace('-', ' ').toUpperCase()}
                      </span>
                      {ability.is_hidden && <span className="ability-hidden">(HIDDEN)</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'moves' && (
            <div className="moves-tab-content">
              <div className="moves-list">
                {allMoves.map((move, index) => (
                  <div key={index} className="move-detail-card">
                    <div className="move-header">
                      <span className="move-name">{move.name.replace('-', ' ')}</span>
                      <span 
                        className="move-type-badge"
                        style={{ backgroundColor: getTypeColor(move.type.name) }}
                      >
                        {move.type.name}
                      </span>
                    </div>
                    <div className="move-stats">
                      <div className="move-stat">
                        <span className="move-stat-label">Power:</span>
                        <span className="move-stat-value">{move.power || '-'}</span>
                      </div>
                      <div className="move-stat">
                        <span className="move-stat-label">Accuracy:</span>
                        <span className="move-stat-value">{move.accuracy || '-'}</span>
                      </div>
                      <div className="move-stat">
                        <span className="move-stat-label">PP:</span>
                        <span className="move-stat-value">{move.pp}</span>
                      </div>
                      <div className="move-stat">
                        <span className="move-stat-label">Class:</span>
                        <span className="move-stat-value">{move.damage_class.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'evolution' && evolutionChain && (
            <div className="evolution-tab-content">
              <div className="evolution-chain">
                {parseEvolutionChain(evolutionChain).map((evo, index) => (
                  <div key={index} className="evolution-stage">
                    <div className="evolution-pokemon">
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                        alt={evo.name}
                        className="evolution-sprite"
                      />
                      <div className="evolution-name">{evo.name}</div>
                      <div className="evolution-id">#{String(evo.id).padStart(3, '0')}</div>
                    </div>
                    {index < parseEvolutionChain(evolutionChain).length - 1 && (
                      <div className="evolution-arrow">
                        <div className="arrow">→</div>
                        {evo.minLevel && <div className="evolution-method">Lv. {parseEvolutionChain(evolutionChain)[index + 1].minLevel}</div>}
                        {evo.item && <div className="evolution-method">{parseEvolutionChain(evolutionChain)[index + 1].item}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="locations-tab-content">
              {locations.length > 0 ? (
                <div className="locations-list">
                  {locations.map((loc, index) => (
                    <div key={index} className="location-item">
                      <div className="location-name">
                        {loc.location_area.name.replace('-', ' ').toUpperCase()}
                      </div>
                      <div className="location-games">
                        {loc.version_details.map((ver, i) => (
                          <span key={i} className="game-badge">
                            {ver.version.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-locations">
                  No location data available for this Pokémon.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail
