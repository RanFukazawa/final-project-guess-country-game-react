// Current score display
export default function ScoreDisplay({ correct, total }) {
  return (
    <div className="score-display">
      <h3>Score: {correct}/{total}</h3>
    </div>
  );
}