'use client'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Gem } from 'lucide-react'

const links = [
  { to: '/',          label: 'Home' },
  { to: '/analyzer',  label: 'AI Analyzer' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/valuation', label: 'Valuation' },
  { to: '/history',   label: 'History' },
  { to: '/designer',  label: 'Designer' },
  { to: '/compare',   label: 'Compare' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e8e4f0', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Gem size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DiamondAI
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', letterSpacing: '0.1em', marginTop: -2, fontWeight: 500 }}>PLATFORM</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {links.map(l => {
              const active = pathname === l.to
              return (
                <Link key={l.to} to={l.to} style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                  textDecoration: 'none',
                  color: active ? '#4f46e5' : '#4b5563',
                  background: active ? '#ede9fe' : 'transparent',
                  transition: 'all .15s',
                }}>
                  {l.label}
                </Link>
              )
            })}
          </div>

          {/* Right badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '5px 12px' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}>AI Online</span>
            </div>
            <button
              onClick={() => setOpen(o => !o)}
              style={{ display: 'none', padding: 8, borderRadius: 8, border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}
              className="nav-mobile-btn"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ borderTop: '1px solid #f3f4f6', paddingBlock: 8, paddingBottom: 12 }}>
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '10px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                textDecoration: 'none', color: pathname === l.to ? '#4f46e5' : '#374151',
                background: pathname === l.to ? '#ede9fe' : 'transparent', marginBottom: 2,
              }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
