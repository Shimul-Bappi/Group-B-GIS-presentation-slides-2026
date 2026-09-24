import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Binary, Building2, Droplets, FileText, Grid3x3, Layers3, Leaf, Mountain } from "lucide-react";
import { EASE, Heading, Reveal, SlideShell, TiltCard, itemV, slideRightV } from "@/components/ui";
import { H, SCENE, W, useImagery, type ImgKey } from "@/lib/imagery";
import { smoothPath } from "@/lib/svg";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: Satellite image = pixels + bands + DN values                  */
/* ================================================================== */

const SPOTS = [
  { name: "River", x: 30, y: 62 },
  { name: "Town", x: 60, y: 40 },
  { name: "Cropland", x: 18, y: 45 },
  { name: "Lake", x: 49, y: 83 },
  { name: "Forest", x: 86, y: 70 },
  { name: "Sandbar", x: 42.5, y: 55 },
];
const BANDS = [
  { k: "R", label: "Red · B4", color: "#f59f9a" },
  { k: "G", label: "Green · B3", color: "#bce28e" },
  { k: "B", label: "Blue · B2", color: "#86c8f4" },
  { k: "N", label: "NIR · B8", color: "#e7a3c4" },
] as const;
type BandK = (typeof BANDS)[number]["k"];
const BOX = 8;

function PixelZoom() {
  const img = useImagery();
  const [spot, setSpot] = useState(0);
  const [band, setBand] = useState<BandK>("N");
  useEffect(() => {
    const id = window.setInterval(() => setSpot((s) => (s + 1) % SPOTS.length), 2800);
    return () => window.clearInterval(id);
  }, []);
  const s = SPOTS[spot];
  const cells = useMemo(() => {
    if (!img) return null;
    const n = 6, boxPx = (BOX / 100) * W, step = boxPx / n;
    const x0 = (s.x / 100) * W - boxPx / 2, y0 = (s.y / 100) * H - boxPx / 2;
    const out: { r: number; g: number; b: number; n: number }[] = [];
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const px = Math.min(W - 1, Math.max(0, Math.round(x0 + (i + 0.5) * step)));
      const py = Math.min(H - 1, Math.max(0, Math.round(y0 + (j + 0.5) * step)));
      const idx = py * W + px, p = idx * 4;
      out.push({ r: img.rgba[p], g: img.rgba[p + 1], b: img.rgba[p + 2], n: img.nir[idx] });
    }
    return out;
  }, [img, s.x, s.y]);
  const val = (c: { r: number; g: number; b: number; n: number }) => (band === "R" ? c.r : band === "G" ? c.g : band === "B" ? c.b : c.n);
  const bandInfo = BANDS.find((b) => b.k === band)!;

  return (
    <div className="grid gap-3 p-3 sm:grid-cols-[1.35fr_1fr] sm:p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <img src={SCENE} alt="True-colour satellite scene of a river floodplain" className="h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 animate-scan bg-[linear-gradient(to_bottom,transparent_85%,rgba(139,228,207,.28)_99%,transparent)]" />
        <motion.div
          className="absolute rounded-[3px] border-2 border-lime shadow-[0_0_0_2000px_rgba(4,11,16,.35),0_0_18px_rgba(216,238,134,.8)]"
          style={{ width: `${BOX}%`, height: `${BOX * (4 / 3)}%` }}
          animate={{ left: `${s.x - BOX / 2}%`, top: `${s.y - (BOX * 2) / 3}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <motion.span
          className="absolute rounded bg-ink/85 px-1.5 py-0.5 font-mono text-[10px] font-bold text-lime"
          animate={{ left: `${Math.min(s.x + BOX / 2 + 1, 80)}%`, top: `${Math.max(s.y - 8, 2)}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {s.name}
        </motion.span>
        <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fog">True colour · 4-3-2</span>
      </div>

      <div className="flex flex-col">
        <div className="mb-2 flex flex-wrap gap-1">
          {BANDS.map((b) => (
            <button key={b.k} onClick={() => setBand(b.k)}
              className={cn("rounded-md border px-2 py-1 font-mono text-[10px] font-bold transition", band === b.k ? "border-transparent text-ink" : "border-white/15 text-muted hover:text-fog")}
              style={band === b.k ? { background: b.color } : undefined}>
              {b.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-[3px] rounded-lg border border-white/10 bg-black/30 p-[3px]">
          {(cells ?? Array.from({ length: 36 }, () => null)).map((c, i) => {
            const v = c ? val(c) : 0;
            return (
              <div key={i} className="grid aspect-square place-items-center rounded-[3px] font-mono text-[9px] font-bold tabular-nums transition-colors duration-700 sm:text-[10px]"
                style={{ background: `rgb(${v},${v},${v})`, color: v > 140 ? "#07131a" : "#eef4ef" }}>
                {c ? v : "…"}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          <span className="font-mono font-bold" style={{ color: bandInfo.color }}>{bandInfo.label}</span>
          <span className="text-muted">DN = Digital Number (0–255)</span>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-muted">
          Each square is one <b className="text-fog">pixel</b>. Switch to <b className="text-fog">NIR</b>: water turns dark, vegetation bright.
        </p>
      </div>
    </div>
  );
}

const STACK: { key: ImgKey; label: string; color: string }[] = [
  { key: "chB", label: "B2 · Blue", color: "#86c8f4" },
  { key: "chG", label: "B3 · Green", color: "#bce28e" },
  { key: "chR", label: "B4 · Red", color: "#f59f9a" },
  { key: "bandNIR", label: "B8 · NIR", color: "#e7a3c4" },
];

function BandStack() {
  const img = useImagery();
  const [exploded, setExploded] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => setExploded((e) => !e), 3300);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="relative p-3 sm:p-4">
      <div className="relative mx-auto grid aspect-[4/3] w-full max-w-[max(56vh,300px)] place-items-center overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_60%,rgba(139,228,207,.12),transparent_65%)]" style={{ perspective: 1100 }}>
        <div className="relative aspect-[4/3] w-[54%]" style={{ transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-38deg)" }}>
          {STACK.map((l, i) => (
            <motion.div key={l.key} className="absolute inset-0 rounded-md border-2 shadow-[0_10px_30px_rgba(0,0,0,.45)]"
              style={{ borderColor: l.color }}
              animate={{ z: exploded ? i * 48 - 70 : 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 15, delay: exploded ? i * 0.07 : (3 - i) * 0.05 }}>
              <img src={img?.urls[l.key] ?? SCENE} alt="" className="h-full w-full rounded-[4px] object-cover" />
              <span className="absolute -left-2 top-0 -translate-x-full whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[11px] font-bold text-ink" style={{ background: l.color }}>
                {l.label}
              </span>
            </motion.div>
          ))}
          <motion.div className="absolute inset-0 overflow-hidden rounded-md border-2 border-lime" animate={{ opacity: exploded ? 0 : 1, z: 4 }} transition={{ duration: 0.6, delay: exploded ? 0 : 0.5 }}>
            <img src={SCENE} alt="" className="h-full w-full object-cover" />
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={String(exploded)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute bottom-3 left-3 rounded-lg border border-white/10 bg-ink/80 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-mint backdrop-blur">
            {exploded ? "4 bands · stored as separate layers" : "Bands 4-3-2 → natural-colour composite"}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-muted">
        A multispectral image is a <b className="text-fog">stack of bands</b>. Displaying three of them through the red, green and blue channels creates a colour composite.
      </p>
    </div>
  );
}

const TERMS = [
  { icon: Grid3x3, t: "Pixel", d: "Smallest unit of the image; covers a ground area, e.g. 10 m × 10 m." },
  { icon: Layers3, t: "Band", d: "One layer recording a specific wavelength range (blue, red, NIR…)." },
  { icon: Binary, t: "DN value", d: "Digital Number stored per pixel: 0–255 (8-bit) or 0–4095 (12-bit)." },
  { icon: FileText, t: "Metadata", d: "Date, sensor, CRS, cloud cover, path/row — the image’s ‘ID card’." },
];

export function SatelliteImageSlide() {
  const [tab, setTab] = useState<"pixels" | "stack">("pixels");
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setTab((t) => (t === "pixels" ? "stack" : "pixels")), 11000);
    return () => window.clearTimeout(id);
  }, [tab, auto]);

  return (
    <SlideShell eyebrow="04 · Satellite Image">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-9">
        <div>
          <Heading text="A satellite image is *data,* not just a photo." />
          <Reveal as="p" className="lead mt-4">
            It is a <b className="text-fog">raster</b>: a grid of pixels where every pixel stores the energy measured in each spectral band.
          </Reveal>
          <div className="mt-5 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
            {TERMS.map(({ icon: I, t, d }) => (
              <TiltCard key={t} className="p-3.5">
                <div className="flex items-center gap-2">
                  <I className="h-4 w-4 text-lime" />
                  <h3 className="font-display text-[15px] font-semibold">{t}</h3>
                </div>
                <p className="mt-1 text-xs leading-snug text-muted">{d}</p>
              </TiltCard>
            ))}
          </div>
          <Reveal className="mt-4">
            <p className="mini-label mb-2">Image types</p>
            <div className="flex flex-wrap gap-2">
              {[
                ["Panchromatic", "1 band · B/W"],
                ["Multispectral", "3–15 bands"],
                ["Hyperspectral", "100s of bands"],
                ["Radar (SAR)", "microwave"],
              ].map(([a, b], i) => (
                <motion.span key={a} className="chip" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1 + i * 0.1 }}>
                  <b className="text-fog">{a}</b> <span className="text-muted">{b}</span>
                </motion.span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="card overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2 sm:px-4">
            <div className="relative flex rounded-full bg-white/5 p-1">
              {([["pixels", "Pixels & DN"], ["stack", "Band stack"]] as const).map(([k, l]) => (
                <button key={k} onClick={() => { setTab(k); setAuto(false); }}
                  className={cn("relative z-10 rounded-full px-3 py-1 text-xs font-semibold transition-colors", tab === k ? "text-ink" : "text-muted hover:text-fog")}>
                  {tab === k && <motion.span layoutId="img-tab" className="absolute inset-0 -z-10 rounded-full bg-mint" />}
                  {l}
                </button>
              ))}
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:inline">Live pixel sampling</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease: EASE }}>
              {tab === "pixels" ? <PixelZoom /> : <BandStack />}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: EM spectrum + spectral signatures                             */
/* ================================================================== */

const EM = [
  { name: "Gamma", w: 6, c: "#5b4fc0" },
  { name: "X-ray", w: 6, c: "#6d5fe0" },
  { name: "UV", w: 7, c: "#8f74f0" },
  { name: "Visible", w: 13, c: "linear-gradient(90deg,#7b6cf0,#4f8ff0,#3fc1d8,#58c96b,#d6de4a,#f0a13a,#ef5a4f)", r: "0.4–0.7 µm" },
  { name: "Near-IR", w: 12, c: "#b24f72", r: "0.7–1.3 µm" },
  { name: "SWIR", w: 12, c: "#b97a45", r: "1.3–3 µm" },
  { name: "Thermal IR", w: 14, c: "#9b573c", r: "3–14 µm" },
  { name: "Microwave", w: 17, c: "#5f7f52", r: "1 mm–1 m" },
  { name: "Radio", w: 13, c: "#44625d" },
];

type Curve = { k: string; name: string; color: string; dash?: string; pts: [number, number][] };
const CURVES: Curve[] = [
  { k: "veg", name: "Vegetation", color: "#7fd66b", pts: [[0.4, 4], [0.45, 4.5], [0.5, 6], [0.55, 12], [0.6, 8], [0.65, 5], [0.68, 4.5], [0.7, 12], [0.72, 28], [0.75, 44], [0.8, 48], [0.9, 50], [1.0, 50], [1.1, 48], [1.2, 44], [1.3, 40], [1.4, 26], [1.45, 18], [1.5, 24], [1.6, 32], [1.7, 33], [1.8, 28], [1.9, 12], [1.95, 8], [2.0, 12], [2.1, 18], [2.2, 20], [2.3, 16], [2.4, 12], [2.5, 9]] },
  { k: "soil", name: "Dry soil", color: "#e0b27a", pts: [[0.4, 8], [0.5, 12], [0.6, 17], [0.7, 21], [0.8, 24], [0.9, 26], [1.0, 28], [1.2, 31], [1.4, 30], [1.45, 27], [1.5, 31], [1.6, 34], [1.8, 35], [1.9, 30], [1.95, 27], [2.0, 31], [2.2, 33], [2.4, 30], [2.5, 28]] },
  { k: "urban", name: "Urban / concrete", color: "#c9d2d4", dash: "5 5", pts: [[0.4, 12], [0.5, 16], [0.6, 19], [0.7, 21], [0.8, 22], [1.0, 23], [1.2, 24], [1.4, 23], [1.6, 25], [1.8, 25], [2.0, 24], [2.2, 23], [2.5, 22]] },
  { k: "water", name: "Clear water", color: "#5fb2ff", pts: [[0.4, 8], [0.45, 8], [0.5, 7], [0.55, 5.5], [0.6, 4], [0.65, 3], [0.7, 2], [0.75, 1.2], [0.8, 0.8], [0.9, 0.4], [1.0, 0.2], [1.2, 0.1], [1.5, 0.05], [2.0, 0.02], [2.5, 0]] },
];
const S2_BANDS = [
  { n: "B2", c: 0.49, w: 0.065, col: "#4f8ff0" }, { n: "B3", c: 0.56, w: 0.035, col: "#58c96b" },
  { n: "B4", c: 0.665, w: 0.03, col: "#ef5a4f" }, { n: "B8", c: 0.842, w: 0.115, col: "#c4577a" },
  { n: "B11", c: 1.61, w: 0.09, col: "#c98a52" }, { n: "B12", c: 2.19, w: 0.18, col: "#a8784e" },
];
const X0 = 48, X1 = 588, Y0 = 26, Y1 = 280;
const xs = (l: number) => X0 + ((l - 0.4) / 2.1) * (X1 - X0);
const ys = (r: number) => Y1 - (r / 60) * (Y1 - Y0);
const valueAt = (pts: [number, number][], l: number) => {
  for (let i = 1; i < pts.length; i++) if (l <= pts[i][0]) {
    const [a, ra] = pts[i - 1], [b, rb] = pts[i];
    return ra + ((rb - ra) * (l - a)) / (b - a);
  }
  return pts[pts.length - 1][1];
};

function SignatureChart({ focus }: { focus: string | null }) {
  const [lam, setLam] = useState(0.842);
  const ref = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => CURVES.map((c) => smoothPath(c.pts.map(([l, r]) => [xs(l), ys(r)]))), []);
  const vegArea = `${paths[0]} L${xs(2.5)} ${Y1} L${xs(0.4)} ${Y1} Z`;
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vx = ((e.clientX - r.left) / r.width) * 620;
    setLam(Math.min(2.5, Math.max(0.4, 0.4 + ((vx - X0) / (X1 - X0)) * 2.1)));
  };
  const lx = xs(lam);
  const boxX = lx > 420 ? lx - 150 : lx + 12;

  return (
    <svg ref={ref} viewBox="0 0 620 318" className="h-auto w-full touch-none select-none" data-noswipe onPointerMove={onMove} onPointerDown={onMove}
      role="img" aria-label="Spectral reflectance curves for vegetation, soil, urban surfaces and water">
      <defs>
        <linearGradient id="veg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd66b" stopOpacity=".28" />
          <stop offset="1" stopColor="#7fd66b" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 20, 40, 60].map((v) => (
        <g key={v}>
          <line x1={X0} x2={X1} y1={ys(v)} y2={ys(v)} stroke="#fff" strokeOpacity=".07" />
          <text x={X0 - 8} y={ys(v) + 3} textAnchor="end" className="fill-[#9db3b5] font-mono text-[9px]">{v}%</text>
        </g>
      ))}
      {[0.4, 0.7, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5].map((l) => (
        <text key={l} x={xs(l)} y={Y1 + 14} textAnchor="middle" className="fill-[#9db3b5] font-mono text-[9px]">{l.toFixed(1)}</text>
      ))}
      <text x={X1} y={Y1 + 30} textAnchor="end" className="fill-[#9db3b5] font-mono text-[9px]">Wavelength (µm)</text>
      {[["VISIBLE", 0.4, 0.7], ["NEAR-INFRARED", 0.7, 1.3], ["SHORTWAVE INFRARED", 1.3, 2.5]].map(([n, a, b]) => (
        <g key={n as string}>
          <line x1={xs(a as number)} x2={xs(b as number)} y1={Y1 + 22} y2={Y1 + 22} stroke="#8be4cf" strokeOpacity=".35" />
          <text x={(xs(a as number) + xs(b as number)) / 2} y={Y1 + 32} textAnchor="middle" className="fill-[#8be4cf] font-mono text-[8.5px] font-bold">{n as string}</text>
        </g>
      ))}
      {S2_BANDS.map((b, i) => (
        <motion.g key={b.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.08 }}>
          <rect x={xs(b.c - b.w / 2)} y={Y0} width={Math.max(4, xs(b.c + b.w / 2) - xs(b.c - b.w / 2))} height={Y1 - Y0} fill={b.col} opacity=".13" />
          <text x={xs(b.c)} y={Y0 - 6} textAnchor="middle" className="font-mono text-[8.5px] font-bold" fill={b.col}>{b.n}</text>
        </motion.g>
      ))}
      <motion.path d={vegArea} fill="url(#veg-fill)" initial={{ opacity: 0 }} animate={{ opacity: focus && focus !== "veg" ? 0.2 : 1 }} transition={{ delay: 1.6, duration: 0.8 }} />
      {CURVES.map((c, i) => (
        <motion.path key={c.k} d={paths[i]} fill="none" stroke={c.color} strokeWidth={focus === c.k ? 4 : 2.6} strokeLinecap="round" strokeDasharray={c.dash}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: focus && focus !== c.k ? 0.25 : 1 }}
          transition={{ pathLength: { delay: 0.5 + i * 0.3, duration: 1.6, ease: "easeInOut" }, opacity: { duration: 0.3 } }} />
      ))}
      <motion.text x={xs(0.73) + 6} y={ys(30)} className="fill-[#7fd66b] font-mono text-[9px] font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
        ← red edge
      </motion.text>

      {/* readout */}
      <line x1={lx} x2={lx} y1={Y0} y2={Y1} stroke="#d8ee86" strokeWidth={1.2} strokeDasharray="3 3" />
      {CURVES.map((c) => (
        <circle key={c.k} cx={lx} cy={ys(valueAt(c.pts, lam))} r={4} fill={c.color} stroke="#07131a" strokeWidth={1.5} />
      ))}
      <g transform={`translate(${boxX} ${Y0 + 6})`}>
        <rect width={138} height={80} rx={8} fill="#07131a" fillOpacity=".88" stroke="#d8ee86" strokeOpacity=".35" />
        <text x={10} y={16} className="fill-[#d8ee86] font-mono text-[10px] font-bold">λ = {lam.toFixed(2)} µm</text>
        {CURVES.map((c, i) => (
          <g key={c.k} transform={`translate(10 ${31 + i * 13})`}>
            <rect width={7} height={7} y={-6} rx={2} fill={c.color} />
            <text x={12} className="fill-[#eef4ef] font-mono text-[9.5px]">{c.name.split(" ")[0]}</text>
            <text x={118} textAnchor="end" className="fill-[#eef4ef] font-mono text-[9.5px] font-bold">{valueAt(c.pts, lam).toFixed(1)}%</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

const INSIGHTS = [
  { k: "veg", icon: Leaf, color: "#7fd66b", t: "Vegetation", d: "Chlorophyll absorbs blue & red, reflects some green — and leaf structure reflects near-infrared very strongly (the ‘red edge’)." },
  { k: "water", icon: Droplets, color: "#5fb2ff", t: "Water", d: "Absorbs almost all NIR & SWIR energy, so water looks very dark in infrared bands." },
  { k: "soil", icon: Mountain, color: "#e0b27a", t: "Soil", d: "Reflectance rises gradually with wavelength; moisture & organic matter lower it." },
  { k: "urban", icon: Building2, color: "#c9d2d4", t: "Urban", d: "Concrete and roofs give a fairly flat, bright curve across all bands." },
];

export function SpectrumSlide() {
  const [focus, setFocus] = useState<string | null>(null);
  let acc = 0;
  const pos = EM.map((e) => { const left = acc; acc += e.w; return { left, w: e.w }; });
  const span = (a: number, b: number) => ({ left: `${pos[a].left}%`, width: `${pos[b].left + pos[b].w - pos[a].left}%` });

  return (
    <SlideShell eyebrow="04 · Satellite Image › Spectrum">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <Heading text="Every surface has a *spectral signature.*" />
        <Reveal as="p" className="lead max-w-md lg:text-right">
          Sensors measure energy across the electromagnetic spectrum. How a surface reflects each wavelength is its fingerprint.
        </Reveal>
      </div>

      {/* EM spectrum strip */}
      <Reveal className="mb-4">
        <svg viewBox="0 0 1000 34" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
          <path
            d={(() => { let d = "M0 17", ph = 0; for (let x = 0; x <= 1000; x += 2) { ph += 0.55 * Math.exp(-x / 260) + 0.02; d += ` L${x} ${17 + Math.sin(ph) * 12}`; } return d; })()}
            fill="none" stroke="#8be4cf" strokeWidth={1.6} strokeDasharray="10 4" className="animate-dash" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="flex h-9 overflow-hidden rounded-lg border border-white/10">
          {EM.map((e, i) => (
            <motion.div key={e.name} className="relative grid origin-left place-items-center border-r border-black/20 px-0.5 text-center last:border-r-0"
              style={{ width: `${e.w}%`, background: e.c }} initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease: EASE }} title={e.r}>
              <span className="truncate text-[8px] font-bold uppercase leading-none tracking-wide text-white drop-shadow sm:text-[10px]">{e.name}</span>
            </motion.div>
          ))}
        </div>
        <div className="relative mt-1.5 hidden h-8 sm:block">
          {[
            { s: span(3, 5), t: "Optical sensors · Landsat, Sentinel-2", c: "border-lime/60 text-lime" },
            { s: span(6, 6), t: "Thermal", c: "border-peach/60 text-peach" },
            { s: span(7, 7), t: "Radar · Sentinel-1", c: "border-mint/60 text-mint" },
          ].map((b, i) => (
            <motion.div key={b.t} className={cn("absolute top-0 border-x border-b px-1 pt-2 text-center font-mono text-[9.5px] font-bold uppercase tracking-wide", b.c)}
              style={{ ...b.s, height: 26, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 }}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.15 }}>
              <span className="block truncate">{b.t}</span>
            </motion.div>
          ))}
        </div>
      </Reveal>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <Reveal className="card w-full p-2 sm:p-3 lg:w-[min(58%,68vh)] lg:shrink-0">
          <div className="flex items-center justify-between px-2 pb-1">
            <span className="mini-label">Spectral reflectance curves</span>
            <span className="text-[10px] text-muted">Hover / tap to read values · columns = Sentinel-2 bands</span>
          </div>
          <SignatureChart focus={focus} />
        </Reveal>
        <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
          {INSIGHTS.map(({ k, icon: I, color, t, d }) => (
            <motion.div key={k} variants={itemV} onPointerEnter={() => setFocus(k)} onPointerLeave={() => setFocus(null)} onClick={() => setFocus(focus === k ? null : k)}
              className={cn("card cursor-pointer p-3 transition-colors", focus === k && "border-white/30 bg-white/[0.06]")}>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${color}22`, color }}><I className="h-4 w-4" /></span>
                <h3 className="font-display text-[15px] font-semibold" style={{ color }}>{t}</h3>
              </div>
              <p className="mt-1 text-xs leading-snug text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
