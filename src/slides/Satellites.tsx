import { motion } from "framer-motion";
import { Aperture, Cpu, Globe2, Radar, Rocket, SatelliteDish, ScanLine, Sun, Telescope, Timer } from "lucide-react";
import { Continents } from "@/components/Globe";
import { CountUp, Heading, Reveal, SatGlyph, SlideShell, TiltCard, itemV, slideRightV } from "@/components/ui";
import { cn } from "@/utils/cn";

/* ================================================================== */
/* Slide: What is a satellite + orbits                                  */
/* ================================================================== */

function OrbitDiagram() {
  const cx = 260, cy = 210, R = 100;
  const s = R / 190;
  const gRx = 238, gRy = 64;
  const geo = `M ${cx + gRx} ${cy} A ${gRx} ${gRy} 0 1 1 ${cx - gRx} ${cy} A ${gRx} ${gRy} 0 1 1 ${cx + gRx} ${cy}`;
  const geoBack = `M ${cx + gRx} ${cy} A ${gRx} ${gRy} 0 0 0 ${cx - gRx} ${cy}`;
  const geoFront = `M ${cx + gRx} ${cy} A ${gRx} ${gRy} 0 0 1 ${cx - gRx} ${cy}`;
  const pRx = 56, pRy = 178;
  const polar = `M ${cx} ${cy - pRy} A ${pRx} ${pRy} 0 1 1 ${cx} ${cy + pRy} A ${pRx} ${pRy} 0 1 1 ${cx} ${cy - pRy}`;
  const polarBack = `M ${cx} ${cy - pRy} A ${pRx} ${pRy} 0 0 0 ${cx} ${cy + pRy}`;
  const polarFront = `M ${cx} ${cy - pRy} A ${pRx} ${pRy} 0 0 1 ${cx} ${cy + pRy}`;
  const gDur = "24s", pDur = "7s";

  return (
    <svg viewBox="0 0 520 420" className="h-auto w-full" role="img" aria-label="Animated sun-synchronous and geostationary orbits around Earth">
      <defs>
        <radialGradient id="orb-ocean" cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#6cc7bb" />
          <stop offset=".5" stopColor="#2b6f86" />
          <stop offset="1" stopColor="#0d2c43" />
        </radialGradient>
        <radialGradient id="orb-shade" cx="30%" cy="26%" r="82%">
          <stop offset="0" stopColor="#fff" stopOpacity=".2" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#020a10" stopOpacity=".85" />
        </radialGradient>
        <linearGradient id="orb-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8be4cf" stopOpacity=".8" />
          <stop offset="1" stopColor="#8be4cf" stopOpacity="0" />
        </linearGradient>
        <clipPath id="orb-clip"><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>

      {/* back halves */}
      <path d={geoBack} fill="none" stroke="#f5bb99" strokeOpacity=".35" strokeWidth={1.5} strokeDasharray="4 7" className="animate-dash-slow" />
      <g transform={`rotate(14 ${cx} ${cy})`}>
        <path d={polarBack} fill="none" stroke="#8be4cf" strokeOpacity=".35" strokeWidth={1.5} strokeDasharray="4 7" className="animate-dash-slow" />
        <g><animateMotion dur={pDur} repeatCount="indefinite" path={polar} rotate="auto" /><SatGlyph scale={0.42} /></g>
      </g>
      <g><animateMotion dur={gDur} repeatCount="indefinite" path={geo} rotate="auto" /><SatGlyph scale={0.45} color="#9c5f38" /></g>

      {/* Earth */}
      <circle cx={cx} cy={cy} r={R + 16} fill="#7ce6ca" opacity=".07" className="animate-glow" />
      <g clipPath="url(#orb-clip)">
        <circle cx={cx} cy={cy} r={R} fill="url(#orb-ocean)" />
        <g transform={`translate(${cx - 300 * s} ${cy - 300 * s}) scale(${s})`}>
          <g className="globe-spin" style={{ animationDuration: "24s" }}>
            <Continents dx={0} />
            <Continents dx={600} />
          </g>
        </g>
        <ellipse cx={cx} cy={cy} rx={R} ry={26} fill="none" stroke="#e1fff4" strokeOpacity=".15" />
        <circle cx={cx} cy={cy} r={R} fill="url(#orb-shade)" />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#a6e8d9" strokeOpacity=".5" strokeWidth={1.4} />

      {/* front halves */}
      <path d={geoFront} fill="none" stroke="#f5bb99" strokeOpacity=".85" strokeWidth={1.8} strokeDasharray="4 7" className="animate-dash-slow" />
      <g>
        <animate attributeName="opacity" values="1;0" keyTimes="0;0.5" calcMode="discrete" dur={gDur} repeatCount="indefinite" />
        <animateMotion dur={gDur} repeatCount="indefinite" path={geo} rotate="auto" />
        <SatGlyph scale={0.5} color="#9c5f38" />
      </g>
      <g transform={`rotate(14 ${cx} ${cy})`}>
        <path d={polarFront} fill="none" stroke="#8be4cf" strokeOpacity=".9" strokeWidth={1.8} strokeDasharray="4 7" className="animate-dash-slow" />
        <g>
          <animate attributeName="opacity" values="1;0" keyTimes="0;0.5" calcMode="discrete" dur={pDur} repeatCount="indefinite" />
          <animateMotion dur={pDur} repeatCount="indefinite" path={polar} rotate="auto" />
          <polygon points="0,6 -16,40 16,40" fill="url(#orb-beam)" />
          <SatGlyph scale={0.46} />
        </g>
      </g>

      {/* labels */}
      <g className="font-mono text-[10px] font-bold">
        <text x={cx + 40} y={24} className="fill-[#8be4cf]">LEO · SUN-SYNCHRONOUS (POLAR)</text>
        <text x={cx + 40} y={37} className="fill-[#8be4cf]" opacity=".7">≈ 700–800 km · ~100 min / orbit</text>
        <text x={372} y={300} className="fill-[#f5bb99]">GEO · 35,786 km</text>
        <text x={372} y={313} className="fill-[#f5bb99]" opacity=".7">24 h = one Earth rotation</text>
        <text x={14} y={408} className="fill-[#9db3b5]" opacity=".6">NOT TO SCALE</text>
      </g>
    </svg>
  );
}

const ANATOMY = [
  { icon: Aperture, t: "Sensor / payload", d: "Camera, scanner or radar that records the energy." },
  { icon: Sun, t: "Solar panels", d: "Turn sunlight into electrical power." },
  { icon: SatelliteDish, t: "Antenna", d: "Downlinks data to ground receiving stations." },
  { icon: Cpu, t: "Bus (body)", d: "Computer, batteries, fuel & attitude control." },
];

export function SatelliteSlide() {
  return (
    <SlideShell eyebrow="03 · Satellites">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[.95fr_1.05fr] lg:gap-10">
        <div>
          <Heading text="Satellites: *eyes in orbit.*" />
          <Reveal as="p" className="lead mt-4 max-w-xl">
            A <b className="text-fog">satellite</b> is an object that orbits the Earth. Earth-observation satellites are{" "}
            <b className="text-fog">platforms</b> that carry <b className="text-fog">sensors</b> (instruments) to image our planet.
          </Reveal>
          <div className="mt-5 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
            {ANATOMY.map(({ icon: I, t, d }) => (
              <TiltCard key={t} className="p-3.5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-mint/25 bg-mint/10 text-mint transition group-hover:rotate-12 group-hover:text-lime">
                    <I className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <h3 className="font-display text-[15px] font-semibold">{t}</h3>
                    <p className="text-xs leading-snug text-muted">{d}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
          <Reveal className="mt-4 flex items-center gap-3 rounded-xl border border-peach/25 bg-peach/[0.06] px-4 py-3 text-sm">
            <Telescope className="h-5 w-5 shrink-0 text-peach" />
            <p className="text-fog/90">
              <b className="text-peach">Platform ≠ sensor:</b> Landsat 9 carries <b>OLI-2</b> &amp; <b>TIRS-2</b>; Sentinel-2 carries the <b>MSI</b> camera.
            </p>
          </Reveal>
        </div>

        <Reveal variants={slideRightV} className="space-y-3">
          <div className="hud-corners mx-auto w-full max-w-[max(60vh,300px)] overflow-hidden rounded-[18px] border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(43,111,134,.25),rgba(5,15,20,.6)_70%)]">
            <OrbitDiagram />
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <motion.div variants={itemV} className="card border-mint/25 p-3.5">
              <p className="mini-label !text-mint">Sun-synchronous · LEO</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Near-polar, ~14 orbits a day; crosses each place at the <b className="text-fog">same local time</b> for consistent lighting.
              </p>
              <p className="mt-2 font-mono text-[11px] text-fog">Landsat 8/9 · 705 km &nbsp;|&nbsp; Sentinel-2 · 786 km</p>
            </motion.div>
            <motion.div variants={itemV} className="card border-peach/25 p-3.5">
              <p className="mini-label !text-peach">Geostationary · GEO</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                Orbits above the equator in <b className="text-fog">24 hours</b>, so it always watches the same part of Earth.
              </p>
              <p className="mt-2 font-mono text-[11px] text-fog">GOES · Himawari · Meteosat (weather)</p>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* Slide: Earth-observation missions                                    */
/* ================================================================== */

type Mission = {
  name: string; agency: string; type: string; launch: string; icon: typeof Rocket;
  res: number; num: number; decimals?: number; prefix?: string; suffix: string; resNote: string;
  bands: string; revisit: string; free: boolean;
};

const MISSIONS: Mission[] = [
  { name: "Landsat 8 / 9", agency: "NASA · USGS", type: "Optical + thermal", launch: "2013 · 2021", icon: Globe2,
    res: 30, num: 30, suffix: " m", resNote: "15 m panchromatic · 100 m thermal", bands: "11 bands", revisit: "16 d each · 8 d combined", free: true },
  { name: "Sentinel-2 A/B/C", agency: "ESA · Copernicus", type: "Multispectral optical", launch: "2015 · 2017 · 2024", icon: ScanLine,
    res: 10, num: 10, suffix: " m", resNote: "Bands at 10 m · 20 m · 60 m", bands: "13 bands", revisit: "5 days", free: true },
  { name: "Sentinel-1", agency: "ESA · Copernicus", type: "C-band SAR radar", launch: "2014 · 2024 (1C)", icon: Radar,
    res: 10, num: 20, prefix: "5 × ", suffix: " m", resNote: "IW mode · day, night & through clouds", bands: "VV + VH polarisation", revisit: "12 d per satellite", free: true },
  { name: "Terra / Aqua MODIS", agency: "NASA", type: "Moderate resolution", launch: "1999 · 2002", icon: Timer,
    res: 250, num: 250, suffix: " m", resNote: "250 m · 500 m · 1 km bands", bands: "36 bands", revisit: "1–2 days", free: true },
  { name: "WorldView-3", agency: "Maxar", type: "Very high resolution", launch: "2014", icon: Telescope,
    res: 0.31, num: 0.31, decimals: 2, suffix: " m", resNote: "Panchromatic · 1.24 m multispectral", bands: "29 bands", revisit: "< 1 day", free: false },
  { name: "PlanetScope", agency: "Planet Labs", type: "CubeSat constellation", launch: "~200 “Doves”", icon: Rocket,
    res: 3, num: 3, prefix: "~", suffix: " m", resNote: "Small satellites imaging all land daily", bands: "4–8 bands", revisit: "Daily", free: false },
];

const detailPct = (m: number) => {
  const lo = Math.log(0.3), hi = Math.log(300);
  return Math.max(6, Math.min(100, ((hi - Math.log(m)) / (hi - lo)) * 100));
};

export function MissionsSlide() {
  return (
    <SlideShell eyebrow="03 · Satellites › Missions">
      <div className="mb-5 flex flex-col gap-2 short:mb-3 lg:flex-row lg:items-end lg:justify-between">
        <Heading text="Popular Earth-observation *satellites.*" />
        <Reveal as="p" className="lead max-w-md lg:text-right">
          Each mission balances detail, number of bands and revisit time. Landsat &amp; Sentinel data are <b className="text-lime">free</b>.
        </Reveal>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MISSIONS.map((m, i) => {
          const I = m.icon;
          return (
            <TiltCard key={m.name} className="p-4 short:p-3" glow={m.free ? "rgba(139,228,207,.18)" : "rgba(245,187,153,.18)"}>
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-md border border-mint/30 px-2 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-mint">{m.agency}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", m.free ? "bg-lime/15 text-lime" : "bg-peach/15 text-peach")}>
                  {m.free ? "Free" : "Commercial"}
                </span>
              </div>
              <div className="mt-3 flex items-start justify-between gap-2 short:mt-1.5">
                <div>
                  <h3 className="font-display text-xl font-semibold leading-tight">{m.name}</h3>
                  <p className="text-xs text-muted">{m.type} · {m.launch}</p>
                </div>
                <I className="h-7 w-7 shrink-0 text-mint/70 transition duration-500 group-hover:rotate-[20deg] group-hover:scale-110 group-hover:text-lime" />
              </div>
              <div className="mt-3 flex items-end justify-between short:mt-1.5">
                <span className="mini-label !text-muted">Spatial resolution</span>
                <CountUp to={m.num} decimals={m.decimals ?? 0} prefix={m.prefix} suffix={m.suffix} delay={0.4 + i * 0.08}
                  className="font-display text-2xl font-bold text-lime" />
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div className="h-full rounded-full bg-linear-to-r from-mint to-lime" initial={{ width: 0 }}
                  animate={{ width: `${detailPct(m.res)}%` }} transition={{ delay: 0.6 + i * 0.1, duration: 1.3, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <p className="mt-1.5 text-[11px] text-muted">{m.resNote}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-xs short:mt-2 short:pt-2">
                <div><dt className="text-muted">Bands</dt><dd className="font-semibold text-fog">{m.bands}</dd></div>
                <div><dt className="text-muted">Revisit</dt><dd className="font-semibold text-fog">{m.revisit}</dd></div>
              </dl>
            </TiltCard>
          );
        })}
      </div>
      <Reveal as="p" className="mt-4 text-xs text-muted short:hidden">
        Bar = spatial detail on a log scale (longer = smaller pixels). Revisit times are for the full constellation unless noted.
      </Reveal>
    </SlideShell>
  );
}
