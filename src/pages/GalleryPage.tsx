import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { DIAMONDS, DIAMOND_CUTS, type Diamond } from '../data/diamonds'

const RARITY_BADGE: Record<string, string> = {
  'Common':    'badge-common',
  'Uncommon':  'badge-uncommon',
  'Rare':      'badge-rare',
  'Very Rare': 'badge-very-rare',
  'Legendary': 'badge-legendary',
}

function DiamondCard({ d, onClick }: { d: Diamond; onClick: () => void }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="card" onClick={onClick} style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: '#f3f0ff' }}>
        {!imgErr ? (
          <img
            src={d.image}
            alt={d.name}
            onError={() => setImgErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
            className="gallery-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#ede9fe,#dbeafe)', fontSize: 56 }}>
            💎
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,.35) 100%)' }} />
        <span className={`${RARITY_BADGE[d.rarity]}`} style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999 }}>
          {d.rarity}
        </span>
        <div style={{ position: 'absolute', bottom: 10, left: 12, color: '#fff', fontWeight: 700, fontSize: 15, textShadow: '0 1px 4px rgba(0,0,0,.5)' }}>
          {d.name}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[
            { l: 'Shape',   v: d.shape },
            { l: d.carats + ' ct', v: d.cut },
          ].map(item => (
            <div key={item.l} style={{ flex: 1, background: '#f5f3ff', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{item.l}</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>{item.v}</div>
            </div>
          ))}
          <div style={{ flex: 1, background: '#f0fdf4', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{d.color.length > 2 ? d.color.split(' ')[1] || d.color : d.color}</div>
            <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>Color</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e' }}>${d.totalValue.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>${d.pricePerCarat.toLocaleString()}/ct</div>
          </div>
          <div style={{ fontSize: 12, color: '#4b5563', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: '3px 8px', fontWeight: 500 }}>
            {d.clarity}
          </div>
        </div>
      </div>
    </div>
  )
}

function DiamondModal({ d, onClose }: { d: Diamond; onClose: () => void }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)' }} />
      <div className="animate-scale-in" onClick={e => e.stopPropagation()} style={{
        position: 'relative', background: '#fff', borderRadius: 20, maxWidth: 680, width: '100%',
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,.2)',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
          <X size={16} />
        </button>

        {/* Hero image */}
        <div style={{ height: 260, overflow: 'hidden', borderRadius: '20px 20px 0 0', background: '#f3f0ff' }}>
          {!imgErr ? (
            <img src={d.image} alt={d.name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>💎</div>
          )}
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <span className={RARITY_BADGE[d.rarity]} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginBottom: 8 }}>{d.rarity}</span>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>{d.name}</h2>
              <p style={{ fontSize: 14, color: '#6b7280' }}>{d.shape} · {d.cut} Cut · Origin: {d.origin}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#4f46e5' }}>${d.totalValue.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>${d.pricePerCarat.toLocaleString()}/carat</div>
            </div>
          </div>

          <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.7, marginBottom: 24, padding: '14px 16px', background: '#f9fafb', borderRadius: 10, borderLeft: '3px solid #4f46e5' }}>
            {d.description}
          </p>

          {/* Specs grid */}
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Grading Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
            {[
              { l: 'Carat',        v: `${d.carats} ct` },
              { l: 'Cut Grade',    v: d.cut },
              { l: 'Color',        v: d.color },
              { l: 'Clarity',      v: d.clarity },
              { l: 'Polish',       v: d.polish },
              { l: 'Symmetry',     v: d.symmetry },
              { l: 'Fluorescence', v: d.fluorescence },
              { l: 'Origin',       v: d.origin },
            ].map(item => (
              <div key={item.l} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{item.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{item.v}</div>
              </div>
            ))}
          </div>

          {/* Proportions */}
          {d.depth > 0 && (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Proportions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { l: 'Depth %', v: d.depth, color: '#4f46e5' },
                  { l: 'Table %', v: d.table, color: '#7c3aed' },
                ].map(item => (
                  <div key={item.l} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>{item.l}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.v}%</span>
                    </div>
                    <div style={{ height: 6, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(item.v, 100)}%`, background: item.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'value' | 'carats' | 'name'>('value')
  const [selected, setSelected] = useState<Diamond | null>(null)

  const filtered = useMemo(() => {
    let list = DIAMONDS
    if (category !== 'All') list = list.filter(d => d.category === category)
    if (search) list = list.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shape.toLowerCase().includes(search.toLowerCase()) ||
      d.color.toLowerCase().includes(search.toLowerCase())
    )
    return [...list].sort((a, b) =>
      sort === 'value'  ? b.totalValue - a.totalValue :
      sort === 'carats' ? b.carats - a.carats : a.name.localeCompare(b.name)
    )
  }, [search, category, sort])

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Collection</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>Diamond Gallery</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Browse {DIAMONDS.length} diamonds with full GIA specifications and market values</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        {/* Filters bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, shape, color..."
              className="input" style={{ paddingLeft: 36 }} />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as 'value' | 'carats' | 'name')}
            className="input" style={{ width: 'auto', flex: '0 0 auto' }}>
            <option value="value">Sort: Highest Value</option>
            <option value="carats">Sort: Most Carats</option>
            <option value="name">Sort: A-Z Name</option>
          </select>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {DIAMOND_CUTS.map(c => {
            const count = c === 'All' ? DIAMONDS.length : DIAMONDS.filter(d => d.category === c).length
            const active = category === c
            return (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: active ? '#4f46e5' : '#fff',
                color: active ? '#fff' : '#4b5563',
                boxShadow: active ? '0 4px 12px rgba(79,70,229,.3)' : '0 1px 4px rgba(0,0,0,.08)',
                transition: 'all .15s',
              }}>
                {c} <span style={{ opacity: .65, fontSize: 11 }}>({count})</span>
              </button>
            )
          })}
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
          Showing {filtered.length} diamonds
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {filtered.map(d => (
            <DiamondCard key={d.id} d={d} onClick={() => setSelected(d)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 600, color: '#4b5563' }}>No diamonds found</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {selected && <DiamondModal d={selected} onClose={() => setSelected(null)} />}

      <style>{`
        .gallery-img:hover { transform: scale(1.06); }
      `}</style>
    </div>
  )
}
