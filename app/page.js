'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Sun, Moon, Play, Pause, RotateCcw, Send, ArrowRight, Flower2, Atom, BookOpen, Globe2, Heart, Loader2, Brain, Infinity as InfinityIcon, Network, Flame, Circle, Hand, Users, Compass } from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1610209455607-89e8b3e0e393?auto=format&fit=crop&w=2000&q=80';
const COSMOS_BG = 'https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg?auto=compress&cs=tinysrgb&w=2000';
const SACRED_GEO = 'https://images.unsplash.com/photo-1629275622835-f42d081fe666?auto=format&fit=crop&w=1200&q=80';

const PERSPECTIVE_META = [
  { key: 'scientific', label: 'Scientific', icon: Atom, color: 'from-cyan-400 to-blue-500', hint: 'What the evidence says' },
  { key: 'spiritual', label: 'Spiritual', icon: Flower2, color: 'from-fuchsia-400 to-purple-500', hint: 'What the traditions teach' },
  { key: 'philosophical', label: 'Philosophical', icon: BookOpen, color: 'from-amber-300 to-orange-500', hint: 'What thinkers argue' },
  { key: 'historical', label: 'Historical', icon: Globe2, color: 'from-emerald-300 to-teal-500', hint: 'How humans have understood it' },
];

const SAMPLE_QUESTIONS = [
  'Who am I?',
  'Why do I suffer?',
  'What is consciousness?',
  'Does God exist?',
  'What happens after death?',
  'Why do religions differ?',
  'How can science and spirituality coexist?',
];

// -------------------- Meditation Timer --------------------
function MeditationTimer() {
  const [duration, setDuration] = useState(300); // 5 min
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const intRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(intRef.current); setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = duration ? ((duration - remaining) / duration) * 100 : 0;

  return (
    <Card className="bg-white/[0.03] backdrop-blur border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 50%, rgba(168,85,247,0.35), transparent 60%)` }} />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-2 text-purple-200/80 text-xs uppercase tracking-[0.2em] mb-4"><Moon size={14}/> Meditation</div>
        <div className="flex items-center justify-center my-4">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
              <circle cx="50" cy="50" r="46" fill="none" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - pct / 100)} />
              <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#c084fc"/><stop offset="100%" stopColor="#f0abfc"/></linearGradient></defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-[Cormorant_Garamond,serif] text-4xl">{mm}:{ss}</div>
          </div>
        </div>
        <div className="flex justify-center gap-2 mb-3">
          {[3, 5, 10, 15, 20].map((m) => (
            <button key={m} onClick={() => { setDuration(m*60); setRemaining(m*60); setRunning(false); }}
              className={`px-2.5 py-1 rounded-full text-xs border ${duration === m*60 ? 'bg-purple-500/30 border-purple-300/50 text-white' : 'border-white/10 text-slate-300 hover:bg-white/5'}`}>{m}m</button>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          <Button size="sm" onClick={() => setRunning((r) => !r)} className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:opacity-90">
            {running ? <><Pause size={14} className="mr-1"/>Pause</> : <><Play size={14} className="mr-1"/>Begin</>}
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setRunning(false); setRemaining(duration); }} className="border-white/15 bg-transparent"><RotateCcw size={14} className="mr-1"/>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- Guru Panel --------------------
function GuruPanel() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState('');

  async function ask(q) {
    const query = (q || question).trim();
    if (!query) return;
    setQuestion(query);
    setLoading(true);
    setError('');
    setAnswer(null);
    try {
      const res = await fetch('/api/guru', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: query }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setAnswer(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="guru" className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">AI Spiritual Guru</Badge>
        <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl mt-4 text-white">Ask any question that keeps you awake.</h2>
        <p className="text-slate-300/80 mt-3">Get four honest perspectives — <span className="text-cyan-300">Scientific</span>, <span className="text-fuchsia-300">Spiritual</span>, <span className="text-amber-300">Philosophical</span>, <span className="text-emerald-300">Historical</span> — and decide for yourself.</p>
      </div>

      <Card className="bg-white/[0.04] backdrop-blur-xl border-white/10 max-w-3xl mx-auto">
        <CardContent className="p-5">
          <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is consciousness? Why do I suffer? Does God exist?" rows={3}
            className="bg-transparent border-white/10 text-lg font-[Cormorant_Garamond,serif] placeholder:text-slate-500 focus-visible:ring-purple-400/40"/>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {SAMPLE_QUESTIONS.map((s) => (
              <button key={s} onClick={() => ask(s)} className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-300 hover:bg-white/5">{s}</button>
            ))}
            <div className="flex-1" />
            <Button onClick={() => ask()} disabled={loading} className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 hover:opacity-90">
              {loading ? <><Loader2 className="animate-spin mr-2" size={16}/>Contemplating…</> : <><Sparkles size={16} className="mr-2"/>Ask</>}
            </Button>
          </div>
          {error && <div className="mt-3 text-red-300 text-sm">{error}</div>}
        </CardContent>
      </Card>

      {answer && (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center">
            <div className="text-slate-400 text-sm uppercase tracking-widest">Question</div>
            <div className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white mt-1">{answer.question}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {PERSPECTIVE_META.map(({ key, label, icon: Icon, color, hint }) => (
              <Card key={key} className="bg-white/[0.03] border-white/10 backdrop-blur relative overflow-hidden">
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl`} />
                <CardContent className="p-5 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}><Icon size={16} className="text-white"/></div>
                    <div>
                      <div className="font-semibold text-white">{label} View</div>
                      <div className="text-xs text-slate-400">{hint}</div>
                    </div>
                  </div>
                  <p className="text-slate-200/90 leading-relaxed whitespace-pre-line">{answer[key] || '—'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {answer.synthesis && (
            <Card className="bg-gradient-to-br from-purple-900/40 to-fuchsia-900/20 border-purple-400/20">
              <CardContent className="p-6 text-center">
                <div className="text-purple-200 uppercase tracking-widest text-xs mb-2">A Humble Synthesis</div>
                <p className="font-[Cormorant_Garamond,serif] text-xl md:text-2xl text-white leading-snug">{answer.synthesis}</p>
              </CardContent>
            </Card>
          )}
          {answer.reflection && (
            <div className="text-center text-slate-300 italic max-w-2xl mx-auto">
              <Heart size={16} className="inline mr-2 text-pink-300"/>Sit with this: <span className="text-white">{answer.reflection}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -------------------- Great Masters --------------------
function MastersPanel() {
  const [masters, setMasters] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const sessionRef = useRef(null);

  useEffect(() => { fetch('/api/masters').then((r) => r.json()).then((d) => setMasters(d.masters || [])); }, []);

  function openMaster(m) {
    setActive(m);
    setMessages([]);
    sessionRef.current = null;
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    const nextMessages = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    try {
      const res = await fetch('/api/master', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ master_id: active.id, message: text, history: messages, session_id: sessionRef.current }),
      });
      const data = await res.json();
      sessionRef.current = data.session_id;
      setMessages([...nextMessages, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages([...nextMessages, { role: 'assistant', content: 'The master is momentarily silent. Please try again.' }]);
    } finally { setLoading(false); }
  }

  const gradients = ['from-amber-500 to-orange-600','from-cyan-500 to-blue-600','from-emerald-500 to-teal-600','from-fuchsia-500 to-pink-600','from-purple-500 to-indigo-600','from-yellow-400 to-amber-600'];

  return (
    <div id="masters">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Ask the Great Masters</Badge>
        <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl mt-4 text-white">Sit at the feet of the wise.</h2>
        <p className="text-slate-300/80 mt-3">Chat with AI personas inspired by the recorded teachings of history's greatest sages. <span className="text-slate-400 text-sm">(AI interpretations — not the historical figures themselves.)</span></p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
        {masters.map((m, i) => (
          <button key={m.id} onClick={() => openMaster(m)} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur p-4 hover:border-white/25 transition">
            <div className={`w-14 h-14 mx-auto rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center text-white font-[Cormorant_Garamond,serif] text-2xl shadow-lg`}>{m.name[0]}</div>
            <div className="text-white font-semibold mt-3 text-center">{m.name}</div>
            <div className="text-slate-400 text-xs text-center mt-0.5">{m.tradition}</div>
            <div className="text-purple-300 text-xs text-center mt-2 opacity-0 group-hover:opacity-100 transition">Begin a dialogue →</div>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-2xl bg-[#0f0722] border-white/10 text-slate-100">
          <DialogHeader>
            <DialogTitle className="font-[Cormorant_Garamond,serif] text-3xl text-white">In dialogue with {active?.name}</DialogTitle>
            <div className="text-xs text-slate-400">{active?.tradition} · AI interpretation</div>
          </DialogHeader>
          <div className="h-[50vh] overflow-y-auto space-y-3 pr-2">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 italic py-10">Ask anything. Suffering, love, purpose, doubt.</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`p-3 rounded-xl ${m.role === 'user' ? 'bg-purple-500/15 border border-purple-400/20 ml-8' : 'bg-white/[0.04] border border-white/10 mr-8'}`}>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{m.role === 'user' ? 'You' : active?.name}</div>
                <div className="whitespace-pre-line leading-relaxed">{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-sm italic"><Loader2 size={14} className="inline animate-spin mr-2"/>The master reflects…</div>}
          </div>
          <div className="flex gap-2 pt-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Speak from your heart…" className="bg-white/[0.04] border-white/10"/>
            <Button onClick={send} disabled={loading} className="bg-gradient-to-r from-amber-500 to-fuchsia-500"><Send size={14}/></Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// -------------------- Compare Religions --------------------
function ComparePanel() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/compare').then((r) => r.json()).then(setData); }, []);
  if (!data) return null;
  const religions = ['Hinduism', 'Buddhism', 'Christianity', 'Islam', 'Judaism', 'Sikhism'];
  return (
    <div id="compare" className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Badge className="bg-emerald-500/20 border-emerald-300/30 text-emerald-100 uppercase tracking-[0.25em] text-[10px]">Compare Traditions</Badge>
        <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl mt-4 text-white">Six traditions. One human longing.</h2>
        <p className="text-slate-300/80 mt-3">Side by side, without bias.</p>
      </div>
      <Tabs defaultValue={data.topics[0]} className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/10 flex flex-wrap h-auto">
          {data.topics.map((t) => (
            <TabsTrigger key={t} value={t} className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/60 data-[state=active]:to-fuchsia-500/60">{t}</TabsTrigger>
          ))}
        </TabsList>
        {data.topics.map((t) => (
          <TabsContent key={t} value={t} className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {religions.map((r) => (
                <Card key={r} className="bg-white/[0.03] border-white/10">
                  <CardContent className="p-5">
                    <div className="text-purple-300 uppercase text-xs tracking-widest mb-2">{r}</div>
                    <div className="text-slate-200 leading-relaxed">{data.table[t]?.[r]}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// -------------------- Why This Matters --------------------
const WHY_ICONS = { Brain, BookOpen, Network, Infinity: InfinityIcon };
function WhyMattersSection() {
  const [cards, setCards] = useState([]);
  const [openIdx, setOpenIdx] = useState(null);
  useEffect(() => { fetch('/api/why').then(r => r.json()).then(d => setCards(d.cards || [])); }, []);
  return (
    <section id="why" className="py-24 px-6 relative bg-black/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Why this matters</Badge>
          <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-6xl mt-4 text-white">Why should you actually care?</h2>
          <p className="text-slate-300/80 mt-4 text-lg">Not because tradition says so. Because meditation, wisdom, interconnection, and Sanatana Dharma each answer a specific human need — with both scientific evidence and lived experience.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {cards.map((c, i) => {
            const Icon = WHY_ICONS[c.icon] || Sparkles;
            const open = openIdx === i;
            return (
              <Card key={c.id} className="bg-white/[0.03] border-white/10 backdrop-blur relative overflow-hidden">
                <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br ${c.color} opacity-20 blur-3xl`}/>
                <CardContent className="p-6 relative">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0`}><Icon size={22} className="text-white"/></div>
                    <div className="flex-1">
                      <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white">{c.title}</h3>
                      <div className="text-purple-300 text-sm mt-1">{c.tagline}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div><div className="text-cyan-300 text-xs uppercase tracking-widest mb-1">Scientific</div><p className="text-slate-200 leading-relaxed">{c.scientific}</p></div>
                    {open && <div><div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-1">Spiritual</div><p className="text-slate-200 leading-relaxed">{c.spiritual}</p></div>}
                    {open && <div><div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Benefits</div><ul className="space-y-1">{c.benefits?.map((b, j) => (<li key={j} className="flex gap-2 text-slate-200"><span className="text-amber-300">•</span>{b}</li>))}</ul></div>}
                  </div>
                  <button onClick={() => setOpenIdx(open ? null : i)} className="mt-4 text-purple-300 hover:text-white text-sm">{open ? '— Show less' : '+ Show more'}</button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -------------------- Explore Grid --------------------
const PAGE_LINKS = [
  { href: '/practices', title: 'Sacred Practices', desc: 'Mala, Deeksha, and the 16-step daily puja explained.', color: 'from-amber-400 to-orange-600', Icon: Flame },
  { href: '/meditate', title: 'Meditation Center', desc: 'Eight practices with AI-guided scripts and animated timers.', color: 'from-cyan-400 to-blue-600', Icon: Circle },
  { href: '/timeline', title: 'Cosmic Timeline', desc: 'From the Big Bang to this moment — science + wisdom side by side.', color: 'from-purple-400 to-fuchsia-600', Icon: Sparkles },
  { href: '/books', title: 'Sacred Books', desc: 'Gita, Upanishads, Dhammapada, Quran, Tao Te Ching — AI summaries.', color: 'from-amber-300 to-yellow-600', Icon: BookOpen },
  { href: '/connected', title: 'Everything Connected', desc: 'Type any concept. Follow the thread through science, spirit, history.', color: 'from-fuchsia-400 to-pink-600', Icon: Network },
  { href: '/body', title: 'Body + Spirit', desc: 'Where chakras meet the nervous system.', color: 'from-emerald-400 to-teal-600', Icon: Heart },
  { href: '/test', title: 'Chakra Balance', desc: 'A seven-question self-assessment of your energy centers.', color: 'from-violet-400 to-purple-600', Icon: Compass },
  { href: '/#masters', title: 'Great Masters', desc: 'Chat with AI personas of Krishna, Buddha, Jesus, Rumi.', color: 'from-pink-400 to-rose-600', Icon: Users },
];

function ExploreSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">Explore Sanatana</Badge>
          <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-6xl mt-4 text-white">Choose your doorway.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PAGE_LINKS.map((l) => {
            const Icon = l.Icon;
            return (
              <Link key={l.href} href={l.href} className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-6 hover:border-white/25 hover:-translate-y-1 transition relative overflow-hidden">
                <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${l.color} opacity-25 blur-2xl group-hover:opacity-45 transition`}/>
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${l.color} flex items-center justify-center`}><Icon size={20} className="text-white"/></div>
                  <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white mt-4">{l.title}</h3>
                  <p className="text-slate-300 text-sm mt-2 leading-relaxed">{l.desc}</p>
                  <div className="mt-3 text-purple-300 text-sm flex items-center gap-1">Open <ArrowRight size={12} className="group-hover:translate-x-1 transition"/></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// -------------------- Page --------------------
function App() {
  const [daily, setDaily] = useState(null);
  useEffect(() => { fetch('/api/daily').then((r) => r.json()).then(setDaily); }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0416]"/>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `url(${COSMOS_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at top, rgba(88,28,135,0.55), transparent 60%), radial-gradient(ellipse at bottom, rgba(190,24,93,0.25), transparent 60%)' }} />
      </div>

      {/* Nav */}
      <SiteNav />

      {/* HERO */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-[0.3em] text-purple-200">
            <Sun size={12}/> Where science meets spirituality
          </div>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl lg:text-8xl mt-6 leading-[1.05] text-white">
            Ancient wisdom.<br/><span className="bg-gradient-to-r from-amber-200 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent">Modern science.</span><br/>Every human question.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto">Who am I? Why do I suffer? What is consciousness? Get four honest perspectives on the questions that matter most.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#guru"><Button size="lg" className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 shadow-2xl shadow-fuchsia-500/25"><Sparkles size={16} className="mr-2"/>Ask the Guru</Button></a>
            <a href="#masters"><Button size="lg" variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10 text-white">Meet the Masters</Button></a>
          </div>
        </div>

        {/* Daily row */}
        <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2 bg-white/[0.03] backdrop-blur border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url(${SACRED_GEO})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0416]/95 to-[#0a0416]/40"/>
            <CardContent className="p-8 relative">
              <div className="flex items-center gap-2 text-amber-200/80 text-xs uppercase tracking-[0.25em] mb-4"><Sun size={14}/> Today's thought</div>
              {daily ? (
                <>
                  <p className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white leading-snug">“{daily.quote.text}”</p>
                  <p className="mt-3 text-slate-400 text-sm">— {daily.quote.source}</p>
                </>
              ) : (
                <div className="h-24 bg-white/5 rounded animate-pulse"/>
              )}
            </CardContent>
          </Card>
          <MeditationTimer/>
        </div>
      </section>

      {/* GURU */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto"><GuruPanel/></div>
      </section>

      {/* WHY THIS MATTERS */}
      <WhyMattersSection />

      {/* EXPLORE GRID */}
      <ExploreSection />

      {/* MASTERS */}
      <section className="py-20 px-6 relative bg-black/20">
        <div className="max-w-7xl mx-auto"><MastersPanel/></div>
      </section>

      {/* TEMPLE */}
      <section id="temple" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <Badge className="bg-cyan-500/20 border-cyan-300/30 text-cyan-100 uppercase tracking-[0.25em] text-[10px]">Featured Temple</Badge>
            <h2 className="font-[Cormorant_Garamond,serif] text-4xl md:text-5xl mt-4 text-white">History, architecture, mystery — and science.</h2>
          </div>
          {daily?.temple && (
            <Card className="bg-white/[0.03] border-white/10 overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-full min-h-[300px]" style={{ backgroundImage: `url(${daily.temple.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0416]/60 to-transparent"/>
                </div>
                <CardContent className="p-8">
                  <div className="text-purple-300 uppercase tracking-widest text-xs">{daily.temple.era}</div>
                  <h3 className="font-[Cormorant_Garamond,serif] text-4xl mt-2 text-white">{daily.temple.name}</h3>
                  <div className="text-slate-400 text-sm">{daily.temple.location} · Deity: {daily.temple.deity}</div>
                  <div className="space-y-3 mt-5 text-slate-200/90">
                    <div><span className="text-amber-300 text-xs uppercase tracking-widest">History</span><p className="mt-1">{daily.temple.history}</p></div>
                    <div><span className="text-fuchsia-300 text-xs uppercase tracking-widest">Architecture</span><p className="mt-1">{daily.temple.architecture}</p></div>
                    <div><span className="text-purple-300 text-xs uppercase tracking-widest">Mystery</span><p className="mt-1">{daily.temple.mystery}</p></div>
                    <div><span className="text-cyan-300 text-xs uppercase tracking-widest">Scientific Note</span><p className="mt-1">{daily.temple.science}</p></div>
                    <div className="text-xs text-slate-400">Timings: {daily.temple.timings}</div>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* COMPARE */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto"><ComparePanel/></div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="font-[Cormorant_Garamond,serif] text-2xl text-white/70 mb-2">Sanatana</div>
        <div>Balanced perspectives on the questions that matter most. AI-assisted, human-curated.</div>
      </footer>
    </div>
  );
}

export default App;
