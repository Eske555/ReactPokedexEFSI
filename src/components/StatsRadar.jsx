import './StatsRadar.css'

function StatsRadar({ pokemon }) {
  const stats = [
    { name: 'HP', value: pokemon.stats[0].base_stat, max: 255 },
    { name: 'ATK', value: pokemon.stats[1].base_stat, max: 255 },
    { name: 'DEF', value: pokemon.stats[2].base_stat, max: 255 },
    { name: 'SP.ATK', value: pokemon.stats[3].base_stat, max: 255 },
    { name: 'SP.DEF', value: pokemon.stats[4].base_stat, max: 255 },
    { name: 'SPD', value: pokemon.stats[5].base_stat, max: 255 }
  ]

  const total = stats.reduce((sum, stat) => sum + stat.value, 0)
  const average = Math.round(total / stats.length)

  // Calcular posiciones en el hexágono
  const getPosition = (index, percentage) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2
    const radius = 100 * (percentage / 100)
    const x = 150 + radius * Math.cos(angle)
    const y = 150 + radius * Math.sin(angle)
    return { x, y }
  }

  // Generar puntos del polígono
  const points = stats.map((stat, index) => {
    const percentage = (stat.value / stat.max) * 100
    const pos = getPosition(index, percentage)
    return `${pos.x},${pos.y}`
  }).join(' ')

  // Puntos de las líneas de fondo (hexágonos de referencia)
  const backgroundLevels = [20, 40, 60, 80, 100]
  const backgroundPolygons = backgroundLevels.map(level => {
    return stats.map((_, index) => {
      const pos = getPosition(index, level)
      return `${pos.x},${pos.y}`
    }).join(' ')
  })

  // Posiciones de las etiquetas
  const labelPositions = stats.map((stat, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2
    const radius = 130
    const x = 150 + radius * Math.cos(angle)
    const y = 150 + radius * Math.sin(angle)
    return { x, y, name: stat.name, value: stat.value }
  })

  return (
    <div className="stats-radar-container">
      <div className="radar-title">STATS RADAR</div>
      
      <svg className="radar-chart" viewBox="0 0 300 300">
        {/* Líneas de fondo */}
        {backgroundPolygons.map((polygon, index) => (
          <polygon
            key={index}
            points={polygon}
            className="radar-background"
            style={{ opacity: 0.1 + (index * 0.1) }}
          />
        ))}

        {/* Líneas desde el centro */}
        {stats.map((_, index) => {
          const pos = getPosition(index, 100)
          return (
            <line
              key={index}
              x1="150"
              y1="150"
              x2={pos.x}
              y2={pos.y}
              className="radar-line"
            />
          )
        })}

        {/* Polígono de stats */}
        <polygon
          points={points}
          className="radar-polygon"
        />

        {/* Puntos en cada vértice */}
        {stats.map((stat, index) => {
          const percentage = (stat.value / stat.max) * 100
          const pos = getPosition(index, percentage)
          return (
            <circle
              key={index}
              cx={pos.x}
              cy={pos.y}
              r="4"
              className="radar-point"
            />
          )
        })}
      </svg>

      {/* Etiquetas */}
      <div className="radar-labels">
        {labelPositions.map((label, index) => (
          <div
            key={index}
            className="radar-label"
            style={{
              left: `${(label.x / 300) * 100}%`,
              top: `${(label.y / 300) * 100}%`
            }}
          >
            <div className="label-name">{label.name}</div>
            <div className="label-value">{label.value}</div>
          </div>
        ))}
      </div>

      <div className="radar-stats">
        <div className="radar-stat">
          <span className="stat-label">TOTAL:</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="radar-stat">
          <span className="stat-label">AVERAGE:</span>
          <span className="stat-value">{average}</span>
        </div>
      </div>
    </div>
  )
}

export default StatsRadar
