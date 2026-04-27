import { useEffect, useState } from 'react'
import './PokemonCard.css'

function PokemonCard({ pokemon, onBattleClick, onDetailClick }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const primaryType = pokemon.types[0].type.name

  useEffect(() => {
    setImageLoaded(false)
  }, [pokemon.id])

  const formatStatName = (name) => {
    const statNames = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      'speed': 'Velocidad'
    }
    return statNames[name] || name
  }

  const getStatColor = (value) => {
    if (value >= 100) return '#10b981'
    if (value >= 70) return '#3b82f6'
    if (value >= 50) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className={`pokemon-card ${primaryType}`}>
      <div className="card-header">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
      </div>

      <div className="card-actions">
        {onBattleClick && (
          <button className="battle-button" onClick={onBattleClick}>
            MODO BATALLA
          </button>
        )}
        {onDetailClick && (
          <button className="detail-button" onClick={() => onDetailClick(pokemon)}>
            VER INFO
          </button>
        )}
      </div>

      <div className="pokemon-image-container">
        {!imageLoaded && <div className="image-skeleton"></div>}
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className={`pokemon-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="pokemon-types">
        {pokemon.types.map((type) => (
          <span key={type.type.name} className={`type-badge ${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>

      <div className="pokemon-info">
        <div className="info-item">
          <span className="info-label">Peso</span>
          <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
        </div>
        <div className="info-item">
          <span className="info-label">Altura</span>
          <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
        </div>
      </div>

      <div className="pokemon-stats">
        <h3 className="stats-title">Estadísticas</h3>
        {pokemon.stats.map((stat) => (
          <div key={stat.stat.name} className="stat-row">
            <span className="stat-name">{formatStatName(stat.stat.name)}</span>
            <div className="stat-bar-container">
              <div 
                className="stat-bar"
                style={{ 
                  width: `${Math.min(stat.base_stat, 255) / 255 * 100}%`,
                  background: getStatColor(stat.base_stat)
                }}
              >
                <span className="stat-value">{stat.base_stat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pokemon-abilities">
        <h3 className="abilities-title">Habilidades</h3>
        <div className="abilities-list">
          {pokemon.abilities.map((ability) => (
            <span key={ability.ability.name} className="ability-badge">
              {ability.ability.name.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PokemonCard
