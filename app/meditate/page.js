'use client';
import { useEffect, useRef, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Loader2, Sparkles, ChevronLeft } from 'lucide-react';

export default function MeditatePage() {
  const [meds, setMeds] = useState([]);
  const [active, setActive] = useState(null);
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);
  const [minutes, setMinutes] = useState(10);

  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const intRef = useRef(null);

  useEffect(() => { fetch('/api/meditations').then(r => r.json()).then(d => setMeds(d.meditations || [])); }, []);
  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setRemaining(r => { if (r <= 1) { clearInterval(intRef.current); setRunning(false); return 0; } return r - 1; });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  async function beginGuided(m) {
    setActive(m); setScript(''); setLoading(true); setMinutes(m.duration);
    setRemaining(m.duration * 60); setRunning(false);
    try {
      const res = await fetch('/api/guided-meditation', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ meditation_id: m.id, minutes: m.duration }) });
      const data = await res.json();
      setScript(data.script || '');
    } finally { setLoading(false); }
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = minutes * 60 ? ((minutes * 60 - remaining) / (minutes * 60)) * 100 : 0;

  if (active) return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.35), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => { setActive(null); setRunning(false); }} className="text-slate-400 hover:text-white flex items-center gap-1 mb-6"><ChevronLeft size={16}/>All meditations</button>
        <Card className="bg-white/[0.03] border-white/10 backdrop-blur"><CardContent className="p-10 text-center">
          <Badge className={`bg-gradient-to-r ${active.color} border-0 text-white`}>{active.level}</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl text-white mt-4">{active.name}</h1>
          <p className="text-slate-300 mt-2">{active.desc}</p>
          <div className="flex items-center justify-center my-10">
            <div className="relative w-56 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
                <circle cx="50" cy="50" r="46" fill="none" stroke="url(#gg)" strokeWidth="2" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)} />
                <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#f0abfc"/></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-[Cormorant_Garamond,serif] text-6xl text-white">{mm}:{ss}</div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mb-6">{[5, 10, 15, 20, 30].map(m => (
            <button key={m} onClick={() => { setMinutes(m); setRemaining(m * 60); setRunning(false); }} className={`px-3 py-1 rounded-full text-xs border ${minutes === m ? 'bg-purple-500/30 border-purple-300/50 text-white' : 'border-white/10 text-slate-300'}`}>{m}m</button>
          ))}</div>
          <div className="flex justify-center gap-3">
            <Button onClick={() => setRunning(r => !r)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500">{running ? <><Pause size={14} className="mr-1"/>Pause</> : <><Play size={14} className="mr-1"/>Begin</>}</Button>
            <Button variant="outline" onClick={() => { setRunning(false); setRemaining(minutes * 60); }} className="border-white/15 bg-transparent"><RotateCcw size={14} className="mr-1"/>Reset</Button>
          </div>
        </CardContent></Card>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <h3 className="text-white font-semibold mb-3">Steps</h3>
            <ol className="space-y-2">{active.steps.map((s, i) => (<li key={i} className="flex gap-3 text-slate-200 leading-relaxed"><span className="text-purple-300 shrink-0">{i + 1}.</span><span>{s}</span></li>))}</ol>
          </CardContent></Card>
          <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Guided Script (AI)</h3>
              {loading && <Loader2 className="animate-spin text-purple-400" size={14}/>}
            </div>
            {script ? (<div className="text-slate-200 leading-relaxed whitespace-pre-line text-sm max-h-[400px] overflow-y-auto">{script}</div>)
              : (<div className="text-slate-400 text-sm">Generating a calming, personalized script…</div>)}
          </CardContent></Card>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.35), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Meditation Center</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Eight doorways in.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Choose a practice. Get a fresh AI-guided script and an animated timer. Come back tomorrow — the same doorway becomes a different room.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {meds.map(m => (
            <button key={m.id} onClick={() => beginGuided(m)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 hover:border-white/25 hover:bg-white/[0.05] transition relative overflow-hidden">
              <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${m.color} opacity-25 blur-2xl group-hover:opacity-40 transition`}/>
              <div className="relative">
                <Badge className="bg-white/[0.05] border-white/10 text-slate-300 text-[10px]">{m.level}</Badge>
                <div className="text-slate-400 text-xs mt-2">{m.duration} min</div>
                <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mt-3 leading-tight">{m.name}</h3>
                <p className="text-slate-300 text-sm mt-3 leading-relaxed">{m.desc}</p>
                <div className="mt-4 text-purple-300 text-sm opacity-0 group-hover:opacity-100 transition"><Sparkles size={12} className="inline mr-1"/>Begin</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
