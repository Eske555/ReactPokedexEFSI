import { useState, useEffect } from 'react'
import FilterBar from './FilterBar'
import './PokemonGridView.css'

function PokemonGridView({ onPokemonClick }) {
  const [allPokemons, setAllPokemons] = useState([])
  const [filteredPokemons, setFilteredPokemons] = useState([])
  const [displayPokemons, setDisplayPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [imageLoadStates, setImageLoadStates] = useState({})
  const [filters, setFilters] = useState({ type: 'all', generation: [1, 1000] })
  const [sortBy, setSortBy] = useState('id')
  const [pageInput, setPageInput] = useState('')
  const pokemonsPerPage = 20

  useEffect(() => {
    loadAllPokemons()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [allPokemons, filters, sortBy])

  useEffect(() => {
    paginatePokemons()
  }, [filteredPokemons, page])

  const loadAllPokemons = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898')
      const data = await res.json()
      
      const pokemonDetails = await Promise.all(
        data.results.map(p => fetch(p.url).then(r => r.json()))
      )
      
      setAllPokemons(pokemonDetails)
    } catch (err) {
      console.error('Error loading pokemons:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...allPokemons]

    // Filtrar por generación
    filtered = filtered.filter(p => 
      p.id >= filters.generation[0] && p.id <= filters.generation[1]
    )

    // Filtrar por tipo
    if (filters.type !== 'all') {
      filtered = filtered.filter(p =>
        p.types.some(t => t.type.name === filters.type)
      )
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'height':
          return b.height - a.height
        case 'weight':
          return b.weight - a.weight
        case 'id':
        default:
          return a.id - b.id
      }
    })

    setFilteredPokemons(filtered)
    setTotalPages(Math.ceil(filtered.length / pokemonsPerPage))
    setPage(1) // Reset a primera página cuando cambian filtros
  }

  const paginatePokemons = () => {
    const startIndex = (page - 1) * pokemonsPerPage
    const endIndex = startIndex + pokemonsPerPage
    setDisplayPokemons(filteredPokemons.slice(startIndex, endIndex))
    setImageLoadStates({})
  }

  const handleImageLoad = (pokemonId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [pokemonId]: true
    }))
  }

  const handleImageError = (pokemonId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [pokemonId]: 'error'
    }))
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToPage = (e) => {
    e.preventDefault()
    const pageNum = parseInt(pageInput)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum)
      setPageInput('')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      alert(`Por favor ingresa un número entre 1 y ${totalPages}`)
    }
  }

  if (loading) {
    return (
      <div className="grid-view-container">
        <div className="grid-loading">CARGANDO...</div>
      </div>
    )
  }

  return (
    <div className="grid-view-container">
      <FilterBar 
        onFilterChange={setFilters}
        onSortChange={setSortBy}
      />

      <div className="grid-header">
        <div className="grid-title">TODOS LOS POKEMON</div>
        <div className="grid-count">
          Mostrando: {filteredPokemons.length} Pokémon
        </div>
      </div>

      <div className="pokemon-grid-view">
        {displayPokemons.map(pokemon => (
          <div 
            key={`${pokemon.id}-${page}`}
            className="grid-pokemon-item"
            onClick={() => onPokemonClick(pokemon)}
          >
            <div className="grid-pokemon-sprite">
              {!imageLoadStates[pokemon.id] && imageLoadStates[pokemon.id] !== 'error' && (
                <div className="sprite-loading">...</div>
              )}
              <img 
                key={`img-${pokemon.id}-${page}`}
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                onLoad={() => handleImageLoad(pokemon.id)}
                onError={() => handleImageError(pokemon.id)}
                style={{ 
                  opacity: imageLoadStates[pokemon.id] === true ? 1 : 0,
                  transition: 'opacity 0.3s'
                }}
              />
              {imageLoadStates[pokemon.id] === 'error' && (
                <div className="sprite-error">?</div>
              )}
            </div>
            <div className="grid-pokemon-id">
              {String(pokemon.id).padStart(3, '0')}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="grid-pagination">
          <button 
            className="pagination-button"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            ◀ ANTERIOR
          </button>
          <div className="pagination-info">
            Página {page} de {totalPages}
          </div>
          <form className="page-jump" onSubmit={handleGoToPage}>
            <input 
              type="number"
              className="page-input"
              placeholder="Ir a..."
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              min="1"
              max={totalPages}
            />
            <button type="submit" className="page-go-button">
              IR
            </button>
          </form>
          <button 
            className="pagination-button"
            onClick={handleNextPage}
            disabled={page >= totalPages}
          >
            SIGUIENTE ▶
          </button>
        </div>
      )}
    </div>
  )
}

export default PokemonGridView
