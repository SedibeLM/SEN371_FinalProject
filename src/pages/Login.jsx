import { useState } from "react";
import { loginUser } from "../utils/storage";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  function submit(e){
    e.preventDefault();
    const ok = loginUser(email,password);
    if(!ok) return alert("Invalid credentials");
    // role-based redirect happens inside app via side menu; go to overview:
    nav("/app/overview", { replace:true });
  }

  return (
    <div style={wrap}>
      <form onSubmit={submit} style={card}>
        <h1 style={{marginTop:0}}>Sign in</h1>
        <label style={label}>Email</label>
        <input style={input} value={email} onChange={e=>setEmail(e.target.value)} />
        <label style={label}>Password</label>
        <input style={input} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button style={btn} type="submit">Login</button>
        <div style={{marginTop:10,fontSize:14}}>
          No account? <Link to="/register">Register</Link>
        </div>
        <div style={{marginTop:12, fontSize:12, color:"#6b7280"}}>
          Demo accounts — student@gmail.com / 1234 &nbsp; | &nbsp; tutor@gmail.com / 1234
        </div>
      </form>
    </div>
  );
}

const wrap = { minHeight:"100vh", display:"grid", placeItems:"center", background:"#f7f9fb" };
const card = { width:380, background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:20, boxShadow:"0 3px 24px rgba(0,0,0,.05)" };
const label = { fontWeight:700, margin:"10px 0 6px" };
const input = { width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #d1d5db" };
const btn = { marginTop:14, width:"100%", padding:"10px 12px", borderRadius:10, border:"1px solid #0aa266", background:"#0aa266", color:"#fff", fontWeight:800 };
