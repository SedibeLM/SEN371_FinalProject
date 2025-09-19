import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getModule, getTopicsByModule, createTopic, getUserProfile } from "../utils/storage";

function CreateTopicForm({ moduleId, onTopicCreated }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    const res = await createTopic({ title, moduleId: Number(moduleId) });
    setSubmitting(false);
    if (res.ok) {
      onTopicCreated(res.data);
      setTitle("");
    } else {
      alert(`Error creating topic: ${res.msg}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{marginTop: 20}}>
      <h3 className="card-title">Create New Topic</h3>
      <div style={{display: "flex", gap: 10}}>
        <input
          className="input"
          placeholder="New Topic Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create Topic"}
        </button>
      </div>
    </form>
  );
}

export default function ModuleDetail() {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [moduleData, topicsData, userProfile] = await Promise.all([
        getModule(moduleId),
        getTopicsByModule(moduleId),
        getUserProfile()
      ]);
      setModule(moduleData);
      setTopics(topicsData);
      setProfile(userProfile);
      setLoading(false);
    };
    fetchData();
  }, [moduleId]);

  function handleTopicCreated(newTopic) {
    setTopics(currentTopics => [...currentTopics, newTopic]);
  }

  if (loading) {
    return <div className="page"><h1>Loading Module...</h1></div>;
  }

  if (!module) {
    return <div className="page"><h1>Module not found</h1></div>;
  }

  return (
    <div className="page">
      <h1>{module.name} ({module.code})</h1>
      <p>{module.description}</p>
      <div className="card" style={{marginTop: 20}}>
        <h3 className="card-title">Topics</h3>
        {topics.length === 0 ? (
          <div style={{color: "var(--muted)"}}>No topics yet in this module.</div>
        ) : (
          <ul style={{margin: 0, paddingLeft: 18}}>
            {topics.map(topic => (
              <li key={topic.topic_id}>
                <Link to={`/app/topics/${topic.topic_id}`}>{topic.title}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {profile?.role === 'tutor' && (
        <CreateTopicForm moduleId={moduleId} onTopicCreated={handleTopicCreated} />
      )}
    </div>
  );
}
