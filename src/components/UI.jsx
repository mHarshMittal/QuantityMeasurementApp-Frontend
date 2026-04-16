import React from 'react'

const s = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '24px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: 'var(--muted)',
    marginBottom: '6px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
}

export function Card({ children, style }) {
  return <div style={{ ...s.card, ...style }}>{children}</div>
}

export function Label({ children }) {
  return <span style={s.label}>{children}</span>
}

export function Input({ label, style, ...props }) {
  const [focus, setFocus] = React.useState(false)
  return (
    <div style={{ marginBottom: '0' }}>
      {label && <label style={s.label}>{label}</label>}
      <input
        style={{ ...s.input, borderColor: focus ? 'var(--accent)' : 'var(--border)', ...style }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />
    </div>
  )
}

export function Select({ label, options = [], ...props }) {
  const [focus, setFocus] = React.useState(false)
  return (
    <div>
      {label && <label style={s.label}>{label}</label>}
      <select
        style={{ ...s.select, borderColor: focus ? 'var(--accent)' : 'var(--border)' }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      >
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  )
}

export function Button({ children, variant = 'primary', loading, size = 'md', ...props }) {
  const bg = {
    primary: 'var(--accent)',
    ghost: 'transparent',
    danger: 'rgba(239,68,68,0.12)',
  }[variant] || 'var(--accent)'
  const clr = {
    primary: '#fff',
    ghost: 'var(--muted)',
    danger: 'var(--red)',
  }[variant] || '#fff'
  const pad = size === 'lg' ? '13px 24px' : size === 'sm' ? '7px 14px' : '10px 20px'

  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        padding: pad, borderRadius: '8px', border: variant === 'ghost' ? '1px solid var(--border)' : variant === 'danger' ? '1px solid rgba(239,68,68,0.3)' : 'none',
        background: bg, color: clr, fontWeight: 600, fontSize: size === 'sm' ? '13px' : '14px',
        opacity: props.disabled || loading ? 0.6 : 1,
        cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s',
        width: size === 'lg' ? '100%' : undefined,
      }}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

export function Spinner({ size = 18, color = 'var(--accent)' }) {
  return (
    <span style={{
      display: 'inline-block',
      width: size, height: size, minWidth: size,
      border: '2px solid rgba(255,255,255,0.15)',
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}

export function Alert({ type = 'error', children }) {
  const map = {
    error: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#fca5a5' },
    success: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', color: '#86efac' },
    info: { bg: 'rgba(79,158,255,0.1)', border: 'rgba(79,158,255,0.3)', color: '#93c5fd' },
  }
  const c = map[type] || map.error
  return (
    <div style={{
      padding: '11px 14px', borderRadius: '8px', fontSize: '13px',
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      {children}
    </div>
  )
}

export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{title}</h1>
      {subtitle && <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{subtitle}</p>}
    </div>
  )
}

export function Badge({ op, error }) {
  const map = {
    CONVERT:  { bg: 'rgba(79,158,255,0.15)',  color: '#93c5fd' },
    COMPARE:  { bg: 'rgba(34,197,94,0.15)',   color: '#86efac' },
    ADD:      { bg: 'rgba(108,99,255,0.15)',  color: '#c4b5fd' },
    SUBTRACT: { bg: 'rgba(245,158,11,0.15)', color: '#fcd34d' },
    MULTIPLY: { bg: 'rgba(79,158,255,0.15)',  color: '#93c5fd' },
    DIVIDE:   { bg: 'rgba(239,68,68,0.15)',   color: '#fca5a5' },
    ERROR:    { bg: 'rgba(239,68,68,0.12)',   color: '#fca5a5' },
  }
  const k = error ? 'ERROR' : op
  const c = map[k] || { bg: 'var(--surface2)', color: 'var(--muted)' }
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.4px',
      background: c.bg, color: c.color,
    }}>
      {error ? 'ERROR' : op}
    </span>
  )
}

export function ResultBox({ result }) {
  if (!result) return null
  const isErr = result.error
  return (
    <div className="fade-in" style={{
      marginTop: '20px', padding: '18px 20px', borderRadius: '8px',
      background: 'var(--bg)',
      border: `1px solid ${isErr ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
      borderLeft: `4px solid ${isErr ? 'var(--red)' : 'var(--green)'}`,
    }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
        {isErr ? 'Error' : 'Result'}
      </div>
      {isErr ? (
        <div style={{ color: 'var(--red)', fontSize: '15px' }}>{result.errorMessage || 'An error occurred'}</div>
      ) : result.resultString != null ? (
        <div style={{ fontSize: '28px', fontWeight: 700, color: result.resultString === 'true' ? 'var(--green)' : 'var(--red)' }}>
          {result.resultString === 'true' ? '✓ Equal' : '✗ Not Equal'}
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', fontWeight: 400 }}>
            {result.thisValue} {result.thisUnit} {result.resultString === 'true' ? '=' : '≠'} {result.thatValue} {result.thatUnit}
          </div>
        </div>
      ) : (
        <div>
          <span style={{ fontSize: '30px', fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--mono)' }}>
            {result.resultValue != null ? parseFloat(Number(result.resultValue).toPrecision(8)) : '—'}
          </span>
          {result.resultUnit && (
            <span style={{ marginLeft: '8px', fontSize: '16px', color: 'var(--accent2)', fontWeight: 500 }}>{result.resultUnit}</span>
          )}
          {result.thisValue != null && (
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              {result.thisValue} {result.thisUnit} → {result.resultValue != null ? parseFloat(Number(result.resultValue).toPrecision(8)) : '—'} {result.resultUnit}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Divider({ symbol }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <div style={{
        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
        background: 'var(--surface2)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '16px', fontWeight: 700, color: 'var(--accent)',
      }}>{symbol}</div>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}
