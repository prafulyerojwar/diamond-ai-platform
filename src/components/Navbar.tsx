import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/',          label: 'Home' },
  { to: '/analyzer',  label: 'AI Analyzer' },
  { to: '/gallery',   label: 'Gallery' },
  { to: '/valuation', label: 'Valuation' },
  { to: '/history',   label: 'History' },
  { to: '/designer',  label: 'Designer' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 40 40" className="w-9 h-9 animate-prism">
                <polygon points="20,4 36,16 30,36 10,36 4,16" fill="none" stroke="url(#navGrad)" strokeWidth="2" />
                <polygon points="20,4 36,16 20,24" fill="rgba(168,216,234,0.3)" />
                <polygon points="20,4 4,16 20,24"  fill="rgba(212,184,224,0.25)" />
                <polygon points="4,16 10,36 20,24"  fill="rgba(168,216,234,0.2)" />
                <polygon points="36,16 30,36 20,24" fill="rgba(212,184,224,0.2)" />
                <polygon points="10,36 30,36 20,24" fill="rgba(168,216,234,0.15)" />
                <defs>
                  <linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a8d8ea" /><stop offset="100%" stopColor="#d4b8e0" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-300 animate-twinkle" />
            </div>
            <div>
              <span className="font-bold text-lg shimmer-text">DiamondAI</span>
              <div className="text-xs text-cyan-400/60 -mt-1 font-medium tracking-widest">PLATFORM</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === l.to
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 glow-text'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-cyan-300 font-medium">AI Online</span>
            </div>
            <button className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
              onClick={() => setOpen(o => !o)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 space-y-1 border-t border-white/10">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === l.to ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
