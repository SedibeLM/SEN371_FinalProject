import { useMemo, useState, useEffect } from "react";
import { getTopics, addMaterial, getMaterialsByTopic } from "../utils/storage";

export default function Materials(){
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [materials, setMaterials] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("PDF");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      const topicsData = await getTopics();
      setTopics(topicsData || []);
      if (topicsData && topicsData.length > 0) {
        setTopicId(String(topicsData[0].topic_id));
      }
      setLoadingTopics(false);
    };
    fetchTopics();
  }, []);

  useEffect(() => {
    if (!topicId) return;
    const fetchMaterials = async () => {
      setLoadingMaterials(true);
      const materialsData = await getMaterialsByTopic(Number(topicId));
      setMaterials(materialsData || []);
      setLoadingMaterials(false);
    };
    fetchMaterials();
  }, [topicId]);

  async function submit(e){
    e.preventDefault();
    if(!topicId || !title || !url) return;
    const res = await addMaterial({ topicId: Number(topicId), title, kind, url });
    if (res.ok) {
      setMaterials([...materials, res.data]);
      setTitle(""); 
      setUrl("");
    } else {
      alert(`Error: ${res.msg}`);
    }
  }

  return (
    <div className="page">
      <h1>Materials</h1>
      <form className="card" onSubmit={submit} style={{display:"grid", gap:10, marginBottom:18}}>
        <div className="label">Topic</div>
        {loadingTopics ? (
          <select className="input" disabled><option>Loading topics...</option></select>
        ) : (
          <select className="input" value={topicId} onChange={e=>setTopicId(e.target.value)}>
            {topics.map(t => <option key={t.topic_id} value={t.topic_id}>{t.title}</option>)}
          </select>
        )}
        <div className="label">Title</div>
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Slides Week 1"/>
        <div className="label">Type</div>
        <select className="input" value={kind} onChange={e=>setKind(e.target.value)}>
          <option>PDF</option><option>VIDEO</option><option>AUDIO</option><option>OTHER</option>
        </select>
        <div className="label">URL</div>
        <input className="input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/>
        <button className="btn btn-primary" type="submit">Add Material</button>
      </form>

      <div className="card">
        <h3 className="card-title">Materials for Selected Topic</h3>
        {loadingMaterials ? (
          <div>Loading...</div>
        ) : materials.length === 0 ? (
          <div style={{color:"var(--muted)"}}>None yet.</div>
        ) : (
          <ul style={{margin:0, paddingLeft:18}}>
            {materials.map(m => (
              <li key={m.material_id}>
                <b>{m.title}</b> — {m.type} — <a href={m.url_ref} target="_blank" rel="noreferrer">open</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
