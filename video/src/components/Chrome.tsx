import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C, CHAPTERS, DURATION, FPS, MONO, SANS } from '../theme';

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

export const Chrome: React.FC<{ frame: number }> = ({ frame }) => {
  const active = CHAPTERS.reduce(
    (acc, ch, i) => (frame >= ch.from ? i : acc),
    0,
  );
  const ch = CHAPTERS[active];
  const nextFrom = CHAPTERS[active + 1]?.from ?? DURATION;
  const chapterProgress = Math.min(
    1,
    Math.max(0, (frame - ch.from) / Math.max(1, nextFrom - ch.from)),
  );
  const docProgress = Math.min(1, frame / DURATION);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* 工程网格 */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)',
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, ${C.gridMajor} 1px, transparent 1px), linear-gradient(to bottom, ${C.gridMajor} 1px, transparent 1px)`,
          backgroundSize: '240px 240px',
          maskImage: 'radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 45%, #000 30%, transparent 78%)',
        }}
      />
      {/* 极轻的顶光 */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(60% 45% at 50% 8%, rgba(255,255,255,0.055), transparent 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* 裁切角标 */}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
        <CornerMark x={40} y={40} dx={1} dy={1} />
        <CornerMark x={1880} y={40} dx={-1} dy={1} />
        <CornerMark x={40} y={960} dx={1} dy={-1} />
        <CornerMark x={1880} y={960} dx={-1} dy={-1} />
      </svg>

      {/* 顶栏 */}
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
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: '0.14em',
              color: C.ink,
            }}
          >
            MP1584EN
          </span>
          <span style={{ width: 1, height: 16, backgroundColor: C.hair }} />
          <span
            style={{
              fontFamily: SANS,
              fontSize: 15,
              letterSpacing: '0.02em',
              color: C.dim,
            }}
          >
            非同步降压 · 12 V → 5 V / 3 A
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.16em',
              color: C.faint,
            }}
          >
            C05 · SCHEMATIC
          </span>
          <span style={{ width: 1, height: 14, backgroundColor: C.hair }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.08em',
              color: C.faint,
            }}
          >
            {timecode(frame)}
          </span>
        </div>
      </div>

      {/* 章节标尺 */}
      <div style={{ position: 'absolute', left: 72, right: 72, bottom: 44 }}>
        <div style={{ position: 'relative', height: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {CHAPTERS.map((item, i) => {
            const isActive = i === active;
            return (
              <div
                key={item.no}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                }}
              >
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
                    color: isActive ? C.ink : '#3F3F3F',
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
              left: `${Math.min(
                (active / (CHAPTERS.length - 1)) * 100,
                100 - 100 / (CHAPTERS.length - 1),
              )}%`,
              top: -1,
              height: 4,
              width: `${chapterProgress * (100 / (CHAPTERS.length - 1))}%`,
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
            color: '#3F3F3F',
          }}
        >
          <span>PCB 设计笔记 · circuits/dcdc-converter</span>
          <span>REMOTION · 1920×1080 · 30 FPS</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
