import { Link } from 'react-router-dom'
import AnimatedDiamond from '../components/AnimatedDiamond'

const features = [
  { icon:'🔬', title:'AI Diamond Analyzer',  desc:'Upload or capture a photo for instant cut, clarity, color analysis and accurate valuation.',        to:'/analyzer' },
  { icon:'💎', title:'Diamond Gallery',       desc:'Browse 100+ diamonds with full specifications, rarity scores and market values.',                    to:'/gallery' },
  { icon:'💰', title:'Smart Valuation',       desc:'Enter the 4Cs and get precise market pricing based on real-time diamond market data.',               to:'/valuation' },
  { icon:'📜', title:'Diamond History',       desc:'Explore the complete 3000-year history of diamonds from ancient India to modern lab-grown gems.',   to:'/history' },
  { icon:'✨', title:'Jewelry Designer',      desc:'Describe your dream jewelry in natural language and our AI creates stunning design visualizations.', to:'/designer' },
]

const stats = [
  { value:'25+', label:'Diamond Shapes' },
  { value:'AI',  label:'Powered Analysis' },
  { value:'4Cs', label:'Grading System' },
  { value:'100+',label:'Gallery Items' },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden diamond-bg-pattern">
        {/* Gradient blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(168,216,234,0.8) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,184,224,0.8) 0%, transparent 70%)' }} />

        {/* Animated Diamond */}
        <div className="mb-8 animate-float">
          <AnimatedDiamond size={280} />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-black mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="shimmer-text">DiamondAI</span>
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-3 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          The World's Most Advanced Diamond Intelligence Platform
        </p>
        <p className="text-slate-400 max-w-2xl mb-10 text-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Analyze, value, and design with AI. From rough stones to finished jewelry — we decode every facet.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/analyzer"
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1">
            <span>🔬</span> Analyze Diamond
          </Link>
          <Link to="/gallery"
            className="flex items-center gap-2 glass border border-cyan-500/30 hover:border-cyan-400/60 text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-300 hover:-translate-y-1">
            <span>💎</span> View Gallery
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black shimmer-text">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cyan-500/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-medium mb-4">
              <span>✦</span> Powered by Advanced AI
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="shimmer-text">Everything About Diamonds</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From ancient gemology to cutting-edge AI analysis — your complete diamond intelligence suite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Link key={f.to} to={f.to}
                className="glass-card rounded-2xl p-7 group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4Cs Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 diamond-bg-pattern opacity-50" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold shimmer-text mb-3">The 4Cs of Diamond Quality</h2>
            <p className="text-slate-400">The universal standard for grading and valuing diamonds</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { c:'Cut',     icon:'✂️',  pct:35, desc:'Determines brilliance & fire',    color:'from-cyan-500 to-blue-500' },
              { c:'Color',   icon:'🎨',  pct:25, desc:'D (colorless) to Z (yellow)',      color:'from-purple-500 to-pink-500' },
              { c:'Clarity', icon:'🔍',  pct:20, desc:'Inclusions & blemishes grading',   color:'from-emerald-500 to-teal-500' },
              { c:'Carat',   icon:'⚖️',  pct:20, desc:'Weight determines size & price',  color:'from-amber-500 to-orange-500' },
            ].map(item => (
              <div key={item.c} className="glass-card rounded-2xl p-6 text-center group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-black text-white mb-1">{item.c}</h3>
                <p className="text-slate-400 text-sm mb-4">{item.desc}</p>
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.pct}%` }} />
                </div>
                <div className="text-xs text-slate-500 mt-1.5">Value weight: {item.pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="shimmer-text font-bold text-lg">DiamondAI</span>
        </div>
        <p className="text-slate-500 text-sm">Designed & Developed by <span className="text-cyan-400 font-semibold">Praful Yerojwar</span></p>
        <p className="text-slate-600 text-xs mt-1">AI-Powered Diamond Intelligence Platform</p>
      </footer>
    </div>
  )
}
