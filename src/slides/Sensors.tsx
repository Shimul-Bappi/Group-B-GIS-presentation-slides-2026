import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Antenna, Aperture, Clock, Cloud, CloudOff, Database, Flame, Gauge, GraduationCap, Grid3x3, Layers3,
  Lock, Plane, Rows3, ScanLine, Zap,
} from "lucide-react";
import { EASE, Heading, Reveal, SlideShell, TiltCard, itemV, slideRightV } from "@/components/ui";
import { SCENE } from "@/lib/imagery";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: Sensor types & scanning mechanisms                            */
/* ================================================================== */

const SCANS = [
  { k: "frame", name: "Framing", icon: Grid3x3, d: "A 2-D detector array captures the whole scene at once — like a normal camera." },
  { k: "whisk", name: "Whiskbroom", icon: ScanLine, d: "A mirror sweeps side to side, scanning one line at a time as the satellite moves forward." },
  { k: "push", name: "Pushbroom", icon: Rows3, d: "A row of detectors captures a full line at once. No moving mirror — sharper & steadier." },
] as const;

function ScanDemo({ mode, cycle }: { mode: (typeof SCANS)[number]["k"]; cycle: number }) {
  const rows = 9;
  return (
    <div key={`${mode}-${cycle}`} className="relative mx-auto aspect-[4/3] w-full max-w-[max(56vh,300px)] overflow-hidden rounded-xl bg-black">
      <img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px] grayscale" />
      <div className="absolute inset-0 grid" style={{ gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="relative overflow-hidden border-b border-black/10 last:border-b-0">
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: `url(${SCENE})`, backgroundSize: `100% ${rows * 100}%`, backgroundPosition: `50% ${(i / (rows - 1)) * 100}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: mode === "frame" ? 0.3 : i * (mode === "push" ? 0.13 : 0.24), duration: mode === "frame" ? 0.5 : 0.3 }}
            />
            {mode === "whisk" && (
              <motion.div className="absolute inset-y-0 left-0 w-1/3 bg-white/70 mix-blend-overlay"
                initial={{ x: "-120%" }} animate={{ x: "420%" }} transition={{ delay: i * 0.24, duration: 0.4, ease: "linear" }} />
            )}
          </div>
        ))}
      </div>
      {mode === "frame" ? (
        <motion.div className="absolute inset-0 bg-white" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ delay: 0.3, duration: 0.5 }} />
      ) : (
        <motion.div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-lime"
          initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: rows * (mode === "push" ? 0.13 : 0.24) + 0.3, ease: "linear" }}>
          <Plane className="h-4 w-4 rotate-90 drop-shadow-[0_0_6px_rgba(216,238,134,.9)]" />
        </motion.div>
      )}
      <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-lime">
        {SCANS.find((s) => s.k === mode)!.name} scan
      </span>
    </div>
  );
}

const SENSOR_TYPES = [
  { icon: Aperture, t: "Multispectral", d: "Several bands: visible + near-infrared. Most common optical sensor.", ex: "Sentinel-2, Landsat" },
  { icon: Layers3, t: "Hyperspectral", d: "Hundreds of very narrow bands, for detailed material identification.", ex: "AVIRIS, EnMAP" },
  { icon: Flame, t: "Thermal", d: "Measures heat energy the surface gives off, day or night.", ex: "Landsat TIRS" },
  { icon: Antenna, t: "Microwave / Radar", d: "Sends its own signal. Works through cloud and in the dark.", ex: "Sentinel-1 SAR" },
  { icon: Zap, t: "LiDAR", d: "Pulses of laser light measure height and shape very precisely.", ex: "Airborne LiDAR" },
];

export function SensorTypesSlide() {
  const [mode, setMode] = useState<(typeof SCANS)[number]["k"]>("push");
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), 3600);
    return () => window.clearInterval(id);
  }, [mode]);

  return (
    <SlideShell eyebrow="Introduction to Remote Sensing · Sensors">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-9">
        <div>
          <Heading text="Sensors: how satellites *see.*" />
          <Reveal as="p" className="lead mt-3">A sensor builds an image in one of three ways. This decides its speed, sharpness and cost.</Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {SCANS.map((s) => {
              const I = s.icon; const on = s.k === mode;
              return (
                <button key={s.k} onClick={() => setMode(s.k)} className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", on ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                  {on && <motion.span layoutId="scan-bg" className="absolute inset-0 bg-lime/[0.08]" />}
                  <span className="relative flex items-center gap-2.5">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", on ? "bg-lime text-ink" : "bg-mint/10 text-mint")}><I className="h-4 w-4" /></span>
                    <span className="font-display text-[15px] font-semibold">{s.name}</span>
                  </span>
                  <span className="relative mt-1.5 block pl-[42px] text-xs leading-snug text-muted">{s.d}</span>
                </button>
              );
            })}
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <ScanDemo mode={mode} cycle={cycle} />
          <p className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {SENSOR_TYPES.map(({ icon: I, t, d, ex }, i) => (
              <motion.span key={t} variants={itemV} className="card flex flex-col gap-1.5 p-2.5 sm:col-span-1" style={{ transitionDelay: `${i * 40}ms` }}>
                <I className="h-4 w-4 text-lime" />
                <span className="font-display text-[12.5px] font-semibold leading-tight">{t}</span>
                <span className="hidden text-[10.5px] leading-snug text-muted sm:block">{d}</span>
                <span className="font-mono text-[9.5px] text-mint">{ex}</span>
              </motion.span>
            ))}
          </p>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Data acquisition methods (platforms)                          */
/* ================================================================== */

const PLATFORMS = [
  { k: "ground", name: "Ground-based", icon: Aperture, alt: "0 – 2 m", coverage: "A few metres", use: "Calibration & detailed spectral study", ex: "Field spectroradiometer", y: 358, half: 8 },
  { k: "air", name: "Airborne", icon: Plane, alt: "100 m – 20 km", coverage: "Metres to a few km", use: "Sharp, local mapping surveys", ex: "Drones (UAV) & aircraft cameras", y: 205, half: 58 },
  { k: "space", name: "Spaceborne", icon: Grid3x3, alt: "400 – 36,000 km", coverage: "Tens to hundreds of km", use: "Regional & global, repeat coverage", ex: "Landsat, Sentinel, MODIS", y: 46, half: 148 },
] as const;

function AltitudeLadder({ sel }: { sel: number }) {
  const p = PLATFORMS[sel];
  const groundY = 380;
  return (
    <svg viewBox="0 0 320 420" className="h-auto w-full" role="img" aria-label="Altitude of ground, air and space platforms">
      <defs>
        <linearGradient id="alt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1620" />
          <stop offset=".55" stopColor="#123240" />
          <stop offset="1" stopColor="#1c4a52" />
        </linearGradient>
      </defs>
      <rect width={320} height={420} rx={16} fill="url(#alt-sky)" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={(i * 53) % 320} cy={(i * 37) % 300} r={1.1} fill="#8be4cf" opacity={0.5} className="animate-twinkle" style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
      ))}
      <rect y={groundY} width={320} height={40} fill="#2d5a3f" />
      <rect y={groundY} width={320} height={4} fill="#3f7a52" />
      {PLATFORMS.map((pl, i) => (
        <motion.polygon key={pl.k} points={`${160 - pl.half},${groundY} ${160 + pl.half},${groundY} 160,${pl.y}`}
          fill="#d8ee86" initial={false} animate={{ opacity: i === sel ? 0.16 : 0 }} transition={{ duration: 0.4 }} />
      ))}
      {PLATFORMS.map((pl, i) => (
        <motion.line key={`l-${pl.k}`} x1={160 - pl.half} x2={160 + pl.half} y1={groundY} y2={groundY} stroke="#d8ee86" strokeWidth={3}
          initial={false} animate={{ opacity: i === sel ? 1 : 0 }} />
      ))}
      {PLATFORMS.map((pl, i) => (
        <g key={pl.k} transform={`translate(160 ${pl.y})`}>
          <motion.circle r={16} fill={i === sel ? "#d8ee86" : "#12242d"} stroke="#8be4cf" strokeWidth={1.4}
            animate={{ scale: i === sel ? 1.15 : 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          {i === sel && <circle r={16} fill="none" stroke="#d8ee86" strokeWidth={1.4} className="spin-origin animate-pulse-ring" />}
        </g>
      ))}
      <text x={160} y={groundY + 26} textAnchor="middle" className="fill-[#eef4ef] font-mono text-[11px] font-bold">Ground</text>
      <motion.text x={160} y={groundY - 8} textAnchor="middle" className="fill-[#d8ee86] font-mono text-[10.5px] font-bold" initial={false} animate={{ opacity: 1 }}>
        {p.coverage} wide
      </motion.text>
    </svg>
  );
}

export function DataAcquisitionSlide() {
  const [sel, setSel] = useState(2);
  const p = PLATFORMS[sel];
  const I = p.icon;
  return (
    <SlideShell eyebrow="Introduction to Remote Sensing · Data Acquisition">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_.85fr] lg:gap-9">
        <div>
          <Heading text="Three ways to *collect* data." />
          <Reveal as="p" className="lead mt-3">Sensors ride on different platforms. Height changes how much ground we see, and how sharp it looks.</Reveal>
          <Reveal className="mt-4 space-y-2">
            {PLATFORMS.map((x, i) => {
              const Icon = x.icon; const on = i === sel;
              return (
                <button key={x.k} onClick={() => setSel(i)} className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", on ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                  {on && <motion.span layoutId="plat-bg" className="absolute inset-0 bg-lime/[0.08]" />}
                  <span className="relative flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2.5">
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", on ? "bg-lime text-ink" : "bg-mint/10 text-mint")}><Icon className="h-4 w-4" /></span>
                      <span className="font-display text-[15px] font-semibold">{x.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted">{x.alt}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span className="relative block overflow-hidden pl-[42px]" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        <span className="mt-1 block text-xs leading-snug text-muted">{x.use}</span>
                        <span className="mt-1 block font-mono text-[10.5px] text-mint">e.g. {x.ex}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </Reveal>
        </div>
        <Reveal variants={slideRightV} className="mx-auto w-full max-w-[300px]">
          <div className="hud-corners overflow-hidden rounded-[18px] border border-white/10">
            <AltitudeLadder sel={sel} />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-center">
            <I className="h-4 w-4 shrink-0 text-lime" />
            <p className="text-xs text-muted"><b className="text-fog">{p.name}:</b> covers about <b className="text-lime">{p.coverage}</b> of ground per view.</p>
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Limitations & constraints                                     */
/* ================================================================== */

const LIMITS = [
  { icon: Cloud, t: "Clouds & weather", d: "Thick cloud or haze blocks optical sensors completely." },
  { icon: Gauge, t: "The resolution trade-off", d: "No sensor is best at everything. Fine detail usually means less frequent, narrower coverage." },
  { icon: Clock, t: "Revisit time", d: "Fast events like floods or fires can happen between two satellite passes." },
  { icon: Lock, t: "Cost & licence", d: "Very high-resolution images are often commercial and can be expensive." },
  { icon: Database, t: "Big data volumes", d: "Hyperspectral and high-res data need serious storage and computing power." },
  { icon: GraduationCap, t: "Needs training", d: "Reading an image well still needs field knowledge and skilled analysts." },
];

const PRESETS = [
  { k: "landsat", name: "Landsat", spatial: 55, spectral: 60, radiometric: 70, temporal: 40 },
  { k: "sentinel", name: "Sentinel-2", spatial: 70, spectral: 75, radiometric: 65, temporal: 55 },
  { k: "modis", name: "MODIS", spatial: 15, spectral: 50, radiometric: 60, temporal: 95 },
  { k: "commercial", name: "Commercial VHR", spatial: 98, spectral: 35, radiometric: 80, temporal: 20 },
] as const;
const AXES = ["Spatial", "Spectral", "Radiometric", "Temporal"] as const;

function radarPoint(cx: number, cy: number, r: number, i: number, n: number, v: number) {
  const angle = -Math.PI / 2 + (i / n) * Math.PI * 2;
  const rad = (v / 100) * r;
  return [cx + Math.cos(angle) * rad, cy + Math.sin(angle) * rad];
}

function RadarChart({ preset }: { preset: (typeof PRESETS)[number] }) {
  const cx = 150, cy = 145, r = 108;
  const vals = [preset.spatial, preset.spectral, preset.radiometric, preset.temporal];
  const pts = vals.map((v, i) => radarPoint(cx, cy, r, i, 4, v));
  const poly = pts.map((p) => p.join(",")).join(" ");
  return (
    <svg viewBox="0 0 300 300" className="h-auto w-full" role="img" aria-label={`Resolution trade-off for ${preset.name}`}>
      {[100, 75, 50, 25].map((ring) => {
        const rp = [0, 1, 2, 3].map((i) => radarPoint(cx, cy, r, i, 4, ring).join(",")).join(" ");
        return <polygon key={ring} points={rp} fill="none" stroke="#fff" strokeOpacity={0.08} />;
      })}
      {AXES.map((_, i) => {
        const [x, y] = radarPoint(cx, cy, r, i, 4, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#fff" strokeOpacity={0.1} />;
      })}
      <AnimatePresence mode="wait">
        <motion.polygon key={preset.k} points={poly} fill="rgba(216,238,134,.28)" stroke="#d8ee86" strokeWidth={2}
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.45, ease: EASE }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      </AnimatePresence>
      {AXES.map((label, i) => {
        const [x, y] = radarPoint(cx, cy, r + 26, i, 4, 100);
        return <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-[#9db3b5] font-mono text-[10px] font-bold">{label}</text>;
      })}
    </svg>
  );
}

export function LimitationsSlide() {
  const [preset, setPreset] = useState(1);
  return (
    <SlideShell eyebrow="Introduction to Remote Sensing · Limitations">
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-9">
        <div>
          <Heading text="Remote sensing has *limits,* too." />
          <Reveal as="p" className="lead mt-3">It is a powerful tool — but not a magic one. Here is what to keep in mind.</Reveal>
          <Reveal className="mt-4 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
            {LIMITS.map(({ icon: I, t, d }) => (
              <TiltCard key={t} className="p-3.5">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-peach/10 text-peach"><I className="h-4 w-4" /></span>
                  <h3 className="font-display text-[14px] font-semibold leading-tight">{t}</h3>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-muted">{d}</p>
              </TiltCard>
            ))}
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="card p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between">
            <p className="mini-label">You can't max out every resolution</p>
            <CloudOff className="h-4 w-4 text-mint" />
          </div>
          <RadarChart preset={PRESETS[preset]} />
          <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {PRESETS.map((p, i) => (
              <button key={p.k} onClick={() => setPreset(i)}
                className={cn("rounded-lg border px-1.5 py-1.5 text-center font-mono text-[10.5px] font-bold transition", i === preset ? "border-lime/60 bg-lime/10 text-lime" : "border-white/10 text-muted hover:text-fog")}>
                {p.name}
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-snug text-muted">
            MODIS revisits daily but has coarse pixels. Commercial sensors are razor-sharp but revisit rarely and cost more. Every design is a trade-off.
          </p>
        </Reveal>
      </div>
    </SlideShell>
  );
}
