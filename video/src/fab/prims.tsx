import React from 'react';
import { C, MONO, SANS, F, easeOut } from './theme';

/** 场景容器：在 [from, to] 帧之间出现，带淡入淡出 */
export const Scene: React.FC<{
  frame: number;
  from: number;
  to: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, from, to, children, style }) => {
  if (frame < from || frame > to) return null;
  const opacity = F(frame, from, from + 14) * (1 - F(frame, to - 12, to));
  const lift = (1 - easeOut(F(frame, from, from + 20))) * 10;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '140px 120px 150px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${lift}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 逐条上浮：at 帧开始，dur 帧内完成 */
export const Rise: React.FC<{
  frame: number;
  at: number;
  dur?: number;
  y?: number;
  x?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ frame, at, dur = 18, y = 16, x = 0, style, children }) => {
  const t = easeOut(F(frame, at, at + dur));
  return (
    <div
      style={{
        opacity: t,
        transform: `translate(${(1 - t) * x}px, ${(1 - t) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** 等宽小标签 */
export const Tag: React.FC<{
  children: React.ReactNode;
  tone?: 'ink' | 'dim' | 'blue' | 'amber' | 'green' | 'red';
  style?: React.CSSProperties;
}> = ({ children, tone = 'dim', style }) => {
  const color =
    tone === 'blue'
      ? C.blue
      : tone === 'amber'
        ? C.amber
        : tone === 'green'
          ? C.green
          : tone === 'red'
            ? C.red
            : tone === 'ink'
              ? C.ink
              : C.faint;
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 13,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** 主标题 */
export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({
  children,
  size = 62,
  style,
}) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: '-0.02em',
      fontWeight: 600,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 正文 */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 22, color = C.dim, style }) => (
  <div
    style={{
      fontFamily: SANS,
      fontSize: size,
      lineHeight: 1.62,
      letterSpacing: '0.005em',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 面板：极淡底 + 细边 */
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ children, style, accent }) => (
  <div
    style={{
      background: C.panel,
      border: `1px solid ${C.panelLine}`,
      borderLeft: accent ? `2px solid ${accent}` : `1px solid ${C.panelLine}`,
      borderRadius: 10,
      ...style,
    }}
  >
    {children}
  </div>
);

/** 细横线 */
export const Hair: React.FC<{ style?: React.CSSProperties; color?: string }> = ({
  style,
  color = C.hair,
}) => <div style={{ height: 1, backgroundColor: color, ...style }} />;

/** 提示条：左侧竖线 + 一句话 */
export const Callout: React.FC<{
  children: React.ReactNode;
  tone?: 'info' | 'warn' | 'idea';
  style?: React.CSSProperties;
  size?: number;
}> = ({ children, tone = 'info', style, size = 19 }) => {
  const color = tone === 'warn' ? C.amber : tone === 'idea' ? C.green : C.blue;
  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        paddingLeft: 16,
        borderLeft: `2px solid ${color}`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: SANS,
          fontSize: size,
          lineHeight: 1.6,
          color: C.ink,
          letterSpacing: '0.005em',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** 编号方格 */
export const Marker: React.FC<{
  children: React.ReactNode;
  tone?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = C.faint, size = 30, style }) => (
  <div
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${tone}`,
      color: tone,
      fontFamily: MONO,
      fontSize: Math.round(size * 0.44),
      letterSpacing: '0.04em',
      ...style,
    }}
  >
    {children}
  </div>
);

/** 4:3 微缩图框，给象限里的小示意图用 */
export const Glyph: React.FC<{
  children: React.ReactNode;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
}> = ({ children, w = 300, h = 132, style }) => (
  <div
    style={{
      width: w,
      height: h,
      background: 'rgba(255,255,255,0.022)',
      border: `1px solid ${C.hair}`,
      borderRadius: 6,
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}
  >
    {children}
  </div>
);
