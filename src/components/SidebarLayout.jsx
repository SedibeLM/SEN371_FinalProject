import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getAuthUser, logoutUser } from "../utils/storage";

export default function SidebarLayout() {
  const u = getAuthUser();
  const nav = useNavigate();

  if (!u) {
    nav("/", { replace: true });
    return null;
  }

  const link = (to, label) => (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "block",
        padding: "10px 12px",
        borderRadius: 10,
        fontWeight: 600,
        textDecoration: "none",
        color: isActive ? "#0aa266" : "#222",
        background: isActive ? "#e9f9f1" : "transparent",
        border: "1px solid #e5e7eb",
      })}
    >
      {label}
    </NavLink>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background:"#f7f9fb" }}>
      <aside style={{ width: 260, padding: 16, background:"#fff", borderRight:"1px solid #e5e7eb" }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>CampusLearn</div>
        <div style={{ fontSize: 12, opacity:.7, margin:"12px 0 6px" }}>GENERAL</div>
        {link("/app/overview", "Overview")}
        {link("/app/topics", "Topics")}
        {link("/app/messages", "Messages")}

        <div style={{ fontSize: 12, opacity:.7, margin:"16px 0 6px" }}>DASHBOARDS</div>
        {u.role === "STUDENT" && link("/app/student", "Student")}
        {u.role === "TUTOR" && link("/app/tutor", "Tutor")}

        <div style={{ fontSize: 12, opacity:.7, margin:"16px 0 6px" }}>ACCOUNT</div>
        <button
          onClick={() => { logoutUser(); nav("/", { replace:true }); }}
          style={{
            width:"100%", padding:"10px 12px", borderRadius:10,
            border:"1px solid #e5e7eb", background:"#fff", fontWeight:700, cursor:"pointer"
          }}
        >
          Logout
        </button>

        <div style={{ marginTop:14, fontSize:12, color:"#6b7280" }}>
          {u.role}: {u.email}
        </div>
      </aside>
      <main style={{ flex:1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}
