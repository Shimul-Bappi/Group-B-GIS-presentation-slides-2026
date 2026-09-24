import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { BookOpen, Check, Download, FileDown, Focus, Palette, Printer, Radar, Satellite } from "lucide-react";
import { AutoBar, EASE, Heading, PlayToggle, Reveal, SatGlyph, SlideShell, itemV, slideRightV, useAutoStep, useDeck } from "@/components/ui";
import { CLASS_COLORS, CLASS_NAMES, SCENE, useImagery } from "@/lib/imagery";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: Mapping the satellite image (print layout)                    */
/* ================================================================== */

const MAP_STEPS = [
  { t: "Open a new print layout", d: "Project → New Print Layout… (Ctrl+P) and give it a name." },
  { t: "Add the map", d: "Add Item → Add Map, then drag a rectangle on the page." },
  { t: "Add a title & legend", d: "Add Item → Add Label (title) and Add Legend (layers & classes)." },
  { t: "Scale bar, north arrow & grid", d: "Add Item → Add Scale Bar / Add North Arrow; Item Properties → Grids for coordinates." },
  { t: "Export the map", d: "Layout → Export as Image / PDF / SVG — e.g. 300 dpi for printing." },
];
const MMS = 3600;
type Sym = "natural" | "cir" | "classes";
const SYMS: { k: Sym; label: string; title: string; sub: string }[] = [
  { k: "natural", label: "True colour", title: "Satellite Image Map of the Study Area", sub: "Landsat 9 OLI-2 · True colour (4-3-2) · 8 Feb 2024" },
  { k: "cir", label: "False colour", title: "False Colour Composite of the Study Area", sub: "Landsat 9 OLI-2 · Colour infrared (5-4-3) · 8 Feb 2024" },
  { k: "classes", label: "Land cover", title: "Land Cover Map of the Study Area", sub: "Classified from Landsat 9 · Paletted / unique values" },
];

function LayoutSheet({ step, sym }: { step: number; sym: Sym }) {
  const img = useImagery();
  const s = SYMS.find((x) => x.k === sym)!;
  const src = sym === "natural" ? SCENE : img?.urls[sym] ?? SCENE;
  const legend =
    sym === "classes"
      ? CLASS_NAMES.map((n, i) => ({ c: `rgb(${CLASS_COLORS[i].join(",")})`, n }))
      : sym === "cir"
        ? [{ c: "#f59f9a", n: "Red: Band 5 (NIR)" }, { c: "#bce28e", n: "Green: Band 4 (Red)" }, { c: "#86c8f4", n: "Blue: Band 3 (Green)" }, { c: "#c0392b", n: "Bright red = vegetation" }]
        : [{ c: "#f59f9a", n: "Red: Band 4" }, { c: "#bce28e", n: "Green: Band 3" }, { c: "#86c8f4", n: "Blue: Band 2" }, { c: "transparent", n: "Study area boundary", b: true }];

  return (
    <div className="@container relative aspect-[1.414] w-full overflow-hidden rounded-md bg-[#f4f5ee] text-[#1d3138] shadow-[0_30px_70px_-20px_rgba(0,0,0,.85)]">
      <div className="pointer-events-none absolute inset-[2.2%] border border-dashed border-[#9fb0b0]/60" />
      {step === 0 && (
        <motion.div className="absolute inset-0 grid place-items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div>
            <Printer className="mx-auto h-[7cqw] w-[7cqw] text-[#9fb0b0]" />
            <p className="mt-[1cqw] font-display text-[2.2cqw] font-semibold text-[#5f7475]">Page 1 · A4 Landscape</p>
            <p className="font-mono text-[1.3cqw] text-[#8a9b9c]">Empty layout — add items from the Add Item menu</p>
          </div>
        </motion.div>
      )}

      {step >= 1 && (
        <div className="absolute left-[3.5%] top-[15%] h-[79%] w-[63%]">
          <motion.div className="absolute left-0 top-0 border-[0.25cqw] border-dashed border-[#2f7fc1]" initial={{ width: step === 1 ? "0%" : "100%", height: step === 1 ? "0%" : "100%" }} animate={{ width: "100%", height: "100%" }} transition={{ duration: 0.7, ease: EASE }} />
          <motion.div className="absolute inset-0 overflow-hidden border-[0.3cqw] border-[#1d3138]" initial={{ opacity: step === 1 ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ delay: step === 1 ? 0.7 : 0, duration: 0.6 }}>
            <AnimatePresence initial={false}>
              <motion.img key={sym} src={src} alt="" className={cn("absolute inset-0 h-full w-full object-cover", sym === "classes" && "pixelated")}
                initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} />
            </AnimatePresence>
            {sym === "natural" && (
              <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                <polygon points="24,20 74,14 82,50 40,62 18,44" fill="none" stroke="#d8ee86" strokeWidth={0.6} strokeDasharray="2 1.2" />
              </svg>
            )}
            {step >= 3 && (
              <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                {[20, 40, 60, 80].map((p) => (
                  <span key={`v${p}`} className="absolute inset-y-0 w-px bg-white/55" style={{ left: `${p}%` }} />
                ))}
                {[25, 50, 75].map((p) => (
                  <span key={`h${p}`} className="absolute inset-x-0 h-px bg-white/55" style={{ top: `${p}%` }} />
                ))}
              </motion.div>
            )}
          </motion.div>
          {step >= 3 && (
            <motion.div className="font-mono text-[1.05cqw] text-[#40585a]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {["90°12′E", "90°16′E", "90°20′E", "90°24′E"].map((t, i) => (
                <span key={t} className="absolute -top-[2.2cqw] -translate-x-1/2" style={{ left: `${(i + 1) * 20}%` }}>{t}</span>
              ))}
              {["23°58′N", "23°54′N", "23°50′N"].map((t, i) => (
                <span key={t} className="absolute -left-[0.6cqw] -translate-x-full -translate-y-1/2 [writing-mode:vertical-rl] rotate-180" style={{ top: `${(i + 1) * 25}%` }}>{t}</span>
              ))}
            </motion.div>
          )}
        </div>
      )}

      {step >= 2 && (
        <div className="absolute left-[3.5%] right-[3.5%] top-[3.6%]">
          <motion.p key={`t-${sym}`} className="font-display text-[3cqw] font-bold leading-none tracking-tight"
            initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 1, ease: "easeOut" }}>
            {s.title}
          </motion.p>
          <motion.p className="mt-[0.6cqw] font-mono text-[1.25cqw] text-[#5a7072]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>{s.sub}</motion.p>
        </div>
      )}

      {step >= 2 && (
        <motion.div className="absolute right-[3.5%] top-[15%] w-[28%] rounded-[0.4cqw] border-[0.2cqw] border-[#1d3138]/70 bg-white/70 p-[1.3cqw]"
          initial={{ opacity: 0, x: "20%" }} animate={{ opacity: 1, x: "0%" }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}>
          <p className="mb-[0.8cqw] font-display text-[1.8cqw] font-bold">Legend</p>
          {legend.map((l, i) => (
            <motion.p key={`${sym}-${l.n}`} className="flex items-center gap-[0.8cqw] text-[1.25cqw] leading-[2.1cqw]" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.12 }}>
              <i className={cn("inline-block h-[1.4cqw] w-[2.4cqw] shrink-0 rounded-[0.2cqw]", "b" in l && l.b && "border-[0.2cqw] border-dashed border-[#9bb34a]")} style={{ background: l.c }} />
              {l.n}
            </motion.p>
          ))}
        </motion.div>
      )}

      {step >= 3 && (
        <>
          <motion.div className="absolute right-[13.5%] top-[53%] w-[7%] text-center" initial={{ rotate: -200, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 12 }}>
            <p className="font-display text-[2cqw] font-bold leading-none">N</p>
            <svg viewBox="0 0 20 30" className="mx-auto w-[65%]">
              <path d="M10 0 L18 28 L10 21 Z" fill="#1d3138" />
              <path d="M10 0 L2 28 L10 21 Z" fill="none" stroke="#1d3138" strokeWidth={1.2} />
            </svg>
          </motion.div>
          <motion.div className="absolute right-[3.5%] top-[73%] w-[28%]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex h-[1.1cqw] border-[0.15cqw] border-[#1d3138]">
              {[0, 1, 2, 3].map((i) => (
                <motion.span key={i} className={cn("h-full flex-1 origin-left", i % 2 === 0 ? "bg-[#1d3138]" : "bg-white")} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 + i * 0.15 }} />
              ))}
            </div>
            <div className="mt-[0.4cqw] flex justify-between font-mono text-[1.05cqw]">
              <span>0</span><span>0.5</span><span>1</span><span>1.5</span><span>2 km</span>
            </div>
          </motion.div>
          <motion.div className="absolute bottom-[4%] right-[3.5%] w-[28%] space-y-[0.2cqw] font-mono text-[1.02cqw] leading-snug text-[#40585a]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <p><b>Data:</b> USGS Landsat 9, Collection 2</p>
            <p><b>CRS:</b> WGS 84 / UTM zone 46N</p>
            <p><b>Prepared by:</b> Group B · QGIS</p>
          </motion.div>
        </>
      )}

      {step >= 4 && (
        <>
          <motion.div className="pointer-events-none absolute inset-0 bg-white" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.85, 0] }} transition={{ delay: 1, duration: 0.7 }} />
          <motion.div className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-center gap-[1cqw] rounded-full bg-[#07131a] px-[2cqw] py-[1cqw] text-[1.5cqw] font-semibold text-lime shadow-xl"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, type: "spring" }}>
            <Check className="h-[2cqw] w-[2cqw]" /> Exported: study_area_map.pdf · 300 dpi
          </motion.div>
        </>
      )}
    </div>
  );
}

export function MappingSlide() {
  const { step, select, playing, setPlaying } = useAutoStep(MAP_STEPS.length, MMS);
  const [sym, setSym] = useState<Sym>("natural");
  return (
    <SlideShell eyebrow="10 · Mapping the Satellite Image">
      <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[.78fr_1.22fr] lg:gap-8">
        <div>
          <Heading text="From styled raster to *finished map.*" />
          <Reveal as="p" className="lead mt-3">After symbology, the QGIS <b className="text-fog">Print Layout</b> turns the satellite image into a map anyone can read.</Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {MAP_STEPS.map((s, i) => (
              <button key={s.t} onClick={() => select(i)} className={cn("relative flex w-full gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === step ? "border-lime/50" : "border-transparent hover:border-white/10")}>
                {i === step && <motion.span layoutId="map-step" className="absolute inset-0 bg-lime/[0.07]" />}
                <span className={cn("relative grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold", i < step ? "border-lime bg-lime text-ink" : i === step ? "border-lime text-lime" : "border-white/20 text-muted")}>
                  {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="relative min-w-0">
                  <span className="block text-sm font-semibold">{s.t}</span>
                  <span className="block font-mono text-[10.5px] leading-snug text-mint/90">{s.d}</span>
                </span>
              </button>
            ))}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={step} ms={MMS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
        </div>
        <Reveal variants={slideRightV}>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex rounded-full bg-white/5 p-1">
              {SYMS.map((x) => (
                <button key={x.k} onClick={() => setSym(x.k)} className={cn("relative z-10 rounded-full px-3 py-1 text-xs font-semibold transition-colors", sym === x.k ? "text-ink" : "text-muted hover:text-fog")}>
                  {sym === x.k && <motion.span layoutId="map-sym" className="absolute inset-0 -z-10 rounded-full bg-mint" />}
                  {x.label}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Print layout · live preview</span>
          </div>
          <div className="mx-auto w-full max-w-[max(82vh,320px)] rounded-xl border border-white/10 bg-[#0b1a20] p-2 sm:p-3">
            <LayoutSheet step={step} sym={sym} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Title", "Map", "Legend", "Scale bar", "North arrow", "Grid", "Source & date", "CRS", "Author"].map((t, i) => (
              <motion.span key={t} className="chip !py-1 !text-[10.5px]" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.06 }}>
                <Check className="h-3 w-3 text-lime" /> {t}
              </motion.span>
            ))}
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Summary & thank you                                           */
/* ================================================================== */

const FLOW = [
  { icon: Radar, t: "Sense", d: "Remote sensing measures reflected & emitted energy" },
  { icon: Satellite, t: "Capture", d: "Satellites record multispectral images" },
  { icon: Focus, t: "Choose", d: "Match resolution to the question" },
  { icon: Download, t: "Download", d: "Free Landsat & Sentinel data" },
  { icon: Palette, t: "Style", d: "QGIS raster symbology & band combinations" },
  { icon: Printer, t: "Map", d: "Print layout → PDF / PNG" },
];

export function SummarySlide() {
  const { goTo } = useDeck();
  return (
    <SlideShell eyebrow="Summary · Q&A">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
        <div>
          <Heading text="From orbit *to insight.*" />
          <Reveal as="p" className="lead mt-3 max-w-xl">The complete workflow we covered — each step builds on the one before.</Reveal>
          <div className="relative mt-5">
            <div className="absolute bottom-3 left-[19px] top-3 w-px overflow-hidden bg-white/10 sm:hidden">
              <motion.div className="w-full bg-linear-to-b from-lime to-mint" initial={{ height: 0 }} animate={{ height: "100%" }} transition={{ delay: 0.6, duration: 1.8 }} />
            </div>
            <div className="absolute left-[8%] right-[8%] top-[19px] hidden h-px overflow-hidden bg-white/10 sm:block">
              <motion.div className="h-full bg-linear-to-r from-lime to-mint" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.6, duration: 1.8 }} />
              <span className="absolute top-1/2 h-2 w-8 -translate-y-1/2 rounded-full bg-lime blur-[2px]" style={{ animation: "travel-x 3.2s linear infinite 2.4s" }} />
            </div>
            <div className="grid gap-3 sm:grid-cols-6 sm:gap-2">
              {FLOW.map(({ icon: I, t, d }, i) => (
                <motion.div key={t} className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.28, duration: 0.5, ease: EASE }}>
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-lime/50 bg-[#0d2027] text-lime">
                    <I className="h-[18px] w-[18px]" />
                    <span className="absolute inset-0 animate-pulse-ring rounded-full border border-lime/40" style={{ animationDelay: `${i * 0.3}s` }} />
                  </span>
                  <span>
                    <span className="block font-display text-sm font-semibold">{t}</span>
                    <span className="block text-[11px] leading-snug text-muted">{d}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              "Remote sensing links 7 components — from the energy source to a real application.",
              "Choose imagery by its spatial, spectral, radiometric & temporal resolution.",
              "In QGIS: load & stack bands → style with symbology → publish with a print layout.",
            ].map((t, i) => (
              <motion.div key={i} variants={itemV} className="card p-3.5 text-xs leading-relaxed text-fog/90">
                <span className="mb-1 block font-mono text-[10px] font-bold text-lime">KEY TAKEAWAY 0{i + 1}</span>
                {t}
              </motion.div>
            ))}
          </div>
        </div>

        <Reveal variants={slideRightV} className="relative">
          <div className="relative overflow-hidden rounded-[28px] border border-mint/25 bg-[radial-gradient(circle_at_50%_40%,rgba(72,176,151,.28),rgba(7,19,26,.9)_70%)] px-5 py-10 text-center sm:py-14">
            <svg viewBox="0 0 400 300" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <ellipse cx={200} cy={150} rx={175} ry={62} fill="none" stroke="#8be4cf" strokeOpacity=".35" strokeDasharray="4 7" className="animate-dash-slow" transform="rotate(-12 200 150)" />
              <g transform="rotate(-12 200 150)">
                <g>
                  <animateMotion dur="10s" repeatCount="indefinite" rotate="auto" path="M 375 150 A 175 62 0 1 1 25 150 A 175 62 0 1 1 375 150" />
                  <SatGlyph scale={0.55} />
                </g>
              </g>
              {Array.from({ length: 18 }).map((_, i) => (
                <circle key={i} cx={(i * 97) % 400} cy={(i * 53) % 300} r={1.3} fill="#e6f6f0" className="animate-twinkle" style={{ animationDelay: `${(i % 6) * 0.4}s` }} />
              ))}
            </svg>
            <p className="relative mini-label">Group B · GIS &amp; Remote Sensing</p>
            <motion.h2 className="relative mt-3 font-display text-[clamp(2.8rem,7vw,5.6rem)] font-bold leading-none tracking-tight"
              initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 120, damping: 12 }}>
              <span className="text-shimmer">Thank you!</span>
            </motion.h2>
            <motion.p className="relative mt-3 font-serif text-2xl italic text-lime sm:text-3xl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
              Questions &amp; discussion welcome.
            </motion.p>
            <motion.div className="relative mt-6 flex flex-wrap justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
              <button onClick={() => goTo(0)} className="btn-ghost !py-2 !text-xs">↺ Back to start</button>
              <button onClick={() => goTo(1)} className="btn-ghost !py-2 !text-xs">Roadmap</button>
            </motion.div>
          </div>
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-mint"><BookOpen className="h-3.5 w-3.5" /> References</p>
            <ul className="space-y-0.5 text-[11px] text-muted">
              <li>Canada Centre for Remote Sensing — <i>Fundamentals of Remote Sensing</i></li>
              <li><a className="hover:text-lime" href="https://www.usgs.gov/landsat-missions" target="_blank" rel="noopener noreferrer">USGS — Landsat Missions &amp; EarthExplorer</a></li>
              <li><a className="hover:text-lime" href="https://sentiwiki.copernicus.eu/" target="_blank" rel="noopener noreferrer">ESA Copernicus — Sentinel-1 &amp; Sentinel-2 (SentiWiki)</a></li>
              <li><a className="hover:text-lime" href="https://docs.qgis.org/" target="_blank" rel="noopener noreferrer">QGIS User Manual — Raster properties &amp; Print layouts</a></li>
            </ul>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted/80"><FileDown className="h-3 w-3" /> Imagery in this deck is illustrative; composites &amp; classes are simulated for teaching.</p>
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}
