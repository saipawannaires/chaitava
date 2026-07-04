'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/site-nav';
import CosmicBg from '@/components/cosmic-bg';
import { Sparkles, Flame, BookOpen, Wind, HandHeart, Sunrise, ArrowRight, TrendingUp, Circle, CheckCircle2 } from 'lucide-react';

const DEFAULT_HABITS = [
  { key: 'meditate', label: 'Meditation', icon: Wind, target: 20, unit: 'min', color: 'from-cyan-400 to-blue-500' },
  { key: 'read', label: 'Reading', icon: BookOpen, target: 30, unit: 'min', color: 'from-amber-400 to-orange-500' },
  { key: 'breathe', label: 'Breathwork', icon: Wind, target: 5, unit: 'min', color: 'from-emerald-400 to-teal-500' },
  { key: 'gratitude', label: 'Gratitude', icon: HandHeart, target: 3, unit: 'notes', color: 'from-rose-400 to-pink-500' },
  { key: 'walk', label: 'Movement', icon: Sunrise, target: 30, unit: 'min', color: 'from-yellow-400 to-amber-500' },
];

function JourneyPage() {
  const [habits, setHabits] = useState({});
  const [reflection, setReflection] = useState('');
  const [streak, setStreak] = useState(0);
  const [dailyPrompt, setDailyPrompt] = useState('');

  useEffect(() => {
    // load from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('chaitava_journey') || '{}');
      setHabits(saved.habits || {});
      setStreak(saved.streak || 0);
      setReflection(saved.reflection || '');
    } catch {}
    // fetch today's daily prompt
    fetch('/api/daily').then(r => r.json()).then(d => setDailyPrompt(d.reflection || d.text || d.prompt || 'What are you grateful for today?')).catch(() => {});
  }, []);

  function saveAll(next) {
    localStorage.setItem('chaitava_journey', JSON.stringify({ habits: next.habits ?? habits, streak: next.streak ?? streak, reflection: next.reflection ?? reflection, updated: new Date().toISOString() }));
  }

  function bumpHabit(key, amount) {
    setHabits(h => {
      const cur = h[key] || 0;
      const nxt = Math.max(0, cur + amount);
      const next = { ...h, [key]: nxt };
      saveAll({ habits: next });
      return next;
    });
  }

  function saveReflection(v) {
    setReflection(v);
    saveAll({ reflection: v });
  }

  const completedToday = DEFAULT_HABITS.filter(h => (habits[h.key] || 0) >= h.target).length;
  const progressPct = Math.round((completedToday / DEFAULT_HABITS.length) * 100);

  return (
    <div className="min-h-screen relative">
      <CosmicBg density={60}/>
      <SiteNav/>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center animate-fadeUp">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-[10px] uppercase tracking-[0.3em] mb-6">
            <Flame size={11} className="text-gold"/> Your Journey
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white leading-[0.95]">
            Today's <span className="italic bg-gradient-to-r from-amber-200 via-[#D4AF37] to-amber-100 bg-clip-text text-transparent">focus</span>.
          </h1>
          <p className="mt-4 text-slate-400">Small, steady, sacred.</p>
        </div>

        {/* Overview — progress ring + streak */}
        <div className="mt-12 glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
          <ProgressRing pct={progressPct}/>
          <div className="flex-1 text-center md:text-left">
            <div className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            <div className="font-serif text-3xl text-white mt-1">{completedToday} of {DEFAULT_HABITS.length} complete</div>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Flame size={16}/> <span className="text-2xl font-serif">{streak}</span><span className="text-slate-400 text-sm">day streak</span>
              </div>
              <div className="text-slate-500 text-sm">·</div>
              <button onClick={() => { const s = streak + 1; setStreak(s); saveAll({ streak: s }); }} className="text-xs text-slate-400 hover:text-white transition underline underline-offset-4">Mark day complete</button>
            </div>
          </div>
        </div>

        {/* Today's Reflection */}
        <div id="reflection" className="mt-6 glass rounded-3xl p-6 md:p-8 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-2 text-[#D4AF37] mb-3">
            <Sunrise size={14}/>
            <div className="text-[10px] uppercase tracking-[0.3em] font-medium">Today's Reflection</div>
          </div>
          <p className="font-serif text-xl md:text-2xl text-white leading-snug">{dailyPrompt}</p>
          <textarea value={reflection} onChange={e => saveReflection(e.target.value)}
            placeholder="Write freely…"
            className="mt-5 w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-slate-200 placeholder:text-slate-600 outline-none focus:border-[#D4AF37]/40 transition resize-y min-h-32 leading-relaxed"/>
          <div className="text-xs text-slate-500 mt-2 flex justify-between">
            <span>Saved locally · {reflection.length} chars</span>
            <Link href="/journal" className="text-slate-400 hover:text-white">View journal history →</Link>
          </div>
        </div>

        {/* Habit Tracker */}
        <div className="mt-6 animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium">Habits</div>
            <div className="text-xs text-slate-500">Tap to record progress</div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {DEFAULT_HABITS.map(h => {
              const cur = habits[h.key] || 0;
              const pct = Math.min(100, Math.round((cur / h.target) * 100));
              const done = cur >= h.target;
              const Icon = h.icon;
              return (
                <div key={h.key} className="glass rounded-2xl p-5 flex items-center gap-4">
                  <button onClick={() => bumpHabit(h.key, h.target / 5)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition ${done ? `bg-gradient-to-br ${h.color} text-black` : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.10]'}`}>
                    {done ? <CheckCircle2 size={18}/> : <Icon size={18}/>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-white text-sm font-medium">{h.label}</div>
                      <div className="text-xs text-slate-400 tabular-nums">{cur}/{h.target}{h.unit === 'notes' ? '' : ' ' + h.unit}</div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${h.color} transition-all duration-500`} style={{ width: `${pct}%` }}/>
                    </div>
                  </div>
                  <button onClick={() => bumpHabit(h.key, -h.target / 5)} className="text-slate-500 hover:text-white text-lg leading-none shrink-0">−</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deeper practices */}
        <div className="mt-10 animate-fadeUp" style={{ animationDelay: '0.25s' }}>
          <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-medium mb-4 px-2">Practices</div>
          <div className="grid sm:grid-cols-2 gap-3">
            <PracticeCard href="/meditate" title="Meditation Timer" desc="1-60 min guided sits with bells" color="from-cyan-500/15 to-blue-500/10 border-cyan-400/20"/>
            <PracticeCard href="/music" title="Sacred Sound" desc="Mantras · bowls · raga" color="from-amber-500/15 to-orange-500/10 border-amber-400/20"/>
            <PracticeCard href="/practices" title="All Practices" desc="Yoga · pranayama · mudras" color="from-emerald-500/15 to-teal-500/10 border-emerald-400/20"/>
            <PracticeCard href="/paths" title="Learning Paths" desc="Guided courses 7-21 days" color="from-purple-500/15 to-fuchsia-500/10 border-purple-400/20"/>
            <PracticeCard href="/challenges" title="Challenges" desc="30-day transformations" color="from-rose-500/15 to-pink-500/10 border-rose-400/20"/>
            <PracticeCard href="/community" title="Community" desc="Share your journey" color="from-indigo-500/15 to-violet-500/10 border-indigo-400/20"/>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ pct }) {
  const size = 108;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none"/>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="url(#gold)" strokeWidth={stroke} strokeLinecap="round" fill="none"
          strokeDasharray={c} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 0.7s ease' }}/>
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4AF37"/>
            <stop offset="100%" stopColor="#f0abfc"/>
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-serif text-3xl text-white leading-none">{pct}%</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">complete</div>
      </div>
    </div>
  );
}

function PracticeCard({ href, title, desc, color }) {
  return (
    <Link href={href} className={`group p-5 rounded-2xl border bg-gradient-to-br ${color} hover:brightness-110 transition text-left flex items-center gap-3`}>
      <div className="flex-1">
        <div className="text-white text-sm font-medium">{title}</div>
        <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
      </div>
      <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition shrink-0"/>
    </Link>
  );
}

export default JourneyPage;
