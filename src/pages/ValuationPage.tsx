import { useState, useMemo } from 'react'
import { Calculator, Info } from 'lucide-react'
import { CUT_GRADES, COLOR_GRADES, CLARITY_GRADES, PRICING_GUIDE, VALUE_FACTORS } from '../data/diamonds'

const CUT_MULT:   Record<string,number> = { Ideal:1.3, Excellent:1.2, 'Very Good':1.0, Good:0.85, Fair:0.7, Poor:0.55 }
const COLOR_MULT: Record<string,number> = { D:1.5, E:1.35, F:1.2, G:1.1, H:1.0, I:0.9, J:0.8, K:0.7, L:0.6, M:0.5 }
const CLARITY_MULT: Record<string,number> = { FL:1.6, IF:1.5, VVS1:1.35, VVS2:1.25, VS1:1.15, VS2:1.05, SI1:0.9, SI2:0.78, I1:0.6, I2:0.45, I3:0.35 }
const BASE_PPC = 4500 // base price per carat in USD

function calcValue(carats: number, cut: string, color: string, clarity: string) {
  const cm = CUT_MULT[cut] ?? 1
  const colm = COLOR_MULT[color] ?? 1
  const clm = CLARITY_MULT[clarity] ?? 1
  const magicBonus = carats >= 2 ? 1.4 : carats >= 1.5 ? 1.25 : carats >= 1 ? 1.15 : carats >= 0.5 ? 1.05 : 1
  const ppc = BASE_PPC * cm * colm * clm * magicBonus
  const base = ppc * carats
  return { ppc: Math.round(ppc), total: Math.round(base), low: Math.round(base * 0.85), high: Math.round(base * 1.25) }
}

export default function ValuationPage() {
  const [carats, setCarats] = useState(1.0)
  const [cut, setCut] = useState('Excellent')
  const [color, setColor] = useState('G')
  const [clarity, setClarity] = useState('VS1')
  const [shape, setShape] = useState('Round')
  const [currency, setCurrency] = useState<'USD'|'INR'|'EUR'>('USD')

  const val = useMemo(() => calcValue(carats, cut, color, clarity), [carats, cut, color, clarity])
  const rates = { USD: 1, INR: 83.5, EUR: 0.92 }
  const sym = { USD: '$', INR: '₹', EUR: '€' }
  const rate = rates[currency]
  const s = sym[currency]

  const fmt = (n: number) => Math.round(n * rate).toLocaleString()

  const grade = () => {
    const cutS = Object.keys(CUT_MULT).indexOf(cut)
    const colS = COLOR_GRADES.indexOf(color)
    const clS = CLARITY_GRADES.indexOf(clarity)
    const avg = (cutS/5 + colS/9 + clS/9) / 3
    if (avg < 0.2) return { label:'Investment Grade', color:'text-emerald-300', bg:'bg-emerald-500/10 border-emerald-500/30' }
    if (avg < 0.4) return { label:'Premium Quality',  color:'text-cyan-300',    bg:'bg-cyan-500/10 border-cyan-500/30' }
    if (avg < 0.6) return { label:'Commercial Grade', color:'text-blue-300',    bg:'bg-blue-500/10 border-blue-500/30' }
    return { label:'Budget Friendly', color:'text-slate-300', bg:'bg-slate-500/10 border-slate-500/30' }
  }
  const gradeInfo = grade()

  const shapes = ['Round','Princess','Oval','Emerald','Pear','Cushion','Heart','Marquise','Asscher','Radiant']
  const shapeBonus: Record<string,number> = { Round:1.1, Princess:1.0, Oval:1.05, Emerald:0.95, Pear:1.0, Cushion:1.0, Heart:1.02, Marquise:0.98, Asscher:0.97, Radiant:1.0 }

  const shapeAdj = val.total * (shapeBonus[shape] ?? 1)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black shimmer-text mb-3">Diamond Valuation</h1>
          <p className="text-slate-400 text-lg">Enter the 4Cs to get an accurate market value estimate</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Controls */}
          <div className="lg:col-span-2 space-y-5">
            {/* Carat */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                <span className="text-cyan-400">⚖️</span> Carat Weight
                <span className="ml-auto float-right text-2xl font-black text-cyan-300">{carats.toFixed(2)} ct</span>
              </label>
              <input type="range" min={0.1} max={10} step={0.01} value={carats}
                onChange={e => setCarats(+e.target.value)}
                className="w-full accent-cyan-500 cursor-pointer" />
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>0.10 ct</span><span>5.00 ct</span><span>10.00 ct</span>
              </div>
              {[0.5,1.0,1.5,2.0,3.0,5.0].map(v => (
                <button key={v} onClick={() => setCarats(v)}
                  className={`mr-1.5 mt-2 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${carats === v ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  {v}ct
                </button>
              ))}
            </div>

            {/* Cut */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">✂️ Cut Grade</label>
              <div className="grid grid-cols-3 gap-2">
                {CUT_GRADES.map(g => (
                  <button key={g} onClick={() => setCut(g)}
                    className={`py-2 rounded-xl text-xs font-semibold transition-all ${cut === g ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                🎨 Color Grade
                <span className="ml-2 text-xs text-slate-500">D = colorless · M = yellow</span>
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {COLOR_GRADES.map(g => (
                  <button key={g} onClick={() => setColor(g)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${color === g ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Clarity */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                🔍 Clarity Grade
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {CLARITY_GRADES.map(g => (
                  <button key={g} onClick={() => setClarity(g)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${clarity === g ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Shape */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">💎 Shape</label>
              <div className="grid grid-cols-5 gap-1.5">
                {shapes.map(g => (
                  <button key={g} onClick={() => setShape(g)}
                    className={`py-1.5 rounded-lg text-xs font-medium transition-all ${shape === g ? 'bg-purple-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {g.slice(0,6)}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-slate-300 mb-3">💱 Currency</label>
              <div className="grid grid-cols-3 gap-2">
                {(['USD','INR','EUR'] as const).map(c => (
                  <button key={c} onClick={() => setCurrency(c)}
                    className={`py-2 rounded-xl text-sm font-bold transition-all ${currency === c ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-3 space-y-5">
            {/* Main value card */}
            <div className="glass-card rounded-3xl p-8 border border-cyan-500/20 animate-pulse-glow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Estimated Value ({shape})</p>
                  <div className="text-5xl font-black text-cyan-300">{s}{fmt(shapeAdj)}</div>
                  <p className="text-slate-500 text-sm mt-2">Range: {s}{fmt(shapeAdj*0.85)} - {s}{fmt(shapeAdj*1.25)}</p>
                </div>
                <div className={`border px-3 py-1.5 rounded-full text-sm font-semibold ${gradeInfo.bg} ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label:'Price / Carat', val:`${s}${fmt(val.ppc)}` },
                  { label:'Base Value',    val:`${s}${fmt(val.total)}` },
                  { label:'Shape Premium', val:`${((shapeBonus[shape]??1)-1)*100 > 0 ? '+' : ''}${(((shapeBonus[shape]??1)-1)*100).toFixed(0)}%` },
                ].map(item => (
                  <div key={item.label} className="glass rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{item.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Factor bars */}
              <div className="space-y-3">
                {[
                  { label:`Cut: ${cut}`,          mult:CUT_MULT[cut]??1,     max:1.3,  color:'bg-cyan-500' },
                  { label:`Color: ${color}`,       mult:COLOR_MULT[color]??1, max:1.5,  color:'bg-purple-500' },
                  { label:`Clarity: ${clarity}`,   mult:CLARITY_MULT[clarity]??1,max:1.6,color:'bg-emerald-500' },
                ].map(f => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{f.label}</span>
                      <span>{(f.mult * 100).toFixed(0)}% of base</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${f.color} rounded-full transition-all duration-700`}
                        style={{ width:`${(f.mult/f.max)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Factors */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-cyan-400" /> Value Components
              </h3>
              <div className="space-y-3">
                {VALUE_FACTORS.map(f => (
                  <div key={f.factor} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <span className="text-2xl">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-white text-sm">{f.factor}</span>
                        <span className="text-xs text-cyan-300 font-bold">{f.weight}% weight</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Table */}
            <div className="glass-card rounded-2xl p-6 overflow-x-auto">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-400" /> Market Price Reference (USD, Round Cut)
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-white/10">
                    <th className="text-left py-2 pr-4">Carats</th>
                    <th className="text-right py-2 pr-4">D/VS1</th>
                    <th className="text-right py-2 pr-4">G/VS2</th>
                    <th className="text-right py-2">J/SI1</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_GUIDE.map(row => (
                    <tr key={row.carats} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="py-2 pr-4 text-slate-300 font-medium">{row.carats}</td>
                      <td className="py-2 pr-4 text-emerald-400 text-right">{row.dVs1}</td>
                      <td className="py-2 pr-4 text-cyan-400 text-right">{row.gVs2}</td>
                      <td className="py-2 text-purple-400 text-right">{row.jSi1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
