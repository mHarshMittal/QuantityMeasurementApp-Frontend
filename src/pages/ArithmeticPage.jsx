import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { ARITHMETIC_TYPES, UNITS_BY_TYPE } from '../constants'
import { Button, Card, Select, Input, ResultBox, PageHeader, OpDivider } from '../components/UI'

const OPS = [
  { key: 'ADD',      icon: '+', label: 'Add',      symbol: '+', color: '#f0883e', hint: 'Adds two quantities, result in first unit.' },
  { key: 'SUBTRACT', icon: '−', label: 'Subtract', symbol: '−', color: '#d2a8ff', hint: 'Subtracts second from first, result in first unit.' },
  { key: 'MULTIPLY', icon: '×', label: 'Multiply', symbol: '×', color: '#ffa657', hint: 'Scales the first quantity by a numeric multiplier.' },
  { key: 'DIVIDE',   icon: '÷', label: 'Divide',   symbol: '÷', color: '#f85149', hint: 'Returns the dimensionless ratio of the two quantities.' },
]

export default function ArithmeticPage() {
  const { user } = useAuth()
  const location  = useLocation()

  const [activeOp, setActiveOp]   = useState(location.state?.op || 'ADD')
  const [measType, setMeasType]   = useState('LENGTH')
  const [q1, setQ1]               = useState({ value: '', unit: 'FEET' })
  const [q2, setQ2]               = useState({ value: '', unit: 'INCHES' })
  const [scalar, setScalar]       = useState('')
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)

  const op = OPS.find(o => o.key === activeOp) || OPS[0]
  const isMultiply = activeOp === 'MULTIPLY'
  const unitOptions = UNITS_BY_TYPE[measType].map(u => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))
  const typeOptions = ARITHMETIC_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))

  useEffect(() => {
    const units = UNITS_BY_TYPE[measType]
    setQ1(q => ({ ...q, unit: units[0] }))
    setQ2(q => ({ ...q, unit: units[1] || units[0] }))
    setResult(null)
  }, [measType])

  useEffect(() => { setResult(null) }, [activeOp])

  const handleCalculate = async () => {
    const v1 = parseFloat(q1.value)
    const v2 = isMultiply ? parseFloat(scalar) : parseFloat(q2.value)

    if (isNaN(v1)) { toast.error('Enter a valid number for the first quantity'); return }
    if (isNaN(v2)) { toast.error(isMultiply ? 'Enter a valid scalar multiplier' : 'Enter a valid number for the second quantity'); return }

    setLoading(true); setResult(null)
    try {
      const thisQ = { value: v1, unit: q1.unit, measurementType: measType }
      const thatQ = isMultiply
        ? { value: v2, unit: q1.unit, measurementType: measType }
        : { value: v2, unit: q2.unit, measurementType: measType }

      const apiFn = {
        ADD:      quantityApi.add,
        SUBTRACT: quantityApi.subtract,
        MULTIPLY: quantityApi.multiply,
        DIVIDE:   quantityApi.divide,
      }[activeOp]

      const res = await apiFn(user.id, thisQ, thatQ)
      setResult(res)
      if (!res.error) toast.success('Calculated!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="± Arithmetic"
        subtitle="Perform mathematical operations on physical quantities"
      />

      {/* Op selector tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '6px', width: 'fit-content',
      }}>
        {OPS.map(o => (
          <button
            key={o.key}
            onClick={() => setActiveOp(o.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px', borderRadius: 'var(--radius-sm)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500,
              background: activeOp === o.key ? o.color + '22' : 'transparent',
              color: activeOp === o.key ? o.color : 'var(--text-muted)',
              boxShadow: activeOp === o.key ? `inset 0 0 0 1px ${o.color}55` : 'none',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '16px' }}>{o.icon}</span>
            {o.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '640px' }}>
        <Card>
          {/* Measurement type */}
          <Select
            label="Measurement Type"
            options={typeOptions}
            value={measType}
            onChange={e => setMeasType(e.target.value)}
          />

          <div style={{ height: '20px' }} />

          {/* First quantity */}
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px' }}>
            First Quantity
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Value"
              type="number"
              placeholder="0"
              value={q1.value}
              onChange={e => { setQ1(q => ({ ...q, value: e.target.value })); setResult(null) }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
            />
            <Select
              label="Unit"
              options={unitOptions}
              value={q1.unit}
              onChange={e => { setQ1(q => ({ ...q, unit: e.target.value })); setResult(null) }}
            />
          </div>

          {/* Operator divider */}
          <OpDivider symbol={op.symbol} />

          {/* Second input */}
          {isMultiply ? (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Scalar Multiplier
              </div>
              <Input
                label="Multiplier Value"
                type="number"
                placeholder="e.g. 3.5"
                value={scalar}
                onChange={e => { setScalar(e.target.value); setResult(null) }}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
              />
            </>
          ) : (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Second Quantity
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input
                  label="Value"
                  type="number"
                  placeholder="0"
                  value={q2.value}
                  onChange={e => { setQ2(q => ({ ...q, value: e.target.value })); setResult(null) }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
                />
                <Select
                  label="Unit"
                  options={unitOptions}
                  value={q2.unit}
                  onChange={e => { setQ2(q => ({ ...q, unit: e.target.value })); setResult(null) }}
                />
              </div>
            </>
          )}

          {/* Result */}
          <ResultBox result={result} />

          {/* Submit */}
          <div style={{ marginTop: '24px' }}>
            <Button size="lg" loading={loading} onClick={handleCalculate}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{op.icon}</span> Calculate
            </Button>
          </div>
        </Card>

        {/* Hint */}
        <Card style={{ marginTop: '16px', padding: '14px 20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <span style={{ color: op.color, fontWeight: 600 }}>ℹ {op.label}:</span>{' '}
            {op.hint}
          </div>
        </Card>
      </div>
    </div>
  )
}
