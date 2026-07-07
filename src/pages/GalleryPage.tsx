import { useState, useMemo } from 'react'
import { Search, Star, TrendingUp } from 'lucide-react'
import { DIAMONDS, DIAMOND_CUTS, type Diamond } from '../data/diamonds'

const RARITY_COLORS: Record<string, string> = {
  'Common':    'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'Uncommon':  'bg-blue-500/20  text-blue-300  border-blue-500/30',
  'Rare':      'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'Very Rare': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Legendary': 'bg-red-500/20   text-red-300   border-red-500/30',
}

function DiamondCard({ d, onClick }: { d: Diamond; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass-card rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 relative"
    >
      {/* Visual */}
      <div className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(168,216,234,0.08) 0%, rgba(212,184,224,0.05) 100%)' }}>
        {hover && (
          <>
            <div className="absolute inset-0 bg-cyan-500/5" />
            {Array.from({length:8}).map((_,i) => (
              <div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-twinkle"
                style={{ left:`${15+i*10}%`, top:`${20+Math.sin(i)*40}%`, background:'rgba(168,216,234,0.8)', animationDelay:`${i*0.2}s` }} />
            ))}
          </>
        )}
        <div className={`text-8xl transition-all duration-300 ${hover ? 'scale-110 animate-prism' : ''}`}
          style={{ filter: hover ? 'drop-shadow(0 0 20px rgba(168,216,234,0.8))' : 'drop-shadow(0 0 10px rgba(168,216,234,0.3))' }}>
          {d.emoji}
        </div>
        {/* Rarity badge */}
        <div className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${RARITY_COLORS[d.rarity]}`}>
          {d.rarity}
        </div>
        {d.rarity === 'Legendary' && (
          <div className="absolute top-3 left-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 animate-sparkle" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-0.5 group-hover:text-cyan-300 transition-colors">{d.name}</h3>
        <p className="text-xs text-slate-500 mb-3">{d.shape} · {d.cut} Cut · {d.origin}</p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label:'Carats', val:`${d.carats}ct` },
            { label:'Color',  val:d.color.length > 3 ? d.color.split(' ')[1] || d.color : d.color },
            { label:'Clarity',val:d.clarity },
          ].map(item => (
            <div key={item.label} className="text-center bg-white/5 rounded-lg py-1.5">
              <div className="text-xs font-bold text-white">{item.val}</div>
              <div className="text-[10px] text-slate-500">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-black text-cyan-300">${d.totalValue.toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">${d.pricePerCarat.toLocaleString()}/ct</div>
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${
            d.cut === 'Excellent' ? 'bg-emerald-500/20 text-emerald-300' :
            d.cut === 'Very Good' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-500/20 text-slate-300'
          }`}>
            <TrendingUp className="w-3 h-3" /> {d.cut}
          </div>
        </div>
      </div>
    </div>
  )
}

function DiamondModal({ d, onClose }: { d: Diamond; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative glass-card rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">✕</button>

        <div className="flex items-start gap-6 mb-6">
          <div className="text-7xl animate-float flex-shrink-0" style={{ filter:'drop-shadow(0 0 20px rgba(168,216,234,0.6))' }}>{d.emoji}</div>
          <div>
            <div className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-2 ${RARITY_COLORS[d.rarity]}`}>{d.rarity}</div>
            <h2 className="text-2xl font-black text-white">{d.name}</h2>
            <p className="text-slate-400 text-sm mt-1">{d.description}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="glass rounded-xl p-4 text-center border border-cyan-500/20">
            <div className="text-2xl font-black text-cyan-300">${d.totalValue.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Total Value</div>
          </div>
          <div className="glass rounded-xl p-4 text-center border border-purple-500/20">
            <div className="text-2xl font-black text-purple-300">${d.pricePerCarat.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-1">Per Carat</div>
          </div>
        </div>

        {/* Grading */}
        <h3 className="font-bold text-white mb-3">Grading Details</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label:'Carat',       val:`${d.carats} ct` },
            { label:'Cut Grade',   val:d.cut },
            { label:'Color',       val:d.color },
            { label:'Clarity',     val:d.clarity },
            { label:'Polish',      val:d.polish },
            { label:'Symmetry',    val:d.symmetry },
            { label:'Fluorescence',val:d.fluorescence },
            { label:'Origin',      val:d.origin },
          ].map(item => (
            <div key={item.label} className="bg-white/5 rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
              <div className="text-sm font-semibold text-white">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Proportions */}
        {d.depth > 0 && (
          <>
            <h3 className="font-bold text-white mb-3">Proportions</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Depth %</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width:`${Math.min(d.depth, 100)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-white">{d.depth}%</span>
                </div>
              </div>
              <div className="glass rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Table %</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width:`${Math.min(d.table, 100)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-white">{d.table}%</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState<'value' | 'carats' | 'name'>('value')
  const [selected, setSelected] = useState<Diamond | null>(null)

  const filtered = useMemo(() => {
    let list = DIAMONDS
    if (category !== 'All') list = list.filter(d => d.category === category)
    if (search) list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.shape.toLowerCase().includes(search.toLowerCase()))
    return [...list].sort((a,b) =>
      sort === 'value'  ? b.totalValue - a.totalValue :
      sort === 'carats' ? b.carats - a.carats : a.name.localeCompare(b.name)
    )
  }, [search, category, sort])

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black shimmer-text mb-3">Diamond Gallery</h1>
          <p className="text-slate-400 text-lg">Browse our collection of {DIAMONDS.length}+ diamonds with full specifications</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search diamonds..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8" />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50">
            <option value="value">Sort: Value</option>
            <option value="carats">Sort: Carats</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DIAMOND_CUTS.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === c ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}>
              {c}
              <span className="ml-1.5 text-xs opacity-60">
                {c === 'All' ? DIAMONDS.length : DIAMONDS.filter(d => d.category === c).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(d => (
            <DiamondCard key={d.id} d={d} onClick={() => setSelected(d)} />
          ))}
        </div>
      </div>

      {selected && <DiamondModal d={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
