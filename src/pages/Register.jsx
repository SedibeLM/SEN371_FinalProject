import { useState } from 'react'
import { registerUser, getAuthUser } from '../utils/storage'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [firstName, setFirst] = useState('')
  const [lastName, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    try {
      const user = registerUser({firstName, lastName, email, password, role})
      nav(user.role==='TUTOR'?'/dashboard/tutor':'/dashboard/student', { replace:true })
    } catch (e) { setErr(e.message) }
  }

  if (getAuthUser()) return <div className="container"><p>You are already logged in.</p></div>

  return (
    <div className="container" style={{maxWidth:520}}>
      <h1>Register</h1>
      <form className="card row" onSubmit={submit}>
        {err && <div style={{color:'#b91c1c'}}>{err}</div>}
        <div><div className="label">First name</div><input className="input" value={firstName} onChange={e=>setFirst(e.target.value)} /></div>
        <div><div className="label">Last name</div><input className="input" value={lastName} onChange={e=>setLast(e.target.value)} /></div>
        <div><div className="label">Email</div><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><div className="label">Password</div><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div>
          <div className="label">Role</div>
          <select className="select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="TUTOR">Tutor</option>
          </select>
        </div>
        <button className="btn">Create account</button>
        <div>Already have an account? <Link to="/login">Login</Link></div>
      </form>
    </div>
  )
}
