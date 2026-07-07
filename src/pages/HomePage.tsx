import { Link } from 'react-router-dom'
import AnimatedDiamond from '../components/AnimatedDiamond'

const features = [
  { icon: '🔬', title: 'AI Diamond Analyzer',   desc: 'Upload or capture a photo for instant cut, clarity, color grading and accurate market valuation.',        to: '/analyzer', color: '#ede9fe', border: '#c4b5fd', iconBg: '#4f46e5' },
  { icon: '💎', title: 'Diamond Gallery',        desc: 'Browse 25+ diamonds with full GIA specifications, rarity scores and real market values.',                  to: '/gallery',  color: '#dbeafe', border: '#93c5fd', iconBg: '#3b82f6' },
  { icon: '💰', title: 'Smart Valuation',        desc: 'Enter the 4Cs and get precise market pricing with interactive sliders and multiplier breakdown.',          to: '/valuation',color: '#d1fae5', border: '#6ee7b7', iconBg: '#10b981' },
  { icon: '📜', title: 'Diamond History',        desc: 'Explore 3000 years of diamond history from ancient India to famous gems and modern lab-grown stones.',     to: '/history',  color: '#fef3c7', border: '#fcd34d', iconBg: '#f59e0b' },
  { icon: '✨', title: 'AI Jewelry Designer',    desc: 'Describe your dream jewelry in natural language and our AI creates detailed design specifications.',        to: '/designer', color: '#fce7f3', border: '#f9a8d4', iconBg: '#ec4899' },
  { icon: '⚖️', title: 'Diamond Comparison',    desc: 'Compare two diamonds side-by-side across every GIA metric - cut, color, clarity, carat, value and more.',  to: '/compare',  color: '#ecfdf5', border: '#6ee7b7', iconBg: '#059669' },
]

const stats = [
  { value: '25+',  label: 'Diamond Types' },
  { value: 'GIA',  label: 'Grade System' },
  { value: '4Cs',  label: 'Valuation' },
  { value: 'AI',   label: 'Powered' },
]

export default function HomePage() {
  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #faf8ff 0%, #f0ebff 40%, #e8f4ff 100%)',
        borderBottom: '1px solid #e8e4f0',
        padding: '80px 24px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 320, height: 320, borderRadius: '50%', background: 'rgba(124,58,237,.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(79,70,229,.04)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ede9fe', color: '#5b21b6', fontSize: 12, fontWeight: 600, padding: '4px 14px', borderRadius: 999, letterSpacing: '.08em', marginBottom: 20 }}>
            ✦ AI-POWERED DIAMOND INTELLIGENCE
          </div>

          {/* 3D Rotating Diamond */}
          <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <AnimatedDiamond size={300} />
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: '#1a1a2e' }}>
            The World's Most Advanced<br />
            <span className="shimmer-text">Diamond Intelligence</span> Platform
          </h1>
          <p style={{ fontSize: 18, color: '#4b5563', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Analyze, value, and design diamond jewelry with AI. From rough stones to finished pieces - we decode every facet.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/analyzer" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
              🔬 Analyze Diamond
            </Link>
            <Link to="/gallery" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
              💎 View Gallery
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#4f46e5' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Platform Features</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: 12 }}>
            Everything About Diamonds
          </h2>
          <p style={{ color: '#6b7280', fontSize: 16, maxWidth: 540, margin: '0 auto' }}>
            From ancient gemology to cutting-edge AI analysis - your complete diamond intelligence suite.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {features.map(f => (
            <Link key={f.to} to={f.to} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: 28, cursor: 'pointer', background: f.color, borderColor: f.border }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16, boxShadow: `0 4px 12px ${f.iconBg}55` }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#4b5563', lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: 16, fontSize: 13, color: '#4f46e5', fontWeight: 600 }}>Explore →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4Cs section */}
      <section style={{ background: '#fff', borderTop: '1px solid #e8e4f0', borderBottom: '1px solid #e8e4f0', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="section-label">Grading Standard</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>The 4Cs of Diamond Quality</h2>
            <p style={{ color: '#6b7280', fontSize: 15 }}>The universal standard for grading and valuing every diamond</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { c: 'Cut',     icon: '✂️', pct: 35, desc: 'Determines brilliance & fire',   color: '#4f46e5', bg: '#ede9fe' },
              { c: 'Color',   icon: '🎨', pct: 25, desc: 'D (colorless) to Z (yellow)',    color: '#7c3aed', bg: '#f5f3ff' },
              { c: 'Clarity', icon: '🔍', pct: 20, desc: 'Inclusions & blemish grading',  color: '#0ea5e9', bg: '#f0f9ff' },
              { c: 'Carat',   icon: '⚖️', pct: 20, desc: 'Weight determines size & price',color: '#10b981', bg: '#f0fdf4' },
            ].map(item => (
              <div key={item.c} className="card-flat" style={{ padding: 24, textAlign: 'center', background: item.bg }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: item.color, marginBottom: 4 }}>{item.c}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>{item.desc}</div>
                <div style={{ height: 6, background: 'rgba(0,0,0,.08)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: 999 }} />
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Value weight: {item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px 24px', background: '#f8f5f0', borderTop: '1px solid #e8e4f0' }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
          <span className="shimmer-text">DiamondAI Platform</span>
        </div>
        <div style={{ fontSize: 13, color: '#9ca3af' }}>
          Designed & Developed by <span style={{ color: '#4f46e5', fontWeight: 600 }}>Praful Yerojwar</span>
        </div>
      </footer>
    </div>
  )
}
