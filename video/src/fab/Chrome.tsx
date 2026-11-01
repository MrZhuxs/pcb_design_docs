import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, F, FPS, MONO, SANS, type Chapter } from './theme';

const timecode = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const f = frame % FPS;
  return `${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

const CornerMark: React.FC<{ x: number; y: number; dx: number; dy: number }> = ({
  x,
  y,
  dx,
  dy,
}) => (
  <g stroke={C.faint} strokeWidth={1} fill="none" opacity={0.55}>
    <line x1={x} y1={y} x2={x + 14 * dx} y2={y} />
    <line x1={x} y1={y} x2={x} y2={y + 14 * dy} />
  </g>
);

export type ChromeProps = {
  frame: number;
  duration: number;
  /** 顶栏左侧：项目名（等宽） */
  brand: string;
  /** 顶栏左侧：副标题（无衬线、暗） */
  sub: string;
  /** 顶栏右侧：编号，例如 SF · 01 / 03 */
  code: string;
  chapters: Chapter[];
  footerLeft?: string;
  footerRight?: string;
};

/** 全局外壳：网格、角标、顶栏、章节标尺、时间码。三段影片共用。 */
export const Chrome: React.FC<ChromeProps> = ({
  frame,
  duration,
  brand,
  sub,
  code,
  chapters,
  footerLeft = 'PCB 设计笔记 · pcb-design-manufacturing/structure-and-fabrication',
  footerRight = 'REMOTION · 1920×1080 · 30 FPS',
}) => {
  const active = chapters.reduce((acc, ch, i) => (frame >= ch.from ? i : acc), 0);
  const ch = chapters[active];
  const nextFrom = chapters[active + 1]?.from ?? duration;
  const chapterProgress = Math.min(
    1,
    Math.max(0, (frame - ch.from) / Math.max(1, nextFrom - ch.from)),
  );
  const docProgress = Math.min(1, frame / duration);
  const segW = 100 / chapters.length;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(120% 90% at 50% 45%, #000 32%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 45%, #000 32%, transparent 80%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${C.gridMajor} 1px, transparent 1px), linear-gradient(to bottom, ${C.gridMajor} 1px, transparent 1px)`,
          backgroundSize: '240px 240px',
          maskImage: 'radial-gradient(120% 90% at 50% 45%, #000 32%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 45%, #000 32%, transparent 80%)',
        }}
      />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(60% 45% at 50% 8%, rgba(255,255,255,0.055), transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <CornerMark x={40} y={40} dx={1} dy={1} />
        <CornerMark x={1880} y={40} dx={-1} dy={1} />
        <CornerMark x={40} y={960} dx={1} dy={-1} />
        <CornerMark x={1880} y={960} dx={-1} dy={-1} />
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 72,
          right: 72,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${C.hair}`,
          paddingBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width={14} height={12} viewBox="0 0 14 12">
            <path d="M7 0L14 12H0Z" fill={C.ink} />
          </svg>
          <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.14em', color: C.ink }}>
            {brand}
          </span>
          <span style={{ width: 1, height: 16, backgroundColor: C.hair }} />
          <span style={{ fontFamily: SANS, fontSize: 15, letterSpacing: '0.02em', color: C.dim }}>
            {sub}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.16em', color: C.faint }}>
            {code}
          </span>
          <span style={{ width: 1, height: 14, backgroundColor: C.hair }} />
          <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: C.faint }}>
            {timecode(frame)}
          </span>
        </div>
      </div>

      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 44 }}>
        <div
          style={{
            position: 'relative',
            height: 18,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          {chapters.map((item, i) => {
            const isActive = i === active;
            return (
              <div key={item.no} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    color: isActive ? C.ink : C.faint,
                  }}
                >
                  {item.no}
                </span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    letterSpacing: '0.06em',
                    color: isActive ? C.ink : C.ghost,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ position: 'relative', height: 2, marginTop: 10, backgroundColor: C.hairSoft }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 2,
              width: `${docProgress * 100}%`,
              backgroundColor: '#3A3A3A',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${active * segW}%`,
              top: -1,
              height: 4,
              width: `${chapterProgress * segW}%`,
              backgroundColor: C.blue,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: '0.1em',
            color: C.ghost,
          }}
        >
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
      {/* 顶部一条极细的帧刻度，比 DcdcSchematic 更“图纸” */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 72,
          right: 72,
          height: 6,
          opacity: 0.5,
          backgroundImage: `repeating-linear-gradient(to right, ${C.hair} 0 1px, transparent 1px 24px)`,
        }}
      />
      <div style={{ position: 'absolute', top: 96, left: 72, width: 1, height: 6, background: C.faint, opacity: F(frame, 0, 10) }} />
    </AbsoluteFill>
  );
};
