interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
  opacity: number
  type: 'star' | 'diamond' | 'dot'
}

export default function SparkleField() {
  const sparkles: Sparkle[] = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.2,
    type: (['star','diamond','dot'] as const)[Math.floor(Math.random() * 3)],
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          {s.type === 'star' ? (
            <svg width={s.size * 2} height={s.size * 2} viewBox="0 0 24 24" style={{ opacity: s.opacity }}>
              <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" fill="rgba(168,216,234,0.8)" />
            </svg>
          ) : s.type === 'diamond' ? (
            <svg width={s.size * 1.5} height={s.size * 1.5} viewBox="0 0 24 24" style={{ opacity: s.opacity }}>
              <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="rgba(168,216,234,0.7)" strokeWidth="1.5" />
              <polygon points="12,6 18,12 12,18 6,12" fill="rgba(168,216,234,0.3)" />
            </svg>
          ) : (
            <div
              style={{
                width: s.size,
                height: s.size,
                borderRadius: '50%',
                background: `rgba(${Math.random() > 0.5 ? '168,216,234' : '212,184,224'},${s.opacity})`,
                boxShadow: `0 0 ${s.size * 2}px rgba(168,216,234,0.5)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
