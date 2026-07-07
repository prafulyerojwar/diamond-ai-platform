import { useEffect, useRef, useState } from 'react'

interface GlitterParticle {
  id: number
  x: number
  y: number
  tx: number
  ty: number
  color: string
  delay: number
}

export default function AnimatedDiamond({ size = 260 }: { size?: number }) {
  const [particles, setParticles] = useState<GlitterParticle[]>([])
  const [hue, setHue] = useState(0)
  const animRef = useRef<number>(0)

  useEffect(() => {
    let frame = 0
    const animate = () => {
      frame++
      setHue(h => (h + 0.8) % 360)
      if (frame % 15 === 0) {
        setParticles(prev => {
          const next = prev.filter(p => p.id > Date.now() - 1500)
          const colors = ['#a8d8ea','#d4b8e0','#fff','#ffe4e1','#b8f0d4','#ffd4b8']
          const newP: GlitterParticle = {
            id: Date.now() + Math.random(),
            x: 30 + Math.random() * 40,
            y: 20 + Math.random() * 60,
            tx: (Math.random() - 0.5) * 80,
            ty: -(Math.random() * 60 + 20),
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: 0,
          }
          return [...next, newP]
        })
      }
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const s = size
  const cx = s / 2
  const cy = s / 2

  // Diamond facet coordinates (percentage of size)
  const facets = {
    // Table (top flat)
    table: [
      [cx - s*.18, cy - s*.08],
      [cx + s*.18, cy - s*.08],
      [cx + s*.12, cy - s*.22],
      [cx - s*.12, cy - s*.22],
    ],
    // Upper left facets
    upperLeft1: [[cx, cy - s*.32], [cx - s*.12, cy - s*.22], [cx - s*.18, cy - s*.08]],
    upperRight1: [[cx, cy - s*.32], [cx + s*.12, cy - s*.22], [cx + s*.18, cy - s*.08]],
    // Lower girdle facets
    lowerLeft: [[cx - s*.18, cy - s*.08], [cx - s*.28, cy + s*.05], [cx, cy + s*.38]],
    lowerRight: [[cx + s*.18, cy - s*.08], [cx + s*.28, cy + s*.05], [cx, cy + s*.38]],
    lowerCenter: [[cx - s*.18, cy - s*.08], [cx + s*.18, cy - s*.08], [cx, cy + s*.38]],
    // Girdle sides
    girdleLeft: [[cx - s*.18, cy - s*.08], [cx - s*.28, cy + s*.05], [cx - s*.18, cy + s*.05]],
    girdleRight: [[cx + s*.18, cy - s*.08], [cx + s*.28, cy + s*.05], [cx + s*.18, cy + s*.05]],
  }

  const pts = (arr: number[][]) => arr.map(([x, y]) => `${x},${y}`).join(' ')

  const light1 = `hsl(${hue}, 70%, 80%)`
  const light2 = `hsl(${(hue + 120) % 360}, 80%, 85%)`
  const light3 = `hsl(${(hue + 240) % 360}, 90%, 90%)`
  const dark1  = `hsl(${(hue + 60) % 360}, 50%, 30%)`
  const dark2  = `hsl(${(hue + 180) % 360}, 60%, 20%)`

  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Glow rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute rounded-full animate-pulse"
          style={{ width: s * 1.4, height: s * 1.4, background: `radial-gradient(ellipse at center, rgba(168,216,234,0.18) 0%, transparent 70%)` }} />
        <div className="absolute rounded-full"
          style={{ width: s * 1.1, height: s * 1.1, background: `radial-gradient(ellipse at center, rgba(212,184,224,0.12) 0%, transparent 70%)`, animation: 'pulseGlow 2s ease-in-out infinite' }} />
      </div>

      {/* Main rotating diamond */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'rotateDiamond 8s linear infinite', transformStyle: 'preserve-3d', perspective: '600px' }}>
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ filter: `drop-shadow(0 0 20px rgba(168,216,234,0.6)) drop-shadow(0 0 40px rgba(168,216,234,0.3))` }}>
          <defs>
            <radialGradient id="tableGrad" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="100%" stopColor={light2} stopOpacity="0.8" />
            </radialGradient>
            <linearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={light1} stopOpacity="0.9" />
              <stop offset="100%" stopColor={dark1} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="rightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={light3} stopOpacity="0.85" />
              <stop offset="100%" stopColor={dark2} stopOpacity="0.75" />
            </linearGradient>
          </defs>

          {/* Star sparkle at top */}
          <polygon points={`${cx},${cy - s*.38} ${cx+4},${cy - s*.3} ${cx+s*.04},${cy - s*.32} ${cx+3},${cy - s*.26} ${cx},${cy - s*.22} ${cx-3},${cy - s*.26} ${cx-s*.04},${cy - s*.32} ${cx-4},${cy - s*.3}`}
            fill="white" opacity="0.9" />

          {/* Table */}
          <polygon points={pts(facets.table)} fill="url(#tableGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />

          {/* Crown facets */}
          <polygon points={pts(facets.upperLeft1)} fill={light1} fillOpacity="0.7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <polygon points={pts(facets.upperRight1)} fill={light3} fillOpacity="0.75" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />

          {/* Pavilion */}
          <polygon points={pts(facets.lowerLeft)} fill="url(#leftGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <polygon points={pts(facets.lowerRight)} fill="url(#rightGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <polygon points={pts(facets.lowerCenter)} fill={dark1} fillOpacity="0.5" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Inner reflection lines */}
          <line x1={cx} y1={cy - s*.22} x2={cx} y2={cy + s*.38} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1={cx - s*.18} y1={cy - s*.08} x2={cx + s*.18} y2={cy - s*.08} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

          {/* Highlight flash */}
          <ellipse cx={cx - s*.05} cy={cy - s*.12} rx={s*.04} ry={s*.02} fill="white" opacity="0.8" transform={`rotate(-30,${cx - s*.05},${cy - s*.12})`} />
        </svg>
      </div>

      {/* Glitter particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full"
            style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: 4, height: 4,
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
              animation: `glitterParticle 1.2s ease-out forwards`,
              '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Bottom reflection */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{ width: s * 0.6, height: 20, background: 'radial-gradient(ellipse at center, rgba(168,216,234,0.4) 0%, transparent 70%)', filter: 'blur(8px)' }} />
    </div>
  )
}
