import { Routes, Route, Navigate } from "react-router-dom";
import SidebarLayout from "./components/SidebarLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Overview from "./pages/Overview";
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import Topics from "./pages/Topics";
import Messages from "./pages/Messages";
import { getAuthUser } from "./utils/storage";

function RequireRole({ role, children }) {
  const u = getAuthUser();
  if (!u) return <Navigate to="/" replace />;
  if (role && u.role !== role) return <Navigate to="/app/overview" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/app" element={<SidebarLayout />}>
        <Route
          path="overview"
          element={
            <RequireRole><Overview /></RequireRole>
          }
        />
        <Route
          path="student"
          element={
            <RequireRole role="STUDENT"><StudentDashboard /></RequireRole>
          }
        />
        <Route
          path="tutor"
          element={
            <RequireRole role="TUTOR"><TutorDashboard /></RequireRole>
          }
        />
        <Route
          path="topics"
          element={
            <RequireRole><Topics /></RequireRole>
          }
        />
        <Route
          path="messages"
          element={
            <RequireRole><Messages /></RequireRole>
          }
        />
        <Route index element={<Navigate to="overview" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
