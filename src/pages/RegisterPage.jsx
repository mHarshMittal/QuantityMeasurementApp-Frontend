import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { Button, Input, Alert, Card } from '../components/UI'

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    try {
      await authApi.register(form.name, form.email, form.password)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="fade-in" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Alert type="info">
          <strong>Note:</strong> First request may take 30–60 seconds while the server wakes up.
        </Alert>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>📐</div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>Create Account</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Join QuantiMeasure today</p>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {error && <Alert type="error">{error}</Alert>}
            <Input label="Full Name" type="text" placeholder="Jane Doe" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <Button type="submit" size="lg" loading={loading} style={{ marginTop: '6px' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
