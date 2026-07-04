'use client';
import { useEffect, useRef } from 'react';

export default function CosmicBg({ density = 120 }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const stars = [];
    const resize = () => {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = '100%'; canvas.style.height = '100%';
      stars.length = 0;
      for (let i = 0; i < density; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.4 + 0.3,
          o: Math.random() * 0.6 + 0.15,
          s: Math.random() * 0.4 + 0.05,
          twk: Math.random() * 2 * Math.PI,
        });
      }
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const st of stars) {
        st.twk += 0.015; st.y -= st.s;
        if (st.y < 0) st.y = canvas.height;
        const o = st.o + Math.sin(st.twk) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, o).toFixed(3)})`;
        ctx.arc(st.x, st.y, st.r * devicePixelRatio, 0, 2 * Math.PI);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [density]);
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(88,28,135,0.28), transparent 60%), radial-gradient(ellipse 60% 60% at 80% 90%, rgba(212,175,55,0.06), transparent 60%), radial-gradient(ellipse 60% 60% at 20% 90%, rgba(59,130,246,0.10), transparent 60%), #050816'
      }}/>
      <canvas ref={ref}/>
    </div>
  );
}
