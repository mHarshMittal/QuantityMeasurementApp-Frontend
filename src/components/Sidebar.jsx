import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Overview'   },
  { to: '/calculate', icon: '⌗', label: 'Calculate'  },
  { to: '/history',   icon: '⏱', label: 'History'    },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside style={{
      width: 'var(--sidebar)', minHeight: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10,
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>📐</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>QuantiMeasure</div>
          <div style={{ fontSize: '11px', color: 'var(--dim)' }}>Unit Converter</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px' }}>
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '7px', marginBottom: '2px',
            color: isActive ? 'var(--accent)' : 'var(--muted)',
            background: isActive ? 'rgba(108,99,255,0.12)' : 'transparent',
            fontSize: '14px', fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
          })}>
            <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 12px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, color: '#fff',
        }}>
          {(user?.name || user?.email || 'U').slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '11px', color: 'var(--dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
        </div>
        <button onClick={() => { logout(); navigate('/login') }} title="Sign out"
          style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: '15px', padding: '4px' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>
          ⏻
        </button>
      </div>
    </aside>
  )
}
