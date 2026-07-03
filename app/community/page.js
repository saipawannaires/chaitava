'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2 } from 'lucide-react';

const TOPICS = ['Reflection', 'Question', 'Gratitude', 'Practice', 'Insight', 'Struggle'];

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [alias, setAlias] = useState('');
  const [topic, setTopic] = useState('Reflection');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    try { const a = localStorage.getItem('sanatana_alias'); if (a) setAlias(a); } catch {}
  }, []);
  async function load() { const res = await fetch('/api/community'); const d = await res.json(); setPosts(d.posts || []); }

  async function share() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/community', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ alias: alias.trim() || 'Seeker', topic, text: text.trim() }) });
      if (res.ok) {
        setText('');
        try { localStorage.setItem('sanatana_alias', alias.trim() || 'Seeker'); } catch {}
        await load();
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(6,182,212,0.2), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Badge className="bg-cyan-500/20 border-cyan-300/30 text-cyan-100 uppercase tracking-[0.25em] text-[10px]">Community</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">A sangha of seekers.</h1>
          <p className="text-slate-300/80 mt-4 max-w-xl mx-auto text-lg">Share a reflection, a question, a struggle. No login. Just an alias. Be kind.</p>
        </div>

        <Card className="bg-white/[0.04] border-white/10 backdrop-blur"><CardContent className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input value={alias} onChange={e => setAlias(e.target.value)} placeholder="Your alias (or leave blank)" className="bg-transparent border-white/10"/>
            <select value={topic} onChange={e => setTopic(e.target.value)} className="bg-transparent border border-white/10 rounded-md px-3 text-white">
              {TOPICS.map(t => <option key={t} value={t} className="bg-[#0a0416]">{t}</option>)}
            </select>
          </div>
          <Textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Share something honest…" className="bg-transparent border-white/10"/>
          <div className="flex justify-end">
            <Button onClick={share} disabled={loading || !text.trim()} className="bg-gradient-to-r from-cyan-500 to-blue-500">{loading ? <Loader2 size={14} className="animate-spin"/> : <><Users size={14} className="mr-1"/>Share</>}</Button>
          </div>
        </CardContent></Card>

        <div className="space-y-3 mt-8">
          {posts.length === 0 && <div className="text-center text-slate-500 italic py-10">Be the first to share.</div>}
          {posts.map(p => (
            <Card key={p.id} className="bg-white/[0.03] border-white/10"><CardContent className="p-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-cyan-300 font-semibold">{p.alias}</span>
                <span>·</span><Badge className="bg-white/[0.05] border-white/10 text-slate-300 text-[10px]">{p.topic}</Badge>
                <span className="ml-auto">{new Date(p.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-slate-200 leading-relaxed mt-2 whitespace-pre-line">{p.text}</div>
            </CardContent></Card>
          ))}
        </div>
      </main>
    </div>
  );
}
