import { useEffect, useState } from "react";
import { getAuthUser, getTopics, getMessages, sendMessage } from "../utils/storage";

export default function Messages(){
  const u = getAuthUser();
  const topics = getTopics();
  const [topicId, setTopicId] = useState(topics[0]?.id || 0);
  const [text, setText] = useState("");
  const [list, setList] = useState([]);

  useEffect(()=>{ if(topicId) setList(getMessages(topicId)); },[topicId]);

  function submit(e){
    e.preventDefault();
    if(!text.trim() || !topicId) return;
    sendMessage({ topicId, content:text, senderEmail:u.email });
    setText("");
    setList(getMessages(topicId));
  }

  return (
    <div>
      <h1>Messages</h1>
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
        <div style={pane}>
          <div style={{fontWeight:700, marginBottom:8}}>Select Topic</div>
          <select style={input} value={topicId} onChange={e=>setTopicId(Number(e.target.value))}>
            {topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>

        <div style={pane}>
          <div style={{height:300, overflowY:"auto", border:"1px solid #e5e7eb", borderRadius:10, padding:12, background:"#fff"}}>
            {list.length===0 && <div style={{color:"#6b7280"}}>No messages yet.</div>}
            {list.map(m=>(
              <div key={m.id} style={{marginBottom:10}}>
                <div style={{fontSize:12, color:"#6b7280"}}>
                  {m.senderEmail} · {new Date(m.timestamp).toLocaleString()}
                </div>
                <div style={{fontWeight:600}}>{m.content}</div>
              </div>
            ))}
          </div>
          <form onSubmit={submit} style={{marginTop:10, display:"flex", gap:8}}>
            <input style={{...input, flex:1}} value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message..." />
            <button style={btnPrimary}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const pane={background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:16};
const input={width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #d1d5db"};
const btnPrimary={padding:"10px 12px",borderRadius:10,border:"1px solid #0aa266",background:"#0aa266",color:"#fff",fontWeight:800};
