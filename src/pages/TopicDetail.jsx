import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  getTopics, 
  getModules, 
  getMaterialsByTopic, 
  getUserProfile, 
  addMaterial, 
  getQuizzesByTopic,
  getThreadsByTopic,
  createThread,
  getSubscription,
  subscribeToTopic,
  unsubscribeFromTopic
} from "../utils/storage";

// AddMaterialForm component
function AddMaterialForm({ topicId, onMaterialAdded }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("PDF");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !url) {
      alert("Please provide a title and a URL.");
      return;
    }
    setSubmitting(true);
    const res = await addMaterial({
      title,
      kind,
      url,
      topicId: Number(topicId)
    });
    setSubmitting(false);
    if (res.ok) {
      onMaterialAdded(res.data);
      setTitle("");
      setKind("PDF");
      setUrl("");
    } else {
      alert(`Error adding material: ${res.msg}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{marginTop: 20}}>
      <h3 className="card-title">Add New Material</h3>
      <div style={{display: "grid", gap: 10}}>
        <input
          className="input"
          placeholder="Material Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <select className="input" value={kind} onChange={e => setKind(e.target.value)}>
          <option value="PDF">PDF</option>
          <option value="VIDEO">Video</option>
          <option value="AUDIO">Audio</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          className="input"
          placeholder="https://example.com/material.pdf"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Material"}
        </button>
      </div>
    </form>
  );
}

// CreateThreadForm component
function CreateThreadForm({ topicId, onThreadCreated }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return;
    setSubmitting(true);
    const res = await createThread({ title, topic_id: Number(topicId) });
    setSubmitting(false);
    if (res.ok) {
      onThreadCreated(res.data);
      setTitle("");
    } else {
      alert(`Error creating thread: ${res.msg}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display: "flex", gap: 10, marginTop: 15}}>
      <input
        className="input"
        placeholder="Start a new discussion..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Thread"}
      </button>
    </form>
  );
}


export default function TopicDetail(){
  const { topicId } = useParams();
  const [topic, setTopic] = useState(null);
  const [module, setModule] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [threads, setThreads] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;
      setLoading(true);

      const userProfile = await getUserProfile();
      setProfile(userProfile);

      const [
        allTopics, 
        allModules, 
        topicMaterials, 
        topicQuizzes,
        topicThreads,
        subscriptionStatus
      ] = await Promise.all([
        getTopics(),
        getModules(),
        getMaterialsByTopic(Number(topicId)),
        getQuizzesByTopic(Number(topicId)),
        getThreadsByTopic(Number(topicId)),
        userProfile?.role === 'student' ? getSubscription(Number(topicId), userProfile.auth_id) : Promise.resolve(null)
      ]);

      const currentTopic = allTopics.find(t => t.topic_id === Number(topicId));
      if (currentTopic) {
        setTopic(currentTopic);
        const currentModule = allModules.find(m => m.module_id === currentTopic.module_id);
        setModule(currentModule);
      }

      setMaterials(topicMaterials || []);
      setQuizzes(topicQuizzes || []);
      setThreads(topicThreads || []);
      setSubscription(subscriptionStatus);
      setLoading(false);
    };

    fetchData();
  }, [topicId]);

  function handleMaterialAdded(newMaterial) {
    setMaterials(currentMaterials => [...currentMaterials, newMaterial]);
  }

  function handleThreadCreated(newThread) {
    setThreads(currentThreads => [...currentThreads, newThread]);
  }

  async function handleSubscribe() {
    if (!profile || profile.role !== 'student') return;
    const res = await subscribeToTopic(Number(topicId), profile.auth_id);
    if (res.ok) {
      setSubscription(res.data);
    } else {
      alert(`Error subscribing: ${res.msg}`);
    }
  }

  async function handleUnsubscribe() {
    if (!subscription) return;
    const res = await unsubscribeFromTopic(subscription.subscription_id);
    if (res.ok) {
      setSubscription(null);
    } else {
      alert(`Error unsubscribing: ${res.msg}`);
    }
  }

  if (loading) {
    return <div className="page"><h1>Loading...</h1></div>;
  }

  if(!topic) {
    return <div className="page"><h1>Topic not found</h1></div>;
  }

  return (
    <div className="page">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
        <h1>{topic.title}</h1>
        {profile?.role === 'student' && (
          subscription ? (
            <button onClick={handleUnsubscribe} className="btn btn-secondary">Unsubscribe</button>
          ) : (
            <button onClick={handleSubscribe} className="btn btn-primary">Subscribe</button>
          )
        )}
      </div>
      <div className="pill" style={{display:"inline-block", marginBottom:10}}>{module?.name || "—"}</div>
      <div className="grid" style={{gridTemplateColumns:"2fr 1fr"}}>
        <div>
          <div className="card">
            <h3 className="card-title">Materials</h3>
            {materials.length === 0 ? (
              <div style={{color:"var(--muted)"}}>None yet.</div>
            ) : (
              <ul style={{margin:0, paddingLeft:18}}>
                {materials.map(m=>(
                  <li key={m.material_id}>
                    <b>{m.title}</b> — {m.type} — <a href={m.url_ref} target="_blank" rel="noreferrer">open</a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{marginTop: 20}}>
            <h3 className="card-title">Quizzes</h3>
            {quizzes.length === 0 ? (
              <div style={{color:"var(--muted)"}}>None yet.</div>
            ) : (
              <ul style={{margin:0, paddingLeft:18}}>
                {quizzes.map(q => (
                  <li key={q.quiz_id}>
                    <Link to={`/app/quizzes/${q.quiz_id}`}>
                      <b>{q.title}</b> — {q.difficulty}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {profile?.role === 'tutor' && (
            <>
              <AddMaterialForm topicId={topicId} onMaterialAdded={handleMaterialAdded} />
              <div className="card" style={{marginTop: 20}}>
                <h3 className="card-title">Create Quiz</h3>
                <p>Create a new quiz for this topic.</p>
                <Link to={`/app/create-quiz/${topicId}`} className="btn btn-primary">
                  Create Quiz
                </Link>
              </div>
            </>
          )}
        </div>
        <div>
          <div className="card">
            <h3 className="card-title">Public Discussion</h3>
            {threads.length === 0 ? (
              <div style={{color:"var(--muted)"}}>No discussions yet.</div>
            ) : (
              <ul style={{margin:0, paddingLeft:18}}>
                {threads.map(t => (
                  <li key={t.thread_id}>
                    <Link to={`/app/threads/${t.thread_id}`}>{t.title}</Link>
                  </li>
                ))}
              </ul>
            )}
            {profile && <CreateThreadForm topicId={topicId} onThreadCreated={handleThreadCreated} />}
          </div>

          {profile?.role === 'student' && (
            <div className="card" style={{marginTop: 20}}>
              <h3 className="card-title">Private Message</h3>
              <p>Have a question for the tutor? Send them a private message.</p>
              <Link to={`/app/messages/new?recipientId=${topic.tutor_id}&topicId=${topicId}`} className="btn btn-primary">
                Message Tutor
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}