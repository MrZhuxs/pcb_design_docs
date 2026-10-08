/**
 * 首页主视觉 PCB 的几何数据（纯函数、确定性，服务端渲染安全）。
 * 坐标系：viewBox 1200 × 640，板框 40..1160 × 40..600。
 */

export type Pt = [number, number];
export type Trace = { pts: Pt[]; d: string; len: number; pulse?: boolean };

export const VIEW = { w: 1200, h: 640 };
export const BOARD = { x: 40, y: 40, w: 1120, h: 560, r: 28 };
export const CHIP = { x: 510, y: 230, w: 180, h: 180 };

export const toPath = (pts: Pt[]) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

const lengthOf = (pts: Pt[]) =>
  pts.slice(1).reduce((s, [x, y], i) => s + Math.hypot(x - pts[i][0], y - pts[i][1]), 0);

const mk = (pts: Pt[], pulse = false): Trace => ({ pts, d: toPath(pts), len: lengthOf(pts), pulse });

/** 水平优先的 45° 走线：直走 s → 斜走 → 直走到终点 */
function routeH(x0: number, y0: number, x1: number, y1: number, s: number): Pt[] {
  const dir = Math.sign(x1 - x0);
  const dy = Math.abs(y1 - y0);
  return [
    [x0, y0],
    [x0 + dir * s, y0],
    [x0 + dir * (s + dy), y1],
    [x1, y1],
  ];
}

/** 垂直优先的 45° 走线 */
function routeV(x0: number, y0: number, x1: number, y1: number, s: number): Pt[] {
  const dir = Math.sign(y1 - y0);
  const dx = Math.abs(x1 - x0);
  return [
    [x0, y0],
    [x0, y0 + dir * s],
    [x1, y0 + dir * (s + dx)],
    [x1, y1],
  ];
}

/** 在水平段上插入蛇形等长绕线（从右往左走） */
function meanderLeft(xStart: number, xEnd: number, y: number, amp: number, pitch: number): Pt[] {
  const pts: Pt[] = [];
  for (let x = xStart; x - pitch >= xEnd; x -= pitch) {
    pts.push([x, y], [x, y - amp], [x - pitch / 2, y - amp], [x - pitch / 2, y]);
  }
  pts.push([xEnd, y]);
  return pts;
}

const range = (n: number, start: number, step: number) =>
  Array.from({ length: n }, (_, i) => start + i * step);

// ---------- 左侧：两颗 LPDDR4X 的数据总线（等间距 → 斜段平行不交叉） ----------
export const DDR = [
  { x: 150, y: 150, w: 110, h: 120, label: 'U2', part: 'LPDDR4X' },
  { x: 150, y: 370, w: 110, h: 120, label: 'U3', part: 'LPDDR4X' },
];

function ddrBus(chipYs: number[], ddrYs: number[], meanderIdx: number, amp: number) {
  return chipYs.map((y0, i) => {
    const base = routeH(CHIP.x, y0, DDR[0].x + DDR[0].w, ddrYs[i], 50);
    if (i !== meanderIdx) return mk(base, i % 3 === 1);
    // 最后一段替换为蛇形线
    const [p0, p1, p2] = base;
    return mk([p0, p1, ...meanderLeft(p2[0] - 10, 270, p2[1], amp, 14)], true);
  });
}

const ddrTop = ddrBus(range(7, 250, 10), range(7, 170, 10), 0, 14);
const ddrBottom = ddrBus(range(7, 330, 10), range(7, 410, 10), 6, -14);

// ---------- 右侧：PCIe ×4 差分对 → M.2 ----------
export const M2 = { x: 1000, y: 195, w: 90, h: 250 };
const pcieChip = [250, 290, 350, 390];
const pcieConn = [230, 290, 350, 410];
export const PAIR_GAP = 3.5;
export const pcie = pcieChip.flatMap((c0, i) =>
  [-PAIR_GAP, PAIR_GAP].map((o) =>
    mk(routeH(CHIP.x + CHIP.w, c0 + o, M2.x, pcieConn[i] + o, 40), o < 0),
  ),
);
/** 交流耦合电容位置（每条线一颗） */
export const acCaps = pcieConn.flatMap((c) => [c - PAIR_GAP, c + PAIR_GAP]);

// ---------- 底部：USB-C 与 HDMI ----------
export const USBC = { x: 420, y: 540, w: 100, h: 70 };
export const HDMI = { x: 700, y: 540, w: 120, h: 70 };
const bottomY = CHIP.y + CHIP.h;
const usb = [-PAIR_GAP, PAIR_GAP].map((o) =>
  mk(routeV(560 + o, bottomY, 470 + o, USBC.y, 10), o < 0),
);
const hdmi = [610, 630, 650].flatMap((x, i) =>
  [-PAIR_GAP, PAIR_GAP].map((o) => mk(routeV(x + o, bottomY, 730 + i * 20 + o, HDMI.y, 5), i === 1 && o < 0)),
);

export const signalTraces: Trace[] = [...ddrTop, ...ddrBottom, ...pcie, ...usb, ...hdmi];

/** 按网络类别分组，用于高亮 */
export type NetClass = 'ddr' | 'pcie' | 'io';
export const nets: Record<NetClass, Trace[]> = {
  ddr: [...ddrTop, ...ddrBottom],
  pcie,
  io: [...usb, ...hdmi],
};

// ---------- 电源与其他器件 ----------
export const PMIC = { x: 560, y: 70, w: 80, h: 56 };
export const INDUCTOR = { x: 668, y: 72, w: 56, h: 52 };
/** 芯片上沿的去耦电容（避开电源主干） */
export const decaps = [524, 548, 572, 628, 652, 676].map((x) => ({ x, y: 206 }));

export const mountingHoles: Pt[] = [
  [78, 78],
  [1122, 78],
  [78, 562],
  [1122, 562],
];

/** 沿板边一圈的地过孔围栏（避开四角安装孔） */
export const viaFence: Pt[] = (() => {
  const inset = 18;
  const step = 28;
  const pts: Pt[] = [];
  const x0 = BOARD.x + inset;
  const x1 = BOARD.x + BOARD.w - inset;
  const y0 = BOARD.y + inset;
  const y1 = BOARD.y + BOARD.h - inset;
  for (let x = x0 + 70; x <= x1 - 70; x += step) pts.push([x, y0], [x, y1]);
  for (let y = y0 + 70; y <= y1 - 70; y += step) pts.push([x0, y], [x1, y]);
  // 底边连接器位置不放过孔
  return pts.filter(([x, y]) => !(y === y1 && ((x > 400 && x < 540) || (x > 680 && x < 840))));
})();

/** 右上角地铜皮里的缝合过孔阵列 */
export const POUR = { x: 780, y: 70, w: 190, h: 100 };
export const stitchVias: Pt[] = range(6, POUR.x + 20, 30).flatMap((x) =>
  range(3, POUR.y + 22, 28).map((y) => [x, y] as Pt),
);
