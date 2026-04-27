import { useState, useEffect } from 'react'
import './QuizMode.css'

function QuizMode({ onClose }) {
  const [quizType, setQuizType] = useState(null) // 'silhouette', 'description', 'stats'
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [options, setOptions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highScore, setHighScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('quizHighScore')
    if (saved) setHighScore(parseInt(saved))
  }, [])

  const startQuiz = (type) => {
    setQuizType(type)
    setScore(0)
    setQuestionsAnswered(0)
    loadQuestion(type)
  }

  const loadQuestion = async (type) => {
    setLoading(true)
    setSelectedAnswer(null)
    setShowResult(false)

    try {
      // Generar ID aleatorio
      const randomId = Math.floor(Math.random() * 898) + 1
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      const pokemon = await res.json()

      // Obtener species para descripción
      const speciesRes = await fetch(pokemon.species.url)
      const species = await speciesRes.json()

      setCurrentPokemon({ ...pokemon, species })

      // Generar opciones incorrectas
      const wrongOptions = []
      while (wrongOptions.length < 3) {
        const wrongId = Math.floor(Math.random() * 898) + 1
        if (wrongId !== randomId && !wrongOptions.includes(wrongId)) {
          const wrongRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${wrongId}`)
          const wrongPokemon = await wrongRes.json()
          wrongOptions.push(wrongPokemon.name)
        }
      }

      // Mezclar opciones
      const allOptions = [pokemon.name, ...wrongOptions].sort(() => Math.random() - 0.5)
      setOptions(allOptions)

    } catch (err) {
      console.error('Error loading question:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    
    const isCorrect = answer === currentPokemon.name
    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)
      
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem('quizHighScore', newScore.toString())
        
        // Guardar logro
        const achievements = JSON.parse(localStorage.getItem('achievements') || '{}')
        if (newScore >= 10 && !achievements.quiz10) {
          achievements.quiz10 = true
          localStorage.setItem('achievements', JSON.stringify(achievements))
          alert('🏆 ¡Logro desbloqueado! Quiz Master - 10 respuestas correctas')
        }
      }
    }
    
    setQuestionsAnswered(questionsAnswered + 1)
  }

  const nextQuestion = () => {
    loadQuestion(quizType)
  }

  const getDescription = () => {
    if (!currentPokemon?.species) return ''
    const entry = currentPokemon.species.flavor_text_entries.find(
      e => e.language.name === 'en'
    )
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : ''
  }

  if (!quizType) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <button className="quiz-close" onClick={onClose}>✕</button>
          
          <div className="quiz-menu">
            <h2 className="quiz-title">QUIZ MODE</h2>
            <div className="quiz-stats">
              <div className="quiz-stat">
                <span className="stat-label">HIGH SCORE:</span>
                <span className="stat-value">{highScore}</span>
              </div>
            </div>

            <div className="quiz-modes">
              <button className="quiz-mode-btn" onClick={() => startQuiz('silhouette')}>
                <div className="mode-icon">👤</div>
                <div className="mode-name">WHO'S THAT POKEMON?</div>
                <div className="mode-desc">Adivina por la silueta</div>
              </button>

              <button className="quiz-mode-btn" onClick={() => startQuiz('description')}>
                <div className="mode-icon">📖</div>
                <div className="mode-name">POKEDEX ENTRY</div>
                <div className="mode-desc">Adivina por la descripción</div>
              </button>

              <button className="quiz-mode-btn" onClick={() => startQuiz('stats')}>
                <div className="mode-icon">📊</div>
                <div className="mode-name">STATS MASTER</div>
                <div className="mode-desc">Adivina por las estadísticas</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="quiz-overlay">
        <div className="quiz-container">
          <div className="quiz-loading">CARGANDO...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-container">
        <button className="quiz-close" onClick={onClose}>✕</button>
        
        <div className="quiz-header">
          <div className="quiz-score">
            <span>SCORE: {score}</span>
            <span>QUESTIONS: {questionsAnswered}</span>
          </div>
          <button className="quiz-back" onClick={() => setQuizType(null)}>
            ← MENU
          </button>
        </div>

        <div className="quiz-question">
          {quizType === 'silhouette' && (
            <div className="silhouette-container">
              <h3 className="question-title">WHO'S THAT POKEMON?</h3>
              <img 
                src={currentPokemon.sprites.other['official-artwork'].front_default}
                alt="Pokemon"
                className={`pokemon-silhouette ${showResult ? 'revealed' : ''}`}
              />
            </div>
          )}

          {quizType === 'description' && (
            <div className="description-container">
              <h3 className="question-title">GUESS THE POKEMON</h3>
              <div className="pokemon-description">
                {getDescription()}
              </div>
            </div>
          )}

          {quizType === 'stats' && (
            <div className="stats-container">
              <h3 className="question-title">GUESS BY STATS</h3>
              <div className="stats-display">
                {currentPokemon.stats.map(stat => (
                  <div key={stat.stat.name} className="stat-item">
                    <span className="stat-name">
                      {stat.stat.name.toUpperCase()}:
                    </span>
                    <span className="stat-value">{stat.base_stat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quiz-options">
            {options.map((option, index) => (
              <button
                key={index}
                className={`quiz-option ${
                  selectedAnswer === option
                    ? option === currentPokemon.name
                      ? 'correct'
                      : 'incorrect'
                    : ''
                } ${showResult && option === currentPokemon.name ? 'correct' : ''}`}
                onClick={() => !showResult && handleAnswer(option)}
                disabled={showResult}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="quiz-result">
              {selectedAnswer === currentPokemon.name ? (
                <div className="result-correct">
                  <div className="result-icon">✓</div>
                  <div className="result-text">¡CORRECTO!</div>
                </div>
              ) : (
                <div className="result-incorrect">
                  <div className="result-icon">✗</div>
                  <div className="result-text">
                    INCORRECTO - Era {currentPokemon.name.toUpperCase()}
                  </div>
                </div>
              )}
              <button className="next-button" onClick={nextQuestion}>
                SIGUIENTE →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizMode
