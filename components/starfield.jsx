'use client';
import { useEffect, useRef } from 'react';

// Elegant twinkling star canvas — subtle, performant, respects prefers-reduced-motion
export default function Starfield() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let stars = [];
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 8000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.3 + 0.2,
        baseA: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.008 + 0.002,
        hue: Math.random() > 0.7 ? 280 : (Math.random() > 0.5 ? 45 : 0),
      }));
    }

    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 1;
      for (const s of stars) {
        const a = reduce ? s.baseA : s.baseA + Math.sin(t * s.speed + s.phase) * 0.25;
        ctx.beginPath();
        if (s.hue === 0) {
          ctx.fillStyle = `rgba(255,255,255,${Math.max(0, a)})`;
        } else if (s.hue === 45) {
          ctx.fillStyle = `rgba(253,224,71,${Math.max(0, a * 0.8)})`;
        } else {
          ctx.fillStyle = `rgba(216,180,254,${Math.max(0, a * 0.8)})`;
        }
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
