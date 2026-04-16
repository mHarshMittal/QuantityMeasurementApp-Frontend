import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { quantityApi } from '../api/quantities'
import { OPERATIONS, formatValue, formatDate } from '../constants'
import { Card, Badge, Button, Spinner, PageHeader } from '../components/UI'

const FILTERS = ['ALL', ...OPERATIONS]

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try { setHistory(await quantityApi.getHistory()) }
    catch { toast.error('Failed to load history') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = filter === 'ALL' ? history : history.filter(h => h.operation === filter)

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await quantityApi.deleteRecord(id)
      setHistory(h => h.filter(r => r.id !== id))
      toast.success('Deleted')
    } catch (err) { toast.error(err.message) }
    finally { setDeleting(null) }
  }

  const handleClear = async () => {
    if (!window.confirm('Delete all history? This cannot be undone.')) return
    setLoading(true)
    try { await quantityApi.deleteAll(); setHistory([]); toast.success('Cleared') }
    catch (err) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  const td = { padding: '10px 12px', borderBottom: '1px solid rgba(46,50,72,0.5)', verticalAlign: 'middle' }

  return (
    <div className="fade-in">
      <PageHeader title="History" subtitle="Your complete operation history" />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const cnt = f === 'ALL' ? history.length : history.filter(h => h.operation === f).length
            if (cnt === 0 && f !== 'ALL') return null
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                background: filter === f ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: filter === f ? 'var(--accent)' : 'var(--muted)',
                fontWeight: filter === f ? 600 : 400,
              }}>
                {f === 'ALL' ? 'All' : f} ({cnt})
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={load}>↺ Refresh</Button>
          <Button variant="danger" size="sm" onClick={handleClear} disabled={history.length === 0}>🗑 Clear All</Button>
        </div>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px', color: 'var(--muted)', fontSize: '14px' }}>
            <Spinner /> Loading history…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--muted)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📭</div>
            <div style={{ fontWeight: 500, color: 'var(--text)' }}>No records found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>{filter === 'ALL' ? 'Perform an operation to see history' : `No ${filter} operations yet`}</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.15)' }}>
                  {['Operation', 'Input', 'Result', 'Type', 'Time', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '9px 12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--dim)', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => {
                  const input = [
                    h.thisValue != null ? `${formatValue(h.thisValue)} ${h.thisUnit || ''}` : null,
                    h.thatValue != null ? `${formatValue(h.thatValue)} ${h.thatUnit || ''}` : null,
                  ].filter(Boolean).join(' / ') || '—'

                  const res = h.error ? (
                    <span style={{ color: 'var(--red)', fontSize: '12px' }}>{h.errorMessage || 'Error'}</span>
                  ) : h.resultString != null ? (
                    <span style={{ color: h.resultString === 'true' ? 'var(--green)' : 'var(--red)', fontWeight: 600, fontSize: '13px' }}>
                      {h.resultString === 'true' ? '✓ Equal' : '✗ Not Equal'}
                    </span>
                  ) : h.resultValue != null ? (
                    <span style={{ fontFamily: 'var(--mono)', color: 'var(--green)', fontSize: '13px' }}>
                      {formatValue(h.resultValue)}{h.resultUnit ? ` ${h.resultUnit}` : ''}
                    </span>
                  ) : <span style={{ color: 'var(--dim)' }}>—</span>

                  return (
                    <tr key={h.id}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={td}><Badge op={h.operation} error={h.error} /></td>
                      <td style={{ ...td, fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{input}</td>
                      <td style={td}>{res}</td>
                      <td style={{ ...td, fontSize: '12px', color: 'var(--muted)' }}>{h.thisMeasurementType || '—'}</td>
                      <td style={{ ...td, fontSize: '12px', color: 'var(--dim)', whiteSpace: 'nowrap' }}>{formatDate(h.createdAt)}</td>
                      <td style={td}>
                        <button onClick={() => handleDelete(h.id)} disabled={deleting === h.id}
                          style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: '13px', padding: '2px 6px', borderRadius: '4px' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}>
                          {deleting === h.id ? <Spinner size={12} color="var(--red)" /> : '✕'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--dim)', textAlign: 'right' }}>
          {filtered.length} record{filtered.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
