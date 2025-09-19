import { useState } from "react";
import { setAuthUser } from "../utils/storage";   // <-- this must exist now
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [email,setEmail] = useState("");
  const [name,setName] = useState("");
  const nav = useNavigate();

  function submit(e){
    e.preventDefault();
    // demo registration: create a student session
    setAuthUser({ email, role:"STUDENT", name: name || "Student" });
    nav("/app/overview", { replace:true });
  }

  return (
    <div style={{ minHeight:"100vh", display:"grid", placeItems:"center", background:"#f7f9fb" }}>
      <form onSubmit={submit} style={{ width:380, background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:20 }}>
        <h1 style={{marginTop:0}}>Create account</h1>
        <label style={{ fontWeight:700, margin:"10px 0 6px" }}>Name</label>
        <input style={input} value={name} onChange={e=>setName(e.target.value)} />
        <label style={{ fontWeight:700, margin:"10px 0 6px" }}>Email</label>
        <input style={input} value={email} onChange={e=>setEmail(e.target.value)} />
        <button style={btn} type="submit">Register</button>
      </form>
    </div>
  );
}
const input = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #d1d5db" };
const btn = { marginTop:14, width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #0aa266", background:"#0aa266", color:"#fff", fontWeight:800 };
