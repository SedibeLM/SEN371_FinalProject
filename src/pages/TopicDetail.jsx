import { useParams } from "react-router-dom";
import { getTopics, getModules, getMaterialsByTopic, createThread } from "../utils/storage";
export default function TopicDetail(){
 const { topicId } = useParams();
 const topics = getTopics();
 const modules = getModules();
 const topic = topics.find(t => t.id === Number(topicId));
 const materials = getMaterialsByTopic(Number(topicId));
 if(!topic) return <div className="page"><h1>Topic not found</h1></div>;
 const moduleName = modules.find(m=>m.id===topic.moduleId)?.name || "—";
 function startDiscussion(){
   const th = createThread({title:`Discussion: ${topic.title}`, topicId: topic.id});
   window.location.href = `/app/messages`; // user can select newly created thread
 }
 return (
<div className="page">
<h1>{topic.title}</h1>
<div className="pill" style={{display:"inline-block", marginBottom:10}}>{moduleName}</div>
<div className="grid" style={{gridTemplateColumns:"2fr 1fr"}}>
<div className="card">
<h3 className="card-title">Materials</h3>
         {materials.length===0 ? <div style={{color:"var(--muted)"}}>None yet.</div> : (
<ul style={{margin:0, paddingLeft:18}}>
             {materials.map(m=>(
<li key={m.id}>
<b>{m.title}</b> — {m.kind} — <a href={m.url} target="_blank" rel="noreferrer">open</a>
</li>
             ))}
</ul>
         )}
</div>
<div className="card">
<h3 className="card-title">Discussion</h3>
<button className="btn btn-primary" onClick={startDiscussion}>Start Thread</button>
</div>
</div>
</div>
 );
}