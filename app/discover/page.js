'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/site-nav';
import { UNIVERSE_NODES, DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/knowledge-universe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Sparkles, X, Compass, Search, Loader2, Home, ChevronRight } from 'lucide-react';

function DiscoverPage() {
  const [nodes, setNodes] = useState(UNIVERSE_NODES);
  const [currentId, setCurrentId] = useState('root');
  const [history, setHistory] = useState(['root']);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [transition, setTransition] = useState(false);

  const current = nodes[currentId] || nodes.root;
  const related = (current.related || []).map(id => nodes[id]).filter(Boolean);

  const orbitRadius = 320;
  const positions = useMemo(() => {
    return related.map((_, i) => {
      const angle = (i / Math.max(related.length, 1)) * Math.PI * 2 - Math.PI / 2;
      return { x: Math.cos(angle) * orbitRadius, y: Math.sin(angle) * orbitRadius };
    });
  }, [related.length]);

  function goTo(id) {
    if (!nodes[id]) return;
    setTransition(true);
    setTimeout(() => {
      setCurrentId(id);
      setHistory(h => [...h, id]);
      setDetailOpen(false);
      setTransition(false);
    }, 240);
  }

  function goBack() {
    if (history.length <= 1) return;
    setTransition(true);
    setTimeout(() => {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentId(newHistory[newHistory.length - 1]);
      setDetailOpen(false);
      setTransition(false);
    }, 240);
  }

  function goHome() {
    if (currentId === 'root') return;
    setTransition(true);
    setTimeout(() => {
      setCurrentId('root');
      setHistory(['root']);
      setDetailOpen(false);
      setTransition(false);
    }, 240);
  }

  // Local search first, AI-generate if not found
  const localMatches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return Object.values(nodes)
      .filter(n => n.id !== 'root' && (n.name.toLowerCase().includes(q) || n.id.includes(q) || (n.dev && n.dev.includes(query))))
      .slice(0, 6);
  }, [query, nodes]);

  async function generateNode() {
    if (!query.trim() || generating) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/expand-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: query.trim() })
      });
      const data = await res.json();
      if (data && data.id) {
        // Add to nodes state
        setNodes(prev => ({ ...prev, [data.id]: data }));
        // Navigate to it
        setSearchOpen(false);
        setQuery('');
        setTimeout(() => goTo(data.id), 200);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050211] text-slate-100 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(88,28,135,0.4), transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(236,72,153,0.15), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.15), transparent 50%)'
        }}/>
        <StarField/>
      </div>

      <SiteNav />

      {/* Top bar with search + breadcrumbs */}
      <div className="relative z-20 pt-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">
              <Compass size={11} className="mr-1"/> Knowledge Universe
            </Badge>
            {history.length > 1 && (
              <>
                <button onClick={goBack} className="text-slate-300 hover:text-white text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition">
                  <ArrowLeft size={14}/> Back
                </button>
                <button onClick={goHome} className="text-slate-300 hover:text-white text-sm flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 transition">
                  <Home size={14}/> Home
                </button>
              </>
            )}
          </div>
          <button onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-300 text-sm transition">
            <Search size={14}/> Type any concept · AI creates a planet
            <span className="ml-2 text-[10px] text-slate-500 border border-slate-500/40 rounded px-1.5 py-0.5">⌘K</span>
          </button>
        </div>
      </div>

      {/* Trail breadcrumb */}
      {history.length > 1 && (
        <div className="relative z-10 max-w-7xl mx-auto px-6 mt-4 flex items-center gap-1.5 flex-wrap text-xs text-slate-400">
          {history.map((id, i) => {
            const n = nodes[id];
            if (!n) return null;
            return (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-slate-600"/>}
                <span className={i === history.length - 1 ? 'text-purple-300 font-medium' : ''}>{n.name}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Universe Canvas */}
      <div className="relative min-h-[80vh] flex items-center justify-center p-4 md:p-6">
        <div className={`relative transition-all duration-300 ${transition ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
             style={{ width: '100%', maxWidth: 900, aspectRatio: '1' }}>
          {/* Orbit SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-400 -400 800 800">
            <defs>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#f0abfc" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r={orbitRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeDasharray="2,6"/>
            {positions.map((p, i) => (
              <line key={i} x1="0" y1="0" x2={p.x} y2={p.y}
                stroke={DOMAIN_COLORS[related[i]?.domain] || '#c084fc'}
                strokeOpacity="0.18" strokeWidth="1"
                style={{ animation: `fadeIn 0.8s ease-out ${i * 0.05}s both` }}/>
            ))}
            <circle cx="0" cy="0" r="140" fill="url(#centerGlow)"/>
          </svg>

          {/* Center Node */}
          <button
            onClick={() => setDetailOpen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
            style={{ zIndex: 20 }}>
            <div className={`w-40 h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br ${current.color} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden hover:scale-105 transition-all duration-300`}
                 style={{ boxShadow: '0 0 80px rgba(192, 132, 252, 0.35), 0 0 160px rgba(236, 72, 153, 0.15)' }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
              <div className="absolute inset-0 opacity-40 group-hover:opacity-70 transition" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 60%)'
              }}/>
              <div className="relative text-center px-4">
                <div className="font-devanagari text-2xl md:text-3xl text-white/95 drop-shadow-lg">{current.dev}</div>
                <div className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white leading-tight mt-1 drop-shadow">{current.name}</div>
                <div className="text-white/70 text-[10px] uppercase tracking-widest mt-2">
                  {DOMAIN_NAMES[current.domain] || 'Concept'}
                </div>
              </div>
            </div>
            <div className="text-center mt-3 text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition">Tap to open</div>
          </button>

          {/* Orbit Nodes */}
          {related.map((node, i) => {
            const p = positions[i];
            return (
              <button
                key={node.id}
                onClick={() => goTo(node.id)}
                className="absolute top-1/2 left-1/2 group focus:outline-none"
                style={{
                  transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
                  zIndex: 15,
                  animation: `orbitIn 0.6s ease-out ${i * 0.05}s both`,
                }}>
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${node.color} shadow-xl flex flex-col items-center justify-center relative overflow-hidden hover:scale-125 transition-all duration-200 group-hover:shadow-2xl`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="relative text-center px-1">
                    <div className="font-devanagari text-sm text-white/95">{node.dev}</div>
                    <div className="font-[Cormorant_Garamond,serif] text-xs md:text-sm text-white leading-none mt-0.5">{node.name}</div>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {DOMAIN_NAMES[node.domain]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tagline caption */}
      <div className="text-center pb-6 relative z-10">
        <p className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto px-6">
          {current.tagline}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 px-6">
          {Object.entries(DOMAIN_NAMES).map(([k, name]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full shadow-lg" style={{ background: DOMAIN_COLORS[k], boxShadow: `0 0 6px ${DOMAIN_COLORS[k]}` }}/>
              {name}
            </div>
          ))}
        </div>
        <div className="mt-6 text-slate-500 text-xs">
          <span className="text-slate-400">{Object.keys(nodes).length}</span> concepts loaded · infinite connections · type anything to generate more
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-32 px-4" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-[#0a0416] border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <Search size={18} className="text-purple-300 shrink-0"/>
              <Input value={query} onChange={e => setQuery(e.target.value)}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') { if (localMatches[0]) { setSearchOpen(false); goTo(localMatches[0].id); setQuery(''); } else generateNode(); } if (e.key === 'Escape') setSearchOpen(false); }}
                placeholder="Type any concept — forgiveness, moon, DNA, Rumi, silence..."
                className="border-0 bg-transparent focus-visible:ring-0 text-lg"/>
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white p-1"><X size={18}/></button>
            </div>
            <div className="max-h-96 overflow-y-auto p-3 space-y-1">
              {query.trim() === '' && (
                <div className="p-4 text-slate-400 text-sm">
                  <div className="text-purple-300 mb-2 font-medium">Try:</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Forgiveness', 'Moon', 'DNA', 'Rumi', 'Silence', 'Trust', 'Solitude', 'Wonder', 'Dance'].map(s => (
                      <button key={s} onClick={() => setQuery(s)} className="text-left px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-sm transition">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {localMatches.map(n => (
                <button key={n.id} onClick={() => { setSearchOpen(false); goTo(n.id); setQuery(''); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-left transition">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${n.color} shrink-0`}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-white">
                      <span className="font-devanagari text-purple-300 mr-2">{n.dev}</span>
                      {n.name}
                    </div>
                    <div className="text-slate-400 text-xs truncate">{n.tagline}</div>
                  </div>
                  <Badge className="bg-white/5 border-white/10 text-slate-400 text-[10px]">{DOMAIN_NAMES[n.domain]}</Badge>
                </button>
              ))}
              {query.trim() !== '' && (
                <button onClick={generateNode} disabled={generating}
                  className="w-full flex items-center gap-3 p-4 mt-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 hover:from-purple-500/30 hover:to-fuchsia-500/30 border border-purple-400/30 text-left transition disabled:opacity-50">
                  {generating ? <Loader2 size={20} className="animate-spin text-purple-300"/> : <Sparkles size={20} className="text-purple-300"/>}
                  <div className="flex-1">
                    <div className="text-white font-medium">
                      {generating ? `Generating "${query}"...` : `✨ Ask the AI to create "${query}" as a new planet`}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {generating ? 'Chaitava AI is composing 5 perspectives...' : 'Adds a new node with Scientific, Spiritual, Philosophical, Historical views + a practice'}
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detail slide-in panel */}
      {detailOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDetailOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full md:max-w-2xl bg-[#0a0416] border-l border-white/10 overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0a0416]/95 backdrop-blur border-b border-white/10 p-5 flex items-center justify-between z-10">
              <div>
                <div className="text-slate-500 text-[10px] uppercase tracking-widest">{DOMAIN_NAMES[current.domain]}</div>
                <div className="font-devanagari text-lg text-purple-300">{current.dev}</div>
                <div className="font-[Cormorant_Garamond,serif] text-3xl text-white">{current.name}</div>
              </div>
              <button onClick={() => setDetailOpen(false)} className="text-slate-400 hover:text-white p-2"><X size={20}/></button>
            </div>

            <div className="p-6 space-y-4">
              <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">Overview</div>
                <p className="text-slate-200 leading-relaxed italic">{current.tagline}</p>
                {current.summary && <p className="text-slate-200 leading-relaxed mt-3">{current.summary}</p>}
              </CardContent></Card>

              {current.scientific && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">🧠 Scientific Perspective</div>
                <p className="text-slate-200 leading-relaxed">{current.scientific}</p>
              </CardContent></Card>}

              {current.spiritual && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">🕉️ Spiritual Traditions</div>
                <p className="text-slate-200 leading-relaxed">{current.spiritual}</p>
              </CardContent></Card>}

              {current.philosophical && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">📜 Philosophical Perspective</div>
                <p className="text-slate-200 leading-relaxed">{current.philosophical}</p>
              </CardContent></Card>}

              {current.historical && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-emerald-300 text-xs uppercase tracking-widest mb-2">⏳ Historical Context</div>
                <p className="text-slate-200 leading-relaxed">{current.historical}</p>
              </CardContent></Card>}

              {current.practice && <Card className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border-purple-400/30"><CardContent className="p-5">
                <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">🧘 One Practice to Try Today</div>
                <p className="text-slate-100 leading-relaxed">{current.practice}</p>
              </CardContent></Card>}

              {related.length > 0 && (
                <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                  <div className="text-slate-300 text-xs uppercase tracking-widest mb-3">🔗 Travel to related concepts</div>
                  <div className="flex flex-wrap gap-2">
                    {related.map(r => (
                      <button key={r.id} onClick={() => { setDetailOpen(false); goTo(r.id); }}
                        className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm transition">
                        {r.dev && <span className="font-devanagari text-purple-300 mr-1.5">{r.dev}</span>}{r.name}
                      </button>
                    ))}
                  </div>
                </CardContent></Card>
              )}

              <div className="text-center pt-4">
                <Link href="/#guru" className="inline-flex items-center gap-2 text-purple-300 hover:text-white text-sm">
                  <Sparkles size={14}/> Ask CHAITAVA AI for a deeper answer
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global keyboard shortcut */}
      <KeyboardShortcut onSearch={() => setSearchOpen(true)}/>

      <style jsx global>{`
        @keyframes orbitIn {
          from { opacity: 0; transform: translate(calc(-50%), calc(-50%)) scale(0.3); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function KeyboardShortcut({ onSearch }) {
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSearch]);
  return null;
}

function StarField() {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
      arr.push({
        x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        delay: Math.random() * 4,
      });
    }
    setStars(arr);
  }, []);
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <div key={i} className="absolute rounded-full bg-white animate-pulse" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, opacity: s.opacity,
          animationDelay: `${s.delay}s`, animationDuration: '4s',
        }}/>
      ))}
    </div>
  );
}

export default DiscoverPage;
