import { useEffect, useState } from 'react'
import { createTopic, getTopics, uploadMaterial, getModules } from '../utils/storage'

export default function TutorDashboard(){
  const [topics, setTopics] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [materialTopicId, setMaterialTopicId] = useState('');
  const [materialType, setMaterialType] = useState('PDF');
  const [materialFile, setMaterialFile] = useState(null);
  const [materialUrl, setMaterialUrl] = useState('');

  useEffect(()=>{
    const fetchData = async () => {
      setLoading(true);
      const [topicsData, modulesData] = await Promise.all([getTopics(), getModules()]);
      setTopics(topicsData || []);
      setModules(modulesData || []);
      if (modulesData && modulesData.length > 0) {
        setModuleId(modulesData[0].module_id);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  async function onCreateTopic(){
    if (!title.trim() || !moduleId) return setMsg('Title and module are required');
    const res = await createTopic({ title, moduleId: Number(moduleId) });
    if (res.ok) {
      setTopics([res.data, ...topics]);
      setTitle('');
      setMsg('Topic created successfully');
    } else {
      setMsg(`Error: ${res.msg}`);
    }
  }

  async function onUpload(){
    if (!materialTopicId || !materialUrl) return setMsg('Please select a topic and provide a URL');
    const res = await uploadMaterial({ 
      topicId: Number(materialTopicId), 
      kind: materialType, 
      title: materialUrl, // Using URL as title for simplicity
      url: materialUrl 
    });
    if(res.ok) {
      setMsg('Material uploaded successfully');
      setMaterialUrl('');
    } else {
      setMsg(`Error: ${res.msg}`);
    }
  }

  if (loading) {
    return <div className="page"><h1>Tutor Dashboard</h1><div>Loading...</div></div>;
  }

  return (
    <div className="page">
      <h1>Tutor Dashboard</h1>
      {msg && <div className="card" style={{background:'#ecfeff', borderColor:'#06b6d4'}}>{msg}</div>}

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:24, marginTop: 18}}>
        <div className="card" style={{display: 'grid', gap: 10}}>
          <h2>Create Topic</h2>
          <div>
            <div className="label">Module</div>
            <select className="input" value={moduleId} onChange={e=>setModuleId(e.target.value)}>
              {modules.map(m => <option key={m.module_id} value={m.module_id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Title</div>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={onCreateTopic}>Create</button>
        </div>

        <div className="card" style={{display: 'grid', gap: 10}}>
          <h2>Upload Material</h2>
          <div>
            <div className="label">Topic</div>
            <select className="input" value={materialTopicId} onChange={e=>setMaterialTopicId(e.target.value)}>
              <option value="">Select a topic</option>
              {topics.map(t => <option key={t.topic_id} value={t.topic_id}>{t.title}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Type</div>
            <select className="input" value={materialType} onChange={e=>setMaterialType(e.target.value)}>
              <option>PDF</option><option>VIDEO</option><option>AUDIO</option><option>OTHER</option>
            </select>
          </div>
           <div>
            <div className="label">Material URL</div>
            <input className="input" value={materialUrl} onChange={e=>setMaterialUrl(e.target.value)} placeholder="https://example.com/material.pdf" />
          </div>
          <button className="btn btn-primary" onClick={onUpload}>Upload</button>
        </div>
      </div>
    </div>
  )
}