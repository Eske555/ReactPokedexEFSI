import { useState } from 'react'
import './FilterBar.css'

function FilterBar({ onFilterChange, onSortChange, onReset }) {
  const [selectedType, setSelectedType] = useState('all')
  const [selectedGen, setSelectedGen] = useState('all')
  const [sortBy, setSortBy] = useState('id')

  const types = [
    'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ]

  const generations = [
    { name: 'all', label: 'ALL', range: [1, 1000] },
    { name: 'gen1', label: 'GEN I', range: [1, 151] },
    { name: 'gen2', label: 'GEN II', range: [152, 251] },
    { name: 'gen3', label: 'GEN III', range: [252, 386] },
    { name: 'gen4', label: 'GEN IV', range: [387, 493] },
    { name: 'gen5', label: 'GEN V', range: [494, 649] },
    { name: 'gen6', label: 'GEN VI', range: [650, 721] },
    { name: 'gen7', label: 'GEN VII', range: [722, 809] },
    { name: 'gen8', label: 'GEN VIII', range: [810, 898] }
  ]

  const sortOptions = [
    { value: 'id', label: 'ID' },
    { value: 'name', label: 'NAME' },
    { value: 'height', label: 'HEIGHT' },
    { value: 'weight', label: 'WEIGHT' }
  ]

  const handleTypeChange = (type) => {
    setSelectedType(type)
    const gen = generations.find(g => g.name === selectedGen)
    onFilterChange({ type, generation: gen.range })
  }

  const handleGenChange = (genName) => {
    setSelectedGen(genName)
    const gen = generations.find(g => g.name === genName)
    onFilterChange({ type: selectedType, generation: gen.range })
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
    onSortChange(sort)
  }

  const handleReset = () => {
    setSelectedType('all')
    setSelectedGen('all')
    setSortBy('id')
    onFilterChange({ type: 'all', generation: [1, 1000] })
    onSortChange('id')
    if (onReset) onReset()
  }

  return (
    <div className="filter-bar">
      <div className="filter-header">
        <div className="filter-title">FILTERS</div>
        <button className="reset-filters-button" onClick={handleReset}>
          RESET ALL
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-label">TYPE:</div>
        <div className="filter-options">
          {types.map(type => (
            <button
              key={type}
              className={`filter-button type-filter ${selectedType === type ? 'active' : ''}`}
              onClick={() => handleTypeChange(type)}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-label">GENERATION:</div>
        <div className="filter-options">
          {generations.map(gen => (
            <button
              key={gen.name}
              className={`filter-button gen-filter ${selectedGen === gen.name ? 'active' : ''}`}
              onClick={() => handleGenChange(gen.name)}
            >
              {gen.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-label">SORT BY:</div>
        <div className="filter-options">
          {sortOptions.map(option => (
            <button
              key={option.value}
              className={`filter-button sort-filter ${sortBy === option.value ? 'active' : ''}`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterBar
