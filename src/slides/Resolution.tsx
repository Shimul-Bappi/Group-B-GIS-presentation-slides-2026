import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue } from "framer-motion";
import { BarChart3, CalendarDays, Cloud, Contrast, Grid3x3, Satellite } from "lucide-react";
import { CountUp, EASE, Heading, Reveal, SlideShell, slideRightV } from "@/components/ui";
import { H, SCENE, W, useImagery, type ImgKey } from "@/lib/imagery";
import { wavelengthColor } from "@/lib/svg";
import { cn } from "@/utils/cn";

/* ---------------- Spatial ---------------- */
const SP_OPTS = [
  { m: 3, label: "3 m", sat: "PlanetScope" },
  { m: 10, label: "10 m", sat: "Sentinel-2" },
  { m: 30, label: "30 m", sat: "Landsat 8/9" },
  { m: 250, label: "250 m", sat: "MODIS" },
];
const SCENE_M = 3000;

function SpatialDemo() {
  const img = useImagery();
  const [sel, setSel] = useState(2);
  const ref = useRef<HTMLCanvasElement>(null);
  const logm = useMotionValue(Math.log(30));

  useEffect(() => {
    const c = animate(logm, Math.log(SP_OPTS[sel].m), { duration: 1.1, ease: "easeInOut" });
    return () => c.stop();
  }, [sel, logm]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const tmp = document.createElement("canvas");
    const draw = (lm: number) => {
      const across = Math.max(6, Math.round(SCENE_M / Math.exp(lm)));
      if (across >= W) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img.source, 0, 0, W, H);
        return;
      }
      const down = Math.max(4, Math.round((across * H) / W));
      tmp.width = across; tmp.height = down;
      const t = tmp.getContext("2d");
      if (!t) return;
      t.imageSmoothingEnabled = true;
      t.drawImage(img.source, 0, 0, across, down);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, 0, 0, W, H);
      const cw = W / across, ch = H / down;
      if (cw >= 22) {
        ctx.strokeStyle = "rgba(255,255,255,.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= across; x++) { ctx.moveTo(x * cw, 0); ctx.lineTo(x * cw, H); }
        for (let y = 0; y <= down; y++) { ctx.moveTo(0, y * ch); ctx.lineTo(W, y * ch); }
        ctx.stroke();
      }
    };
    draw(logm.get());
    return logm.on("change", draw);
  }, [img, logm]);

  const o = SP_OPTS[sel];
  const across = Math.min(1000, Math.round(SCENE_M / o.m));
  return (
    <div>
      <div className="mb-3 grid grid-cols-4 gap-1.5">
        {SP_OPTS.map((op, i) => (
          <button key={op.m} onClick={() => setSel(i)}
            className={cn("relative rounded-lg border px-1 py-1.5 text-center transition", sel === i ? "border-lime/60 bg-lime/10" : "border-white/10 hover:border-mint/40")}>
            <span className={cn("block font-display text-base font-bold sm:text-lg", sel === i ? "text-lime" : "text-fog")}>{op.label}</span>
            <span className="block truncate text-[10px] text-muted">{op.sat}</span>
          </button>
        ))}
      </div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[max(56vh,300px)] overflow-hidden rounded-xl bg-black">
        <img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <canvas ref={ref} width={W} height={H} className="pixelated absolute inset-0 h-full w-full" />
        <div className="absolute left-2 top-2 rounded-lg bg-ink/85 px-2.5 py-1.5 backdrop-blur">
          <p className="font-mono text-[11px] font-bold text-lime">1 pixel = {o.label} × {o.label}</p>
          <p className="font-mono text-[10px] text-fog/80">3 km scene → {across} × {Math.round(across * 0.75)} px</p>
        </div>
        <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-2 py-1 font-mono text-[10px] font-bold uppercase text-mint">{o.sat}</span>
      </div>
      <p className="mt-2 text-xs text-muted">Smaller pixels = finer detail (higher spatial resolution) — but bigger files and usually smaller coverage.</p>
    </div>
  );
}

/* ---------------- Spectral ---------------- */
const SPEC_ROWS: { name: string; sub: string; y: number; bands: [number, number][] }[] = [
  { name: "Panchromatic", sub: "1 broad band · e.g. Landsat 8 Band 8", y: 26, bands: [[0.5, 0.68]] },
  { name: "Multispectral", sub: "Several bands · Landsat 8/9 OLI (7 shown)", y: 110, bands: [[0.433, 0.453], [0.45, 0.515], [0.525, 0.6], [0.63, 0.68], [0.845, 0.885], [1.56, 1.66], [2.1, 2.3]] },
  { name: "Hyperspectral", sub: "Hundreds of narrow bands · e.g. AVIRIS (224)", y: 194, bands: Array.from({ length: 105 }, (_, i) => [0.4 + i * 0.02, 0.412 + i * 0.02] as [number, number]) },
];
function SpectralDemo() {
  const x = (l: number) => 20 + ((l - 0.4) / 2.1) * 560;
  return (
    <div>
      <svg viewBox="0 0 600 290" className="h-auto w-full" role="img" aria-label="Band layout of panchromatic, multispectral and hyperspectral sensors">
        {SPEC_ROWS.map((row, ri) => (
          <g key={row.name}>
            <text x={20} y={row.y - 8} className="fill-[#eef4ef] font-display text-[13px] font-semibold">{row.name}</text>
            <text x={580} y={row.y - 8} textAnchor="end" className="fill-[#9db3b5] font-mono text-[9.5px]">{row.sub}</text>
            <rect x={20} y={row.y} width={560} height={52} rx={6} fill="#fff" opacity=".03" />
            {row.bands.map(([a, b], i) => (
              <rect key={i} x={x(a)} y={row.y + 2} width={Math.max(2, x(b) - x(a))} height={48} rx={1.5} fill={wavelengthColor((a + b) / 2)}
                className="bar-grow" style={{ animationDelay: `${0.15 + ri * 0.35 + i * (ri === 2 ? 0.01 : 0.08)}s` }} />
            ))}
          </g>
        ))}
        {[0.4, 0.7, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5].map((l) => (
          <g key={l}>
            <line x1={x(l)} x2={x(l)} y1={250} y2={256} stroke="#9db3b5" strokeOpacity=".6" />
            <text x={x(l)} y={268} textAnchor="middle" className="fill-[#9db3b5] font-mono text-[9.5px]">{l.toFixed(1)}</text>
          </g>
        ))}
        <text x={580} y={284} textAnchor="end" className="fill-[#9db3b5] font-mono text-[9px]">Wavelength (µm)</text>
      </svg>
      <p className="mt-1 text-xs text-muted">More and narrower bands = higher spectral resolution → better at telling similar materials apart.</p>
    </div>
  );
}

/* ---------------- Radiometric ---------------- */
const BITS = [1, 2, 4, 8] as const;
function RadiometricDemo() {
  const img = useImagery();
  const [bits, setBits] = useState<(typeof BITS)[number]>(2);
  const levels = 2 ** bits;
  return (
    <div>
      <div className="mb-3 grid grid-cols-4 gap-1.5">
        {BITS.map((b) => (
          <button key={b} onClick={() => setBits(b)}
            className={cn("rounded-lg border px-1 py-1.5 text-center transition", bits === b ? "border-lime/60 bg-lime/10" : "border-white/10 hover:border-mint/40")}>
            <span className={cn("block font-display text-base font-bold sm:text-lg", bits === b ? "text-lime" : "text-fog")}>{b}-bit</span>
            <span className="block text-[10px] text-muted">{2 ** b} levels</span>
          </button>
        ))}
      </div>
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[max(56vh,300px)] overflow-hidden rounded-xl bg-black">
        <AnimatePresence initial={false}>
          <motion.img key={bits} src={img?.urls[`q${bits}` as ImgKey] ?? SCENE} alt={`${bits}-bit version of the scene`}
            className="absolute inset-0 h-full w-full object-cover" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
        </AnimatePresence>
        <div className="absolute left-2 top-2 rounded-lg bg-ink/85 px-3 py-1.5 backdrop-blur">
          <p className="font-mono text-[10px] text-fog/80">2<sup>{bits}</sup> =</p>
          <CountUp key={bits} to={levels} duration={0.9} className="font-display text-2xl font-bold text-lime" />
          <span className="ml-1 text-[10px] text-muted">grey levels</span>
        </div>
      </div>
      <div className="mt-2 flex h-5 overflow-hidden rounded-md border border-white/10">
        {bits === 8 ? (
          <motion.div key="smooth" className="h-full w-full origin-left bg-linear-to-r from-black to-white" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7 }} />
        ) : (
          Array.from({ length: levels }).map((_, i) => {
            const v = Math.round((i / (levels - 1)) * 255);
            return (
              <motion.div key={`${bits}-${i}`} className="h-full flex-1 origin-bottom" style={{ background: `rgb(${v},${v},${v})` }}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * (0.3 / levels), duration: 0.35 }} />
            );
          })
        )}
      </div>
      <p className="mt-2 text-xs text-muted">
        Landsat 8 &amp; Sentinel-2 record <b className="text-fog">12-bit</b> data (4,096 levels); Landsat 9 records <b className="text-fog">14-bit</b> (16,384).
      </p>
    </div>
  );
}

/* ---------------- Temporal ---------------- */
const DAYS = 32;
const T_ROWS = [
  { name: "MODIS", every: 1, color: "#f5bb99", note: "1–2 days" },
  { name: "Sentinel-2", every: 5, color: "#8be4cf", note: "5 days" },
  { name: "Landsat 8+9", every: 8, color: "#d8ee86", note: "8 days" },
];
const isCloudy = (r: number, d: number) => (d * 7 + r * 13 + 3) % 10 < 4;
const SWEEP = 6;

function TemporalDemo() {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setCycle((c) => c + 1), (SWEEP + 1.4) * 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div key={cycle}>
      <div className="relative rounded-xl border border-white/10 bg-black/20 p-3">
        <div className="mb-2 ml-[92px] flex justify-between font-mono text-[9px] text-muted sm:ml-[112px]">
          {[1, 8, 16, 24, 32].map((d) => <span key={d}>Day {d}</span>)}
        </div>
        <div className="space-y-3">
          {T_ROWS.map((row, ri) => {
            const passes = Array.from({ length: DAYS }, (_, i) => i + 1).filter((d) => (d - 1) % row.every === 0);
            return (
              <div key={row.name} className="flex items-center gap-2">
                <div className="w-[84px] shrink-0 sm:w-[104px]">
                  <p className="truncate text-xs font-semibold" style={{ color: row.color }}>{row.name}</p>
                  <p className="font-mono text-[9px] text-muted">every {row.note}</p>
                </div>
                <div className="relative h-8 flex-1 rounded-md bg-white/[0.04]">
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
                  {passes.map((d) => {
                    const cloudy = isCloudy(ri, d);
                    return (
                      <span key={d} className="pop absolute top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center"
                        style={{ left: `${((d - 0.5) / DAYS) * 100}%`, animationDelay: `${((d - 0.5) / DAYS) * SWEEP}s` }}>
                        {cloudy ? (
                          <Cloud className="h-3.5 w-3.5 text-white/40" />
                        ) : (
                          <span className="block h-2.5 w-2.5 rounded-full" style={{ background: row.color, boxShadow: `0 0 8px ${row.color}` }} />
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute bottom-2 left-[104px] right-3 top-8 sm:left-[124px]">
          <motion.div className="absolute bottom-0 top-0 w-0.5 bg-lime shadow-[0_0_12px_#d8ee86]" initial={{ left: "0%" }} animate={{ left: "100%" }} transition={{ duration: SWEEP, ease: "linear" }}>
            <Satellite className="absolute -left-2 -top-5 h-4 w-4 text-lime" />
          </motion.div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {T_ROWS.map((row, ri) => {
          const passes = Array.from({ length: DAYS }, (_, i) => i + 1).filter((d) => (d - 1) % row.every === 0);
          const clear = passes.filter((d) => !isCloudy(ri, d)).length;
          return (
            <div key={row.name} className="rounded-lg border border-white/10 px-2 py-1.5 text-center">
              <CountUp to={clear} duration={SWEEP} className="font-display text-lg font-bold" />
              <span className="font-mono text-[10px] text-muted"> / {passes.length}</span>
              <p className="truncate text-[10px] text-muted">clear · {row.name}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">Frequent revisits improve the chance of cloud-free images and help monitor fast change (floods, crops, fires).</p>
    </div>
  );
}

/* ---------------- Slide ---------------- */
const TABS = [
  { k: "spatial", icon: Grid3x3, name: "Spatial", q: "How much ground does one pixel cover?", ex: "Sentinel-2 10 m · Landsat 30 m" },
  { k: "spectral", icon: BarChart3, name: "Spectral", q: "How many bands — and how narrow are they?", ex: "Sentinel-2: 13 bands" },
  { k: "radiometric", icon: Contrast, name: "Radiometric", q: "How many brightness levels can a pixel store?", ex: "12-bit = 4,096 levels" },
  { k: "temporal", icon: CalendarDays, name: "Temporal", q: "How often is the same place imaged again?", ex: "Sentinel-2: every 5 days" },
] as const;

export function ResolutionSlide() {
  const [tab, setTab] = useState(0);
  const t = TABS[tab];
  return (
    <SlideShell eyebrow="05 · Satellite Image Resolution">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <Heading text="Four types of *image resolution.*" />
        <Reveal as="p" className="lead max-w-md lg:text-right">
          “High resolution” can mean finer pixels, more bands, more brightness levels — or more frequent images.
        </Reveal>
      </div>
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[.72fr_1.28fr] lg:gap-6">
        <Reveal className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {TABS.map((x, i) => {
            const I = x.icon;
            const on = i === tab;
            return (
              <button key={x.k} onClick={() => setTab(i)}
                className={cn("relative overflow-hidden rounded-2xl border p-3 text-left transition-colors sm:p-3.5", on ? "border-lime/50" : "border-white/10 hover:border-mint/35")}>
                {on && <motion.span layoutId="res-tab" className="absolute inset-0 bg-linear-to-br from-lime/15 to-mint/5" transition={{ type: "spring", stiffness: 260, damping: 28 }} />}
                <span className="relative flex items-center gap-2.5">
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", on ? "bg-lime text-ink" : "bg-mint/10 text-mint")}><I className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="font-mono text-[10px] font-bold text-lime">0{i + 1}</span>
                    <span className="block font-display text-base font-semibold leading-tight">{x.name}</span>
                  </span>
                </span>
                <span className="relative mt-1.5 block text-xs leading-snug text-muted">{x.q}</span>
                <span className="relative mt-1 hidden font-mono text-[10px] text-mint sm:block">{x.ex}</span>
              </button>
            );
          })}
        </Reveal>
        <Reveal variants={slideRightV} className="card p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="mini-label">{t.name} resolution · interactive</p>
            <span className="font-mono text-[10px] text-muted">{tab + 1} / 4</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={t.k} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.45, ease: EASE }}>
              {t.k === "spatial" && <SpatialDemo />}
              {t.k === "spectral" && <SpectralDemo />}
              {t.k === "radiometric" && <RadiometricDemo />}
              {t.k === "temporal" && <TemporalDemo />}
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>
    </SlideShell>
  );
}
