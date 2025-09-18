import { useEffect, useState } from 'react'
import { getAuthUser, createTopic, listTopics, uploadMaterial } from '../utils/storage'

export default function TutorDashboard(){
  const user = getAuthUser()
  const [topics, setTopics] = useState([])
  const [title, setTitle] = useState('')
  const [moduleCode, setModule] = useState('SEN371')
  const [type, setType] = useState('PDF')
  const [topicId, setTopicId] = useState('')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')

  useEffect(()=>{ setTopics(listTopics()) }, [])

  function onCreateTopic(){
    if (!title.trim()) return setMsg('Title required')
    const t = createTopic({ title, moduleCode, tutorId: user.id })
    setTopics([t, ...topics]); setTitle(''); setMsg('Topic created')
  }

  function onUpload(){
    if (!topicId || !file) return setMsg('Pick topic and file')
    uploadMaterial({ topicId, type, fileName:file.name, sizeBytes:file.size })
    setMsg('Material saved'); setFile(null)
  }

  return (
    <div className="container grid" style={{gap:24}}>
      <h1>Tutor Dashboard</h1>
      {msg && <div className="card" style={{background:'#ecfeff', borderColor:'#06b6d4'}}>{msg}</div>}

      <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:24}}>
        <div className="card row">
          <h2>Create Topic</h2>
          <div><div className="label">Title</div><input className="input" data-test="title" value={title} onChange={e=>setTitle(e.target.value)} /></div>
          <div>
            <div className="label">Module</div>
            <select className="select" data-test="module" value={moduleCode} onChange={e=>setModule(e.target.value)}>
              <option>SEN371</option><option>SEN372</option>
            </select>
          </div>
          <button className="btn" data-test="create" onClick={onCreateTopic}>Create</button>
        </div>

        <div className="card row">
          <h2>Upload Material</h2>
          <div>
            <div className="label">Topic</div>
            <select className="select" value={topicId} onChange={e=>setTopicId(e.target.value)}>
              <option value="">Select a topic</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>
          <div>
            <div className="label">Type</div>
            <select className="select" value={type} onChange={e=>setType(e.target.value)}>
              <option>PDF</option><option>VIDEO</option><option>AUDIO</option><option>QUIZ</option><option>OTHER</option>
            </select>
          </div>
          <input type="file" data-test="upload-material" onChange={e=>setFile(e.target.files?.[0]||null)} />
          <button className="btn" onClick={onUpload}>Upload</button>
        </div>
      </div>

      <div className="grid cols-3">
        {topics.map(t => (
          <a key={t.id} href={`/topics/${t.id}`} className="card" data-test="topic-card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <strong>{t.title}</strong> <span className="badge">{t.moduleCode}</span>
            </div>
            <div style={{fontSize:12, color:'#64748b', marginTop:8}}>
              Materials: {t.materials?.length||0}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
