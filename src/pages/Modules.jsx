import { useState } from "react";

import { addModule, getModules } from "../utils/storage";

export default function Modules(){

  const [name, setName] = useState("");

  const modules = getModules();

  function submit(e){

    e.preventDefault();

    if(!name.trim()) return;

    const res = addModule(name.trim());

    if(!res.ok){ alert(res.msg); return; }

    setName("");

  }

  return (
<div className="page">
<h1>Modules</h1>
<form className="card" onSubmit={submit} style={{display:"grid", gap:10, marginBottom:18}}>
<div className="label">Module Name</div>
<input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., SEN371"/>
<button className="btn btn-primary" type="submit">Add Module</button>
</form>
<div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))"}}>

        {modules.map(m=>(
<div className="card" key={m.id}>
<div className="card-title">{m.name}</div>
<div style={{color:"var(--muted)"}}>id: {m.id}</div>
</div>

        ))}
</div>
</div>

  );

}
 