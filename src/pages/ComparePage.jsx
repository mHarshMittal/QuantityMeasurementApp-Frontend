import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { MEASUREMENT_TYPES, UNITS_BY_TYPE } from '../constants'
import { Button, Card, Select, Input, ResultBox, PageHeader, OpDivider } from '../components/UI'

function QuantityBlock({ label, measType, unit, value, onTypeChange, onUnitChange, onValueChange, disableType }) {
  const unitOptions = UNITS_BY_TYPE[measType].map(u => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))
  const typeOptions = MEASUREMENT_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))

  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {!disableType && (
          <Select
            label="Measurement Type"
            options={typeOptions}
            value={measType}
            onChange={e => onTypeChange(e.target.value)}
          />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Input
            label="Value"
            type="number"
            placeholder="0"
            value={value}
            onChange={e => onValueChange(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
          />
          <Select
            label="Unit"
            options={unitOptions}
            value={unit}
            onChange={e => onUnitChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const { user } = useAuth()

  const [measType, setMeasType] = useState('LENGTH')
  const [q1, setQ1] = useState({ value: '', unit: 'FEET' })
  const [q2, setQ2] = useState({ value: '', unit: 'INCHES' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const units = UNITS_BY_TYPE[measType]
    setQ1(q => ({ ...q, unit: units[0] }))
    setQ2(q => ({ ...q, unit: units[1] || units[0] }))
    setResult(null)
  }, [measType])

  const handleCompare = async () => {
    if (!q1.value || !q2.value || isNaN(parseFloat(q1.value)) || isNaN(parseFloat(q2.value))) {
      toast.error('Enter valid numbers for both quantities')
      return
    }
    setLoading(true); setResult(null)
    try {
      const res = await quantityApi.compare(
        user.id,
        { value: parseFloat(q1.value), unit: q1.unit, measurementType: measType },
        { value: parseFloat(q2.value), unit: q2.unit, measurementType: measType },
      )
      setResult(res)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="⚖ Compare Values"
        subtitle="Check whether two quantities of the same type are equivalent"
      />

      <div style={{ maxWidth: '640px' }}>
        <Card>
          {/* Type */}
          <Select
            label="Measurement Type"
            options={MEASUREMENT_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))}
            value={measType}
            onChange={e => setMeasType(e.target.value)}
          />

          <div style={{ height: '24px' }} />

          {/* First quantity */}
          <QuantityBlock
            label="First Quantity"
            measType={measType}
            unit={q1.unit}
            value={q1.value}
            onTypeChange={setMeasType}
            onUnitChange={u => { setQ1(q => ({ ...q, unit: u })); setResult(null) }}
            onValueChange={v => { setQ1(q => ({ ...q, value: v })); setResult(null) }}
            disableType
          />

          {/* Divider */}
          <OpDivider symbol="=?" />

          {/* Second quantity */}
          <QuantityBlock
            label="Second Quantity"
            measType={measType}
            unit={q2.unit}
            value={q2.value}
            onTypeChange={setMeasType}
            onUnitChange={u => { setQ2(q => ({ ...q, unit: u })); setResult(null) }}
            onValueChange={v => { setQ2(q => ({ ...q, value: v })); setResult(null) }}
            disableType
          />

          {/* Result */}
          <ResultBox result={result} />

          {/* Submit */}
          <div style={{ marginTop: '24px' }}>
            <Button size="lg" loading={loading} onClick={handleCompare}>
              ⚖ Compare
            </Button>
          </div>
        </Card>

        {/* Hint card */}
        <Card style={{ marginTop: '16px', padding: '16px 20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>How it works:</span> Both values
            are converted to their base unit internally, then compared for exact equality. For example,
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', margin: '0 4px' }}>1 FEET</span>
            equals
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', margin: '0 4px' }}>12 INCHES</span>
            because both reduce to 12 in the base unit (inches).
          </div>
        </Card>
      </div>
    </div>
  )
}
