import type * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './home.module.css';
import {
  BOARD,
  CHIP,
  DDR,
  HDMI,
  INDUCTOR,
  M2,
  PMIC,
  POUR,
  USBC,
  VIEW,
  acCaps,
  decaps,
  mountingHoles,
  nets,
  stitchVias,
  viaFence,
  type NetClass,
} from './board-geometry';

/** 网络类别的展示信息（配色取自 Vercel 品牌色板） */
export const NET_META: Record<NetClass, { label: string; color: string; spec: string }> = {
  ddr: { label: 'LPDDR4X', color: '#0a72ef', spec: '14 条单端 · 40 Ω · 字节组等长 ±5 mil' },
  pcie: { label: 'PCIe 4.0 ×4', color: '#8b5cf6', spec: '4 对差分 · 85 Ω · 对内偏斜 < 1 ps' },
  io: { label: 'USB-C / HDMI', color: '#ff0080', spec: '4 对差分 · 90 / 100 Ω · 参考完整地平面' },
};

export type NetSelection = NetClass | 'all';
const NET_KEYS = Object.keys(nets) as NetClass[];

type BoardProps = {
  /** 当前高亮的网络 */
  active?: NetSelection;
  /** 信号脉冲动画 */
  animate?: boolean;
  /** 首屏走线绘制入场动画 */
  intro?: boolean;
  /** 同页多次渲染时区分 SVG defs 的 id */
  id?: string;
  className?: string;
};

function Via({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx={x} cy={y} r={r * 0.38} fill="currentColor" opacity="0.55" />
    </g>
  );
}

/** 丝印文字 */
function Silk({ x, y, children, anchor = 'start', size = 11 }: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      className="fill-fd-foreground/55 font-mono"
      style={{ letterSpacing: '0.04em' }}
    >
      {children}
    </text>
  );
}

const part = 'fill-fd-background stroke-fd-foreground/35';

/** 主视觉 PCB：板框、铜皮、过孔围栏、走线、器件与丝印 */
export function Board({ active = 'all', animate = true, intro = false, id = 'b', className }: BoardProps) {
  const { x, y, w, h, r } = BOARD;
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={cn('text-fd-foreground', className)}
      role="img"
      aria-label="迷你主机主板示意：SoC 连接 LPDDR4X、M.2、USB-C 与 HDMI"
    >
      <defs>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" fill="currentColor" opacity="0.14" />
        </pattern>
        <pattern id={`${id}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="currentColor" strokeWidth="1" opacity="0.12" />
        </pattern>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#0a72ef" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ff0080" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <rect x={x} y={y} width={w} height={h} rx={r} />
        </clipPath>
      </defs>

      {/* 板框与网格 */}
      <rect x={x} y={y} width={w} height={h} rx={r} className="fill-fd-card" />
      <g clipPath={`url(#${id}-clip)`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-grid)`} />
        <circle cx={CHIP.x + CHIP.w / 2} cy={CHIP.y + CHIP.h / 2} r="320" fill={`url(#${id}-glow)`} />
      </g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="none" className="stroke-fd-foreground/25" strokeWidth="1.5" />
      <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={r - 6} fill="none" className="stroke-fd-foreground/10" strokeDasharray="2 6" />

      {/* 地铜皮 + 缝合过孔 */}
      <rect x={POUR.x} y={POUR.y} width={POUR.w} height={POUR.h} rx="10" fill={`url(#${id}-hatch)`} className="stroke-fd-foreground/20" />
      {stitchVias.map(([vx, vy], i) => (
        <Via key={i} x={vx} y={vy} r={4.5} />
      ))}
      <Silk x={POUR.x + 8} y={POUR.y + POUR.h + 16}>GND POUR</Silk>

      {/* 板边地过孔围栏 */}
      {viaFence.map(([vx, vy], i) => (
        <Via key={i} x={vx} y={vy} r={3.5} />
      ))}

      {/* 安装孔 */}
      {mountingHoles.map(([hx, hy], i) => (
        <g key={i}>
          <circle cx={hx} cy={hy} r="18" fill="none" className="stroke-fd-foreground/30" strokeWidth="5" />
          <circle cx={hx} cy={hy} r="9" className="fill-fd-background stroke-fd-foreground/30" />
        </g>
      ))}

      {/* 电源主干：PMIC → 电感 → SoC */}
      <path d="M600 126 L600 230" className="stroke-fd-foreground/30" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M640 98 L668 98" className="stroke-fd-foreground/30" strokeWidth="10" fill="none" />

      {/* 信号走线（按网络类别着色 / 弱化） */}
      {NET_KEYS.map((k) => {
        const on = active === 'all' || active === k;
        const color = NET_META[k].color;
        return (
          <g key={k} fill="none" strokeLinejoin="round" strokeLinecap="round">
            {nets[k].map((t, i) => (
              <path
                key={i}
                d={t.d}
                stroke={on ? color : 'currentColor'}
                strokeWidth={k === 'ddr' ? 2.2 : 2}
                strokeOpacity={on ? 0.9 : 0.14}
                className={cn(intro && styles.draw, 'transition-[stroke-opacity] duration-300')}
                style={{ '--len': t.len.toFixed(0), '--delay': `${0.2 + i * 0.04}s` } as React.CSSProperties}
              />
            ))}
            {animate && on &&
              nets[k].map((t, i) =>
                t.pulse ? (
                  <path
                    key={`p${i}`}
                    d={t.d}
                    stroke="#fff"
                    strokeWidth="2.6"
                    className={styles.signalPulse}
                    style={
                      {
                        '--len': t.len.toFixed(0),
                        '--dur': `${2.4 + (i % 4) * 0.6}s`,
                        '--delay': `${1.6 + (i % 5) * 0.5}s`,
                        filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`,
                      } as React.CSSProperties
                    }
                  />
                ) : null,
              )}
          </g>
        );
      })}

      {/* PCIe 交流耦合电容（同对内错位摆放） */}
      {acCaps.map((cy, i) => (
        <rect key={i} x={i % 2 ? 952 : 930} y={cy - 2.5} width="12" height="5" rx="1" className={part} strokeWidth="1" />
      ))}

      {/* 去耦电容 */}
      {decaps.map((c, i) => (
        <g key={i}>
          <rect x={c.x - 5} y={c.y - 9} width="10" height="18" rx="2" className={part} strokeWidth="1" />
          <line x1={c.x - 5} x2={c.x + 5} y1={c.y} y2={c.y} className="stroke-fd-foreground/25" />
        </g>
      ))}

      {/* SoC：封装 + 引脚 + 裸片 */}
      <g>
        <rect x={CHIP.x} y={CHIP.y} width={CHIP.w} height={CHIP.h} rx="10" className="fill-fd-background stroke-fd-foreground/50" strokeWidth="1.5" />
        {Array.from({ length: 12 }, (_, i) => CHIP.x + 18 + i * 13).map((px) => (
          <g key={px} className="fill-fd-foreground/25">
            <rect x={px - 2} y={CHIP.y + 6} width="4" height="4" rx="1" />
            <rect x={px - 2} y={CHIP.y + CHIP.h - 10} width="4" height="4" rx="1" />
          </g>
        ))}
        <rect
          x={CHIP.x + 45}
          y={CHIP.y + 45}
          width={CHIP.w - 90}
          height={CHIP.h - 90}
          rx="6"
          className={cn('fill-fd-foreground/5 stroke-fd-foreground/30', animate && styles.viaGlow)}
        />
        <circle cx={CHIP.x + 18} cy={CHIP.y + 22} r="3" className="fill-fd-foreground/40" />
        <Silk x={CHIP.x + CHIP.w / 2} y={CHIP.y + CHIP.h / 2 - 4} anchor="middle" size={15}>U1</Silk>
        <Silk x={CHIP.x + CHIP.w / 2} y={CHIP.y + CHIP.h / 2 + 14} anchor="middle" size={10}>SoC · BGA</Silk>
      </g>

      {/* LPDDR4X */}
      {DDR.map((d) => (
        <g key={d.label}>
          <rect x={d.x} y={d.y} width={d.w} height={d.h} rx="8" className={part} strokeWidth="1.2" />
          <circle cx={d.x + 12} cy={d.y + 12} r="2.5" className="fill-fd-foreground/40" />
          <Silk x={d.x + d.w / 2} y={d.y + d.h / 2} anchor="middle" size={13}>{d.label}</Silk>
          <Silk x={d.x + d.w / 2} y={d.y + d.h / 2 + 16} anchor="middle" size={9}>{d.part}</Silk>
        </g>
      ))}

      {/* M.2 连接器（金手指） */}
      <g>
        <rect x={M2.x} y={M2.y} width={M2.w} height={M2.h} rx="8" className={part} strokeWidth="1.2" />
        {Array.from({ length: 22 }, (_, i) => M2.y + 14 + i * 10.4).map((py) => (
          <rect key={py} x={M2.x + 6} y={py} width="16" height="5" rx="1" className="fill-fd-foreground/25" />
        ))}
        <Silk x={M2.x + 56} y={M2.y + M2.h / 2} anchor="middle" size={12}>J1</Silk>
        <Silk x={M2.x + 56} y={M2.y + M2.h / 2 + 15} anchor="middle" size={9}>M.2</Silk>
      </g>

      {/* USB-C / HDMI */}
      {[
        { ...USBC, label: 'J2', part: 'USB-C' },
        { ...HDMI, label: 'J3', part: 'HDMI' },
      ].map((c) => (
        <g key={c.label}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="10" className={part} strokeWidth="1.2" />
          <rect x={c.x + 14} y={c.y + 34} width={c.w - 28} height="14" rx="7" className="fill-fd-foreground/10 stroke-fd-foreground/25" />
          <Silk x={c.x + c.w / 2} y={c.y + 22} anchor="middle" size={10}>{`${c.label} · ${c.part}`}</Silk>
        </g>
      ))}

      {/* PMIC + 功率电感 */}
      <rect x={PMIC.x} y={PMIC.y} width={PMIC.w} height={PMIC.h} rx="6" className={part} strokeWidth="1.2" />
      <Silk x={PMIC.x + PMIC.w / 2} y={PMIC.y + 33} anchor="middle" size={10}>U4 PMIC</Silk>
      <rect x={INDUCTOR.x} y={INDUCTOR.y} width={INDUCTOR.w} height={INDUCTOR.h} rx="10" className={part} strokeWidth="1.2" />
      <circle cx={INDUCTOR.x + INDUCTOR.w / 2} cy={INDUCTOR.y + INDUCTOR.h / 2} r="14" fill="none" className="stroke-fd-foreground/30" />
      <Silk x={INDUCTOR.x + INDUCTOR.w / 2} y={INDUCTOR.y + INDUCTOR.h + 14} anchor="middle" size={9}>L1</Silk>

      {/* 板级丝印 */}
      <Silk x={x + 70} y={y + h - 22} size={10}>MINI-PC MAINBOARD · 6L · 1.6 mm</Silk>
      <Silk x={x + w - 70} y={y + h - 22} anchor="end" size={10}>REV A</Silk>
    </svg>
  );
}
