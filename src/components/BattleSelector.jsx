import { useState } from 'react'
import './BattleSelector.css'

function BattleSelector({ onRandom, onSelect, onClose }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSelect(searchQuery)
    }
  }

  return (
    <div className="battle-selector-overlay">
      <div className="battle-selector-container">
        <button className="selector-close" onClick={onClose}>X</button>
        
        <h2 className="selector-title">ELIGE OPONENTE</h2>
        
        <div className="selector-options">
          <button className="selector-random" onClick={onRandom}>
            OPONENTE RANDOM
          </button>
          
          <div className="selector-divider">O</div>
          
          <form onSubmit={handleSubmit} className="selector-form">
            <input
              type="text"
              className="selector-input"
              placeholder="NOMBRE DEL POKEMON..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="selector-submit">
              ELEGIR
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BattleSelector
