import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getAuthUser, logout } from "../utils/storage";
import { useEffect, useState } from "react";

export default function SidebarLayout(){
 const [user, setUser] = useState(null);
 const nav = useNavigate();

 useEffect(() => {
   const fetchUser = async () => {
     const currentUser = await getAuthUser();
     if (!currentUser) {
       nav("/login", { replace: true });
     } else {
       setUser(currentUser);
     }
   };
   fetchUser();
 }, [nav]);
 return (
<div className="shell">
     {/* LEFT SIDEBAR */}
<aside className="sidenav">
<div className="side-brand">
         Campus<span className="side-accent">Learn</span>
</div>
<div className="side-group">
<div className="side-title">General</div>
<NavLink to="/app/overview" className={({isActive}) => "side-link" + (isActive?" active":"")}>🏠 Overview</NavLink>
<NavLink to="/app/topics"   className={({isActive}) => "side-link" + (isActive?" active":"")}>📚 Topics</NavLink>
<NavLink to="/app/messages" className={({isActive}) => "side-link" + (isActive?" active":"")}>💬 Messages</NavLink>
</div>
<div className="side-group">
<div className="side-title">Dashboards</div>
<NavLink to="/app/student" className={({isActive}) => "side-link" + (isActive?" active":"")}>🧑‍🎓 Student</NavLink>
<NavLink to="/app/tutor"   className={({isActive}) => "side-link" + (isActive?" active":"")}>👩‍🏫 Tutor</NavLink>
</div>
<div className="side-group">
<button
           onClick={()=>{ logout(); nav("/login", {replace:true}); }}
           className="side-link"
           style={{border:'1px solid var(--border)', width:'100%', textAlign:'left', background:'#fff'}}
>
           🚪 Logout
</button>
</div>
</aside>
     {/* MAIN CONTENT */}
<main className="content">
<Outlet/>
</main>
</div>
 );
}