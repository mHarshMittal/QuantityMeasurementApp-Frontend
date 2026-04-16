import React, { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { quantityApi } from '../api/quantities'
import { OPERATIONS, formatValue, formatDate } from '../constants'
import { Card, Badge, Button, Spinner, PageHeader } from '../components/UI'

const FILTERS = ['ALL', ...OPERATIONS]

export default function HistoryPage() {
  const [history, setHistory]   = useState([])
  const [filter, setFilter]     = useState('ALL')
  const [loading, setLoading]   = useState(true)
  const [deleting, setDeleting] = useState(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await quantityApi.getHistory()
      setHistory(data)
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const filtered = filter === 'ALL' ? history : history.filter(h => h.operation === filter)

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await quantityApi.deleteRecord(id)
      setHistory(h => h.filter(r => r.id !== id))
      toast.success('Record deleted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm('Delete all history? This cannot be undone.')) return
    setLoading(true)
    try {
      await quantityApi.deleteAll()
      setHistory([])
      toast.success('History cleared')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Operation counts for filter chips
  const counts = {}
  history.forEach(h => { counts[h.operation] = (counts[h.operation] || 0) + 1 })

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="⏱ History"
        subtitle="All operations performed in this session"
      />

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const cnt = f === 'ALL' ? history.length : (counts[f] || 0)
            const active = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                  border: `1px solid ${active ? 'rgba(240,136,62,0.4)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-muted)',
                  fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: active ? 500 : 400,
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                {f === 'ALL' ? '📋 All' : f}
                <span style={{
                  fontSize: '11px', padding: '1px 6px', borderRadius: '10px',
                  background: active ? 'rgba(240,136,62,0.15)' : 'var(--surface2)',
                  color: active ? 'var(--accent)' : 'var(--text-dim)',
                }}>{cnt}</span>
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={fetchHistory}>
            ↺ Refresh
          </Button>
          <Button variant="danger" size="sm" onClick={handleClearAll} disabled={history.length === 0}>
            🗑 Clear All
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <Spinner /> Loading history…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '44px', marginBottom: '14px', opacity: 0.4 }}>📭</div>
            <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>No records found</div>
            <div style={{ fontSize: '13px' }}>
              {filter === 'ALL' ? 'Perform an operation to see it here' : `No ${filter} operations yet`}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.15)' }}>
                  {['#', 'Operation', 'Input', 'Result', 'Type', 'Time', ''].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '11px 16px',
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
                      textTransform: 'uppercase', color: 'var(--text-muted)',
                      borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((h, idx) => (
                  <HistoryRow
                    key={h.id}
                    h={h}
                    idx={filtered.length - idx}
                    onDelete={handleDelete}
                    deleting={deleting === h.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-dim)', textAlign: 'right' }}>
          Showing {filtered.length} of {history.length} records
        </div>
      )}
    </div>
  )
}

function HistoryRow({ h, idx, onDelete, deleting }) {
  const inputStr = (() => {
    const parts = []
    if (h.thisValue != null) parts.push(`${formatValue(h.thisValue)} ${h.thisUnit || ''}`)
    if (h.thatValue != null) parts.push(`${formatValue(h.thatValue)} ${h.thatUnit || ''}`)
    return parts.join(' / ') || '—'
  })()

  const resultContent = (() => {
    if (h.error) return <span style={{ color: 'var(--red)', fontSize: '12px', maxWidth: '200px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.errorMessage || 'Error'}</span>
    if (h.resultString != null) {
      const eq = h.resultString === 'true'
      return <span style={{ color: eq ? 'var(--green)' : 'var(--red)', fontWeight: 600, fontSize: '13px' }}>{eq ? '✓ Equal' : '✗ Not Equal'}</span>
    }
    if (h.resultValue != null) {
      return (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--green)', fontSize: '13px' }}>
          {formatValue(h.resultValue)}{' '}
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{h.resultUnit}</span>
        </span>
      )
    }
    return <span style={{ color: 'var(--text-dim)' }}>—</span>
  })()

  const tdStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid rgba(48,54,61,0.5)',
    verticalAlign: 'middle',
  }

  return (
    <tr
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <td style={{ ...tdStyle, color: 'var(--text-dim)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        {h.id}
      </td>
      <td style={tdStyle}>
        <Badge op={h.operation} error={h.error} />
      </td>
      <td style={{ ...tdStyle, fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', maxWidth: '220px' }}>
        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {inputStr}
        </span>
      </td>
      <td style={tdStyle}>{resultContent}</td>
      <td style={{ ...tdStyle, fontSize: '12px', color: 'var(--text-muted)' }}>
        {h.thisMeasurementType || '—'}
      </td>
      <td style={{ ...tdStyle, fontSize: '12px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
        {formatDate(h.createdAt)}
      </td>
      <td style={tdStyle}>
        <button
          onClick={() => onDelete(h.id)}
          disabled={deleting}
          title="Delete record"
          style={{
            background: 'none', border: '1px solid transparent',
            color: 'var(--text-dim)', cursor: deleting ? 'wait' : 'pointer',
            padding: '4px 8px', borderRadius: 'var(--radius-xs)',
            fontSize: '13px', transition: 'all 0.15s',
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.borderColor = 'transparent' }}
        >
          {deleting ? <Spinner size={14} color="var(--red)" /> : '✕'}
        </button>
      </td>
    </tr>
  )
}
