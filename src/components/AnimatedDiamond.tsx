import { useEffect, useRef } from 'react'

type V3 = [number, number, number]
type V2 = [number, number]

// Real diamond color phases — cycles Colorless → Blue → Pink → Yellow → Green → back
const PHASES = [
  { name: 'Colorless', hue: 210, sat: 35, lit: 92 },
  { name: 'Blue',      hue: 218, sat: 88, lit: 62 },
  { name: 'Pink',      hue: 338, sat: 78, lit: 76 },
  { name: 'Yellow',    hue: 48,  sat: 90, lit: 68 },
  { name: 'Green',     hue: 148, sat: 72, lit: 60 },
]

interface Spark {
  x: number; y: number
  life: number; maxLife: number
  r: number; hue: number
}

export default function AnimatedDiamond({ size = 380 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let angle = 0
    let phaseT = 0   // 0 → PHASES.length, wraps continuously
    const sparks: Spark[] = []

    // ── Geometry ──────────────────────────────────────────────────
    const N = 8
    const R_TABLE = 0.22, R_GIRDLE = 0.50, R_STAR = 0.36
    const Y_TABLE = 0.34, Y_CROWN = 0.10, Y_GIRDLE = -0.04, Y_PAVIL = -0.30, Y_CULET = -0.70

    function ring(r: number, y: number, n: number, off = 0): V3[] {
      return Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + off
        return [r * Math.cos(a), y, r * Math.sin(a)] as V3
      })
    }

    const tblB = ring(R_TABLE, Y_TABLE, N, 0)
    const strB = ring(R_STAR, Y_CROWN, N, Math.PI / N)
    const grdB = ring(R_GIRDLE, Y_GIRDLE, N, 0)
    const pavB = ring(R_GIRDLE * 0.6, Y_PAVIL, N, Math.PI / N)
    const culB: V3 = [0, Y_CULET, 0]

    // ── 3D math ───────────────────────────────────────────────────
    const rotY = (v: V3, a: number): V3 => { const c = Math.cos(a), s = Math.sin(a); return [v[0]*c+v[2]*s, v[1], -v[0]*s+v[2]*c] }
    const rotX = (v: V3, a: number): V3 => { const c = Math.cos(a), s = Math.sin(a); return [v[0], v[1]*c-v[2]*s, v[1]*s+v[2]*c] }
    const sub   = (a: V3, b: V3): V3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
    const cross = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
    const dot   = (a: V3, b: V3) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2]
    const lenv  = (v: V3) => Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    const norm  = (v: V3): V3 => { const l = lenv(v) || 1; return [v[0]/l, v[1]/l, v[2]/l] }
    const ctr   = (pts: V3[]): V3 => { const s: V3 = [0,0,0]; pts.forEach(p=>{s[0]+=p[0];s[1]+=p[1];s[2]+=p[2]}); return [s[0]/pts.length,s[1]/pts.length,s[2]/pts.length] }
    const fNorm = (pts: V3[]): V3 => norm(cross(sub(pts[1],pts[0]),sub(pts[2],pts[0])))

    const proj = (v: V3): V2 => { const fov = size * 0.52, z = v[2] + 2.8; return [size/2 + v[0]*fov/z, size/2 - v[1]*fov/z] }

    const LIGHT: V3 = norm([0.4, 0.9, 0.7])
    const VIEW:  V3 = [0, 0, 1]

    // ── Color helpers ─────────────────────────────────────────────
    function lerpPhase(faceOffset: number) {
      const total = PHASES.length
      const raw = ((phaseT + faceOffset * 0.25) % total + total) % total
      const ia = Math.floor(raw) % total
      const ib = (ia + 1) % total
      const t = raw - Math.floor(raw)
      const A = PHASES[ia], B = PHASES[ib]
      let hd = B.hue - A.hue
      if (hd > 180) hd -= 360
      if (hd < -180) hd += 360
      return {
        h: (A.hue + hd * t + 360) % 360,
        s: A.sat + (B.sat - A.sat) * t,
        l: A.lit + (B.lit - A.lit) * t,
      }
    }

    function hslRgb(h: number, s: number, l: number): [number, number, number] {
      s /= 100; l /= 100
      const k = (n: number) => (n + h / 30) % 12
      const a = s * Math.min(l, 1 - l)
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n)-3, Math.min(9-k(n), 1)))
      return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)]
    }

    // ── 4-point sparkle star (like real diamond light reflections) ──
    function drawSparkle(cx: number, cy: number, r: number, alpha: number, hue: number) {
      ctx.save()
      ctx.globalAlpha = alpha
      for (let arm = 0; arm < 4; arm++) {
        const a = arm * Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(a + 0.18) * r * 0.28, cy + Math.sin(a + 0.18) * r * 0.28)
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        ctx.lineTo(cx + Math.cos(a - 0.18) * r * 0.28, cy + Math.sin(a - 0.18) * r * 0.28)
        ctx.closePath()
        const g = ctx.createLinearGradient(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r)
        g.addColorStop(0, `hsla(${hue},80%,98%,1)`)
        g.addColorStop(1, `hsla(${hue},60%,80%,0)`)
        ctx.fillStyle = g
        ctx.fill()
      }
      // Bright center dot
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.35)
      cg.addColorStop(0, 'rgba(255,255,255,1)')
      cg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = cg
      ctx.fill()
      ctx.restore()
    }

    // ── Main draw ─────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, size, size)

      const TILT = 0.30
      const T = (v: V3): V3 => rotX(rotY(v, angle), TILT)

      const tbl = tblB.map(T), str = strB.map(T), grd = grdB.map(T), pav = pavB.map(T), cul = T(culB)

      type Face = { pts3d: V3[]; pts2d: V2[]; z: number; ci: number; brightness: number }
      const faces: Face[] = []

      const push = (pts3d: V3[], ci: number) => {
        const n = fNorm(pts3d)
        const ndotl = Math.max(0, dot(n, LIGHT))
        const ndotv = dot(n, VIEW)
        const back = ndotv < 0
        const brightness = back ? 0.07 + ndotl * 0.12 : 0.26 + ndotl * 0.74
        faces.push({ pts3d, pts2d: pts3d.map(proj), z: ctr(pts3d)[2], ci, brightness })
      }

      push([...tbl], 7)
      for (let i = 0; i < N; i++) {
        const j = (i+1)%N
        push([tbl[i], str[i], tbl[j]], i%8)
        push([tbl[j], str[i], grd[i]], (i+3)%8)
        push([grd[i], grd[j], str[i]], (i+1)%8)
      }
      for (let i = 0; i < N; i++) {
        const j = (i+1)%N
        push([grd[i], grd[j], pav[i]], (i+2)%8)
        push([grd[j], pav[j], pav[i]], (i+5)%8)
        push([pav[i], pav[j], cul],    (i+4)%8)
      }

      faces.sort((a, b) => a.z - b.z)

      // Background glow matching current color phase
      const base = lerpPhase(0)
      const glow = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size * 0.56)
      glow.addColorStop(0,   `hsla(${base.h},${base.s}%,78%,0.18)`)
      glow.addColorStop(0.45,`hsla(${(base.h+40)%360},${base.s*0.8}%,72%,0.08)`)
      glow.addColorStop(1,   'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Draw faces
      faces.forEach(face => {
        if (face.pts2d.length < 3) return
        const dc = lerpPhase(face.ci)
        const bri = face.brightness
        const wm = Math.pow(bri, 1.8) * 0.65    // white mix: brighter faces → more white
        const fH = dc.h
        const fS = dc.s * (1 - wm)
        const fL = Math.min(97, dc.l * (0.25 + bri * 0.75) + wm * 28)
        const [r, g, b] = hslRgb(fH, fS, fL)
        const alpha = 0.48 + bri * 0.42

        const cp2 = proj(ctr(face.pts3d))
        const gr = ctx.createRadialGradient(cp2[0]-9, cp2[1]-9, 2, cp2[0], cp2[1], 62)
        gr.addColorStop(0, `rgba(${Math.min(255,r+85)},${Math.min(255,g+65)},${Math.min(255,b+65)},${alpha})`)
        gr.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.42})`)

        ctx.beginPath()
        ctx.moveTo(face.pts2d[0][0], face.pts2d[0][1])
        face.pts2d.slice(1).forEach(p => ctx.lineTo(p[0], p[1]))
        ctx.closePath()
        ctx.fillStyle = gr
        ctx.fill()
        ctx.strokeStyle = `rgba(255,255,255,${0.10 + bri * 0.35})`
        ctx.lineWidth = 0.7
        ctx.stroke()

        // Bright specular white flash on top-lit faces
        if (bri > 0.78) {
          ctx.beginPath()
          ctx.moveTo(face.pts2d[0][0], face.pts2d[0][1])
          face.pts2d.slice(1).forEach(p => ctx.lineTo(p[0], p[1]))
          ctx.closePath()
          const flash = ctx.createRadialGradient(cp2[0]-13, cp2[1]-13, 0, cp2[0], cp2[1], 34)
          flash.addColorStop(0, `rgba(255,255,255,${(bri - 0.78) * 5.0})`)
          flash.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = flash
          ctx.fill()
        }
      })

      // ── Sparkle system ────────────────────────────────────────────
      // Spawn sparkles on visible bright faces
      if (Math.random() < 0.09 && sparks.length < 9) {
        const bright = faces.filter(f => f.brightness > 0.52 && f.pts2d.length >= 3)
        if (bright.length > 0) {
          const f = bright[Math.floor(Math.random() * bright.length)]
          const p2 = proj(ctr(f.pts3d))
          sparks.push({
            x: p2[0] + (Math.random()-0.5) * 18,
            y: p2[1] + (Math.random()-0.5) * 18,
            life: 0, maxLife: 22 + Math.floor(Math.random() * 22),
            r: 5 + Math.random() * 11,
            hue: lerpPhase(f.ci).h,
          })
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        const t = s.life / s.maxLife
        const alpha = t < 0.35 ? t / 0.35 : (1 - t) / 0.65
        drawSparkle(s.x, s.y, s.r * (0.6 + t * 0.6), alpha, s.hue)
        s.life++
        if (s.life >= s.maxLife) sparks.splice(i, 1)
      }

      // Persistent apex sparkle
      const topY = tbl.reduce((m, v) => { const py = proj(v)[1]; return py < m ? py : m }, Infinity)
      ctx.save()
      ctx.translate(size / 2, topY - 7)
      ctx.rotate(angle * 1.8)
      drawSparkle(0, 0, 10 + 3.5 * Math.sin(angle * 4.5), 0.82 + 0.18 * Math.sin(angle * 4.5), lerpPhase(7).h)
      ctx.restore()

      // Bottom reflection puddle
      const botY = proj(cul)[1]
      ctx.save()
      ctx.globalAlpha = 0.14
      ctx.beginPath()
      ctx.ellipse(size/2, botY + 15, size * 0.25, 10, 0, 0, Math.PI * 2)
      const rg = ctx.createRadialGradient(size/2, botY+15, 0, size/2, botY+15, size * 0.25)
      rg.addColorStop(0, `hsla(${base.h},${base.s}%,80%,0.85)`)
      rg.addColorStop(1, 'transparent')
      ctx.fillStyle = rg
      ctx.fill()
      ctx.restore()

      // Color phase label at bottom
      const phaseIdx = Math.floor(phaseT % PHASES.length)
      const phaseName = PHASES[phaseIdx].name
      const labelAlpha = 0.55 + 0.25 * Math.sin(phaseT * Math.PI * 2)
      ctx.save()
      ctx.globalAlpha = labelAlpha
      ctx.font = `600 11px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.fillStyle = `hsl(${base.h},${Math.max(40, base.s)}%,35%)`
      ctx.fillText(`✦ ${phaseName} Diamond ✦`, size / 2, size - 6)
      ctx.restore()
    }

    const loop = () => {
      angle  += 0.011
      phaseT = (phaseT + 0.0042) % PHASES.length   // full color cycle ≈ 14 sec
      draw()
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Multi-layer glow rings */}
      <div style={{
        position: 'absolute', inset: -36,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(168,216,234,0.22) 0%, transparent 62%)',
        animation: 'pulseGlow 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 20,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(212,184,224,0.14) 0%, transparent 62%)',
        animation: 'pulseGlow 4.5s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 50,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.08) 0%, transparent 62%)',
        animation: 'pulseGlow 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          position: 'relative', zIndex: 1,
          filter: 'drop-shadow(0 0 40px rgba(168,216,234,0.85)) drop-shadow(0 0 80px rgba(168,216,234,0.40)) drop-shadow(0 4px 20px rgba(79,70,229,0.25))',
        }}
      />
    </div>
  )
}
