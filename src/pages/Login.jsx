import { useState } from 'react'
import { loginUser, getAuthUser } from '../utils/storage'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  function submit(e){
    e.preventDefault()
    try {
      const user = loginUser(email, password)
      if (user.role === 'TUTOR') nav('/dashboard/tutor', { replace:true })
      else nav('/dashboard/student', { replace:true })
    } catch (e) {
      setErr(e.message)
    }
  }

  if (getAuthUser()) return <div className="container"><p>You are already logged in.</p></div>

  return (
    <div className="container" style={{maxWidth:480}}>
      <h1>Login</h1>
      <form className="card row" onSubmit={submit}>
        {err && <div style={{color:'#b91c1c'}}>{err}</div>}
        <div>
          <div className="label">Email</div>
          <input className="input" data-test="login-email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <div className="label">Password</div>
          <input className="input" data-test="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn" data-test="login-submit">Sign in</button>
        <div>New user? <Link to="/register">Register</Link></div>
      </form>
      <div className="card" style={{marginTop:12, fontSize:13}}>
        Demo accounts: tutor@demo.com / pass &nbsp;|&nbsp; student@demo.com / pass
      </div>
    </div>
  )
}
