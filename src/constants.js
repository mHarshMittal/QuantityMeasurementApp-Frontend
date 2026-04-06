export const MEASUREMENT_TYPES = ['LENGTH', 'WEIGHT', 'VOLUME', 'TEMPERATURE']

export const UNITS_BY_TYPE = {
  LENGTH:      ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
  WEIGHT:      ['KILOGRAM', 'GRAM', 'POUND'],
  VOLUME:      ['LITRE', 'MILLILITRE', 'GALLON'],
  TEMPERATURE: ['CELSIUS', 'FAHRENHEIT'],
}

// Temperature doesn't support arithmetic
export const ARITHMETIC_TYPES = MEASUREMENT_TYPES.filter(t => t !== 'TEMPERATURE')

export const OPERATIONS = ['CONVERT', 'COMPARE', 'ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']

export const OP_META = {
  CONVERT:  { icon: '⇄', label: 'Convert',  color: '#58a6ff', bg: 'rgba(88,166,255,0.12)' },
  COMPARE:  { icon: '⚖', label: 'Compare',  color: '#3fb950', bg: 'rgba(63,185,80,0.12)' },
  ADD:      { icon: '+', label: 'Add',       color: '#f0883e', bg: 'rgba(240,136,62,0.12)' },
  SUBTRACT: { icon: '−', label: 'Subtract',  color: '#d2a8ff', bg: 'rgba(210,168,255,0.12)' },
  MULTIPLY: { icon: '×', label: 'Multiply',  color: '#ffa657', bg: 'rgba(255,166,87,0.12)' },
  DIVIDE:   { icon: '÷', label: 'Divide',    color: '#f85149', bg: 'rgba(248,81,73,0.12)' },
}

export const formatValue = (v) => {
  if (v === null || v === undefined) return '—'
  const n = Number(v)
  if (isNaN(n)) return String(v)
  if (Number.isInteger(n)) return n.toLocaleString()
  // up to 6 sig figs, strip trailing zeros
  return parseFloat(n.toPrecision(6)).toString()
}

export const formatDate = (dt) => {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
