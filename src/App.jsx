import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuthUser } from "./utils/storage";

// Layouts
import SidebarLayout from "./layouts/SidebarLayout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// App Pages
import Overview from "./pages/Overview";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import Materials from "./pages/Materials";
import Messages from "./pages/Messages";
import Modules from "./pages/Modules";
import ModuleDetail from "./pages/ModuleDetail"; // Import ModuleDetail
import StudentDashboard from "./pages/StudentDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import QuizDetail from "./pages/QuizDetail";
import ThreadDetail from "./pages/ThreadDetail";

/**
 * A wrapper for routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 */
function AuthGuard({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getAuthUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Main App Routes (protected by AuthGuard) */}
      <Route 
        path="/app" 
        element={<AuthGuard><SidebarLayout /></AuthGuard>}
      >
        <Route path="overview" element={<Overview />} />
        <Route path="student" element={<StudentDashboard />} />
        <Route path="tutor" element={<TutorDashboard />} />
        <Route path="modules" element={<Modules />} />
        <Route path="modules/:moduleId" element={<ModuleDetail />} /> {/* Add ModuleDetail route */}
        <Route path="topics" element={<Topics />} />
        <Route path="topics/:topicId" element={<TopicDetail />} />
        <Route path="threads/:threadId" element={<ThreadDetail />} />
        <Route path="create-quiz/:topicId" element={<CreateQuiz />} />
        <Route path="quizzes/:quizId" element={<QuizDetail />} />
        <Route path="materials" element={<Materials />} />
        <Route path="messages" element={<Messages />} />
        {/* Default route within the app */}
        <Route index element={<Navigate to="overview" replace />} />
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/app" replace />} />

      {/* Fallback for any other route */}
      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}