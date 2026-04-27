import './ErrorMessage.css'

function ErrorMessage({ message, onClose }) {
  return (
    <div className="error-container">
      <div className="error-content">
        <span className="error-icon">!</span>
        <p className="error-message">{message}</p>
        <button className="error-close" onClick={onClose}>X</button>
      </div>
    </div>
  )
}

export default ErrorMessage
