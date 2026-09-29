import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, Radio, Sun, Waves, Zap } from "lucide-react";
import { EASE, Heading, Reveal, SlideShell, TiltCard, slideRightV } from "@/components/ui";
import { cn } from "@/utils/cn";

const REGIONS = [
  { k: "uv", name: "Ultraviolet", range: "0.01 – 0.4 µm", waves: 15, color: "#8f74f0",
    use: "Mostly soaked up by the atmosphere. Not much used from satellites." },
  { k: "vis", name: "Visible Light", range: "0.4 – 0.7 µm", waves: 11, color: "#58c96b",
    use: "What our eyes see. Used to make true-colour images." },
  { k: "nir", name: "Near-Infrared", range: "0.7 – 1.3 µm", waves: 8, color: "#c4577a",
    use: "Healthy leaves reflect this a lot. Key band for studying plants." },
  { k: "swir", name: "Short-Wave Infrared", range: "1.3 – 3 µm", waves: 6, color: "#c98a52",
    use: "Sensitive to water inside soil, leaves and rock." },
  { k: "tir", name: "Thermal Infrared", range: "3 – 14 µm", waves: 4, color: "#e0603f",
    use: "Measures heat. Used to map temperature and fires." },
  { k: "mw", name: "Microwave", range: "1 mm – 1 m", waves: 1.6, color: "#5f8f6c",
    use: "Used by radar. Goes through clouds, day or night." },
] as const;

function Wave({ waves, color }: { waves: number; color: string }) {
  const w = 480, mid = 60, amp = 34;
  let d = `M0 ${mid}`;
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = mid + Math.sin((i / steps) * Math.PI * 2 * waves) * amp;
    d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return (
    <svg viewBox={`0 0 ${w} 120`} className="h-auto w-full" role="img" aria-label="Wavelength illustration">
      <line x1={0} x2={w} y1={60} y2={60} stroke="#fff" strokeOpacity=".12" />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1, ease: EASE }} />
      <circle r={6} fill={color}>
        <animateMotion dur={`${Math.max(1.2, 3.4 - waves * 0.12)}s`} repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}

export function ElectromagneticSpectrumSlide() {
  const [sel, setSel] = useState(2);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setSel((s) => (s + 1) % REGIONS.length), 3400);
    return () => window.clearTimeout(id);
  }, [sel, auto]);
  const r = REGIONS[sel];

  return (
    <SlideShell eyebrow="Introduction to Remote Sensing · The EM Spectrum">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-9">
        <div>
          <Heading text="Light is *energy with a size.*" />
          <Reveal as="p" className="lead mt-4">
            Every sensor measures <b className="text-fog">electromagnetic energy</b>. Energy travels in waves. The size of a
            wave is its <b className="text-fog">wavelength</b> — and that size decides what a sensor can see.
          </Reveal>
          <Reveal className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-mint/20 bg-mint/[0.05] px-3.5 py-2.5 text-[13px]">
            <Info className="h-4 w-4 shrink-0 text-mint" />
            <span className="text-fog/90">Shorter wavelength → higher frequency → <b className="text-mint">more energy.</b></span>
          </Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {REGIONS.map((x, i) => (
              <button key={x.k} onClick={() => { setSel(i); setAuto(false); }}
                className={cn("relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === sel ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                {i === sel && <motion.span layoutId="em-bg" className="absolute inset-0" style={{ background: `${x.color}18` }} />}
                <span className="relative flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2">
                    <i className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: x.color }} />
                    <span className="font-display text-[15px] font-semibold">{x.name}</span>
                  </span>
                  <span className="font-mono text-[10.5px] text-muted">{x.range}</span>
                </span>
                <AnimatePresence initial={false}>
                  {i === sel && (
                    <motion.span className="relative block overflow-hidden pl-[18px] text-xs leading-snug text-muted"
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <span className="mt-1 block">{x.use}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <div className="card p-4 sm:p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="mini-label">Wavelength → energy</span>
              <span className="font-mono text-[10px] text-muted">c = λ × f</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={r.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <Wave waves={r.waves} color={r.color} />
              </motion.div>
            </AnimatePresence>
            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-muted"><Waves className="h-3.5 w-3.5" /> Long wave, low energy</span>
              <span className="flex items-center gap-1.5 font-semibold" style={{ color: r.color }}><Zap className="h-3.5 w-3.5" /> {r.name}</span>
              <span className="flex items-center gap-1.5 text-muted">Short wave, high energy <Sun className="h-3.5 w-3.5" /></span>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <div className="flex h-9">
              {REGIONS.map((x, i) => (
                <button key={x.k} onClick={() => { setSel(i); setAuto(false); }} className="relative h-full flex-1 border-r border-black/20 last:border-r-0"
                  style={{ background: x.color, opacity: i === sel ? 1 : 0.45 }} aria-label={x.name} title={x.name} />
              ))}
            </div>
            <motion.div className="h-1 bg-lime" animate={{ x: `${sel * (100 / REGIONS.length)}%`, width: `${100 / REGIONS.length}%` }} transition={{ duration: 0.4, ease: EASE }} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TiltCard className="flex items-center gap-2 p-3">
              <Sun className="h-5 w-5 shrink-0 text-lime" />
              <p className="text-[11.5px] leading-snug text-muted"><b className="text-fog">Passive sensors</b> mostly use visible &amp; infrared light from the sun.</p>
            </TiltCard>
            <TiltCard className="flex items-center gap-2 p-3">
              <Radio className="h-5 w-5 shrink-0 text-lime" />
              <p className="text-[11.5px] leading-snug text-muted"><b className="text-fog">Radar</b> sends its own microwave energy and listens for the echo.</p>
            </TiltCard>
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}
