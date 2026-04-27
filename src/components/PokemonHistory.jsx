import { useState, useEffect } from 'react'
import './PokemonHistory.css'

function PokemonHistory({ onClose, onPokemonClick }) {
  const [history, setHistory] = useState([])
  const [stats, setStats] = useState({
    totalViewed: 0,
    mostViewed: null,
    recentSearches: []
  })

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('pokemonHistory') || '[]')
    setHistory(savedHistory)

    // Calcular estadísticas
    const viewCounts = {}
    savedHistory.forEach(entry => {
      viewCounts[entry.name] = (viewCounts[entry.name] || 0) + 1
    })

    const mostViewed = Object.entries(viewCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))

    const recentSearches = savedHistory
      .slice(0, 10)
      .map(entry => entry.name)
      .filter((name, index, self) => self.indexOf(name) === index)

    setStats({
      totalViewed: savedHistory.length,
      mostViewed,
      recentSearches
    })
  }

  const clearHistory = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
      localStorage.setItem('pokemonHistory', JSON.stringify([]))
      setHistory([])
      setStats({
        totalViewed: 0,
        mostViewed: [],
        recentSearches: []
      })
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays < 7) return `Hace ${diffDays}d`
    return date.toLocaleDateString()
  }

  const groupByDate = () => {
    const groups = {}
    history.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    })
    return groups
  }

  const groupedHistory = groupByDate()

  return (
    <div className="history-overlay">
      <div className="history-container">
        <button className="history-close" onClick={onClose}>✕</button>
        
        <h2 className="history-title">POKEMON HISTORY</h2>

        {/* Most Viewed */}
        {stats.mostViewed && stats.mostViewed.length > 0 && (
          <div className="most-viewed-section">
            <h3 className="section-title">MOST VIEWED</h3>
            <div className="most-viewed-list">
              {stats.mostViewed.map((pokemon, index) => (
                <div key={index} className="most-viewed-item">
                  <span className="rank">#{index + 1}</span>
                  <span className="pokemon-name">{pokemon.name.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {history.length > 0 ? (
          <div className="timeline-section">
            <div className="timeline-header">
              <h3 className="section-title">TIMELINE</h3>
              <button className="clear-btn" onClick={clearHistory}>
                CLEAR ALL
              </button>
            </div>

            <div className="timeline">
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <div key={date} className="timeline-day">
                  <div className="day-header">{date}</div>
                  <div className="day-entries">
                    {entries.map((entry, index) => (
                      <div
                        key={index}
                        className="timeline-entry"
                        onClick={async () => {
                          try {
                            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${entry.id}`)
                            const data = await res.json()
                            onPokemonClick(data)
                          } catch (err) {
                            console.error('Error loading Pokemon:', err)
                          }
                        }}
                      >
                        <div className="entry-time">{formatDate(entry.timestamp)}</div>
                        <div className="entry-pokemon">
                          <img
                            src={entry.sprite}
                            alt={entry.name}
                            className="entry-sprite"
                          />
                          <div className="entry-info">
                            <div className="entry-name">{entry.name.toUpperCase()}</div>
                            <div className="entry-id">#{String(entry.id).padStart(3, '0')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-history">
            <div className="empty-icon">📜</div>
            <div className="empty-text">No hay historial aún</div>
            <div className="empty-hint">Busca Pokémon para ver tu historial aquí</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PokemonHistory
