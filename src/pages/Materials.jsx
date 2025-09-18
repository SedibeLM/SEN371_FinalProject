import { useMemo, useState } from "react";
import { getTopics, addMaterial, getMaterialsByTopic } from "../utils/storage";
export default function Materials(){
 const topics = getTopics();
 const [topicId, setTopicId] = useState(String(topics[0]?.id || ""));
 const [title, setTitle] = useState("");
 const [kind, setKind] = useState("PDF");
 const [url, setUrl] = useState("");
 const list = useMemo(()=> topicId ? getMaterialsByTopic(Number(topicId)) : [], [topicId]);
 function submit(e){
   e.preventDefault();
   if(!topicId || !title || !url) return;
   addMaterial({ topicId: Number(topicId), title, kind, url });
   setTitle(""); setUrl("");
 }
 return (
<div className="page">
<h1>Materials</h1>
<form className="card" onSubmit={submit} style={{display:"grid", gap:10, marginBottom:18}}>
<div className="label">Topic</div>
<select className="input" value={topicId} onChange={e=>setTopicId(e.target.value)}>
         {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
</select>
<div className="label">Title</div>
<input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Slides Week 1"/>
<div className="label">Type</div>
<select className="input" value={kind} onChange={e=>setKind(e.target.value)}>
<option>PDF</option><option>Video</option><option>Image</option><option>Link</option>
</select>
<div className="label">URL</div>
<input className="input" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..."/>
<button className="btn btn-primary" type="submit">Add Material</button>
</form>
<div className="card">
<h3 className="card-title">Materials for Selected Topic</h3>
       {list.length===0 ? <div style={{color:"var(--muted)"}}>None yet.</div> : (
<ul style={{margin:0, paddingLeft:18}}>
           {list.map(m => (
<li key={m.id}>
<b>{m.title}</b> — {m.kind} — <a href={m.url} target="_blank" rel="noreferrer">open</a>
</li>
           ))}
</ul>
       )}
</div>
</div>
 );
}