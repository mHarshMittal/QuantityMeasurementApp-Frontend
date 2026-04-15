import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { Button, Input, Alert } from '../components/UI'

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
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      <div className="animate-fadeUp" style={{
        width: '100%', maxWidth: '420px',
        display: 'flex', flexDirection: 'column', gap: '16px',
      }}>
        {/* Cold-start notice */}
        <div style={{
          background: 'rgba(88,166,255,0.08)', border: '1px solid rgba(88,166,255,0.25)',
          borderRadius: '10px', padding: '12px 16px',
          fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5,
        }}>
          ℹ️ <span style={{ color: 'var(--blue)', fontWeight: 500 }}>Free-tier note:</span>{' '}
          Backend services on Render may take <strong>30–60 seconds</strong> to wake up on first login.
          Please be patient if it takes a moment.
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '44px 40px',
          boxShadow: 'var(--shadow)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '58px', height: '58px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
              borderRadius: '16px', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', marginBottom: '14px',
            }}>📐</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', letterSpacing: '-0.4px' }}>
              QuantiMeasure
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <Alert type="error">{error}</Alert>}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
            />

            <Button type="submit" size="lg" loading={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Signing in… (may take up to 60s)' : 'Sign In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
