import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './components/DashboardLayout'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OverviewPage from './pages/OverviewPage'
import CalculatePage from './pages/CalculatePage'
import HistoryPage  from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"  element={<OverviewPage />} />
          <Route path="/calculate"  element={<CalculatePage />} />
          <Route path="/history"    element={<HistoryPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
