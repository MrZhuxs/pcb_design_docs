import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 物理类概念图组件（服务端组件，动画用 SVG SMIL，无第三方依赖）。
 *
 * 已注册到 components/mdx.tsx，MDX 中直接使用，无需 import。
 *
 * 组件清单：
 * - <ScaleChain> / <ScaleStep>   尺度阶梯：逐级放大的概念图
 * - <AtomModel>                  原子结构：核 + 电子壳层
 * - <ForceCurve>                 强力 / 库仑力 / 净力 随距离的示意曲线
 * - <TwoSpeeds>                  电子漂移与信号传播的速度对比（动画）
 * - <DisplacementCurrent>        电容器中的位移电流（动画）
 *
 * 所有颜色取自 Fumadocs 主题令牌（text-fd-* + fill/stroke=currentColor），
 * 自动适配明暗模式。
 */

/* ============================================================ 尺度阶梯 */

export function ScaleChain({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-y-3',
        // 隐藏第一级的「放大」连接符
        '[&>*:first-child>div:first-child]:hidden',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function ScaleStep({
  size,
  label,
  sub,
  factor,
  accent,
}: {
  /** 该级的尺度，如 10⁻¹⁰ m */
  size: ReactNode;
  /** 该级对象名 */
  label: ReactNode;
  /** 补充说明 */
  sub?: ReactNode;
  /** 从上一级到本级的放大倍数，如 ×10⁵ */
  factor?: ReactNode;
  /** 强调色 */
  accent?: boolean;
}) {
  return (
    <div className="flex items-center">
      <div className="flex shrink-0 flex-col items-center px-1.5 text-fd-muted-foreground">
        <span className="text-[9px] leading-none">放大</span>
        <span className="mt-0.5 text-[10px] font-semibold leading-none text-fd-foreground">
          {factor}
        </span>
        <svg width="26" height="8" viewBox="0 0 26 8" aria-hidden className="mt-1">
          <path
            d="M0 4h20M20 4l-4-2.6M20 4l-4 2.6"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>
      <div
        className={cn(
          'flex min-w-24 flex-col items-center rounded-lg border px-3 py-2 text-center shadow-sm',
          accent
            ? 'border-fd-primary/40 bg-fd-primary/5'
            : 'border-fd-border bg-fd-secondary text-fd-secondary-foreground',
        )}
      >
        <span className="text-[13px] font-medium leading-tight">{label}</span>
        <span className="mt-0.5 font-mono text-[11px] leading-none text-fd-primary">{size}</span>
        {sub && (
          <span className="mt-1 text-[10px] leading-tight text-fd-muted-foreground">{sub}</span>
        )}
      </div>
    </div>
  );
}

/* ============================================================ 原子结构 */

const GOLDEN = (137.5 * Math.PI) / 180;

/** 用黄金角在一个圆内铺开 n 个点（向日葵式堆积），用于画核子团簇 */
function cluster(n: number, spacing: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = i * GOLDEN;
    const r = spacing * Math.sqrt(i);
    out.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
  }
  return out;
}

export function AtomModel({
  nucleons = 6,
  shells = [2, 4],
  symbol = 'C',
}: {
  /** 核子总数（质子 + 中子），用于画核 */
  nucleons?: number;
  /** 每层电子数，由内向外 */
  shells?: number[];
  /** 元素符号 */
  symbol?: string;
}) {
  const cx = 180;
  const cy = 168;
  const shellR = [72, 108, 142];
  const protons = nucleons % 2 === 0 ? nucleons / 2 : Math.ceil(nucleons / 2);
  const nucleonDots = cluster(nucleons, 6.9);

  return (
    <svg viewBox="0 0 360 340" className="h-auto w-full max-w-88" role="img" aria-label="原子结构示意">
      {/* 电子壳层 */}
      {shells.map((_, i) => (
        <circle
          key={`s${i}`}
          cx={cx}
          cy={cy}
          r={shellR[i] ?? shellR[shellR.length - 1] + 34 * (i - shellR.length + 1)}
          className="text-fd-border"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
        />
      ))}

      {/* 核子团簇 */}
      {nucleonDots.map((p, i) => (
        <circle
          key={`n${i}`}
          cx={cx + p.x}
          cy={cy + p.y}
          r={6.6}
          className={i < protons ? 'text-fd-primary' : 'text-fd-muted-foreground'}
          fill="currentColor"
          fillOpacity={i < protons ? 0.85 : 0.4}
        />
      ))}
      <text x={cx} y={cy + 3.5} textAnchor="middle" className="fill-fd-background text-[11px] font-semibold">
        {symbol}
      </text>

      {/* 电子 */}
      {shells.map((count, si) => {
        const r = shellR[si] ?? shellR[shellR.length - 1] + 34 * (si - shellR.length + 1);
        const off = (si * 22 * Math.PI) / 180;
        return Array.from({ length: count }).map((_, e) => {
          const a = off + (2 * Math.PI * e) / count;
          return (
            <circle
              key={`e${si}-${e}`}
              cx={cx + r * Math.cos(a)}
              cy={cy + r * Math.sin(a)}
              r={4.2}
              className="text-fd-foreground"
              fill="currentColor"
            />
          );
        });
      })}

      {/* 标注 */}
      <path
        d={`M${cx + 26} ${cy - 20} L${cx + 92} ${cy - 62}`}
        className="text-fd-border"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <text x={cx + 96} y={cy - 58} className="fill-fd-foreground text-[11px]">
        原子核 ≈ 10⁻¹⁵ m
      </text>
      <path
        d={`M${cx + 100 * Math.cos(-Math.PI / 4)} ${cy + 100 * Math.sin(-Math.PI / 4)} L${cx + 118} ${cy - 108}`}
        className="text-fd-border"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <text x={cx + 122} y={cy - 104} className="fill-fd-foreground text-[11px]">
        电子云 ≈ 10⁻¹⁰ m
      </text>
      <text x={cx} y={330} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
        核在图上被放大 —— 实际直径比约为 1 : 100000
      </text>
    </svg>
  );
}

/* ============================================================ 力与距离 */

/** 示意用强核力模型：排斥核心 + 吸引势阱，仅供画曲线形状 */
function strongForce(r: number): number {
  const core = 5 * Math.exp(-Math.pow(r / 0.45, 2));
  const attr = -2.6 * Math.exp(-Math.pow(r / 1.3, 2));
  return core + attr;
}

export function ForceCurve({ rMax = 5 }: { rMax?: number }) {
  const x0 = 44;
  const x1 = 596;
  const zeroY = 140;
  const ppu = 44; // 每单位力对应的像素
  const pxPerFm = (x1 - x0) / rMax;
  const yMin = 34;
  const yMax = 246;

  const cx = (r: number) => x0 + r * pxPerFm;
  const cy = (f: number) => Math.min(yMax, Math.max(yMin, zeroY - f * ppu));

  const pts = (f: (r: number) => number) => {
    const out: string[] = [];
    for (let i = 0; i <= 320; i++) {
      const r = 0.16 + (rMax - 0.16) * (i / 320);
      out.push(`${cx(r).toFixed(1)},${cy(f(r)).toFixed(1)}`);
    }
    return out.join(' ');
  };

  const coulomb = (r: number) => 1 / (r * r);
  const net = (r: number) => strongForce(r) + coulomb(r);

  const marks = [
    { r: 0.7, label: '0.7 fm' },
    { r: 2.0, label: '≈2 fm' },
    { r: 2.5, label: '2.5 fm' },
  ];

  return (
    <svg viewBox="0 0 620 300" className="h-auto w-full" role="img" aria-label="强核力与库仑力随距离变化的示意曲线">
      {/* 坐标轴 */}
      <path d={`M${x0} ${yMin} V${yMax} H${x1}`} className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* 零力线 */}
      <path d={`M${x0} ${zeroY} H${x1}`} className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" fill="none" />
      <text x={x0 - 6} y={zeroY + 4} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
        0
      </text>
      <text x={x0 - 6} y={yMin + 10} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
        排斥
      </text>
      <text x={x0 - 6} y={yMax} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
        吸引
      </text>
      <text x={x1} y={zeroY - 10} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
        核子间距 →
      </text>

      {/* 标记线 */}
      {marks.map((m) => (
        <g key={m.r}>
          <path
            d={`M${cx(m.r)} ${yMin} V${yMax}`}
            className="text-fd-border"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 5"
            fill="none"
          />
          <text x={cx(m.r)} y={yMax + 16} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
            {m.label}
          </text>
        </g>
      ))}

      {/* 三条曲线 */}
      <polyline points={pts(coulomb)} fill="none" className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 3" />
      <polyline points={pts(strongForce)} fill="none" className="text-fd-primary" stroke="currentColor" strokeWidth="2.2" />
      <polyline points={pts(net)} fill="none" className="text-fd-foreground" stroke="currentColor" strokeWidth="2.6" />

      {/* 区域标注 */}
      <text x={cx(0.35)} y={yMin + 26} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
        排斥核心
      </text>
      <text x={cx(1.3)} y={yMax - 8} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
        净吸引区
      </text>
      <text x={cx(3.7)} y={yMin + 26} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
        已可忽略
      </text>

      {/* 图例 */}
      <g>
        <path d={`M${x1 - 176} ${yMin + 4} h22`} className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1.6" strokeDasharray="5 3" fill="none" />
        <text x={x1 - 148} y={yMin + 8} className="fill-fd-muted-foreground text-[10px]">
          库仑斥力（1/r²，长程）
        </text>
        <path d={`M${x1 - 176} ${yMin + 22} h22`} className="text-fd-primary" stroke="currentColor" strokeWidth="2.2" fill="none" />
        <text x={x1 - 148} y={yMin + 26} className="fill-fd-muted-foreground text-[10px]">
          强核力（短程）
        </text>
        <path d={`M${x1 - 176} ${yMin + 40} h22`} className="text-fd-foreground" stroke="currentColor" strokeWidth="2.6" fill="none" />
        <text x={x1 - 148} y={yMin + 44} className="fill-fd-muted-foreground text-[10px]">
          净力 = 两者之和
        </text>
      </g>
    </svg>
  );
}

/* ============================================================ 两个速度 */

export function TwoSpeeds() {
  const x0 = 48;
  const x1 = 572;
  const travel = x1 - x0;

  return (
    <div className="w-full">
      <svg viewBox="0 0 620 230" className="h-auto w-full" role="img" aria-label="电子漂移与信号传播速度对比动画">
        {/* 走线 */}
        <path d={`M${x0} 66 H${x1}`} className="text-fd-border" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        <path d={`M${x0} 66 H${x1}`} className="text-fd-primary" stroke="currentColor" strokeWidth="1" strokeDasharray="2 6" fill="none" />

        <text x={x0} y={44} className="fill-fd-foreground text-[11px] font-medium">
          信号：电场波沿走线传播
        </text>

        {/* 传播的脉冲 + 拖尾（整组平移） */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values={`0,0; ${travel},0`}
            dur="1.6s"
            repeatCount="indefinite"
          />
          {[
            { dx: -26, o: 0.12 },
            { dx: -16, o: 0.22 },
            { dx: -8, o: 0.4 },
            { dx: 0, o: 1 },
          ].map((p) => (
            <g key={p.dx} transform={`translate(${x0 + p.dx},66)`}>
              <circle r={p.dx === 0 ? 7 : 5} className="text-fd-primary" fill="currentColor" opacity={p.o} />
            </g>
          ))}
        </g>

        {/* 电子行 */}
        <path d={`M${x0} 168 H${x1}`} className="text-fd-border" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" fill="none" />
        <text x={x0} y={146} className="fill-fd-foreground text-[11px] font-medium">
          电子：原地热运动 + 极小的定向漂移
        </text>
        {Array.from({ length: 15 }).map((_, i) => (
          <g key={i} transform={`translate(${x0 + 12 + i * ((travel - 24) / 14)},168)`}>
            <circle r={4} className="text-fd-foreground" fill="currentColor" opacity={0.55}>
              <animate
                attributeName="opacity"
                values="0.55;0.95;0.55"
                dur={`${0.5 + (i % 5) * 0.09}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        <text x={x0} y={212} className="fill-fd-muted-foreground text-[10px]">
          动画时长 1.6 s 内：信号走完全程（按比例约 15 cm）；电子净位移 0.2 pm —— 按同一比例只有 7×10⁻¹⁰ 像素，画不出来
        </text>
      </svg>
    </div>
  );
}

/* ==================================================== 位移电流（动画） */

export function DisplacementCurrent() {
  const cycle = '3s';
  return (
    <svg viewBox="0 0 560 270" className="h-auto w-full max-w-150" role="img" aria-label="电容器充电过程中的位移电流动画">
      {/* 导线 */}
      <path d="M34 134 H198" className="text-fd-border" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M362 134 H526" className="text-fd-border" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />

      {/* 极板 */}
      <path d="M198 62 V206" className="text-fd-foreground" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
      <path d="M362 62 V206" className="text-fd-foreground" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />

      {/* 传导电流 */}
      <g className="text-fd-primary" stroke="currentColor" strokeWidth="2" fill="none">
        <path d="M92 106 H140 M140 106l-9-6M140 106l-9 6" />
        <path d="M420 106 H468 M468 106l-9-6M468 106l-9 6" />
      </g>
      <text x={104} y={94} className="fill-fd-primary text-[11px] font-medium">
        传导电流 I
      </text>
      <text x={432} y={94} className="fill-fd-primary text-[11px] font-medium">
        传导电流 I
      </text>

      {/* 板上的电荷（充/放循环） */}
      <g className="text-fd-primary">
        <animate attributeName="opacity" values="0;1;1;0;0" dur={cycle} repeatCount="indefinite" />
        {[84, 112, 140, 168, 196].map((y) =>
          [186, 214].map((x) => (
            <text key={`${y}-${x}`} x={x} y={y} textAnchor="middle" className="fill-fd-primary text-[15px] font-bold">
              +
            </text>
          )),
        )}
      </g>
      <g className="text-fd-muted-foreground">
        <animate attributeName="opacity" values="0;1;1;0;0" dur={cycle} repeatCount="indefinite" />
        {[84, 112, 140, 168, 196].map((y) =>
          [346, 374].map((x) => (
            <text key={`${y}-${x}`} x={x} y={y} textAnchor="middle" className="fill-fd-muted-foreground text-[16px] font-bold">
              −
            </text>
          )),
        )}
      </g>

      {/* 极板之间的电场（随电荷同步增强） */}
      <g className="text-fd-primary" stroke="currentColor" strokeWidth="2" fill="none">
        <animate attributeName="opacity" values="0;1;1;0;0" dur={cycle} repeatCount="indefinite" />
        {[96, 134, 172].map((y) => (
          <path key={y} d={`M232 ${y} H328 M328 ${y}l-9-6M328 ${y}l-9 6`} />
        ))}
      </g>
      <text x={280} y={52} textAnchor="middle" className="fill-fd-primary text-[11px] font-medium">
        电场 E 在增强
      </text>

      {/* 介质 */}
      <text x={280} y={228} textAnchor="middle" className="fill-fd-muted-foreground text-[11px]">
        介质中没有电荷通过
      </text>
      <text x={280} y={256} textAnchor="middle" className="fill-fd-foreground text-[12px] font-medium">
        位移电流 I_d = ε · dΦ_E / dt，其值等于传导电流 I
      </text>
    </svg>
  );
}
