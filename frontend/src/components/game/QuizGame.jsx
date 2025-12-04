// Main game container
import "../../styles/game.css";

import { useState, useEffect } from "react";
import { checkAnswer, getRandomCountry } from "../../services/api";
import QuestionDisplay from "./QuestionDisplay.jsx";
import AnswerOptions from "./AnswerOptions.jsx";
import ScoreDisplay from "./ScoreDisplay.jsx";
import FeedbackMessage from "./FeedbackMessage.jsx";
import ResultsScreen from "./ResultsScreen.jsx";

export default function QuizGame() {
  // Game state
  const [currentCountry, setCurrentCountry] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [answersDisabled, setAnswersDisabled] = useState(false);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
    fetchQuestion(); 
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const country = await getRandomCountry();
      setCurrentCountry(country);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (selectedAnswer) => {
    // Prevent multiple clicks
    if (answersDisabled) return; 

    setAnswersDisabled(true);

    try {
      // Check answer with backend
      const result = await checkAnswer(currentCountry._id, selectedAnswer);

      // Update feedback state
      setIsCorrect(result.correct);
      setCorrectAnswer(result.correctAnswer);
      setShowFeedback(true);

      // Update score if correct
      if (result.correct) {
        setScore(score + 1);
      }

      const delay = result.correct ? 1300 : 2000;

      // Wait 1.3 seconds for correct answer and
      // 2 seconds for incorrect answer and 
      // move to the next question or end the game
      setTimeout(() => {
        setShowFeedback(false);
        setAnswersDisabled(false);

        if (questionNumber >= TOTAL_QUESTIONS) {
          // Game finished
          setGameStatus("finished");
        } else {
          // Next questions
          setQuestionNumber(questionNumber + 1);
          fetchQuestion();
        }
      }, delay);
    } catch (err) {
      console.error("Error checking answer:", err);
      setError("Failed to check answer. Please try again.");
      setAnswersDisabled(false);
    }
  };

  // Reset game to play again
  const handlePlayAgain = () => {
    setQuestionNumber(1);
    setScore(0);
    setGameStatus("playing");
    setShowFeedback(false);
    setIsCorrect(false);
    setCorrectAnswer("");
    setAnswersDisabled(false);
    fetchQuestion();
  };

  if (loading && questionNumber === 1) {
    return (
      <div className="quiz-game">
        <p>Loading game...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="quiz-game">
        <p className="error">{error}</p>
          <button onClick={fetchQuestion}>Try Again</button>
      </div>
    )
  }

  // Game ended - show results
  if (gameStatus === "finished") {
    return (
      <ResultsScreen
        score={score}
        totalQuestions={TOTAL_QUESTIONS}
        onPlayAgain={handlePlayAgain} 
      />
    );
  }

  // Play game - show question
  return (
    <div className="quiz-game">
      <ScoreDisplay correct={score} totalQuestions={TOTAL_QUESTIONS} />

      <QuestionDisplay 
        flagUrl={currentCountry?.flagUrl}
        questionNumber={questionNumber}
        totalQuestions={TOTAL_QUESTIONS}
      />

      <AnswerOptions
        options={currentCountry?.options || []}
        onSelectAnswer={handleAnswerSelect}
        disabled={answersDisabled}
      />

      <FeedbackMessage
        show={showFeedback}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
      />
    </div>
  )
}