import { useState, useEffect, useRef } from 'react';
import { Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = { role: 'user' | 'assistant'; content: string };

// ─── Constants ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are DiamondAI Assistant, an expert gemologist embedded in the DiamondAI platform. Answer questions about:
- Diamond 4Cs: Cut (brilliance), Color (D=colorless best), Clarity (FL=flawless best), Carat (weight)
- Diamond types: round brilliant, princess, emerald, oval, marquise, cushion, pear, heart, asscher, radiant
- Colored diamonds: blue (boron), pink (lattice distortion), yellow (nitrogen), green (radiation), red (rarest)
- Famous diamonds: Koh-i-Noor (105.6ct, India), Hope Diamond (45.52ct, blue, Smithsonian), Cullinan (3106ct, largest ever), Pink Star ($71.2M), Dresden Green
- Pricing: round brilliant 1ct D/VS1 ~$10,000-22,000; colored diamonds 10-100x premium
- Lab-grown diamonds: chemically identical, 60-80% cheaper, HPHT or CVD process
- Platform features: AI Analyzer (upload photo for grading), Gallery (25+ diamonds), Valuation Calculator, Diamond History, AI Jewelry Designer, Diamond Comparison tool
Keep answers concise (3-5 sentences), professional yet friendly. Use GIA terminology. Never give specific financial advice.`;

const SUGGESTED = [
  'What are the 4Cs?',
  'How are diamonds valued?',
  'What is the rarest diamond?',
  'Blue vs Pink diamond?',
  'Natural vs Lab-grown?',
  'How to clean diamonds?',
];

const WELCOME: Message = {
  role: 'assistant',
  content:
    "Hi! I'm your Diamond AI Assistant. Ask me anything about diamonds — grading, values, famous gems, history, or how to use this platform! 💎",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hslRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function getLocalResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('4c') || (t.includes('cut') && t.includes('color')) || t.includes('grading')) {
    return "The 4Cs are Cut, Color, Clarity, and Carat. Cut (most important at ~35% of value) determines brilliance and fire. Color is graded D (colorless) to Z (light yellow). Clarity ranges from FL (flawless) to I3 (included). Carat measures weight — 1 carat = 0.2 grams.";
  }
  if (t.includes('value') || t.includes('price') || t.includes('cost') || t.includes('worth') || t.includes('how much')) {
    return "A 1ct round brilliant D/VS1 diamond typically ranges $10,000–$22,000. Colored diamonds carry a 10–100× premium over white diamonds. Fancy Vivid pink or blue stones can reach millions per carat. Use our Valuation Calculator for personalized estimates based on your stone's specific specs.";
  }
  if (t.includes('famous') || t.includes('koh') || t.includes('hope') || t.includes('cullinan') || t.includes('pink star')) {
    return "The most famous diamonds include the Cullinan (3,106ct — largest ever found), the Hope Diamond (45.52ct blue, now at the Smithsonian), the Koh-i-Noor (105.6ct, India, now in the British Crown Jewels), and the Pink Star (59.6ct, sold for $71.2M). The Dresden Green is the largest natural green diamond at 41ct.";
  }
  if (t.includes('blue') || t.includes('pink') || t.includes('red') || t.includes('green') || t.includes('colored') || t.includes('colour')) {
    return "Colored diamonds get their hues from trace elements or structural anomalies. Blue = boron impurities, Yellow = nitrogen, Green = natural radiation exposure, Pink = plastic deformation of the crystal lattice. Red diamonds are the rarest — fewer than 30 are known to exist. Fancy Vivid colors command the highest premiums.";
  }
  if (t.includes('lab') || t.includes('grown') || t.includes('synthetic') || t.includes('natural')) {
    return "Lab-grown diamonds are chemically, physically, and optically identical to natural diamonds. They're created via HPHT (High Pressure High Temperature) or CVD (Chemical Vapor Deposition) and cost 60–80% less than natural equivalents. The key difference is origin and resale value — natural diamonds retain value better due to rarity.";
  }
  if (t.includes('buy') || t.includes('purchase') || t.includes('choose') || t.includes('select')) {
    return "When buying a diamond, prioritize Cut first — it's the biggest driver of beauty. For best value, target G–H color (near-colorless, invisible to the naked eye) and VS2–SI1 clarity. Use our Diamond Comparison tool to evaluate stones side by side, and always request a GIA or AGS grading report.";
  }
  if (t.includes('clean') || t.includes('care') || t.includes('maintain')) {
    return "Clean diamonds with warm water, mild dish soap, and a soft toothbrush. Avoid ultrasonic cleaners for stones with inclusions or fracture fillings. Store separately to prevent scratching other jewelry. Remove rings during heavy lifting or gym work. Professional cleaning every 6–12 months keeps settings secure.";
  }
  if (t.includes('history') || t.includes('ancient') || t.includes('india') || t.includes('origin')) {
    return "Diamonds have been treasured for over 3,000 years, first mined in India's Golconda region. Ancient Indians called them 'vajra' (thunderbolt) and used them as talismans. The modern diamond trade expanded with South African discoveries in the 1860s. De Beers' 1947 'A Diamond is Forever' campaign cemented diamonds as the engagement ring standard.";
  }
  if (t.includes('analyze') || t.includes('analyzer') || t.includes('photo') || t.includes('upload')) {
    return "Our AI Analyzer uses computer vision to estimate diamond grades from photos. Upload a clear image of your stone and receive instant assessments of cut quality, estimated color grade, and visible clarity characteristics. While not a replacement for GIA lab grading, it's a powerful first assessment tool available on the platform.";
  }
  return "Great question! I can help with diamond grading (4Cs), valuations, famous gems, history, colored diamonds, and how to use our platform. What would you like to know? 💎";
}

// ─── MiniDiamond ─────────────────────────────────────────────────────────────

interface MiniDiamondProps { size: number }

function MiniDiamond({ size }: MiniDiamondProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const N = 8;
    const R_TABLE = 0.22, R_GIRDLE = 0.50, R_STAR = 0.36;
    const Y_TABLE = 0.34, Y_CROWN = 0.10, Y_GIRDLE = -0.04, Y_PAVIL = -0.30, Y_CULET = -0.70;
    const TILT = 0.30;

    const PHASES: Array<{ h: number; s: number; l: number }> = [
      { h: 210, s: 35, l: 92 },
      { h: 218, s: 88, l: 62 },
      { h: 338, s: 78, l: 76 },
      { h: 48,  s: 90, l: 68 },
      { h: 148, s: 72, l: 60 },
    ];

    let angle = 0;
    let phaseT = 0;

    const cos = Math.cos, sin = Math.sin, PI = Math.PI;
    const rotY = (v: number[], a: number): number[] => [
      v[0] * cos(a) + v[2] * sin(a),
      v[1],
      -v[0] * sin(a) + v[2] * cos(a),
    ];
    const rotX = (v: number[], a: number): number[] => [
      v[0],
      v[1] * cos(a) - v[2] * sin(a),
      v[1] * sin(a) + v[2] * cos(a),
    ];
    const dot = (a: number[], b: number[]) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
    const sub = (a: number[], b: number[]): number[] => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
    const cross = (a: number[], b: number[]): number[] => [
      a[1]*b[2] - a[2]*b[1],
      a[2]*b[0] - a[0]*b[2],
      a[0]*b[1] - a[1]*b[0],
    ];
    const norm = (v: number[]): number[] => {
      const l = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]) || 1;
      return [v[0]/l, v[1]/l, v[2]/l];
    };

    function makeVerts(a: number): number[][] {
      const verts: number[][] = [];
      // table center
      verts.push([0, Y_TABLE, 0]);
      // table ring
      for (let i = 0; i < N; i++) {
        const t = (i / N) * 2 * PI + a;
        verts.push([R_TABLE * cos(t), Y_TABLE, R_TABLE * sin(t)]);
      }
      // crown ring (star)
      for (let i = 0; i < N; i++) {
        const t = ((i + 0.5) / N) * 2 * PI + a;
        verts.push([R_STAR * cos(t), Y_CROWN, R_STAR * sin(t)]);
      }
      // girdle
      for (let i = 0; i < N; i++) {
        const t = (i / N) * 2 * PI + a;
        verts.push([R_GIRDLE * cos(t), Y_GIRDLE, R_GIRDLE * sin(t)]);
      }
      // pavilion bottom
      for (let i = 0; i < N; i++) {
        const t = ((i + 0.5) / N) * 2 * PI + a;
        verts.push([R_STAR * 0.5 * cos(t), Y_PAVIL, R_STAR * 0.5 * sin(t)]);
      }
      // culet
      verts.push([0, Y_CULET, 0]);
      return verts;
    }

    function project(v: number[], fov: number, cx: number, cy: number): [number, number] {
      const z = v[2] + 2.8;
      const scale = fov / Math.max(z, 0.1);
      return [cx + v[0] * scale, cy - v[1] * scale];
    }

    function faceNormal(v0: number[], v1: number[], v2: number[]): number[] {
      return norm(cross(sub(v1, v0), sub(v2, v0)));
    }

    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * PI * 2 - PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.4;
        if (i === 0) ctx.moveTo(cx + rr * cos(a), cy + rr * sin(a));
        else ctx.lineTo(cx + rr * cos(a), cy + rr * sin(a));
      }
      ctx.closePath();
    }

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function currentColor(phT: number): { h: number; s: number; l: number } {
      const total = PHASES.length;
      const idx = Math.floor(phT % total);
      const next = (idx + 1) % total;
      const frac = (phT % 1);
      return {
        h: lerp(PHASES[idx].h, PHASES[next].h, frac),
        s: lerp(PHASES[idx].s, PHASES[next].s, frac),
        l: lerp(PHASES[idx].l, PHASES[next].l, frac),
      };
    }

    function frame() {
      angle += 0.013;
      phaseT += 0.005;
      ctx.clearRect(0, 0, size, size);

      const fov = size * 0.52;
      const cx = size / 2, cy = size / 2 + size * 0.06;

      // raw verts
      const rawVerts = makeVerts(0);

      // transform
      const tverts = rawVerts.map(v => {
        let r = rotY(v, angle);
        r = rotX(r, TILT);
        return r;
      });

      const col = currentColor(phaseT);

      // index layout:
      // 0 = table center
      // 1..N = table ring
      // N+1..2N = star ring (crown)
      // 2N+1..3N = girdle
      // 3N+1..4N = pavilion ring
      // 4N+1 = culet

      type Face = { verts: number[][]; zAvg: number; brightness: number };
      const faces: Face[] = [];

      const light = norm([0.5, 1.0, 0.8]);

      function addFace(idxs: number[]) {
        const vs = idxs.map(i => tverts[i]);
        if (vs.length < 3) return;
        const n = faceNormal(vs[0], vs[1], vs[2]);
        // cull back faces
        if (n[2] < -0.05) return;
        const brightness = Math.max(0, dot(n, light));
        const zAvg = vs.reduce((s, v) => s + v[2], 0) / vs.length;
        faces.push({ verts: vs, zAvg, brightness });
      }

      // table face (top polygon)
      addFace([0, ...Array.from({ length: N }, (_, i) => i + 1)]);

      // crown kite faces: table edge → star point → girdle → star point
      for (let i = 0; i < N; i++) {
        const t0 = i + 1;
        const t1 = ((i + 1) % N) + 1;
        const s0 = N + 1 + i;
        const g0 = 2 * N + 1 + i;
        const g1 = 2 * N + 1 + ((i + 1) % N);
        // upper crown triangle: table[i] → table[i+1] → star[i]
        addFace([t0, t1, s0]);
        // lower crown quad: table[i] → star[i] → girdle[i] mapped
        addFace([t0, s0, g0]);
        addFace([t1, g1, s0]);
        addFace([s0, g1, g0]);
      }

      // pavilion faces
      const pavBase = 3 * N + 1;
      const culet = 4 * N + 1;
      for (let i = 0; i < N; i++) {
        const g0 = 2 * N + 1 + i;
        const g1 = 2 * N + 1 + ((i + 1) % N);
        const p0 = pavBase + i;
        const p1 = pavBase + ((i + 1) % N);
        addFace([g0, g1, p0]);
        addFace([g1, p1, p0]);
        addFace([p0, p1, culet]);
      }

      // Z-sort (painter's algorithm)
      faces.sort((a, b) => b.zAvg - a.zAvg);

      // draw faces
      for (const face of faces) {
        const pts = face.verts.map(v => project(v, fov, cx, cy));
        const b = face.brightness;

        let { h, s, l } = col;
        l = Math.min(97, l + b * 22);

        const [r, g, gb] = hslRgb(h, s, l);
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.closePath();

        if (b > 0.75) {
          // white specular flash
          ctx.fillStyle = `rgba(255,255,255,${(b - 0.75) * 2.5})`;
          ctx.fill();
        }
        ctx.fillStyle = `rgb(${r},${g},${gb})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,0.18)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // apex star
      const tableTopPt = project(tverts[0], fov, cx, cy);
      const starSize = 4 + sin(angle * 4) * 1.5;
      drawStar(ctx, tableTopPt[0], tableTopPt[1] - 3, starSize);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fill();

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}

// ─── DiamondChatbot ───────────────────────────────────────────────────────────

export default function DiamondChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const apiKey = import.meta.env.VITE_PORTKEY_API_KEY as string | undefined;

    try {
      if (!apiKey) throw new Error('No API key');

      const res = await fetch('https://portkeygateway.perficient.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-portkey-api-key': apiKey,
        },
        body: JSON.stringify({
          model: '@dsvertex/anthropic.claude-sonnet-4-6',
          max_tokens: 400,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: text.trim() },
          ],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply: string = data?.choices?.[0]?.message?.content ?? getLocalResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      const fallback = getLocalResponse(text);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      if (apiKey) toast.error('AI service unavailable — using local response');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const showSuggested = messages.length < 2;
  const showNotification = !open && messages.length === 0;

  return (
    <>
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes starPulse {
          0%,100% { opacity: 0.5; transform: scale(0.8) rotate(0deg); }
          50%     { opacity: 1;   transform: scale(1.3) rotate(180deg); }
        }
        @keyframes outerGlow {
          0%,100% { box-shadow: 0 0 20px 4px rgba(168,85,247,.45), 0 0 40px 8px rgba(79,70,229,.25); }
          33%     { box-shadow: 0 0 24px 6px rgba(6,182,212,.50), 0 0 48px 10px rgba(6,182,212,.20); }
          66%     { box-shadow: 0 0 22px 5px rgba(236,72,153,.45), 0 0 44px 9px rgba(236,72,153,.20); }
        }
        @media (max-width: 440px) {
          .chatbot-panel { width: calc(100vw - 32px) !important; right: 16px !important; }
          .chatbot-btn-wrap { right: 16px !important; bottom: 16px !important; }
        }
      `}</style>

      {/* Chat Panel */}
      <div
        className="chatbot-panel"
        style={{
          position: 'fixed',
          bottom: 104,
          right: 24,
          zIndex: 999,
          width: 380,
          maxWidth: 'calc(100vw - 48px)',
          height: 520,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,.18), 0 8px 24px rgba(79,70,229,.15)',
          border: '1.5px solid #e8e4f0',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: open
            ? 'all 0.25s cubic-bezier(.34,1.56,.64,1)'
            : 'all 0.2s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            flexShrink: 0,
            background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
            borderRadius: '18px 18px 0 0',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MiniDiamond size={36} />
            <div>
              <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
                Diamond AI
              </div>
              <div style={{ color: 'rgba(255,255,255,.75)', fontSize: 12 }}>
                Ask me anything
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
            }}
          >
            <X size={18} color="#fff" />
          </button>
        </div>

        {/* Suggested questions */}
        {showSuggested && (
          <div
            style={{
              flexShrink: 0,
              padding: '10px 14px 0',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {SUGGESTED.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  background: '#f5f3ff',
                  color: '#4f46e5',
                  border: '1px solid #ede9fe',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '5px 12px',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 14,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div
                key={i}
                style={{
                  alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color: '#fff',
                  borderRadius: '14px 14px 4px 14px',
                  padding: '10px 14px',
                  maxWidth: '82%',
                  fontSize: 13,
                }}
              >
                {msg.content}
              </div>
            ) : (
              <div
                key={i}
                style={{
                  alignSelf: 'flex-start',
                  background: '#f8f5f0',
                  color: '#1a1a2e',
                  borderRadius: '14px 14px 14px 4px',
                  padding: '10px 14px',
                  maxWidth: '88%',
                  fontSize: 13,
                  lineHeight: 1.65,
                }}
              >
                {msg.content}
              </div>
            )
          )}

          {/* Typing indicator */}
          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                background: '#f8f5f0',
                color: '#1a1a2e',
                borderRadius: '14px 14px 14px 4px',
                padding: '10px 14px',
                maxWidth: '88%',
                fontSize: 13,
                display: 'flex',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {[0, 0.15, 0.3].map((delay, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#7c3aed',
                    animation: `dotBounce 1s ease-in-out ${delay}s infinite`,
                  }}
                />
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            flexShrink: 0,
            borderTop: '1px solid #f3f4f6',
            padding: '12px 14px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask about diamonds…"
            style={{
              flex: 1,
              border: '1.5px solid #e5e7eb',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 13,
              resize: 'none',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: loading || !input.trim()
                ? '#c4b5fd'
                : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              border: 'none',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Send size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Floating button — beautiful glowing diamond design */}
      <div
        className="chatbot-btn-wrap"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, width: 80, height: 80 }}
      >
        {/* Spinning rainbow conic border (behind button) */}
        {!open && (
          <div style={{
            position: 'absolute', inset: -3, borderRadius: 22,
            background: 'conic-gradient(from 0deg, #4f46e5, #06b6d4, #10b981, #f59e0b, #ec4899, #a855f7, #4f46e5)',
            animation: 'rotateBorder 2.8s linear infinite',
            zIndex: 0,
          }} />
        )}

        {/* Button face */}
        <div
          onClick={() => setOpen(o => !o)}
          style={{
            position: 'absolute', inset: open ? 0 : 3, borderRadius: open ? 20 : 19,
            background: open
              ? 'linear-gradient(135deg,#4338ca,#6d28d9)'
              : 'linear-gradient(145deg,#1e1b4b 0%,#312e81 40%,#1e1b4b 100%)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
            animation: !open ? 'outerGlow 4s ease-in-out infinite' : 'none',
            transition: 'all .2s ease',
            overflow: 'hidden',
          }}
        >
          {/* Inner radial gleam */}
          {!open && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit',
              background: 'radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.18) 0%, transparent 65%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* Corner sparkle stars — only when closed */}
          {!open && <>
            <div style={{ position:'absolute', top:5, left:6, fontSize:9, animation:'starPulse 2s ease-in-out infinite', lineHeight:1 }}>✦</div>
            <div style={{ position:'absolute', top:6, right:7, fontSize:7, animation:'starPulse 2.4s ease-in-out infinite .6s', lineHeight:1, color:'#a5f3fc' }}>✦</div>
            <div style={{ position:'absolute', bottom:6, left:7, fontSize:7, animation:'starPulse 2.8s ease-in-out infinite 1.1s', lineHeight:1, color:'#f9a8d4' }}>✦</div>
            <div style={{ position:'absolute', bottom:5, right:6, fontSize:9, animation:'starPulse 2.2s ease-in-out infinite 1.7s', lineHeight:1, color:'#fcd34d' }}>✦</div>
          </>}

          {/* Diamond or X */}
          {!open ? (
            <div style={{ position: 'relative', width: 52, height: 52 }}>
              {/* Tiny pulse ring around mini-diamond */}
              <div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168,216,234,0.50) 0%, transparent 68%)',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }} />
              <MiniDiamond size={52} />
            </div>
          ) : (
            <X size={26} color="#fff" />
          )}
        </div>

        {/* Notification dot */}
        {showNotification && (
          <div style={{
            position: 'absolute', top: -2, right: -2, zIndex: 2,
            width: 14, height: 14, borderRadius: '50%',
            background: '#ef4444', border: '2.5px solid #fff',
            boxShadow: '0 0 6px rgba(239,68,68,.6)',
          }} />
        )}
      </div>
    </>
  );
}
