import { getTopics, getMaterials } from "../utils/storage";  // <-- no getModules

export default function Topics(){
  const topics = getTopics();
  return (
    <div>
      <h1>Topics</h1>
      <div style={grid}>
        {topics.map(t=>(
          <div key={t.id} style={card}>
            <div style={head}>
              <strong>{t.title}</strong>
              <span style={{opacity:.6}}>SEN371</span>
            </div>
            <div style={{color:"#6b7280", marginBottom:10}}>{t.description}</div>
            <div style={{fontSize:13,color:"#6b7280"}}>
              Materials: {getMaterials(t.id).length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
const grid={display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:16};
const card={background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:16};
const head={display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8};
