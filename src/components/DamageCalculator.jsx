import { useState, useEffect } from 'react'
import './DamageCalculator.css'

function DamageCalculator({ onClose }) {
  const [attacker, setAttacker] = useState(null)
  const [defender, setDefender] = useState(null)
  const [attackerSearch, setAttackerSearch] = useState('')
  const [defenderSearch, setDefenderSearch] = useState('')
  const [selectedMove, setSelectedMove] = useState(null)
  const [moves, setMoves] = useState([])
  const [damage, setDamage] = useState(null)
  const [effectiveness, setEffectiveness] = useState(1)

  useEffect(() => {
    if (attacker) {
      loadMoves()
    }
  }, [attacker])

  const searchPokemon = async (query, isAttacker) => {
    if (!query) return
    
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
      const data = await res.json()
      
      if (isAttacker) {
        setAttacker(data)
        setAttackerSearch('')
      } else {
        setDefender(data)
        setDefenderSearch('')
      }
    } catch (err) {
      alert('Pokémon no encontrado')
    }
  }

  const loadMoves = async () => {
    try {
      const movesData = await Promise.all(
        attacker.moves.slice(0, 10).map(m =>
          fetch(m.move.url).then(r => r.json())
        )
      )
      setMoves(movesData.filter(m => m.power))
    } catch (err) {
      console.error('Error loading moves:', err)
    }
  }

  const calculateDamage = () => {
    if (!attacker || !defender || !selectedMove) return

    const level = 50
    const power = selectedMove.power
    const attackStat = selectedMove.damage_class.name === 'physical'
      ? getStatValue(attacker, 'attack')
      : getStatValue(attacker, 'special-attack')
    const defenseStat = selectedMove.damage_class.name === 'physical'
      ? getStatValue(defender, 'defense')
      : getStatValue(defender, 'special-defense')

    // Calcular efectividad de tipo
    const eff = calculateEffectiveness(
      selectedMove.type.name,
      defender.types.map(t => t.type.name)
    )
    setEffectiveness(eff)

    // STAB (Same Type Attack Bonus)
    const stab = attacker.types.some(t => t.type.name === selectedMove.type.name) ? 1.5 : 1

    // Fórmula de daño de Pokémon
    const baseDamage = ((2 * level / 5 + 2) * power * attackStat / defenseStat) / 50 + 2
    const finalDamage = Math.floor(baseDamage * stab * eff * (Math.random() * 0.15 + 0.85))

    setDamage(finalDamage)
  }

  const getStatValue = (pokemon, statName) => {
    return pokemon.stats.find(s => s.stat.name === statName).base_stat
  }

  const calculateEffectiveness = (attackType, defenseTypes) => {
    const chart = {
      normal: { rock: 0.5, ghost: 0, steel: 0.5 },
      fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
      water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
      electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
      grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
      ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
      fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
      poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
      ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
      flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
      psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
      bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
      rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
      ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
      dragon: { dragon: 2, steel: 0.5, fairy: 0 },
      dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
      steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
      fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
    }

    let totalEffectiveness = 1
    defenseTypes.forEach(defType => {
      const modifier = chart[attackType]?.[defType]
      if (modifier !== undefined) {
        totalEffectiveness *= modifier
      }
    })

    return totalEffectiveness
  }

  const getEffectivenessText = (eff) => {
    if (eff === 0) return 'NO EFFECT'
    if (eff < 1) return 'NOT VERY EFFECTIVE'
    if (eff > 1) return 'SUPER EFFECTIVE!'
    return 'NORMAL'
  }

  const getEffectivenessColor = (eff) => {
    if (eff === 0) return '#666'
    if (eff < 1) return '#ff0000'
    if (eff > 1) return '#00ff00'
    return '#ffcc00'
  }

  return (
    <div className="calc-overlay">
      <div className="calc-container">
        <button className="calc-close" onClick={onClose}>✕</button>
        
        <h2 className="calc-title">DAMAGE CALCULATOR</h2>

        <div className="calc-grid">
          {/* Attacker */}
          <div className="calc-section">
            <h3 className="section-title">ATTACKER</h3>
            {!attacker ? (
              <div className="pokemon-search">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pokemon name..."
                  value={attackerSearch}
                  onChange={(e) => setAttackerSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPokemon(attackerSearch, true)}
                />
                <button
                  className="search-btn"
                  onClick={() => searchPokemon(attackerSearch, true)}
                >
                  SEARCH
                </button>
              </div>
            ) : (
              <div className="pokemon-card">
                <img
                  src={attacker.sprites.front_default}
                  alt={attacker.name}
                  className="pokemon-sprite"
                />
                <div className="pokemon-name">{attacker.name}</div>
                <button
                  className="change-btn"
                  onClick={() => setAttacker(null)}
                >
                  CHANGE
                </button>
              </div>
            )}
          </div>

          {/* Defender */}
          <div className="calc-section">
            <h3 className="section-title">DEFENDER</h3>
            {!defender ? (
              <div className="pokemon-search">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pokemon name..."
                  value={defenderSearch}
                  onChange={(e) => setDefenderSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchPokemon(defenderSearch, false)}
                />
                <button
                  className="search-btn"
                  onClick={() => searchPokemon(defenderSearch, false)}
                >
                  SEARCH
                </button>
              </div>
            ) : (
              <div className="pokemon-card">
                <img
                  src={defender.sprites.front_default}
                  alt={defender.name}
                  className="pokemon-sprite"
                />
                <div className="pokemon-name">{defender.name}</div>
                <button
                  className="change-btn"
                  onClick={() => setDefender(null)}
                >
                  CHANGE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Moves */}
        {attacker && moves.length > 0 && (
          <div className="moves-section">
            <h3 className="section-title">SELECT MOVE</h3>
            <div className="moves-grid">
              {moves.map((move, index) => (
                <button
                  key={index}
                  className={`move-btn ${selectedMove?.name === move.name ? 'selected' : ''}`}
                  onClick={() => setSelectedMove(move)}
                >
                  <span className="move-name">{move.name.replace('-', ' ')}</span>
                  <span className="move-power">PWR: {move.power}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {attacker && defender && selectedMove && (
          <button className="calculate-btn" onClick={calculateDamage}>
            CALCULATE DAMAGE
          </button>
        )}

        {/* Result */}
        {damage !== null && (
          <div className="damage-result">
            <div className="result-damage">
              <span className="result-label">DAMAGE:</span>
              <span className="result-value">{damage} HP</span>
            </div>
            <div
              className="result-effectiveness"
              style={{ color: getEffectivenessColor(effectiveness) }}
            >
              {getEffectivenessText(effectiveness)} (x{effectiveness})
            </div>
            <div className="result-percentage">
              ~{Math.round((damage / getStatValue(defender, 'hp')) * 100)}% of HP
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DamageCalculator
