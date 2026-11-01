/**
 * 视频设计系统：Vercel 设计语言 × 工业制图。
 *
 * Vercel 的部分：纯黑底、极细的分隔线、单色文字层级、等宽标签、三角形标记、收紧的字距。
 * 工业的部分：工程网格、裁切角标、标尺刻度、虚线引线、单色高亮只在关键处出现。
 */

export const C = {
  bg: '#0A0A0A',
  bgLift: '#0D0D0D',
  panel: 'rgba(255,255,255,0.028)',
  panelLine: 'rgba(255,255,255,0.10)',
  grid: 'rgba(255,255,255,0.026)',
  gridMajor: 'rgba(255,255,255,0.05)',
  hair: '#242424',
  hairSoft: '#191919',

  ink: '#EDEDED',
  dim: '#8F8F8F',
  faint: '#5A5A5A',

  blue: '#0070F3',
  blueSoft: 'rgba(0,112,243,0.15)',
  blueLine: 'rgba(0,112,243,0.55)',
  amber: '#F5A623',

  chip: '#131313',
  chipStroke: '#3D3D3D',
} as const;

export const SANS =
  '"Inter","Segoe UI Variable Display","Segoe UI","Microsoft YaHei",system-ui,sans-serif';
export const MONO =
  '"Geist Mono","JetBrains Mono","Cascadia Mono","Consolas","Microsoft YaHei",monospace';

/** 章节标尺 */
export const CHAPTERS = [
  { no: '01', label: '骨架', from: 110 },
  { no: '02', label: '能量', from: 430 },
  { no: '03', label: '状态', from: 590 },
  { no: '04', label: '引脚', from: 910 },
  { no: '05', label: '阻值', from: 1250 },
  { no: '06', label: '收束', from: 1700 },
] as const;

export const DURATION = 1820;
export const FPS = 30;

/** 原理图 svg(viewBox 0 84 920 320) 放到 1920×1080 上的变换 */
export const SCALE = 1.739;
export const ORIGIN = { x: 160, y: 236, vboxTop: 84 };

export const toScreen = (sx: number, sy: number) => ({
  x: ORIGIN.x + sx * SCALE,
  y: ORIGIN.y + (sy - ORIGIN.vboxTop) * SCALE,
});
