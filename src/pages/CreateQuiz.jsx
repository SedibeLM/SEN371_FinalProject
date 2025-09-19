import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createQuiz } from "../utils/storage";

const jsonExample = [
  {
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5"],
    "correct_answer": "4"
  },
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris"],
    "correct_answer": "Paris"
  }
];

export default function CreateQuiz() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [questionsJson, setQuestionsJson] = useState(JSON.stringify(jsonExample, null, 2));
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let questions_json;
    try {
      questions_json = JSON.parse(questionsJson);
    } catch (error) {
      alert("Invalid JSON format for questions.");
      return;
    }

    if (!title || !description) {
      alert("Please provide a title and a description.");
      return;
    }

    setSubmitting(true);
    const res = await createQuiz({
      title,
      description,
      difficulty,
      topic_id: Number(topicId),
      questions_json
    });
    setSubmitting(false);

    if (res.ok) {
      alert("Quiz created successfully!");
      navigate(`/app/topics/${topicId}`);
    } else {
      alert(`Error creating quiz: ${res.msg}`);
    }
  }

  return (
    <div className="page">
      <h1>Create New Quiz</h1>
      <form onSubmit={handleSubmit} className="card" style={{maxWidth: 700, margin: "0 auto"}}>
        <div style={{display: "grid", gap: 12}}>
          <input
            className="input"
            placeholder="Quiz Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="input"
            placeholder="Quiz Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
          <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <div>
            <label>Questions (JSON format)</label>
            <textarea
              className="input"
              value={questionsJson}
              onChange={e => setQuestionsJson(e.target.value)}
              rows={15}
              style={{fontFamily: "monospace"}}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}
