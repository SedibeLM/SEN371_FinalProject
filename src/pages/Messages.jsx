import { useMemo, useState } from "react";
import { getThreads, createThread, sendMessage, getAuthUser, getThreadWithMessages, getTopics } from "../utils/storage";
export default function Messages(){
 const [selected, setSelected] = useState(null);
 const [body, setBody] = useState("");
 const [title, setTitle] = useState("");
 const threads = getThreads();
 const topics = getTopics();
 const {thread, messages} = useMemo(()=> selected ? getThreadWithMessages(selected) : {thread:null, messages:[]}, [selected]);
 function newThread(e){
   e.preventDefault();
   if(!title) return;
   const t = createThread({title, topicId: topics[0]?.id || null});
   setTitle(""); setSelected(t.id);
 }
 function send(e){
   e.preventDefault();
   if(!body || !selected) return;
   const u = getAuthUser();
   sendMessage({threadId:selected, authorId: u?.id || 0, body});
   setBody("");
 }
 return (
<div className="page">
<h1>Messages</h1>
<div className="grid" style={{gridTemplateColumns:"320px 1fr"}}>
<div className="card">
<h3 className="card-title">Threads</h3>
<div style={{display:"grid", gap:8}}>
           {threads.map(t=>(
<button
               key={t.id}
               className="btn btn-ghost"
               style={{justifyContent:"flex-start"}}
               onClick={()=>setSelected(t.id)}
>
               {t.title}
</button>
           ))}
</div>
<form onSubmit={newThread} style={{marginTop:12, display:"grid", gap:8}}>
<input className="input" placeholder="New thread title…" value={title} onChange={e=>setTitle(e.target.value)}/>
<button className="btn btn-primary" type="submit">Create Thread</button>
</form>
</div>
<div className="card">
<h3 className="card-title">{thread ? thread.title : "Select a thread"}</h3>
<div style={{minHeight:220, border:"1px solid var(--border)", borderRadius:10, padding:12, background:"#fff", marginBottom:10}}>
           {messages.length===0 ? <div style={{color:"var(--muted)"}}>No messages yet.</div> : (
             messages.map(m=>(
<div key={m.id} style={{marginBottom:10}}>
<div style={{fontSize:12, color:"var(--muted)"}}>{new Date(m.createdAt).toLocaleString()}</div>
<div>{m.body}</div>
</div>
             ))
           )}
</div>
<form onSubmit={send} style={{display:"grid", gridTemplateColumns:"1fr auto", gap:10}}>
<input className="input" placeholder="Write a message…" value={body} onChange={e=>setBody(e.target.value)}/>
<button className="btn btn-primary" type="submit" disabled={!selected}>Send</button>
</form>
</div>
</div>
</div>
 );
}