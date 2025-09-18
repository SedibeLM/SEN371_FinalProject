import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { getAuthUser } from './utils/storage'
import Login from './pages/Login'
import Register from './pages/Register'
import TutorDashboard from './pages/TutorDashboard'
import StudentDashboard from './pages/StudentDashboard'
import TopicDetail from './pages/TopicDetail'

function Protected({ children }) {
  const user = getAuthUser()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const user = getAuthUser()

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={
                user
                  ? (user.role === 'TUTOR' ? '/dashboard/tutor' : '/dashboard/student')
                  : '/login'
              }
              replace
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/tutor" element={<Protected><TutorDashboard /></Protected>} />
        <Route path="/dashboard/student" element={<Protected><StudentDashboard /></Protected>} />
        <Route path="/topics/:id" element={<Protected><TopicDetail /></Protected>} />
      </Routes>
    </>
  )
}
