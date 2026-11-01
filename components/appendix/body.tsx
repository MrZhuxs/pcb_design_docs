import type { ReactElement, ReactNode } from 'react';
import styles from './symbols.module.css';
import { FigureShell } from '../pcb/pcb-figures';

/**
 * 附录 · 元件本体图集（丝印、极性、pin1）与封装尺寸直觉。
 *
 * 和符号图集的区别：这些画的是**实物俯视/侧视**，不是图纸符号。
 * - 本体用实物的浅色底 + 深色标记，标记画成实物上看得见的那一条（色带、横杠、缺口、圆点）；
 * - 尺寸按比例画（PackageScale 用 45 px/mm），文字仍走语义色。
 */

const INK = 'var(--pcb-ink)';
const BG = 'var(--color-fd-background)';

/** 本体描边：比符号线细一点，贴近实物轮廓 */
function Body({ children }: { children: ReactNode }) {
  return (
    <g fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </g>
  );
}

/** 实物上的"标记"（色带、横杠）：不是轮廓，用半透明实色压在体上 */
const MARK = 'color-mix(in oklab, var(--pcb-ink) 55%, transparent)';
/** 引线/引脚 */
const LEAD = 'color-mix(in oklab, var(--pcb-ink) 70%, transparent)';

export type MarkingId = 'R103' | 'C104' | 'TANT' | 'ELEC' | 'DIODE' | 'LED' | 'IC';

export const MARKING_NAMES: Record<MarkingId, string> = {
  R103: '贴片电阻（本体印 103）',
  C104: '瓷片电容（本体印 104）',
  TANT: '钽电容（横杠端为正极）',
  ELEC: '铝电解电容（色带端为负极）',
  DIODE: '二极管（色带端为阴极）',
  LED: '贴片 LED（缺角端为阴极）',
  IC: '集成电路（圆点/缺口定 pin1）',
};

const GLYPHS: Record<MarkingId, () => ReactElement> = {
  /* 三位数印在陶瓷体中央，两端是焊端 */
  R103: () => (
    <g>
      <Body>
        <rect x={26} y={18} width={68} height={28} rx={3} fill={BG} />
        <line x1={44} y1={18} x2={44} y2={46} stroke={MARK} strokeWidth={1.2} />
        <line x1={76} y1={18} x2={76} y2={46} stroke={MARK} strokeWidth={1.2} />
      </Body>
      <text x={60} y={37} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10.5 }}>
        103
      </text>
    </g>
  ),

  /* 瓷片电容是径向引线，值印在涂装面上 */
  C104: () => (
    <g>
      <Body>
        <ellipse cx={60} cy={26} rx={19} ry={15} fill={BG} />
        <line x1={52} y1={40} x2={52} y2={62} stroke={LEAD} strokeWidth={1.8} />
        <line x1={68} y1={40} x2={68} y2={62} stroke={LEAD} strokeWidth={1.8} />
      </Body>
      <text x={60} y={30} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
        104
      </text>
    </g>
  ),

  /* 钽电容：一端有一条粗横杠 —— 那是正极，和电解正好相反 */
  TANT: () => (
    <g>
      <Body>
        <rect x={30} y={16} width={60} height={32} rx={3} fill={BG} />
        <line x1={40} y1={16} x2={40} y2={48} stroke={MARK} strokeWidth={4} />
        <line x1={0} y1={32} x2={30} y2={32} stroke={LEAD} strokeWidth={1.8} />
        <line x1={90} y1={32} x2={120} y2={32} stroke={LEAD} strokeWidth={1.8} />
      </Body>
      <text x={22} y={16} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 11 }}>
        +
      </text>
    </g>
  ),

  /* 铝电解：圆柱侧面一条宽带标记负极，另一端是正极 */
  ELEC: () => (
    <g>
      <Body>
        <rect x={34} y={14} width={62} height={36} rx={6} fill={BG} />
        <line x1={84} y1={14} x2={84} y2={50} stroke={MARK} strokeWidth={6} />
        <line x1={0} y1={32} x2={34} y2={32} stroke={LEAD} strokeWidth={1.8} />
        <line x1={96} y1={32} x2={120} y2={32} stroke={LEAD} strokeWidth={1.8} />
      </Body>
      <text x={84} y={11} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 11 }}>
        −
      </text>
    </g>
  ),

  /* 二极管：本体一端的色带 = 阴极 */
  DIODE: () => (
    <g>
      <Body>
        <rect x={36} y={20} width={48} height={24} rx={2} fill={BG} />
        <rect x={36} y={20} width={10} height={24} fill={MARK} stroke="none" />
        <line x1={0} y1={32} x2={36} y2={32} stroke={LEAD} strokeWidth={1.8} />
        <line x1={84} y1={32} x2={120} y2={32} stroke={LEAD} strokeWidth={1.8} />
      </Body>
    </g>
  ),

  /* 贴片 LED：本体一角斜切，斜切那端是阴极 */
  LED: () => (
    <g>
      <Body>
        <path d="M30 18 H82 L90 26 V46 H30 Z" fill={BG} />
        <line x1={44} y1={18} x2={44} y2={46} stroke={MARK} strokeWidth={1.2} />
        <line x1={76} y1={26} x2={76} y2={46} stroke={MARK} strokeWidth={1.2} />
        <circle cx={82} cy={40} r={2} fill={MARK} stroke="none" />
      </Body>
    </g>
  ),

  /* SOIC：左端缺口 + 一个圆点，都是 pin1 的位置 */
  IC: () => (
    <g>
      <Body>
        <rect x={34} y={14} width={52} height={36} rx={2} fill={BG} />
        <path d="M34 24 A7 7 0 0 1 34 40" />
        {[20, 28, 36, 44].map((y) => (
          <g key={`p-${y}`} stroke={LEAD} strokeWidth={1.8}>
            <line x1={22} y1={y} x2={34} y2={y} />
            <line x1={86} y1={y} x2={98} y2={y} />
          </g>
        ))}
        <circle cx={43} cy={20} r={2.2} fill={INK} stroke="none" />
      </Body>
    </g>
  ),
};

/** 单张本体图 */
export function MarkingGlyph({ id }: { id: MarkingId }) {
  const Glyph = GLYPHS[id];
  return (
    <svg viewBox="0 0 120 64" role="img" aria-label={`元件本体标记：${MARKING_NAMES[id]}`} className={styles.glyphSvg}>
      <Glyph />
    </svg>
  );
}

/* =========================================================================
 * 1. 本体图集：一格一件
 * ========================================================================= */

export function MarkingAtlas({
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

export function MarkingCard({
  id,
  code,
  name,
  hint,
}: {
  id: MarkingId;
  code: string;
  name: string;
  hint?: string;
}) {
  return (
    <figure className={styles.sym}>
      <div className={styles.glyph}>
        <MarkingGlyph id={id} />
      </div>
      <div className={styles.symHead}>
        <span className={styles.symCode}>{code}</span>
        <span className={styles.symName}>{name}</span>
      </div>
      {hint && <p className={styles.symHint}>{hint}</p>}
    </figure>
  );
}

/* =========================================================================
 * 2. 封装尺寸直觉：按 45 px / mm 等比画
 * ========================================================================= */

const PX_PER_MM = 45;

const PKGS = [
  { name: '0402', w: 0.4, h: 0.2, metric: '1005' },
  { name: '0603', w: 1.6, h: 0.8, metric: '1608' },
  { name: '0805', w: 2.0, h: 1.25, metric: '2012' },
  { name: '1206', w: 3.2, h: 1.6, metric: '3216' },
  { name: 'SOT-23', w: 2.9, h: 1.3, metric: '—' },
  { name: 'SOD-123', w: 2.7, h: 1.6, metric: '—' },
];

export function PackageScale({ no = '附录 · 10' }: { no?: string }) {
  // 每个器件占一个最小宽度相同的格子：本体仍等比，标签因此不会互相压住
  const SLOT = 96;
  const GAP = 10;
  const TOP = 30;
  const CY = TOP + 32;
  let cursor = 18;
  const items = PKGS.map((p) => {
    const w = p.w * PX_PER_MM;
    const h = p.h * PX_PER_MM;
    const slot = Math.max(w, SLOT);
    const x = cursor + (slot - w) / 2;
    const cx = cursor + slot / 2;
    cursor += slot + GAP;
    return { ...p, x, w, h, cx, label: `${p.w} × ${p.h} mm` };
  });
  const width = Math.ceil(cursor + 10);

  return (
    <FigureShell
      no={no}
      title="封装尺寸直觉：把 mm 换成眼睛能比较的大小"
      meta="画法 · 45 px = 1 mm"
      plain
      caption="按比例画出来之后，0402 就不再是「比 0603 小一点」，而是面积只有它的十分之一——手焊难度、丝印空间、能不能放得下 100 nF 的耐压，全部由此决定。"
      note="公制代号（1005/1608/2012/3216）就是尺寸本身：1005 = 1.0 mm × 0.5 mm 的焊盘占位。买料时说「0603」，查封装图时说「1608」，是同一件东西。"
    >
      <div className={styles.anatomyArt}>
        <svg viewBox={`0 0 ${width} 172`} role="img" aria-labelledby="pkg-title">
          <title id="pkg-title">
            封装尺寸对比：0402、0603、0805、1206、SOT-23、SOD-123 按 45 像素每毫米等比绘制
          </title>

          {items.map((p) => (
            <g key={p.name}>
              <rect
                x={p.x}
                y={CY - p.h / 2}
                width={p.w}
                height={p.h}
                rx={Math.min(3, p.w / 6)}
                fill="color-mix(in oklab, var(--pcb-ink) 8%, transparent)"
                stroke={INK}
                strokeWidth={1.2}
              />
              <text
                x={p.cx}
                y={CY + 44}
                textAnchor="middle"
                className={styles.glyphText}
                style={{ fontSize: 11, fontWeight: 600 }}
              >
                {p.name}
              </text>
              <text
                x={p.cx}
                y={CY + 58}
                textAnchor="middle"
                className={styles.glyphText}
                style={{ fontSize: 9.5, opacity: 0.72 }}
              >
                {p.label}
              </text>
              <text
                x={p.cx}
                y={CY + 71}
                textAnchor="middle"
                className={styles.glyphText}
                style={{ fontSize: 9, opacity: 0.55 }}
              >
                {p.metric}
              </text>
            </g>
          ))}

          {/* 1 mm 比例尺 */}
          <g stroke={INK} strokeWidth={1.2} fill="none" opacity={0.8}>
            <line x1={18} y1={16} x2={18 + PX_PER_MM} y2={16} />
            <line x1={18} y1={12} x2={18} y2={20} />
            <line x1={18 + PX_PER_MM} y1={12} x2={18 + PX_PER_MM} y2={20} />
          </g>
          <text
            x={18 + PX_PER_MM + 6}
            y={20}
            className={styles.glyphText}
            style={{ fontSize: 9.5, opacity: 0.72 }}
          >
            1 mm
          </text>
        </svg>
      </div>
    </FigureShell>
  );
}
