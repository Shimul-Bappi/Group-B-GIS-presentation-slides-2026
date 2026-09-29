import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen, Check, FileImage, Grid3x3, MonitorSmartphone, MousePointerClick, Navigation, Shuffle, Sparkles,
} from "lucide-react";
import { AutoBar, CountUp, Heading, PlayToggle, Reveal, SlideShell, TiltCard, slideRightV, useAutoStep } from "@/components/ui";
import { CLASS_COLORS, CLASS_NAMES, SCENE, useImagery } from "@/lib/imagery";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: Image classification                                          */
/* ================================================================== */

type Mode = "supervised" | "unsupervised";
const SAMPLE_PTS = [
  { x: 30, y: 62, c: 0 }, { x: 49, y: 83, c: 0 },
  { x: 60, y: 40, c: 1 }, { x: 66, y: 34, c: 1 },
  { x: 18, y: 45, c: 3 }, { x: 22, y: 30, c: 3 },
  { x: 86, y: 70, c: 4 }, { x: 80, y: 60, c: 4 },
  { x: 42, y: 55, c: 2 },
];
const SUP_STEPS = ["Pick training samples", "Train the classifier", "Classify the whole image"];
const UNSUP_STEPS = ["Group similar pixels", "Form clusters", "Label each cluster"];
const CMS = 3600;

function ClassifyScene({ mode, step }: { mode: Mode; step: number }) {
  const img = useImagery();
  const showClasses = (mode === "supervised" && step >= 2) || (mode === "unsupervised" && step >= 1);
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[max(56vh,300px)] overflow-hidden rounded-xl bg-black">
      <AnimatePresence initial={false}>
        <motion.img key={showClasses ? "classes" : "natural"} src={showClasses ? img?.urls.classes ?? SCENE : SCENE}
          alt="" className={cn("absolute inset-0 h-full w-full object-cover", showClasses && "pixelated")}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} />
      </AnimatePresence>

      {mode === "supervised" && step === 0 && SAMPLE_PTS.map((p, i) => (
        <motion.span key={i} className="pop absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: `rgb(${CLASS_COLORS[p.c].join(",")})`, animationDelay: `${i * 0.18}s` }} />
      ))}
      {mode === "supervised" && step >= 1 && SAMPLE_PTS.map((p, i) => (
        <span key={i} className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 opacity-70"
          style={{ left: `${p.x}%`, top: `${p.y}%`, background: `rgb(${CLASS_COLORS[p.c].join(",")})` }} />
      ))}
      {mode === "unsupervised" && step === 0 && Array.from({ length: 24 }).map((_, i) => (
        <motion.span key={i} className="pop absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
          style={{ left: `${8 + (i * 37) % 84}%`, top: `${10 + (i * 53) % 80}%`, animationDelay: `${i * 0.05}s` }} />
      ))}

      {mode === "supervised" && step === 1 && (
        <motion.div className="absolute inset-0 bg-lime/10" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 1.4, repeat: Infinity }} />
      )}
      <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-lime">
        {mode === "supervised" ? SUP_STEPS[step] : UNSUP_STEPS[step]}
      </span>
    </div>
  );
}

export function ClassificationSlide() {
  const [mode, setMode] = useState<Mode>("supervised");
  const { step, select, playing, setPlaying, setStep } = useAutoStep(3, CMS);
  useEffect(() => { setStep(0); }, [mode, setStep]);
  const steps = mode === "supervised" ? SUP_STEPS : UNSUP_STEPS;

  return (
    <SlideShell eyebrow="Digital Image Processing · Classification">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1fr] lg:gap-9">
        <div>
          <Heading text="Turn pixels into *land-cover classes.*" />
          <Reveal as="p" className="lead mt-3">Classification sorts every pixel into a category, like water, forest or cropland.</Reveal>

          <Reveal className="relative mt-4 inline-flex rounded-full border border-white/12 bg-white/[0.04] p-1">
            {(["supervised", "unsupervised"] as Mode[]).map((k) => (
              <button key={k} onClick={() => setMode(k)}
                className={cn("relative z-10 rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors", mode === k ? "text-ink" : "text-muted hover:text-fog")}>
                {mode === k && <motion.span layoutId="cls-mode" className="absolute inset-0 -z-10 rounded-full bg-linear-to-r from-lime to-mint" transition={{ type: "spring", stiffness: 300, damping: 26 }} />}
                {k}
              </button>
            ))}
          </Reveal>

          <Reveal className="mt-4 space-y-1.5">
            {steps.map((s, i) => (
              <button key={s} onClick={() => select(i)} className={cn("relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === step ? "border-lime/50" : "border-transparent hover:border-white/10")}>
                {i === step && <motion.span layoutId="cls-step" className="absolute inset-0 bg-lime/[0.07]" />}
                <span className={cn("relative grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] font-bold", i < step ? "border-lime bg-lime text-ink" : i === step ? "border-lime text-lime" : "border-white/20 text-muted")}>
                  {i < step ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span className="relative text-sm font-semibold">{s}</span>
              </button>
            ))}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={`${mode}-${step}`} ms={CMS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
          <Reveal className="mt-3 flex flex-wrap gap-1.5">
            {(mode === "supervised" ? ["Maximum Likelihood", "Random Forest", "SVM"] : ["K-means", "ISODATA"]).map((c) => (
              <span key={c} className="chip !text-[10.5px]">{c}</span>
            ))}
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-2">
          <ClassifyScene mode={mode} step={step} />
          <div className="flex flex-wrap justify-center gap-2">
            {CLASS_NAMES.map((n, i) => (
              <span key={n} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10.5px]">
                <i className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${CLASS_COLORS[i].join(",")})` }} /> {n}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Field data collection                                         */
/* ================================================================== */

const DESIGNS = [
  { k: "random", name: "Random", icon: Shuffle, d: "Points are placed anywhere, by chance. Simple, but can miss rare classes." },
  { k: "stratified", name: "Stratified random", icon: Grid3x3, d: "Points are placed randomly inside each class area, so every class gets enough samples." },
  { k: "systematic", name: "Systematic", icon: MousePointerClick, d: "Points sit on a regular grid across the whole area. Easy to plan in the field." },
] as const;

function samplePoints(design: (typeof DESIGNS)[number]["k"]) {
  if (design === "systematic") {
    const pts: { x: number; y: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) pts.push({ x: 12 + c * 19, y: 15 + r * 24, c: (r + c) % 5 });
    return pts;
  }
  if (design === "stratified") {
    const zones = [{ x: 30, y: 62 }, { x: 60, y: 38 }, { x: 20, y: 38 }, { x: 84, y: 66 }, { x: 48, y: 84 }];
    const pts: { x: number; y: number; c: number }[] = [];
    zones.forEach((z, c) => { for (let i = 0; i < 4; i++) pts.push({ x: z.x + ((i * 37) % 20) - 10, y: z.y + ((i * 53) % 18) - 9, c }); });
    return pts;
  }
  return Array.from({ length: 18 }).map((_, i) => ({ x: 8 + ((i * 5827) % 88), y: 8 + ((i * 3719) % 84), c: i % 5 }));
}

const KIT = [
  { icon: Navigation, t: "GPS / GNSS", d: "Records the exact coordinate of the site." },
  { icon: FileImage, t: "Photos", d: "A picture proves what was really there." },
  { icon: BookOpen, t: "Field notes", d: "Date, notes and site condition." },
  { icon: MonitorSmartphone, t: "Survey app", d: "e.g. KoboToolbox, QField, ODK." },
];

export function FieldDataSlide() {
  const [design, setDesign] = useState<(typeof DESIGNS)[number]["k"]>("stratified");
  const [cycle, setCycle] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setCycle((c) => c + 1), 4200); return () => window.clearInterval(id); }, [design]);
  const img = useImagery();
  const pts = samplePoints(design);

  return (
    <SlideShell eyebrow="Digital Image Processing · Field Data">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-9">
        <div>
          <Heading text="Ground truth: *check reality.*" />
          <Reveal as="p" className="lead mt-3">
            We visit real places to see what is actually there. This gives us <b className="text-fog">training samples</b> to teach the classifier, and <b className="text-fog">validation samples</b> to test it later.
          </Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {DESIGNS.map((x) => {
              const I = x.icon; const on = x.k === design;
              return (
                <button key={x.k} onClick={() => setDesign(x.k)} className={cn("relative w-full overflow-hidden rounded-xl border p-3 text-left transition-colors", on ? "border-lime/50" : "border-white/8 hover:border-white/20")}>
                  {on && <motion.span layoutId="design-bg" className="absolute inset-0 bg-lime/[0.08]" />}
                  <span className="relative flex items-center gap-2.5">
                    <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", on ? "bg-lime text-ink" : "bg-mint/10 text-mint")}><I className="h-4 w-4" /></span>
                    <span className="font-display text-[15px] font-semibold">{x.name}</span>
                  </span>
                  <span className="relative mt-1.5 block pl-[42px] text-xs leading-snug text-muted">{x.d}</span>
                </button>
              );
            })}
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <div key={`${design}-${cycle}`} className="relative mx-auto aspect-[4/3] w-full max-w-[max(56vh,300px)] overflow-hidden rounded-xl bg-black">
            <img src={img?.urls.classes ?? SCENE} alt="" className="pixelated absolute inset-0 h-full w-full object-cover opacity-80" />
            {pts.map((p, i) => (
              <motion.span key={i} className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_6px_rgba(0,0,0,.6)]"
                style={{ left: `${Math.max(3, Math.min(97, p.x))}%`, top: `${Math.max(3, Math.min(97, p.y))}%`, background: `rgb(${CLASS_COLORS[p.c % 5].join(",")})` }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 + i * 0.045, type: "spring", stiffness: 320, damping: 18 }} />
            ))}
            <span className="absolute bottom-2 left-2 rounded bg-ink/80 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-wider text-lime">
              {DESIGNS.find((d) => d.k === design)!.name} · {pts.length} points
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {KIT.map(({ icon: I, t, d }) => (
              <TiltCard key={t} className="p-2.5">
                <I className="h-4 w-4 text-lime" />
                <p className="mt-1 font-display text-[12px] font-semibold leading-tight">{t}</p>
                <p className="mt-0.5 hidden text-[10px] leading-snug text-muted sm:block">{d}</p>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Accuracy assessment                                           */
/* ================================================================== */

const MATRIX = [
  [18, 0, 1, 0, 0],
  [0, 14, 2, 1, 0],
  [1, 1, 15, 2, 1],
  [0, 1, 2, 16, 1],
  [0, 0, 1, 2, 21],
];
const ROW_TOTAL = MATRIX.map((r) => r.reduce((a, b) => a + b, 0));
const COL_TOTAL = MATRIX[0].map((_, c) => MATRIX.reduce((a, r) => a + r[c], 0));
const N = ROW_TOTAL.reduce((a, b) => a + b, 0);
const DIAG_SUM = MATRIX.reduce((a, r, i) => a + r[i], 0);
const OVERALL = (DIAG_SUM / N) * 100;
const PE = COL_TOTAL.reduce((a, ct, i) => a + ct * ROW_TOTAL[i], 0) / (N * N);
const KAPPA = (DIAG_SUM / N - PE) / (1 - PE);
const FOREST = 4;
const PRODUCERS = (MATRIX[FOREST][FOREST] / COL_TOTAL[FOREST]) * 100;
const USERS = (MATRIX[FOREST][FOREST] / ROW_TOTAL[FOREST]) * 100;

export function AccuracySlide() {
  return (
    <SlideShell eyebrow="Digital Image Processing · Accuracy Assessment">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-9">
        <div className="min-w-0">
          <Heading text="How good is our map, *really?*" />
          <Reveal as="p" className="lead mt-3">
            We compare the classified map to <b className="text-fog">ground-truth</b> points in an <b className="text-fog">error matrix</b> — rows are what we mapped, columns are what was really there.
          </Reveal>
          <Reveal className="mt-4 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[420px] border-collapse text-center text-[11px]">
              <thead>
                <tr>
                  <th className="p-1.5 text-left font-mono text-[9.5px] font-bold text-muted">Mapped ↓ / Real →</th>
                  {CLASS_NAMES.map((n, i) => <th key={n} className="p-1.5 font-mono text-[9px] font-bold" style={{ color: `rgb(${CLASS_COLORS[i].join(",")})` }}>{n.split(" ")[0]}</th>)}
                  <th className="p-1.5 font-mono text-[9.5px] font-bold text-muted">Total</th>
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row, r) => (
                  <tr key={r} className="border-t border-white/10">
                    <td className="p-1.5 text-left font-mono text-[9.5px] font-bold" style={{ color: `rgb(${CLASS_COLORS[r].join(",")})` }}>{CLASS_NAMES[r].split(" ")[0]}</td>
                    {row.map((v, c) => (
                      <motion.td key={c} className={cn("p-1.5 font-mono font-bold", r === c ? "bg-lime/15 text-lime" : "text-fog/70")}
                        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * (r * 5 + c) }}>
                        {v}
                      </motion.td>
                    ))}
                    <td className="p-1.5 font-mono text-[10px] font-bold text-muted">{ROW_TOTAL[r]}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/15">
                  <td className="p-1.5 text-left font-mono text-[9.5px] font-bold text-muted">Total</td>
                  {COL_TOTAL.map((v, i) => <td key={i} className="p-1.5 font-mono text-[10px] font-bold text-muted">{v}</td>)}
                  <td className="p-1.5 font-mono text-[10px] font-bold text-lime">{N}</td>
                </tr>
              </tbody>
            </table>
          </Reveal>
          <Reveal className="mt-3 text-[11px] leading-snug text-muted">
            <b className="text-fog">Producer's accuracy</b> (Forest): of all real forest points, how many we found correctly.
            <b className="ml-2 text-fog">User's accuracy:</b> of all points we called forest, how many really were.
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="grid grid-cols-2 gap-3">
          <div className="card col-span-2 p-4 text-center sm:p-5">
            <p className="mini-label">Overall accuracy</p>
            <CountUp to={OVERALL} decimals={0} suffix="%" duration={1.6} className="mt-1 block font-display text-5xl font-bold text-lime" />
            <p className="mt-1 text-xs text-muted">{DIAG_SUM} correct out of {N} checked points</p>
          </div>
          <div className="card p-4 text-center">
            <p className="mini-label">Kappa</p>
            <CountUp to={KAPPA} decimals={2} duration={1.6} className="mt-1 block font-display text-3xl font-bold text-mint" />
            <p className="mt-1 text-[10.5px] text-muted">Substantial agreement</p>
          </div>
          <div className="card p-4 text-center">
            <p className="mini-label">Forest producer's</p>
            <CountUp to={PRODUCERS} decimals={0} suffix="%" duration={1.6} className="mt-1 block font-display text-3xl font-bold text-mint" />
            <p className="mt-1 text-[10.5px] text-muted">User's: {USERS.toFixed(0)}%</p>
          </div>
          <div className="card col-span-2 flex items-center gap-2.5 p-3.5">
            <Sparkles className="h-5 w-5 shrink-0 text-lime" />
            <p className="text-[11px] leading-snug text-muted">
              A good classified map usually needs <b className="text-fog">80%+ overall accuracy</b> and a Kappa above <b className="text-fog">0.6–0.8</b>.
            </p>
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}
