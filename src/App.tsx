import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import {
  Blend, ChartSpline, CheckCheck, ChevronLeft, ChevronRight, ClipboardCheck, Download, Flag, Focus,
  Grid3x3, Layers, LayoutGrid, Map as MapIcon, Maximize2, Mic, Minimize2, Palette, Radar, Rocket,
  Satellite, ScanEye, Sparkles, Wand2, Waves, Workflow, X,
} from "lucide-react";
import { Background } from "@/components/Background";
import { DeckContext, EASE, SlideNumberContext, pad } from "@/components/ui";
import { loadImagery } from "@/lib/imagery";
import { SCRIPT, TOTAL_TIME } from "@/lib/script";
import { AgendaSlide, TitleSlide } from "@/slides/Intro";
import { ComponentsSlide, RemoteSensingSlide } from "@/slides/RemoteSensing";
import { ElectromagneticSpectrumSlide } from "@/slides/EMSpectrum";
import { DataAcquisitionSlide, LimitationsSlide, SensorTypesSlide } from "@/slides/Sensors";
import { MissionsSlide, SatelliteSlide } from "@/slides/Satellites";
import { SatelliteImageSlide, SpectrumSlide } from "@/slides/Imagery";
import { ResolutionSlide } from "@/slides/Resolution";
import { DownloadSlide } from "@/slides/Download";
import { EnhancementSlide, PreprocessingSlide } from "@/slides/Preprocessing";
import { QgisRasterSlide, SymbologySlide } from "@/slides/Qgis";
import { BandCombosSlide } from "@/slides/BandCombos";
import { AccuracySlide, ClassificationSlide, FieldDataSlide } from "@/slides/Classification";
import { MappingSlide, SummarySlide } from "@/slides/Mapping";
import { cn } from "@/utils/cn";

type SlideDef = { title: string; section: string; icon: ComponentType<{ className?: string }>; C: ComponentType };

const SLIDES: SlideDef[] = [
  { title: "See the planet. Map the change.", section: "Introduction", icon: Sparkles, C: TitleSlide },
  { title: "Roadmap", section: "Introduction", icon: MapIcon, C: AgendaSlide },
  { title: "What is Remote Sensing?", section: "Intro to RS", icon: Radar, C: RemoteSensingSlide },
  { title: "The Electromagnetic Spectrum", section: "Intro to RS", icon: Waves, C: ElectromagneticSpectrumSlide },
  { title: "Components of Remote Sensing", section: "Intro to RS", icon: Workflow, C: ComponentsSlide },
  { title: "Sensors & Scanning", section: "Intro to RS", icon: ScanEye, C: SensorTypesSlide },
  { title: "Data Acquisition Methods", section: "Intro to RS", icon: Rocket, C: DataAcquisitionSlide },
  { title: "Satellites & Orbits", section: "Satellites", icon: Satellite, C: SatelliteSlide },
  { title: "Earth-Observation Missions", section: "Satellites", icon: Rocket, C: MissionsSlide },
  { title: "The Satellite Image", section: "Satellite Image", icon: Grid3x3, C: SatelliteImageSlide },
  { title: "Spectral Signatures", section: "Satellite Image", icon: ChartSpline, C: SpectrumSlide },
  { title: "Image Resolution", section: "Satellite Image", icon: Focus, C: ResolutionSlide },
  { title: "Limitations & Constraints", section: "Intro to RS", icon: CheckCheck, C: LimitationsSlide },
  { title: "Download Satellite Images", section: "Data Acquisition", icon: Download, C: DownloadSlide },
  { title: "Data Preprocessing", section: "Image Processing", icon: Wand2, C: PreprocessingSlide },
  { title: "Image Enhancement", section: "Image Processing", icon: Sparkles, C: EnhancementSlide },
  { title: "QGIS › Raster Data", section: "QGIS", icon: Layers, C: QgisRasterSlide },
  { title: "QGIS › Symbology", section: "QGIS", icon: Palette, C: SymbologySlide },
  { title: "Band Combinations", section: "QGIS", icon: Blend, C: BandCombosSlide },
  { title: "Image Classification", section: "Image Processing", icon: ScanEye, C: ClassificationSlide },
  { title: "Field Data Collection", section: "Image Processing", icon: ClipboardCheck, C: FieldDataSlide },
  { title: "Accuracy Assessment", section: "Image Processing", icon: CheckCheck, C: AccuracySlide },
  { title: "Mapping the Satellite Image", section: "QGIS", icon: MapIcon, C: MappingSlide },
  { title: "Summary & Questions", section: "Conclusion", icon: Flag, C: SummarySlide },
];
const TOTAL = SLIDES.length;

const slideV: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 110 : -110, rotateY: d >= 0 ? -9 : 9, scale: 0.95, filter: "blur(10px)" }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.75, ease: EASE } },
  exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -110 : 110, rotateY: d >= 0 ? 9 : -9, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.5, ease: EASE } }),
};

function readHash() {
  const m = /^#slide-(\d+)$/.exec(window.location.hash);
  const i = m ? Number(m[1]) - 1 : 0;
  return i >= 0 && i < TOTAL ? i : 0;
}

function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 2300);
    return () => window.clearTimeout(id);
  }, [onDone]);
  return (
    <motion.div className="fixed inset-0 z-[60] grid cursor-pointer place-items-center bg-ink" onClick={onDone}
      initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="text-center">
        <div className="relative mx-auto h-40 w-40">
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute rounded-full border border-mint/25" style={{ inset: `${i * 18}px` }} />
          ))}
          <motion.div className="absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(139,228,207,.45), transparent 28%)" }}
            animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }} />
          <div className="absolute inset-[62px] rounded-full bg-lime shadow-[0_0_30px_rgba(216,238,134,.8)]" />
          {[[22, 40], [110, 30], [120, 104], [40, 118]].map(([x, y], i) => (
            <motion.span key={i} className="absolute h-2 w-2 rounded-full bg-lime" style={{ left: x, top: y }}
              animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.6, delay: i * 0.4 }} />
          ))}
        </div>
        <motion.p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-mint" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Group B · Establishing uplink
        </motion.p>
        <motion.p className="mt-1 font-display text-2xl font-bold" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          GIS &amp; <span className="em">Remote Sensing</span>
        </motion.p>
        <div className="mx-auto mt-4 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-linear-to-r from-mint to-lime" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
        </div>
        <p className="mt-3 text-[11px] text-muted">Click to skip</p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [[index, dir], setState] = useState<[number, number]>(() => [readHash(), 1]);
  const [overview, setOverview] = useState(false);
  const [presenter, setPresenter] = useState(false);
  const [intro, setIntro] = useState(true);
  const [isFs, setIsFs] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const fsSupported = typeof document !== "undefined" && !!document.documentElement.requestFullscreen;

  const goTo = useCallback((i: number) => {
    setState((p) => (i < 0 || i >= TOTAL || i === p[0] ? p : [i, i > p[0] ? 1 : -1]));
    setOverview(false);
  }, []);
  const next = useCallback(() => setState((p) => (p[0] < TOTAL - 1 ? [p[0] + 1, 1] : p)), []);
  const prev = useCallback(() => setState((p) => (p[0] > 0 ? [p[0] - 1, -1] : p)), []);
  const toggleFs = useCallback(() => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }, []);
  const endIntro = useCallback(() => setIntro(false), []);

  useEffect(() => { loadImagery().catch(() => {}); }, []);
  useEffect(() => { window.history.replaceState(null, "", `#slide-${index + 1}`); }, [index]);
  useEffect(() => {
    const onHash = () => goTo(readHash());
    const onFs = () => setIsFs(!!document.fullscreenElement);
    window.addEventListener("hashchange", onHash);
    document.addEventListener("fullscreenchange", onFs);
    return () => { window.removeEventListener("hashchange", onHash); document.removeEventListener("fullscreenchange", onFs); };
  }, [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable='true'], [role='slider']")) return;
      const onControl = !!t?.closest("button, a");
      switch (e.key) {
        case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
        case " ": if (onControl) return; e.preventDefault(); next(); break;
        case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
        case "Home": e.preventDefault(); goTo(0); break;
        case "End": e.preventDefault(); goTo(TOTAL - 1); break;
        case "g": case "G": case "o": case "O": setOverview((v) => !v); break;
        case "p": case "P": setPresenter((v) => !v); break;
        case "f": case "F": toggleFs(); break;
        case "Escape": setOverview(false); setIntro(false); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goTo, toggleFs]);

  const S = SLIDES[index];
  const Slide = S.C;

  return (
    <MotionConfig reducedMotion="user">
      <DeckContext.Provider value={{ index, total: TOTAL, goTo, openOverview: () => setOverview(true) }}>
        <Background />
        <div className="relative flex h-dvh w-full flex-col overflow-hidden">
          {/* Header */}
          <header className="relative z-20 flex h-14 shrink-0 items-center justify-between gap-3 px-3 sm:h-16 sm:px-6">
            <button onClick={() => goTo(0)} className="flex min-w-0 items-center gap-3 text-left" aria-label="Go to first slide">
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mint/40 bg-mint/10 sm:h-10 sm:w-10">
                <span className="h-3 w-3 rounded-full bg-mint shadow-[0_0_12px_#8be4cf]" />
                <span className="absolute inset-1 animate-orbit-fast rounded-full">
                  <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-lime" />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-[11px] font-bold uppercase tracking-[0.16em] sm:text-xs">GIS × Remote Sensing</span>
                <span className="hidden truncate text-[10px] uppercase tracking-[0.16em] text-muted min-[400px]:block">Group B · From orbit to map</span>
              </span>
            </button>
            <div className="hidden min-w-0 flex-1 justify-center md:flex">
              <AnimatePresence mode="wait">
                <motion.p key={index} className="truncate rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-muted"
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.3 }}>
                  <span className="text-mint">{S.section}</span> <span className="text-white/25">›</span> <span className="text-fog">{S.title}</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => setPresenter((v) => !v)}
                className={cn("btn-ghost !gap-2 !rounded-xl !px-3 !py-2 !text-xs", presenter && "!border-lime/60 !bg-lime/15 !text-lime")}
                aria-pressed={presenter}
                aria-label="Toggle speaker script (P)"
                title="Speaker script (P)"
              >
                <Mic className="h-4 w-4" /> <span className="hidden sm:inline">Script</span>
              </button>
              <button onClick={() => setOverview(true)} className="btn-ghost !gap-2 !rounded-xl !px-3 !py-2 !text-xs" aria-label="Open slide overview (G)">
                <LayoutGrid className="h-4 w-4" /> <span className="hidden sm:inline">Slides</span>
              </button>
              {fsSupported && (
                <button onClick={toggleFs} className="btn-ghost !rounded-xl !p-2" aria-label={isFs ? "Exit fullscreen (F)" : "Enter fullscreen (F)"}>
                  {isFs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              )}
            </div>
          </header>

          {/* Stage */}
          <main className="relative z-10 min-h-0 flex-1 px-2 sm:px-4 lg:px-6">
            <div
              className="relative h-full overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(140deg,rgba(16,35,43,.84),rgba(7,19,26,.9)_55%,rgba(12,28,36,.86))] shadow-[0_30px_90px_-30px_rgba(0,0,0,.9)] sm:rounded-[28px]"
              style={{ perspective: 1600 }}
              onTouchStart={(e) => {
                if ((e.target as HTMLElement).closest("[data-noswipe]") || e.touches.length !== 1) { touch.current = null; return; }
                touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              }}
              onTouchEnd={(e) => {
                const s = touch.current;
                touch.current = null;
                if (!s) return;
                const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
              }}
            >
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-44 -top-44 h-[520px] w-[520px] animate-orbit rounded-full border border-dashed border-mint/10" />
                <div className="absolute -right-24 -top-24 h-[280px] w-[280px] animate-orbit-rev rounded-full border border-mint/[0.08]" />
                <div className="absolute -bottom-52 -left-40 h-[460px] w-[460px] animate-orbit rounded-full border border-dashed border-lime/[0.07]" style={{ animationDuration: "70s" }} />
                <div className="absolute inset-0 animate-scan bg-[linear-gradient(to_bottom,transparent_93%,rgba(139,228,207,.045)_99%,transparent)]" style={{ animationDuration: "10s" }} />
                <motion.div className="absolute left-0 top-0 h-[2px] bg-linear-to-r from-mint via-lime to-peach" animate={{ width: `${((index + 1) / TOTAL) * 100}%` }} transition={{ duration: 0.8, ease: EASE }} />
              </div>
              {!intro && (
                <AnimatePresence initial={false} custom={dir}>
                  <motion.section
                    key={index}
                    custom={dir}
                    variants={slideV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="scroll-slim absolute inset-0 overflow-y-auto overflow-x-hidden overscroll-contain"
                    aria-roledescription="slide"
                    aria-label={`Slide ${index + 1} of ${TOTAL}: ${S.title}`}
                  >
                    <SlideNumberContext.Provider value={index}>
                      <Slide />
                    </SlideNumberContext.Provider>
                  </motion.section>
                </AnimatePresence>
              )}
            </div>
          </main>

          {/* Controls */}
          <nav className="relative z-20 shrink-0 px-2 pb-2 pt-2 sm:px-4 sm:pb-3" aria-label="Presentation controls">
            <div className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-mint/20 bg-[#0d1f27]/90 p-1.5 shadow-[0_14px_40px_rgba(0,0,0,.4)] backdrop-blur-xl sm:gap-3 sm:p-2">
              <motion.button whileTap={{ scale: 0.92 }} onClick={prev} disabled={index === 0} aria-label="Previous slide"
                className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-sm font-semibold transition hover:bg-mint/15 disabled:opacity-35 sm:px-3">
                <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Prev</span>
              </motion.button>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span className="truncate">{S.section}</span>
                  <span className="shrink-0 text-fog">{pad(index + 1)} <span className="text-white/30">/</span> {pad(TOTAL)}</span>
                </div>
                <div className="flex gap-[3px] sm:gap-1">
                  {SLIDES.map((s, i) => (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}: ${s.title}`} aria-current={i === index ? "step" : undefined}
                      className="group flex h-4 flex-1 items-center">
                      <span className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/10 transition-colors group-hover:bg-white/25">
                        {i < index && <span className="absolute inset-0 bg-mint/60" />}
                        {i === index && <motion.span layoutId="seg-active" className="absolute inset-0 rounded-full bg-linear-to-r from-lime to-mint shadow-[0_0_10px_rgba(216,238,134,.7)]" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.92 }} onClick={next} disabled={index === TOTAL - 1} aria-label="Next slide"
                className="inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-lime to-mint px-2 text-sm font-bold text-ink transition hover:brightness-110 disabled:opacity-35 sm:px-3">
                <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4" />
              </motion.button>
            </div>
          </nav>
        </div>

        {/* Presenter script */}
        <AnimatePresence>
          {presenter && (
            <motion.aside
              className="scroll-slim fixed bottom-20 left-2 z-40 max-h-[62vh] w-[min(400px,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-lime/30 bg-[#0b1e26]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,.6)] backdrop-blur-xl sm:bottom-24 sm:left-4"
              initial={{ opacity: 0, x: -30, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              aria-label="Speaker script for this slide"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="eyebrow">Speaker script</p>
                  <p className="mt-1 truncate font-display text-base font-bold">
                    {pad(index + 1)} · {S.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted">Speak for {SCRIPT[index].time} · whole talk: {TOTAL_TIME}</p>
                </div>
                <button onClick={() => setPresenter(false)} className="shrink-0 rounded-lg p-1.5 text-muted transition hover:bg-white/10 hover:text-fog" aria-label="Close speaker script">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {SCRIPT[index].cue && (
                <p className="mb-3 rounded-lg border border-peach/25 bg-peach/[0.07] px-2.5 py-1.5 text-[11px] text-peach">{SCRIPT[index].cue}</p>
              )}
              <ol className="space-y-2">
                {SCRIPT[index].lines.map((l, i) => (
                  <motion.li key={l} className="flex gap-2.5 text-[13px] leading-snug text-fog/90"
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}>
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint/15 font-mono text-[9px] font-bold text-mint">{i + 1}</span>
                    {l}
                  </motion.li>
                ))}
              </ol>
              <p className="mt-3 border-t border-white/10 pt-2 text-[10.5px] leading-snug text-muted">
                Short lines, easy words. Speak slowly and look at the audience. Press <span className="text-fog">P</span> to hide this panel.
              </p>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overview */}
        <AnimatePresence>
          {overview && (
            <motion.div className="scroll-slim fixed inset-0 z-50 overflow-y-auto bg-ink/85 p-4 backdrop-blur-xl sm:p-8"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOverview(false)} role="dialog" aria-modal="true" aria-label="All slides">
              <div className="mx-auto max-w-6xl" onClick={(e) => e.stopPropagation()}>
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">Slide overview</p>
                    <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Jump to any <span className="em">topic</span></h2>
                  </div>
                  <button onClick={() => setOverview(false)} className="btn-ghost !rounded-xl !p-2.5" aria-label="Close overview (Esc)"><X className="h-5 w-5" /></button>
                </div>
                <motion.div className="grid grid-cols-1 gap-3 min-[460px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" initial="hidden" animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}>
                  {SLIDES.map((s, i) => {
                    const I = s.icon;
                    return (
                      <motion.button key={i} onClick={() => goTo(i)}
                        variants={{ hidden: { opacity: 0, y: 24, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE } } }}
                        whileHover={{ y: -4 }}
                        className={cn("card group relative flex min-h-[124px] flex-col justify-between overflow-hidden p-4 text-left transition-colors hover:border-mint/50", i === index && "border-lime/60 bg-lime/[0.06]")}>
                        <span className="pointer-events-none absolute -right-2 -top-4 font-display text-6xl font-bold text-white/[0.05]">{pad(i + 1)}</span>
                        <span className="flex items-center justify-between">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint transition group-hover:bg-lime group-hover:text-ink"><I className="h-4 w-4" /></span>
                          {i === index && <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[9px] font-bold text-ink">NOW</span>}
                        </span>
                        <span>
                          <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{pad(i + 1)} · {s.section}</span>
                          <span className="mt-0.5 block font-display text-[15px] font-semibold leading-tight">{s.title}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
                <p className="mt-5 text-center text-xs text-muted">Keys: ← → navigate · G overview · F fullscreen · Home / End · Esc close</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{intro && <Intro onDone={endIntro} />}</AnimatePresence>
        <div className="sr-only" aria-live="polite">{`Slide ${index + 1} of ${TOTAL}: ${S.title}`}</div>
      </DeckContext.Provider>
    </MotionConfig>
  );
}
