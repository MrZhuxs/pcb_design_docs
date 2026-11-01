export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** 线性进度 */
export const prog = (frame: number, from: number, to: number) =>
  clamp01((frame - from) / Math.max(1, to - from));

/** 三次缓出：入口动画的主力 */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export type Pt = [number, number];

const dist = (a: Pt, b: Pt) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** 折线总长 */
export const polyLength = (pts: Pt[]) => {
  let total = 0;
  for (let i = 1; i < pts.length; i += 1) total += dist(pts[i - 1], pts[i]);
  return total;
};

/** 折线上按比例取点：给"电流小球"用 */
export const pointAt = (pts: Pt[], t: number): Pt => {
  const total = polyLength(pts);
  let remain = clamp01(t) * total;
  for (let i = 1; i < pts.length; i += 1) {
    const seg = dist(pts[i - 1], pts[i]);
    if (remain <= seg || i === pts.length - 1) {
      const k = seg === 0 ? 0 : remain / seg;
      return [mix(pts[i - 1][0], pts[i][0], k), mix(pts[i - 1][1], pts[i][1], k)];
    }
    remain -= seg;
  }
  return pts[pts.length - 1];
};

/** 数组折线 → path d */
export const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ');
