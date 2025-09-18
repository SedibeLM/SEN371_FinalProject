import { Link, useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../utils/storage";
export default function Navbar(){
 const user = getAuthUser();
 const nav = useNavigate();
 return (
<div className="navbar">
<div className="navbar-inner">
<div className="brand">
         Campus<span className="brand-accent">Learn</span>
</div>
<div className="nav-actions">
         {user && (
<Link className="btn btn-ghost" to={user.role==="TUTOR" ? "/dashboard/tutor" : "/dashboard/student"}>
             Dashboard
</Link>
         )}
<button className="btn btn-primary" onClick={()=>{ logout(); nav("/login",{replace:true}); }}>
           Logout
</button>
</div>
</div>
</div>
 );
}