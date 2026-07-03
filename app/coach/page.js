'use client';
import { useEffect, useRef, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Briefcase, Zap, Heart, Compass, RefreshCw, Activity, BookOpen, ChevronLeft } from 'lucide-react';

const ICONS = { Briefcase, Zap, Heart, Compass, RefreshCw, Activity, BookOpen };

export default function CoachPage() {
  const [domains, setDomains] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { fetch('/api/coach-domains').then(r => r.json()).then(d => setDomains(d.domains || [])); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  function open(d) { setActive(d); setMessages([]); setInput(''); }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setLoading(true);
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next); setInput('');
    try {
      const res = await fetch('/api/coach', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ domain_id: active.id, message: text, history: messages }) });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply || data.error || 'Silent.' }]);
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: 'Connection dropped. Please try again.' }]);
    } finally { setLoading(false); }
  }

  if (active) {
    const Icon = ICONS[active.icon] || Compass;
    return (
      <div className="min-h-screen bg-[#0a0416] text-slate-100">
        <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.25), transparent 60%)' }}/>
        <SiteNav />
        <main className="max-w-3xl mx-auto px-6 py-8">
          <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-4"><ChevronLeft size={16}/>All domains</button>
          <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden">
            <div className={`absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br ${active.color} opacity-20 blur-3xl`}/>
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${active.color} flex items-center justify-center`}><Icon size={22} className="text-white"/></div>
                <div>
                  <h1 className={`font-[Cormorant_Garamond,serif] text-3xl bg-gradient-to-r ${active.color} bg-clip-text text-transparent`}>{active.name} coach</h1>
                  <div className="text-slate-400 text-sm">{active.tagline}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-3 min-h-[300px]">
            {messages.length === 0 && <div className="text-center text-slate-500 italic py-16">Tell the coach what you are working on.</div>}
            {messages.map((m, i) => (
              <div key={i} className={`p-4 rounded-xl ${m.role === 'user' ? 'bg-purple-500/15 border border-purple-400/20 ml-8' : 'bg-white/[0.04] border border-white/10 mr-8'}`}>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">{m.role === 'user' ? 'You' : `${active.name} coach`}</div>
                <div className="whitespace-pre-line leading-relaxed text-slate-200">{m.content}</div>
              </div>
            ))}
            {loading && <div className="text-slate-400 text-sm italic"><Loader2 size={14} className="inline animate-spin mr-2"/>Reflecting…</div>}
            <div ref={endRef}/>
          </div>

          <div className="flex gap-2 mt-4 sticky bottom-4">
            <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="What are you working on?" className="bg-white/[0.05] border-white/10"/>
            <Button onClick={send} disabled={loading} className={`bg-gradient-to-r ${active.color}`}><Send size={14}/></Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">AI Life Coach</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">Not only spirituality.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Career, stress, relationships, purpose, productivity, habits, health, learning — grounded advice that draws on modern research and ancient wisdom.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">{domains.map(d => {
          const Icon = ICONS[d.icon] || Compass;
          return (
            <button key={d.id} onClick={() => open(d)} className="group text-left rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25 hover:-translate-y-1 transition relative overflow-hidden">
              <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${d.color} opacity-25 blur-2xl group-hover:opacity-45 transition`}/>
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${d.color} flex items-center justify-center`}><Icon size={20} className="text-white"/></div>
                <h3 className="font-[Cormorant_Garamond,serif] text-2xl text-white mt-4">{d.name}</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{d.tagline}</p>
              </div>
            </button>
          );
        })}</div>
      </main>
    </div>
  );
}
