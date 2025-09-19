import { useState, useEffect } from "react";
import { getModules, getTopics, createTopic } from "../utils/storage";

export default function Topics(){
  const [title, setTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [modules, setModules] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [modulesData, topicsData] = await Promise.all([
        getModules(),
        getTopics()
      ]);
      setModules(modulesData || []);
      setTopics(topicsData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function add(e){
    e.preventDefault();
    if(!title || !moduleId) return;
    const res = await createTopic({title, moduleId: Number(moduleId)});
    if (res.ok) {
      // Add the new topic to the list and refetch modules to get the name
      const newTopic = res.data;
      const moduleName = modules.find(m => m.module_id === newTopic.module_id)?.name || '—';
      setTopics([...topics, { ...newTopic, moduleName }]);
      setTitle("");
      setModuleId("");
    } else {
      alert(`Error: ${res.msg}`);
    }
  }

  return (
    <div className="page">
      <h1>Topics</h1>
      <form className="card" onSubmit={add} style={{display:"grid", gap:10, marginBottom:18}}>
        <div style={{display:"grid", gap:6}}>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={e=>setTitle(e.target.value)}/>
        </div>
        <div style={{display:"grid", gap:6}}>
          <label className="label">Module</label>
          <select className="input" value={moduleId} onChange={e=>setModuleId(e.target.value)}>
            <option value="">Select a module</option>
            {modules.map(m => <option key={m.module_id} value={m.module_id}>{m.name}</option>)}
          </select>
        </div>
        <div><button className="btn btn-primary" type="submit">Create Topic</button></div>
      </form>

      {loading ? (
        <div>Loading topics...</div>
      ) : (
        <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"}}>
          {topics.map(t => (
            <div className="card" key={t.topic_id}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div className="card-title">{t.title}</div>
                <span className="pill">
                  {modules.find(m=>m.module_id===t.module_id)?.name || '—'}
                </span>
              </div>
              <a className="btn btn-ghost" href={`/app/topics/${t.topic_id}`} style={{marginTop:8}}>Open</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}