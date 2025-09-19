import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { loginUser, getAuthUser } from "../utils/storage";

export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const nav = useNavigate();

async function submit(e) {
    e.preventDefault();
    const ok = await loginUser(email, password);
    if (ok) {
      // After login, the Supabase client manages the session.
      // Navigate to the app root, and the AuthGuard will direct the user.
      nav("/app", { replace: true });
    } else {
      alert("Login failed. Please check your credentials.");
    }
  }

  return (
<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
<form onSubmit={submit} style={{ background: "#fff", padding: 20, borderRadius: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
<h2>CampusLearn Login</h2>
<div>Email</div>
<input value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
<div>Password</div>
<input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
<button type="submit" style={{ width: "100%", padding: 8, background: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}>Login</button>
<div style={{marginTop: 12, textAlign: 'center', fontSize: 14}}>
  Don't have an account? <a href="/register" className="link">Sign up</a>
</div>
</form>
</div>

  );

}
 