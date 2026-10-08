'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 电场 / 电势 / 电势能 的一组交互概念图（客户端组件）。
 *
 * 已注册到 components/mdx.tsx，MDX 中直接使用，无需 import。
 *
 * 组件清单：
 * - <FieldMap>        单个点电荷：电场强度衰减 + 等势面 + 试探电荷的力与电势能
 * - <UniformField>    平行板：E = U/d、电容、电量、储能、击穿场强
 * - <EnergyBalance>   同一个位置上正 / 负电荷的电势能符号与大小
 * - <SlideCharge>     沿场线移动电荷：做功、电势能、电势差同步联动
 * - <DischargeCompare> 静电放电与电容器放电：电压、电流、能量、危险的不是能量
 *
 * 所有颜色取自 Fumadocs 主题令牌（text-fd-* + fill/stroke = currentColor），
 * 自动适配明暗模式。
 */

const ctrl =
  'rounded-md border border-fd-border bg-fd-secondary px-2.5 py-1 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground';

const active = 'border-fd-primary text-fd-primary';

const chipCls = 'rounded-md border border-fd-border bg-fd-secondary/50 px-2.5 py-1.5';

function Chip({ k, v, hi }: { k: ReactNode; v: ReactNode; hi?: boolean }) {
  return (
    <div className={cn(chipCls, hi && 'border-fd-primary/40 bg-fd-primary/5')}>
      <p className="text-[10px] leading-tight text-fd-muted-foreground">{k}</p>
      <p className="mt-1 font-mono text-[13px] font-medium text-fd-foreground">{v}</p>
    </div>
  );
}

/* ==================================================== 点电荷：E 与 φ */

/** 两个试探电荷位置上的等势圆半径（以场源为圆心） */
const EQR = [1.5, 3.1, 5.2, 7.6];

function dirText(from: number, to: number) {
  return to < from ? '向左' : '向右';
}

export function FieldMap() {
  const [qPos, setQPos] = useState(true); // 场源电荷正负
  const [testPos, setTestPos] = useState(true); // 试探电荷正负
  const [r, setR] = useState(2.0); // 距离，单位：盒长

  const Q = qPos ? 1 : -1;
  const q = testPos ? 1 : -1;

  const phi = (Q / r).toFixed(2);
  const ep = (Q * q / r).toFixed(2);
  const repel = Q * q > 0;

  const x0 = 44;
  const x1 = 552;
  const yRef = 196;
  const pxPerUnit = (x1 - x0) / 10;
  const cx = (u: number) => x0 + u * pxPerUnit;

  const rs = [0.6, 1.0, 1.6, 2.6, 4.0, 6.0, 9.0];
  const prof = rs.map((u) => ({ u, v: 1 / u }));
  const vMax = prof[0].v;
  const yOf = (v: number) => yRef - Math.min(1, v / vMax) * 128;
  const line = prof.map((p) => `${cx(p.u).toFixed(1)},${yOf(p.v).toFixed(1)}`).join(' ');

  const testX = cx(r);
  const testY = 250;
  const fLen = Math.min(42, Math.max(16, 30 / (r * r)));
  const fDir = repel ? 1 : -1;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5 text-fd-muted-foreground">
          <svg width="16" height="16" aria-hidden>
            <circle cx="8" cy="8" r="6" className="text-fd-primary" fill="currentColor" fillOpacity={0.85} />
          </svg>
          场源电荷 Q（{qPos ? '正' : '负'}）
        </span>
        <span className="flex items-center gap-1.5 text-fd-muted-foreground">
          <svg width="16" height="16" aria-hidden>
            <circle cx="8" cy="8" r="4" className="text-fd-foreground" fill="currentColor" />
          </svg>
          试探电荷 q（{testPos ? '正' : '负'}）
        </span>
        <span className="flex items-center gap-1.5 text-fd-muted-foreground">
          <svg width="16" height="16" aria-hidden>
            <circle cx="8" cy="8" r="4.5" className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" fill="none" />
          </svg>
          等势面（等 φ）
        </span>
        <span className="flex items-center gap-1.5 text-fd-muted-foreground">
          <svg width="16" height="16" aria-hidden>
            <path d="M2 8h11M13 8l-3.5-2.4M13 8l-3.5 2.4" className="text-fd-primary" stroke="currentColor" strokeWidth="1.4" fill="none" />
          </svg>
          电场线 / 电场力方向
        </span>
      </div>

      <svg viewBox="-20 0 600 330" className="mt-1 h-auto w-full" role="img" aria-label="点电荷的电场强度、等势面与试探电荷的电势能">
        {/* 电场线：八个方向，随距离变稀 */}
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="1.5" fill="none" opacity={0.75}>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const sx = cx(0.5) + 22 * Math.cos(a);
            const sy = 250 + 22 * Math.sin(a);
            const ex = cx(0.5) + 104 * Math.cos(a);
            const ey = 250 + 104 * Math.sin(a);
            return <path key={i} d={`M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`} />;
          })}
        </g>

        {/* 等势面 */}
        <g className="text-fd-muted-foreground" fill="none">
          {EQR.map((u, i) => (
            <circle
              key={u}
              cx={cx(0.5)}
              cy={250}
              r={u * pxPerUnit * 0.16 + 10}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.9 - i * 0.22}
            />
          ))}
        </g>
        <text x={40} y={128} className="fill-fd-muted-foreground text-[10px]">
          等势面越密 → 电场越强（把 1 C 从一条搬到相邻一条，电场力做的功相同）
        </text>

        {/* 场源电荷 */}
        <circle cx={cx(0.5)} cy={250} r={14} className="text-fd-primary" fill="currentColor" fillOpacity={0.85} />
        <text x={cx(0.5)} y={255} textAnchor="middle" className="fill-fd-background text-[15px] font-bold">
          {qPos ? '+' : '−'}
        </text>
        <text x={cx(0.5)} y={286} textAnchor="middle" className="fill-fd-foreground text-[11px]">
          Q
        </text>

        {/* 试探电荷 + 电场力 */}
        <circle cx={testX} cy={testY} r={8} className="text-fd-foreground" fill="currentColor" />
        <text x={testX} y={testY + 4} textAnchor="middle" className="fill-fd-background text-[11px] font-bold">
          {testPos ? '+' : '−'}
        </text>
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="2.2" fill="none">
          <path d={`M${testX - fDir * 7} ${testY} H${testX + fDir * fLen}`} />
          <path
            d={`M${testX + fDir * fLen} ${testY} l${-fDir * 9} -6 M${testX + fDir * fLen} ${testY} l${-fDir * 9} 6`}
          />
        </g>
        <text
          x={testX + fDir * (fLen + 16)}
          y={testY + 4}
          textAnchor={fDir > 0 ? 'start' : 'end'}
          className="fill-fd-primary text-[11px] font-medium"
        >
          F 电场力
        </text>
        <text x={testX} y={testY - 18} textAnchor="middle" className="fill-fd-foreground text-[11px]">
          q，r = {r.toFixed(2)} 盒长
        </text>

        {/* 距离标尺 */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none">
          <path d={`M${cx(0.5)} ${testY + 34} H${testX}`} />
          <path d={`M${cx(0.5)} ${testY + 28} V${testY + 40} M${testX} ${testY + 28} V${testY + 40}`} />
        </g>
        <text x={(cx(0.5) + testX) / 2} y={testY + 54} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
          r
        </text>

        {/* E 随 r 的衰减曲线 */}
        <path d={`M${x0} ${yRef} H${x1}`} className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d={`M${x0} ${yRef} V${yOf(vMax) - 14}`} className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
        <text x={x0} y={yOf(vMax) - 20} className="fill-fd-foreground text-[11px] font-medium">
          E ∝ 1/r²（同样的两倍距离，场强只剩四分之一）
        </text>
        <polyline points={line} className="text-fd-primary" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <g className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" fill="none">
          <path d={`M${testX} ${yRef} V${yOf(1 / r)}`} />
        </g>
        <circle cx={testX} cy={yOf(1 / r)} r={4} className="text-fd-primary" fill="currentColor" />
        <text x={testX} y={yRef + 15} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
          r
        </text>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Chip k="距离 r" v={`${r.toFixed(2)} 盒长`} />
        <Chip k="电势 φ = kQ/r" v={`${phi} 格`} />
        <Chip k="电势能 Ep = qφ" v={`${ep} 格`} hi />
        <Chip k="电场力方向" v={repel ? `${dirText(testX, cx(0.5))}・相斥` : `向 Q・相吸`} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={cn(ctrl, qPos && active)} onClick={() => setQPos((v) => !v)}>
          场源 Q：{qPos ? '+ 正' : '− 负'}
        </button>
        <button type="button" className={cn(ctrl, testPos && active)} onClick={() => setTestPos((v) => !v)}>
          试探 q：{testPos ? '+ 正' : '− 负'}
        </button>
        <span className="ml-2 text-xs text-fd-muted-foreground">拖动距离：</span>
        <input
          type="range"
          min={0.6}
          max={3.4}
          step={0.05}
          value={r}
          onChange={(e) => setR(Number(e.target.value))}
          className="w-40 accent-fd-primary sm:w-56"
          aria-label="试探电荷到场源电荷的距离"
        />
      </div>

      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {qPos && testPos && '正电荷在正电荷的场里：力向外（相斥），电势能为正 —— 越近越大。'}
        {qPos && !testPos && '负电荷在正电荷的场里：力向内（相吸），电势能为负 —— 越远越接近 0。'}
        {!qPos && testPos && '正电荷在负电荷的场里：力向内，电势能为负 —— 这是电子被原子核束缚的同一种关系。'}
        {!qPos && !testPos && '负电荷在负电荷的场里：力向外，而电势能为正 —— 同号相斥的电荷，靠近需要外界做功。'}
        {' '}电势 φ 只由 Q 和 r 决定，与试探电荷无关；电势能 Ep 才与 q 有关。
      </p>
    </div>
  );
}

/* ============================================== 平行板：E = U / d */

/**
 * 用镜像电荷模拟“无限大”平板：正板在 y = 9 处有两个镜像（一正一负），
 * 这样画出来的电场线会自然地“折回”板上，而不是发散到画布外面。
 * yMin / yMax 为绘制范围，用来把镜像放到画面之外。
 */
const SURF = 2.0;
const PEN_RIGHT = 10.0;

function plateField(px: number, py: number, yMin: number, yMax: number) {
  const charges: { x: number; y: number; q: number }[] = [
    { x: SURF, y: 4.5, q: 1 },
    { x: PEN_RIGHT, y: 4.5, q: -1 },
    { x: SURF, y: 2 * yMax - 4.5, q: -1 },
    { x: SURF, y: 2 * yMin - 4.5, q: 1 },
    { x: PEN_RIGHT, y: 2 * yMax - 4.5, q: 1 },
    { x: PEN_RIGHT, y: 2 * yMin - 4.5, q: -1 },
  ];
  let ex = 0;
  let ey = 0;
  for (const c of charges) {
    const dx = px - c.x;
    const dy = py - c.y;
    const r2 = dx * dx + dy * dy;
    const r3 = Math.pow(r2, 1.5) + 1e-6;
    ex += (c.q * dx) / r3;
    ey += (c.q * dy) / r3;
  }
  return { ex, ey };
}

const Y_MIN = -2;
const Y_MAX = 11;

/** 从 (sx, sy) 出发沿电场方向追踪一条场线（归一化坐标） */
function traceLine(sx: number, sy: number, steps = 900, h = 0.05) {
  let x = sx;
  let y = sy;
  const pts: string[] = [`${x.toFixed(2)},${y.toFixed(2)}`];
  for (let i = 0; i < steps; i++) {
    const { ex, ey } = plateField(x, y, Y_MIN, Y_MAX);
    const len = Math.hypot(ex, ey);
    if (len < 1e-9) break;
    x += (h * ex) / len;
    y += (h * ey) / len;
    if (x < Y_MIN - 4 || x > Y_MAX + 8 || y < Y_MIN - 2 || y > Y_MAX + 2) break;
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts;
}

/** 板外场线会绕到画面外，把 y 方向做个压缩并裁掉越界的段 */
function fitLine(pts: string[]) {
  const out: [number, number][] = [];
  for (const p of pts) {
    const [x, y] = p.split(',').map(Number);
    const yy = y > 8.85 ? 8.85 + (y - 8.85) * 0.5 : y < 0.15 ? 0.15 - (0.15 - y) * 0.5 : y;
    if (yy < 0.4 || yy > 10.5) continue;
    out.push([x, yy]);
  }
  return out;
}

const PLATE_LINES = [1.6, 2.7, 3.8, 5.2, 6.3, 7.4].map((y0) =>
  fitLine(traceLine(SURF + 0.2, y0)),
);

/** 背景均匀箭头：方向 = 局部电场方向，长度按 |Ex| 缩放（归一化坐标里就地把箭头画好） */
const BG_ARROWS = (() => {
  const xg = [3.15, 4.15, 5.15, 6.15, 7.15, 8.15, 9.15];
  const yg = [1.4, 2.6, 3.8, 4.5, 5.2, 6.4, 7.6];
  const out: string[] = [];
  for (const px of xg) {
    for (const py of yg) {
      const { ex, ey } = plateField(px, py, Y_MIN, Y_MAX);
      const len = Math.hypot(ex, ey);
      if (len < 1e-7 || Math.abs(ex) / len < 0.2) continue;
      const L = Math.min(1.7, 1.05 * Math.abs(ex / len));
      const ux = ex / len;
      const uy = ey / len;
      const ex2 = px + ux * L;
      const ey2 = py + uy * L;
      const bx1 = ex2 + (-ux * 0.34 - uy * 0.17);
      const by1 = ey2 + (-uy * 0.34 + ux * 0.17);
      const bx2 = ex2 + (-ux * 0.34 + uy * 0.17);
      const by2 = ey2 + (-uy * 0.34 - ux * 0.17);
      out.push(
        `${px.toFixed(2)} ${py.toFixed(2)} ${ex2.toFixed(2)} ${ey2.toFixed(2)} ${bx1.toFixed(2)} ${by1.toFixed(
          2,
        )} ${bx2.toFixed(2)} ${by2.toFixed(2)}`,
      );
    }
  }
  return out;
})();

export function UniformField() {
  const [U, setU] = useState(24); // V
  const [d, setD] = useState(0.2); // mm
  const [A, setA] = useState(10); // cm²

  const E = U / (d * 1e-3); // V/m
  const Ebreak = d * 3e7; // 击穿电压（3e7 V/m = 30 kV/mm）
  const C = (8.854e-12 * 4.5 * (A * 1e-4)) / (d * 1e-3); // F
  const Q = C * U; // C
  const W = 0.5 * C * U * U; // J

  const fmtF = (v: number) =>
    v >= 1e-6 ? `${(v * 1e6).toFixed(2)} µF` : v >= 1e-9 ? `${(v * 1e9).toFixed(0)} nF` : `${(v * 1e12).toFixed(0)} pF`;
  const fmtQ = (v: number) =>
    v >= 1 ? `${v.toFixed(2)} C` : v >= 1e-3 ? `${(v * 1e3).toFixed(2)} mC` : `${(v * 1e9).toFixed(2)} nC`;
  const fmtW = (v: number) =>
    v >= 1e-3 ? `${(v * 1e3).toFixed(2)} mJ` : v >= 1e-6 ? `${(v * 1e6).toFixed(2)} µJ` : `${(v * 1e9).toFixed(1)} nJ`;
  const fmtE = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)} MV/m` : v >= 1e3 ? `${(v / 1e3).toFixed(0)} kV/m` : `${v.toFixed(0)} V/m`;

  const padX = (x: number) => 74 + (x / 12.5) * 452;
  const padY = (y: number) => 48 + (y / 9) * 254;
  const xPlateL = padX(2.0);
  const xPlateR = padX(10.0);
  const rows = [3.9, 4.75, 5.6];
  const arrLen = Math.min(52, 14 + (E / (3e7 / 12)) * 52);
  const warn = E > 1.5e7 ? 'near' : E > 5e6 ? 'watch' : 'ok';

  return (
    <div className="w-full">
      <svg viewBox="0 0 600 356" className="h-auto w-full" role="img" aria-label="平行板电容器中的匀强电场及其边缘效应">
        {/* 均匀分布的方向箭头 */}
        {BG_ARROWS.map((pts, i) => {
          const [ax, ay, bx, by, c1x, c1y, c2x, c2y] = pts.split(' ').map(Number);
          return (
            <path
              key={i}
              d={`M${padX(ax).toFixed(1)} ${padY(ay).toFixed(1)} L${padX(bx).toFixed(1)} ${padY(by).toFixed(1)} M${padX(
                bx,
              ).toFixed(1)} ${padY(by).toFixed(1)} L${padX(c1x).toFixed(1)} ${padY(c1y).toFixed(1)} M${padX(
                bx,
              ).toFixed(1)} ${padY(by).toFixed(1)} L${padX(c2x).toFixed(1)} ${padY(c2y).toFixed(1)}`}
              className="text-fd-primary"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
              opacity={0.32}
            />
          );
        })}

        {/* 完整场线：板内均匀，板外自然折回板上 */}
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="1.4" fill="none" opacity={0.65}>
          {PLATE_LINES.map((pts, i) => (
            <polyline
              key={i}
              points={pts
                .map(([px, py]) => `${padX(px).toFixed(1)},${padY(py).toFixed(1)}`)
                .join(' ')}
            />
          ))}
        </g>

        {/* 两块板 */}
        <path d={`M${xPlateL} ${padY(0.35)} V${padY(8.65)}`} className="text-fd-foreground" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
        <path d={`M${xPlateR} ${padY(0.35)} V${padY(8.65)}`} className="text-fd-foreground" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />

        <text x={xPlateL + 16} y={padY(0.35) - 8} className="fill-fd-primary text-[11px] font-medium">
          + 板（正极）
        </text>
        <text x={xPlateR - 16} y={padY(0.35) - 8} textAnchor="end" className="fill-fd-muted-foreground text-[11px] font-medium">
          − 板（负极）
        </text>

        {/* 板间的均匀箭头：长度随 E 变化 */}
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="2.4" fill="none">
          {rows.map((y) => (
            <g key={y}>
              <path d={`M${xPlateL + 12} ${padY(y)} H${xPlateL + 12 + arrLen}`} />
              <path
                d={`M${xPlateL + 12 + arrLen} ${padY(y)} l-10 -6 M${xPlateL + 12 + arrLen} ${padY(y)} l-10 6`}
              />
            </g>
          ))}
        </g>
        <text
          x={xPlateL + 12 + arrLen + 12}
          y={padY(4.75) + 4}
          className="fill-fd-primary text-[11px] font-medium"
        >
          E = {fmtE(E)}
        </text>
        <text
          x={(xPlateL + xPlateR) / 2}
          y={padY(7.3)}
          textAnchor="middle"
          className="fill-fd-muted-foreground text-[10px]"
        >
          板间：大小方向都相同 —— 匀强电场
        </text>
        <text
          x={(xPlateL + xPlateR) / 2}
          y={padY(8.45)}
          textAnchor="middle"
          className="fill-fd-muted-foreground text-[10px]"
        >
          板的边缘：场线外张 —— 边缘效应，贴近板边的地方不再均匀
        </text>

        {/* 尺寸标注 */}
        <g className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none">
          <path d={`M${xPlateL} ${padY(9.0)} H${xPlateR}`} />
          <path d={`M${xPlateL} ${padY(8.85)} V${padY(9.15)} M${xPlateR} ${padY(8.85)} V${padY(9.15)}`} />
        </g>
        <text x={(xPlateL + xPlateR) / 2} y={padY(9.0) + 20} textAnchor="middle" className="fill-fd-foreground text-[11px]">
          板间距 d = {d.toFixed(2)} mm　板面积 A = {A} cm²　介质 Dk = 4.5（FR-4）
        </text>
        <text x={(xPlateL + xPlateR) / 2} y={padY(9.0) + 38} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
          图中板间距按 1 mm 固定绘制（真实比例下 0.05 mm 就是一条线，画不出来）
        </text>
      </svg>

      <div className="mt-2 space-y-2 text-xs">
        <label className="block">
          <span className="text-fd-muted-foreground">板间电压 U：{U.toFixed(0)} V</span>
          <input type="range" min={1} max={60} step={1} value={U} onChange={(e) => setU(Number(e.target.value))} className="mt-1 w-full accent-fd-primary" />
        </label>
        <label className="block">
          <span className="text-fd-muted-foreground">板间距 d：{d.toFixed(2)} mm</span>
          <input type="range" min={0.05} max={1.6} step={0.05} value={d} onChange={(e) => setD(Number(e.target.value))} className="mt-1 w-full accent-fd-primary" />
        </label>
        <label className="block">
          <span className="text-fd-muted-foreground">板面积 A：{A} cm²</span>
          <input type="range" min={0.5} max={100} step={0.5} value={A} onChange={(e) => setA(Number(e.target.value))} className="mt-1 w-full accent-fd-primary" />
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Chip k="场强 E = U / d" v={fmtE(E)} hi />
        <Chip k="电容 C = εA / d" v={fmtF(C)} />
        <Chip k="板上电量 Q = CU" v={fmtQ(Q)} />
        <Chip k="储能 W = ½CU²" v={fmtW(W)} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <Chip k="FR-4 的击穿场强（约）" v="30 MV/m（30 kV/mm）" />
        <Chip
          k="该间距下的击穿电压 E_击穿 × d"
          v={Ebreak >= 1000 ? `${(Ebreak / 1000).toFixed(1)} kV` : `${Ebreak.toFixed(0)} V`}
          hi={warn !== 'ok'}
        />
      </div>

      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {d <= 0.2 && U >= 24
          ? '高压靠“拉大间距”解决，低压大电容靠“缩间距 + 高 Dk”解决 —— 同一条 E = U/d 的两头。'
          : '把间距减半，同样的电压下场强翻倍；反过来，要让场强不变，间距减半就得把电压也减半。'}
      </p>
    </div>
  );
}

/* ============================================ 电势能天平：符号与大小 */

export function EnergyBalance() {
  const [pos, setPos] = useState(true); // 位置：true = 靠近正极板
  const [q, setQ] = useState<1 | -1 | 2>(1);

  const phi = pos ? 3 : 1; // 以负板为 0 时的电势（格）
  const ep = q * phi;

  // 条形图：5 格对应 140 px
  const barScale = 140 / 5;
  const barLen = Math.abs(ep) * barScale;
  const epZero = 190;

  const pcls = q > 0 ? 'text-fd-primary' : 'text-fd-muted-foreground';

  return (
    <div className="w-full">
      <svg viewBox="0 0 620 196" className="h-auto w-full" role="img" aria-label="电势能与电荷正负的符号关系条形图">
        {/* 参考零点（负板） */}
        <path d="M64 24 V166" className="text-fd-border" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <text x={64} y={18} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
          φ = 0（负极板）
        </text>

        {/* 电势刻度 */}
        <g className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" fill="none">
          <path d={`M64 ${epZero - 1 * barScale} H572`} />
          <path d={`M64 ${epZero - 2 * barScale} H572`} />
          <path d={`M64 ${epZero - 3 * barScale} H572`} opacity={0.6} />
        </g>
        <text x={76} y={epZero - 1 * barScale + 12} className="fill-fd-muted-foreground text-[10px]">
          φ = 1 格
        </text>
        <text x={76} y={epZero - 2 * barScale + 12} className="fill-fd-muted-foreground text-[10px]">
          φ = 2 格
        </text>
        <text x={76} y={epZero - 3 * barScale + 12} className="fill-fd-muted-foreground text-[10px]">
          φ = 3 格（贴近正板）
        </text>

        {/* 零能线 */}
        <path d={`M64 ${epZero} H572`} className="text-fd-foreground" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <text x={572} y={epZero + 14} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
          Ep = 0
        </text>

        {/* 电势能条：向上为正，向下为负 */}
        <rect
          x={70}
          y={ep >= 0 ? epZero - barLen : epZero}
          width={400}
          height={Math.max(2, barLen)}
          rx={4}
          className={pcls}
          fill="currentColor"
          fillOpacity={0.28}
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ transition: 'all 400ms ease-out' }}
        />
        <text
          x={480}
          y={ep >= 0 ? epZero - barLen - 10 : epZero + Math.min(barLen, 110) + 18}
          textAnchor="end"
          className={cn('text-[12px] font-semibold', ep >= 0 ? 'fill-fd-primary' : 'fill-fd-muted-foreground')}
        >
          Ep = q·φ = {q > 0 ? `+${q}` : '−1'} × {phi} = {ep > 0 ? '+' : '−'}
          {Math.abs(ep)} 格
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={cn(ctrl, pos && active)} onClick={() => setPos(true)}>
          放在贴近正板处（φ 高）
        </button>
        <button type="button" className={cn(ctrl, !pos && active)} onClick={() => setPos(false)}>
          放在贴近负板处（φ 低）
        </button>
        <span className="ml-2 text-xs text-fd-muted-foreground">电荷：</span>
        {([['+1', 1], ['−1', -1], ['+2', 2]] as const).map(([label, v]) => (
          <button key={label} type="button" className={cn(ctrl, q === v && active)} onClick={() => setQ(v)}>
            {label === '+1' ? '正电荷 +q' : label === '−1' ? '负电荷 −q' : '双倍正电荷 +2q'}
          </button>
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {q > 0 &&
          (pos
            ? '正电荷在电势高处：电势能为正且数值大，松手后电场力把它推向低电势方向，电势能随之减少。'
            : '正电荷在电势低处：电势能仍然为正，但数值小 —— 它在高电势处"更悬"，能更多。')}
        {q < 0 &&
          (pos
            ? '负电荷（电子）在电势高处：电势能为负 —— 电势越高，它的电势能反而越小，所以电子会自己往电势高的地方跑。'
            : '负电荷（电子）在电势低处：电势能为负且数值更大（更接近 0）—— 它"更松"，把它拉走更省力。')}
        {q > 0 && ' 把电荷换成电子，同一个位置上能的符号就翻了过来。'}
      </p>
    </div>
  );
}

/* ========================================= 沿场线移动：做功与电势能 */

export function SlideCharge() {
  const [q, setQ] = useState<1 | -1>(1);
  const [x, setX] = useState(0.5); // 场强 E = 1 V/m，起点在 -3，末端在 +3
  const [E, setE] = useState(200); // V/m

  const x0 = -3;
  const x1 = 3;
  const u = (px: number) => Math.round(((px - x0) / (x1 - x0)) * 120); // 电势，格（0 ~ 120）

  const uA = u(x0);
  const uB = u(x);
  const uC = u(x1);
  const dU = uB - uA; // A、B 两点电势差（格）
  const dUC = uC - uA; // A、C 两点电势差（格）
  const fDir = q > 0 ? 1 : -1;
  const w = q * dU; // 正 = 电场力做正功
  const wAC = q * dUC;
  const fmtS = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v)}`;

  // 电势沿距离的分布
  const winX = (v: number) => 500 + (v - x0) * 19;
  const linePts = Array.from({ length: 61 }, (_, i) => {
    const v = x0 + ((x1 - x0) * i) / 60;
    return `${winX(v).toFixed(1)},${(112 - (u(v) / 120) * 86).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="w-full">
      <svg viewBox="0 -6 660 226" className="h-auto w-full" role="img" aria-label="电荷沿电场线移动时的做功与电势能变化">
        {/* 匀强场箭头 */}
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="1.8" fill="none" opacity={0.55}>
          {[36, 62, 88].map((y) => (
            <path key={y} d={`M20 ${y} H450 m0 0 l-10 -6 m10 6 l-10 6`} />
          ))}
        </g>
        <text x={20} y={26} className="fill-fd-primary text-[11px] font-medium">
          匀强电场 E = {E} V/m →
        </text>

        {/* 轨道 */}
        <path d="M20 150 H450" className="text-fd-border" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

        {/* A 点与 C 点 */}
        <g className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1.6" fill="none">
          <path d="M20 138 V162" />
          <path d="M450 138 V162" />
        </g>
        <text x={20} y={178} textAnchor="middle" className="fill-fd-muted-foreground text-[11px]">
          A（φ = {uA} 格）
        </text>
        <text x={450} y={178} textAnchor="middle" className="fill-fd-muted-foreground text-[11px]">
          C（φ = {uC} 格）
        </text>

        {/* 电荷 */}
        <g transform={`translate(${20 + x * 72},150)`} style={{ transition: 'transform 250ms ease-out' }}>
          <circle r={11} className={q > 0 ? 'text-fd-primary' : 'text-fd-muted-foreground'} fill="currentColor" fillOpacity={0.85} />
          <text y={4} textAnchor="middle" className="fill-fd-background text-[13px] font-bold">
            {q > 0 ? '+' : '−'}
          </text>
          <path d={`M${fDir * 12} 0 h${fDir * 26}`} className="text-fd-primary" stroke="currentColor" strokeWidth="2.4" fill="none" />
          <path
            d={`M${fDir * 38} 0 l${-fDir * 9} -6 M${fDir * 38} 0 l${-fDir * 9} 6`}
            className="text-fd-primary"
            stroke="currentColor"
            strokeWidth="2.4"
            fill="none"
          />
        </g>
        <text x={20 + x * 72} y={126} textAnchor="middle" className="fill-fd-foreground text-[11px]">
          q = {q > 0 ? '+q' : '−q'}
        </text>

        {/* A → B 的位移 */}
        <g className="text-fd-foreground" stroke="currentColor" strokeWidth="1.6" fill="none">
          <path d={`M20 192 H${20 + x * 72}`} />
          <path d={`M20 186 V198 M${20 + x * 72} 186 V198`} />
        </g>
        <text x={20 + (x * 72) / 2} y={208} textAnchor="middle" className="fill-fd-foreground text-[10px]">
          A→B　Δx = {(x - x0).toFixed(2)} 格
        </text>

        {/* 电势沿距离的分布 */}
        <g>
          <text x={500} y={22} className="fill-fd-foreground text-[11px] font-medium">
            φ 沿场方向降低
          </text>
          <polyline points={linePts} className="text-fd-primary" stroke="currentColor" strokeWidth="2.2" fill="none" />
          <path d="M500 112 H614" className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx={winX(x)} cy={112 - (uB / 120) * 86} r={4.5} className="text-fd-primary" fill="currentColor" />
          <text x={500} y={132} className="fill-fd-muted-foreground text-[10px]">
            A
          </text>
          <text x={612} y={132} className="fill-fd-muted-foreground text-[10px]">
            C
          </text>
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={cn(ctrl, q > 0 && active)} onClick={() => setQ(1)}>
          正电荷 +q
        </button>
        <button type="button" className={cn(ctrl, q < 0 && active)} onClick={() => setQ(-1)}>
          负电荷 −q
        </button>
        <span className="ml-2 text-xs text-fd-muted-foreground">B 点位置：</span>
        <input
          type="range"
          min={0.1}
          max={1}
          step={0.01}
          value={x}
          onChange={(e) => setX(Number(e.target.value))}
          className="w-36 accent-fd-primary sm:w-52"
          aria-label="B 点位置"
        />
        <span className="text-xs text-fd-muted-foreground">场强：</span>
        <input
          type="range"
          min={50}
          max={1000}
          step={50}
          value={E}
          onChange={(e) => setE(Number(e.target.value))}
          className="w-28 accent-fd-primary sm:w-40"
          aria-label="匀强电场场强"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Chip k="A、B 的电势差 U_AB" v={`${dU} 格`} hi />
        <Chip k={`移动 ${q > 0 ? '正' : '负'}电荷做的功 W_AB`} v={`${fmtS(w)} 格`} />
        <Chip k="电势能变化 ΔEp = −W_AB" v={`${fmtS(-w)} 格`} hi />
        <Chip k="A→C 全长做的功 W_AC" v={`${fmtS(wAC)} 格`} />
      </div>

      <div className="mt-2 rounded-lg border border-fd-border bg-fd-secondary/40 p-3 text-sm leading-relaxed">
        <p className="text-fd-foreground">
          F = qE = {q > 0 ? '+' : '−'}
          {E} × q （{fDir > 0 ? '与场同向' : '与场反向'}）　·　
          W = F·Δx ∝ {q > 0 ? '' : '−'}
          {E} × ({(x - x0).toFixed(2)} 格) ∝ {w > 0 ? '正功' : w < 0 ? '负功' : '零'}
        </p>
        <p className="mt-1 text-xs text-fd-muted-foreground">
          场强 E 只改变做功的“快慢”（力有多大），不改变结果的正负与电势差；电势差 U_AB = {dU} 格
          只由 A、B 两点的位置决定，与 q 无关。
        </p>
      </div>

      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {q > 0
          ? '正电荷顺着场的方向移动：电场力做正功，电势能减少，电势降低。'
          : '负电荷顺着场的方向移动：电场力做负功，电势能反而增加 —— 电子往电势高的地方走，能更低。'}
        {' '}把 B 拖回 A 点，功与能的变化都会归零：只与起点终点有关，与路径无关。
      </p>
    </div>
  );
}

/* ================================================ 放电：能量与电流 */

const CASES = [
  { key: 'body', name: '人体（走过地毯）', U: 250, C: 100e-12, R: 1e3, note: '“啪”一下，麻一下' },
  { key: 'cap', name: '电源输入电容（已充满）', U: 400, C: 18e-6, R: 1, note: '焊盘炸出凹坑、探头报废' },
  { key: 'ln', name: '闪电（云 → 地）', U: 1e8, C: 5e-6, R: 10, note: '劈开树干，熔掉金属' },
] as const;

type Key = (typeof CASES)[number]['key'];

export function DischargeCompare() {
  const [k, setK] = useState<Key>('cap');
  const c = CASES.find((v) => v.key === k)!;

  const W = 0.5 * c.C * c.U * c.U;
  const Ipk = c.U / c.R;
  const nE = W / 1.6e-19; // 相当于多少个电子“下落 1 V”的能量（写成数量级）

  const fmtE = (v: number) =>
    v >= 1e9
      ? `${(v / 1e9).toFixed(1)} GJ`
      : v >= 1e6
        ? `${(v / 1e6).toFixed(1)} MJ`
        : v >= 1e3
          ? `${(v / 1e3).toFixed(2)} kJ`
          : v >= 1
            ? `${v.toFixed(2)} J`
            : v >= 1e-3
              ? `${(v * 1e3).toFixed(2)} mJ`
              : `${(v * 1e6).toFixed(1)} µJ`;

  const fmtI = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(1)} MA` : v >= 1e3 ? `${(v / 1e3).toFixed(1)} kA` : `${v.toFixed(v < 1 ? 2 : 0)} A`;
  const fmtU = (v: number) =>
    v >= 1e6 ? `${(v / 1e6).toFixed(0)} MV` : v >= 1e3 ? `${(v / 1e3).toFixed(0)} kV` : `${v} V`;
  const fmtC = (v: number) =>
    v >= 1e-6 ? `${(v * 1e6).toFixed(0)} µF` : v >= 1e-12 ? `${(v * 1e12).toFixed(0)} pF` : `${(v * 1e15).toFixed(0)} fF`;
  const fmtQ = (v: number) =>
    v >= 1 ? `${v.toFixed(1)} C` : v >= 1e-3 ? `${(v * 1e3).toFixed(1)} mC` : `${(v * 1e9).toFixed(1)} nC`;

  // 能量条：三种场景的能量跨 13 个数量级，用对数刻度压缩，否则人体那条根本看不见
  const scale = (v: number) => Math.max(6, (Math.log10(v / 1e-4) / 12) * 300);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CASES.map((v) => (
          <button key={v.key} type="button" className={cn(ctrl, k === v.key && active)} onClick={() => setK(v.key)}>
            {v.name}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 600 168" className="mt-3 h-auto w-full" role="img" aria-label="三种放电场景的能量对比条">
        {CASES.map((v, i) => {
          const y = 22 + i * 46;
          const w = scale(0.5 * v.C * v.U * v.U);
          const on = v.key === k;
          return (
            <g key={v.key}>
              <text x={0} y={y + 5} className={cn('text-[11px]', on ? 'fill-fd-foreground font-medium' : 'fill-fd-muted-foreground')}>
                {fmtE(0.5 * v.C * v.U * v.U)}
              </text>
              <rect
                x={78}
                y={y - 9}
                width={w}
                height={20}
                rx={4}
                className={on ? 'text-fd-primary' : 'text-fd-muted-foreground'}
                fill="currentColor"
                fillOpacity={on ? 0.3 : 0.16}
                stroke="currentColor"
                strokeWidth={on ? 1.6 : 1}
                style={{ transition: 'all 400ms ease-out' }}
              />
              <text x={86 + w} y={y + 5} className={cn('text-[10px]', on ? 'fill-fd-primary font-medium' : 'fill-fd-muted-foreground')}>
                {v.name}
              </text>
            </g>
          );
        })}
        <text x={0} y={160} className="fill-fd-muted-foreground text-[10px]">
          横条按能量的对数刻度绘制（三者相差 13 个数量级，线性刻度下人体那条根本看不见）
        </text>
      </svg>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Chip k="电压 U" v={fmtU(c.U)} />
        <Chip k="储能 W = ½CU²" v={fmtE(W)} />
        <Chip k="回路电阻 R" v={c.R >= 1e3 ? `${(c.R / 1e3).toFixed(0)} kΩ` : `${c.R} Ω`} />
        <Chip k="峰值电流 I = U/R" v={fmtI(Ipk)} hi />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <Chip k="电容 C" v={fmtC(c.C)} />
        <Chip k="转移的电荷 Q = CU" v={fmtQ(c.C * c.U)} />
        <Chip k="能量相当于把这么多电子抬过 1 V" v={`约 10^${Math.round(Math.log10(nE))} 个`} />
      </div>

      <div className="mt-3 rounded-lg border border-fd-border bg-fd-secondary/40 p-3 text-sm leading-relaxed">
        <p className="text-fd-foreground">{c.note}</p>
        <p className="mt-1 text-xs text-fd-muted-foreground">
          {c.key === 'body' &&
            '100 pF 是人体在地毯上的典型等效电容，250 V 是化纤地毯上常见的静电电位。储能只有毫焦级，但全部在纳秒级释放，峰值电流仍有数百毫安。'}
          {c.key === 'cap' &&
            '18 µF 的电容比人的等效电容大 18 万倍，所以它存下来的电荷量与能量，人的身体根本比不了。同样是"带上了几百伏"，能装多少电荷完全是两回事。'}
          {c.key === 'ln' &&
            '闪电的电位是 10⁸ V 量级，转移的电荷只有几库仑。它的能量不是"电位高"单独带来的，是电位高、同时电荷量也不少的乘积。'}
        </p>
      </div>
    </div>
  );
}
