import { Fragment, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, MapPinned, Sparkles, Wand2, Waves, X } from "lucide-react";
import { AutoBar, EASE, Heading, PlayToggle, Reveal, SlideShell, slideRightV, useAutoStep } from "@/components/ui";
import { SCENE, useImagery } from "@/lib/imagery";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: Data preprocessing (radiometric, atmospheric, geometric)      */
/* ================================================================== */

const PREP_STEPS = [
  {
    t: "Radiometric correction", icon: Waves,
    d: "Fixes sensor errors — like faint stripes or an uneven glow — so every pixel's brightness is trustworthy.",
  },
  {
    t: "Atmospheric correction", icon: Wand2,
    d: "Removes haze and scattering caused by the air, converting raw signal into true surface reflectance.",
  },
  {
    t: "Geometric correction", icon: MapPinned,
    d: "Warps the image to match real-world coordinates, using ground control points or a terrain model.",
  },
];
const PMS = 4200;

function BeforeAfter({ step }: { step: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["Before", "After"] as const).map((label, i) => (
        <div key={label} className="text-center">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
            <img src={SCENE} alt={`${label} ${PREP_STEPS[step].t}`} className="absolute inset-0 h-full w-full object-cover"
              style={
                step === 0
                  ? { filter: i === 0 ? "contrast(.75) brightness(1.15)" : "none" }
                  : step === 1
                    ? { filter: i === 0 ? "brightness(1.35) contrast(.55) saturate(.45)" : "none" }
                    : { transform: i === 0 ? "rotate(7deg) scale(1.18) translate(3%,-4%)" : "none", filter: i === 0 ? "contrast(.9)" : "none" }
              }
            />
            {step === 0 && i === 0 && (
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,.5) 0px, rgba(255,255,255,.5) 1px, transparent 1px, transparent 7px)" }} />
            )}
            {step === 1 && i === 0 && <div className="absolute inset-0 bg-white/25" />}
            {step === 2 && (
              <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full">
                <g stroke="#d8ee86" strokeOpacity={i === 0 ? 0.25 : 0.55} strokeWidth={0.6}>
                  {[20, 40, 60, 80].map((p) => <line key={`v${p}`} x1={p} x2={p} y1={0} y2={100} />)}
                  {[20, 40, 60, 80].map((p) => <line key={`h${p}`} x1={0} x2={100} y1={p} y2={p} />)}
                </g>
                {[[20, 20], [80, 20], [80, 80], [20, 80]].map(([x, y], gi) => (
                  <g key={gi} transform={i === 0 ? `translate(${x + (gi % 2 ? 6 : -6)} ${y + (gi < 2 ? -5 : 5)})` : `translate(${x} ${y})`}>
                    <circle r={3.4} fill="none" stroke={i === 0 ? "#f5bb99" : "#d8ee86"} strokeWidth={1.4} />
                    <path d={`M-4 0h8M0 -4v8`} stroke={i === 0 ? "#f5bb99" : "#d8ee86"} strokeWidth={1} />
                  </g>
                ))}
              </svg>
            )}
            <span className={cn("absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full", i === 0 ? "bg-peach/90 text-ink" : "bg-lime/90 text-ink")}>
              {i === 0 ? <X className="h-3 w-3" strokeWidth={3} /> : <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
          </div>
          <p className={cn("mt-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider", i === 0 ? "text-peach" : "text-lime")}>{label}</p>
        </div>
      ))}
    </div>
  );
}

export function PreprocessingSlide() {
  const { step, select, playing, setPlaying } = useAutoStep(PREP_STEPS.length, PMS);
  const s = PREP_STEPS[step];
  const Icon = s.icon;
  return (
    <SlideShell eyebrow="Digital Image Processing · Preprocessing">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-9">
        <div>
          <Heading text="Clean it *before* you trust it." />
          <Reveal as="p" className="lead mt-3">Raw satellite data is never perfect. Three corrections make it ready for real analysis.</Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {PREP_STEPS.map((x, i) => {
              const I = x.icon; const on = i === step;
              return (
                <button key={x.t} onClick={() => select(i)} className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", on ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                  {on && <motion.span layoutId="prep-bg" className="absolute inset-0 bg-lime/[0.08]" />}
                  <span className="relative flex items-center gap-2.5">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", on ? "bg-lime text-ink" : "bg-mint/10 text-mint")}><I className="h-4 w-4" /></span>
                    <span className="font-display text-[15px] font-semibold">{x.t}</span>
                  </span>
                  <span className="relative mt-1.5 block pl-[42px] text-xs leading-snug text-muted">{x.d}</span>
                </button>
              );
            })}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={step} ms={PMS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="card p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-sm font-semibold"><Icon className="h-4 w-4 text-lime" /> {s.t}</span>
            <span className="font-mono text-[10px] text-muted">{step + 1} / 3</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
              <BeforeAfter step={step} />
            </motion.div>
          </AnimatePresence>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-muted">
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-lime" />
            {step === 0 && "Correction removes striping and levels out brightness across the scene."}
            {step === 1 && "Correction cuts through haze so colours match the true surface, not the air above it."}
            {step === 2 && "Ground control points snap the image onto its real map coordinates."}
          </p>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Image enhancement                                             */
/* ================================================================== */

const ENH_TABS = [
  { k: "stretch", name: "Contrast Stretch", d: "Spreads narrow, dull pixel values across the full range, from black to white." },
  { k: "filter", name: "Spatial Filtering", d: "Smoothing removes noise; sharpening makes edges like roads and field borders stand out." },
  { k: "pan", name: "Pan-sharpening", d: "Merges a sharp grey band with a soft colour image to get a sharp colour image." },
] as const;

function StretchDemo() {
  const img = useImagery();
  const bars = img?.hist.r.map((v, i) => (v + (img.hist.g[i] + img.hist.b[i])) / 3) ?? Array(64).fill(0.3);
  return (
    <div className="grid grid-cols-2 gap-3">
      {(["Low contrast", "Stretched"] as const).map((label, i) => (
        <div key={label} className="text-center">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
            <img src={SCENE} alt={label} className="absolute inset-0 h-full w-full object-cover" style={{ filter: i === 0 ? "contrast(.42) brightness(1.35) saturate(.6)" : "none" }} />
          </div>
          <svg viewBox="0 0 128 28" className="mt-1.5 h-6 w-full">
            {bars.map((v, bi) => {
              const scaled = i === 0 ? 0.25 + v * 0.4 : v;
              const x = i === 0 ? 40 + bi * 0.7 : bi * 2;
              return <rect key={bi} x={x} y={28 - scaled * 26} width={i === 0 ? 1.1 : 1.6} height={scaled * 26} fill={i === 0 ? "#f5bb99" : "#d8ee86"} opacity={0.85} />;
            })}
          </svg>
          <p className={cn("mt-1 font-mono text-[10px] font-bold uppercase tracking-wide", i === 0 ? "text-peach" : "text-lime")}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function FilterDemo() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        { l: "Smoothing (low-pass)", f: "blur(2.4px) saturate(.9)", note: "Reduces speckle & noise" },
        { l: "Sharpening (high-pass)", f: "contrast(1.35) saturate(1.15)", note: "Edges look crisper" },
      ].map((x) => (
        <div key={x.l} className="text-center">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
            <img src={SCENE} alt={x.l} className="absolute inset-0 h-full w-full object-cover" style={{ filter: x.f }} />
          </div>
          <p className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-mint">{x.l}</p>
          <p className="text-[10px] text-muted">{x.note}</p>
        </div>
      ))}
    </div>
  );
}

function PanSharpenDemo() {
  const img = useImagery();
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {[
        { src: SCENE, style: { filter: "blur(3.5px)" }, l: "Multispectral", sub: "10 m · colour" },
        { src: img?.urls.gray ?? SCENE, style: {}, l: "Panchromatic", sub: "2.5 m · grey" },
      ].map((x, i) => (
        <Fragment key={x.l}>
          {i === 1 && <span className="px-0.5 text-lg font-bold text-muted">+</span>}
          <div className="w-[38%] text-center min-[420px]:w-[28%]">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-black">
              <img src={x.src} alt={x.l} className="absolute inset-0 h-full w-full object-cover" style={x.style} />
            </div>
            <p className="mt-1 font-mono text-[9.5px] font-bold uppercase tracking-wide text-mint">{x.l}</p>
            <p className="text-[9.5px] text-muted">{x.sub}</p>
          </div>
        </Fragment>
      ))}
      <span className="px-0.5 text-lg font-bold text-muted">=</span>
      <div className="w-[38%] text-center min-[420px]:w-[28%]">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-lime/40 bg-black">
          <img src={SCENE} alt="Pan-sharpened result" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-1 top-1 text-lime"><Sparkles className="h-3.5 w-3.5" /></span>
        </div>
        <p className="mt-1 font-mono text-[9.5px] font-bold uppercase tracking-wide text-lime">Pan-sharpened</p>
        <p className="text-[9.5px] text-muted">2.5 m · colour</p>
      </div>
    </div>
  );
}

export function EnhancementSlide() {
  const [tab, setTab] = useState(0);
  const t = ENH_TABS[tab];
  return (
    <SlideShell eyebrow="Digital Image Processing · Image Enhancement">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <Heading text="Make the image easier *to read.*" />
        <Reveal as="p" className="lead max-w-md lg:text-right">Enhancement changes how the image looks. It never adds new real information.</Reveal>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[.6fr_1.4fr]">
        <Reveal className="space-y-2">
          {ENH_TABS.map((x, i) => (
            <button key={x.k} onClick={() => setTab(i)} className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", i === tab ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
              {i === tab && <motion.span layoutId="enh-bg" className="absolute inset-0 bg-lime/[0.08]" />}
              <span className="relative font-display text-[15px] font-semibold">{x.name}</span>
              <span className="relative mt-1 block text-xs leading-snug text-muted">{x.d}</span>
            </button>
          ))}
          <div className="rounded-xl border border-mint/20 bg-mint/[0.05] p-3 text-[11px] leading-snug text-muted">
            Try it in QGIS: right-click a raster → <b className="text-fog">Properties → Symbology</b> → adjust <b className="text-fog">Min / Max</b> values, or use <b className="text-fog">Raster → Analysis</b> for filters.
          </div>
        </Reveal>
        <Reveal variants={slideRightV} className="card p-4 sm:p-5">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: EASE }}>
              {t.k === "stretch" && <StretchDemo />}
              {t.k === "filter" && <FilterDemo />}
              {t.k === "pan" && <PanSharpenDemo />}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </SlideShell>
  );
}
