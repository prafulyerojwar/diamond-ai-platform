import { useEffect, useRef } from 'react'

type V3 = [number, number, number]
type V2 = [number, number]

export default function AnimatedDiamond({ size = 320 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    let angle = 0
    let hue = 0

    // Diamond geometry parameters
    const N = 8            // sides
    const R_TABLE = 0.22   // table (top flat) radius
    const R_GIRDLE = 0.50  // girdle (widest) radius
    const R_STAR = 0.36    // star facet points (between table and girdle)
    const Y_TABLE = 0.34   // y of table
    const Y_CROWN = 0.10   // y of star facet tips
    const Y_GIRDLE = -0.04 // y of girdle
    const Y_PAVIL = -0.30  // y of pavilion lower ring
    const Y_CULET = -0.70  // y of bottom point

    // Generate a ring of vertices
    function ring(r: number, y: number, n: number, off = 0): V3[] {
      return Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + off
        return [r * Math.cos(a), y, r * Math.sin(a)] as V3
      })
    }

    // Base vertex rings (un-rotated)
    const tblB = ring(R_TABLE, Y_TABLE, N, 0)        // table edge
    const strB = ring(R_STAR,  Y_CROWN, N, Math.PI/N) // star tips (offset half-step)
    const grdB = ring(R_GIRDLE, Y_GIRDLE, N, 0)      // girdle
    const pavB = ring(R_GIRDLE * 0.6, Y_PAVIL, N, Math.PI/N) // lower pavilion ring
    const culB: V3 = [0, Y_CULET, 0]

    // 3D math helpers
    const rotY = (v: V3, a: number): V3 => {
      const c = Math.cos(a), s = Math.sin(a)
      return [v[0]*c + v[2]*s, v[1], -v[0]*s + v[2]*c]
    }
    const rotX = (v: V3, a: number): V3 => {
      const c = Math.cos(a), s = Math.sin(a)
      return [v[0], v[1]*c - v[2]*s, v[1]*s + v[2]*c]
    }
    const sub = (a: V3, b: V3): V3 => [a[0]-b[0], a[1]-b[1], a[2]-b[2]]
    const cross = (a: V3, b: V3): V3 => [
      a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0],
    ]
    const dot = (a: V3, b: V3) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
    const len = (v: V3) => Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2])
    const norm = (v: V3): V3 => { const l = len(v)||1; return [v[0]/l, v[1]/l, v[2]/l] }
    const centroid = (pts: V3[]): V3 => {
      const s: V3 = [0,0,0]
      pts.forEach(p => { s[0]+=p[0]; s[1]+=p[1]; s[2]+=p[2] })
      return [s[0]/pts.length, s[1]/pts.length, s[2]/pts.length]
    }
    const faceNorm = (pts: V3[]): V3 => norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])))

    // Perspective projection
    const proj = (v: V3): V2 => {
      const fov = size * 0.52
      const z = v[2] + 2.8
      return [size/2 + v[0]*fov/z, size/2 - v[1]*fov/z]
    }

    // Light direction (upper-front-left)
    const LIGHT: V3 = norm([0.4, 0.9, 0.7])
    const VIEW:  V3 = [0, 0, 1]

    // Prismatic color palette
    const PRISM = [
      [220, 240, 255], // icy white-blue
      [168, 216, 234], // cyan
      [180, 200, 255], // blue
      [212, 184, 224], // purple
      [255, 200, 230], // pink
      [255, 230, 190], // warm gold
      [200, 255, 220], // mint
      [255, 255, 255], // white
    ]

    function drawStar(cx: number, cy: number, r: number) {
      ctx.beginPath()
      for (let k = 0; k < 8; k++) {
        const rad = k % 2 === 0 ? r : r * 0.4
        const a = k * Math.PI / 4 - Math.PI / 2
        k === 0 ? ctx.moveTo(cx + rad*Math.cos(a), cy + rad*Math.sin(a))
                : ctx.lineTo(cx + rad*Math.cos(a), cy + rad*Math.sin(a))
      }
      ctx.closePath()
    }

    function draw() {
      ctx.clearRect(0, 0, size, size)

      // Transform all rings
      const TILT = 0.30
      const T = (v: V3): V3 => rotX(rotY(v, angle), TILT)

      const tbl = tblB.map(T)
      const str = strB.map(T)
      const grd = grdB.map(T)
      const pav = pavB.map(T)
      const cul = T(culB)

      // Collect all faces
      type DrawFace = {
        pts3d: V3[]
        pts2d: V2[]
        z: number
        ci: number  // color index
        brightness: number
      }

      const faces: DrawFace[] = []
      const push = (pts3d: V3[], ci: number) => {
        const n = faceNorm(pts3d)
        const ndotl = Math.max(0, dot(n, LIGHT))
        const ndotv = dot(n, VIEW)
        const backface = ndotv < 0
        const brightness = backface
          ? 0.10 + ndotl * 0.15
          : 0.30 + ndotl * 0.70
        faces.push({
          pts3d, pts2d: pts3d.map(proj),
          z: centroid(pts3d)[2],
          ci, brightness,
        })
      }

      // ── Table (octagon top face) ──
      push([...tbl], 7)

      // ── Crown: table → star tip → girdle  (kite / star facets) ──
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N
        // Upper-crown triangle: tbl[i]  - str[i] - tbl[j]  (star facet)
        push([tbl[i], str[i], tbl[j]], (i) % 8)
        // Lower-crown kite:     str[i] - grd[i]  - grd[j] - tbl[j] won't work cleanly
        // Split: str[i]-grd[i]-tbl[j] and grd[i]-grd[j]-tbl[j]... better:
        // Bezel facet: tbl[j] - str[i] - grd[i]
        push([tbl[j], str[i], grd[i]], (i + 3) % 8)
        // Girdle step: grd[i] - grd[j] - tbl[j]  → actually lower-girdle triangle
        push([grd[i], grd[j], str[i]], (i + 1) % 8)
      }

      // ── Pavilion: girdle → lower ring → culet ──
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N
        // Upper pavilion quad: grd[i] grd[j] pav[i]
        push([grd[i], grd[j], pav[i]], (i + 2) % 8)
        push([grd[j], pav[j], pav[i]], (i + 5) % 8)
        // Lower pavilion triangle to culet
        push([pav[i], pav[j], cul], (i + 4) % 8)
      }

      // Sort back-to-front
      faces.sort((a, b) => a.z - b.z)

      // Glow background
      const glow = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size*0.5)
      const ch = (hue + 180) % 360
      glow.addColorStop(0, `hsla(${hue},80%,85%,0.10)`)
      glow.addColorStop(0.5, `hsla(${ch},70%,80%,0.05)`)
      glow.addColorStop(1, 'transparent')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, size, size)

      // Draw faces
      faces.forEach(face => {
        if (face.pts2d.length < 3) return

        const [r, g, b] = PRISM[(face.ci + Math.floor(hue / 45)) % 8]
        const bri = face.brightness
        const fr = Math.min(255, Math.round(r * bri + 40 * bri))
        const fg = Math.min(255, Math.round(g * bri))
        const fb = Math.min(255, Math.round(b * bri))
        const alpha = 0.55 + bri * 0.35

        const cpt = centroid(face.pts3d)
        const cp2 = proj(cpt)

        // Face gradient
        const gr = ctx.createRadialGradient(cp2[0]-8, cp2[1]-8, 2, cp2[0], cp2[1], 55)
        gr.addColorStop(0, `rgba(${Math.min(255,fr+70)},${Math.min(255,fg+70)},${Math.min(255,fb+70)},${alpha})`)
        gr.addColorStop(1, `rgba(${fr},${fg},${fb},${alpha * 0.5})`)

        ctx.beginPath()
        ctx.moveTo(face.pts2d[0][0], face.pts2d[0][1])
        face.pts2d.slice(1).forEach(p => ctx.lineTo(p[0], p[1]))
        ctx.closePath()
        ctx.fillStyle = gr
        ctx.fill()
        ctx.strokeStyle = `rgba(255,255,255,${0.15 + bri * 0.3})`
        ctx.lineWidth = 0.7
        ctx.stroke()

        // Specular highlight flash
        if (bri > 0.85) {
          ctx.beginPath()
          ctx.moveTo(face.pts2d[0][0], face.pts2d[0][1])
          face.pts2d.slice(1).forEach(p => ctx.lineTo(p[0], p[1]))
          ctx.closePath()
          const flash = ctx.createRadialGradient(cp2[0]-10, cp2[1]-10, 0, cp2[0], cp2[1], 28)
          flash.addColorStop(0, `rgba(255,255,255,${(bri-0.85)*3})`)
          flash.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = flash
          ctx.fill()
        }
      })

      // Draw sparkle star at the very top of the diamond
      const topY = tbl.reduce((minY, v) => {
        const py = proj(v)[1]
        return py < minY ? py : minY
      }, Infinity)

      ctx.save()
      ctx.translate(size / 2, topY - 4)
      ctx.rotate(angle * 3)
      const sparkR = 7 + 3 * Math.sin(angle * 4)
      drawStar(0, 0, sparkR)
      const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, sparkR)
      sg.addColorStop(0, 'rgba(255,255,255,0.95)')
      sg.addColorStop(1, 'rgba(168,216,234,0)')
      ctx.fillStyle = sg
      ctx.fill()
      ctx.restore()

      // Reflection ellipse at bottom
      const botY = proj(cul)[1]
      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.beginPath()
      ctx.ellipse(size/2, botY + 12, size*0.22, 8, 0, 0, Math.PI*2)
      const refGrad = ctx.createRadialGradient(size/2, botY+12, 0, size/2, botY+12, size*0.22)
      refGrad.addColorStop(0, `hsla(${hue},80%,80%,0.7)`)
      refGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = refGrad
      ctx.fill()
      ctx.restore()
    }

    const loop = () => {
      angle += 0.011
      hue = (hue + 0.5) % 360
      draw()
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [size])

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Pulsing glow rings */}
      <div style={{
        position: 'absolute', inset: -20,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(168,216,234,0.18) 0%, transparent 65%)',
        animation: 'pulseGlow 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', inset: 10,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(212,184,224,0.10) 0%, transparent 65%)',
        animation: 'pulseGlow 4s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          position: 'relative', zIndex: 1,
          filter: 'drop-shadow(0 0 28px rgba(168,216,234,0.75)) drop-shadow(0 0 60px rgba(168,216,234,0.35))',
        }}
      />
    </div>
  )
}
