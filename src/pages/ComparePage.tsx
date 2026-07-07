import { useState, useMemo } from 'react'
import { DIAMONDS, CUT_GRADES, COLOR_GRADES, CLARITY_GRADES, type Diamond } from '../data/diamonds'

// Lower index = better grade
function gradeWinner(a: string, b: string, grades: string[]): 'a' | 'b' | 'tie' {
  const ai = grades.indexOf(a)
  const bi = grades.indexOf(b)
  if (ai === -1 || bi === -1) return 'tie'
  if (ai < bi) return 'a'
  if (bi < ai) return 'b'
  return 'tie'
}

function numWinner(a: number, b: number): 'a' | 'b' | 'tie' {
  if (a > b) return 'a'
  if (b > a) return 'b'
  return 'tie'
}

const WIN = '#10b981', LOSE = '#f87171', TIE = '#9ca3af'

function winColor(w: 'a' | 'b' | 'tie', side: 'a' | 'b') {
  if (w === 'tie') return TIE
  return w === side ? WIN : LOSE
}
function winBg(w: 'a' | 'b' | 'tie', side: 'a' | 'b') {
  if (w === 'tie') return '#f9fafb'
  return w === side ? '#f0fdf4' : '#fff5f5'
}

function DiamondSelector({ value, onChange, exclude }: { value: Diamond | null; onChange: (d: Diamond) => void; exclude: Diamond | null }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const options = useMemo(() => {
    const q = search.toLowerCase()
    return DIAMONDS.filter(d => d !== exclude && (
      !q || d.name.toLowerCase().includes(q) || d.shape.toLowerCase().includes(q) || d.color.toLowerCase().includes(q)
    ))
  }, [search, exclude])

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen(o => !o)} className="card" style={{ cursor: 'pointer', padding: 0, overflow: 'hidden', border: value ? '2px solid #4f46e5' : '2px dashed #d1d5db', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {value ? (
          <>
            <div style={{ width: '100%', height: 160, overflow: 'hidden', position: 'relative' }}>
              <img src={value.image} alt={value.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,transparent 50%,rgba(0,0,0,.4))' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, color: '#fff', fontWeight: 700, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>{value.name}</div>
            </div>
            <div style={{ padding: '12px 16px', width: '100%' }}>
              <div style={{ fontSize: 13, color: '#4b5563' }}>{value.carats}ct · {value.shape} · {value.cut} Cut</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#4f46e5', marginTop: 4 }}>${value.totalValue.toLocaleString()}</div>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>💎</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#6b7280' }}>Select a Diamond</p>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>Click to choose from gallery</p>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: '#4f46e5', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
          {value ? 'Change' : 'Select'}
        </div>
      </div>

      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,.15)', marginTop: 8, maxHeight: 340, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diamonds..." className="input" style={{ fontSize: 13 }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {options.map(d => (
              <div key={d.id} onClick={() => { onChange(d); setOpen(false); setSearch('') }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f9fafb', transition: 'background .1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f5f3ff')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <img src={d.image} alt={d.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{d.carats}ct · {d.cut} · {d.color}/{d.clarity}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>${d.totalValue.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  const [dA, setDA] = useState<Diamond | null>(null)
  const [dB, setDB] = useState<Diamond | null>(null)

  const rows = useMemo(() => {
    if (!dA || !dB) return []
    const cutW     = gradeWinner(dA.cut,     dB.cut,     CUT_GRADES)
    const colorW   = gradeWinner(dA.color,   dB.color,   COLOR_GRADES)
    const clarityW = gradeWinner(dA.clarity, dB.clarity, CLARITY_GRADES)
    const caratW   = numWinner(dA.carats, dB.carats)
    const valueW   = numWinner(dA.totalValue, dB.totalValue)
    const ppcW     = numWinner(dA.pricePerCarat, dB.pricePerCarat)

    type W = 'a' | 'b' | 'tie'
    return [
      { label: '⚖️ Carat Weight', a: `${dA.carats} ct`, b: `${dB.carats} ct`, winner: caratW as W, note: 'Larger carat = more weight/size' },
      { label: '✂️ Cut Grade',    a: dA.cut,   b: dB.cut,   winner: cutW as W,     note: 'Ideal cut maximises brilliance' },
      { label: '🎨 Color Grade',  a: dA.color, b: dB.color, winner: colorW as W,   note: 'D is colorless (best), M is tinted' },
      { label: '🔍 Clarity',      a: dA.clarity, b: dB.clarity, winner: clarityW as W, note: 'FL = flawless, I3 = heavily included' },
      { label: '🔷 Shape',        a: dA.shape, b: dB.shape, winner: 'tie' as W,    note: 'Shape preference is personal' },
      { label: '✨ Polish',        a: dA.polish, b: dB.polish, winner: gradeWinner(dA.polish, dB.polish, ['Excellent','Very Good','Good','Fair']) as W, note: 'Surface finish quality' },
      { label: '⟲ Symmetry',     a: dA.symmetry, b: dB.symmetry, winner: gradeWinner(dA.symmetry, dB.symmetry, ['Excellent','Very Good','Good','Fair']) as W, note: 'Facet alignment precision' },
      { label: '💰 Total Value',  a: `$${dA.totalValue.toLocaleString()}`,  b: `$${dB.totalValue.toLocaleString()}`,  winner: valueW as W, note: 'Estimated market value' },
      { label: '💲 Price / Carat', a: `$${dA.pricePerCarat.toLocaleString()}`, b: `$${dB.pricePerCarat.toLocaleString()}`, winner: ppcW as W, note: 'Value density' },
      { label: '🌍 Origin',       a: dA.origin, b: dB.origin, winner: 'tie' as W,  note: '' },
    ]
  }, [dA, dB])

  const scores = useMemo(() => {
    let aWins = 0, bWins = 0
    rows.forEach(r => { if (r.winner === 'a') aWins++; else if (r.winner === 'b') bWins++ })
    return { a: aWins, b: bWins }
  }, [rows])

  const recommendation = useMemo(() => {
    if (!dA || !dB || rows.length === 0) return null
    const diff = scores.a - scores.b
    if (diff > 2) return { winner: dA.name, reason: 'Better overall grade across Cut, Color, Clarity and proportions.' }
    if (diff < -2) return { winner: dB.name, reason: 'Better overall grade across Cut, Color, Clarity and proportions.' }
    // Value-based tiebreak
    if (dA.pricePerCarat < dB.pricePerCarat) return { winner: dA.name, reason: 'Better value per carat for similar quality grades.' }
    if (dB.pricePerCarat < dA.pricePerCarat) return { winner: dB.name, reason: 'Better value per carat for similar quality grades.' }
    return { winner: 'It\'s a tie!', reason: 'Both diamonds are very closely matched in quality and value.' }
  }, [dA, dB, rows, scores])

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Comparison Tool</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>Diamond Comparison</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Select two diamonds and compare them head-to-head across every quality metric</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        {/* Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 32 }}>
          <DiamondSelector value={dA} onChange={setDA} exclude={dB} />
          <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 900, color: '#d1d5db', padding: '0 8px' }}>VS</div>
          <DiamondSelector value={dB} onChange={setDB} exclude={dA} />
        </div>

        {/* Prompt when not both selected */}
        {(!dA || !dB) && (
          <div className="card-flat" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>⚖️</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 6 }}>Choose two diamonds to compare</p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>Click the cards above to select diamonds from the gallery</p>
          </div>
        )}

        {/* Comparison table */}
        {dA && dB && rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Score banner */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: 12, alignItems: 'center' }}>
              <div style={{ background: scores.a >= scores.b ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#fff', border: '2px solid', borderColor: scores.a >= scores.b ? '#4f46e5' : '#e5e7eb', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: scores.a >= scores.b ? '#fff' : '#374151' }}>{scores.a}</div>
                <div style={{ fontSize: 11, color: scores.a >= scores.b ? 'rgba(255,255,255,.75)' : '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Wins</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: scores.a >= scores.b ? '#fff' : '#4b5563', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dA.name}</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#9ca3af' }}>SCORE</div>
              <div style={{ background: scores.b > scores.a ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#fff', border: '2px solid', borderColor: scores.b > scores.a ? '#4f46e5' : '#e5e7eb', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: scores.b > scores.a ? '#fff' : '#374151' }}>{scores.b}</div>
                <div style={{ fontSize: 11, color: scores.b > scores.a ? 'rgba(255,255,255,.75)' : '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Wins</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: scores.b > scores.a ? '#fff' : '#4b5563', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dB.name}</div>
              </div>
            </div>

            {/* Row-by-row table */}
            <div className="card-flat" style={{ overflow: 'hidden', padding: 0 }}>
              {/* Table header */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', background: '#f5f3ff', padding: '10px 16px', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', textAlign: 'center' }}>{dA.name}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.07em' }}>Metric</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', textAlign: 'center' }}>{dB.name}</div>
              </div>
              {rows.map((row, i) => (
                <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', alignItems: 'center', borderBottom: i < rows.length-1 ? '1px solid #f3f4f6' : 'none' }}>
                  {/* A value */}
                  <div style={{ padding: '12px 16px', background: winBg(row.winner, 'a'), textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: winColor(row.winner, 'a') }}>{row.a}</div>
                    {row.winner === 'a' && <div style={{ fontSize: 10, color: WIN, fontWeight: 700, marginTop: 2 }}>✓ BETTER</div>}
                  </div>
                  {/* Label */}
                  <div style={{ padding: '12px 8px', textAlign: 'center', background: '#fafafa', borderLeft: '1px solid #f3f4f6', borderRight: '1px solid #f3f4f6' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>{row.label}</div>
                    {row.winner === 'tie' && <div style={{ fontSize: 10, color: TIE, marginTop: 1 }}>TIE</div>}
                    {row.note && <div style={{ fontSize: 9, color: '#d1d5db', marginTop: 2, whiteSpace: 'normal', lineHeight: 1.3 }}>{row.note}</div>}
                  </div>
                  {/* B value */}
                  <div style={{ padding: '12px 16px', background: winBg(row.winner, 'b'), textAlign: 'center' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: winColor(row.winner, 'b') }}>{row.b}</div>
                    {row.winner === 'b' && <div style={{ fontSize: 10, color: WIN, fontWeight: 700, marginTop: 2 }}>✓ BETTER</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            {recommendation && (
              <div style={{ background: 'linear-gradient(135deg,#1a1a4e,#312e81)', borderRadius: 16, padding: '20px 24px', color: '#fff' }}>
                <div style={{ fontSize: 11, opacity: .65, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>AI Recommendation</div>
                <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>💎 {recommendation.winner}</div>
                <p style={{ fontSize: 13, opacity: .8, lineHeight: 1.6 }}>{recommendation.reason}</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <span style={{ background: 'rgba(255,255,255,.15)', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999 }}>
                    {dA.name}: {scores.a} wins
                  </span>
                  <span style={{ background: 'rgba(255,255,255,.15)', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 999 }}>
                    {dB.name}: {scores.b} wins
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
