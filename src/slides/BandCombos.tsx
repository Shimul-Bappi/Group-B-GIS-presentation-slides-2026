import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { MoveHorizontal, Sparkles } from "lucide-react";
import { AutoBar, EASE, Heading, PlayToggle, Reveal, SlideShell, slideRightV } from "@/components/ui";
import { NDVI_GRADIENT, SCENE, useImagery, type ImgKey } from "@/lib/imagery";
import { cn } from "@/utils/cn";

const COMBOS: { k: string; name: string; img: ImgKey; ls: string[]; s2: string[]; desc: string; tip: string }[] = [
  { k: "natural", name: "Natural colour", img: "natural", ls: ["4", "3", "2"], s2: ["B4", "B3", "B2"],
    desc: "Looks the way our eyes see it: vegetation green, water dark blue, towns grey-beige.", tip: "Best for general interpretation & presentations." },
  { k: "cir", name: "Colour infrared", img: "cir", ls: ["5", "4", "3"], s2: ["B8", "B4", "B3"],
    desc: "Near-infrared shown in red: healthy vegetation glows red, water turns very dark, built-up areas cyan-grey.", tip: "Classic for vegetation health & wetlands." },
  { k: "agri", name: "Agriculture", img: "agri", ls: ["6", "5", "2"], s2: ["B11", "B8", "B2"],
    desc: "SWIR-NIR-Blue: crops appear vivid green, bare fields brown-pink, water deep blue.", tip: "Separates crops, bare soil and water." },
  { k: "ndvi", name: "NDVI · pseudocolour", img: "ndvi", ls: ["(5 − 4) / (5 + 4)"], s2: ["(B8 − B4) / (B8 + B4)"],
    desc: "Vegetation index from −1 to +1. Dense, healthy vegetation is green; water, soil and roofs are red–orange.", tip: "Raster Calculator → Singleband pseudocolor." },
];
const CH = ["#f59f9a", "#bce28e", "#86c8f4"];
const MS = 6500;

function Compare({ right, label, sweepKey, onDrag }: { right: string; label: string; sweepKey: string; onDrag: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useMotionValue(50);
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const left = useTransform(pos, (v) => `${v}%`);
  const dragging = useRef(false);

  useEffect(() => {
    const c = animate(pos, [100, 12, 50], { duration: 2, times: [0, 0.55, 1], ease: "easeInOut" });
    return () => c.stop();
  }, [sweepKey, pos]);

  const setFrom = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      ref={ref}
      data-noswipe
      className="relative mx-auto aspect-[4/3] w-full max-w-[max(60vh,300px)] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)]"
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); setFrom(e.clientX); onDrag(); }}
      onPointerMove={(e) => { if (dragging.current) setFrom(e.clientX); }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
      role="slider"
      aria-label="Compare natural colour with the selected composite"
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.stopPropagation();
          pos.set(Math.min(100, Math.max(0, pos.get() + (e.key === "ArrowLeft" ? -5 : 5))));
        }
      }}
    >
      <img src={SCENE} alt="Natural colour satellite scene" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        <AnimatePresence initial={false}>
          <motion.img key={right} src={right} alt={label} draggable={false} className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
        </AnimatePresence>
      </motion.div>
      <motion.div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_14px_rgba(255,255,255,.8)]" style={{ left }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-ink/70 text-white backdrop-blur">
          <MoveHorizontal className="h-4 w-4" />
        </span>
      </motion.div>
      <span className="absolute left-2 top-2 rounded-md bg-ink/80 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-fog">Natural colour</span>
      <AnimatePresence mode="wait">
        <motion.span key={label} className="absolute right-2 top-2 rounded-md bg-lime px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink"
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
          {label}
        </motion.span>
      </AnimatePresence>
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink/75 px-3 py-1 text-[10px] text-fog/85 backdrop-blur">Drag to compare</span>
    </div>
  );
}

export function BandCombosSlide() {
  const img = useImagery();
  const [sel, setSel] = useState(1);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = window.setTimeout(() => setSel((s) => (s + 1) % COMBOS.length), MS);
    return () => window.clearTimeout(id);
  }, [sel, auto]);
  const c = COMBOS[sel];
  const src = c.img === "natural" ? SCENE : img?.urls[c.img] ?? SCENE;

  return (
    <SlideShell eyebrow="09 · QGIS › Symbology › Band Combinations">
      <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[.85fr_1.15fr] lg:gap-8">
        <div>
          <Heading text="Band combinations: *true & false colour.*" />
          <Reveal as="p" className="lead mt-3">
            In <b className="text-fog">Multiband color</b>, you choose which band goes to the red, green and blue channels. Different combinations reveal different features.
          </Reveal>
          <Reveal className="mt-4 space-y-2">
            {COMBOS.map((x, i) => {
              const on = i === sel;
              return (
                <button key={x.k} onClick={() => { setSel(i); setAuto(false); }}
                  className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", on ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                  {on && <motion.span layoutId="combo-bg" className="absolute inset-0 bg-linear-to-r from-lime/[0.1] via-mint/[0.05] to-transparent" />}
                  <span className="relative flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-[15px] font-semibold">{x.name}</span>
                    <span className="flex items-center gap-1">
                      {x.ls.length === 3
                        ? x.ls.map((b, j) => (
                            <span key={j} className="grid h-5 min-w-5 place-items-center rounded px-1 font-mono text-[10px] font-bold text-ink" style={{ background: CH[j] }}>{b}</span>
                          ))
                        : <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-lime">{x.ls[0]}</span>}
                      <span className="ml-1 font-mono text-[9px] text-muted">Landsat 8/9</span>
                    </span>
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span className="relative block overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
                        <span className="mt-1.5 block text-xs leading-snug text-muted">{x.desc}</span>
                        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px]">
                          <span className="rounded border border-mint/25 bg-mint/[0.07] px-1.5 py-0.5 font-mono text-mint">Sentinel-2: {x.s2.join(" · ")}</span>
                          <span className="text-lime/90">{x.tip}</span>
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={sel} ms={MS} playing={auto} className="flex-1" />
            <PlayToggle playing={auto} onToggle={() => setAuto((a) => !a)} />
          </Reveal>
        </div>

        <Reveal variants={slideRightV}>
          <Compare right={src} label={c.name} sweepKey={c.k} onDrag={() => setAuto(false)} />
          <div className="mx-auto mt-3 flex max-w-[max(60vh,300px)] flex-wrap items-center justify-between gap-2">
            {c.k === "ndvi" ? (
              <div className="w-full">
                <div className="h-2.5 rounded-full" style={{ background: NDVI_GRADIENT }} />
                <div className="mt-1 flex justify-between font-mono text-[10px] text-muted"><span>−1 · water / built-up</span><span>0</span><span>+1 · healthy vegetation</span></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  {["Red", "Green", "Blue"].map((ch, j) => (
                    <motion.span key={`${c.k}-${ch}`} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[10.5px]"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: j * 0.1 }}>
                      <i className="h-2.5 w-2.5 rounded-sm" style={{ background: CH[j] }} />
                      {ch} ← <b className="font-mono">Band {c.ls[j]}</b>
                    </motion.span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-[10.5px] text-muted"><Sparkles className="h-3 w-3 text-lime" /> Simulated for teaching</span>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}
