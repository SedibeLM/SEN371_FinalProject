import { useState } from "react";

import { getModules, getTopics, createTopic } from "../utils/storage";

export default function Topics(){

  const [title, setTitle] = useState("");

  const [moduleId, setModuleId] = useState("");

  const modules = getModules();

  const topics = getTopics();

  function add(e){

    e.preventDefault();

    if(!title || !moduleId) return;

    createTopic({title, moduleId: Number(moduleId)});

    setTitle("");

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

            {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
</select>
</div>
<div><button className="btn btn-primary" type="submit">Create Topic</button></div>
</form>
<div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))"}}>

        {topics.map(t => (
<div className="card" key={t.id}>
<div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
<div className="card-title">{t.title}</div>
<span className="pill">

                {modules.find(m=>m.id===t.moduleId)?.name || '—'}
</span>
</div>
<a className="btn btn-ghost" href={`/app/topics/${t.id}`} style={{marginTop:8}}>Open</a>
</div>

        ))}
</div>
</div>

  );

}
 