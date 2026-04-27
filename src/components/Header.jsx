import './Header.css'

function Header({ onLogoClick }) {
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
      </div>
    </header>
  )
}

export default Header
