import React from 'react';
import { C, MONO } from '../theme';

/**
 * 示波器小窗口：I_L 三角波 + SW 方波。
 * 只在「两个状态」章节出现，和原理图上的高亮回路同步。
 */
export const Scope: React.FC<{
  /** 0..N 的周期位置（用于游标） */
  cursor: number;
  /** 当前是否导通 */
  on: boolean;
}> = ({ cursor, on }) => {
  const W = 748;
  const H = 168;
  const VW = W - 28;
  const x0 = 24;
  const x1 = VW - 14;
  const cycles = 3.2;
  const perCycle = (x1 - x0) / cycles;
  const duty = 0.45;
  const yIL = 46;
  const ySW = 122;

  // I_L 三角波
  let dIL = `M${x0} ${yIL + 8}`;
  for (let i = 0; i < Math.ceil(cycles); i += 1) {
    const cx = x0 + i * perCycle;
    const onEnd = cx + perCycle * duty;
    const offEnd = cx + perCycle;
    dIL += ` L${onEnd} ${yIL - 8} L${Math.min(offEnd, x1)} ${yIL + 8}`;
  }

  // SW 方波
  let dSW = `M${x0} ${ySW + 18}`;
  for (let i = 0; i < Math.ceil(cycles); i += 1) {
    const cx = x0 + i * perCycle;
    const onEnd = cx + perCycle * duty;
    const offEnd = cx + perCycle;
    dSW += ` L${cx} ${ySW + 18} L${cx} ${ySW - 18} L${onEnd} ${ySW - 18} L${onEnd} ${ySW + 18} L${Math.min(offEnd, x1)} ${ySW + 18}`;
  }

  const cursorX = x0 + ((cursor % cycles) / cycles) * (x1 - x0);

  return (
    <div
      style={{
        position: 'absolute',
        left: 1060,
        top: 792,
        width: W,
        padding: '10px 14px 6px',
        border: `1px solid ${C.hair}`,
        backgroundColor: 'rgba(255,255,255,0.018)',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: '0.12em',
          color: C.dim,
          marginBottom: 2,
        }}
      >
        <span>SCOPE · I_L / V_SW</span>
        <span style={{ color: C.faint }}>f = 900 kHz · L = 15 µH · ΔI ≈ 0.2 A</span>
      </div>
      <svg width={VW} height={H} viewBox={`0 0 ${VW} ${H}`}>
        {/* 网格 */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={x0 + (i * (x1 - x0)) / 8}
            y1={22}
            x2={x0 + (i * (x1 - x0)) / 8}
            y2={152}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={x0}
            y1={22 + i * 32}
            x2={x1}
            y2={22 + i * 32}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        <text x={x0} y={18} fill={C.dim} fontFamily={MONO} fontSize={9}>
          I_L
        </text>
        <text x={x1} y={18} fill={C.faint} fontFamily={MONO} fontSize={9} textAnchor="end">
          2.9–3.1 A
        </text>
        <text x={x0} y={110} fill={C.dim} fontFamily={MONO} fontSize={9}>
          V_SW
        </text>
        <text x={x1} y={110} fill={C.faint} fontFamily={MONO} fontSize={9} textAnchor="end">
          12 V / −0.4 V
        </text>

        <path d={dIL} fill="none" stroke={C.blue} strokeWidth={2} strokeLinejoin="round" />
        <path d={dSW} fill="none" stroke="#B9B9B9" strokeWidth={1.8} strokeLinejoin="round" />

        {/* 游标 */}
        <line x1={cursorX} y1={22} x2={cursorX} y2={152} stroke={C.blue} strokeWidth={1} opacity={0.35} />
        <circle cx={cursorX} cy={on ? yIL - 8 : yIL + 8} r={3} fill={C.blue} />
        <circle cx={cursorX} cy={on ? ySW - 18 : ySW + 18} r={3} fill={on ? C.blue : '#7A7A7A'} />
      </svg>
    </div>
  );
};
