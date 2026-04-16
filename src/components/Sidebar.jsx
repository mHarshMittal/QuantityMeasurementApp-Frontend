import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_ITEMS = [
  { to: '/dashboard',  icon: '⊞', label: 'Overview' },
  { to: '/convert',    icon: '⇄', label: 'Convert' },
  { to: '/compare',    icon: '⚖', label: 'Compare' },
  { to: '/arithmetic', icon: '±', label: 'Arithmetic' },
  { to: '/history',    icon: '⏱', label: 'History' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (user?.name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <aside style={{
      width: 'var(--sidebar-w)', minHeight: '100vh',
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #d97706 100%)',
            borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', flexShrink: 0,
          }}>📐</div>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              QuantiMeasure
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '1px' }}>Unit Converter</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: 'var(--text-dim)', padding: '8px 10px 6px', textTransform: 'uppercase' }}>
          Operations
        </div>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 10px', borderRadius: 'var(--radius-xs)',
              textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              transition: 'all 0.15s', marginBottom: '2px',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = 'var(--surface2)'
                e.currentTarget.style.color = 'var(--text)'
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.color.includes('accent')) {
                e.currentTarget.style.background = ''
                e.currentTarget.style.color = ''
              }
            }}
          >
            <span style={{ fontSize: '17px', width: '22px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User area */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--blue), #1d4ed8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              background: 'none', border: '1px solid transparent', color: 'var(--text-dim)',
              cursor: 'pointer', padding: '5px 7px', borderRadius: 'var(--radius-xs)',
              fontSize: '14px', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'transparent' }}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}
