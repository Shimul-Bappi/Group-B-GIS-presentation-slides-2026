/// <reference types="vite/client" />
import { useEffect, useState } from "react";
import sceneUrl from "@/assets/sat-scene.jpg";

/**
 * Teaching simulation: a single true-colour scene is used to *approximate*
 * extra spectral bands (NIR / SWIR) so the presentation can demonstrate
 * band combinations, NDVI, classification and resolution interactively.
 */
export const SCENE = sceneUrl;
export const W = 960;
export const H = 720;

export type ImgKey =
  | "natural" | "cir" | "agri" | "ndvi" | "gray" | "classes"
  | "bandB" | "bandG" | "bandR" | "bandNIR"
  | "chR" | "chG" | "chB"
  | "q1" | "q2" | "q4" | "q8";

export interface Imagery {
  urls: Record<ImgKey, string>;
  source: HTMLCanvasElement;
  rgba: Uint8ClampedArray;
  nir: Uint8ClampedArray;
  hist: { r: number[]; g: number[]; b: number[]; nir: number[] };
}

export const CLASS_COLORS: [number, number, number][] = [
  [47, 127, 193],   // 0 water
  [224, 85, 90],    // 1 built-up
  [217, 183, 126],  // 2 bare soil / sand
  [159, 211, 106],  // 3 cropland / grass
  [31, 107, 58],    // 4 forest
];
export const CLASS_NAMES = ["Water", "Built-up", "Bare soil / sand", "Cropland", "Forest"];

const clamp = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);

export function spectral(r: number, g: number, b: number) {
  const L = (r + g + b) / 3;
  const veg = Math.max(0, (g - r) / (g + r + 1)) * Math.max(0, (g - b) / (g + b + 1));
  const wat = Math.max(0, (b - g) / (b + g + 1));
  const nir = clamp(L * 1.1 + veg * 1100 - wat * 900);
  const swir = clamp(L * 1.15 - veg * 400 - wat * 1200 + (r - g) * 0.6);
  return { nir, swir };
}

function classify(r: number, g: number, b: number) {
  const { nir } = spectral(r, g, b);
  const ndvi = (nir - r) / (nir + r + 1);
  const L = (r + g + b) / 3;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  if (ndvi < -0.25 || (b > g && b > r && L < 150)) return 0;
  if (ndvi > 0.45 && L < 62) return 4;
  if (ndvi > 0.3) return 3;
  if (sat < 28 && L > 70) return 1;
  return 2;
}

const NDVI_STOPS: [number, [number, number, number]][] = [
  [-0.4, [165, 0, 38]], [-0.1, [215, 48, 39]], [0.05, [244, 109, 67]], [0.15, [253, 174, 97]],
  [0.25, [254, 224, 139]], [0.35, [217, 239, 139]], [0.45, [166, 217, 106]], [0.55, [102, 189, 99]],
  [0.65, [26, 152, 80]], [0.8, [0, 104, 55]],
];
export function ndviColor(v: number): [number, number, number] {
  if (v <= NDVI_STOPS[0][0]) return NDVI_STOPS[0][1];
  for (let i = 1; i < NDVI_STOPS.length; i++) {
    const [x1, c1] = NDVI_STOPS[i];
    if (v <= x1) {
      const [x0, c0] = NDVI_STOPS[i - 1];
      const t = (v - x0) / (x1 - x0);
      return [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t];
    }
  }
  return NDVI_STOPS[NDVI_STOPS.length - 1][1];
}
export const NDVI_GRADIENT = `linear-gradient(90deg, ${NDVI_STOPS.map(
  ([v, c]) => `rgb(${c.join(",")}) ${(((v + 0.4) / 1.2) * 100).toFixed(1)}%`,
).join(", ")})`;

function percentile(h: number[], total: number, lo = 0.02, hi = 0.98): [number, number] {
  let acc = 0, a = 0, b = 255;
  for (let i = 0; i < 256; i++) { acc += h[i]; if (acc >= total * lo) { a = i; break; } }
  acc = 0;
  for (let i = 255; i >= 0; i--) { acc += h[i]; if (acc >= total * (1 - hi)) { b = i; break; } }
  if (b <= a) b = a + 1;
  return [a, b];
}

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
};

const toUrl = (c: HTMLCanvasElement, type = "image/jpeg", q = 0.9) =>
  new Promise<string>((res) => {
    try {
      c.toBlob((b) => res(b ? URL.createObjectURL(b) : c.toDataURL(type, q)), type, q);
    } catch {
      res(c.toDataURL(type, q));
    }
  });

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

function bins64(h: number[]) {
  const out: number[] = [];
  for (let i = 0; i < 64; i++) out.push(h[i * 4] + h[i * 4 + 1] + h[i * 4 + 2] + h[i * 4 + 3]);
  const sorted = [...out].sort((a, b) => b - a);
  const max = sorted[1] || sorted[0] || 1;
  return out.map((v) => Math.min(1, v / max));
}

async function build(img: HTMLImageElement): Promise<Imagery> {
  const source = makeCanvas(W, H);
  const sctx = source.getContext("2d", { willReadFrequently: true })!;
  sctx.drawImage(img, 0, 0, W, H);
  const rgba = sctx.getImageData(0, 0, W, H).data;
  const N = W * H;
  const nir = new Uint8ClampedArray(N);
  const swir = new Uint8ClampedArray(N);
  const lum = new Uint8ClampedArray(N);
  const hr = new Array(256).fill(0), hg = new Array(256).fill(0), hb = new Array(256).fill(0);
  const hn = new Array(256).fill(0), hs = new Array(256).fill(0), hl = new Array(256).fill(0);

  for (let i = 0, p = 0; i < N; i++, p += 4) {
    const r = rgba[p], g = rgba[p + 1], b = rgba[p + 2];
    const s = spectral(r, g, b);
    nir[i] = s.nir; swir[i] = s.swir;
    lum[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    hr[r]++; hg[g]++; hb[b]++; hn[nir[i]]++; hs[swir[i]]++; hl[lum[i]]++;
  }
  const [rl, rh] = percentile(hr, N), [gl, gh] = percentile(hg, N), [bl, bh] = percentile(hb, N);
  const [nl, nh] = percentile(hn, N), [sl, sh] = percentile(hs, N), [ll, lh] = percentile(hl, N);
  const st = (v: number, lo: number, hi: number) => clamp(((v - lo) / (hi - lo)) * 255);

  const out = makeCanvas(W, H);
  const octx = out.getContext("2d")!;
  const buf = octx.createImageData(W, H);
  const d = buf.data;
  const urls: Partial<Record<ImgKey, string>> = { natural: SCENE };

  const render = async (key: ImgKey, fn: (i: number, p: number) => void) => {
    for (let i = 0, p = 0; i < N; i++, p += 4) { fn(i, p); d[p + 3] = 255; }
    octx.putImageData(buf, 0, 0);
    urls[key] = await toUrl(out);
    await tick();
  };
  const set = (p: number, r: number, g: number, b: number) => { d[p] = r; d[p + 1] = g; d[p + 2] = b; };

  await render("cir", (i, p) => set(p, st(nir[i], nl, nh), st(rgba[p], rl, rh), st(rgba[p + 1], gl, gh)));
  await render("agri", (i, p) => set(p, st(swir[i], sl, sh), st(nir[i], nl, nh), st(rgba[p + 2], bl, bh)));
  await render("ndvi", (i, p) => {
    const r = rgba[p], n = nir[i];
    const c = ndviColor((n - r) / (n + r + 1));
    set(p, c[0], c[1], c[2]);
  });
  await render("gray", (i, p) => { const v = st(nir[i], nl, nh); set(p, v, v, v); });
  await render("bandNIR", (i, p) => { const v = st(nir[i], nl, nh); set(p, v, v, v); });
  await render("bandR", (_i, p) => { const v = st(rgba[p], rl, rh); set(p, v, v, v); });
  await render("bandG", (_i, p) => { const v = st(rgba[p + 1], gl, gh); set(p, v, v, v); });
  await render("bandB", (_i, p) => { const v = st(rgba[p + 2], bl, bh); set(p, v, v, v); });
  await render("chR", (_i, p) => set(p, rgba[p], 0, 0));
  await render("chG", (_i, p) => set(p, 0, rgba[p + 1], 0));
  await render("chB", (_i, p) => set(p, 0, 0, rgba[p + 2]));
  for (const bits of [1, 2, 4, 8] as const) {
    const levels = 2 ** bits;
    await render(`q${bits}` as ImgKey, (i, p) => {
      const v = st(lum[i], ll, lh) / 255;
      const q = bits === 1 ? (v >= 0.5 ? 255 : 0) : (Math.round(v * (levels - 1)) / (levels - 1)) * 255;
      set(p, q, q, q);
    });
  }

  // Classified raster (paletted / unique values) at coarser resolution
  const CW = 320, CH = 240;
  const small = makeCanvas(CW, CH);
  const smctx = small.getContext("2d", { willReadFrequently: true })!;
  smctx.drawImage(source, 0, 0, CW, CH);
  const sd = smctx.getImageData(0, 0, CW, CH);
  for (let p = 0; p < sd.data.length; p += 4) {
    const c = CLASS_COLORS[classify(sd.data[p], sd.data[p + 1], sd.data[p + 2])];
    sd.data[p] = c[0]; sd.data[p + 1] = c[1]; sd.data[p + 2] = c[2]; sd.data[p + 3] = 255;
  }
  smctx.putImageData(sd, 0, 0);
  urls.classes = await toUrl(small, "image/png");

  return {
    urls: urls as Record<ImgKey, string>,
    source,
    rgba,
    nir,
    hist: { r: bins64(hr), g: bins64(hg), b: bins64(hb), nir: bins64(hn) },
  };
}

let cache: Imagery | null = null;
let pending: Promise<Imagery> | null = null;

export function loadImagery(): Promise<Imagery> {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = new Promise<Imagery>((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => build(img).then((r) => { cache = r; resolve(r); }, reject);
      img.onerror = reject;
      img.src = SCENE;
    });
  }
  return pending;
}

export function useImagery() {
  const [data, setData] = useState<Imagery | null>(cache);
  useEffect(() => {
    if (cache) { setData(cache); return; }
    let alive = true;
    loadImagery().then((d) => alive && setData(d)).catch(() => {});
    return () => { alive = false; };
  }, []);
  return data;
}

/** Returns the processed image URL (falls back to the natural scene while processing). */
export function useScene(key: ImgKey) {
  const data = useImagery();
  return { url: data?.urls[key] ?? SCENE, ready: !!data || key === "natural" };
}
