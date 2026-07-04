'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SiteNav from '@/components/site-nav';
import { UNIVERSE_NODES, DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/knowledge-universe';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, X, Compass } from 'lucide-react';

function DiscoverPage() {
  const [currentId, setCurrentId] = useState('root');
  const [history, setHistory] = useState(['root']);
  const [detailOpen, setDetailOpen] = useState(false);

  const current = UNIVERSE_NODES[currentId] || UNIVERSE_NODES.root;
  const related = (current.related || []).map(id => UNIVERSE_NODES[id]).filter(Boolean);

  // Position related nodes in a circle around the center
  const orbitRadius = 320;
  const positions = useMemo(() => {
    return related.map((_, i) => {
      const angle = (i / related.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: Math.cos(angle) * orbitRadius,
        y: Math.sin(angle) * orbitRadius,
        angle,
      };
    });
  }, [related]);

  function goTo(id) {
    if (!UNIVERSE_NODES[id]) return;
    setCurrentId(id);
    setHistory(h => [...h, id]);
    setDetailOpen(false);
  }

  function goBack() {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setCurrentId(newHistory[newHistory.length - 1]);
    setDetailOpen(false);
  }

  function goHome() {
    setCurrentId('root');
    setHistory(['root']);
    setDetailOpen(false);
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

      {/* Breadcrumbs + Header */}
      <div className="relative z-10 pt-20 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-purple-500/20 border-purple-300/30 text-purple-100 uppercase tracking-[0.25em] text-[10px]">
              <Compass size={11} className="mr-1"/> Knowledge Universe
            </Badge>
            {history.length > 1 && (
              <>
                <button onClick={goBack} className="text-slate-400 hover:text-white text-sm flex items-center gap-1">
                  <ArrowLeft size={14}/> Back
                </button>
                <span className="text-slate-500 text-sm">·</span>
                <button onClick={goHome} className="text-slate-400 hover:text-white text-sm">
                  Reset
                </button>
              </>
            )}
          </div>
          <div className="text-slate-400 text-xs italic">Click any planet to travel · {Object.keys(UNIVERSE_NODES).length} concepts, infinite connections</div>
        </div>
      </div>

      {/* Universe Canvas */}
      <div className="relative min-h-[85vh] flex items-center justify-center p-6">
        <div className="relative" style={{ width: '100%', maxWidth: 900, aspectRatio: '1' }}>
          {/* Orbit rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-400 -400 800 800">
            <defs>
              <radialGradient id="centerGlow">
                <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#f0abfc" stopOpacity="0"/>
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r={orbitRadius} fill="none" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,6"/>
            <circle cx="0" cy="0" r={orbitRadius * 0.6} fill="none" stroke="rgba(255,255,255,0.04)" strokeDasharray="2,8"/>
            {/* Connection lines */}
            {positions.map((p, i) => (
              <line key={i} x1="0" y1="0" x2={p.x} y2={p.y}
                stroke={DOMAIN_COLORS[related[i].domain] || '#c084fc'}
                strokeOpacity="0.15" strokeWidth="1"/>
            ))}
            {/* Center glow */}
            <circle cx="0" cy="0" r="120" fill="url(#centerGlow)"/>
          </svg>

          {/* Center Node */}
          <button
            onClick={() => setDetailOpen(true)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group"
            style={{ zIndex: 20 }}>
            <div className={`w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${current.color} shadow-2xl flex flex-col items-center justify-center relative overflow-hidden hover:scale-105 transition-transform`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
              <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition" style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)'
              }}/>
              <div className="relative text-center px-4">
                <div className="font-devanagari text-2xl md:text-3xl text-white/95 drop-shadow">{current.dev}</div>
                <div className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white leading-tight mt-1">{current.name}</div>
                <div className="text-white/70 text-[10px] uppercase tracking-widest mt-2">
                  {DOMAIN_NAMES[current.domain]}
                </div>
              </div>
            </div>
            <div className="text-center mt-3 text-slate-400 text-xs opacity-0 group-hover:opacity-100 transition">Click for details</div>
          </button>

          {/* Orbit Nodes */}
          {related.map((node, i) => {
            const p = positions[i];
            return (
              <button
                key={node.id}
                onClick={() => goTo(node.id)}
                className="absolute top-1/2 left-1/2 group"
                style={{
                  transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
                  zIndex: 15,
                }}>
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${node.color} shadow-xl flex flex-col items-center justify-center relative overflow-hidden hover:scale-110 hover:shadow-purple-500/40 transition`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="relative text-center px-1">
                    <div className="font-devanagari text-sm text-white/95">{node.dev}</div>
                    <div className="font-[Cormorant_Garamond,serif] text-xs md:text-sm text-white leading-none mt-0.5">{node.name}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tagline caption */}
      <div className="text-center pb-8 relative z-10">
        <p className="font-[Cormorant_Garamond,serif] text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto px-6">
          {current.tagline}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 px-6">
          {Object.entries(DOMAIN_NAMES).map(([k, name]) => (
            <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-2 h-2 rounded-full" style={{ background: DOMAIN_COLORS[k] }}/>
              {name}
            </div>
          ))}
        </div>
      </div>

      {/* Detail slide-in panel */}
      {detailOpen && current.id !== 'root' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDetailOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-full md:max-w-2xl bg-[#0a0416] border-l border-white/10 overflow-y-auto"
               onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0a0416]/95 backdrop-blur border-b border-white/10 p-5 flex items-center justify-between z-10">
              <div>
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
                <div className="text-cyan-300 text-xs uppercase tracking-widest mb-2">Scientific Perspective</div>
                <p className="text-slate-200 leading-relaxed">{current.scientific}</p>
              </CardContent></Card>}

              {current.spiritual && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-fuchsia-300 text-xs uppercase tracking-widest mb-2">Spiritual Traditions</div>
                <p className="text-slate-200 leading-relaxed">{current.spiritual}</p>
              </CardContent></Card>}

              {current.philosophical && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-amber-300 text-xs uppercase tracking-widest mb-2">Philosophical Perspective</div>
                <p className="text-slate-200 leading-relaxed">{current.philosophical}</p>
              </CardContent></Card>}

              {current.historical && <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                <div className="text-emerald-300 text-xs uppercase tracking-widest mb-2">Historical Context</div>
                <p className="text-slate-200 leading-relaxed">{current.historical}</p>
              </CardContent></Card>}

              {current.practice && <Card className="bg-gradient-to-br from-purple-900/30 to-fuchsia-900/20 border-purple-400/30"><CardContent className="p-5">
                <div className="text-purple-300 text-xs uppercase tracking-widest mb-2">One Practice to Try Today</div>
                <p className="text-slate-100 leading-relaxed">{current.practice}</p>
              </CardContent></Card>}

              {related.length > 0 && (
                <Card className="bg-white/[0.03] border-white/10"><CardContent className="p-5">
                  <div className="text-slate-300 text-xs uppercase tracking-widest mb-3">Travel to related concepts</div>
                  <div className="flex flex-wrap gap-2">
                    {related.map(r => (
                      <button key={r.id} onClick={() => goTo(r.id)}
                        className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-sm transition">
                        <span className="font-devanagari text-purple-300 mr-1.5">{r.dev}</span>{r.name}
                      </button>
                    ))}
                  </div>
                </CardContent></Card>
              )}

              <div className="text-center pt-4">
                <Link href="/#guru" className="inline-flex items-center gap-2 text-purple-300 hover:text-white text-sm">
                  <Sparkles size={14}/> Ask the AI Guru for a deeper answer
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Lightweight star field
function StarField() {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 80; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
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
          width: s.size, height: s.size,
          opacity: s.opacity,
          animationDelay: `${s.delay}s`,
          animationDuration: '4s',
        }}/>
      ))}
    </div>
  );
}

export default DiscoverPage;
