import { useState, useEffect } from 'react'
import './SearchBar.css'

function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="BUSCA POKEMON O TIPO..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading}
          >
            <span className="search-text">BUSCAR</span>
          </button>
        </div>
      </form>
      <div className="search-hints">
        <span className="hint">PROBA: PIKACHU, CHARIZARD, FIRE, WATER</span>
      </div>
    </div>
  )
}

export default SearchBar
