import { useState } from 'react'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'

const PORTKEY_BASE = 'https://portkeygateway.perficient.com/v1'
const MODEL = '@dsvertex/anthropic.claude-sonnet-4-6'

interface Design {
  name: string
  type: string
  description: string
  diamonds: { cut: string; carats: number; color: string; clarity: string; count: number }[]
  metalType: string
  estimatedCost: { min: number; max: number }
  careInstructions: string[]
  svgDesign: string
  style: string
}

const TEMPLATES = [
  { label:'Solitaire Ring',       prompt:'Create a classic solitaire engagement ring with a 1.5ct round brilliant diamond in 18k white gold with a 6-prong setting' },
  { label:'Diamond Necklace',     prompt:'Design an elegant diamond tennis necklace with 3ct total weight of VS1 diamonds in a classic bezel setting with platinum chain' },
  { label:'Diamond Earrings',     prompt:'Design a pair of stunning diamond drop earrings with 2ct total pear-shaped diamonds in yellow gold with a halo setting' },
  { label:'Diamond Bracelet',     prompt:'Create a luxury diamond bangle bracelet with 5ct total weight of princess cut diamonds channel-set in rose gold' },
  { label:'Diamond Crown/Tiara',  prompt:'Design a breathtaking diamond tiara with 20ct total weight mixed cuts including round brilliants and pear shapes in platinum' },
  { label:'Cocktail Ring',        prompt:'Create a dramatic cocktail ring with a 3ct cushion cut fancy yellow diamond surrounded by a halo of white round brilliants in 18k yellow gold' },
]

const JEWELRY_TYPES = ['Ring','Necklace','Earrings','Bracelet','Pendant','Brooch','Tiara','Anklet']
const METALS = ['Platinum','18k White Gold','18k Yellow Gold','18k Rose Gold','14k White Gold','Sterling Silver']
const STYLES = ['Classic','Modern','Vintage','Art Deco','Minimalist','Statement','Royal','Bohemian']

function generateMockDesign(prompt: string): Design {
  const types = JEWELRY_TYPES
  const metals = METALS
  const cuts = ['Round Brilliant','Princess','Oval','Cushion','Pear','Marquise','Emerald']
  const colors = ['D','E','F','G','H']
  const clarities = ['FL','IF','VVS1','VVS2','VS1','VS2']
  const type = types.find(t => prompt.toLowerCase().includes(t.toLowerCase())) || types[Math.floor(Math.random()*3)]
  const metal = metals.find(m => prompt.toLowerCase().includes(m.toLowerCase().split(' ').pop()!)) || metals[Math.floor(Math.random()*metals.length)]
  const cut = cuts[Math.floor(Math.random()*cuts.length)]
  const carats = +(Math.random() * 2 + 0.5).toFixed(2)
  const color = colors[Math.floor(Math.random()*colors.length)]
  const clarity = clarities[Math.floor(Math.random()*clarities.length)]
  const baseVal = carats * 8000 * (color === 'D' ? 1.5 : color === 'E' ? 1.3 : 1.1)

  // Generate SVG for the jewelry design
  const svgDesigns: Record<string, string> = {
    Ring: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dg" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="100%" stop-color="#a8d8ea" stop-opacity="0.5"/></radialGradient>
        <radialGradient id="mg" cx="50%" cy="30%"><stop offset="0%" stop-color="#e8e8e8"/><stop offset="100%" stop-color="#8a8a9a"/></radialGradient>
      </defs>
      <ellipse cx="100" cy="130" rx="50" ry="12" fill="url(#mg)" opacity="0.7"/>
      <ellipse cx="100" cy="130" rx="50" ry="12" fill="none" stroke="#c0c0d0" stroke-width="2"/>
      <path d="M50,130 Q50,70 100,65 Q150,70 150,130" fill="url(#mg)" stroke="#c0c0d0" stroke-width="2"/>
      <path d="M50,130 Q50,155 100,158 Q150,155 150,130" fill="none" stroke="#c0c0d0" stroke-width="2"/>
      <polygon points="100,35 115,55 130,55 118,68 123,88 100,75 77,88 82,68 70,55 85,55" fill="url(#dg)" stroke="rgba(168,216,234,0.8)" stroke-width="0.8"/>
      <polygon points="100,35 115,55 100,62" fill="rgba(255,255,255,0.6)"/>
      <polygon points="100,35 85,55  100,62" fill="rgba(168,216,234,0.4)"/>
      <circle cx="100" cy="62" r="3" fill="white" opacity="0.8"/>
      ${Array.from({length:8},(_,i) => `<circle cx="${100+30*Math.cos(i*Math.PI/4)}" cy="${65+15*Math.sin(i*Math.PI/4)}" r="3" fill="rgba(168,216,234,0.6)" stroke="rgba(255,255,255,0.5)" stroke-width="0.5"/>`).join('')}
    </svg>`,
    Necklace: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="dg2" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="100%" stop-color="#a8d8ea" stop-opacity="0.5"/></radialGradient></defs>
      <path d="M20,40 Q100,80 180,40" fill="none" stroke="url(#chainGrad)" stroke-width="3"/>
      <defs><linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c0c0d0"/><stop offset="50%" stop-color="#e8e8f0"/><stop offset="100%" stop-color="#c0c0d0"/></linearGradient></defs>
      ${Array.from({length:16},(_,i) => { const t=i/15; const x=20+160*t; const y=40+40*Math.sin(Math.PI*t); return `<circle cx="${x}" cy="${y}" r="3" fill="#d0d0e0" stroke="#a0a0b0" stroke-width="0.5"/>` }).join('')}
      <polygon points="100,110 112,128 128,128 116,140 120,158 100,148 80,158 84,140 72,128 88,128" fill="url(#dg2)" stroke="rgba(168,216,234,0.8)" stroke-width="0.8"/>
      <polygon points="100,110 112,128 100,134" fill="rgba(255,255,255,0.6)"/>
      <circle cx="100" cy="134" r="2.5" fill="white" opacity="0.8"/>
    </svg>`,
    Earrings: `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="dg3" cx="50%" cy="50%"><stop offset="0%" stop-color="#fff" stop-opacity="0.9"/><stop offset="100%" stop-color="#d4b8e0" stop-opacity="0.5"/></radialGradient></defs>
      <!-- Left earring -->
      <circle cx="60" cy="40" r="8" fill="#d0d0e0" stroke="#a0a0b0" stroke-width="1.5"/>
      <line x1="60" y1="48" x2="60" y2="65" stroke="#d0d0e0" stroke-width="2"/>
      <polygon points="60,65 72,85 80,100 60,130 40,100 48,85" fill="url(#dg3)" stroke="rgba(212,184,224,0.8)" stroke-width="0.8"/>
      <circle cx="60" cy="93" r="4" fill="white" opacity="0.8"/>
      <!-- Right earring -->
      <circle cx="140" cy="40" r="8" fill="#d0d0e0" stroke="#a0a0b0" stroke-width="1.5"/>
      <line x1="140" y1="48" x2="140" y2="65" stroke="#d0d0e0" stroke-width="2"/>
      <polygon points="140,65 152,85 160,100 140,130 120,100 128,85" fill="url(#dg3)" stroke="rgba(212,184,224,0.8)" stroke-width="0.8"/>
      <circle cx="140" cy="93" r="4" fill="white" opacity="0.8"/>
    </svg>`,
  }

  const svgKey = Object.keys(svgDesigns).find(k => type.includes(k)) || 'Ring'

  return {
    name: `${metal.split(' ').slice(-1)[0]} ${cut} ${type}`,
    type,
    description: `An exquisite ${type.toLowerCase()} featuring a stunning ${carats}ct ${cut.toLowerCase()} cut diamond (${color}/${clarity}) set in premium ${metal.toLowerCase()}. This piece embodies elegance and sophistication, crafted to the highest jewelry standards. ${prompt.slice(0, 80)}`,
    diamonds: [
      { cut, carats, color, clarity, count: type === 'Earrings' ? 2 : 1 },
      ...(Math.random() > 0.5 ? [{ cut:'Round Brilliant', carats:+(Math.random()*0.3+0.05).toFixed(2), color:'G', clarity:'VS2', count:Math.floor(Math.random()*12+4) }] : []),
    ],
    metalType: metal,
    estimatedCost: { min: Math.round(baseVal * 0.9), max: Math.round(baseVal * 1.6) },
    careInstructions: [
      'Clean with warm soapy water and a soft brush weekly',
      `Store separately in a soft fabric pouch to prevent scratches on the ${metal.toLowerCase()}`,
      'Remove before swimming, showering, or applying cosmetics',
      'Have professionally cleaned and inspected every 12 months',
      'Check prong integrity every 6 months to prevent stone loss',
    ],
    svgDesign: svgDesigns[svgKey],
    style: STYLES[Math.floor(Math.random()*STYLES.length)],
  }
}

async function generateWithAI(prompt: string): Promise<Design> {
  const apiKey = import.meta.env.VITE_PORTKEY_API_KEY || ''
  const resp = await fetch(`${PORTKEY_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'x-portkey-api-key': apiKey },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        { role:'system', content:'You are a master jewelry designer specializing in diamond jewelry. Generate detailed diamond jewelry designs as JSON.' },
        { role:'user', content:`Create a detailed diamond jewelry design based on: "${prompt}"

Return ONLY valid JSON:
{
  "name": "Design Name",
  "type": "Ring|Necklace|Earrings|Bracelet|Pendant|Brooch|Tiara",
  "description": "2-3 sentence design description",
  "diamonds": [{"cut":"Round Brilliant","carats":1.5,"color":"D","clarity":"VS1","count":1}],
  "metalType": "18k White Gold|Platinum|18k Yellow Gold|18k Rose Gold",
  "estimatedCost": {"min":5000,"max":8000},
  "careInstructions": ["instruction1","instruction2","instruction3"],
  "svgDesign": "<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><!-- simple jewelry SVG --></svg>",
  "style": "Classic|Modern|Vintage|Art Deco"
}` }
      ],
    }),
  })
  if (!resp.ok) throw new Error('API failed')
  const data = await resp.json()
  const text = data.choices[0]?.message?.content ?? ''
  const clean = text.trim().replace(/^```(?:json)?\n?/,'').replace(/\n?```$/,'')
  return JSON.parse(clean) as Design
}

export default function DesignerPage() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [design, setDesign] = useState<Design | null>(null)
  const [selectedType, setSelectedType] = useState('Ring')
  const [selectedMetal, setSelectedMetal] = useState('Platinum')
  const [selectedStyle, setSelectedStyle] = useState('Classic')
  const [activeTab, setActiveTab] = useState<'design'|'specs'|'care'>('design')

  const generate = async (customPrompt?: string) => {
    const p = customPrompt || prompt
    if (!p.trim()) return
    setLoading(true)
    try {
      const d = await generateWithAI(p)
      setDesign(d)
    } catch {
      setDesign(generateMockDesign(p))
    }
    setLoading(false)
    setActiveTab('design')
  }

  const buildPrompt = () => {
    return `Create a ${selectedStyle.toLowerCase()} ${selectedType.toLowerCase()} in ${selectedMetal}${prompt ? ' — ' + prompt : ''}`
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black shimmer-text mb-3">AI Jewelry Designer</h1>
          <p className="text-slate-400 text-lg">Describe your dream diamond jewelry and AI will design it instantly</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Design Controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick selectors */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">Quick Configure</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Jewelry Type</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {JEWELRY_TYPES.map(t => (
                      <button key={t} onClick={() => setSelectedType(t)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === t ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {t.slice(0,6)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Metal</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {METALS.map(m => (
                      <button key={m} onClick={() => setSelectedMetal(m)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-all text-center ${selectedMetal === m ? 'bg-amber-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Style</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {STYLES.map(s => (
                      <button key={s} onClick={() => setSelectedStyle(s)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition-all ${selectedStyle === s ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {s.slice(0,8)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-bold text-white mb-3">
                ✨ Describe Your Vision
              </label>
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                rows={4}
                placeholder="E.g. A vintage-inspired halo engagement ring with a 2ct oval diamond, surrounded by small round diamonds, set in rose gold with a twisted band..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none"
              />
              <button
                onClick={() => generate(buildPrompt())}
                disabled={loading}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition-all">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Designing...' : 'Generate Design'}
              </button>
            </div>

            {/* Templates */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3 text-sm">Quick Prompts</h3>
              <div className="space-y-2">
                {TEMPLATES.map(t => (
                  <button key={t.label} onClick={() => { setPrompt(t.prompt); generate(t.prompt) }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-transparent hover:border-cyan-500/30">
                    <span className="font-medium text-cyan-400">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Result */}
          <div className="lg:col-span-3">
            {!design && !loading ? (
              <div className="glass-card rounded-3xl h-full min-h-96 flex flex-col items-center justify-center text-center p-12">
                <div className="text-8xl mb-6 opacity-30 animate-float">💍</div>
                <p className="text-slate-500 font-medium text-lg">Your design will appear here</p>
                <p className="text-slate-600 text-sm mt-2">Choose a template or describe your dream jewelry</p>
              </div>
            ) : loading ? (
              <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center min-h-96 border border-cyan-500/30 animate-pulse-glow">
                <div className="text-6xl mb-6 animate-prism">💎</div>
                <p className="text-cyan-300 font-bold text-lg mb-4">AI is designing your jewelry...</p>
                <div className="space-y-2 w-full max-w-xs">
                  {['Interpreting your vision...','Selecting diamond cuts...','Designing metal setting...','Calculating value...'].map((s,i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                      <Loader2 className="w-3 h-3 animate-spin text-cyan-500" />{s}
                    </div>
                  ))}
                </div>
              </div>
            ) : design ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-medium">{design.style}</span>
                      <span className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium">{design.type}</span>
                    </div>
                    <h2 className="text-2xl font-black text-white">{design.name}</h2>
                    <p className="text-slate-400 text-sm mt-1">{design.metalType}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-slate-500">Est. Value</div>
                    <div className="text-xl font-black text-cyan-300">${design.estimatedCost.min.toLocaleString()} - ${design.estimatedCost.max.toLocaleString()}</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  {['design','specs','care'].map(t => (
                    <button key={t} onClick={() => setActiveTab(t as any)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${activeTab === t ? 'bg-cyan-500 text-white' : 'glass border border-white/10 text-slate-400 hover:text-white'}`}>
                      {t === 'design' ? '🎨 Design' : t === 'specs' ? '💎 Specs' : '🔧 Care'}
                    </button>
                  ))}
                </div>

                {activeTab === 'design' && (
                  <div className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-center mb-6"
                      style={{ background:'radial-gradient(ellipse at center, rgba(168,216,234,0.1) 0%, transparent 70%)', minHeight:200 }}>
                      <div className="w-52 h-52 animate-float"
                        dangerouslySetInnerHTML={{ __html: design.svgDesign.replace(/'/g,'"') }}
                        style={{ filter:'drop-shadow(0 0 20px rgba(168,216,234,0.4))' }} />
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{design.description}</p>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="space-y-4">
                    <div className="glass-card rounded-2xl p-5">
                      <h3 className="font-bold text-white mb-4">Diamond Specifications</h3>
                      {design.diamonds.map((d, i) => (
                        <div key={i} className="grid grid-cols-5 gap-3 mb-3 bg-white/5 rounded-xl p-3">
                          {[
                            { l:'Cut', v:d.cut },
                            { l:'Carats', v:`${d.carats}ct` },
                            { l:'Color', v:d.color },
                            { l:'Clarity', v:d.clarity },
                            { l:'Count', v:`× ${d.count}` },
                          ].map(item => (
                            <div key={item.l} className="text-center">
                              <div className="text-xs text-slate-500">{item.l}</div>
                              <div className="text-sm font-bold text-white mt-0.5">{item.v}</div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card rounded-xl p-4">
                        <div className="text-xs text-slate-500 mb-1">Metal</div>
                        <div className="font-bold text-white">{design.metalType}</div>
                      </div>
                      <div className="glass-card rounded-xl p-4">
                        <div className="text-xs text-slate-500 mb-1">Style</div>
                        <div className="font-bold text-white">{design.style}</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-bold text-white mb-4">Care Instructions</h3>
                    <ul className="space-y-3">
                      {design.careInstructions.map((c, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                          <span className="text-cyan-400 text-base mt-0.5 flex-shrink-0">{['💧','📦','🚿','🔎','🔩'][i] ?? '✦'}</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button onClick={() => setDesign(null)}
                  className="w-full flex items-center justify-center gap-2 glass border border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-white py-3 rounded-xl transition-all text-sm">
                  <RefreshCw className="w-4 h-4" /> Design Another Piece
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
