import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { Card, Badge, Spinner, PageHeader } from '../components/UI'
import { OP_META, OPERATIONS, formatValue, formatDate } from '../constants'

const QUICK_ACTIONS = [
  { icon: '⇄', label: 'Convert Units',    desc: 'Convert between units of the same type',   to: '/convert',    color: '#58a6ff' },
  { icon: '⚖', label: 'Compare Values',   desc: 'Check if two quantities are equivalent',    to: '/compare',    color: '#3fb950' },
  { icon: '+', label: 'Add',              desc: 'Sum two quantities together',                to: '/arithmetic', op: 'ADD',      color: '#f0883e' },
  { icon: '−', label: 'Subtract',         desc: 'Subtract one quantity from another',         to: '/arithmetic', op: 'SUBTRACT', color: '#d2a8ff' },
  { icon: '×', label: 'Multiply',         desc: 'Scale a quantity by a multiplier',           to: '/arithmetic', op: 'MULTIPLY', color: '#ffa657' },
  { icon: '÷', label: 'Divide',           desc: 'Find the ratio of two quantities',           to: '/arithmetic', op: 'DIVIDE',   color: '#f85149' },
]

export default function OverviewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      quantityApi.getHistory(),
      ...OPERATIONS.map(op => quantityApi.getOperationCount(op).then(c => ({ op, c }))),
    ]).then(([hist, ...opCounts]) => {
      setHistory(hist)
      const m = {}
      opCounts.forEach(({ op, c }) => { m[op] = c })
      setCounts(m)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const totalOps   = history.length
  const successful = history.filter(h => !h.error).length
  const errors     = history.filter(h => h.error).length
  const recent     = history.slice(0, 6)

  const STATS = [
    { label: 'Total Operations', value: totalOps,   color: 'var(--blue)',   icon: '📊' },
    { label: 'Successful',       value: successful, color: 'var(--green)',  icon: '✅' },
    { label: 'Conversions',      value: counts.CONVERT || 0, color: 'var(--accent)', icon: '⇄' },
    { label: 'Errors',           value: errors,     color: 'var(--red)',    icon: '⚠' },
  ]

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Precision unit conversion and arithmetic at your fingertips"
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ padding: '20px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{s.icon}</span> {s.label}
            </div>
            {loading
              ? <div style={{ height: '36px', background: 'var(--surface2)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
              : <div style={{ fontFamily: 'var(--font-serif)', fontSize: '34px', color: s.color, lineHeight: 1 }}>{s.value}</div>
            }
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '14px' }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {QUICK_ACTIONS.map(a => (
            <div
              key={a.label}
              onClick={() => navigate(a.to, a.op ? { state: { op: a.op } } : {})}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = a.color
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 8px 24px ${a.color}22`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${a.color}18`, border: `1px solid ${a.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', marginBottom: '12px', color: a.color,
                fontFamily: 'var(--font-mono)', fontWeight: 700,
              }}>
                {a.icon}
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{a.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⏱ Recent Activity
          </div>
          <button
            onClick={() => navigate('/history')}
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-sans)' }}
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spinner />
          </div>
        ) : recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📭</div>
            <div style={{ fontWeight: 500, color: 'var(--text)' }}>No operations yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Use any operation above to get started</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Operation', 'Input', 'Result', 'Time'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 20px',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(h => (
                  <HistoryRow key={h.id} h={h} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function HistoryRow({ h }) {
  const inputStr = [
    h.thisValue != null ? `${formatValue(h.thisValue)} ${h.thisUnit || ''}` : null,
    h.thatValue != null ? `${formatValue(h.thatValue)} ${h.thatUnit || ''}` : null,
  ].filter(Boolean).join(' / ')

  let resultContent
  if (h.error) {
    resultContent = <span style={{ color: 'var(--red)', fontSize: '12px' }}>{h.errorMessage || 'Error'}</span>
  } else if (h.resultString != null) {
    const eq = h.resultString === 'true'
    resultContent = <span style={{ color: eq ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{eq ? '✓ Equal' : '✗ Not Equal'}</span>
  } else if (h.resultValue != null) {
    resultContent = (
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: '13px' }}>
        {formatValue(h.resultValue)} <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{h.resultUnit}</span>
      </span>
    )
  }

  return (
    <tr onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <td style={{ padding: '12px 20px', borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
        <Badge op={h.operation} error={h.error} />
      </td>
      <td style={{ padding: '12px 20px', borderBottom: '1px solid rgba(48,54,61,0.5)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
        {inputStr || '—'}
      </td>
      <td style={{ padding: '12px 20px', borderBottom: '1px solid rgba(48,54,61,0.5)' }}>
        {resultContent}
      </td>
      <td style={{ padding: '12px 20px', borderBottom: '1px solid rgba(48,54,61,0.5)', fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
        {formatDate(h.createdAt)}
      </td>
    </tr>
  )
}
