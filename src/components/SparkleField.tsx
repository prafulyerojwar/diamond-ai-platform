// Subtle sparkle dots on light background
const DOTS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  dur: Math.random() * 2 + 2,
  color: i % 3 === 0 ? 'rgba(124,58,237,.35)' : i % 3 === 1 ? 'rgba(79,70,229,.25)' : 'rgba(168,85,247,.2)',
}))

export default function SparkleField() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {DOTS.map(d => (
        <div key={d.id} className="animate-twinkle" style={{
          position: 'absolute',
          left: `${d.x}%`, top: `${d.y}%`,
          width: d.size, height: d.size,
          borderRadius: '50%',
          background: d.color,
          boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
          animationDelay: `${d.delay}s`,
          animationDuration: `${d.dur}s`,
        }} />
      ))}
    </div>
  )
}
