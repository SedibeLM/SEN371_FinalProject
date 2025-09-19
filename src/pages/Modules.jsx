import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addModule, getModules, getUserProfile } from "../utils/storage";

export default function Modules(){
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [modulesData, userProfile] = await Promise.all([
        getModules(),
        getUserProfile()
      ]);
      console.log("User Profile:", userProfile); // Debugging line
      setModules(modulesData);
      setProfile(userProfile);
      setLoading(false);
    };
    fetchData();
  }, []);

  async function submit(e){
    e.preventDefault();
    if(!name.trim() || !code.trim()) return;
    const res = await addModule({ name: name.trim(), code: code.trim() });
    if(!res.ok){ 
      alert(res.msg); 
      return; 
    }
    // Add the new module to the list without a full refetch
    setModules([...modules, res.data]);
    setName("");
    setCode("");
  }

  return (
    <div className="page">
      <h1>Modules</h1>
      {profile?.role === 'tutor' && (
        <form className="card" onSubmit={submit} style={{display:"grid", gap:10, marginBottom:18}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
            <div>
              <div className="label">Module Code</div>
              <input className="input" value={code} onChange={e=>setCode(e.target.value)} placeholder="e.g., SEN371"/>
            </div>
            <div>
              <div className="label">Module Name</div>
              <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Software Engineering"/>
            </div>
          </div>
          <button className="btn btn-primary" type="submit">Add Module</button>
        </form>
      )}

      {loading ? (
        <div>Loading modules...</div>
      ) : (
        <div className="grid" style={{gridTemplateColumns:"repeat(auto-fit, minmax(200px,1fr))"}}>
          {modules.map(m=>(
            <Link to={`/app/modules/${m.module_id}`} key={m.module_id} className="card" style={{textDecoration: 'none', color: 'inherit'}}>
              <div className="card-title">{m.code}</div>
              <div style={{color:"var(--muted)"}}>{m.name}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}