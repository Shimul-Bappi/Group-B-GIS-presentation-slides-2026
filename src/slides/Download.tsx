import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Download as DownloadIcon, ExternalLink, Eye, FileImage, Lock, Search, Square } from "lucide-react";
import { AutoBar, EASE, FakeCursor, Heading, MockWindow, PlayToggle, Reveal, SlideShell, slideRightV, useAutoStep } from "@/components/ui";
import { SCENE } from "@/lib/imagery";
import { cn } from "@/utils/cn";

const STEPS = [
  { t: "Sign in (free account)", d: "Open earthexplorer.usgs.gov → Login, or register a free USGS account." },
  { t: "Search Criteria", d: "Find your study area (place name, coordinates or draw a polygon) and set a date range." },
  { t: "Data Sets", d: "Landsat → Landsat Collection 2 Level-2 → Landsat 8-9 OLI/TIRS C2 L2." },
  { t: "Additional Criteria", d: "Set Land Cloud Cover to less than 10 %, then click Results." },
  { t: "Download", d: "Preview the footprint, click Download and choose the band GeoTIFFs (or the full product bundle)." },
];
const MS = 4200;
const CURSOR: [string, string][] = [["22%", "74%"], ["72%", "46%"], ["9%", "47%"], ["30%", "50%"], ["40%", "30%"]];
const TABS = ["Search Criteria", "Data Sets", "Additional Criteria", "Results"];

function Typewriter({ text, speed = 70, delay = 200 }: { text: string; speed?: number; delay?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => { i++; setN(i); if (i >= text.length) window.clearInterval(id); }, speed);
    }, delay);
    return () => { window.clearTimeout(start); window.clearInterval(id); };
  }, [text, speed, delay]);
  return (
    <span>
      {text.slice(0, n)}
      <span className="ml-px inline-block h-3 w-px translate-y-0.5 animate-blink bg-lime" />
    </span>
  );
}

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <p className="mb-1 text-[10px] font-semibold text-muted">{label}</p>
    <div className="rounded-md border border-white/15 bg-[#081820] px-2 py-1.5 font-mono text-[11px] text-fog">{children}</div>
  </div>
);

function Panel({ step }: { step: number }) {
  if (step === 0)
    return (
      <div className="space-y-2.5 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-lime" />
          <p className="font-display text-sm font-semibold">USGS · Login</p>
        </div>
        <Field label="Username"><Typewriter text="groupB_gis" /></Field>
        <Field label="Password">••••••••••</Field>
        <motion.div className="rounded-md bg-lime py-1.5 text-center text-xs font-bold text-ink" animate={{ scale: [1, 1, 0.92, 1] }} transition={{ duration: 2.2, times: [0, 0.8, 0.9, 1] }}>
          Sign In
        </motion.div>
        <p className="text-[10px] text-muted">No account? <span className="text-mint underline">Create New Account</span> — it’s free.</p>
      </div>
    );
  if (step === 1)
    return (
      <div className="space-y-2.5 p-3 sm:p-4">
        <Field label="Geocoder · Address / Place"><Typewriter text="River floodplain study area" speed={45} /></Field>
        <div className="flex gap-1 text-[10px]">
          {["Polygon", "Circle", "Predefined Area"].map((x, i) => (
            <span key={x} className={cn("rounded px-2 py-1", i === 0 ? "bg-mint text-ink font-bold" : "bg-white/5 text-muted")}>{x}</span>
          ))}
        </div>
        <div className="space-y-0.5 font-mono text-[10px] text-fog/85">
          {["23.94, 90.21", "23.97, 90.33", "23.88, 90.36", "23.84, 90.25"].map((c, i) => (
            <motion.p key={c} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.35 }}>
              <span className="text-lime">{i + 1}.</span> {c}
            </motion.p>
          ))}
        </div>
        <Field label="Date Range">2024-01-01 → 2024-03-31</Field>
      </div>
    );
  if (step === 2)
    return (
      <div className="space-y-1.5 p-3 text-[11px] sm:p-4">
        <p className="mb-1 text-[10px] font-semibold text-muted">Select your data set(s)</p>
        <p className="flex items-center gap-1.5"><ChevronDown className="h-3 w-3 text-mint" /> Landsat</p>
        <p className="ml-4 flex items-center gap-1.5"><ChevronDown className="h-3 w-3 text-mint" /> Landsat Collection 2 Level-2</p>
        <motion.p className="ml-8 flex items-center gap-1.5 rounded px-1 py-0.5" animate={{ backgroundColor: ["rgba(216,238,134,0)", "rgba(216,238,134,.14)"] }} transition={{ delay: 1.1, duration: 0.4 }}>
          <span className="relative grid h-3.5 w-3.5 place-items-center rounded-sm border border-lime">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1, type: "spring" }} className="grid h-full w-full place-items-center bg-lime">
              <Check className="h-2.5 w-2.5 text-ink" strokeWidth={4} />
            </motion.span>
          </span>
          <b className="text-fog">Landsat 8-9 OLI/TIRS C2 L2</b>
        </motion.p>
        <p className="ml-8 flex items-center gap-1.5 text-muted"><Square className="h-3.5 w-3.5" /> Landsat 7 ETM+ C2 L2</p>
        <p className="flex items-center gap-1.5 text-muted"><ChevronDown className="h-3 w-3 -rotate-90" /> Sentinel</p>
        <p className="flex items-center gap-1.5 text-muted"><ChevronDown className="h-3 w-3 -rotate-90" /> Digital Elevation</p>
      </div>
    );
  if (step === 3)
    return (
      <div className="space-y-3 p-3 sm:p-4">
        <div>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="font-semibold text-muted">Land Cloud Cover</span>
            <motion.span className="font-mono font-bold text-lime" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>&lt; 10 %</motion.span>
          </div>
          <div className="relative h-1.5 rounded-full bg-white/10">
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-lime" initial={{ width: "100%" }} animate={{ width: "10%" }} transition={{ delay: 0.4, duration: 1, ease: EASE }} />
            <motion.span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-lime" initial={{ left: "100%" }} animate={{ left: "10%" }} transition={{ delay: 0.4, duration: 1, ease: EASE }} />
          </div>
        </div>
        <Field label="Day / Night Indicator">Day</Field>
        <Field label="Sensor Identifier">OLI_TIRS</Field>
        <motion.div className="rounded-md bg-mint py-1.5 text-center text-xs font-bold text-ink" animate={{ scale: [1, 1, 0.92, 1] }} transition={{ duration: 3, times: [0, 0.8, 0.88, 1] }}>
          Results »
        </motion.div>
      </div>
    );
  return (
    <div className="space-y-2 p-3 sm:p-4">
      {[
        { id: "LC09_L2SP_137044_20240208", c: "2 %" },
        { id: "LC08_L2SP_137044_20240131", c: "6 %" },
      ].map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}
          className={cn("flex gap-2 rounded-lg border p-1.5", i === 0 ? "border-lime/40 bg-lime/[0.06]" : "border-white/10")}>
          <span className="h-10 w-10 shrink-0 rounded bg-cover bg-center" style={{ backgroundImage: `url(${SCENE})` }} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-[9.5px] font-bold text-fog">{s.id}</p>
            <p className="text-[10px] text-muted">Cloud {s.c} · OLI/TIRS</p>
            <div className="mt-0.5 flex gap-1.5 text-muted">
              <Square className="h-3 w-3" /><Eye className="h-3 w-3" />
              <DownloadIcon className={cn("h-3 w-3", i === 0 && "text-lime")} />
            </div>
          </div>
        </motion.div>
      ))}
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full bg-linear-to-r from-mint to-lime" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.2, duration: 1.8 }} />
      </div>
      <div className="space-y-0.5 font-mono text-[9.5px]">
        {["SR_B2.TIF", "SR_B3.TIF", "SR_B4.TIF", "SR_B5.TIF"].map((f, i) => (
          <motion.p key={f} className="flex items-center gap-1 text-fog/85" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 + i * 0.35 }}>
            <Check className="h-3 w-3 text-lime" /> …_{f}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

function MapView({ step }: { step: number }) {
  const aoi = "112,92 280,72 304,186 160,216 96,162";
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <img src={SCENE} alt="" className="absolute inset-0 h-full w-full object-cover brightness-[.78] saturate-[.8]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute left-2 top-2 grid overflow-hidden rounded border border-white/20 bg-ink/80 text-center font-bold leading-5 text-fog">
        <span className="w-5 border-b border-white/15 text-xs">+</span><span className="w-5 text-xs">−</span>
      </div>
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full">
        {step >= 1 && (
          <>
            <motion.polygon points={aoi} fill="rgba(216,238,134,.14)" stroke="#d8ee86" strokeWidth={2.2} strokeLinejoin="round"
              initial={{ pathLength: 0, fillOpacity: 0 }} animate={{ pathLength: 1, fillOpacity: 1 }} transition={{ duration: step === 1 ? 1.8 : 0, delay: step === 1 ? 0.6 : 0 }} />
            {aoi.split(" ").map((p, i) => {
              const [x, y] = p.split(",").map(Number);
              return <motion.circle key={p} cx={x} cy={y} r={4.5} fill="#07131a" stroke="#d8ee86" strokeWidth={2} initial={{ scale: step === 1 ? 0 : 1 }} animate={{ scale: 1 }} transition={{ delay: step === 1 ? 0.6 + i * 0.35 : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
            })}
          </>
        )}
        {step >= 4 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <polygon points="60,40 330,10 372,250 100,286" fill="rgba(139,228,207,.12)" stroke="#8be4cf" strokeWidth={2} strokeDasharray="7 5" className="animate-dash-slow" />
            <text x={70} y={32} className="fill-[#8be4cf] font-mono text-[11px] font-bold">SCENE FOOTPRINT · 137/044</text>
          </motion.g>
        )}
      </svg>
      {step === 1 && (
        <motion.div className="absolute left-[50%] top-[40%] text-lime" initial={{ y: -30, opacity: 0 }} animate={{ y: [-30, 0, -8, 0], opacity: 1 }} transition={{ duration: 0.9 }}>
          <Search className="h-5 w-5 drop-shadow" />
        </motion.div>
      )}
      <span className="absolute bottom-2 right-2 rounded bg-ink/80 px-2 py-0.5 font-mono text-[9px] text-fog/80">Map data · illustrative</span>
    </div>
  );
}

const PORTALS = [
  { n: "USGS EarthExplorer", u: "https://earthexplorer.usgs.gov/", d: "Landsat · MODIS · DEMs" },
  { n: "Copernicus Browser", u: "https://browser.dataspace.copernicus.eu/", d: "Sentinel-1, 2, 3 · free" },
  { n: "NASA Earthdata Search", u: "https://search.earthdata.nasa.gov/", d: "MODIS, VIIRS & more" },
  { n: "USGS GloVis", u: "https://glovis.usgs.gov/", d: "Quick visual browsing" },
];

export function DownloadSlide() {
  const { step, select, playing, setPlaying } = useAutoStep(STEPS.length, MS);
  const tab = step === 0 ? -1 : step - 1;
  return (
    <SlideShell eyebrow="06 · Download Satellite Images">
      <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-[.82fr_1.18fr] lg:gap-8">
        <div>
          <Heading text="Download satellite images *for free.*" />
          <Reveal as="p" className="lead mt-3">Example: Landsat 8/9 from USGS EarthExplorer — the same logic works for Sentinel-2 in the Copernicus Browser.</Reveal>
          <Reveal className="mt-4 space-y-1.5">
            {STEPS.map((s, i) => (
              <button key={s.t} onClick={() => select(i)}
                className={cn("relative flex w-full gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-colors", i === step ? "border-lime/50" : "border-transparent hover:border-white/10")}>
                {i === step && <motion.span layoutId="dl-step" className="absolute inset-0 bg-lime/[0.07]" />}
                <span className={cn("relative grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-bold", i < step ? "border-lime bg-lime text-ink" : i === step ? "border-lime text-lime" : "border-white/20 text-muted")}>
                  {i < step ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className="relative min-w-0">
                  <span className={cn("block text-sm font-semibold", i === step ? "text-fog" : "text-fog/75")}>{s.t}</span>
                  <AnimatePresence initial={false}>
                    {i === step && (
                      <motion.span className="block overflow-hidden text-xs leading-snug text-muted" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {s.d}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            ))}
          </Reveal>
          <Reveal className="mt-3 flex items-center gap-3">
            <AutoBar k={step} ms={MS} playing={playing} className="flex-1" />
            <PlayToggle playing={playing} onToggle={() => setPlaying(!playing)} />
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <MockWindow
            title={<span className="flex items-center gap-2"><Lock className="h-3 w-3 text-lime" /> earthexplorer.usgs.gov</span>}
            right={<span className="hidden rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-muted sm:inline">USGS · EarthExplorer</span>}
          >
            <div className="flex overflow-x-auto border-b border-white/10 bg-[#0f232b] text-[10px] scroll-slim">
              {TABS.map((t, i) => (
                <span key={t} className={cn("relative shrink-0 px-2.5 py-2 font-semibold sm:px-3", i === tab ? "text-lime" : "text-muted")}>
                  {t}
                  {i === tab && <motion.span layoutId="ee-tab" className="absolute inset-x-1 bottom-0 h-0.5 rounded bg-lime" />}
                </span>
              ))}
            </div>
            <div className="relative grid sm:grid-cols-[.8fr_1.2fr]">
              <div className="min-h-[200px] border-b border-white/10 sm:border-b-0 sm:border-r">
                <AnimatePresence mode="wait">
                  <motion.div key={step} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.35 }}>
                    <Panel step={step} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <MapView step={step} />
              <FakeCursor x={CURSOR[step][0]} y={CURSOR[step][1]} clickKey={step} className="hidden sm:block" />
            </div>
          </MockWindow>
          <div className="grid gap-2 min-[480px]:grid-cols-2">
            {PORTALS.map((p, i) => (
              <motion.a key={p.n} href={p.u} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }} whileHover={{ y: -2 }}
                className="card group flex items-center justify-between gap-2 px-3 py-2 hover:border-mint/40">
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold group-hover:text-lime">{p.n}</span>
                  <span className="block truncate text-[10.5px] text-muted">{p.d}</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-mint transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            ))}
          </div>
          <p className="flex items-center gap-2 text-[11px] text-muted">
            <FileImage className="h-3.5 w-3.5 text-lime" /> Landsat bands arrive as <b className="text-fog">GeoTIFF (.TIF)</b>; Sentinel-2 as <b className="text-fog">JPEG2000 (.jp2)</b> inside a .SAFE folder.
          </p>
        </Reveal>
      </div>
    </SlideShell>
  );
}
