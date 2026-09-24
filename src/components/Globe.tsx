import { useId } from "react";
import { SatGlyph } from "./ui";

/** Continents drawn on a 600-px wide strip (duplicated for a seamless spin). */
export function Continents({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx} 0)`}>
      <path d="M40 180C80 148 150 150 190 184s40 76 10 116-80 30-110-10S20 220 40 180Z" fill="#97b77c" />
      <path d="M170 330c30-10 65 15 60 50s-25 70-45 100-25-50-25-80-10-60 10-70Z" fill="#86a972" />
      <path d="M298 168c42-20 92-10 102 22s-20 40-50 45-60-10-62-30 0-30 10-37Z" fill="#a7b484" />
      <path d="M320 262c40-10 80 8 85 48s-20 80-50 110-35-40-40-80-15-68 5-78Z" fill="#b6ad78" />
      <path d="M410 150c60-20 150 0 180 40s-30 60-90 60-70-20-90-50-20-40 0-50Z" fill="#9bb67d" />
      <path d="M500 360c30-10 70 0 75 25s-25 35-55 30-35-35-20-55Z" fill="#b8a574" />
      <path d="M260 120c20-8 45-6 55 6s-15 18-35 16-30-14-20-22Z" fill="#e8f2ee" opacity=".75" />
    </g>
  );
}
export function Clouds({ dx }: { dx: number }) {
  return (
    <g transform={`translate(${dx} 0)`} fill="none" stroke="#eaf7f2" strokeLinecap="round" opacity=".42">
      <path d="M20 210c60-24 110-16 170 2" strokeWidth={9} />
      <path d="M250 175c50-20 90-14 150 6" strokeWidth={7} />
      <path d="M330 300c44-11 82-5 116 9" strokeWidth={8} />
      <path d="M90 380c38-13 81-8 109 9" strokeWidth={6} />
      <path d="M430 420c51-15 93-10 121 2" strokeWidth={8} />
      <path d="M470 250c30-8 60-6 90 4" strokeWidth={5} />
    </g>
  );
}

export function Globe({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const cx = 300, cy = 300, R = 190, rx = 272, ry = 92, dur = "16s";
  const orbit = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
  const front = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
  const back = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx - rx} ${cy}`;
  const orbit2 = `M ${cx} ${cy - 250} A 120 250 0 1 1 ${cx} ${cy + 250} A 120 250 0 1 1 ${cx} ${cy - 250}`;

  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Animated Earth observed by an orbiting satellite">
      <defs>
        <radialGradient id={`ocean${uid}`} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#6cc7bb" />
          <stop offset="48%" stopColor="#2b6f86" />
          <stop offset="100%" stopColor="#0d2c43" />
        </radialGradient>
        <radialGradient id={`shade${uid}`} cx="30%" cy="26%" r="82%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".22" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="78%" stopColor="#031018" stopOpacity=".45" />
          <stop offset="100%" stopColor="#020a10" stopOpacity=".9" />
        </radialGradient>
        <radialGradient id={`atmo${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="72%" stopColor="#7ce6ca" stopOpacity="0" />
          <stop offset="84%" stopColor="#7ce6ca" stopOpacity=".22" />
          <stop offset="100%" stopColor="#7ce6ca" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`beam${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8ee86" stopOpacity=".75" />
          <stop offset="100%" stopColor="#d8ee86" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip${uid}`}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>

      {/* atmosphere glow + pulse rings */}
      <circle cx={cx} cy={cy} r={R + 50} fill={`url(#atmo${uid})`} className="animate-glow" />
      {[0, 1.2].map((d) => (
        <circle key={d} cx={cx} cy={cy} r={R} fill="none" stroke="#8be4cf" strokeWidth={1.2}
          className="spin-origin animate-pulse-ring" style={{ animationDelay: `${d}s`, animationDuration: "3.6s" }} />
      ))}

      {/* secondary polar orbit (behind) */}
      <g transform={`rotate(28 ${cx} ${cy})`} opacity=".5">
        <path d={orbit2} fill="none" stroke="#f5bb99" strokeWidth={1} strokeDasharray="3 9" className="animate-dash-slow" />
        <circle r={4} fill="#f5bb99">
          <animateMotion dur="9s" repeatCount="indefinite" path={orbit2} />
        </circle>
      </g>

      {/* main orbit: back half + satellite copy that hides behind the Earth */}
      <g transform={`rotate(-18 ${cx} ${cy})`}>
        <path d={back} fill="none" stroke="#8be4cf" strokeOpacity=".3" strokeWidth={1.5} strokeDasharray="4 8" className="animate-dash-slow" />
        <g>
          <animateMotion dur={dur} repeatCount="indefinite" path={orbit} rotate="auto" />
          <g opacity=".85"><SatGlyph scale={0.62} /></g>
        </g>
      </g>

      {/* Earth */}
      <g clipPath={`url(#clip${uid})`}>
        <circle cx={cx} cy={cy} r={R} fill={`url(#ocean${uid})`} />
        <g className="globe-spin">
          <Continents dx={0} />
          <Continents dx={600} />
        </g>
        <g className="globe-spin-fast">
          <Clouds dx={0} />
          <Clouds dx={600} />
        </g>
        <g fill="none" stroke="#e1fff4" strokeWidth={0.8} opacity=".13">
          <ellipse cx={cx} cy={cy} rx={R} ry={60} />
          <ellipse cx={cx} cy={cy} rx={R} ry={130} />
          <ellipse cx={cx} cy={cy} rx={70} ry={R} />
          <ellipse cx={cx} cy={cy} rx={140} ry={R} />
          <path d={`M${cx - R} ${cy}h${R * 2}M${cx} ${cy - R}v${R * 2}`} />
        </g>
        <circle cx={cx} cy={cy} r={R} fill={`url(#shade${uid})`} />
      </g>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#a6e8d9" strokeWidth={1.6} opacity=".55" />

      {/* main orbit: front half + visible satellite with scan beam */}
      <g transform={`rotate(-18 ${cx} ${cy})`}>
        <path d={front} fill="none" stroke="#8be4cf" strokeOpacity=".75" strokeWidth={1.8} strokeDasharray="4 8" className="animate-dash-slow" />
        <g>
          <animate attributeName="opacity" values="1;0" keyTimes="0;0.5" calcMode="discrete" dur={dur} repeatCount="indefinite" />
          <animateMotion dur={dur} repeatCount="indefinite" path={orbit} rotate="auto" />
          <polygon points="0,8 -30,86 30,86" fill={`url(#beam${uid})`} opacity=".8">
            <animate attributeName="opacity" values=".35;.9;.35" dur="1.6s" repeatCount="indefinite" />
          </polygon>
          <SatGlyph scale={0.8} />
        </g>
      </g>
      <circle cx={70} cy={455} r={4} fill="#d8ee86" className="animate-twinkle" />
      <circle cx={540} cy={110} r={3} fill="#8be4cf" className="animate-twinkle" style={{ animationDelay: "1s" }} />
    </svg>
  );
}
