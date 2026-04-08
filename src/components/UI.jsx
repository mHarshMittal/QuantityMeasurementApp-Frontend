import React from 'react'

/* BUTTON  */
export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', border: 'none', cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 500, transition: 'all 0.18s',
    borderRadius: 'var(--radius-sm)', opacity: props.disabled || loading ? 0.6 : 1,
  }
  const sizes = {
    sm: { padding: '7px 14px', fontSize: '13px' },
    md: { padding: '11px 20px', fontSize: '14px' },
    lg: { padding: '14px 28px', fontSize: '15px', width: '100%' },
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff' },
    secondary: { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' },
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)' },
    danger: { background: 'var(--red-dim)', color: 'var(--red)', border: '1px solid rgba(248,81,73,0.3)' },
    success: { background: 'var(--green-dim)', color: 'var(--green)', border: '1px solid rgba(63,185,80,0.3)' },
  }

  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      className={className}
      disabled={loading || props.disabled}
      onMouseEnter={e => {
        if (!loading && !props.disabled) {
          if (variant === 'primary') e.currentTarget.style.background = 'var(--accent-hover)'
          else e.currentTarget.style.opacity = '0.85'
        }
      }}
      onMouseLeave={e => {
        if (variant === 'primary') e.currentTarget.style.background = 'var(--accent)'
        else e.currentTarget.style.opacity = props.disabled || loading ? '0.6' : '1'
      }}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  )
}

/* INPUT  */
export function Input({ label, error, className = '', style = {}, ...props }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--bg)', border: `1px solid ${focused ? 'var(--accent)' : error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
          fontFamily: props.type === 'number' ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: '14px', outline: 'none', transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}

/* SELECT  */
export function Select({ label, options = [], error, style = {}, ...props }) {
  const [focused, setFocused] = React.useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
          {label}
        </label>
      )}
      <select
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--bg)', border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)', color: 'var(--text)',
          fontFamily: 'var(--font-sans)', fontSize: '14px', outline: 'none',
          cursor: 'pointer', transition: 'border-color 0.15s', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238b949e' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '36px',
          ...style,
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
        ))}
      </select>
      {error && <span style={{ fontSize: '12px', color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}

/*  CARD  */
export function Card({ children, style = {}, className = '', padding = '24px' }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding, ...style,
      }}
    >
      {children}
    </div>
  )
}

/*  BADGE  */
export function Badge({ op, error }) {
  const colors = {
    CONVERT:  { color: '#58a6ff', bg: 'rgba(88,166,255,0.15)' },
    COMPARE:  { color: '#3fb950', bg: 'rgba(63,185,80,0.15)' },
    ADD:      { color: '#f0883e', bg: 'rgba(240,136,62,0.15)' },
    SUBTRACT: { color: '#d2a8ff', bg: 'rgba(210,168,255,0.15)' },
    MULTIPLY: { color: '#ffa657', bg: 'rgba(255,166,87,0.15)' },
    DIVIDE:   { color: '#f85149', bg: 'rgba(248,81,73,0.15)' },
    ERROR:    { color: '#f85149', bg: 'rgba(248,81,73,0.10)' },
  }
  const key = error ? 'ERROR' : op
  const c = colors[key] || { color: 'var(--text-muted)', bg: 'var(--surface2)' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
      borderRadius: '20px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.4px',
      color: c.color, background: c.bg,
    }}>
      {error ? 'ERROR' : op}
    </span>
  )
}

/*  SPINNER */
export function Spinner({ size = 20, color = 'var(--accent)' }) {
  return (
    <span style={{
      width: size, height: size, minWidth: size,
      border: `2px solid rgba(255,255,255,0.12)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.75s linear infinite',
    }} />
  )
}

/*  ALERT */
export function Alert({ type = 'error', children }) {
  const styles = {
    error:   { color: 'var(--red)',   bg: 'var(--red-dim)',   border: 'rgba(248,81,73,0.3)' },
    success: { color: 'var(--green)', bg: 'var(--green-dim)', border: 'rgba(63,185,80,0.3)' },
    info:    { color: 'var(--blue)',  bg: 'var(--blue-dim)',  border: 'rgba(88,166,255,0.3)' },
  }
  const s = styles[type]
  return (
    <div style={{
      padding: '11px 14px', borderRadius: 'var(--radius-sm)',
      fontSize: '13px', color: s.color,
      background: s.bg, border: `1px solid ${s.border}`,
    }}>
      {children}
    </div>
  )
}

/*  RESULT BOX  */
export function ResultBox({ result }) {
  if (!result) return null
  const isError = result.error

  return (
    <div className="animate-fadeIn" style={{
      background: 'var(--bg)', border: `1px solid ${isError ? 'rgba(248,81,73,0.3)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)', padding: '20px 24px', marginTop: '20px',
      borderLeft: `3px solid ${isError ? 'var(--red)' : 'var(--green)'}`,
    }}>
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.6px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
        {isError ? '⚠ Error' : '✓ Result'}
      </div>
      {isError ? (
        <div style={{ color: 'var(--red)', fontSize: '15px' }}>{result.errorMessage || 'An error occurred'}</div>
      ) : result.resultString !== null && result.resultString !== undefined ? (
        <>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '32px', fontWeight: 600,
            color: result.resultString === 'true' ? 'var(--green)' : 'var(--red)',
          }}>
            {result.resultString === 'true' ? '✓ Equal' : '✗ Not Equal'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
            {result.thisValue} {result.thisUnit} {result.resultString === 'true' ? '=' : '≠'} {result.thatValue} {result.thatUnit}
          </div>
        </>
      ) : (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '36px', fontWeight: 600, color: 'var(--green)' }}>
            {result.resultValue !== null && result.resultValue !== undefined
              ? parseFloat(Number(result.resultValue).toPrecision(8)).toString()
              : '—'}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
            {result.resultUnit && <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', marginRight: '6px' }}>{result.resultUnit}</span>}
            {result.thisValue !== null && result.thisValue !== undefined && (
              <span>{result.thisValue} {result.thisUnit}</span>
            )}
            {result.thatValue !== null && result.thatValue !== undefined && (
              <span> → {result.resultValue !== null ? parseFloat(Number(result.resultValue).toPrecision(8)) : '—'} {result.resultUnit}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* PAGE HEADER */
export function PageHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', letterSpacing: '-0.5px', marginBottom: '6px' }}>
        {title}
      </h1>
      {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>}
    </div>
  )
}

/*  SECTION LABEL  */
export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px',
      textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px',
    }}>
      {children}
    </div>
  )
}

/*  DIVIDER WITH SYMBOL  */
export function OpDivider({ symbol }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <div style={{
        fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--accent)',
        width: '44px', height: '44px', borderRadius: '50%',
        background: 'var(--accent-dim)', border: '1px solid rgba(240,136,62,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {symbol}
      </div>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}

/*  QUANTITY ROW (value + unit selects)  */
export function QuantityRow({ valueId, label, types, units, type, onTypeChange, unit, onUnitChange, value, onValueChange }) {
  return (
    <div>
      {label && <SectionLabel>{label}</SectionLabel>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <Input
          label="Value"
          type="number"
          placeholder="0"
          value={value}
          onChange={e => onValueChange(e.target.value)}
        />
        <Select
          label="Type"
          options={types.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))}
          value={type}
          onChange={e => onTypeChange(e.target.value)}
        />
        <Select
          label="Unit"
          options={units}
          value={unit}
          onChange={e => onUnitChange(e.target.value)}
        />
      </div>
    </div>
  )
}
