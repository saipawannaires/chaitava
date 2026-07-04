'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteNav from '@/components/site-nav';
import CosmicBg from '@/components/cosmic-bg';
import { Search, ArrowRight, Compass, Sparkles, User, BookOpen } from 'lucide-react';

const SUGGESTIONS = [
  'What is consciousness?',
  'Why do we suffer?',
  'What happens after death?',
  'How does meditation change the brain?',
  'What is the meaning of the Bhagavad Gita?',
  'What are chakras really?',
];

function App() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => setPlaceholderIdx(i => (i + 1) % SUGGESTIONS.length), 3500);
    return () => clearInterval(iv);
  }, []);

  function submit(e) {
    e?.preventDefault();
    if (!q.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="min-h-screen relative">
      <CosmicBg/>
      <SiteNav/>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
        {/* subtle orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.25), transparent 60%)'
        }}/>

        <div className="relative w-full max-w-3xl text-center animate-fadeUp">
          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] via-fuchsia-400 to-purple-500 flex items-center justify-center shadow-2xl shadow-amber-500/20 relative">
              <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-br from-[#D4AF37]/40 to-transparent blur-md"/>
              <span className="font-serif text-3xl text-black relative">ॐ</span>
            </div>
          </div>

          {/* Tiny label */}
          <div className="text-[10px] uppercase tracking-[0.4em] text-gold mb-4 font-medium">Chaitava · चैतव</div>

          {/* Main headline */}
          <h1 className="font-serif text-6xl md:text-8xl text-white leading-[0.95] text-balance">
            Everything is<br/>
            <span className="italic bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-100 bg-clip-text text-transparent">Connected</span>.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-xl mx-auto text-balance leading-relaxed">
            An AI Universe of Consciousness where Science meets Spirit.
          </p>

          {/* Big search */}
          <form onSubmit={submit} className="mt-14 max-w-2xl mx-auto">
            <div className="text-slate-400 text-sm mb-4 font-medium">What would you like to understand today?</div>
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-fuchsia-500/20 to-purple-500/20 blur-xl opacity-60 group-focus-within:opacity-100 transition"/>
              <div className="relative glass-strong rounded-2xl overflow-hidden">
                <div className="flex items-center px-5 py-4 gap-3">
                  <Search size={20} className="text-slate-400 shrink-0"/>
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder={SUGGESTIONS[placeholderIdx]}
                    className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-base md:text-lg"/>
                  <button type="submit" disabled={!q.trim()}
                    className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition ${q.trim() ? 'bg-[#D4AF37] text-black hover:bg-amber-300' : 'bg-white/5 text-slate-500'}`}>
                    <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button key={s} type="button" onClick={() => { setQ(s); setTimeout(() => inputRef.current?.focus(), 0); }}
                  className="text-xs text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-3 py-1.5 rounded-full transition">
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* 3 CTAs — nothing more */}
          <div className="mt-20 grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <CTA href="/journey" icon={User} title="Continue Journey" sub="Your practice awaits"/>
            <CTA href="/journey#reflection" icon={BookOpen} title="Today's Reflection" sub="A moment to pause"/>
            <CTA href="/discover" icon={Compass} title="Explore Universe" sub="Travel through ideas" primary/>
          </div>
        </div>

        {/* Tiny footer */}
        <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-slate-600">
          Science · Spirit · Philosophy · Consciousness
        </div>
      </section>
    </div>
  );
}

function CTA({ href, icon: Icon, title, sub, primary }) {
  return (
    <Link href={href}
      className={`group relative p-5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5 ${primary
        ? 'bg-gradient-to-br from-[#D4AF37]/15 via-fuchsia-500/10 to-purple-500/10 border border-[#D4AF37]/40 hover:border-[#D4AF37]/70'
        : 'glass hover:bg-white/[0.05]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${primary ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-white/[0.06] text-slate-300 group-hover:text-white'}`}>
          <Icon size={16}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium">{title}</div>
          <div className="text-slate-500 text-xs mt-0.5 truncate">{sub}</div>
        </div>
        <ArrowRight size={14} className={`shrink-0 transition ${primary ? 'text-[#D4AF37]' : 'text-slate-600 group-hover:text-white'}`}/>
      </div>
    </Link>
  );
}

export default App;
