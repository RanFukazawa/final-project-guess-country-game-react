// Multiple choice
export default function AnswerOptions({ options, onSelectAnswer, disabled }) {
  return (
    <div className="answer-options">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectAnswer(option)}
          disabled={disabled}
          className="answer-button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}