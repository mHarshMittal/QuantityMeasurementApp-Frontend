import React, { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../api/auth'
import { Button, Input, Alert } from '../components/UI'

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

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

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
          First request may take <strong>30–60 seconds</strong> while the server wakes up.
        </div>

        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '44px 40px',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '58px', height: '58px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
              borderRadius: '16px', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', marginBottom: '14px',
            }}>📐</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', letterSpacing: '-0.4px' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '5px' }}>
              Join QuantiMeasure today
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <Alert type="error">{error}</Alert>}

            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
            />

            <Button type="submit" size="lg" loading={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
