import { useState, useRef } from 'react'
import { Send, Sparkles, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

const PORTKEY_URL = 'https://portkeygateway.perficient.com/v1'
const MODEL = '@dsvertex/anthropic.claude-sonnet-4-6'

interface DesignResult {
  title: string
  style: string
  centerStone: string
  metal: string
  accentDetails: string
  estimatedCost: string
  careInstructions: string
  description: string
  specifications: Array<{ key: string; value: string }>
}

const STYLE_PRESETS = [
  { label: 'Solitaire Ring',     icon: '💍', prompt: 'Design a classic solitaire diamond engagement ring with a round brilliant 1.5ct center stone, platinum band, and six prong setting.' },
  { label: 'Tennis Bracelet',    icon: '💎', prompt: 'Design an elegant diamond tennis bracelet with 3ct total weight, round diamonds in a four-prong setting, 18k white gold, 7 inches long.' },
  { label: 'Drop Earrings',      icon: '✨', prompt: 'Design a pair of diamond drop earrings with pear-shaped 0.8ct diamonds, surrounded by a halo of micro-pave diamonds, yellow gold setting.' },
  { label: 'Halo Necklace',      icon: '📿', prompt: 'Design a diamond halo pendant necklace with a 1ct princess cut center diamond surrounded by 32 round brilliant pave diamonds, rose gold chain.' },
  { label: 'Three-Stone Ring',   icon: '👑', prompt: 'Design a three-stone diamond anniversary ring with a 2ct oval center flanked by two 0.75ct round side stones, platinum band with channel-set diamonds.' },
  { label: 'Eternity Band',      icon: '🌟', prompt: 'Design a full diamond eternity band with 2mm round brilliant diamonds in a shared-prong setting, 18k white gold, 1ct total weight.' },
]

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&q=80', label: 'Solitaire Ring' },
  { src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=300&q=80', label: 'Princess Cut' },
  { src: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=300&q=80', label: 'Tennis Bracelet' },
  { src: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300&q=80', label: 'Diamond Earrings' },
  { src: 'https://images.unsplash.com/photo-1630958824521-72f2c921d25c?w=300&q=80', label: 'Halo Pendant' },
  { src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=300&q=80', label: 'Eternity Band' },
]

async function generateDesign(prompt: string, apiKey: string): Promise<DesignResult> {
  const sysPrompt = `You are an expert diamond jewelry designer. Given a jewelry prompt, return ONLY valid JSON:
{"title":"..","style":"..","centerStone":"..","metal":"..","accentDetails":"..","estimatedCost":"$X,XXX - $Y,XXX USD","careInstructions":"..","description":"2-3 sentences","specifications":[{"key":"..","value":".."}]}`

  const res = await fetch(`${PORTKEY_URL}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-portkey-api-key': apiKey },
    body: JSON.stringify({
      model: MODEL, max_tokens: 1200,
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  })
  if (!res.ok) throw new Error('API error')
  const data = await res.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ''
  const m = raw.match(/\{[\s\S]*\}/)
  if (!m) throw new Error('No JSON')
  return JSON.parse(m[0]) as DesignResult
}

function getMockDesign(prompt: string): DesignResult {
  const p = prompt.toLowerCase()
  const isRing = p.includes('ring')
  return {
    title: isRing ? 'Classic Diamond Solitaire' : 'Diamond Jewelry Piece',
    style: isRing ? 'Solitaire / Classic' : 'Contemporary Elegant',
    centerStone: '1.50ct Round Brilliant, D/VS1, Ideal Cut, GIA Certified',
    metal: '950 Platinum, High Polish Finish',
    accentDetails: '18 round brilliant pave diamonds, 0.18ct TW, G/VS2',
    estimatedCost: '$8,500 - $12,000 USD',
    careInstructions: 'Clean weekly with mild soap solution. Professional inspection every 6 months. Store separately in soft pouch. Remove before swimming.',
    description: 'This exquisitely crafted piece showcases a stunning center diamond that captures light from every angle. The precision-set stones create an unbroken line of brilliance. Hand-finished to a mirror polish that complements the diamond\'s fire and scintillation.',
    specifications: [
      { key: 'Total Carat Weight', value: '1.68 ct TW' },
      { key: 'Center Diamond', value: '1.50 ct Round Brilliant' },
      { key: 'Color Grade', value: 'D (Colorless)' },
      { key: 'Clarity Grade', value: 'VS1 (Very Slightly Included)' },
      { key: 'Cut Grade', value: 'Ideal' },
      { key: 'Metal', value: '950 Platinum' },
      { key: 'Setting Type', value: isRing ? '4-Prong Cathedral' : 'Channel Set' },
      { key: 'Finish', value: 'High Polish' },
      { key: 'Certification', value: 'GIA Certified' },
      { key: 'Est. Weight', value: isRing ? '4.2g' : '12.6g' },
    ],
  }
}

export default function DesignerPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DesignResult | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const apiKey = import.meta.env.VITE_PORTKEY_API_KEY as string | undefined

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Please describe your jewelry design first'); return }
    setLoading(true)
    setResult(null)
    try {
      const design = apiKey ? await generateDesign(prompt, apiKey) : (await new Promise<void>(r => setTimeout(r, 1800)), getMockDesign(prompt))
      setResult(design)
      toast.success('Design generated!')
    } catch {
      toast.error('Using sample design (API unavailable)')
      setResult(getMockDesign(prompt))
    } finally {
      setLoading(false)
    }
  }

  const usePreset = (p: string) => {
    setPrompt(p)
    textareaRef.current?.focus()
  }

  return (
    <div style={{ background: '#f8f5f0', minHeight: '100vh', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-label">AI Designer</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#1a1a2e', marginBottom: 6 }}>
            AI Jewelry Designer
          </h1>
          <p style={{ color: '#6b7280', fontSize: 15 }}>Describe your dream piece in natural language - our AI creates professional design specs</p>
          <div className="accent-line" style={{ marginTop: 16, width: 60 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }} className="des-grid">
          {/* Left: input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Prompt area */}
            <div className="card-flat" style={{ padding: 20 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Sparkles size={14} color="#4f46e5" /> Describe Your Design
              </label>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. A romantic engagement ring with a 1.5ct oval diamond center stone, surrounded by a halo of small round diamonds, in rose gold with a diamond-studded band..."
                className="input"
                rows={5}
                style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{prompt.length} chars</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setPrompt(''); setResult(null) }} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #e5e7eb', background: '#fff', color: '#6b7280', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <RefreshCw size={13} /> Clear
                  </button>
                  <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                    {loading ? (
                      <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> Designing...</>
                    ) : (
                      <><Send size={14} /> Generate Design</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="card-flat" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Quick Presets</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {STYLE_PRESETS.map(p => (
                  <button key={p.label} onClick={() => usePreset(p.prompt)} style={{
                    padding: '9px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                    border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'all .15s',
                  }}>
                    <span style={{ fontSize: 18 }}>{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inspiration gallery */}
            <div className="card-flat" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Inspiration Gallery</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {GALLERY_IMAGES.map(img => (
                  <div key={img.label} style={{ borderRadius: 10, overflow: 'hidden', position: 'relative', aspectRatio: '1', background: '#f3f0ff' }}>
                    <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)', padding: '10px 6px 5px', color: '#fff', fontSize: 9, fontWeight: 600, textAlign: 'center' }}>
                      {img.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: result */}
          <div>
            {!result && !loading && (
              <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>✨</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Your Design Awaits</h3>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
                  Choose a preset or type your own description, then click Generate Design to create a professional specification.
                </p>
                <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['AI-Powered', 'GIA Standard', 'Instant Results'].map(t => (
                    <span key={t} style={{ background: '#ede9fe', color: '#4f46e5', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999 }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="card-flat" style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a2e', marginBottom: 8 }}>Crafting Your Design</div>
                <p style={{ fontSize: 14, color: '#9ca3af' }}>Our AI jewelry designer is at work...</p>
                <div style={{ marginTop: 20, height: 4, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 999, animation: 'shimmerMove 1.5s ease-in-out infinite' }} />
                </div>
              </div>
            )}

            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Title card */}
                <div style={{ background: 'linear-gradient(160deg,#1a1a4e,#4f46e5)', borderRadius: 20, padding: '24px 24px 20px', color: '#fff' }}>
                  <div style={{ fontSize: 11, opacity: .6, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>AI Design Specification</div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{result.title}</h2>
                  <p style={{ fontSize: 13, opacity: .75 }}>Style: {result.style}</p>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ background: 'rgba(255,255,255,.15)', display: 'inline-block', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 600 }}>
                      {result.estimatedCost}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="card-flat" style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 }}>Design Description</p>
                  <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.75, borderLeft: '3px solid #4f46e5', paddingLeft: 12 }}>{result.description}</p>
                </div>

                {/* Key details */}
                <div className="card-flat" style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Key Design Elements</p>
                  {[
                    { label: '💎 Center Stone', value: result.centerStone },
                    { label: '⚙️ Metal',         value: result.metal },
                    { label: '✨ Accents',        value: result.accentDetails },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 14px', marginBottom: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 13, color: '#1a1a2e', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Specifications */}
                <div className="card-flat" style={{ padding: 20 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', marginBottom: 12 }}>Technical Specifications</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {result.specifications.map(s => (
                      <div key={s.key} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px' }}>
                        <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>{s.key}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care */}
                <div className="card-flat" style={{ padding: 16, background: '#fff7ed', borderColor: '#fed7aa' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 5 }}>Care Instructions</p>
                  <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.65 }}>{result.careInstructions}</p>
                </div>

                <button onClick={() => { setResult(null); setPrompt('') }} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1.5px solid #e5e7eb', background: '#fff', color: '#4b5563' }}>
                  Design Another Piece
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .des-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
