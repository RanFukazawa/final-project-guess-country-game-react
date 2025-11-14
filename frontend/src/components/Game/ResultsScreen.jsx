// Final results summary
export default function ResultsScreen({ score, totalQuestions, onPlayAgain }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  const getMessage = () => {
    if (percentage >= 90) return "🎉 Excellent! Geography Expert!";
    if (percentage >= 70) return "👏 Great job! Keep it up!";
    if (percentage >= 50) return "👍 Good effort! Practice makes perfect!";

    return "Keep learing! Try again!";
  };

  return (
    <div className="results-screen">
      <h2>Quiz Complete!</h2>
      <p className="final-score">You scored {score} out of {totalQuestions}</p>
      <p className="percentage">{percentage}%</p>
      <p className="message">{getMessage()}</p>
      <button onClick={onPlayAgain} className="play-again-button">
        Play Again
      </button>
    </div>
  );
}