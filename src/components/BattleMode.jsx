import { useState, useEffect } from 'react'
import './BattleMode.css'

function BattleMode({ pokemon1, pokemon2, onClose }) {
  const [battleText, setBattleText] = useState('¿Que deberia hacer?')
  const [hp1, setHp1] = useState(100)
  const [hp2, setHp2] = useState(100)
  const [isAttacking, setIsAttacking] = useState(null)
  const [winner, setWinner] = useState(null)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })
  const [attackEffect, setAttackEffect] = useState(null)
  const [moves1, setMoves1] = useState([])
  const [moves2, setMoves2] = useState([])
  const [moveCooldowns, setMoveCooldowns] = useState([0, 0, 0])
  const [turnCount, setTurnCount] = useState(0)

  useEffect(() => {
    // Obtener movimientos del Pokémon
    const fetchMoves = async () => {
      try {
        const movesData1 = await Promise.all(
          pokemon1.moves.slice(0, 3).map(m => 
            fetch(m.move.url).then(r => r.json())
          )
        )
        const movesData2 = await Promise.all(
          pokemon2.moves.slice(0, 3).map(m => 
            fetch(m.move.url).then(r => r.json())
          )
        )
        setMoves1(movesData1)
        setMoves2(movesData2)
      } catch (error) {
        console.error('Error fetching moves:', error)
      }
    }
    fetchMoves()
  }, [pokemon1, pokemon2])

  const stats = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
  
  const getStatValue = (pokemon, statName) => {
    return pokemon.stats.find(s => s.stat.name === statName).base_stat
  }

  const calculateDamage = (attacker, defender, move) => {
    const power = move.power || 50
    const attackStat = move.damage_class.name === 'physical' 
      ? getStatValue(attacker, 'attack')
      : getStatValue(attacker, 'special-attack')
    const defenseStat = move.damage_class.name === 'physical'
      ? getStatValue(defender, 'defense')
      : getStatValue(defender, 'special-defense')
    
    // Fórmula más realista basada en stats del Pokémon
    const level = getLevel(attacker)
    const attackerTotal = attacker.stats.reduce((sum, s) => sum + s.base_stat, 0)
    const defenderTotal = defender.stats.reduce((sum, s) => sum + s.base_stat, 0)
    
    // Pokémon fuertes hacen más daño
    const strengthMultiplier = attackerTotal / 300 // Normalizado
    const defenseMultiplier = defenderTotal / 300
    
    const baseDamage = (power * attackStat / defenseStat) * strengthMultiplier / defenseMultiplier
    const damage = Math.floor(baseDamage * (level / 50) * (Math.random() * 0.15 + 0.85))
    
    return Math.max(15, Math.min(60, damage)) // Entre 15% y 60% de daño
  }
  
  const getMovePower = (move) => {
    const power = move.power || 50
    if (power >= 100) return 'high'
    if (power >= 70) return 'medium'
    return 'low'
  }

  const getEffectClass = (moveType) => {
    const typeEffects = {
      'fire': 'effect-fire',
      'water': 'effect-water',
      'electric': 'effect-electric',
      'grass': 'effect-grass',
      'psychic': 'effect-psychic',
      'dark': 'effect-dark',
      'ghost': 'effect-dark',
      'ice': 'effect-ice',
      'dragon': 'effect-dragon',
      'fighting': 'effect-physical',
      'normal': 'effect-physical',
      'poison': 'effect-psychic',
      'ground': 'effect-physical',
      'flying': 'effect-physical',
      'bug': 'effect-grass',
      'rock': 'effect-physical',
      'steel': 'effect-physical',
      'fairy': 'effect-psychic'
    }
    return typeEffects[moveType] || 'effect-physical'
  }

  const handleAttack = (moveIndex) => {
    if (winner || isAttacking || moves1.length === 0 || moveCooldowns[moveIndex] > 0) return
    
    const move = moves1[moveIndex]
    const movePower = getMovePower(move)
    
    setIsAttacking('player')
    
    const damage = calculateDamage(pokemon1, pokemon2, move)
    
    setBattleText(`${pokemon1.name.toUpperCase()} uso ${move.name.toUpperCase()}!`)
    
    // Cooldown para ataques poderosos
    if (movePower === 'high') {
      const newCooldowns = [...moveCooldowns]
      newCooldowns[moveIndex] = 2
      setMoveCooldowns(newCooldowns)
    }
    
    setTimeout(() => {
      setIsAttacking('hit2')
      setAttackEffect({
        type: getEffectClass(move.type.name),
        power: movePower,
        position: { top: '25%', right: '20%' }
      })
      
      const newHp2 = Math.max(0, hp2 - damage)
      setHp2(newHp2)
      
      setTimeout(() => {
        setAttackEffect(null)
        
        // Mensaje de efectividad
        const effectiveness = getEffectiveness(move.type.name, pokemon2.types[0].type.name)
        if (effectiveness > 1) {
          setBattleText('¡Es muy eficaz!')
        } else if (effectiveness < 1) {
          setBattleText('No es muy eficaz...')
        }
        
        if (newHp2 === 0) {
          setTimeout(() => {
            setIsAttacking(null)
            setWinner(pokemon1)
            setBattleText(`${pokemon2.name.toUpperCase()} se debilito!`)
            calculateFinalScore(pokemon1)
          }, 1000)
        } else {
          setTimeout(() => {
            setIsAttacking(null)
            setTurnCount(prev => prev + 1)
            // Reducir cooldowns
            setMoveCooldowns(prev => prev.map(cd => Math.max(0, cd - 1)))
            enemyTurn()
          }, 800)
        }
      }, 1000)
    }, 500)
  }

  const enemyTurn = () => {
    if (moves2.length === 0) return
    
    setTimeout(() => {
      const randomMove = moves2[Math.floor(Math.random() * moves2.length)]
      const movePower = getMovePower(randomMove)
      setIsAttacking('enemy')
      const damage = calculateDamage(pokemon2, pokemon1, randomMove)
      
      setBattleText(`${pokemon2.name.toUpperCase()} uso ${randomMove.name.toUpperCase()}!`)
      
      setTimeout(() => {
        setIsAttacking('hit1')
        setAttackEffect({
          type: getEffectClass(randomMove.type.name),
          power: movePower,
          position: { bottom: '25%', left: '15%' }
        })
        
        const newHp1 = Math.max(0, hp1 - damage)
        setHp1(newHp1)
        
        setTimeout(() => {
          setAttackEffect(null)
          
          const effectiveness = getEffectiveness(randomMove.type.name, pokemon1.types[0].type.name)
          if (effectiveness > 1) {
            setBattleText('¡Es muy eficaz!')
          } else if (effectiveness < 1) {
            setBattleText('No es muy eficaz...')
          }
          
          if (newHp1 === 0) {
            setTimeout(() => {
              setIsAttacking(null)
              setWinner(pokemon2)
              setBattleText(`${pokemon1.name.toUpperCase()} se debilito!`)
              calculateFinalScore(pokemon2)
            }, 1000)
          } else {
            setTimeout(() => {
              setIsAttacking(null)
              setBattleText('¿Que deberia hacer?')
            }, 800)
          }
        }, 1000)
      }, 500)
    }, 1000)
  }

  const getEffectiveness = (attackType, defenseType) => {
    const chart = {
      'fire': { 'grass': 2, 'water': 0.5, 'fire': 0.5 },
      'water': { 'fire': 2, 'grass': 0.5, 'water': 0.5 },
      'grass': { 'water': 2, 'fire': 0.5, 'grass': 0.5 },
      'electric': { 'water': 2, 'grass': 0.5, 'electric': 0.5 },
      'psychic': { 'fighting': 2, 'psychic': 0.5 },
      'fighting': { 'normal': 2, 'psychic': 0.5 }
    }
    return chart[attackType]?.[defenseType] || 1
  }

  const calculateFinalScore = (winnerPokemon) => {
    // El ganador siempre tiene 6 puntos, el perdedor 0
    if (winnerPokemon.name === pokemon1.name) {
      setScores({ p1: 6, p2: 0 })
    } else {
      setScores({ p1: 0, p2: 6 })
    }
  }

  const getHpColor = (hp) => {
    if (hp > 50) return 'high'
    if (hp > 20) return 'medium'
    return 'low'
  }

  const getLevel = (pokemon) => {
    const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    return Math.min(100, Math.floor(totalStats / 30))
  }

  return (
    <div className="battle-overlay">
      <div className="battle-container">
        <button className="battle-close" onClick={onClose}>X</button>
        
        <div className="battle-field">
          {/* Plataformas */}
          <div className="battle-platform platform-enemy"></div>
          <div className="battle-platform platform-player"></div>
          
          {/* Info Box Enemigo */}
          <div className="pokemon-info-box info-box-enemy">
            <div className="info-box-header">
              <div>
                <span className="info-name">{pokemon2.name}</span>
                <span className="info-gender">♂</span>
              </div>
              <div className="info-level">
                <span className="level-icon">Lv</span>
                <span>{getLevel(pokemon2)}</span>
              </div>
            </div>
            <div className="info-hp-bar">
              <div className="hp-label">HP:</div>
              <div className="hp-bar-container">
                <div 
                  className={`hp-bar-fill ${getHpColor(hp2)}`}
                  style={{ width: `${hp2}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Info Box Jugador */}
          <div className="pokemon-info-box info-box-player">
            <div className="info-box-header">
              <div>
                <span className="info-name">{pokemon1.name}</span>
                <span className="info-gender">♂</span>
              </div>
              <div className="info-level">
                <span className="level-icon">Lv</span>
                <span>{getLevel(pokemon1)}</span>
              </div>
            </div>
            <div className="info-hp-bar">
              <div className="hp-label">HP:</div>
              <div className="hp-bar-container">
                <div 
                  className={`hp-bar-fill ${getHpColor(hp1)}`}
                  style={{ width: `${hp1}%` }}
                ></div>
              </div>
              <div className="hp-numbers">
                {Math.floor(hp1 * getStatValue(pokemon1, 'hp') / 100)} / {getStatValue(pokemon1, 'hp')}
              </div>
            </div>
          </div>
          
          {/* Sprites */}
          <img 
            src={pokemon2.sprites.front_default}
            alt={pokemon2.name}
            className={`battle-sprite sprite-enemy ${isAttacking === 'enemy' ? 'sprite-attacking' : ''} ${isAttacking === 'hit2' ? 'sprite-hit' : ''}`}
          />
          
          <img 
            src={pokemon1.sprites.back_default || pokemon1.sprites.front_default}
            alt={pokemon1.name}
            className={`battle-sprite sprite-player ${isAttacking === 'player' ? 'sprite-attacking' : ''} ${isAttacking === 'hit1' ? 'sprite-hit' : ''}`}
          />
          
          {/* Efectos de ataque */}
          {attackEffect && (
            <div 
              className={`attack-effect ${attackEffect.type}`}
              style={attackEffect.position}
            ></div>
          )}
        </div>
        
        {/* Caja de texto */}
        <div className="battle-text-box">
          <div className="battle-text-content">
            {battleText}
            {!winner && <span className="text-cursor"></span>}
          </div>
          
          {!winner && moves1.length > 0 && (
            <div className="battle-actions">
              {moves1.map((move, index) => (
                <button 
                  key={index}
                  className={`action-button ${getMovePower(move)}-power`}
                  onClick={() => handleAttack(index)}
                  disabled={isAttacking !== null || moveCooldowns[index] > 0}
                >
                  <span className="move-name">{move.name.replace('-', ' ')}</span>
                  <span className={`move-type ${move.type.name}`}>
                    {move.type.name}
                  </span>
                  <span className="move-pp">
                    {moveCooldowns[index] > 0 ? `CD ${moveCooldowns[index]}` : `PP ${move.pp}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Resultado */}
        {winner && (
          <div className="battle-result-overlay">
            <div className="battle-result-box">
              <div className="result-title">Batalla Terminada!</div>
              <div className="result-winner">
                Ganador: {winner.name.toUpperCase()}
              </div>
              <div className="result-stats">
                <div className="result-stat">
                  <div className="result-stat-label">{pokemon1.name.toUpperCase()}</div>
                  <div className="result-stat-value">{scores.p1}</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-label">VS</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-label">{pokemon2.name.toUpperCase()}</div>
                  <div className="result-stat-value">{scores.p2}</div>
                </div>
              </div>
              <button className="action-button" onClick={onClose}>
                SALIR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BattleMode
