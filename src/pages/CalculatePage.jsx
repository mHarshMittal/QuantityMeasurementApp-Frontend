import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { quantityApi } from '../api/quantities'
import { MEASUREMENT_TYPES, ARITHMETIC_TYPES, UNITS_BY_TYPE } from '../constants'
import { Button, Card, Select, Input, ResultBox, PageHeader, Divider } from '../components/UI'

const TABS = [
  { key: 'CONVERT',  label: 'Convert'  },
  { key: 'COMPARE',  label: 'Compare'  },
  { key: 'ADD',      label: 'Add'      },
  { key: 'SUBTRACT', label: 'Subtract' },
  { key: 'MULTIPLY', label: 'Multiply' },
  { key: 'DIVIDE',   label: 'Divide'   },
]

export default function CalculatePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('CONVERT')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // shared state
  const [measType, setMeasType] = useState('LENGTH')
  const [v1, setV1] = useState('')
  const [u1, setU1] = useState('FEET')
  const [v2, setV2] = useState('')
  const [u2, setU2] = useState('INCHES')
  const [toUnit, setToUnit] = useState('INCHES') // for convert
  const [scalar, setScalar] = useState('')       // for multiply

  const isArith = ['ADD','SUBTRACT','MULTIPLY','DIVIDE'].includes(tab)
  const typeList = isArith ? ARITHMETIC_TYPES : MEASUREMENT_TYPES
  const unitList = (UNITS_BY_TYPE[measType] || []).map(u => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))
  const typeOpts = typeList.map(t => ({ value: t, label: t.charAt(0) + t.slice(1).toLowerCase() }))

  useEffect(() => {
    const u = UNITS_BY_TYPE[measType] || []
    setU1(u[0] || ''); setU2(u[1] || u[0] || ''); setToUnit(u[1] || u[0] || '')
    setResult(null)
  }, [measType])

  useEffect(() => {
    setResult(null)
    // Reset measType if switching to arithmetic and TEMPERATURE is selected
    if (isArith && measType === 'TEMPERATURE') setMeasType('LENGTH')
  }, [tab])

  const go = async () => {
    const n1 = parseFloat(v1)
    const n2 = tab === 'MULTIPLY' ? parseFloat(scalar) : parseFloat(v2)

    if (isNaN(n1)) { toast.error('Enter a valid first value'); return }
    if (tab !== 'CONVERT' && isNaN(n2)) { toast.error(tab === 'MULTIPLY' ? 'Enter a valid multiplier' : 'Enter a valid second value'); return }

    setLoading(true); setResult(null)
    try {
      const thisQ = { value: n1, unit: u1, measurementType: measType }
      let res
      if (tab === 'CONVERT') {
        res = await quantityApi.convert(user.id, thisQ, { value: 0, unit: toUnit, measurementType: measType })
      } else if (tab === 'COMPARE') {
        res = await quantityApi.compare(user.id, thisQ, { value: n2, unit: u2, measurementType: measType })
      } else if (tab === 'ADD') {
        res = await quantityApi.add(user.id, thisQ, { value: n2, unit: u2, measurementType: measType })
      } else if (tab === 'SUBTRACT') {
        res = await quantityApi.subtract(user.id, thisQ, { value: n2, unit: u2, measurementType: measType })
      } else if (tab === 'MULTIPLY') {
        res = await quantityApi.multiply(user.id, thisQ, { value: n2, unit: u1, measurementType: measType })
      } else if (tab === 'DIVIDE') {
        res = await quantityApi.divide(user.id, thisQ, { value: n2, unit: u2, measurementType: measType })
      }
      setResult(res)
      if (res && !res.error) toast.success('Done!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = (fn) => (...args) => { fn(...args); setResult(null) }

  return (
    <div className="fade-in">
      <PageHeader title="Calculate" subtitle="Convert, compare and perform arithmetic on physical quantities" />

      {/* Tab row */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', flexWrap: 'wrap', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '5px', width: 'fit-content' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '7px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
            background: tab === t.key ? 'rgba(108,99,255,0.2)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--muted)',
            fontWeight: tab === t.key ? 600 : 400, fontSize: '13px', transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: '560px' }}>
        <Card>
          <Select label="Measurement Type" options={typeOpts} value={measType} onChange={e => setMeasType(e.target.value)} />
          <div style={{ height: '16px' }} />

          {/* First quantity */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>
            {tab === 'CONVERT' ? 'From' : 'First Quantity'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <Input label="Value" type="number" placeholder="0" value={v1} onChange={e => reset(setV1)(e.target.value)} />
            <Select label="Unit" options={unitList} value={u1} onChange={e => reset(setU1)(e.target.value)} />
          </div>

          <Divider symbol={tab === 'CONVERT' ? '⇄' : tab === 'COMPARE' ? '=?' : tab === 'ADD' ? '+' : tab === 'SUBTRACT' ? '−' : tab === 'MULTIPLY' ? '×' : '÷'} />

          {/* Second input */}
          {tab === 'CONVERT' ? (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>To</div>
              <Select label="Target Unit" options={unitList} value={toUnit} onChange={e => reset(setToUnit)(e.target.value)} />
            </>
          ) : tab === 'MULTIPLY' ? (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Scalar Multiplier</div>
              <Input label="Multiplier" type="number" placeholder="e.g. 3.5" value={scalar} onChange={e => reset(setScalar)(e.target.value)} />
            </>
          ) : (
            <>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Second Quantity</div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <Input label="Value" type="number" placeholder="0" value={v2} onChange={e => reset(setV2)(e.target.value)} />
                <Select label="Unit" options={unitList} value={u2} onChange={e => reset(setU2)(e.target.value)} />
              </div>
            </>
          )}

          <ResultBox result={result} />

          <div style={{ marginTop: '20px' }}>
            <Button size="lg" loading={loading} onClick={go}>{TABS.find(t=>t.key===tab)?.label}</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
