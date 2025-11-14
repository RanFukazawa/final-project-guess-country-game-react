// Shows flag and question
export default function QuestionDisplay({ flagUrl, questionNumber, totalQuestions }) {
  return (
    <div className="question-display">
      <p>Question {questionNumber} of {totalQuestions}</p>
      {flagUrl && <img src={flagUrl} alt="Country flag" width="200" />}
    </div>
  );
}