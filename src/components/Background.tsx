import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type Star = { x: number; y: number; r: number; a: number; s: number; d: number };
type Shoot = { x: number; y: number; vx: number; vy: number; life: number };

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gx = useMotionValue(-600);
  const gy = useMotionValue(-600);
  const sx = useSpring(gx, { stiffness: 70, damping: 20 });
  const sy = useSpring(gy, { stiffness: 70, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, px = 0, py = 0, tpx = 0, tpy = 0;
    let stars: Star[] = [];
    let shoot: Shoot | null = null;
    let nextShoot = performance.now() + 2500;

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(280, Math.floor((w * h) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.15 + 0.25,
        a: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.6, d: Math.random(),
      }));
    };
    const onMove = (e: PointerEvent) => {
      tpx = e.clientX / w - 0.5; tpy = e.clientY / h - 0.5;
      gx.set(e.clientX - 260); gy.set(e.clientY - 260);
    };
    const draw = (t: number) => {
      px += (tpx - px) * 0.05; py += (tpy - py) * 0.05;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduce ? 0.75 : 0.45 + 0.55 * Math.sin(t * 0.001 * s.s + s.a);
        ctx.globalAlpha = Math.max(0.06, tw) * (0.35 + s.d * 0.65);
        ctx.fillStyle = s.d > 0.9 ? "#d8ee86" : s.d > 0.8 ? "#8be4cf" : "#e6f6f0";
        ctx.beginPath();
        ctx.arc(s.x - px * 26 * s.d, s.y - py * 26 * s.d, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) {
        if (!shoot && t > nextShoot) {
          shoot = { x: w * (0.35 + Math.random() * 0.6), y: h * Math.random() * 0.35, vx: -(7 + Math.random() * 5), vy: 2.6 + Math.random() * 2.2, life: 0 };
        }
        if (shoot) {
          shoot.life++; shoot.x += shoot.vx; shoot.y += shoot.vy;
          const tx = shoot.x - shoot.vx * 13, ty = shoot.y - shoot.vy * 13;
          const g = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty);
          g.addColorStop(0, "rgba(216,238,134,.95)"); g.addColorStop(1, "rgba(216,238,134,0)");
          ctx.globalAlpha = Math.max(0, 1 - shoot.life / 65);
          ctx.strokeStyle = g; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(tx, ty); ctx.stroke();
          if (shoot.life > 65) { shoot = null; nextShoot = t + 3500 + Math.random() * 6500; }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [gx, gy]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(67,135,123,.22),transparent_45%),radial-gradient(ellipse_at_95%_100%,rgba(82,118,91,.18),transparent_45%)]" />
      <div className="aurora left-[-10%] top-[-15%] h-[55vh] w-[55vw] bg-[#1c5a52]" />
      <div className="aurora bottom-[-20%] right-[-10%] h-[60vh] w-[50vw] bg-[#3a5a2a] [animation-delay:-8s]" />
      <div className="aurora left-[35%] top-[30%] h-[35vh] w-[30vw] bg-[#1d4a5e] opacity-30 [animation-delay:-15s]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="grid-overlay absolute inset-0" />
      <motion.div
        className="absolute h-[520px] w-[520px] rounded-full"
        style={{ x: sx, y: sy, background: "radial-gradient(circle, rgba(139,228,207,.09), transparent 62%)" }}
      />
    </div>
  );
}
