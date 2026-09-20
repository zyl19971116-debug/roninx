"use client";

import { useEffect, useRef } from "react";

export function ParticleField({ tone = "orange" }: { tone?: "orange" | "crimson" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let active = !document.hidden;
    const small = window.innerWidth < 720;
    const particles = Array.from({ length: small ? 22 : 52 }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 1.7 + .3, v: Math.random() * .0006 + .00015, a: Math.random() * .55 + .15 }));
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; };
    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.v; if (p.y < 0) { p.y = 1; p.x = Math.random(); }
        ctx.fillStyle = tone === "crimson" ? `rgba(241,47,69,${p.a})` : `rgba(255,138,31,${p.a})`;
        ctx.beginPath(); ctx.arc(p.x * canvas.width, p.y * canvas.height, p.s * devicePixelRatio, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const visibility = () => { active = !document.hidden; if (active) draw(); else cancelAnimationFrame(raf); };
    resize(); draw();
    addEventListener("resize", resize); document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility); };
  }, [tone]);
  return <canvas ref={ref} className="particle-field" aria-hidden="true"/>;
}
