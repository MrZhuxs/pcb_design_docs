import type { ReactElement, ReactNode } from 'react';
import styles from './symbols.module.css';
import { Badge, FigureShell } from '../pcb/pcb-figures';

/**
 * 附录 · 元件符号图集与读图训练。
 *
 * 画法约定（与 pcb/sop-figures.tsx 的 SchematicExcerpt 一致）：
 * - 元件线 stroke="var(--pcb-ink)"，走线 stroke="var(--pcb-wire)"；
 * - 符号内部 fill 用 --color-fd-background，压住底下的网格与走线；
 * - 文字交给 HTML，SVG 里只留位号（R1）、参数（1 kΩ）、编号徽标这类短代号。
 */

const INK = 'var(--pcb-ink)';
const WIRE = 'var(--pcb-wire)';
const BG = 'var(--color-fd-background)';

/** 符号笔画：统一线宽与圆头，缩到卡片尺寸也不糊 */
function G({ children }: { children: ReactNode }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  );
}

/** 一条带箭头的短线：电位器的滑动箭头、LED 的出射光都用它 */
function Arrow({ x1, y1, x2, y2, head = 5 }: { x1: number; y1: number; x2: number; y2: number; head?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang: number) =>
    `${(x2 - head * Math.cos(a + ang)).toFixed(1)},${(y2 - head * Math.sin(a + ang)).toFixed(1)}`;
  return (
    <g fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline points={`${p(0.5)} ${x2},${y2} ${p(-0.5)}`} />
    </g>
  );
}

/* =========================================================================
 * 1. 符号全集：一个 id 一张图（120 × 64 的固定画框，两端留引脚位）
 * ========================================================================= */

export type SymbolId =
  // 无源 / 被动
  | 'R'
  | 'R_ANSI'
  | 'RV'
  | 'RV_ANSI'
  | 'RT'
  | 'RT_ANSI'
  | 'FB'
  | 'C'
  | 'CP'
  | 'L'
  | 'F'
  // 半导体与有源
  | 'D'
  | 'LED'
  | 'ZD'
  | 'TVS'
  | 'Q'
  | 'M'
  | 'U'
  | 'Y'
  | 'XO'
  // 开关、机电与连接
  | 'SW'
  | 'SB'
  | 'K'
  | 'BZ'
  | 'BT'
  | 'J'
  | 'TP'
  | 'ANT'
  // 电源、地与标识
  | 'VCC'
  | 'GND'
  | 'CHASSIS'
  | 'NETLABEL'
  | 'BUS'
  | 'JUNCTION'
  | 'CROSS'
  | 'NC';

export const SYMBOL_NAMES: Record<SymbolId, string> = {
  R: '电阻',
  R_ANSI: '电阻（美标锯齿）',
  RV: '电位器 / 可变电阻',
  RV_ANSI: '电位器（美标锯齿）',
  RT: '热敏电阻',
  RT_ANSI: '热敏电阻（美标锯齿）',
  FB: '磁珠',
  C: '无极性电容',
  CP: '极性电容（电解 / 钽）',
  L: '电感',
  F: '熔断器（保险丝）',
  D: '二极管',
  LED: '发光二极管',
  ZD: '稳压（齐纳）二极管',
  TVS: '瞬态抑制二极管',
  Q: '三极管（NPN）',
  M: 'MOSFET（N 沟道）',
  U: '集成电路',
  Y: '晶体（无源，2 脚）',
  XO: '有源晶振（4 脚）',
  SW: '开关',
  SB: '按钮',
  K: '继电器',
  BZ: '蜂鸣器',
  BT: '电池',
  J: '连接器 / 排针',
  TP: '测试点',
  ANT: '天线',
  VCC: '正电源',
  GND: '信号地',
  CHASSIS: '机壳地',
  NETLABEL: '网络标签',
  BUS: '总线',
  JUNCTION: '电气连接点',
  CROSS: '交叉不相连',
  NC: '悬空（不连接）',
};

const GLYPHS: Record<SymbolId, () => ReactElement> = {
  /* ---- 无源 / 被动 ---- */
  R: () => (
    <G>
      <line x1={0} y1={32} x2={40} y2={32} />
      <rect x={40} y={16} width={40} height={32} fill={BG} />
      <line x1={80} y1={32} x2={120} y2={32} />
    </G>
  ),
  R_ANSI: () => (
    <G>
      <polyline points="0,32 36,32 42,16 50,48 58,16 66,48 74,16 80,32 120,32" />
    </G>
  ),
  RV: () => (
    <G>
      <line x1={0} y1={32} x2={40} y2={32} />
      <rect x={40} y={16} width={40} height={32} fill={BG} />
      <line x1={80} y1={32} x2={120} y2={32} />
      <Arrow x1={60} y1={2} x2={60} y2={20} head={5} />
    </G>
  ),
  RV_ANSI: () => (
    <G>
      <polyline points="0,32 34,32 40,16 48,48 56,16 64,48 72,16 78,32 120,32" />
      <Arrow x1={56} y1={2} x2={56} y2={20} head={5} />
    </G>
  ),
  RT: () => (
    <G>
      <line x1={0} y1={32} x2={40} y2={32} />
      <rect x={40} y={16} width={40} height={32} fill={BG} />
      <line x1={80} y1={32} x2={120} y2={32} />
      <line x1={40} y1={46} x2={80} y2={18} strokeWidth={1.6} />
      <text x={88} y={24} textAnchor="middle" className={styles.glyphText} stroke="none" fill={INK}>
        θ
      </text>
    </G>
  ),
  RT_ANSI: () => (
    <G>
      <polyline points="0,32 34,32 40,16 48,48 56,16 64,48 72,16 78,32 120,32" />
      <line x1={36} y1={46} x2={82} y2={18} strokeWidth={1.6} />
    </G>
  ),
  FB: () => (
    <G>
      <line x1={0} y1={32} x2={120} y2={32} />
      <rect x={40} y={16} width={40} height={32} fill={BG} />
      <line x1={44} y1={44} x2={76} y2={20} strokeWidth={1.6} />
    </G>
  ),
  C: () => (
    <G>
      <line x1={0} y1={32} x2={52} y2={32} />
      <line x1={52} y1={14} x2={52} y2={50} />
      <line x1={68} y1={14} x2={68} y2={50} />
      <line x1={68} y1={32} x2={120} y2={32} />
    </G>
  ),
  CP: () => (
    <G>
      <line x1={0} y1={32} x2={52} y2={32} />
      <line x1={52} y1={14} x2={52} y2={50} />
      <path d="M68 14 A20 20 0 0 1 68 50" />
      <line x1={68} y1={32} x2={120} y2={32} />
      <line x1={38} y1={18} x2={46} y2={18} strokeWidth={1.6} />
      <line x1={42} y1={14} x2={42} y2={22} strokeWidth={1.6} />
    </G>
  ),
  L: () => (
    <G>
      <line x1={0} y1={32} x2={40} y2={32} />
      <path d="M40 32 A5 5 0 0 1 50 32 A5 5 0 0 1 60 32 A5 5 0 0 1 70 32 A5 5 0 0 1 80 32" />
      <line x1={80} y1={32} x2={120} y2={32} />
    </G>
  ),
  F: () => (
    <G>
      <line x1={0} y1={32} x2={120} y2={32} />
      <rect x={44} y={20} width={32} height={24} fill={BG} />
    </G>
  ),

  /* ---- 半导体与有源 ---- */
  D: () => (
    <G>
      <line x1={0} y1={32} x2={42} y2={32} />
      <path d="M42 12 L42 52 L72 32 Z" fill={BG} />
      <line x1={72} y1={12} x2={72} y2={52} strokeWidth={2.2} />
      <line x1={72} y1={32} x2={120} y2={32} />
    </G>
  ),
  LED: () => (
    <G>
      <line x1={0} y1={32} x2={42} y2={32} />
      <path d="M42 12 L42 52 L72 32 Z" fill={BG} />
      <line x1={72} y1={12} x2={72} y2={52} strokeWidth={2.2} />
      <line x1={72} y1={32} x2={120} y2={32} />
      <Arrow x1={78} y1={22} x2={92} y2={8} head={4.5} />
      <Arrow x1={86} y1={32} x2={100} y2={18} head={4.5} />
    </G>
  ),
  ZD: () => (
    <G>
      <line x1={0} y1={32} x2={38} y2={32} />
      <path d="M38 12 L38 52 L68 32 Z" fill={BG} />
      <line x1={68} y1={12} x2={68} y2={52} strokeWidth={2.2} />
      <line x1={68} y1={12} x2={76} y2={12} strokeWidth={2.2} />
      <line x1={60} y1={52} x2={68} y2={52} strokeWidth={2.2} />
      <line x1={68} y1={32} x2={120} y2={32} />
    </G>
  ),
  TVS: () => (
    <G>
      <line x1={0} y1={32} x2={40} y2={32} />
      <path d="M40 12 L40 52 L62 32 Z" fill={BG} />
      <line x1={62} y1={12} x2={62} y2={52} strokeWidth={2.2} />
      <line x1={62} y1={12} x2={70} y2={12} strokeWidth={2.2} />
      <line x1={54} y1={52} x2={62} y2={52} strokeWidth={2.2} />
      <path d="M84 12 L84 52 L62 32 Z" fill={BG} />
      <line x1={84} y1={32} x2={120} y2={32} />
    </G>
  ),
  Q: () => (
    <G>
      <line x1={0} y1={32} x2={44} y2={32} />
      <line x1={44} y1={14} x2={44} y2={50} strokeWidth={2.4} />
      <polyline points="44,24 68,12 100,12" />
      <polyline points="44,40 68,52 100,52" />
      <Arrow x1={50} y1={41} x2={66} y2={51} head={4.5} />
    </G>
  ),
  M: () => (
    <G>
      <line x1={0} y1={32} x2={30} y2={32} />
      <line x1={30} y1={14} x2={30} y2={50} strokeWidth={2.4} />
      <line x1={40} y1={8} x2={40} y2={20} />
      <line x1={40} y1={26} x2={40} y2={38} />
      <line x1={40} y1={44} x2={40} y2={56} />
      <polyline points="40,14 80,14 80,0" />
      <polyline points="40,50 80,50 80,64" />
      <polyline points="40,32 64,32 64,50" />
      <Arrow x1={60} y1={32} x2={46} y2={32} head={4.5} />
    </G>
  ),
  U: () => (
    <G>
      <rect x={32} y={12} width={56} height={40} rx={2} fill={BG} />
      <line x1={0} y1={24} x2={32} y2={24} />
      <line x1={0} y1={44} x2={32} y2={44} />
      <line x1={88} y1={24} x2={120} y2={24} />
      <line x1={88} y1={44} x2={120} y2={44} />
      <circle cx={40} cy={20} r={2.4} fill={INK} stroke="none" />
    </G>
  ),
  Y: () => (
    <G>
      <line x1={0} y1={32} x2={44} y2={32} />
      <line x1={44} y1={12} x2={44} y2={52} />
      <line x1={76} y1={12} x2={76} y2={52} />
      <rect x={50} y={10} width={20} height={44} fill={BG} />
      <line x1={76} y1={32} x2={120} y2={32} />
    </G>
  ),
  XO: () => (
    <G>
      <rect x={30} y={8} width={60} height={48} rx={2} fill={BG} />
      <line x1={0} y1={20} x2={30} y2={20} />
      <line x1={0} y1={44} x2={30} y2={44} />
      <line x1={90} y1={32} x2={120} y2={32} />
      <line x1={60} y1={0} x2={60} y2={8} />
      <polyline points="38,32 46,32 46,22 54,22 54,42 62,42 62,32 72,32" strokeWidth={1.6} />
      <circle cx={36} cy={14} r={2.2} fill={INK} stroke="none" />
    </G>
  ),

  /* ---- 开关、机电与连接 ---- */
  SW: () => (
    <G>
      <line x1={0} y1={32} x2={44} y2={32} />
      <line x1={72} y1={32} x2={120} y2={32} />
      <circle cx={44} cy={32} r={2.6} fill={INK} stroke="none" />
      <circle cx={72} cy={32} r={2.6} fill={INK} stroke="none" />
      <line x1={46} y1={30} x2={70} y2={14} />
    </G>
  ),
  SB: () => (
    <G>
      <line x1={0} y1={32} x2={44} y2={32} />
      <line x1={72} y1={32} x2={120} y2={32} />
      <circle cx={44} cy={32} r={2.6} fill={INK} stroke="none" />
      <circle cx={72} cy={32} r={2.6} fill={INK} stroke="none" />
      <line x1={46} y1={30} x2={70} y2={18} />
      <line x1={60} y1={4} x2={60} y2={14} />
      <line x1={48} y1={4} x2={72} y2={4} />
    </G>
  ),
  K: () => (
    <G>
      <line x1={0} y1={24} x2={16} y2={24} />
      <line x1={0} y1={42} x2={16} y2={42} />
      <rect x={16} y={18} width={26} height={28} fill={BG} />
      <line x1={44} y1={32} x2={54} y2={32} strokeWidth={1.4} strokeDasharray="3 3" />
      <circle cx={58} cy={32} r={2.6} fill={INK} stroke="none" />
      <line x1={58} y1={32} x2={120} y2={32} />
      <line x1={60} y1={30} x2={88} y2={14} />
      <circle cx={88} cy={14} r={2.6} fill={INK} stroke="none" />
      <line x1={88} y1={14} x2={120} y2={14} />
    </G>
  ),
  BZ: () => (
    <G>
      <path d="M28 12 A20 20 0 0 1 28 52 Z" fill={BG} />
      <line x1={0} y1={22} x2={28} y2={22} />
      <line x1={0} y1={42} x2={28} y2={42} />
      <path d="M56 22 A13 13 0 0 1 56 42" strokeWidth={1.6} />
      <path d="M64 14 A22 22 0 0 1 64 50" strokeWidth={1.6} />
    </G>
  ),
  BT: () => (
    <G>
      <line x1={0} y1={32} x2={44} y2={32} />
      <line x1={44} y1={14} x2={44} y2={50} />
      <line x1={56} y1={22} x2={56} y2={42} strokeWidth={2.6} />
      <line x1={56} y1={32} x2={120} y2={32} />
      <line x1={36} y1={16} x2={36} y2={24} strokeWidth={1.6} />
      <line x1={32} y1={20} x2={40} y2={20} strokeWidth={1.6} />
    </G>
  ),
  J: () => (
    <G>
      <rect x={44} y={14} width={26} height={36} rx={2} fill={BG} />
      <line x1={0} y1={24} x2={44} y2={24} />
      <line x1={0} y1={40} x2={44} y2={40} />
      <circle cx={54} cy={24} r={2.2} fill={INK} stroke="none" />
      <circle cx={54} cy={40} r={2.2} fill={INK} stroke="none" />
    </G>
  ),
  TP: () => (
    <G>
      <line x1={0} y1={32} x2={50} y2={32} />
      <circle cx={62} cy={32} r={10} fill={BG} />
      <line x1={57} y1={27} x2={67} y2={37} strokeWidth={1.6} />
      <line x1={67} y1={27} x2={57} y2={37} strokeWidth={1.6} />
    </G>
  ),
  ANT: () => (
    <G>
      <line x1={60} y1={64} x2={60} y2={24} />
      <line x1={30} y1={24} x2={90} y2={24} />
    </G>
  ),

  /* ---- 电源、地与标识 ---- */
  VCC: () => (
    <G>
      <line x1={60} y1={50} x2={60} y2={24} />
      <line x1={42} y1={24} x2={78} y2={24} />
    </G>
  ),
  GND: () => (
    <G>
      <line x1={60} y1={10} x2={60} y2={28} />
      <line x1={42} y1={28} x2={78} y2={28} />
      <line x1={48} y1={36} x2={72} y2={36} />
      <line x1={54} y1={44} x2={66} y2={44} />
    </G>
  ),
  CHASSIS: () => (
    <G>
      <line x1={60} y1={10} x2={60} y2={26} />
      <line x1={40} y1={26} x2={80} y2={26} />
      <line x1={44} y1={26} x2={36} y2={40} strokeWidth={1.6} />
      <line x1={54} y1={26} x2={46} y2={40} strokeWidth={1.6} />
      <line x1={64} y1={26} x2={56} y2={40} strokeWidth={1.6} />
      <line x1={74} y1={26} x2={66} y2={40} strokeWidth={1.6} />
    </G>
  ),
  NETLABEL: () => (
    <G>
      <line x1={0} y1={32} x2={28} y2={32} />
      <path
        d="M28 22 H84 L96 32 L84 42 H28 Z"
        fill="color-mix(in oklab, var(--pcb-copper) 24%, transparent)"
      />
    </G>
  ),
  BUS: () => (
    <G>
      <line x1={0} y1={32} x2={120} y2={32} strokeWidth={5} />
      <line x1={56} y1={20} x2={64} y2={44} strokeWidth={1.6} />
    </G>
  ),
  JUNCTION: () => (
    <G>
      <line x1={0} y1={32} x2={120} y2={32} />
      <line x1={60} y1={0} x2={60} y2={64} />
      <circle cx={60} cy={32} r={5} fill={INK} stroke="none" />
    </G>
  ),
  CROSS: () => (
    <G>
      <line x1={0} y1={32} x2={120} y2={32} />
      <line x1={60} y1={0} x2={60} y2={64} />
    </G>
  ),
  NC: () => (
    <G>
      <line x1={48} y1={20} x2={72} y2={44} />
      <line x1={72} y1={20} x2={48} y2={44} />
    </G>
  ),
};

/** 单张符号图（卡片、对照表、图例里都用它） */
export function SymbolGlyph({ id }: { id: SymbolId }) {
  const Glyph = GLYPHS[id];
  return (
    <svg viewBox="0 0 120 64" role="img" aria-label={`原理图符号：${SYMBOL_NAMES[id]}`} className={styles.glyphSvg}>
      <Glyph />
    </svg>
  );
}

/* =========================================================================
 * 2. 图集：一符号一格
 * ========================================================================= */

export function SymbolAtlas({
  no,
  title,
  meta,
  caption,
  note,
  children,
}: {
  no: string;
  title: string;
  meta: string;
  caption?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <FigureShell no={no} title={title} meta={meta} plain caption={caption} note={note}>
      <div className={styles.atlas}>{children}</div>
    </FigureShell>
  );
}

export function SymbolCard({
  id,
  code,
  name,
  hint,
}: {
  id: SymbolId;
  code: string;
  name: string;
  hint?: string;
}) {
  return (
    <figure className={styles.sym}>
      <div className={styles.glyph}>
        <SymbolGlyph id={id} />
      </div>
      <div className={styles.symHead}>
        <span className={styles.symCode}>{code}</span>
        <span className={styles.symName}>{name}</span>
      </div>
      {hint ? <p className={styles.symHint}>{hint}</p> : null}
    </figure>
  );
}

/* =========================================================================
 * 3. 符号解剖：栅格、引脚长度与标注位置
 * ========================================================================= */

export function SymbolAnatomy({ no = '附录 · 02' }: { no?: string }) {
  // 100 mil 栅格 = 50 图纸单位
  const grid = [80, 130, 180, 230, 280, 330, 380, 430];
  const gridY = [60, 110, 160, 210, 260];
  const pinL = 180;
  const pinR = 380;
  const bodyL = 230;
  const bodyR = 330;

  return (
    <FigureShell
      no={no}
      title="一个符号是怎么画出来的：栅格、引脚与标注位置"
      meta="画法 · 100 mil 栅格"
      plain
      caption="符号本身不标注任何尺寸——但它是在栅格上画出来的。引脚长度、本体大小、引脚间距都取 100 mil 的整数倍，这样同一个符号放进任何原理图，引脚都能落在栅格交点上，连线才不会歪。"
      note="不同 EDA 的具体比例略有差别（有的本体按 200 mil、有的按 300 mil），但只要守住「引脚端点落在栅格上」这一条，符号之间就能互换、连线就能对得整齐。"
    >
      <div className={styles.anatomy}>
        <div className={styles.anatomyArt}>
          <svg viewBox="0 0 560 300" role="img" aria-labelledby="sym-anatomy-title">
            <title id="sym-anatomy-title">
              电阻符号的画法：引脚端点落在 100 mil 栅格上，本体为 200 mil × 80 mil，引脚间距 400 mil，
              位号标注在本体上方、参数在下方
            </title>

            {/* 栅格 */}
            <g stroke="var(--pcb-grid)" strokeWidth={1}>
              {grid.map((x) => (
                <line key={`gx-${x}`} x1={x} y1={44} x2={x} y2={272} />
              ))}
              {gridY.map((y) => (
                <line key={`gy-${y}`} x1={64} y1={y} x2={448} y2={y} />
              ))}
            </g>

            {/* 符号本体 + 引脚 */}
            <g fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round">
              <line x1={pinL} y1={150} x2={bodyL} y2={150} />
              <line x1={bodyR} y1={150} x2={pinR} y2={150} />
              <rect x={bodyL} y={130} width={bodyR - bodyL} height={40} fill={BG} />
            </g>
            {/* 引脚端点：两个小圆点，强调「连接发生在这里」 */}
            <g fill="var(--pcb-copper)" stroke="none">
              <circle cx={pinL} cy={150} r={3.4} />
              <circle cx={pinR} cy={150} r={3.4} />
            </g>

            {/* 位号与参数（居中、不压线） */}
            <text x={280} y={122} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 13, fontWeight: 600 }}>
              R1
            </text>
            <text x={280} y={188} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 12 }}>
              10 kΩ
            </text>
            {/* 引脚号 */}
            <text x={206} y={140} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
              1
            </text>
            <text x={354} y={140} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
              2
            </text>

            {/* 尺寸线：本体宽 200 mil */}
            <g stroke="var(--pcb-ink-dim)" strokeWidth={1}>
              <line x1={bodyL} y1={104} x2={bodyL} y2={112} />
              <line x1={bodyR} y1={104} x2={bodyR} y2={112} />
              <line x1={bodyL} y1={108} x2={bodyR} y2={108} />
            </g>
            <text x={280} y={100} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
              200 mil
            </text>

            {/* 尺寸线：引脚间距 400 mil */}
            <g stroke="var(--pcb-ink-dim)" strokeWidth={1}>
              <line x1={pinL} y1={158} x2={pinL} y2={214} />
              <line x1={pinR} y1={158} x2={pinR} y2={214} />
              <line x1={pinL} y1={206} x2={pinR} y2={206} />
              <line x1={pinL} y1={202} x2={pinL} y2={210} />
              <line x1={pinR} y1={202} x2={pinR} y2={210} />
            </g>
            <text x={280} y={224} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
              400 mil（引脚间距）
            </text>

            {/* 尺寸线：本体高 80 mil */}
            <g stroke="var(--pcb-ink-dim)" strokeWidth={1}>
              <line x1={150} y1={130} x2={158} y2={130} />
              <line x1={150} y1={170} x2={158} y2={170} />
              <line x1={154} y1={130} x2={154} y2={170} />
            </g>
            <text x={140} y={154} textAnchor="end" className={styles.glyphText} style={{ fontSize: 10 }}>
              80 mil
            </text>

            {/* 栅格说明 */}
            <text x={64} y={284} className={styles.glyphText} style={{ fontSize: 10, opacity: 0.75 }}>
              淡线 = 100 mil 栅格
            </text>
          </svg>
        </div>

        <ol className={styles.points}>
          <li>
            <b>引脚端点必须落在栅格上</b>：图里两个铜色小点就是连接点，所有连线只会接到这里。
          </li>
          <li>
            <b>本体只表达功能</b>：矩形画多大与实物多大毫无关系，真正的尺寸在封装里。
          </li>
          <li>
            <b>位号在上、参数在下</b>（也可都放上方），居中对齐本体、不压住引脚线，全图统一一种摆法。
          </li>
          <li>
            <b>引脚号 1 / 2 表示方向</b>：极性件、二极管、连接器必须靠它对齐封装，画反了就是反向装。
          </li>
          <li>
            <b>一个符号 = 一个器件</b>；双运放、四与门这类多单元器件写成 U1A / U1B，位号主体仍是 U1。
          </li>
        </ol>
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 4. 国标（IEC）与美标（ANSI）两套画法
 * ========================================================================= */

export function SymbolStandards({ no = '附录 · 03' }: { no?: string }) {
  const rows: { name: string; gb: SymbolId; us: SymbolId; note: string }[] = [
    {
      name: '电阻',
      gb: 'R',
      us: 'R_ANSI',
      note: '同一种器件、同一个电气意义。国标（等同采用 IEC）是矩形，美标是锯齿。',
    },
    {
      name: '电位器',
      gb: 'RV',
      us: 'RV_ANSI',
      note: '本体跟着电阻走，滑动端都是那道带箭头的斜线——箭头指哪儿，哪儿就是动触点。',
    },
    {
      name: '热敏电阻',
      gb: 'RT',
      us: 'RT_ANSI',
      note: '限定符号是一条穿过本体的斜线（+ θ / t° 表示随温度变化），与本体画法无关。',
    },
  ];

  return (
    <FigureShell
      no={no}
      title="国标与美标的差别，其实只有「电阻这一族」"
      meta="标准 · GB/T 4728 vs ANSI/IEEE"
      plain
      caption="GB/T 4728 等同采用 IEC 60617，所以国标符号与欧洲、日韩图纸基本一致；美标（ANSI/IEEE 315 一系）保留锯齿画法。除此之外，二极管、三极管、电容、地符号这些两套标准画法几乎一致——真正天天绊人的差异在文字符号（位号），不在图形。"
      note="读图时的实用结论：图形只用来认功能（「这是电阻」），位号用来认器件（「这是 R 还是 RV」），网络名用来认连接（「这根线是不是 3V3」）。三者对不上，以位号和网络名为准。"
    >
      <div className={styles.std}>
        <div className={styles.stdHead}>
          <span>器件</span>
          <span>国标 / IEC</span>
          <span>美标 / ANSI</span>
          <span>差别在哪</span>
        </div>
        {rows.map((row) => (
          <div key={row.name} className={styles.stdRow}>
            <span className={styles.stdName}>{row.name}</span>
            <span className={styles.stdCell}>
              <SymbolGlyph id={row.gb} />
            </span>
            <span className={styles.stdCell}>
              <SymbolGlyph id={row.us} />
            </span>
            <span className={styles.stdNote}>{row.note}</span>
          </div>
        ))}
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 5. 读一段真的原理图：把符号、位号、参数、网络标签一次认全
 * ========================================================================= */

export function SchematicWalkthrough({ no = '附录 · 04' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="读一段真的原理图：2 针接口 + 去耦 + LED 指示"
      meta="读图 · 六个要素"
      plain
      caption="这段电路没有芯片：左边一个 2 针接口引入 3V3，一个 100 nF 电容去耦，一个 1 kΩ 电阻串 LED 做电源指示。原理图里出现的每一类东西，这张图都占齐了。"
      note="J1 的 1 脚为什么能和 C1、R1 连在一起？因为那根线叫 VCC_3V3，而 VCC_3V3 还以网络标签的形式出现在别处——同名即同网络。这就是原理图能一页页拆开画的原因。"
    >
      <div>
        <svg viewBox="0 0 780 340" role="img" aria-labelledby="walk-title">
          <title id="walk-title">
            读图示例：2 针连接器引入 VCC_3V3，经网络标签与去耦电容、限流电阻与 LED 相连，各处地符号共地，
            标注了网络标签、连接点、位号与参数、元件符号、电源地符号和引脚号
          </title>

          {/* ---- J1 连接器 ---- */}
          <g fill="none" stroke={INK} strokeWidth={1.8}>
            <rect x={64} y={56} width={36} height={104} rx={2} fill={BG} />
            <line x1={100} y1={76} x2={150} y2={76} />
            <line x1={100} y1={140} x2={124} y2={140} />
            <line x1={124} y1={140} x2={124} y2={160} />
            <circle cx={108} cy={76} r={2.2} fill={INK} stroke="none" />
            <circle cx={108} cy={140} r={2.2} fill={INK} stroke="none" />
          </g>
          <text x={82} y={46} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 12, fontWeight: 600 }}>
            J1
          </text>
          <text x={82} y={182} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10, opacity: 0.8 }}>
            2P
          </text>
          <text x={112} y={70} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 9.5 }}>
            1
          </text>
          <text x={112} y={134} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 9.5 }}>
            2
          </text>

          {/* ---- VCC_3V3 网络标签 + 电源母线 ---- */}
          <g stroke={WIRE} strokeWidth={1.8} fill="none">
            <line x1={220} y1={76} x2={450} y2={76} />
          </g>
          <path
            d="M150 66 H210 L220 76 L210 86 H150 Z"
            fill="color-mix(in oklab, var(--pcb-copper) 26%, transparent)"
            stroke={INK}
            strokeWidth={1.4}
          />
          <text x={158} y={80} className={styles.glyphText} style={{ fontSize: 10.5 }}>
            VCC_3V3
          </text>

          {/* ---- C1 去耦 ---- */}
          <g stroke={WIRE} strokeWidth={1.8} fill="none">
            <line x1={270} y1={76} x2={270} y2={120} />
            <line x1={270} y1={128} x2={270} y2={160} />
          </g>
          <g stroke={INK} strokeWidth={2} fill="none">
            <line x1={256} y1={120} x2={284} y2={120} />
            <line x1={256} y1={128} x2={284} y2={128} />
          </g>
          <text x={292} y={118} className={styles.glyphText} style={{ fontSize: 11, fontWeight: 600 }}>
            C1
          </text>
          <text x={292} y={133} className={styles.glyphText} style={{ fontSize: 10 }}>
            100 nF
          </text>

          {/* ---- R1 + D1 ---- */}
          <g stroke={WIRE} strokeWidth={1.8} fill="none">
            <line x1={450} y1={76} x2={450} y2={110} />
            <line x1={450} y1={170} x2={450} y2={200} />
            <line x1={450} y1={228} x2={450} y2={252} />
          </g>
          <rect x={436} y={110} width={28} height={60} fill={BG} stroke={INK} strokeWidth={1.8} />
          <text x={428} y={126} textAnchor="end" className={styles.glyphText} style={{ fontSize: 11, fontWeight: 600 }}>
            R1
          </text>
          <text x={428} y={142} textAnchor="end" className={styles.glyphText} style={{ fontSize: 10 }}>
            1 kΩ
          </text>
          <g>
            <path d="M436 200 L464 200 L450 228 Z" fill={BG} stroke={INK} strokeWidth={1.8} />
            <line x1={436} y1={228} x2={464} y2={228} stroke={INK} strokeWidth={2.2} />
            {/* 出射光：两条带箭头的小线 */}
            <g stroke={INK} strokeWidth={1.2} fill="none">
              <line x1={466} y1={196} x2={482} y2={180} />
              <polyline points="475,181 482,180 481,187" />
              <line x1={476} y1={208} x2={492} y2={192} />
              <polyline points="485,193 492,192 491,199" />
            </g>
          </g>
          <text x={500} y={216} className={styles.glyphText} style={{ fontSize: 11, fontWeight: 600 }}>
            D1
          </text>
          <text x={500} y={231} className={styles.glyphText} style={{ fontSize: 10 }}>
            LED 红
          </text>

          {/* ---- 三个地符号 ---- */}
          {[
            { x: 124, y: 160 },
            { x: 270, y: 160 },
            { x: 450, y: 252 },
          ].map((g) => (
            <g key={`gnd-${g.x}-${g.y}`} stroke={INK} strokeWidth={1.8} fill="none">
              <line x1={g.x} y1={g.y} x2={g.x} y2={g.y + 8} />
              <line x1={g.x - 16} y1={g.y + 8} x2={g.x + 16} y2={g.y + 8} />
              <line x1={g.x - 10} y1={g.y + 16} x2={g.x + 10} y2={g.y + 16} />
              <line x1={g.x - 4} y1={g.y + 24} x2={g.x + 4} y2={g.y + 24} />
            </g>
          ))}

          {/* ---- 连接点 ---- */}
          <g fill={INK} stroke="none">
            <circle cx={270} cy={76} r={4} />
            <circle cx={450} cy={76} r={4} />
          </g>

          {/* ---- 编号徽标 ---- */}
          <Badge x={192} y={46} n={1} />
          <Badge x={270} y={46} n={2} />
          <Badge x={400} y={158} n={3} />
          <Badge x={512} y={196} n={4} />
          <Badge x={146} y={196} n={5} />
          <Badge x={146} y={112} n={6} />
        </svg>

        <div className={styles.walk}>
          <ul className={styles.walkList}>
            <li>
              <span className={styles.walkNum} aria-hidden>
                1
              </span>
              <span>
                <b>网络标签</b>：同名即同网络，不必真拉一根线跨过整页。
              </span>
            </li>
            <li>
              <span className={styles.walkNum} aria-hidden>
                2
              </span>
              <span>
                <b>连接点</b>：只有画出实心点，两根线才算接通。
              </span>
            </li>
            <li>
              <span className={styles.walkNum} aria-hidden>
                3
              </span>
              <span>
                <b>位号 + 参数</b>：R1 / 1 kΩ，BOM 与贴片只认这两个字段。
              </span>
            </li>
            <li>
              <span className={styles.walkNum} aria-hidden>
                4
              </span>
              <span>
                <b>符号只表功能</b>：三角形只说明「这是二极管」，与实物外形无关。
              </span>
            </li>
            <li>
              <span className={styles.walkNum} aria-hidden>
                5
              </span>
              <span>
                <b>电源 / 地符号</b>：全局网络，图上所有 GND 默认连在一起。
              </span>
            </li>
            <li>
              <span className={styles.walkNum} aria-hidden>
                6
              </span>
              <span>
                <b>引脚号</b>：1 / 2 决定顺序与方向，极性和封装全靠它对齐。
              </span>
            </li>
          </ul>
        </div>
      </div>
    </FigureShell>
  );
}
