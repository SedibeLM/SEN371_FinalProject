import { useEffect, useState } from "react";
import { getAuthUser, getTopics, getSubscriptions, toggleSubscription } from "../utils/storage";

export default function StudentDashboard(){
  const u = getAuthUser();
  const [topics, setTopics] = useState([]);
  const [subs, setSubs] = useState([]);

  useEffect(()=>{
    setTopics(getTopics());
    setSubs(getSubscriptions(u.email));
  },[u.email]);

  function click(topicId){
    const nowSubscribed = toggleSubscription(u.email, topicId);
    setSubs(prev => nowSubscribed ? [...prev, topicId] : prev.filter(x=>x!==topicId));
  }

  return (
    <div>
      <h1>Student Dashboard</h1>
      <div style={grid}>
        {topics.map(t => {
          const subscribed = subs.includes(t.id);
          return (
            <div key={t.id} style={card}>
              <div style={head}>
                <strong>{t.title}</strong>
                <span style={{opacity:.6}}>SEN371</span>
              </div>
              <div style={{marginBottom:12, color:"#6b7280"}}>{t.description}</div>
              <button onClick={() => click(t.id)} style={subscribed?btnOutline:btnPrimary}>
                {subscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(360px,1fr))",gap:18};
const card={background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:16,boxShadow:"0 3px 24px rgba(0,0,0,.03)"};
const head={display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8};
const btnPrimary={width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #0aa266",background:"#0aa266",color:"#fff",fontWeight:800};
const btnOutline={width:"100%",padding:"10px 12px",borderRadius:10,border:"1px solid #0aa266",background:"#e9f9f1",color:"#0aa266",fontWeight:800};
