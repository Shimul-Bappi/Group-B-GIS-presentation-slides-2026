/** Sine-wave path between two points (used for "energy" rays). */
export function wavePath(x1: number, y1: number, x2: number, y2: number, amp = 6, waves = 6, samples = 90) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const o = Math.sin(t * Math.PI * 2 * waves) * amp;
    d += `${i ? "L" : "M"}${(x1 + dx * t + nx * o).toFixed(1)} ${(y1 + dy * t + ny * o).toFixed(1)}`;
  }
  return d;
}

/** Catmull-Rom → cubic Bézier smooth path through points. */
export function smoothPath(pts: [number, number][]) {
  if (pts.length < 2) return "";
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** Approximate display colour for a wavelength in micrometres. */
export function wavelengthColor(um: number) {
  if (um < 0.45) return "#7b6cf0";
  if (um < 0.49) return "#4f8ff0";
  if (um < 0.52) return "#3fc1d8";
  if (um < 0.57) return "#58c96b";
  if (um < 0.59) return "#d6de4a";
  if (um < 0.62) return "#f0a13a";
  if (um < 0.7) return "#ef5a4f";
  if (um < 1.3) return "#c4577a";
  if (um < 2.0) return "#c98a52";
  return "#a8784e";
}
