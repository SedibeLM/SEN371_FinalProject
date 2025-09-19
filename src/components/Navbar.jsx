import { Link, useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../utils/storage";
import { useState, useEffect } from "react";

export default function Navbar(){
 const [user, setUser] = useState(null);
 const nav = useNavigate();

 useEffect(() => {
   const fetchUser = async () => {
     setUser(await getAuthUser());
   };
   fetchUser();
 }, []);

 async function handleLogout() {
   await logout();
   nav("/login", { replace: true });
 }

 return (
<div className="navbar">
<div className="navbar-inner">
<div className="brand">
         Campus<span className="brand-accent">Learn</span>
</div>
<div className="nav-actions">
         {user && (
<Link className="btn btn-ghost" to={user.user_metadata.role==="TUTOR" ? "/app/tutor" : "/app/student"}>
             Dashboard
</Link>
         )}
<button className="btn btn-primary" onClick={handleLogout}>
           Logout
</button>
</div>
</div>
</div>
 );
}