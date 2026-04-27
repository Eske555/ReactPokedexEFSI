import { useEffect, useState } from 'react'
import './SplashScreen.css'

function SplashScreen({ onComplete }) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(onComplete, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`splash-screen ${!isAnimating ? 'fade-out' : ''}`}>
      <div className="splash-content">
        <img 
          src="/pikachuruninng.gif" 
          alt="Pikachu Running"
          className="pikachu-running"
        />
        <h1 className="splash-title">POKEDEX</h1>
        <p className="splash-subtitle">REACT EDITION</p>
      </div>
    </div>
  )
}

export default SplashScreen
