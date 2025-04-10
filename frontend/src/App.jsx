import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sketch from './components/Sketch'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Signup from './components/Signup'
import UserProfile from './components/UserProfile'
import Dashboard from './components/Dashboard'
import ForbiddenError from './components/ForbiddenError'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sketch/new" 
            element={
              <ProtectedRoute>
                <Sketch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sketch/:id" 
            element={
              <ProtectedRoute>
                <Sketch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
          <Route path="/forbidden" element={<ForbiddenError />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
