import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { MEASUREMENT_TYPES, UNITS_BY_TYPE } from '../constants'
import { Button, Card, Select, Input, ResultBox, PageHeader, OpDivider } from '../components/UI'

export default function ConvertPage() {
  const { user } = useAuth()

  const [measType, setMeasType]   = useState('LENGTH')
  const [fromUnit, setFromUnit]   = useState('FEET')
  const [toUnit, setToUnit]       = useState('INCHES')
  const [value, setValue]         = useState('')
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)

  // Sync units when type changes
  useEffect(() => {
    const units = UNITS_BY_TYPE[measType]
    setFromUnit(units[0])
    setToUnit(units[1] || units[0])
    setResult(null)
  }, [measType])

  const unitOptions = UNITS_BY_TYPE[measType].map(u => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))
  const typeOptions = MEASUREMENT_TYPES.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setResult(null)
  }

  const handleConvert = async () => {
    if (!value || isNaN(parseFloat(value))) { toast.error('Enter a valid number'); return }
    setLoading(true); setResult(null)
    try {
      const res = await quantityApi.convert(
        user.id,
        { value: parseFloat(value), unit: fromUnit, measurementType: measType },
        { value: 0, unit: toUnit, measurementType: measType },
      )
      setResult(res)
      if (!res.error) toast.success('Converted successfully!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fadeUp">
      <PageHeader
        title="⇄ Convert Units"
        subtitle="Convert values between different units of the same measurement type"
      />

      <div style={{ maxWidth: '640px' }}>
        <Card>
          {/* Type selector */}
          <Select
            label="Measurement Type"
            options={typeOptions}
            value={measType}
            onChange={e => setMeasType(e.target.value)}
          />

          <div style={{ height: '20px' }} />

          {/* From */}
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
            From
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <Input
              label="Value"
              type="number"
              placeholder="Enter a number"
              value={value}
              onChange={e => { setValue(e.target.value); setResult(null) }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '18px' }}
            />
            <Select
              label="Unit"
              options={unitOptions}
              value={fromUnit}
              onChange={e => { setFromUnit(e.target.value); setResult(null) }}
            />
          </div>

          {/* Swap arrow divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <button
              onClick={handleSwap}
              title="Swap units"
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--surface2)', border: '1px solid var(--border)',
                color: 'var(--accent)', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              ↕
            </button>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          {/* To */}
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '10px' }}>
            To
          </div>
          <Select
            label="Target Unit"
            options={unitOptions}
            value={toUnit}
            onChange={e => { setToUnit(e.target.value); setResult(null) }}
          />

          {/* Result */}
          <ResultBox result={result} />

          {/* Submit */}
          <div style={{ marginTop: '24px' }}>
            <Button size="lg" loading={loading} onClick={handleConvert}>
              ⇄ Convert
            </Button>
          </div>
        </Card>

        {/* Info card */}
        <Card style={{ marginTop: '16px', padding: '16px 20px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {MEASUREMENT_TYPES.map(t => (
              <div
                key={t}
                onClick={() => setMeasType(t)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 500, transition: 'all 0.15s',
                  background: measType === t ? 'var(--accent-dim)' : 'var(--surface2)',
                  color: measType === t ? 'var(--accent)' : 'var(--text-muted)',
                  border: `1px solid ${measType === t ? 'rgba(240,136,62,0.3)' : 'var(--border)'}`,
                }}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
                <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '11px' }}>
                  {UNITS_BY_TYPE[t].length} units
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
