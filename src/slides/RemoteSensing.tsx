import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2, Cloud, CloudRain, Map as MapIcon, Monitor, Plane, Quote, Radar, Satellite,
  SatelliteDish, Sprout, Sun, TowerControl, Trees, Waves,
} from "lucide-react";
import {
  AutoBar, EASE, Heading, PlayToggle, Reveal, SatGlyph, SlideShell, slideRightV, useAutoStep,
} from "@/components/ui";
import { wavePath } from "@/lib/svg";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: What is remote sensing                                        */
/* ================================================================== */

type Mode = "passive" | "active";

function SensingScene({ mode }: { mode: Mode }) {
  const passive = mode === "passive";
  const inRay = wavePath(104, 96, 200, 314, 5, 7);
  const outRay = wavePath(214, 312, 438, 108, 5, 8);
  const down = "M 446 114 L 362 318";
  const up = "M 362 318 L 446 114";
  return (
    <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label={`${mode} remote sensing illustration`}>
      <defs>
        <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c2632" />
          <stop offset="1" stopColor="#123540" />
        </linearGradient>
        <linearGradient id="rs-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f6b4a" />
          <stop offset="1" stopColor="#1f3a2c" />
        </linearGradient>
        <radialGradient id="rs-sun">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset=".6" stopColor="#f7d774" />
          <stop offset="1" stopColor="#f5bb99" />
        </radialGradient>
      </defs>
      <rect width="560" height="420" rx="18" fill="url(#rs-sky)" />
      {[[40, 30], [180, 40], [300, 24], [520, 200], [250, 110], [150, 150], [500, 30]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.4} fill="#e6f6f0" className="animate-twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}

      {/* Sun */}
      <motion.g animate={{ opacity: passive ? 1 : 0.22 }} transition={{ duration: 0.6 }}>
        <g transform="translate(86 80)">
          <g className="spin-origin animate-orbit" style={{ animationDuration: "26s" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={0} y1={-38} x2={0} y2={-50} stroke="#f7d774" strokeWidth={3} strokeLinecap="round" transform={`rotate(${i * 30})`} />
            ))}
          </g>
          <circle r={28} fill="url(#rs-sun)" />
          <circle r={28} fill="none" stroke="#f7d774" strokeWidth={2} className="spin-origin animate-pulse-ring" />
        </g>
        <text x={86} y={146} textAnchor="middle" className="fill-[#f7d774] font-mono text-[10px] font-bold tracking-[0.14em]">ENERGY SOURCE</text>
      </motion.g>

      {/* Ground + targets */}
      <path d="M0 330 Q140 318 280 326 T560 322 V420 H0Z" fill="url(#rs-ground)" />
      <g stroke="#5e8a5f" strokeWidth={1} opacity=".6">
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${20 + i * 30} 360 l40 40`} />)}
      </g>
      <ellipse cx={480} cy={362} rx={58} ry={13} fill="#2d6f8c" />
      <path d="M445 360 h30 M490 366 h26" stroke="#8fd3e4" strokeWidth={1.5} strokeLinecap="round" className="animate-glow" />
      {[[186, 0.95], [210, 1.15], [236, 0.9]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} 330) scale(${s})`}>
          <rect x={-2.5} y={-6} width={5} height={14} fill="#6b4f33" />
          <circle cx={0} cy={-16} r={13} fill={i === 1 ? "#4f9a55" : "#3f8a4a"} />
        </g>
      ))}
      <g transform="translate(362 318)">
        <rect x={-13} y={-4} width={26} height={16} fill="#d9c69d" />
        <path d="M-17 -4 L0 -17 L17 -4Z" fill="#c26b54" />
        <rect x={-3} y={4} width={6} height={8} fill="#6b4f33" />
      </g>
      <text x={210} y={388} textAnchor="middle" className="fill-[#d8ee86] font-mono text-[10px] font-bold tracking-[0.14em]">TARGET</text>

      {/* Cloud */}
      <g className="animate-float-slow">
        <g fill="#e6f1ee" opacity=".9">
          <circle cx={384} cy={218} r={15} />
          <circle cx={405} cy={206} r={20} />
          <circle cx={427} cy={218} r={15} />
          <rect x={368} y={218} width={76} height={15} rx={7.5} />
        </g>
      </g>

      <AnimatePresence mode="wait">
        {passive ? (
          <motion.g key="passive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <path d={inRay} stroke="#f7d774" strokeWidth={2.2} fill="none" strokeDasharray="7 7" className="animate-dash" />
            <path d={outRay} stroke="#8be4cf" strokeWidth={2.2} fill="none" strokeDasharray="7 7" className="animate-dash" />
            <circle r={5} fill="#fff6cf"><animateMotion dur="1.8s" repeatCount="indefinite" path={inRay} /></circle>
            <circle r={5} fill="#8be4cf"><animateMotion dur="2s" begin="0.9s" repeatCount="indefinite" path={outRay} /></circle>
            <text x={70} y={236} className="fill-[#f7d774] font-mono text-[10px] font-bold">INCIDENT</text>
            <text x={70} y={249} className="fill-[#f7d774] font-mono text-[10px] font-bold">SUNLIGHT</text>
            <text x={294} y={262} className="fill-[#8be4cf] font-mono text-[10px] font-bold">REFLECTED ENERGY</text>
            <text x={405} y={180} textAnchor="middle" className="fill-[#f5bb99] font-mono text-[9.5px] font-bold">CLOUDS BLOCK OPTICAL</text>
          </motion.g>
        ) : (
          <motion.g key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <path d={down} stroke="#d8ee86" strokeWidth={1.6} strokeDasharray="3 8" className="animate-dash" />
            {[0, 0.55, 1.1].map((b) => (
              <g key={`d${b}`}>
                <animateMotion dur="1.65s" begin={`${b}s`} repeatCount="indefinite" path={down} rotate="auto" />
                <path d="M0 -13 A13 13 0 0 1 0 13" fill="none" stroke="#d8ee86" strokeWidth={2.4} strokeLinecap="round" />
              </g>
            ))}
            {[0.8, 1.35, 1.9].map((b) => (
              <g key={`u${b}`}>
                <animateMotion dur="1.65s" begin={`${b}s`} repeatCount="indefinite" path={up} rotate="auto" />
                <path d="M0 -9 A9 9 0 0 1 0 9" fill="none" stroke="#f5bb99" strokeWidth={2} strokeLinecap="round" opacity=".9" />
              </g>
            ))}
            <text x={452} y={286} className="fill-[#d8ee86] font-mono text-[10px] font-bold">PULSE ↓</text>
            <text x={452} y={300} className="fill-[#f5bb99] font-mono text-[10px] font-bold">ECHO ↑</text>
            <text x={405} y={180} textAnchor="middle" className="fill-[#d8ee86] font-mono text-[9.5px] font-bold">RADAR SEES THROUGH CLOUDS</text>
            {[0, 0.9].map((d) => (
              <circle key={d} cx={446} cy={104} r={14} fill="none" stroke="#d8ee86" strokeWidth={1.5} className="spin-origin animate-pulse-ring" style={{ animationDelay: `${d}s` }} />
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      <g transform="translate(452 92) rotate(-22)">
        <g className="animate-bob"><SatGlyph scale={0.9} /></g>
      </g>
      <text x={452} y={48} textAnchor="middle" className="fill-[#8be4cf] font-mono text-[10px] font-bold tracking-[0.14em]">SENSOR</text>
    </svg>
  );
}

const MODES: Record<Mode, { title: string; icon: typeof Sun; body: string; points: string[]; ex: string }> = {
  passive: {
    title: "Passive remote sensing",
    icon: Sun,
    body: "Measures natural energy — sunlight reflected by the surface or heat emitted by it.",
    points: ["Needs daylight for reflected-light imagery", "Blocked by clouds and haze", "Visible, near-infrared, SWIR & thermal bands"],
    ex: "Landsat 8/9 OLI · Sentinel-2 MSI · MODIS",
  },
  active: {
    title: "Active remote sensing",
    icon: Radar,
    body: "The sensor sends its own pulse of energy and measures the part that returns (backscatter).",
    points: ["Works day and night", "Microwave radar penetrates clouds", "Radar (SAR) and laser (LiDAR)"],
    ex: "Sentinel-1 SAR · RADARSAT · airborne LiDAR",
  },
};

export function RemoteSensingSlide() {
  const [mode, setMode] = useState<Mode>("passive");
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setMode((m) => (m === "passive" ? "active" : "passive")), 6500);
    return () => window.clearTimeout(id);
  }, [mode, auto]);
  const m = MODES[mode];
  const Icon = m.icon;

  return (
    <SlideShell eyebrow="01 · Remote Sensing">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div>
          <Heading text="Remote sensing: *sensing without touching.*" />
          <Reveal className="relative mt-5 rounded-2xl border-l-[3px] border-lime bg-lime/[0.06] p-4 pl-5">
            <Quote className="absolute right-3 top-3 h-6 w-6 text-lime/25" />
            <p className="text-[15px] font-medium leading-relaxed text-[#e9f4d4] sm:text-base">
              “The process of detecting and monitoring the physical characteristics of an area by measuring its reflected and
              emitted radiation at a distance — typically from satellite or aircraft.”
            </p>
            <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-lime/80">— U.S. Geological Survey</p>
          </Reveal>

          <Reveal className="mt-5 flex items-center justify-between gap-3">
            <div className="relative inline-flex rounded-full border border-white/12 bg-white/[0.04] p-1">
              {(["passive", "active"] as Mode[]).map((k) => (
                <button
                  key={k}
                  onClick={() => { setMode(k); setAuto(false); }}
                  className={cn("relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors", mode === k ? "text-ink" : "text-muted hover:text-fog")}
                >
                  {mode === k && (
                    <motion.span layoutId="rs-mode" className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-lime to-mint" transition={{ type: "spring", stiffness: 300, damping: 26 }} />
                  )}
                  {k}
                </button>
              ))}
            </div>
            <PlayToggle playing={auto} onToggle={() => setAuto((a) => !a)} />
          </Reveal>

          <Reveal className="mt-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: EASE }}
                className="card p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint"><Icon className="h-5 w-5" /></span>
                  <h3 className="font-display text-lg font-semibold">{m.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{m.body}</p>
                <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
                  {m.points.map((p, i) => (
                    <motion.li key={p} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}
                      className="rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2 text-xs leading-snug text-fog/90">
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-[11px] text-lime">e.g. {m.ex}</p>
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <div className="hud-corners overflow-hidden rounded-[18px] border border-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
            <SensingScene mode={mode} />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { i: TowerControl, t: "Ground-based" },
              { i: Plane, t: "Airborne · aircraft & drones" },
              { i: Satellite, t: "Spaceborne · satellites" },
            ].map(({ i: I, t }, k) => (
              <motion.span key={t} className="chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + k * 0.12 }}>
                <I className="h-3.5 w-3.5 text-lime" /> {t}
              </motion.span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { i: Sprout, t: "Agriculture" },
              { i: CloudRain, t: "Floods & disasters" },
              { i: Building2, t: "Urban growth" },
              { i: Waves, t: "Water & coasts" },
            ].map(({ i: I, t }, k) => (
              <motion.div key={t} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 + k * 0.1 }}
                whileHover={{ y: -3 }} className="card flex items-center gap-2 px-3 py-2.5 text-xs font-semibold">
                <I className="h-4 w-4 shrink-0 text-mint" /> {t}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Components of remote sensing (CCRS model, A–G)                */
/* ================================================================== */

const COMPONENTS = [
  { k: "A", title: "Energy Source or Illumination", icon: Sun,
    desc: "Every remote-sensing process starts with a source of electromagnetic energy that illuminates the target. Passive systems rely on the Sun; active systems (radar, LiDAR) send their own energy.",
    ex: "The Sun · a radar pulse · a laser pulse" },
  { k: "B", title: "Radiation & the Atmosphere", icon: Cloud,
    desc: "Energy travels from the source to the target — and back up to the sensor — through the atmosphere, where gases, water vapour and particles can scatter or absorb it.",
    ex: "Haze, clouds, water vapour, aerosols" },
  { k: "C", title: "Interaction with the Target", icon: Trees,
    desc: "At the surface, energy is reflected, absorbed or transmitted depending on the wavelength and the properties of the target. This gives each surface its own spectral signature.",
    ex: "Healthy leaves strongly reflect near-infrared" },
  { k: "D", title: "Recording of Energy by the Sensor", icon: Satellite,
    desc: "A sensor carried on a platform — satellite, aircraft or drone — collects and records the electromagnetic energy reflected or emitted by the target.",
    ex: "Landsat 8/9 OLI · Sentinel-2 MSI" },
  { k: "E", title: "Transmission, Reception & Processing", icon: SatelliteDish,
    desc: "The recorded data are transmitted (downlinked) to a ground receiving station, where they are processed into images — calibrated, corrected and georeferenced.",
    ex: "Ground station → Level-1 / Level-2 products" },
  { k: "F", title: "Interpretation & Analysis", icon: Monitor,
    desc: "The processed image is interpreted visually and/or digitally — for example in QGIS — to extract information about the target.",
    ex: "Classification · NDVI · change detection" },
  { k: "G", title: "Application", icon: MapIcon,
    desc: "Finally, the extracted information is applied: to understand the target better, reveal new information, or help solve a real-world problem.",
    ex: "Land-use maps · flood response · crop monitoring" },
];

const pA = wavePath(96, 98, 200, 318, 5, 7);
const pC = wavePath(212, 316, 494, 98, 5, 9);
const pE = "M 506 104 L 404 318";
const pF = "M 414 358 H 482";
const pG = "M 528 322 H 562";
const PATHS: Record<string, string[]> = { A: [pA], B: [pA, pC], C: [pA, pC], D: [pC], E: [pE], F: [pF], G: [pG] };
const GLOW: Record<string, [number, number, number]> = {
  A: [80, 80, 52], C: [210, 318, 46], D: [510, 80, 52], E: [400, 326, 40], F: [495, 322, 40], G: [592, 325, 38],
};
const BADGES: Record<string, [number, number]> = {
  A: [126, 52], B: [28, 172], C: [210, 378], D: [566, 44], E: [400, 378], F: [495, 378], G: [592, 378],
};

function ComponentsDiagram({ active, onSelect }: { active: string; onSelect: (k: string) => void }) {
  const activePaths = PATHS[active] ?? [];
  const glow = GLOW[active];
  return (
    <svg viewBox="0 0 640 420" className="h-auto w-full" role="img" aria-label="Diagram of the seven components of remote sensing">
      <defs>
        <linearGradient id="cp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2230" />
          <stop offset="1" stopColor="#12343d" />
        </linearGradient>
        <linearGradient id="cp-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35604a" />
          <stop offset="1" stopColor="#1b3429" />
        </linearGradient>
        <radialGradient id="cp-glow">
          <stop offset="0" stopColor="#d8ee86" stopOpacity=".42" />
          <stop offset="1" stopColor="#d8ee86" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="420" rx="18" fill="url(#cp-sky)" />

      {/* Atmosphere */}
      <motion.rect x={0} y={140} width={640} height={66} animate={{ fill: active === "B" ? "rgba(216,238,134,.13)" : "rgba(139,228,207,.06)" }} />
      <line x1={0} y1={140} x2={640} y2={140} stroke="#8be4cf" strokeOpacity=".25" strokeDasharray="4 6" />
      <line x1={0} y1={206} x2={640} y2={206} stroke="#8be4cf" strokeOpacity=".25" strokeDasharray="4 6" />
      <g className="animate-float-slow" fill="#dcebe7" opacity=".55">
        <circle cx={300} cy={172} r={11} /><circle cx={316} cy={164} r={15} /><circle cx={333} cy={172} r={11} />
        <rect x={290} y={172} width={54} height={11} rx={5.5} />
      </g>
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={i} cx={30 + i * 38} cy={150 + ((i * 37) % 48)} r={1.6} fill="#8be4cf" className="animate-twinkle" style={{ animationDelay: `${(i % 5) * 0.35}s` }} />
      ))}
      <text x={620} y={134} textAnchor="end" className="fill-[#8be4cf] font-mono text-[9px] font-bold tracking-[0.16em]" opacity=".7">ATMOSPHERE</text>

      {/* Ground */}
      <rect x={0} y={345} width={640} height={75} fill="url(#cp-ground)" />

      {/* Active glow */}
      {glow && (
        <motion.circle key={active} cx={glow[0]} cy={glow[1]} r={glow[2]} fill="url(#cp-glow)"
          initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [1, 1.12, 1], opacity: 1 }}
          transition={{ scale: { repeat: Infinity, duration: 2.2 }, opacity: { duration: 0.4 } }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      )}

      {/* Faint base paths */}
      {[pA, pC].map((d, i) => <path key={i} d={d} stroke="#8be4cf" strokeOpacity=".2" strokeWidth={1.6} fill="none" />)}
      <path d={pE} stroke="#8be4cf" strokeOpacity=".2" strokeWidth={1.6} strokeDasharray="2 6" fill="none" />
      <path d={pF} stroke="#8be4cf" strokeOpacity=".25" strokeWidth={2} fill="none" />
      <path d={pG} stroke="#8be4cf" strokeOpacity=".25" strokeWidth={2} fill="none" />

      {/* Active paths with flowing energy */}
      {activePaths.map((d, i) => (
        <g key={`${active}-${i}`}>
          <motion.path d={d} stroke={i === 0 && (active === "A" || active === "B" || active === "C") ? "#f7d774" : "#d8ee86"} strokeWidth={2.4} fill="none"
            strokeDasharray="8 6" className="animate-dash" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.8 }} />
          <circle r={5} fill="#fff6cf">
            <animateMotion dur={d === pF || d === pG ? "1.1s" : "1.9s"} begin={`${i * 0.9}s`} repeatCount="indefinite" path={d} />
          </circle>
        </g>
      ))}

      {/* A · Sun */}
      <g transform="translate(80 80)" onClick={() => onSelect("A")} className="cursor-pointer">
        <g className="spin-origin animate-orbit" style={{ animationDuration: "24s" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={0} y1={-32} x2={0} y2={-42} stroke="#f7d774" strokeWidth={3} strokeLinecap="round" transform={`rotate(${i * 36})`} />
          ))}
        </g>
        <circle r={24} fill="#f7d774" />
        <circle r={16} fill="#fff1b8" opacity=".6" />
      </g>

      {/* C · Target */}
      <g onClick={() => onSelect("C")} className="cursor-pointer">
        <rect x={160} y={338} width={100} height={8} rx={2} fill="#6f9a52" />
        {[[184, 1], [208, 1.2], [232, 0.95]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x} 338) scale(${s})`}>
            <rect x={-2.5} y={-8} width={5} height={10} fill="#6b4f33" />
            <circle cx={0} cy={-18} r={12} fill={i === 1 ? "#58a45d" : "#438f4d"} />
          </g>
        ))}
      </g>

      {/* D · Satellite */}
      <g transform="translate(510 78) rotate(-16)" onClick={() => onSelect("D")} className="cursor-pointer">
        <g className="animate-bob"><SatGlyph scale={0.85} /></g>
      </g>
      {active === "D" && (
        <motion.polygon points="510,92 470,200 550,200" fill="#d8ee86" initial={{ opacity: 0 }} animate={{ opacity: [0.05, 0.22, 0.05] }} transition={{ repeat: Infinity, duration: 1.6 }} />
      )}

      {/* E · Ground station */}
      <g transform="translate(400 345)" onClick={() => onSelect("E")} className="cursor-pointer">
        <rect x={-3} y={-22} width={6} height={22} fill="#9fb5b7" />
        <path d="M-16 0 H16 L10 -6 H-10Z" fill="#7d9294" />
        <g transform="translate(0 -24) rotate(-35)">
          <path d="M-18 -4 Q0 16 18 -4 Z" fill="#dfe9e6" stroke="#9fb5b7" />
          <line x1={0} y1={3} x2={0} y2={-12} stroke="#dfe9e6" strokeWidth={2} />
          <circle cx={0} cy={-13} r={2.5} fill="#d8ee86" />
        </g>
        {active === "E" && [0, 0.7].map((d) => (
          <circle key={d} cx={6} cy={-38} r={8} fill="none" stroke="#d8ee86" className="spin-origin animate-pulse-ring" style={{ animationDelay: `${d}s` }} />
        ))}
      </g>

      {/* F · Analysis */}
      <g onClick={() => onSelect("F")} className="cursor-pointer">
        <rect x={468} y={302} width={54} height={36} rx={4} fill="#0e2a33" stroke="#8be4cf" strokeWidth={1.5} />
        <path d="M474 330 L484 320 L492 326 L502 312 L514 318" fill="none" stroke="#d8ee86" strokeWidth={1.8} />
        <rect x={491} y={338} width={8} height={7} fill="#7d9294" />
        <rect x={482} y={344} width={26} height={3} rx={1.5} fill="#7d9294" />
      </g>

      {/* G · Application */}
      <g onClick={() => onSelect("G")} className="cursor-pointer">
        <path d="M566 306 L582 300 L598 306 L616 300 V338 L598 344 L582 338 L566 344Z" fill="#f0f1e6" />
        <path d="M582 300 V338 M598 306 V344" stroke="#b9c2b3" />
        <path d="M570 330 Q584 316 596 324 T612 314" fill="none" stroke="#2f7fc1" strokeWidth={2} />
        <circle cx={590} cy={318} r={3} fill="#e0555a" />
      </g>

      {/* Letter badges */}
      {Object.entries(BADGES).map(([k, [x, y]]) => {
        const on = k === active;
        return (
          <g key={k} transform={`translate(${x} ${y})`} onClick={() => onSelect(k)} className="cursor-pointer">
            <motion.circle r={12} animate={{ fill: on ? "#d8ee86" : "#0b2029", scale: on ? 1.18 : 1 }} stroke={on ? "#d8ee86" : "#8be4cf"} strokeWidth={1.5} />
            <text y={4} textAnchor="middle" className={cn("font-mono text-[11px] font-bold", on ? "fill-[#08201f]" : "fill-[#8be4cf]")}>{k}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function ComponentsSlide() {
  const { step, select, playing, setPlaying } = useAutoStep(COMPONENTS.length, 4600);
  const c = COMPONENTS[step];
  const Icon = c.icon;
  return (
    <SlideShell eyebrow="02 · Components of Remote Sensing">
      <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <Heading text="Seven components of *remote sensing.*" />
        <Reveal as="p" className="lead max-w-md lg:text-right">
          A usable image is the result of a connected chain — from the energy source to a real-world application.
        </Reveal>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <Reveal className="hud-corners mx-auto w-full max-w-[max(80vh,320px)] overflow-hidden rounded-[18px] border border-white/10 lg:mx-0 lg:w-[min(62%,80vh)] lg:max-w-none lg:shrink-0">
          <ComponentsDiagram active={c.k} onSelect={(k) => select(COMPONENTS.findIndex((x) => x.k === k))} />
        </Reveal>

        <Reveal variants={slideRightV} className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="card relative min-h-[200px] flex-1 overflow-hidden p-5">
            <span className="pointer-events-none absolute -right-4 -top-10 font-display text-[9rem] font-bold leading-none text-white/[0.04]">{c.k}</span>
            <AnimatePresence mode="wait">
              <motion.div key={c.k} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-ink font-display text-xl font-bold">{c.k}</span>
                  <Icon className="h-6 w-6 text-mint" />
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold leading-tight">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.desc}</p>
                <p className="mt-3 rounded-lg border border-mint/20 bg-mint/[0.06] px-3 py-2 font-mono text-[11px] text-mint">e.g. {c.ex}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="card p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="mini-label">Energy → information</span>
              <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {COMPONENTS.map((x, i) => (
                <button key={x.k} onClick={() => select(i)} aria-label={x.title}
                  className={cn("relative rounded-lg py-2 font-mono text-xs font-bold transition-colors", i === step ? "text-ink" : i < step ? "text-lime" : "text-muted hover:text-fog")}>
                  {i === step && <motion.span layoutId="comp-pill" className="absolute inset-0 -z-0 rounded-lg bg-lime" transition={{ type: "spring", stiffness: 320, damping: 28 }} />}
                  <span className="relative">{x.k}</span>
                </button>
              ))}
            </div>
            <AutoBar k={step} ms={4600} playing={playing} className="mt-2" />
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}
