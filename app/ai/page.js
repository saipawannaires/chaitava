'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SiteNav from '@/components/site-nav';
import CosmicBg from '@/components/cosmic-bg';
import { Search, ArrowRight, Sparkles, Loader2, Lightbulb, ScrollText, Users, Heart, Compass } from 'lucide-react';

const STARTER = [
  'What is consciousness, really?',
  'Why do humans suffer?',
  'Is there scientific evidence for karma?',
  'What did the Buddha actually teach?',
  'How does meditation change the brain?',
  'What is time?',
  'Are chakras real?',
  'What happens when we die?',
  'How are science and spirituality related?',
];

function AiHubInner() {
  const params = useSearchParams();
  const initialQ = params.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialQ) ask(initialQ);
    // eslint-disable-next-line
  }, []);

  async function ask(question) {
    const clean = (question ?? q).trim();
    if (!clean || loading) return;
    setLoading(true); setError(''); setAnswer(null);
    try {
      const res = await fetch('/api/guru', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: clean })
      });
      const data = await res.json();
      if (data.error) setError(data.error); else setAnswer(data);
    } catch (e) { setError('Please try again.'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen relative">
      <CosmicBg density={80}/>
      <SiteNav/>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-16">
        {/* header */}
        <div className="text-center animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.3em] mb-6">
            <Sparkles size={11}/> Chaitava AI
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-[0.95]">
            Ask <span className="italic bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-100 bg-clip-text text-transparent">anything</span>.
          </h1>
          <p className="mt-4 text-slate-400 text-base">Answers grounded in science, tradition, philosophy, and history.</p>
        </div>

        {/* Big input */}
        <form onSubmit={e => { e.preventDefault(); ask(); }} className="mt-10">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#D4AF37]/20 via-fuchsia-500/20 to-purple-500/20 blur-xl opacity-40 group-focus-within:opacity-90 transition"/>
            <div className="relative glass-strong rounded-2xl">
              <div className="flex items-center px-5 py-4 gap-3">
                <Search size={20} className="text-slate-400 shrink-0"/>
                <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
                  placeholder="e.g. What is consciousness?"
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-slate-500 text-base md:text-lg"/>
                <button type="submit" disabled={!q.trim() || loading}
                  className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition ${q.trim() ? 'bg-[#D4AF37] text-black hover:bg-amber-300' : 'bg-white/5 text-slate-500'}`}>
                  {loading ? <Loader2 size={18} className="animate-spin"/> : <ArrowRight size={18}/>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Starter chips (before first answer) */}
        {!answer && !loading && (
          <div className="mt-8 flex flex-wrap justify-center gap-2 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
            {STARTER.map(s => (
              <button key={s} onClick={() => { setQ(s); ask(s); }}
                className="text-xs text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] px-3.5 py-2 rounded-full transition">
                {s}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="mt-14 text-center">
            <div className="inline-flex items-center gap-2 text-slate-400">
              <Loader2 size={16} className="animate-spin text-[#D4AF37]"/> Chaitava AI is weaving perspectives…
            </div>
          </div>
        )}

        {error && <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm text-center">{error}</div>}

        {/* Answer */}
        {answer && !loading && (
          <div className="mt-14 space-y-4 animate-fadeUp">
            <div className="text-center mb-8">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">Your question</div>
              <div className="font-serif text-2xl md:text-3xl text-white mt-2">“{answer.question}”</div>
            </div>

            <Section icon={Lightbulb} label="Scientific Perspective" color="text-cyan-300" body={answer.scientific}/>
            <Section icon={Heart} label="Spiritual Traditions" color="text-fuchsia-300" body={answer.spiritual}/>
            <Section icon={ScrollText} label="Philosophical Perspective" color="text-amber-300" body={answer.philosophical}/>
            <Section icon={Users} label="Historical Context" color="text-emerald-300" body={answer.historical}/>

            {answer.synthesis && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 via-fuchsia-500/8 to-purple-500/8 border border-[#D4AF37]/30">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2">Synthesis</div>
                <p className="text-white leading-relaxed italic">{answer.synthesis}</p>
              </div>
            )}

            {answer.reflection && (
              <div className="p-6 rounded-2xl glass text-center">
                <div className="text-[10px] uppercase tracking-[0.3em] text-purple-300 mb-2">Sit with this</div>
                <p className="font-serif text-xl md:text-2xl text-white leading-snug">{answer.reflection}</p>
              </div>
            )}

            {answer.action && (
              <div className="p-5 rounded-2xl glass border border-emerald-400/20">
                <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-2">One small action today</div>
                <p className="text-slate-200 leading-relaxed">{answer.action}</p>
              </div>
            )}

            {answer.related && answer.related.length > 0 && (
              <div className="p-5 rounded-2xl glass">
                <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mb-3">Related to explore</div>
                <div className="flex flex-wrap gap-2">
                  {answer.related.map((r, i) => (
                    <button key={i} onClick={() => { setQ(r); ask(r); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="text-xs text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-3 py-1.5 rounded-full transition">
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-8 text-center">
              <button onClick={() => { setAnswer(null); setQ(''); inputRef.current?.focus(); }}
                className="text-sm text-slate-400 hover:text-white transition">
                Ask another →
              </button>
            </div>
          </div>
        )}

        {/* Bottom link cluster */}
        {!answer && !loading && (
          <div className="mt-24 grid sm:grid-cols-3 gap-3">
            <MiniLink href="/discover" title="Explore Universe" sub="77+ concept planets"/>
            <MiniLink href="/journey" title="Your Journey" sub="Habits · Journal · Streak"/>
            <MiniLink href="/masters" title="Chat with a Master" sub="Rumi, Buddha, Krishna…"/>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon: Icon, label, color, body }) {
  if (!body) return null;
  return (
    <div className="p-6 rounded-2xl glass">
      <div className={`flex items-center gap-2 ${color} mb-3`}>
        <Icon size={14}/>
        <div className="text-[10px] uppercase tracking-[0.3em] font-medium">{label}</div>
      </div>
      <p className="text-slate-200 leading-relaxed">{body}</p>
    </div>
  );
}

function MiniLink({ href, title, sub }) {
  return (
    <a href={href} className="group p-4 rounded-2xl glass hover:bg-white/[0.05] transition text-left flex items-center gap-3">
      <div className="flex-1">
        <div className="text-white text-sm font-medium">{title}</div>
        <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
      </div>
      <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition shrink-0"/>
    </a>
  );
}

export default function AiHub() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050816]"/>}>
      <AiHubInner/>
    </Suspense>
  );
}
