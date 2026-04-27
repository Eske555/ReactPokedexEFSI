import { useState, useEffect } from 'react'
import './TeamView.css'

function TeamView({ onPokemonClick, onClose }) {
  const [team, setTeam] = useState([])

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = () => {
    const savedTeam = JSON.parse(localStorage.getItem('pokemonTeam') || '[]')
    setTeam(savedTeam)
  }

  const removeFromTeam = (pokemonId) => {
    const updatedTeam = team.filter(p => p.id !== pokemonId)
    localStorage.setItem('pokemonTeam', JSON.stringify(updatedTeam))
    setTeam(updatedTeam)
  }

  const clearTeam = () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu equipo?')) {
      localStorage.setItem('pokemonTeam', JSON.stringify([]))
      setTeam([])
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
    <div className="team-view-overlay">
      <div className="team-view-container">
        <button className="team-close" onClick={onClose}>✕</button>
        
        <div className="team-header">
          <h2 className="team-title">MI EQUIPO</h2>
          <div className="team-count">{team.length}/6 POKEMON</div>
        </div>

        {team.length === 0 ? (
          <div className="team-empty">
            <div className="empty-icon">☆</div>
            <div className="empty-text">Tu equipo está vacío</div>
            <div className="empty-hint">Agrega Pokémon desde su página de detalle</div>
          </div>
        ) : (
          <>
            <div className="team-grid">
              {team.map((pokemon, index) => (
                <div key={pokemon.id} className="team-pokemon-card">
                  <div className="team-slot-number">#{index + 1}</div>
                  <button 
                    className="team-remove-btn"
                    onClick={() => removeFromTeam(pokemon.id)}
                    title="Quitar del equipo"
                  >
                    ✕
                  </button>
                  <div 
                    className="team-pokemon-content"
                    onClick={() => {
                      onClose()
                      // Aquí podrías agregar lógica para abrir el detalle
                    }}
                  >
                    <img 
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      className="team-pokemon-sprite"
                    />
                    <div className="team-pokemon-name">{pokemon.name}</div>
                    <div className="team-pokemon-types">
                      {pokemon.types.map(t => (
                        <span 
                          key={t.type.name}
                          className="team-type-badge"
                          style={{ backgroundColor: getTypeColor(t.type.name) }}
                        >
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Slots vacíos */}
              {[...Array(6 - team.length)].map((_, index) => (
                <div key={`empty-${index}`} className="team-pokemon-card empty">
                  <div className="team-slot-number">#{team.length + index + 1}</div>
                  <div className="empty-slot">
                    <div className="empty-slot-icon">?</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="team-actions">
              <button className="team-action-btn clear-btn" onClick={clearTeam}>
                VACIAR EQUIPO
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TeamView
