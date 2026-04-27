import { useState, useEffect } from 'react'
import './BattleMode.css'

function BattleMode({ pokemon1, pokemon2, onClose }) {
  const [battleStarted, setBattleStarted] = useState(false)
  const [currentStat, setCurrentStat] = useState(0)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })

  const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
  
  useEffect(() => {
    if (battleStarted && currentStat < stats.length) {
      const timer = setTimeout(() => {
        const stat1 = pokemon1.stats.find(s => s.stat.name === stats[currentStat]).base_stat
        const stat2 = pokemon2.stats.find(s => s.stat.name === stats[currentStat]).base_stat
        
        setScores(prev => ({
          p1: prev.p1 + (stat1 > stat2 ? 1 : stat1 === stat2 ? 0.5 : 0),
          p2: prev.p2 + (stat2 > stat1 ? 1 : stat2 === stat1 ? 0.5 : 0)
        }))
        
        setCurrentStat(prev => prev + 1)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [battleStarted, currentStat])

  const getStatValue = (pokemon, statName) => {
    return pokemon.stats.find(s => s.stat.name === statName).base_stat
  }

  const formatStatName = (name) => {
    const names = {
      'hp': 'HP',
      'attack': 'ATK',
      'defense': 'DEF',
      'special-attack': 'SP.ATK',
      'special-defense': 'SP.DEF',
      'speed': 'SPD'
    }
    return names[name] || name
  }

  const winner = currentStat >= stats.length 
    ? scores.p1 > scores.p2 ? pokemon1 : scores.p2 > scores.p1 ? pokemon2 : null
    : undefined

  return (
    <div className="battle-overlay">
      <div className="battle-container">
        <button className="battle-close" onClick={onClose}>X</button>

        <div className="battle-header">
          <h2 className="battle-title">BATALLA POKEMON</h2>
          <div className="battle-score">
            <span className="score-item">{pokemon1.name.toUpperCase()}: {scores.p1}</span>
            <span className="score-divider">VS</span>
            <span className="score-item">{pokemon2.name.toUpperCase()}: {scores.p2}</span>
          </div>
        </div>

        <div className="battle-arena">
          <div className={`battle-pokemon ${battleStarted && currentStat < stats.length ? 'attacking' : ''} ${winner === pokemon1 ? 'winner' : winner === pokemon2 ? 'loser' : ''}`}>
            <div className="pokemon-sprite-container">
              <img 
                src={pokemon1.sprites.front_default} 
                alt={pokemon1.name}
                className="pokemon-sprite"
              />
            </div>
            <div className="pokemon-name">{pokemon1.name.toUpperCase()}</div>
            <div className="pokemon-types-battle">
              {pokemon1.types.map(t => (
                <span key={t.type.name} className={`type-badge-battle ${t.type.name}`}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="battle-vs">
            {!battleStarted && (
              <button className="battle-start" onClick={() => setBattleStarted(true)}>
                BATALLA!
              </button>
            )}
            {battleStarted && currentStat < stats.length && (
              <div className="battle-current-stat">
                {formatStatName(stats[currentStat])}
              </div>
            )}
            {winner !== undefined && (
              <div className="battle-result">
                {winner === null ? 'EMPATE!' : `${winner.name.toUpperCase()} GANA!`}
              </div>
            )}
          </div>

          <div className={`battle-pokemon ${battleStarted && currentStat < stats.length ? 'attacking' : ''} ${winner === pokemon2 ? 'winner' : winner === pokemon1 ? 'loser' : ''}`}>
            <div className="pokemon-sprite-container">
              <img 
                src={pokemon2.sprites.front_default} 
                alt={pokemon2.name}
                className="pokemon-sprite"
              />
            </div>
            <div className="pokemon-name">{pokemon2.name.toUpperCase()}</div>
            <div className="pokemon-types-battle">
              {pokemon2.types.map(t => (
                <span key={t.type.name} className={`type-badge-battle ${t.type.name}`}>
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {battleStarted && (
          <div className="battle-stats">
            {stats.map((statName, index) => {
              const stat1 = getStatValue(pokemon1, statName)
              const stat2 = getStatValue(pokemon2, statName)
              const isActive = index === currentStat
              const isPast = index < currentStat
              
              return (
                <div key={statName} className={`stat-comparison ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                  <div className="stat-label">{formatStatName(statName)}</div>
                  <div className="stat-values">
                    <span className={`stat-val ${isPast && stat1 > stat2 ? 'win' : isPast && stat1 < stat2 ? 'lose' : ''}`}>
                      {stat1}
                    </span>
                    <span className="stat-vs">VS</span>
                    <span className={`stat-val ${isPast && stat2 > stat1 ? 'win' : isPast && stat2 < stat1 ? 'lose' : ''}`}>
                      {stat2}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BattleMode
