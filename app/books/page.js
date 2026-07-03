'use client';
import { useEffect, useState } from 'react';
import SiteNav from '@/components/site-nav';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Sparkles, ChevronLeft } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [active, setActive] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetch('/api/books').then(r => r.json()).then(d => setBooks(d.books || [])); }, []);

  async function open(b) {
    setActive(b); setSummary(''); setLoading(true);
    try {
      const res = await fetch('/api/summarize-book', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ book_id: b.id }) });
      const data = await res.json();
      setSummary(data.text || '');
    } finally { setLoading(false); }
  }

  if (active) return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.25), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <button onClick={() => setActive(null)} className="text-slate-400 hover:text-white flex items-center gap-1 mb-6"><ChevronLeft size={16}/>All books</button>
        <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-10">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100">{active.tradition}</Badge>
          <div className="text-slate-400 text-xs uppercase tracking-widest mt-3">{active.when}</div>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl text-white mt-2">{active.title}</h1>
          <p className="text-slate-300 text-lg mt-3">{active.about}</p>
          <div className="text-slate-500 text-sm mt-2">{active.pages}</div>
          <div className="flex flex-wrap gap-2 mt-4">{active.themes.map(t => <Badge key={t} className="bg-white/[0.05] border-white/10 text-slate-300">{t}</Badge>)}</div>
          <div className="mt-8 border-t border-white/5 pt-8">
            <div className="flex items-center gap-2 text-purple-300 text-xs uppercase tracking-widest mb-4"><Sparkles size={12}/>AI-generated summary for the modern seeker</div>
            {loading ? <div className="flex items-center gap-2 text-slate-400"><Loader2 className="animate-spin" size={16}/>Contemplating…</div> : (<div className="text-slate-200 leading-relaxed whitespace-pre-line">{summary}</div>)}
          </div>
        </CardContent></Card>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0416] text-slate-100">
      <div className="fixed inset-0 -z-10" style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.2), transparent 60%)' }}/>
      <SiteNav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <Badge className="bg-amber-500/20 border-amber-300/30 text-amber-100 uppercase tracking-[0.25em] text-[10px]">Sacred Books Library</Badge>
          <h1 className="font-[Cormorant_Garamond,serif] text-5xl md:text-7xl mt-4 text-white">The books humanity keeps returning to.</h1>
          <p className="text-slate-300/80 mt-4 max-w-2xl mx-auto text-lg">Eight texts from six traditions. Tap any book for a fresh AI-generated summary written for a modern seeker.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {books.map(b => (
            <button key={b.id} onClick={() => open(b)} className="text-left group rounded-2xl border border-white/10 bg-gradient-to-br from-amber-900/10 to-fuchsia-900/10 backdrop-blur p-6 hover:border-amber-300/30 transition relative overflow-hidden">
              <BookOpen size={24} className="text-amber-300 mb-3"/>
              <Badge className="bg-white/[0.05] border-white/10 text-slate-300 text-[10px]">{b.tradition}</Badge>
              <h3 className="font-[Cormorant_Garamond,serif] text-3xl text-white mt-2 leading-tight">{b.title}</h3>
              <div className="text-slate-400 text-xs mt-2">{b.when}</div>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed line-clamp-3">{b.about}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
