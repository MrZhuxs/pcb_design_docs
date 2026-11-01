/**
 * 《PCB 的结构与制作工艺》视频设计系统。
 *
 * 与 DcdcSchematic 共用同一套语言：Vercel（纯黑、极细线、等宽标签、收紧字距）
 * × 工业制图（工程网格、裁切角标、剖面线、标尺）。
 *
 * 本页特有的三个材质色：铜（bronze）、FR-4（带斜剖面线的深灰）、阻焊（墨绿）。
 * 它们只出现在剖面/叠层图里，界面仍然是单色 + 一个蓝色强调。
 */
import { interpolate } from 'remotion';

export const C = {
  bg: '#0A0A0A',
  panel: 'rgba(255,255,255,0.028)',
  panelLine: 'rgba(255,255,255,0.10)',
  grid: 'rgba(255,255,255,0.026)',
  gridMajor: 'rgba(255,255,255,0.05)',
  hair: '#242424',
  hairSoft: '#191919',

  ink: '#EDEDED',
  dim: '#8F8F8F',
  faint: '#5A5A5A',
  ghost: '#3F3F3F',

  blue: '#0070F3',
  blueSoft: 'rgba(0,112,243,0.12)',
  blueLine: 'rgba(0,112,243,0.55)',
  amber: '#F5A623',
  amberSoft: 'rgba(245,166,35,0.12)',
  green: '#3ECF8E',
  greenSoft: 'rgba(62,207,142,0.12)',
  red: '#FF5C5C',

  /** 材质 */
  cu: '#C08A3E',
  cuDim: 'rgba(192,138,62,0.55)',
  cuSoft: 'rgba(192,138,62,0.14)',
  fr4: '#2B2B2B',
  fr4Line: 'rgba(255,255,255,0.12)',
  mask: '#1C3A2F',
  maskLine: 'rgba(62,207,142,0.35)',
  silk: '#E8E8E8',
  hole: '#080808',
} as const;

export const SANS =
  '"Inter","Segoe UI Variable Display","Segoe UI","Microsoft YaHei",system-ui,sans-serif';
export const MONO =
  '"Geist Mono","JetBrains Mono","Cascadia Mono","Consolas","Microsoft YaHei",monospace';

export const FPS = 30;
export const W = 1920;
export const H = 1080;

export type Chapter = { no: string; label: string; from: number };

/** 帧区间 → 数值，两端夹住 */
export const F = (frame: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
/** 缓入缓出的帧区间，动画主力 */
export const FE = (frame: number, a: number, b: number, from = 0, to = 1) =>
  from + (to - from) * easeInOut((frame - a) / Math.max(1, b - a));
