import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";

import TutorDashboard from "./pages/TutorDashboard";

export default function App() {

  return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Navigate to="/login" replace />} />
<Route path="/login" element={<Login />} />
<Route path="/dashboard/student" element={<StudentDashboard />} />
<Route path="/dashboard/tutor" element={<TutorDashboard />} />
<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
</BrowserRouter>

  );

}
 