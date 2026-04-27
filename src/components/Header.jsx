import './Header.css'

function Header({ onLogoClick, onTeamClick, onHistoryClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo" onClick={onLogoClick}>
          <div className="pokeball-header">
            <div className="pokeball-header-button"></div>
          </div>
          <h1 className="header-title">POKÉDEX</h1>
        </div>
        <div className="header-subtitle">React Edition</div>
        <div className="header-buttons">
          <button className="team-header-button" onClick={onTeamClick} title="Ver mi equipo">
            ★ MI EQUIPO
          </button>
          <button className="history-header-button" onClick={onHistoryClick} title="Ver historial">
            📜 HISTORY
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
