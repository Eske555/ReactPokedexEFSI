import './PokemonGrid.css'

function PokemonGrid({ pokemons, onPokemonClick }) {
  return (
    <div className="pokemon-grid-container">
      <h2 className="grid-title">Pokémon encontrados</h2>
      <div className="pokemon-grid">
        {pokemons.map((pokemon) => (
          <div 
            key={pokemon.id} 
            className="grid-card"
            onClick={() => onPokemonClick(pokemon.name)}
          >
            <div className="grid-card-id">#{String(pokemon.id).padStart(3, '0')}</div>
            <div className="grid-card-image-container">
              <img 
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="grid-card-image"
              />
            </div>
            <h3 className="grid-card-name">{pokemon.name}</h3>
            <div className="grid-card-types">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className={`grid-type ${type.type.name}`}>
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PokemonGrid
