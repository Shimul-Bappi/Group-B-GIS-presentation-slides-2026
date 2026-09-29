import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, Blend, ChartSpline, CheckCheck, ClipboardCheck, Download, Focus, Grid3x3, Layers,
  LayoutGrid, Palette, Printer, Radar, Rocket, ScanEye, Satellite, Users, Wand2, Waves, Workflow,
} from "lucide-react";
import { Globe } from "@/components/Globe";
import { CountUp, Heading, Kbd, Reveal, SlideShell, itemV, popV, useDeck } from "@/components/ui";
import { cn } from "@/utils/cn";

function useTelemetry() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setT((v) => v + 1), 900);
    return () => window.clearInterval(id);
  }, []);
  const lat = 80 * Math.sin(t * 0.18);
  const lon = ((t * 7.3) % 360) - 180;
  return {
    lat: `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`,
    lon: `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`,
    alt: (786 + Math.sin(t) * 0.8).toFixed(1),
    vel: (7.45 + Math.cos(t * 0.7) * 0.02).toFixed(2),
  };
}

const TOPICS = ["Remote Sensing", "Components", "Satellites", "Satellite Image", "Resolution", "Download", "QGIS Raster", "Symbology", "Mapping"];

export function TitleSlide() {
  const { goTo, openOverview } = useDeck();
  const tele = useTelemetry();
  return (
    <SlideShell eyebrow="GIS & Remote Sensing · Group B">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-8">
        <div className="order-2 lg:order-1">
          <Reveal className="mb-5 flex flex-wrap items-center gap-2">
            <span className="chip chip-lime"><Users className="h-3.5 w-3.5" /> Group B Presentation</span>
            <span className="chip"><Satellite className="h-3.5 w-3.5" /> Earth Observation · QGIS</span>
          </Reveal>
          <Heading as="h1" text="See the planet.|*Map the change.*" />
          <Reveal as="p" className="lead mt-5 max-w-xl">
            A guided journey from <b className="font-semibold text-fog">remote-sensing signals</b> to a finished{" "}
            <b className="font-semibold text-fog">QGIS map</b> — satellites, satellite images, resolution, downloading data,
            raster symbology and map layouts.
          </Reveal>
          <Reveal className="mt-6 flex flex-wrap gap-2">
            {TOPICS.map((t, i) => (
              <motion.span
                key={t}
                className="chip"
                initial={{ opacity: 0, y: 12, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
                whileHover={{ y: -3, borderColor: "rgba(216,238,134,.6)" }}
              >
                <span className="font-mono text-[10px] text-lime">{String(i + 1).padStart(2, "0")}</span> {t}
              </motion.span>
            ))}
          </Reveal>
          <Reveal className="mt-7 flex flex-wrap items-center gap-3">
            <button onClick={() => goTo(1)} className="btn-primary group">
              Start the journey <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button onClick={openOverview} className="btn-ghost">
              <LayoutGrid className="h-4 w-4" /> All slides
            </button>
          </Reveal>
          <Reveal className="mt-6 hidden flex-wrap items-center gap-2 text-xs text-muted sm:flex">
            <Kbd>←</Kbd><Kbd>→</Kbd> navigate <span className="mx-1 text-white/20">|</span>
            <Kbd>F</Kbd> fullscreen <span className="mx-1 text-white/20">|</span>
            <Kbd>G</Kbd> overview <span className="mx-1 text-white/20">|</span> swipe on touch screens
          </Reveal>
        </div>

        <Reveal variants={popV} className="relative order-1 mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:order-2 lg:max-w-[540px]">
          <Globe className="h-auto w-full" />
          <div className="absolute right-0 top-[6%] animate-float rounded-xl border border-mint/30 bg-[#0a1d23]/85 px-3 py-2 backdrop-blur-md sm:right-[-2%]">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-mint sm:text-[10px]">Orbiting sensor</p>
            <p className="font-mono text-[10px] text-fog/80 sm:text-[11px]">B4 · B3 · B2 <span className="text-lime">10 m</span></p>
          </div>
          <div className="absolute bottom-[4%] left-0 hidden animate-float-slow rounded-xl border border-mint/30 bg-[#0a1d23]/85 px-3 py-2 font-mono text-[10px] backdrop-blur-md sm:block">
            <p className="mb-1 flex items-center gap-1.5 font-bold uppercase tracking-[0.16em] text-mint">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-rose" /> Live telemetry
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-fog/80">
              <span>LAT <b className="text-fog">{tele.lat}</b></span>
              <span>LON <b className="text-fog">{tele.lon}</b></span>
              <span>ALT <b className="text-lime">{tele.alt} km</b></span>
              <span>VEL <b className="text-lime">{tele.vel} km/s</b></span>
            </div>
          </div>
          <div className="absolute bottom-[18%] right-[2%] hidden animate-bob rounded-lg border border-peach/30 bg-[#1d1a17]/80 px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-peach backdrop-blur md:block">
            Signal → Data → Insight
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ------------------------------------------------------------------ */

const AGENDA = [
  { title: "Remote Sensing", sub: "Sensing without touching", icon: Radar, slide: 2 },
  { title: "EM Spectrum", sub: "Wavelength, frequency & energy", icon: Waves, slide: 3 },
  { title: "Components", sub: "7 elements of the RS process", icon: Workflow, slide: 4 },
  { title: "Sensors & Scanning", sub: "Framing, whiskbroom, pushbroom", icon: ScanEye, slide: 5 },
  { title: "Data Acquisition", sub: "Ground, air & space platforms", icon: Rocket, slide: 6 },
  { title: "Satellites & Orbits", sub: "Platforms, sensors & orbits", icon: Satellite, slide: 7 },
  { title: "EO Missions", sub: "Landsat · Sentinel · MODIS", icon: Rocket, slide: 8 },
  { title: "Satellite Image", sub: "Pixels, bands & DN values", icon: Grid3x3, slide: 9 },
  { title: "Spectral Signatures", sub: "How surfaces reflect energy", icon: ChartSpline, slide: 10 },
  { title: "Image Resolution", sub: "Spatial · spectral · radiometric · temporal", icon: Focus, slide: 11 },
  { title: "Limitations", sub: "Clouds, cost & trade-offs", icon: CheckCheck, slide: 12 },
  { title: "Download Imagery", sub: "EarthExplorer & Copernicus", icon: Download, slide: 13 },
  { title: "Preprocessing", sub: "Radiometric, atmospheric, geometric", icon: Wand2, slide: 14 },
  { title: "Image Enhancement", sub: "Stretch, filter & pan-sharpen", icon: ChartSpline, slide: 15 },
  { title: "QGIS › Raster Data", sub: "Load & stack satellite bands", icon: Layers, slide: 16 },
  { title: "QGIS › Symbology", sub: "Render types & contrast stretch", icon: Palette, slide: 17 },
  { title: "Band Combinations", sub: "True colour & false colour", icon: Blend, slide: 18 },
  { title: "Classification", sub: "Supervised vs. unsupervised", icon: ScanEye, slide: 19 },
  { title: "Field Data", sub: "Ground truth & sampling design", icon: ClipboardCheck, slide: 20 },
  { title: "Accuracy Assessment", sub: "Error matrix & kappa", icon: CheckCheck, slide: 21 },
  { title: "Mapping", sub: "Print layout & export", icon: Printer, slide: 22 },
];

export function AgendaSlide() {
  const { goTo } = useDeck();
  const [hot, setHot] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setHot((h) => (h + 1) % AGENDA.length), 1500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <SlideShell eyebrow="Roadmap">
      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Heading text="Our route: *from orbit to map.*" />
          <Reveal as="p" className="lead mt-3 max-w-2xl">
Twenty-one stops that follow the real workflow of a remote-sensing project. Tap any card to jump straight to that topic.
          </Reveal>
        </div>
        <Reveal className="hidden gap-3 lg:flex">
          {[
            { v: 24, l: "slides" },
            { v: 21, l: "topics" },
            { v: 1, l: "QGIS workflow" },
          ].map((s) => (
            <div key={s.l} className="card px-4 py-3 text-center">
              <CountUp to={s.v} className="font-display text-3xl font-bold text-lime" />
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{s.l}</p>
            </div>
          ))}
        </Reveal>
      </div>

      {/* route line with a satellite hopping between stops */}
      <Reveal className="relative mb-5 hidden h-10 sm:block" aria-hidden>
        <div className="absolute inset-x-[4%] top-1/2 h-px bg-linear-to-r from-mint/10 via-mint/50 to-lime/10" />
        {AGENDA.map((_, i) => (
          <span
            key={i}
            className={cn(
              "absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500",
              i <= hot ? "bg-lime shadow-[0_0_10px_rgba(216,238,134,.9)]" : "bg-white/20",
            )}
            style={{ left: `${4 + (i / (AGENDA.length - 1)) * 92}%` }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-mint"
          animate={{ left: `${4 + (hot / (AGENDA.length - 1)) * 92}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          <Satellite className="h-6 w-6 drop-shadow-[0_0_8px_rgba(139,228,207,.8)]" />
        </motion.div>
      </Reveal>

      <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {AGENDA.map((a, i) => {
          const Icon = a.icon;
          const on = hot === i;
          return (
            <motion.button
              key={a.title}
              variants={itemV}
              onClick={() => goTo(a.slide)}
              onPointerEnter={() => setHot(i)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="card group relative flex items-start gap-3 p-3.5 text-left sm:p-4"
            >
              {on && (
                <motion.span
                  layoutId="agenda-ring"
                  className="pointer-events-none absolute -inset-px rounded-2xl border border-mint/70 shadow-[0_0_32px_-6px_rgba(139,228,207,.55)]"
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                />
              )}
              <span
                className={cn(
                  "relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300",
                  on ? "border-lime/60 bg-lime/15 text-lime" : "border-mint/25 bg-mint/5 text-mint",
                )}
              >
                <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                {on && <span className="absolute inset-0 animate-pulse-ring rounded-xl border border-lime/60" />}
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[10px] font-bold tracking-[0.16em] text-lime">
                  {String(i + 1).padStart(2, "0")} · SLIDE {String(a.slide + 1).padStart(2, "0")}
                </span>
                <span className="block font-display text-[15px] font-semibold leading-tight text-fog sm:text-base">{a.title}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted">{a.sub}</span>
              </span>
              <ArrowRight className="absolute right-3 top-3 h-3.5 w-3.5 text-mint opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>
    </SlideShell>
  );
}
