import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, FolderOpen, Grid3x3, Hand, Info, Layers, MousePointer2, Ruler, Search, Square } from "lucide-react";
import { AutoBar, EASE, Heading, MockWindow, PlayToggle, Reveal, SlideShell, slideRightV, useAutoStep } from "@/components/ui";
import { CLASS_COLORS, CLASS_NAMES, NDVI_GRADIENT, SCENE, useImagery, type ImgKey } from "@/lib/imagery";
import { cn } from "@/utils/cn";

const MENU = ["Project", "Edit", "View", "Layer", "Settings", "Plugins", "Vector", "Raster", "Database", "Web", "Mesh", "Processing", "Help"];
/** Menus kept visible on narrow screens (the rest are clipped, like a real toolbar). */
const MOBILE_MENU = new Set(["Project", "Edit", "View", "Layer", "Raster"]);

/** Phase 0 → 1 after `ms`; resets instantly (same render) whenever `step` changes. */
function usePhase(step: number, ms = 1400) {
  const [state, setState] = useState({ step, phase: 0 });
  useEffect(() => {
    const id = window.setTimeout(() => setState({ step, phase: 1 }), ms);
    return () => window.clearTimeout(id);
  }, [step, ms]);
  return state.step === step ? state.phase : 0;
}

function useTicker(ms = 900) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return t;
}

type Panel = { items: string[]; hl: number; sub?: number[] };
function MenuCascade({ panels, left }: { panels: Panel[]; left: string }) {
  let offset = 0;
  return (
    <motion.div className="absolute top-0 z-30 flex" style={{ left }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -6 }}>
      {panels.map((p, pi) => {
        const mt = offset;
        offset += p.hl * 21;
        return (
          <motion.div key={pi} className="w-[150px] rounded-md border border-white/15 bg-[#1b313a] py-1 shadow-[0_18px_40px_rgba(0,0,0,.55)] sm:w-[170px]"
            style={{ marginTop: mt }} initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: pi * 0.4, duration: 0.25 }}>
            {p.items.map((it, i) => (
              <motion.div key={it} className="flex h-[21px] items-center justify-between px-2.5 text-[10.5px] text-fog/85"
                animate={i === p.hl ? { backgroundColor: ["rgba(139,228,207,0)", "rgba(139,228,207,1)"], color: ["#eef4ef", "#07131a"] } : {}}
                transition={{ delay: pi * 0.4 + 0.25, duration: 0.2 }}>
                <span className="truncate">{it}</span>
                {p.sub?.includes(i) && <span className="text-[9px]">▸</span>}
              </motion.div>
            ))}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

const RASTER_MENU = ["Raster Calculator…", "Align Rasters…", "Georeferencer…", "Analysis", "Projections", "Miscellaneous", "Extraction", "Conversion"];

function Dialog({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div className="absolute left-1/2 top-1/2 z-30 w-[78%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-mint/30 bg-[#16303a] shadow-[0_24px_60px_rgba(0,0,0,.6)]"
      initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: EASE }}>
      <p className="border-b border-white/10 bg-[#1d3a45] px-3 py-1.5 text-[10.5px] font-semibold">{title}</p>
      <div className="space-y-1.5 p-3 text-[10px]">{children}</div>
    </motion.div>
  );
}
const Tick = ({ label, delay = 0.3 }: { label: string; delay?: number }) => (
  <p className="flex items-center gap-1.5">
    <span className="relative grid h-3.5 w-3.5 place-items-center rounded-sm border border-lime">
      <motion.span className="grid h-full w-full place-items-center bg-lime" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay, type: "spring" }}>
        <Check className="h-2.5 w-2.5 text-ink" strokeWidth={4} />
      </motion.span>
    </span>
    <span className="text-fog">{label}</span>
  </p>
);
const Progress = ({ delay = 0.6, dur = 0.9 }: { delay?: number; dur?: number }) => (
  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
    <motion.div className="h-full bg-linear-to-r from-mint to-lime" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay, duration: dur }} />
  </div>
);

function QgisFrame({ title, menuActive, layers, children, overlay }: {
  title: string; menuActive?: string; layers: ReactNode; children: ReactNode; overlay?: ReactNode;
}) {
  const t = useTicker();
  return (
    <MockWindow title={title}>
      <div className="flex gap-2.5 overflow-hidden border-b border-white/10 bg-[#13262e] px-3 py-1 text-[10.5px] text-muted">
        {MENU.map((m) => (
          <span key={m} className={cn("shrink-0 rounded px-1 py-0.5 transition-colors", !MOBILE_MENU.has(m) && "hidden sm:inline", m === menuActive && "bg-mint/25 text-mint")}>{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#10222a] px-3 py-1.5 text-muted">
        {[FolderOpen, Hand, Search, MousePointer2, Layers, Grid3x3, Ruler, Info].map((I, i) => <I key={i} className="h-3.5 w-3.5" />)}
      </div>
      <div className="relative grid grid-cols-[104px_minmax(0,1fr)] sm:grid-cols-[150px_minmax(0,1fr)]">
        <div className="border-r border-white/10 bg-[#0f2129] p-2">
          <p className="mb-1.5 text-[10px] font-bold text-fog">Layers</p>
          <div className="space-y-1">{layers}</div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden bg-[#0b1a20]">{children}</div>
        <AnimatePresence>{overlay}</AnimatePresence>
      </div>
      <div className="flex justify-between gap-3 border-t border-white/10 bg-[#13262e] px-3 py-1 font-mono text-[9px] text-muted">
        <span className="truncate">Coordinate {245612 + ((t * 137) % 900)}, {2649810 - ((t * 71) % 700)}</span>
        <span className="hidden sm:inline">Scale 1:50,000</span>
        <span className="text-mint">EPSG:32646</span>
      </div>
    </MockWindow>
  );
}

function LayerRow({ name, kind = "raster", checked = true, delay = 0, hl }: { name: string; kind?: "raster" | "vector"; checked?: boolean; delay?: number; hl?: boolean }) {
  return (
    <motion.div className={cn("flex items-center gap-1.5 rounded px-1 py-0.5 text-[9.5px] sm:text-[10px]", hl && "bg-mint/15")}
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.3 }}>
      {checked ? <span className="grid h-3 w-3 shrink-0 place-items-center rounded-sm bg-lime"><Check className="h-2 w-2 text-ink" strokeWidth={4} /></span> : <Square className="h-3 w-3 shrink-0 text-muted" />}
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", kind === "raster" ? "bg-linear-to-br from-[#6a8f5b] to-[#2d6f8c]" : "border border-lime")} />
      <span className="truncate text-fog/90">{name}</span>
    </motion.div>
  );
}

const AOI_CLIP = "polygon(26% 26%, 72% 20%, 80% 62%, 40% 76%, 20% 56%)";

/* ================================================================== */
/* Slide: QGIS › Raster data                                            */
/* ================================================================== */

const RASTER_STEPS = [
  { t: "Create a project & check the CRS", d: "Project → New. The CRS shown bottom-right (e.g. EPSG:32646 · WGS 84 / UTM 46N) is used for the map.", path: "Project → New" },
  { t: "Add the raster bands", d: "Add the downloaded band files, or drag the .TIF files in from the Browser panel.", path: "Layer → Add Layer → Add Raster Layer… (Ctrl+Shift+R)" },
  { t: "Stack the bands into one raster", d: "Select B2, B3, B4, B5 in order and tick “Place each input file into a separate band”.", path: "Raster → Miscellaneous → Build Virtual Raster…" },
  { t: "Clip to your study area", d: "Use your AOI polygon as the mask to cut the scene to the study area.", path: "Raster → Extraction → Clip Raster by Mask Layer…" },
];
const RMS = 5200;

export function QgisRasterSlide() {
  const img = useImagery();
  const { step, select, playing, setPlaying } = useAutoStep(RASTER_STEPS.length, RMS);
  const phase = usePhase(step, 1500);
  const url = (k: ImgKey) => img?.urls[k] ?? SCENE;

  const menuActive = step === 1 ? "Layer" : step >= 2 ? "Raster" : "Project";
  let overlay: ReactNode = null;
  if (phase === 0 && step === 1)
    overlay = <MenuCascade key="m1" left="22%" panels={[
      { items: ["Data Source Manager", "Create Layer", "Add Layer", "Embed Layers…", "Add from Layer Definition…"], hl: 2, sub: [1, 2] },
      { items: ["Add Vector Layer…", "Add Raster Layer…", "Add Mesh Layer…", "Add Delimited Text Layer…"], hl: 1 },
    ]} />;
  if (phase === 0 && step === 2)
    overlay = <MenuCascade key="m2" left="30%" panels={[{ items: RASTER_MENU, hl: 5, sub: [3, 4, 5, 6, 7] }, { items: ["Build Virtual Raster…", "Merge…", "Raster Information…", "Build Overviews…", "Tile Index…"], hl: 0 }]} />;
  if (phase === 0 && step === 3)
    overlay = <MenuCascade key="m3" left="30%" panels={[{ items: RASTER_MENU, hl: 6, sub: [3, 4, 5, 6, 7] }, { items: ["Clip Raster by Extent…", "Clip Raster by Mask Layer…", "Contour…"], hl: 1 }]} />;
  if (phase === 1 && step === 2)
    overlay = (
      <Dialog key="d2" title="Build Virtual Raster">
        <p className="text-muted">Input layers: <b className="text-fog">4 inputs selected</b></p>
        <Tick label="Place each input file into a separate band" />
        <p className="text-muted">Resolution: <b className="text-fog">Average</b></p>
        <Progress />
      </Dialog>
    );
  if (phase === 1 && step === 3)
    overlay = (
      <Dialog key="d3" title="Clip Raster by Mask Layer">
        <p className="text-muted">Input layer: <b className="text-fog">Landsat_Stack</b> · Mask: <b className="text-fog">AOI</b></p>
        <Tick label="Match the extent of the clipped raster to the mask" />
        <Progress />
      </Dialog>
    );
  const dkey = `${step}-${phase}`;
  const [dialogDone, setDialogDone] = useState<string | null>(null);
  useEffect(() => {
    if (phase !== 1) return;
    const id = window.setTimeout(() => setDialogDone(dkey), 1700);
    return () => window.clearTimeout(id);
  }, [dkey, phase]);
  const showDialog = dialogDone !== dkey;
  if (phase === 1 && !showDialog) overlay = null;

  const bands = ["SR_B5", "SR_B4", "SR_B3", "SR_B2"];
  const layers = (
    <>
      {step === 0 && <p className="text-[9.5px] leading-snug text-muted">No layers yet — start by adding your satellite bands.</p>}
      {step === 3 && phase === 1 && <LayerRow name="Clipped_Stack.tif" delay={1.7} hl />}
      {step === 3 && <LayerRow name="AOI" kind="vector" delay={0.1} />}
      {step >= 2 && (step > 2 || (phase === 1 && !showDialog)) && <LayerRow name="Landsat_Stack.vrt" hl={step === 2} checked={step === 2} />}
      {step >= 1 && (step > 1 || phase === 1) && bands.map((b, i) => <LayerRow key={b} name={`LC09_…_${b}`} checked={step === 1} delay={step === 1 ? i * 0.2 : 0} />)}
    </>
  );

  const showBand = step === 1 && phase === 1;
  const showStack = step === 2 && phase === 1 && !showDialog;
  const showClip = step === 3;

  return (
    <SlideShell eyebrow="07 · QGIS › Raster Data">
      <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[.82fr_1.18fr] lg:gap-8">
        <div>
          <Heading text="Load satellite bands *into QGIS.*" />
          <Reveal as="p" className="lead mt-3">Downloaded bands arrive as separate single-band rasters. In QGIS we add them, stack them and clip them to the study area.</Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {RASTER_STEPS.map((s, i) => (
              <button key={s.t} onClick={() => select(i)} className={cn("relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === step ? "border-lime/50" : "border-transparent hover:border-white/10")}>
                {i === step && <motion.span layoutId="qr-step" className="absolute inset-0 bg-lime/[0.07]" />}
                <span className="relative flex items-center gap-2.5">
                  <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold", i <= step ? "border-lime text-lime" : "border-white/20 text-muted", i < step && "bg-lime text-ink")}>
                    {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="text-sm font-semibold">{s.t}</span>
                </span>
                <AnimatePresence initial={false}>
                  {i === step && (
                    <motion.span className="relative block overflow-hidden pl-[34px]" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <span className="mt-1 block text-xs leading-snug text-muted">{s.d}</span>
                      <span className="mt-1.5 inline-block rounded-md border border-lime/25 bg-lime/[0.07] px-2 py-1 font-mono text-[10px] font-semibold text-lime">{s.path}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={step} ms={RMS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="mx-auto w-full max-w-[max(70vh,320px)]">
          <QgisFrame title="QGIS — satellite_project.qgz" menuActive={menuActive} layers={layers} overlay={overlay}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:24px_24px]" />
            {step === 0 && (
              <motion.div className="absolute inset-0 grid place-items-center text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div>
                  <motion.div className="mx-auto mb-2 h-12 w-12 rounded-full border-2 border-dashed border-mint/50" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} />
                  <p className="font-display text-sm font-semibold">New project</p>
                  <p className="font-mono text-[10px] text-mint">CRS · EPSG:32646</p>
                </div>
              </motion.div>
            )}
            {showBand && (
              <motion.img src={url("bandNIR")} alt="" className="absolute inset-0 h-full w-full object-cover"
                initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.4, ease: "easeInOut", delay: 0.8 }} />
            )}
            {step === 2 && !showStack && <img src={url("bandNIR")} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
            {showStack && (
              <motion.img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }} />
            )}
            {showClip && (
              <>
                <img src={SCENE} alt="" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", phase === 1 && !showDialog ? "opacity-15" : "opacity-100")} />
                {phase === 1 && !showDialog && (
                  <motion.img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: AOI_CLIP }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
                )}
                <svg viewBox="0 0 100 75" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <motion.polygon points="26,19.5 72,15 80,46.5 40,57 20,42" fill="none" stroke="#d8ee86" strokeWidth={0.7} strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
                </svg>
              </>
            )}
            {(showBand || showStack) && (
              <span className="absolute bottom-1.5 left-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] text-fog/85">
                {showBand ? "Singleband gray · SR_B5 (NIR)" : "Multiband color · 4-3-2"}
              </span>
            )}
          </QgisFrame>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: QGIS › Symbology                                              */
/* ================================================================== */

const RENDERS = [
  { k: "gray", name: "Singleband gray", img: "gray" as ImgKey, use: "One band shown from black to white.", ex: "e.g. NIR band, panchromatic band" },
  { k: "pseudo", name: "Singleband pseudocolor", img: "ndvi" as ImgKey, use: "One band + a colour ramp.", ex: "e.g. NDVI, elevation (DEM), temperature" },
  { k: "multi", name: "Multiband color", img: "natural" as ImgKey, use: "Three bands → red, green & blue channels.", ex: "e.g. true- & false-colour composites" },
  { k: "palette", name: "Paletted / Unique values", img: "classes" as ImgKey, use: "Each class value gets its own colour.", ex: "e.g. land-cover classification" },
];
const SMS = 5000;

function Histogram({ series }: { series: { data: number[]; color: string }[] }) {
  return (
    <svg viewBox="0 0 128 40" preserveAspectRatio="none" className="h-12 w-full">
      {series.map((s, i) => {
        const d = `M0 40 ${s.data.map((v, j) => `L${j * 2} ${40 - v * 36}`).join(" ")} L126 40 Z`;
        return <motion.path key={i} d={d} fill={s.color} fillOpacity={0.28} stroke={s.color} strokeWidth={0.8} vectorEffect="non-scaling-stroke"
          initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }} style={{ transformOrigin: "bottom", transformBox: "fill-box" }} />;
      })}
      <line x1={6} x2={6} y1={0} y2={40} stroke="#d8ee86" strokeWidth={1} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      <line x1={118} x2={118} y1={0} y2={40} stroke="#d8ee86" strokeWidth={1} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const Row = ({ label, value, color }: { label: string; value: ReactNode; color?: string }) => (
  <div className="grid grid-cols-[78px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[92px_minmax(0,1fr)]">
    <span className="text-[10px] text-muted">{label}</span>
    <span className="flex items-center justify-between gap-1 truncate rounded border border-white/15 bg-[#081820] px-2 py-1 text-[10px] text-fog">
      <span className="flex min-w-0 items-center gap-1.5 truncate">{color && <i className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: color }} />}{value}</span>
      <ChevronDown className="h-3 w-3 shrink-0 text-muted" />
    </span>
  </div>
);

function RenderSettings({ k }: { k: string }) {
  const img = useImagery();
  const h = img?.hist;
  const flat = useMemo(() => Array(64).fill(0.3), []);
  if (k === "gray")
    return (
      <div className="space-y-1.5">
        <Row label="Gray band" value="Band 4 (SR_B5 · NIR)" />
        <Row label="Color gradient" value="Black to White" />
        <Row label="Min / Max" value="7,520 / 22,310" />
        <Row label="Contrast" value="Stretch to MinMax" />
        <Histogram series={[{ data: h?.nir ?? flat, color: "#eef4ef" }]} />
      </div>
    );
  if (k === "pseudo")
    return (
      <div className="space-y-1.5">
        <Row label="Band" value="Band 1 (NDVI)" />
        <Row label="Min / Max" value="−0.20 / 0.80" />
        <Row label="Interpolation" value="Linear" />
        <div className="grid grid-cols-[78px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[92px_minmax(0,1fr)]">
          <span className="text-[10px] text-muted">Color ramp</span>
          <motion.span className="h-5 origin-left rounded border border-white/15" style={{ background: NDVI_GRADIENT }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.2 }} />
        </div>
        <p className="rounded border border-lime/20 bg-lime/[0.06] px-2 py-1 font-mono text-[9.5px] text-lime">Raster Calculator: (B5 − B4) / (B5 + B4)</p>
      </div>
    );
  if (k === "multi")
    return (
      <div className="space-y-1.5">
        <Row label="Red band" value="Band 3 (SR_B4)" color="#f59f9a" />
        <Row label="Green band" value="Band 2 (SR_B3)" color="#bce28e" />
        <Row label="Blue band" value="Band 1 (SR_B2)" color="#86c8f4" />
        <Row label="Min / Max" value="Cumulative count cut 2–98 %" />
        <Histogram series={[{ data: h?.r ?? flat, color: "#f59f9a" }, { data: h?.g ?? flat, color: "#bce28e" }, { data: h?.b ?? flat, color: "#86c8f4" }]} />
      </div>
    );
  return (
    <div className="space-y-1.5">
      <Row label="Band" value="Band 1 (land cover)" />
      <div className="space-y-0.5 rounded border border-white/10 p-1.5">
        {CLASS_NAMES.map((n, i) => (
          <motion.div key={n} className="flex items-center gap-2 text-[10px]" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.09 }}>
            <span className="w-3 font-mono text-muted">{i + 1}</span>
            <i className="h-3 w-5 rounded-sm" style={{ background: `rgb(${CLASS_COLORS[i].join(",")})` }} />
            <span className="text-fog">{n}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1.5">
        <span className="rounded bg-mint px-2 py-0.5 text-[10px] font-bold text-ink">Classify</span>
        <span className="rounded border border-white/15 px-2 py-0.5 text-[10px] text-muted">+ / −</span>
      </div>
    </div>
  );
}

export function SymbologySlide() {
  const img = useImagery();
  const { step, select, playing, setPlaying } = useAutoStep(RENDERS.length, SMS);
  const r = RENDERS[step];
  return (
    <SlideShell eyebrow="08 · QGIS › Raster › Symbology">
      <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[.8fr_1.2fr] lg:gap-8">
        <div>
          <Heading text="Raster symbology: *give pixels meaning.*" />
          <Reveal as="p" className="lead mt-3">Symbology controls how pixel values are drawn. It changes the <b className="text-fog">appearance</b>, never the stored values.</Reveal>
          <Reveal className="mt-3 flex flex-wrap gap-1.5">
            <span className="chip chip-lime font-mono !text-[10.5px]">Right-click layer → Properties… → Symbology</span>
            <span className="chip font-mono !text-[10.5px]">Layer Styling panel · F7</span>
          </Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {RENDERS.map((x, i) => (
              <button key={x.k} onClick={() => select(i)} className={cn("relative w-full overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === step ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                {i === step && <motion.span layoutId="sym-step" className="absolute inset-0 bg-linear-to-r from-lime/[0.1] to-transparent" />}
                <span className="relative flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">{x.name}</span>
                  <span className="font-mono text-[10px] text-lime">0{i + 1}</span>
                </span>
                <span className="relative block text-xs text-muted">{x.use} <span className="text-mint/90">{x.ex}</span></span>
              </button>
            ))}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={step} ms={SMS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
        </div>

        <Reveal variants={slideRightV}>
          <MockWindow title="Layer Properties — Landsat_Stack — Symbology">
            <div className="grid sm:grid-cols-[110px_minmax(0,1fr)]">
              <div className="hidden border-r border-white/10 bg-[#0f2129] p-2 text-[10.5px] text-muted sm:block">
                {["Information", "Source", "Symbology", "Transparency", "Histogram", "Rendering", "Pyramids", "Metadata"].map((x) => (
                  <p key={x} className={cn("rounded px-2 py-1", x === "Symbology" && "bg-mint/20 font-bold text-mint")}>{x}</p>
                ))}
              </div>
              <div className="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="space-y-2">
                  <div>
                    <p className="mb-1 text-[10px] font-semibold text-muted">Render type</p>
                    <motion.div key={r.k} className="flex items-center justify-between rounded border border-lime/50 bg-[#081820] px-2 py-1.5 text-[11px] font-semibold text-lime"
                      initial={{ boxShadow: "0 0 0 0 rgba(216,238,134,.7)" }} animate={{ boxShadow: "0 0 0 8px rgba(216,238,134,0)" }} transition={{ duration: 0.8 }}>
                      {r.name} <ChevronDown className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={r.k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                      <RenderSettings k={r.k} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black">
                    <AnimatePresence initial={false}>
                      <motion.img key={r.k} src={img?.urls[r.img] ?? SCENE} alt={`${r.name} rendering`} className={cn("absolute inset-0 h-full w-full object-cover", r.k === "palette" && "pixelated")}
                        initial={{ opacity: 0, scale: 1.08, filter: "blur(6px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} />
                    </AnimatePresence>
                    <span className="absolute left-1.5 top-1.5 rounded bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-lime">{r.name}</span>
                  </div>
                  <div className="mt-2 min-h-[22px]">
                    {r.k === "pseudo" && (
                      <div>
                        <div className="h-2 rounded-full" style={{ background: NDVI_GRADIENT }} />
                        <div className="mt-0.5 flex justify-between font-mono text-[9px] text-muted"><span>−0.2 water / built-up</span><span>0.8 dense vegetation</span></div>
                      </div>
                    )}
                    {r.k === "gray" && <div className="flex items-center gap-2 font-mono text-[9px] text-muted"><span>Low</span><div className="h-2 flex-1 rounded-full bg-linear-to-r from-black to-white" /><span>High NIR</span></div>}
                    {r.k === "multi" && <p className="font-mono text-[9.5px] text-muted">R = B4 · G = B3 · B = B2 → looks like a photo</p>}
                    {r.k === "palette" && (
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                        {CLASS_NAMES.map((n, i) => (
                          <span key={n} className="flex items-center gap-1 text-[9px] text-muted"><i className="h-2 w-2 rounded-sm" style={{ background: `rgb(${CLASS_COLORS[i].join(",")})` }} />{n}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex justify-end gap-1.5">
                    <span className="rounded border border-white/15 px-2.5 py-1 text-[10px] text-muted">Cancel</span>
                    <motion.span key={r.k} className="rounded bg-mint px-2.5 py-1 text-[10px] font-bold text-ink" animate={{ scale: [1, 0.9, 1] }} transition={{ delay: 0.5, duration: 0.3 }}>Apply</motion.span>
                    <span className="rounded bg-lime px-2.5 py-1 text-[10px] font-bold text-ink">OK</span>
                  </div>
                </div>
              </div>
            </div>
          </MockWindow>
          <p className="mt-2 text-[11px] text-muted">Also available: <b className="text-fog">Hillshade</b> &amp; <b className="text-fog">Contours</b> (for DEMs). Classified image &amp; NDVI here are simulated for teaching.</p>
        </Reveal>
      </div>
    </SlideShell>
  );
}
