import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { Button, Input, Alert, Card } from '../components/UI'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    try {
      const data = await authApi.login(form.email, form.password)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user?.name || 'there'}!`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Cold start notice */}
        <Alert type="info">
          <strong>Note:</strong> Backend services may take 30–60 seconds to wake up on first use (free hosting). Please be patient.
        </Alert>

        <Card>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📐</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>QuantiMeasure</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && <Alert type="error">{error}</Alert>}
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="email" />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} autoComplete="current-password" />
            <Button type="submit" size="lg" loading={loading} style={{ marginTop: '6px' }}>
              {loading ? 'Signing in… (may take up to 60s)' : 'Sign In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Create one</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
