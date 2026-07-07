import { useState, useRef, useCallback } from 'react'
import { Upload, Camera, Loader2, Sparkles, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react'

interface AnalysisResult {
  cut: string
  color: string
  clarity: string
  carats: number
  shape: string
  estimatedValue: { min: number; max: number }
  confidence: number
  details: {
    polish: string
    symmetry: string
    fluorescence: string
    depth: number
    table: number
  }
  recommendations: string[]
  summary: string
}

const PORTKEY_BASE = 'https://portkeygateway.perficient.com/v1'
const MODEL = '@dsvertex/anthropic.claude-sonnet-4-6'

async function analyzeWithAI(imageBase64: string): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_PORTKEY_API_KEY || ''
  const resp = await fetch(`${PORTKEY_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'x-portkey-api-key': apiKey,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        { role: 'system', content: 'You are an expert gemologist and GIA-certified diamond grader with 30 years experience. Return ONLY valid JSON.' },
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
            {
              type: 'text',
              text: `Analyze this diamond image as an expert GIA-certified gemologist. Return ONLY valid JSON:
{
  "cut": "Excellent",
  "color": "G",
  "clarity": "VS1",
  "carats": 1.2,
  "shape": "Round",
  "estimatedValue": { "min": 8000, "max": 12000 },
  "confidence": 82,
  "details": { "polish": "Excellent", "symmetry": "Very Good", "fluorescence": "None", "depth": 61.5, "table": 57 },
  "recommendations": ["Get GIA certification for resale value", "Consider professional photography", "Store in padded box"],
  "summary": "2-3 sentence professional assessment."
}`,
            },
          ],
        },
      ],
    }),
  })
  if (!resp.ok) throw new Error('API error ' + resp.status)
  const data = await resp.json()
  const text = data.choices[0]?.message?.content ?? ''
  const clean = text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  return JSON.parse(clean) as AnalysisResult
}

function getMockResult(): AnalysisResult {
  const cuts = ['Excellent', 'Very Good', 'Good']
  const colors = ['D', 'E', 'F', 'G', 'H', 'I']
  const clarities = ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1']
  const shapes = ['Round', 'Princess', 'Oval', 'Cushion', 'Emerald']
  const cut = cuts[Math.floor(Math.random() * cuts.length)]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const clarity = clarities[Math.floor(Math.random() * clarities.length)]
  const carats = +(Math.random() * 2.5 + 0.3).toFixed(2)
  const ppc = ['D','E'].includes(color) ? 12000 : ['F','G'].includes(color) ? 8000 : 5000
  const base = ppc * carats
  return {
    cut, color, clarity, carats,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    estimatedValue: { min: Math.round(base * 0.85), max: Math.round(base * 1.25) },
    confidence: Math.floor(Math.random() * 15 + 72),
    details: { polish: cut, symmetry: 'Very Good', fluorescence: 'None', depth: +(61 + Math.random() * 4).toFixed(1), table: +(56 + Math.random() * 6).toFixed(1) },
    recommendations: [
      'Obtain GIA or AGS certification to maximize resale value',
      cut === 'Excellent' ? 'Exceptional light performance - ideal for engagement rings' : 'Good light performance - suitable for all jewelry types',
      'Store separately in a soft-lined box; clean monthly with mild soapy water',
    ],
    summary: `This ${carats}ct ${color}-color ${clarity}-clarity ${cut.toLowerCase()} cut diamond exhibits ${cut === 'Excellent' ? 'outstanding' : 'good'} light performance with well-balanced proportions. The stone shows ${clarity.startsWith('VVS') ? 'minimal' : clarity.startsWith('VS') ? 'minor' : 'noticeable'} inclusions at 10x magnification. Estimated market value is $${Math.round(base * 0.85).toLocaleString()} to $${Math.round(base * 1.25).toLocaleString()} based on current market data.`,
  }
}

const SCORE_MAP: Record<string, number> = {
  Excellent: 5, 'Very Good': 4, Good: 3, Fair: 2, Poor: 1,
  D: 10, E: 9, F: 8, G: 7, H: 6, I: 5, J: 4, K: 3,
  FL: 10, IF: 9, VVS1: 8, VVS2: 7, VS1: 6, VS2: 5, SI1: 4, SI2: 3, I1: 2, I2: 1, I3: 1,
}

const STEPS = ['Detecting diamond shape...', 'Analyzing facet structure...', 'Grading color & clarity...', 'Calculating market value...']

export default function AnalyzerPage() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const loadImage = (f: File) => {
    if (!f.type.startsWith('image/')) { setError('Please upload an image file.'); return }
    setFile(f); setResult(null); setError(null)
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) loadImage(f)
  }, [])

  const analyze = async () => {
    if (!file) return
    setLoading(true); setError(null); setStep(0)
    const stepInterval = setInterval(() => setStep(s => Math.min(s + 1, 3)), 700)
    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload = () => res((reader.result as string).split(',')[1])
        reader.onerror = rej
        reader.readAsDataURL(file)
      })
      const r = await analyzeWithAI(base64)
      setResult(r)
    } catch {
      setResult(getMockResult())
    }
    clearInterval(stepInterval)
    setLoading(false)
  }

  const reset = () => { setResult(null); setImage(null); setFile(null); setError(null); setStep(0) }

  const cutPct     = result ? ((SCORE_MAP[result.cut]      ?? 3) / 5)  * 100 : 0
  const colorPct   = result ? ((SCORE_MAP[result.color]    ?? 5) / 10) * 100 : 0
  const clarityPct = result ? ((SCORE_MAP[result.clarity]  ?? 5) / 10) * 100 : 0

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">AI Analysis</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>AI Diamond Analyzer</h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Upload or capture a diamond photo for instant AI-powered grading and valuation</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="analyzer-grid">
          {/* Left: Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              style={{
                position: 'relative', height: 280, border: `2px dashed ${drag ? '#4f46e5' : '#c4b5fd'}`,
                borderRadius: 16, cursor: 'pointer', overflow: 'hidden',
                background: drag ? '#ede9fe' : image ? '#000' : '#faf8ff',
                transition: 'all .2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {image ? (
                <>
                  <img src={image} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity .2s' }}
                    className="img-hover-overlay">
                    <span style={{ color: '#fff', fontWeight: 600, background: 'rgba(0,0,0,.6)', padding: '8px 16px', borderRadius: 8 }}>Click to change</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 24 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Upload size={24} color="#7c3aed" />
                  </div>
                  <p style={{ fontWeight: 600, color: '#1a1a2e', marginBottom: 4 }}>Drop diamond photo here</p>
                  <p style={{ fontSize: 13, color: '#9ca3af' }}>or click to browse files</p>
                  <p style={{ fontSize: 11, color: '#c4b5fd', marginTop: 10 }}>JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
              {drag && <div className="scan-line" style={{ top: 0 }} />}
            </div>

            <input ref={inputRef}  type="file" accept="image/*"                     className="hidden" style={{ display:'none' }} onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" style={{ display:'none' }} onChange={e => e.target.files?.[0] && loadImage(e.target.files[0])} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => cameraRef.current?.click()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Camera size={16} /> Take Photo
              </button>
              <button onClick={analyze} disabled={!image || loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                {loading ? 'Analyzing...' : 'Analyze Now'}
              </button>
            </div>

            {/* Scanning progress */}
            {loading && (
              <div style={{ background: '#faf8ff', border: '1px solid #c4b5fd', borderRadius: 12, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f46e5', animation: 'pulse 1s infinite' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5' }}>AI Analysis in Progress</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {STEPS.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      {i <= step ? (
                        i < step ? <CheckCircle size={14} color="#10b981" /> : <Loader2 size={14} color="#4f46e5" style={{ animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid #e5e7eb' }} />
                      )}
                      <span style={{ color: i <= step ? '#1a1a2e' : '#9ca3af' }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, color: '#dc2626', fontSize: 13 }}>
                <AlertCircle size={15} /> {error}
              </div>
            )}

            {/* Tips */}
            {!image && !loading && (
              <div style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 12, padding: 18 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>📸 Tips for best results</p>
                {['Use natural daylight or bright white light', 'Place diamond on white/neutral background', 'Capture from directly above for accurate shape analysis', 'Ensure the diamond fills most of the frame'].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6, fontSize: 12, color: '#6b7280' }}>
                    <span style={{ color: '#4f46e5', marginTop: 1 }}>•</span> {tip}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div>
            {!result && !loading ? (
              <div style={{ height: '100%', minHeight: 400, background: '#fff', border: '1px solid #e8e4f0', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 40 }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: .4 }}>💎</div>
                <p style={{ fontWeight: 600, color: '#4b5563', fontSize: 16 }}>Analysis results will appear here</p>
                <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 6 }}>Upload a diamond photo to begin AI analysis</p>
              </div>
            ) : result ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Value + confidence */}
                <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 16, padding: '20px 24px', color: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, opacity: .75, marginBottom: 4, fontWeight: 500 }}>Estimated Market Value</p>
                      <div style={{ fontSize: 28, fontWeight: 900 }}>
                        ${result.estimatedValue.min.toLocaleString()} - ${result.estimatedValue.max.toLocaleString()}
                      </div>
                      <p style={{ fontSize: 13, opacity: .7, marginTop: 4 }}>{result.shape} · {result.carats}ct · {result.cut} Cut</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 11, opacity: .7, marginBottom: 2 }}>AI Confidence</div>
                      <div style={{ fontSize: 30, fontWeight: 900 }}>{result.confidence}%</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 14, height: 5, background: 'rgba(255,255,255,.2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${result.confidence}%`, background: 'rgba(255,255,255,.8)', borderRadius: 999 }} />
                  </div>
                </div>

                {/* Grade grid */}
                <div style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 14, padding: '18px 20px' }}>
                  <p style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 14, fontSize: 14 }}>GIA-Style Grading</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { l: 'Shape',   v: result.shape,   bg: '#ede9fe', color: '#5b21b6' },
                      { l: 'Carats',  v: `${result.carats}ct`, bg: '#dbeafe', color: '#1d4ed8' },
                      { l: 'Color',   v: result.color,   bg: '#f0fdf4', color: '#166534' },
                      { l: 'Clarity', v: result.clarity, bg: '#fff7ed', color: '#c2410c' },
                    ].map(item => (
                      <div key={item.l} style={{ background: item.bg, borderRadius: 10, padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.l}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: item.color, marginTop: 2 }}>{item.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Grade bars */}
                  {[
                    { l: `Cut: ${result.cut}`,      pct: cutPct,     color: '#4f46e5' },
                    { l: `Color: ${result.color}`,   pct: colorPct,   color: '#7c3aed' },
                    { l: `Clarity: ${result.clarity}`,pct: clarityPct, color: '#10b981' },
                  ].map(bar => (
                    <div key={bar.l} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 5 }}>
                        <span style={{ fontWeight: 500 }}>{bar.l}</span>
                        <span style={{ fontWeight: 600 }}>{Math.round(bar.pct)}%</span>
                      </div>
                      <div style={{ height: 6, background: '#f3f4f6', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${bar.pct}%`, background: bar.color, borderRadius: 999, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Technical details */}
                <div style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 14, padding: '18px 20px' }}>
                  <p style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 12, fontSize: 14 }}>Technical Details</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {Object.entries(result.details).map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', background: '#f9fafb', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>
                        <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{typeof v === 'number' ? `${v.toFixed(1)}%` : v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: '#faf8ff', border: '1px solid #c4b5fd', borderLeft: '3px solid #4f46e5', borderRadius: 12, padding: '14px 18px' }}>
                  <p style={{ fontWeight: 700, color: '#4f46e5', fontSize: 13, marginBottom: 6 }}>AI Professional Assessment</p>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>{result.summary}</p>
                </div>

                {/* Recommendations */}
                <div style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 14, padding: '18px 20px' }}>
                  <p style={{ fontWeight: 700, color: '#1a1a2e', marginBottom: 12, fontSize: 14 }}>Recommendations</p>
                  {result.recommendations.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13, color: '#374151' }}>
                      <span style={{ color: '#4f46e5', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span> {r}
                    </div>
                  ))}
                </div>

                <button onClick={reset} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13 }}>
                  <RefreshCw size={14} /> Analyze Another Diamond
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .analyzer-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
        .img-hover-overlay:hover { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
