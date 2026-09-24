import {
  createContext, useContext, useEffect, useRef, useState,
  type CSSProperties, type ReactNode,
} from "react";
import {
  motion, animate, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform,
  type Variants,
} from "framer-motion";
import { MousePointer2 } from "lucide-react";
import { cn } from "@/utils/cn";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const pad = (n: number) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Variants                                                            */
/* ------------------------------------------------------------------ */
export const containerV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.12 } },
};
export const itemV: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};
export const popV: Variants = {
  hidden: { opacity: 0, scale: 0.86 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 210, damping: 20 } },
};
export const slideLeftV: Variants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};
export const slideRightV: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ------------------------------------------------------------------ */
/* Deck context                                                         */
/* ------------------------------------------------------------------ */
type DeckCtx = { index: number; total: number; goTo: (i: number) => void; openOverview: () => void };
export const DeckContext = createContext<DeckCtx>({ index: 0, total: 1, goTo: () => {}, openOverview: () => {} });
export const useDeck = () => useContext(DeckContext);
export const SlideNumberContext = createContext(0);

/* ------------------------------------------------------------------ */
/* Layout                                                               */
/* ------------------------------------------------------------------ */
export function SlideShell({
  eyebrow, children, className, contentClassName,
}: { eyebrow: string; children: ReactNode; className?: string; contentClassName?: string }) {
  const n = useContext(SlideNumberContext);
  const { total } = useDeck();
  return (
    <motion.div
      variants={containerV}
      initial="hidden"
      animate="show"
      className={cn(
        "relative mx-auto flex min-h-full w-full max-w-[1440px] flex-col px-4 pb-8 pt-5 sm:px-8 sm:pt-6 lg:px-12 xl:px-14 short:pb-5 short:sm:pt-4",
        className,
      )}
    >
      <motion.div variants={itemV} className="mb-4 flex items-center justify-between gap-4 sm:mb-6 short:sm:mb-3">
        <span className="eyebrow">{eyebrow}</span>
        <span className="serial">
          {pad(n + 1)} <span className="text-white/25">/</span> {pad(total)}
        </span>
      </motion.div>
      <div className={cn("flex flex-1 flex-col justify-center", contentClassName)}>{children}</div>
    </motion.div>
  );
}

type RevealTag = "div" | "p" | "li" | "span" | "section" | "aside" | "ol" | "ul";
const MOTION_TAGS = {
  div: motion.div, p: motion.p, li: motion.li, span: motion.span,
  section: motion.section, aside: motion.aside, ol: motion.ol, ul: motion.ul,
};
export function Reveal({
  children, className, as = "div", variants = itemV, style,
}: { children?: ReactNode; className?: string; as?: RevealTag; variants?: Variants; style?: CSSProperties }) {
  const Comp = MOTION_TAGS[as] as typeof motion.div;
  return (
    <Comp variants={variants} className={className} style={style}>
      {children}
    </Comp>
  );
}

/* ------------------------------------------------------------------ */
/* Animated heading: "Plain words *emphasised words*|next line"        */
/* ------------------------------------------------------------------ */
const headingV: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } } };
const wordV: Variants = {
  hidden: { y: "115%", rotate: 5, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.85, ease: EASE } },
};
function parseEm(line: string) {
  const parts: { text: string; em: boolean }[] = [];
  line.split("*").forEach((t, i) => t && parts.push({ text: t, em: i % 2 === 1 }));
  return parts;
}
export function Heading({ text, as = "h2", className }: { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const Tag = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  return (
    <Tag variants={headingV} className={cn(as === "h1" ? "h1" : "h2", "text-balance", className)}>
      {text.split("|").map((line, li) => (
        <span key={li} className="block">
          {parseEm(line).map((seg, si) =>
            seg.text.split(" ").filter(Boolean).map((word, wi) => (
              <span key={`${si}-${wi}`} className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.24em] align-bottom">
                <motion.span variants={wordV} className={cn("inline-block origin-bottom-left", seg.em && "em")}>
                  {word}
                </motion.span>
              </span>
            )),
          )}
        </span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt card with cursor spotlight                                      */
/* ------------------------------------------------------------------ */
export function TiltCard({
  children, className, intensity = 7, glow = "rgba(139,228,207,.16)", onClick, active,
}: {
  children: ReactNode; className?: string; intensity?: number; glow?: string; onClick?: () => void; active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 180, damping: 18 });
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const bg = useMotionTemplate`radial-gradient(380px circle at ${gx} ${gy}, ${glow}, transparent 45%)`;
  return (
    <motion.div
      ref={ref}
      variants={itemV}
      onClick={onClick}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={cn(
        "card group relative overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-mint/35",
        active && "border-lime/50 shadow-[0_0_0_1px_rgba(216,238,134,.25),0_20px_50px_-20px_rgba(216,238,134,.35)]",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: bg }} />
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Count-up number                                                     */
/* ------------------------------------------------------------------ */
export function CountUp({
  to, from = 0, duration = 1.6, decimals = 0, prefix = "", suffix = "", className, delay = 0,
}: { to: number; from?: number; duration?: number; decimals?: number; prefix?: string; suffix?: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const c = animate(from, to, { duration, delay, ease: EASE, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, from, duration, delay]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {val.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Auto-advancing step hook (pauses when the user takes control)       */
/* ------------------------------------------------------------------ */
export function useAutoStep(count: number, ms: number) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % count), ms);
    return () => window.clearTimeout(id);
  }, [playing, step, count, ms]);
  const select = (i: number) => { setStep(i); setPlaying(false); };
  return { step, setStep, select, playing, setPlaying };
}

/** Thin progress bar that fills over `ms` (restarts when `k` changes). */
export function AutoBar({ k, ms, playing, className }: { k: number | string; ms: number; playing: boolean; className?: string }) {
  return (
    <div className={cn("h-[3px] w-full overflow-hidden rounded-full bg-white/10", className)}>
      {playing && (
        <motion.div
          key={k}
          className="h-full rounded-full bg-linear-to-r from-mint to-lime"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: ms / 1000, ease: "linear" }}
        />
      )}
    </div>
  );
}

export function PlayToggle({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted transition hover:border-mint/40 hover:text-mint"
      aria-label={playing ? "Pause auto-play" : "Resume auto-play"}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", playing ? "animate-glow bg-lime" : "bg-white/40")} />
      {playing ? "Auto" : "Paused"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Mock application window                                              */
/* ------------------------------------------------------------------ */
export function MockWindow({
  title, children, className, right,
}: { title: ReactNode; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-mint/25 bg-[#0d1d25] shadow-[0_30px_80px_-24px_rgba(0,0,0,.7)]", className)}>
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#152a33] px-3.5 py-2">
        <span className="flex shrink-0 gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-[#f2a893]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#e8d48c]" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#89c7b0]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-fog/85 sm:text-xs">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

export function FakeCursor({ x, y, clickKey, className }: { x: string; y: string; clickKey?: string | number; className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute z-40", className)}
      initial={false}
      animate={{ left: x, top: y }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <MousePointer2 className="h-5 w-5 -translate-x-[3px] -translate-y-[2px] fill-white text-[#07131a] drop-shadow-[0_2px_4px_rgba(0,0,0,.6)]" />
      <motion.span
        key={clickKey}
        className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-lime"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{ scale: [0.2, 1.7], opacity: [0.9, 0] }}
        transition={{ duration: 0.7, delay: 1 }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Satellite glyph (SVG group, centred on 0,0)                          */
/* ------------------------------------------------------------------ */
export function SatGlyph({ scale = 1, color = "#387c9c" }: { scale?: number; color?: string }) {
  return (
    <g transform={`scale(${scale})`}>
      <rect x={-13} y={-9} width={26} height={18} rx={3} fill="#f1e7b7" />
      <rect x={-50} y={-12} width={30} height={24} rx={2} fill={color} stroke="#9ddbd8" strokeWidth={1.5} />
      <rect x={20} y={-12} width={30} height={24} rx={2} fill={color} stroke="#9ddbd8" strokeWidth={1.5} />
      <path d="M-20 0h7M13 0h7M-35-12v24M35-12v24M-50 0h30M20 0h30" stroke="#c1efdd" strokeWidth={1.2} opacity={0.8} />
      <circle cx={0} cy={9} r={4} fill="#163947" stroke="#d8ee86" strokeWidth={1.2} />
      <circle cx={0} cy={0} r={2.4} fill="#163947" />
    </g>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
