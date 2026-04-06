import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import DashboardLayout from './components/DashboardLayout'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OverviewPage from './pages/OverviewPage'
import ConvertPage  from './pages/ConvertPage'
import ComparePage  from './pages/ComparePage'
import ArithmeticPage from './pages/ArithmeticPage'
import HistoryPage  from './pages/HistoryPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected - dashboard layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"  element={<OverviewPage />} />
          <Route path="/convert"    element={<ConvertPage />} />
          <Route path="/compare"    element={<ComparePage />} />
          <Route path="/arithmetic" element={<ArithmeticPage />} />
          <Route path="/history"    element={<HistoryPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
