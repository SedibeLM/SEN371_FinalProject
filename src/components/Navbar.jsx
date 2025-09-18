import { Link, useNavigate } from 'react-router-dom'
import { getAuthUser, logout } from '../utils/storage'

export default function Navbar() {
  const user = getAuthUser()
  const nav = useNavigate()
  function onLogout(){ logout(); nav('/login', { replace:true }) }

  return (
    <div className="navbar">
      <div className="container navbar-inner">
        <div style={{display:'flex', gap:16, alignItems:'center'}}>
          <strong>CampusLearn</strong>
          {user && (
            <Link to={user.role==='TUTOR'?'/dashboard/tutor':'/dashboard/student'}>Dashboard</Link>
          )}
        </div>
        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          {user ? (
            <>
              <span className="badge">{user.role}</span>
              <button className="btn secondary" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
