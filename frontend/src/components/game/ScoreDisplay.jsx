// Current score display
export default function ScoreDisplay({ correct, totalQuestions }) {
  return (
    <div className="score-display">
      <h3>Score: {correct}/{totalQuestions}</h3>
    </div>
  );
}