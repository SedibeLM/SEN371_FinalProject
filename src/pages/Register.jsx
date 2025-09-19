import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../utils/storage";

export default function Register(){
 const [role, setRole] = useState("STUDENT"); // STUDENT or TUTOR
 const [firstName, setFirstName] = useState("");
 const [lastName, setLastName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const nav = useNavigate();

 async function submit(e){
   e.preventDefault();
   const res = await registerUser({ firstName, lastName, email, password, role });
   if(!res.ok){ 
     alert(res.msg); 
     return; 
   }
   // With email confirmation disabled, the user is logged in automatically.
   // Navigate them directly to the app.
   nav("/app/overview", { replace:true });
 }

 return (
<div className="auth-wrap">
<form className="form" onSubmit={submit} style={{maxWidth:460}}>
<h1>Create account</h1>
<div className="grid" style={{gridTemplateColumns:"1fr 1fr", gap:10}}>
<div>
<div className="label">First name</div>
<input className="input" value={firstName} onChange={e=>setFirstName(e.target.value)}/>
</div>
<div>
<div className="label">Last name</div>
<input className="input" value={lastName} onChange={e=>setLastName(e.target.value)}/>
</div>
</div>
<div className="label">Email</div>
<input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
<div className="label">Password</div>
<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<div className="label">Role</div>
<select className="input" value={role} onChange={e=>setRole(e.target.value)}>
<option value="STUDENT">Student</option>
<option value="TUTOR">Tutor</option>
</select>
<div style={{marginTop:14, display:"flex", gap:10, alignItems:"center"}}>
<button className="btn btn-primary" type="submit">Sign up</button>
<span style={{fontSize:14}}>
           Have an account? <Link to="/login" className="link">Sign in</Link>
</span>
</div>
</form>
</div>
 );
}