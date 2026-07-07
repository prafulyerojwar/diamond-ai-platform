import { useState } from 'react'
import { DIAMOND_HISTORY } from '../data/diamonds'

const FAMOUS = [
  { name: 'Koh-i-Noor', carats: 105.6, color: 'Colorless', origin: 'India, ~1300s', location: 'British Crown Jewels, London', story: 'Meaning "Mountain of Light" in Persian, this legendary diamond was owned by Mughal emperors, Persian shahs, Afghan rulers, Sikh rulers, and finally the British Crown. Now set in the Queen Mother\'s Crown at the Tower of London.', img: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=320&q=80', tag: 'British Crown' },
  { name: 'Hope Diamond', carats: 45.52, color: 'Deep Blue', origin: 'India, ~1668', location: 'Smithsonian Institution, Washington DC', story: 'One of the world\'s most famous gems. This 45.52ct deep blue diamond exhibits a unique red phosphorescence under UV light and has a legendary curse attached to it, supposedly bringing misfortune to owners.', img: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=320&q=80', tag: 'Smithsonian' },
  { name: 'Cullinan Diamond', carats: 3106.75, color: 'Colorless', origin: 'South Africa, 1905', location: 'Tower of London', story: 'The largest gem-quality rough diamond ever found at 3,106.75 carats. Cut into 105 polished stones including the 530ct Great Star of Africa now set in the Royal Sceptre.', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=320&q=80', tag: 'Largest Ever' },
  { name: 'Pink Star', carats: 59.6, color: 'Vivid Pink', origin: 'South Africa, 1999', location: 'Private Collection', story: 'The most expensive diamond ever sold at auction - $71.2 million in 2017. This internally flawless fancy vivid pink diamond from the Cullinan mine is the largest known of its quality grade.', img: 'https://images.unsplash.com/photo-1596516109370-29001ec8ec36?w=320&q=80', tag: '$71.2M Auction' },
  { name: 'Dresden Green', carats: 40.7, color: 'Natural Green', origin: 'India', location: 'New Green Vault, Dresden', story: 'The world\'s largest natural green diamond. Its vivid color was caused by natural radiation exposure over millions of years deep in the Earth. In excellent condition for a stone of its age.', img: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=320&q=80', tag: 'World Largest Green' },
  { name: 'Regent Diamond', carats: 140.64, color: 'Colorless', origin: 'India, 1698', location: 'Louvre Museum, Paris', story: 'Found by a slave in the Golconda mines. Purchased by the Governor of Madras, it adorned Napoleon\'s sword and crown before ending up at the Louvre where it is on permanent display today.', img: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=320&q=80', tag: 'Louvre' },
]

const SCIENCE = [
  { title: 'Formation', icon: '🌍', content: 'Diamonds form 100-200 km below Earth\'s surface under extreme pressure (45-60 kilobars) and temperature (900-1300°C). This process takes 1-3.3 billion years — diamonds are literally older than most life on Earth.', color: '#ede9fe' },
  { title: 'Composition', icon: '⚛️', content: 'Pure diamond is 100% carbon atoms in a cubic crystal lattice. Each atom bonds to 4 others tetrahedrally, creating the hardest natural substance (10 on Mohs scale). Only diamond can scratch another diamond.', color: '#dbeafe' },
  { title: 'Volcanic Transport', icon: '🌋', content: 'Diamonds reach Earth\'s surface in kimberlite pipes — ancient volcanic conduits that erupted millions of years ago. The rapid ascent preserved the structure that would otherwise revert to graphite.', color: '#fef3c7' },
  { title: 'Color Origins', icon: '🌈', content: 'Colorless = pure carbon. Blue = boron impurities. Yellow = nitrogen. Green = natural radiation. Pink & Red = plastic deformation of the crystal lattice (mechanism still debated by scientists). Black = numerous dark inclusions.', color: '#d1fae5' },
  { title: 'Lab-Grown', icon: '🔬', content: 'HPHT and CVD methods create physically and chemically identical diamonds to natural ones. Lab diamonds are 60-80% cheaper and growing rapidly in market share — now over 10% of diamond jewelry sold globally.', color: '#fce7f3' },
  { title: 'Record Hardness', icon: '💪', content: 'Diamond scores 10/10 on Mohs and has Vickers hardness ~10,000 HV — about 4× harder than corundum (ruby/sapphire). This makes it ideal for industrial cutting tools and bearings beyond its jewelry value.', color: '#fff7ed' },
]

export default function HistoryPage() {
  const [tab, setTab] = useState<'timeline' | 'famous' | 'science'>('timeline')
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">Knowledge Base</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>Diamond History</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>3000 years of wonder, mystery, and brilliant light</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
          {[
            { key: 'timeline', label: '📅 Timeline' },
            { key: 'famous',   label: '👑 Famous Diamonds' },
            { key: 'science',  label: '⚛️ The Science' },
          ].map(t => {
            const active = tab === t.key
            return (
              <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
                padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                border: active ? 'none' : '1.5px solid #e5e7eb',
                background: active ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#fff',
                color: active ? '#fff' : '#4b5563',
                boxShadow: active ? '0 4px 16px rgba(79,70,229,.3)' : '0 1px 4px rgba(0,0,0,.06)',
                transition: 'all .15s',
              }}>
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Timeline */}
        {tab === 'timeline' && (
          <div style={{ position: 'relative', paddingLeft: 32 }}>
            <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 2, background: 'linear-gradient(to bottom,#4f46e5,#7c3aed,rgba(124,58,237,.1))' }} />
            {DIAMOND_HISTORY.map((item, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: 24, paddingLeft: 20 }} className="animate-fade-in-up">
                {/* Dot */}
                <div style={{ position: 'absolute', left: -28, top: 14, width: 10, height: 10, borderRadius: '50%', background: '#4f46e5', border: '2px solid #fff', boxShadow: '0 0 0 2px #4f46e5' }} />
                <div className="card-flat" style={{ padding: '16px 20px', transition: 'all .2s' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em' }}>{item.year}</div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.65 }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Famous Diamonds */}
        {tab === 'famous' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAMOUS.map(d => (
              <div key={d.name} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === d.name ? null : d.name)}>
                <div style={{ display: 'flex', gap: 0 }}>
                  {/* Image */}
                  <div style={{ width: 120, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 120 }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>
                      {d.tag}
                    </div>
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>{d.name}</h3>
                        <p style={{ fontSize: 13, color: '#6b7280' }}>{d.carats} carats · {d.color} · {d.origin}</p>
                        <p style={{ fontSize: 12, color: '#4f46e5', marginTop: 2 }}>📍 {d.location}</p>
                      </div>
                      <span style={{ fontSize: 18, color: '#9ca3af', flexShrink: 0, transform: expanded === d.name ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>▾</span>
                    </div>
                    {expanded === d.name && (
                      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, marginTop: 14, paddingTop: 14, borderTop: '1px solid #f3f4f6' }}>
                        {d.story}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Science */}
        {tab === 'science' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
              {SCIENCE.map(s => (
                <div key={s.title} className="card" style={{ padding: 24, background: s.color }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7 }}>{s.content}</p>
                </div>
              ))}
            </div>

            {/* Mohs scale */}
            <div className="card-flat" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a1a2e', marginBottom: 18 }}>💎 Mohs Hardness Scale</h3>
              {[
                { n: 1, m: 'Talc' }, { n: 2, m: 'Gypsum' }, { n: 3, m: 'Calcite' }, { n: 4, m: 'Fluorite' },
                { n: 5, m: 'Apatite' }, { n: 6, m: 'Feldspar' }, { n: 7, m: 'Quartz' }, { n: 8, m: 'Topaz' },
                { n: 9, m: 'Corundum (Ruby/Sapphire)' }, { n: 10, m: 'Diamond' },
              ].map(item => (
                <div key={item.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, opacity: item.n === 10 ? 1 : 0.55 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: item.n === 10 ? '#4f46e5' : '#9ca3af', width: 18 }}>{item.n}</span>
                  <div style={{ flex: 1, height: item.n === 10 ? 10 : 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${item.n * 10}%`, background: item.n === 10 ? 'linear-gradient(90deg,#4f46e5,#7c3aed)' : '#d1d5db', borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: item.n === 10 ? 700 : 400, color: item.n === 10 ? '#4f46e5' : '#6b7280', width: 200 }}>{item.m}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
