import { useState } from 'react'
import { DIAMOND_HISTORY } from '../data/diamonds'

const FAMOUS = [
  { name:'Koh-i-Noor',       carats:105.6,  color:'Colorless',   origin:'India, ~1300',     location:'British Crown Jewels, Tower of London', story:'Meaning "Mountain of Light" in Persian, this legendary diamond has been owned by various Mughal emperors, Persian shahs, Afghan rulers, Sikh rulers, and finally the British Crown. It is now set in the Queen Mother\'s Crown.',  emoji:'👑', rarity:'Legendary' },
  { name:'Hope Diamond',      carats:45.52,  color:'Deep Blue',   origin:'India, ~1668',     location:'Smithsonian Institution, Washington DC', story:'One of the world\'s most famous gems, this 45.52 carat deep blue diamond has a legendary curse attached to it, supposedly bringing misfortune to all who own it. Its unique red phosphorescence under UV light sets it apart.',  emoji:'💙', rarity:'Legendary' },
  { name:'Cullinan Diamond',  carats:3106.75,color:'Colorless',   origin:'South Africa, 1905',location:'Tower of London & British Crown', story:'The largest gem-quality rough diamond ever found, weighing an astounding 3,106.75 carats. Cut into 105 stones, including the Great Star of Africa (530.4 ct) set in the Royal Sceptre.',  emoji:'⭐', rarity:'Legendary' },
  { name:'Orlov Diamond',     carats:189.62, color:'Pale Blue-Green', origin:'India',        location:'Kremlin Armory, Moscow', story:'A historic diamond said to have once been the eye of a Hindu idol, later part of the Great Imperial Sceptre of Russian tsars. Its unique rose-cut reflects the Indian cutting tradition.',  emoji:'💚', rarity:'Legendary' },
  { name:'Dresden Green',     carats:40.7,   color:'Natural Green',origin:'India',           location:'New Green Vault, Dresden', story:'The world\'s largest natural green diamond, its color caused by natural radiation exposure over millions of years. In excellent condition for a stone of its age and size.',  emoji:'🌿', rarity:'Legendary' },
  { name:'Regent Diamond',    carats:140.64, color:'Colorless',   origin:'India, 1698',      location:'Louvre Museum, Paris', story:'Found by a slave in the Golconda mines, purchased by the Governor of Madras, and later adorning Napoleon\'s sword and crown. Now displayed in the Louvre.',  emoji:'⚜️', rarity:'Legendary' },
  { name:'Pink Star',         carats:59.6,   color:'Vivid Pink',  origin:'South Africa, 1999',location:'Private Collection', story:'The most expensive diamond ever sold at auction ($71.2 million in 2017). This internally flawless fancy vivid pink diamond is the largest known of its quality.',  emoji:'🌸', rarity:'Legendary' },
  { name:'Graff Pink',        carats:24.78,  color:'Fancy Pink',  origin:'Unknown',          location:'Private Collection', story:'Sold for $46 million in 2010 at Sotheby\'s Geneva. Previously in the collection of Harry Winston, this exceptional gem is one of the most important pink diamonds ever discovered.',  emoji:'💗', rarity:'Legendary' },
]

const SCIENCE = [
  { title:'Formation',          icon:'🌍', content:'Diamonds form 100-200 km below Earth\'s surface under extreme pressure (45-60 kilobars) and temperature (900-1300°C). This process takes 1-3.3 billion years — diamonds are literally as old as the Earth itself.' },
  { title:'Composition',        icon:'⚛️', content:'Pure diamond is 100% carbon atoms arranged in a crystal lattice structure. Each carbon atom bonds to 4 others in a tetrahedral arrangement, creating the hardest natural substance known (10 on Mohs scale).' },
  { title:'Volcanic Transport', icon:'🌋', content:'Diamonds are carried to Earth\'s surface in kimberlite pipes — ancient volcanic conduits that erupted millions of years ago. The rapid ascent preserved the diamond structure that would otherwise revert to graphite.' },
  { title:'Color Origins',      icon:'🌈', content:'Colorless diamonds are pure carbon. Blue = boron impurities. Yellow = nitrogen. Green = natural radiation. Pink & Red = plastic deformation of crystal lattice (mechanism still debated by scientists). Black = numerous dark inclusions.' },
  { title:'Lab-Grown',          icon:'🔬', content:'HPHT (High Pressure High Temperature) and CVD (Chemical Vapor Deposition) methods create physically and chemically identical diamonds to natural ones. Lab diamonds are now 60-80% cheaper and growing in market share.' },
  { title:'Record Hardness',    icon:'💪', content:'Diamond scores 10/10 on the Mohs scale and has a Vickers hardness of ~10,000 HV — about 4x harder than the next hardest mineral (corundum/sapphire). Only diamond can scratch diamond.' },
]

export default function HistoryPage() {
  const [activeSection, setActiveSection] = useState<'timeline' | 'famous' | 'science'>('timeline')
  const [expandedFamous, setExpandedFamous] = useState<string | null>(null)

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black shimmer-text mb-3">Diamond History</h1>
          <p className="text-slate-400 text-lg">3000 years of wonder, mystery, and brilliant light</p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 mb-10 justify-center flex-wrap">
          {[
            { key:'timeline', label:'📅 Timeline' },
            { key:'famous',   label:'👑 Famous Diamonds' },
            { key:'science',  label:'⚛️ Science of Diamonds' },
          ].map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key as any)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeSection === s.key
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                  : 'glass border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {activeSection === 'timeline' && (
          <div className="relative">
            {/* Line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent" />

            <div className="space-y-8">
              {DIAMOND_HISTORY.map((item, i) => (
                <div key={i} className={`relative flex items-start gap-6 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'} animate-fade-in-up`}
                  style={{ animationDelay: `${i * 0.05}s` }}>
                  {/* Node */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 border-2 border-black shadow-lg">
                      <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-40" />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Card */}
                  <div className={`ml-14 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pl-8' : 'sm:pr-8'}`}>
                    <div className="glass-card rounded-2xl p-5 hover:border-cyan-500/40">
                      <div className="text-cyan-400 font-bold text-sm mb-1">{item.year}</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Famous Diamonds */}
        {activeSection === 'famous' && (
          <div className="space-y-4">
            {FAMOUS.map(d => (
              <div key={d.name}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedFamous(expandedFamous === d.name ? null : d.name)}>
                <div className="p-5 flex items-start gap-5">
                  <div className="text-5xl flex-shrink-0 animate-float" style={{ filter:'drop-shadow(0 0 12px rgba(168,216,234,0.5))' }}>
                    {d.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-xl font-black text-white">{d.name}</h3>
                        <p className="text-slate-500 text-sm">{d.carats} carats · {d.color}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-slate-500">{d.origin}</div>
                        <div className="text-xs text-cyan-400 mt-0.5">📍 {d.location.split(',')[0]}</div>
                      </div>
                    </div>
                    {expandedFamous === d.name && (
                      <p className="mt-3 text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-3 animate-fade-in-up">
                        {d.story}
                      </p>
                    )}
                  </div>
                  <div className="text-slate-500 flex-shrink-0 text-lg transition-transform duration-200" style={{ transform: expandedFamous === d.name ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    ∨
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Science */}
        {activeSection === 'science' && (
          <div className="grid sm:grid-cols-2 gap-5">
            {SCIENCE.map((s, i) => (
              <div key={s.title} className="glass-card rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.content}</p>
              </div>
            ))}

            {/* Mohs scale */}
            <div className="sm:col-span-2 glass-card rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">💎 Mohs Hardness Scale</h3>
              <div className="space-y-2">
                {[
                  {n:1,m:'Talc',pct:10},{n:2,m:'Gypsum',pct:20},{n:3,m:'Calcite',pct:30},{n:4,m:'Fluorite',pct:40},
                  {n:5,m:'Apatite',pct:50},{n:6,m:'Feldspar',pct:60},{n:7,m:'Quartz',pct:70},{n:8,m:'Topaz',pct:80},
                  {n:9,m:'Corundum (Ruby/Sapphire)',pct:90},{n:10,m:'Diamond',pct:100},
                ].map(item => (
                  <div key={item.n} className={`flex items-center gap-3 ${item.n === 10 ? 'opacity-100' : 'opacity-60'}`}>
                    <span className={`text-xs font-bold w-4 ${item.n === 10 ? 'text-cyan-300' : 'text-slate-500'}`}>{item.n}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${item.n === 10 ? 'bg-gradient-to-r from-cyan-500 to-purple-500' : 'bg-slate-600'}`}
                        style={{ width:`${item.pct}%` }} />
                    </div>
                    <span className={`text-xs w-40 truncate ${item.n === 10 ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>{item.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
