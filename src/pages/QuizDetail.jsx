import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuiz } from "../utils/storage";

export default function QuizDetail() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      const quizData = await getQuiz(quizId);
      setQuiz(quizData);
      setLoading(false);
    };
    fetchQuiz();
  }, [quizId]);

  function handleOptionChange(questionIndex, option) {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  }

  if (loading) {
    return <div className="page"><h1>Loading Quiz...</h1></div>;
  }

  if (!quiz) {
    return <div className="page"><h1>Quiz not found</h1></div>;
  }

  return (
    <div className="page">
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      <div className="card" style={{maxWidth: 800, margin: "20px auto"}}>
        {quiz.questions_json.map((q, index) => (
          <div key={index} style={{marginBottom: 20, borderBottom: "1px solid #eee", paddingBottom: 15}}>
            <h3 style={{fontSize: 18}}>{index + 1}. {q.question}</h3>
            <div style={{display: "grid", gap: 8, marginTop: 10}}>
              {q.options.map((option, i) => (
                <label key={i} style={{display: "flex", alignItems: "center", gap: 8}}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answers[index] === option}
                    onChange={() => handleOptionChange(index, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={() => alert("Submit logic not implemented yet.")}>
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
