import { useMemo } from 'react'
import { useState } from 'react'
import { Info, TrendingUp } from 'lucide-react'
import { CUT_GRADES, COLOR_GRADES, CLARITY_GRADES, PRICING_GUIDE, VALUE_FACTORS } from '../data/diamonds'

const CUT_MULT:     Record<string, number> = { Ideal: 1.30, Excellent: 1.20, 'Very Good': 1.00, Good: 0.85, Fair: 0.70, Poor: 0.55 }
const COLOR_MULT:   Record<string, number> = { D: 1.50, E: 1.35, F: 1.20, G: 1.10, H: 1.00, I: 0.90, J: 0.80, K: 0.70, L: 0.60, M: 0.50 }
const CLARITY_MULT: Record<string, number> = { FL: 1.60, IF: 1.50, VVS1: 1.35, VVS2: 1.25, VS1: 1.15, VS2: 1.05, SI1: 0.90, SI2: 0.78, I1: 0.60, I2: 0.45, I3: 0.35 }
const SHAPE_MULT:   Record<string, number> = { Round: 1.10, Princess: 1.00, Oval: 1.05, Emerald: 0.95, Pear: 1.02, Cushion: 1.00, Heart: 1.03, Marquise: 0.98, Asscher: 0.97, Radiant: 1.00 }
const BASE_PPC = 4500

function calcValue(carats: number, cut: string, color: string, clarity: string, shape: string) {
  const cm  = CUT_MULT[cut]       ?? 1.0
  const clm = COLOR_MULT[color]   ?? 1.0
  const crm = CLARITY_MULT[clarity] ?? 1.0
  const shm = SHAPE_MULT[shape]   ?? 1.0
  const magic = carats >= 2 ? 1.40 : carats >= 1.5 ? 1.25 : carats >= 1 ? 1.15 : carats >= 0.5 ? 1.05 : 1.0
  const ppc = BASE_PPC * cm * clm * crm * shm * magic
  const total = ppc * carats
  return { ppc: Math.round(ppc), total: Math.round(total), low: Math.round(total * 0.85), high: Math.round(total * 1.25) }
}

const CURRENCIES = [
  { code: 'USD', sym: '$',  rate: 1 },
  { code: 'INR', sym: '₹',  rate: 83.5 },
  { code: 'EUR', sym: '€',  rate: 0.92 },
  { code: 'GBP', sym: '£',  rate: 0.79 },
  { code: 'AED', sym: 'د.إ',rate: 3.67 },
]
const SHAPES = ['Round', 'Princess', 'Oval', 'Emerald', 'Pear', 'Cushion', 'Heart', 'Marquise', 'Asscher', 'Radiant']
const PRESET_CARATS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0]

export default function ValuationPage() {
  const [carats, setCarats]     = useState(1.0)
  const [cut, setCut]           = useState('Excellent')
  const [color, setColor]       = useState('G')
  const [clarity, setClarity]   = useState('VS1')
  const [shape, setShape]       = useState('Round')
  const [currency, setCurrency] = useState('USD')

  const cur = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0]
  const val = useMemo(() => calcValue(carats, cut, color, clarity, shape), [carats, cut, color, clarity, shape])
  const fmt = (n: number) => Math.round(n * cur.rate).toLocaleString()

  const overallGrade = () => {
    const ci = CUT_GRADES.indexOf(cut)
    const li = COLOR_GRADES.indexOf(color)
    const oi = CLARITY_GRADES.indexOf(clarity)
    const avg = (ci / (CUT_GRADES.length - 1) + li / (COLOR_GRADES.length - 1) + oi / (CLARITY_GRADES.length - 1)) / 3
    if (avg < 0.20) return { label: 'Investment Grade', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' }
    if (avg < 0.40) return { label: 'Premium Quality',  color: '#2563eb', bg: '#dbeafe', border: '#93c5fd' }
    if (avg < 0.60) return { label: 'Commercial Grade', color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd' }
    return { label: 'Value Grade', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' }
  }
  const grade = overallGrade()

  const SelBtn = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button onClick={onClick} style={{
      padding: '7px 10px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
      border: active ? 'none' : '1.5px solid #e5e7eb',
      background: active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#fff',
      color: active ? '#fff' : '#4b5563',
      boxShadow: active ? '0 4px 12px rgba(79,70,229,.3)' : 'none',
      transition: 'all .15s',
    }}>
      {label}
    </button>
  )

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Calculator</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>Diamond Valuation</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Enter the 4Cs to calculate accurate market value</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 24, alignItems: 'start' }} className="val-grid">
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Carat */}
            <div className="card-flat" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>⚖️ Carat Weight</label>
                <span style={{ fontSize: 22, fontWeight: 900, color: '#4f46e5' }}>{carats.toFixed(2)} ct</span>
              </div>
              <input type="range" min={0.1} max={10} step={0.01} value={carats}
                onChange={e => setCarats(+e.target.value)}
                style={{ width: '100%', accentColor: '#4f46e5', cursor: 'pointer', marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PRESET_CARATS.map(v => (
                  <button key={v} onClick={() => setCarats(v)} style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: '1.5px solid', borderColor: carats === v ? '#4f46e5' : '#e5e7eb',
                    background: carats === v ? '#ede9fe' : '#fff', color: carats === v ? '#4f46e5' : '#6b7280',
                  }}>
                    {v}ct
                  </button>
                ))}
              </div>
            </div>

            {/* Cut */}
            <div className="card-flat" style={{ padding: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', display: 'block', marginBottom: 10 }}>✂️ Cut Grade</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {CUT_GRADES.map(g => <SelBtn key={g} label={g} active={cut === g} onClick={() => setCut(g)} />)}
              </div>
            </div>

            {/* Color */}
            <div className="card-flat" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>🎨 Color Grade</label>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>D = colorless &nbsp;·&nbsp; M = tinted</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                {COLOR_GRADES.map(g => <SelBtn key={g} label={g} active={color === g} onClick={() => setColor(g)} />)}
              </div>
            </div>

            {/* Clarity */}
            <div className="card-flat" style={{ padding: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', display: 'block', marginBottom: 10 }}>🔍 Clarity Grade</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                {CLARITY_GRADES.map(g => (
                  <button key={g} onClick={() => setClarity(g)} style={{
                    padding: '7px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    border: clarity === g ? 'none' : '1.5px solid #e5e7eb',
                    background: clarity === g ? 'linear-gradient(135deg,#059669,#0d9488)' : '#fff',
                    color: clarity === g ? '#fff' : '#4b5563',
                    transition: 'all .15s',
                  }}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape + Currency */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="card-flat" style={{ padding: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', display: 'block', marginBottom: 8 }}>💎 Shape</label>
                <select value={shape} onChange={e => setShape(e.target.value)} className="input" style={{ fontSize: 13 }}>
                  {SHAPES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="card-flat" style={{ padding: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', display: 'block', marginBottom: 8 }}>💱 Currency</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {CURRENCIES.map(c => (
                    <button key={c.code} onClick={() => setCurrency(c.code)} style={{
                      padding: '5px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                      border: currency === c.code ? 'none' : '1.5px solid #e5e7eb',
                      background: currency === c.code ? '#ede9fe' : '#fff',
                      color: currency === c.code ? '#4f46e5' : '#4b5563',
                    }}>
                      {c.sym} {c.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Main value card */}
            <div style={{ background: 'linear-gradient(160deg,#1a1a4e,#4f46e5)', borderRadius: 20, padding: '28px 28px 24px', color: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 12, opacity: .7, fontWeight: 500, marginBottom: 6 }}>Estimated Market Value</p>
                  <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1 }}>
                    {cur.sym}{fmt(val.total)}
                  </div>
                  <p style={{ fontSize: 13, opacity: .65, marginTop: 8 }}>
                    Range: {cur.sym}{fmt(val.low)} - {cur.sym}{fmt(val.high)}
                  </p>
                </div>
                <div style={{ background: grade.bg, border: `1px solid ${grade.border}`, color: grade.color, padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  {grade.label}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { l: 'Price / Carat', v: `${cur.sym}${fmt(val.ppc)}` },
                  { l: 'Base (USD)',    v: `$${val.total.toLocaleString()}` },
                  { l: 'Shape Bonus',  v: `${((SHAPE_MULT[shape] ?? 1) - 1) * 100 >= 0 ? '+' : ''}${(((SHAPE_MULT[shape] ?? 1) - 1) * 100).toFixed(0)}%` },
                ].map(item => (
                  <div key={item.l} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{item.v}</div>
                    <div style={{ fontSize: 11, opacity: .65, marginTop: 2 }}>{item.l}</div>
                  </div>
                ))}
              </div>

              {/* Factor bars */}
              {[
                { l: `Cut: ${cut}`,       mult: CUT_MULT[cut] ?? 1,       max: 1.30, color: '#a5b4fc' },
                { l: `Color: ${color}`,   mult: COLOR_MULT[color] ?? 1,   max: 1.50, color: '#c4b5fd' },
                { l: `Clarity: ${clarity}`,mult: CLARITY_MULT[clarity] ?? 1,max: 1.60,color: '#6ee7b7' },
              ].map(f => (
                <div key={f.l} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: .8, marginBottom: 4 }}>
                    <span>{f.l}</span>
                    <span>{(f.mult * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,.15)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(f.mult / f.max) * 100}%`, background: f.color, borderRadius: 999, transition: 'width .6s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Value factors */}
            <div className="card-flat" style={{ padding: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={16} color="#4f46e5" /> Value Components
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {VALUE_FACTORS.map(f => (
                  <div key={f.factor} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#f9fafb', borderRadius: 10, padding: '12px 14px' }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{f.factor}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{f.weight}%</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price table */}
            <div className="card-flat" style={{ padding: 20, overflowX: 'auto' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={15} color="#6b7280" /> Market Price Reference (USD, Round Brilliant)
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '6px 8px', color: '#9ca3af', fontWeight: 600, fontSize: 11 }}>Carats</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: '#059669', fontWeight: 600, fontSize: 11 }}>D / VS1</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: '#2563eb', fontWeight: 600, fontSize: 11 }}>G / VS2</th>
                    <th style={{ textAlign: 'right', padding: '6px 8px', color: '#7c3aed', fontWeight: 600, fontSize: 11 }}>J / SI1</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_GUIDE.map((row, i) => (
                    <tr key={row.carats} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 ? '#faf8ff' : '#fff' }}>
                      <td style={{ padding: '8px 8px', fontWeight: 600, color: '#374151' }}>{row.carats}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'right', color: '#059669' }}>{row.dVs1}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'right', color: '#2563eb' }}>{row.gVs2}</td>
                      <td style={{ padding: '8px 8px', textAlign: 'right', color: '#7c3aed' }}>{row.jSi1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .val-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
