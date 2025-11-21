import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Issues from './pages/Issues'
import Prevention from './pages/Prevention'
import Tools from './pages/Tools'
import Blood from './pages/Blood/index.jsx'
import Login from './pages/Login'
import Register from './pages/Register'
import SymptomChecker from './pages/SymptomChecker'
import GlobalCases from './pages/GlobalCases'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  const location = useLocation()
  const hideHeader = location.pathname === '/global-cases'

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/issues" element={<Issues/>} />
          <Route path="/prevention" element={<Prevention/>} />
          <Route path="/tools" element={<Tools/>} />
          <Route path="/blood/*" element={<ProtectedRoute><Blood/></ProtectedRoute>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/symptoms" element={<SymptomChecker/>} />
          <Route path="/global-cases" element={<GlobalCases/>} />
        </Routes>
      </main>
    </div>
  )
}
