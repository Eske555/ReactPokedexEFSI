import './LoadingSpinner.css'

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="pokeball-loader">
        <div className="pokeball-loader-inner"></div>
      </div>
      <p className="loading-text">Buscando Pokémon...</p>
    </div>
  )
}

export default LoadingSpinner
