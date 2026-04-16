import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { Card, Badge, Spinner, PageHeader } from '../components/UI'
import { formatValue, formatDate } from '../constants'

export default function OverviewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    quantityApi.getHistory()
      .then(data => setHistory(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  const td = { padding: '11px 14px', borderBottom: '1px solid rgba(46,50,72,0.6)', verticalAlign: 'middle' }

  return (
    <div className="fade-in">
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0] || 'there'} 👋`} subtitle="Precision unit conversion and arithmetic" />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <ActionBtn icon="⌗" label="Calculate" desc="Convert, compare & arithmetic" color="var(--accent)" onClick={() => navigate('/calculate')} />
        <ActionBtn icon="⏱" label="History"   desc="View past operations"          color="var(--accent2)" onClick={() => navigate('/history')} />
      </div>

      {/* Recent */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Recent Activity</span>
          <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px' }}>View all →</button>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '36px' }}><Spinner /></div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📭</div>
            <div style={{ fontWeight: 500 }}>No operations yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              <button onClick={() => navigate('/calculate')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font)' }}>
                Start calculating →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.15)' }}>
                  {['Operation', 'Input', 'Result', 'Time'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--dim)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(h => {
                  const input = [
                    h.thisValue != null ? `${formatValue(h.thisValue)} ${h.thisUnit || ''}` : null,
                    h.thatValue != null ? `${formatValue(h.thatValue)} ${h.thatUnit || ''}` : null,
                  ].filter(Boolean).join(' / ') || '—'
                  const result = h.error ? (
                    <span style={{ color: 'var(--red)', fontSize: '12px' }}>Error</span>
                  ) : h.resultString != null ? (
                    <span style={{ color: h.resultString === 'true' ? 'var(--green)' : 'var(--red)', fontWeight: 600, fontSize: '13px' }}>
                      {h.resultString === 'true' ? '✓ Equal' : '✗ Not Equal'}
                    </span>
                  ) : h.resultValue != null ? (
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--green)', fontSize: '13px' }}>
                      {formatValue(h.resultValue)} <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{h.resultUnit}</span>
                    </span>
                  ) : null
                  return (
                    <tr key={h.id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={td}><Badge op={h.operation} error={h.error} /></td>
                      <td style={{ ...td, fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>{input}</td>
                      <td style={td}>{result}</td>
                      <td style={{ ...td, fontSize: '12px', color: 'var(--dim)', whiteSpace: 'nowrap' }}>{formatDate(h.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function ActionBtn({ icon, label, desc, color, onClick }) {
  const [hover, setHover] = React.useState(false)
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        flex: '1', minWidth: '180px', background: 'var(--surface)', border: `1px solid ${hover ? color : 'var(--border)'}`,
        borderRadius: '10px', padding: '18px', cursor: 'pointer',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.15s',
      }}>
      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{desc}</div>
    </div>
  )
}
