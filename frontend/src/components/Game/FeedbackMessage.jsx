// Correct/incorrect feedback message
export default function FeedbackMessage({ show, isCorrect, correctAnswer }) {
  if (!show) {
    return null;
  }

  return (
    <div className={`feedback-message ${isCorrect ? "correct" : "incorrect"}`}>
      {isCorrect ? (
        <p>✅ Correct!</p>
      ) : (
        <p>Incorrect! The answer is {correctAnswer}</p>
      )}
    </div>
  )
}