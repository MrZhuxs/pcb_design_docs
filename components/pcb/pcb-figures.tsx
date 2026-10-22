import type { ReactNode } from 'react';
import styles from './pcb-figures.module.css';

/**
 * PCB 结构类插图组件。
 *
 * 布局：外层卡片（头 / 画布 / 图例 / 图注）+ 内层 SVG（只画物件）。
 * 文字尽量交给 HTML（可缩放、跟随主题），SVG 里只保留编号徽标与短代号。
 * 颜色全部来自 pcb-figures.module.css 的 --pcb-* 变量，明暗主题各有一套。
 */

type Swatch = 'substrate' | 'copper' | 'mask' | 'silk' | 'via' | 'component';

type LegendItem = {
  n?: number;
  swatch?: Swatch;
  label: string;
  hint?: string;
};

const SWATCH_STYLE: Record<Swatch, string> = {
  substrate: 'var(--pcb-substrate)',
  copper: 'var(--pcb-copper)',
  mask: 'var(--pcb-mask)',
  silk: 'var(--pcb-silk)',
  via: 'var(--pcb-via)',
  component: 'var(--pcb-component)',
};

function FigureShell({
  no,
  title,
  meta,
  legend,
  caption,
  note,
  plain,
  children,
}: {
  no: string;
  title: string;
  meta: string;
  legend?: LegendItem[];
  caption?: ReactNode;
  note?: ReactNode;
  /** true 时不铺工程网格底（用于贴渲染图） */
  plain?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={styles.figure}>
      <div className={styles.head}>
        <span className={styles.no}>{no}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={plain ? styles.canvasPlain : styles.canvas}>{children}</div>
      {legend && legend.length > 0 && (
        <ul className={styles.legend}>
          {legend.map((item, i) => (
            <li key={`${i}-${item.label}`} className={styles.item}>
              {typeof item.n === 'number' ? (
                <span className={styles.numChip} aria-hidden>
                  {item.n}
                </span>
              ) : item.swatch ? (
                <span
                  aria-hidden
                  className={styles.swatch}
                  style={{ background: SWATCH_STYLE[item.swatch] }}
                />
              ) : null}
              <span>
                <b>{item.label}</b>
                {item.hint ? ` — ${item.hint}` : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      {note && <p className={styles.note}>{note}</p>}
    </figure>
  );
}

/** SVG 内的编号徽标：与图例里的编号小方块同款 */
function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={16} height={16} rx={5} fill="var(--color-fd-foreground)" />
      <text
        x={x}
        y={y + 3.6}
        textAnchor="middle"
        className={styles.badgeText}
        fill="var(--color-fd-background)"
      >
        {n}
      </text>
    </g>
  );
}

function Leader({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--pcb-hair-strong)" strokeWidth={1} strokeDasharray="3 3" />;
}

/* =========================================================================
 * 1. 双面板剖析：工程风格 2D 剖面图
 *    —— 分层色带 + 剖面线（hatch）+ 尺寸标注 + 引线编号，比例与线宽按图纸习惯取值
 * ========================================================================= */

/* 剖面几何（单位：图纸单位，非实尺寸；实际尺寸写在标注里） */
const SEC = {
  x0: 118,
  x1: 622,
  silk: [204, 208],
  maskTop: [208, 216],
  cuTop: [216, 224],
  core: [224, 324],
  cuBot: [324, 332],
  maskBot: [332, 340],
};

const VIA1 = 250;
const VIA2 = 500;
const PAD_HALF = 16;
const BARREL_HALF = 13;
const VOID_HALF = 5;

const CHIP = { x0: 344, x1: 406, y0: 168, y1: 208 };
const PAD_A = [330, 356];
const PAD_B = [394, 420];

/** 引线：文字 → 目标点 */
function Pointer({
  from,
  to,
  label,
  sub,
  align = 'start',
}: {
  from: [number, number];
  to: [number, number];
  label: string;
  sub?: string;
  align?: 'start' | 'end';
}) {
  return (
    <g>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke="var(--pcb-hair-strong)"
        strokeWidth={1}
      />
      <circle cx={to[0]} cy={to[1]} r={2.4} fill="var(--color-fd-foreground)" />
      <text x={from[0]} y={from[1] - 6} textAnchor={align} className={styles.annoLabel}>
        {label}
      </text>
      {sub && (
        <text
          x={from[0]}
          y={from[1] + 9}
          textAnchor={align}
          className={styles.annoLabelDim}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function BoardAnatomy() {
  const { x0, x1 } = SEC;

  /** 剖面线：45° 平行线，用 pattern 填充 */
  const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
    </pattern>
  );

  return (
    <FigureShell
      no="FIG · 01"
      title="双面板剖析（2D 剖面图）"
      meta="剖面 · 2 LAYERS · 单位 mm"
      plain
      legend={[
        { n: 1, label: '介质层', hint: 'FR-4：玻纤布 + 环氧树脂，板厚 1.6 mm' },
        { n: 2, label: '通孔', hint: '孔壁镀铜，孔内是钻孔；孔径常见 0.3 mm' },
        { n: 3, label: '焊盘', hint: '阻焊开窗露铜，直径比孔径大约 0.3 mm' },
        { n: 4, label: '阻焊层', hint: '绿色防焊油墨，厚约 20–25 µm' },
        { n: 5, label: '线路', hint: '铜箔 1 oz ≈ 35 µm，蚀刻后成线路' },
        { n: 6, label: '丝印', hint: '白色油墨，印在阻焊层表面' },
      ]}
      caption="剖开后的双面板：中间是介质层，上下各一层铜箔，最外面是阻焊油墨；金属化孔的孔壁镀了铜，孔内是钻孔；元件焊在阻焊开窗露出的焊盘上。剖面线、尺寸与线宽都按制图习惯画。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-sec-title" className={styles.svg}>
        <title id="fig-sec-title">
          双面板 2D 剖面图：自上而下为丝印、阻焊层、铜箔、FR-4 介质层、铜箔、阻焊层；两个金属化孔贯穿上下，元件焊在顶层焊盘上
        </title>
        <defs>
          {hatch('sec-core', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('sec-core-2', 'var(--pcb-hatch-2)', 1, 7, -45)}
          {hatch('sec-cu', '#ffffff', 1, 5.5, 45)}
          {hatch('sec-mask', '#ffffff', 1, 7, -45)}
          {hatch('sec-chip', '#ffffff', 1, 6, 45)}
        </defs>

        {/* ---------- 介质层（FR-4） ---------- */}
        <rect x={x0} y={SEC.core[0]} width={x1 - x0} height={SEC.core[1] - SEC.core[0]} fill="var(--pcb-fr4)" />
        <rect x={x0} y={SEC.core[0]} width={x1 - x0} height={SEC.core[1] - SEC.core[0]} fill="url(#sec-core)" />
        <rect x={x0} y={SEC.core[0]} width={x1 - x0} height={SEC.core[1] - SEC.core[0]} fill="url(#sec-core-2)" />

        {/* ---------- 铜箔（上下） ---------- */}
        <rect x={x0} y={SEC.cuTop[0]} width={x1 - x0} height={SEC.cuTop[1] - SEC.cuTop[0]} fill="var(--pcb-copper)" />
        <rect x={x0} y={SEC.cuTop[0]} width={x1 - x0} height={SEC.cuTop[1] - SEC.cuTop[0]} fill="url(#sec-cu)" opacity="0.35" />
        <rect x={x0} y={SEC.cuBot[0]} width={x1 - x0} height={SEC.cuBot[1] - SEC.cuBot[0]} fill="var(--pcb-copper)" />
        <rect x={x0} y={SEC.cuBot[0]} width={x1 - x0} height={SEC.cuBot[1] - SEC.cuBot[0]} fill="url(#sec-cu)" opacity="0.35" />

        {/* ---------- 阻焊层（上下），在焊盘处开窗 ---------- */}
        {[
          { y: SEC.maskTop, holes: [VIA1, VIA2] },
          { y: SEC.maskBot, holes: [VIA1, VIA2] },
        ].map((band, bi) => {
          const segments: [number, number][] = [];
          let cursor = x0;
          const holes = [...band.holes].sort((a, b) => a - b);
          holes.forEach((h) => {
            segments.push([cursor, h - PAD_HALF]);
            cursor = h + PAD_HALF;
          });
          segments.push([cursor, x1]);
          return (
            <g key={`mask-${bi}`}>
              {segments
                .filter(([a, b]) => b - a > 1)
                .map(([a, b]) => (
                  <g key={`${bi}-${a}`}>
                    <rect x={a} y={band.y[0]} width={b - a} height={band.y[1] - band.y[0]} fill="var(--pcb-mask)" />
                    <rect
                      x={a}
                      y={band.y[0]}
                      width={b - a}
                      height={band.y[1] - band.y[0]}
                      fill="url(#sec-mask)"
                      opacity="0.22"
                    />
                  </g>
                ))}
            </g>
          );
        })}

        {/* ---------- 丝印：阻焊层表面的白色薄层 ---------- */}
        {[
          [148, 196],
          [560, 606],
        ].map(([a, b]) => (
          <rect key={`silk-${a}`} x={a} y={SEC.silk[0]} width={b - a} height={SEC.silk[1] - SEC.silk[0]} fill="var(--pcb-silk)" stroke="var(--pcb-hair)" strokeWidth={0.6} />
        ))}

        {/* ---------- 金属化孔剖面 ---------- */}
        {[VIA1, VIA2].map((via) => (
          <g key={`via-${via}`}>
            {/* 孔口焊盘（顶/底） */}
            <rect x={via - PAD_HALF} y={SEC.cuTop[0]} width={PAD_HALF * 2} height={SEC.cuTop[1] - SEC.cuTop[0]} fill="var(--pcb-copper)" />
            <rect x={via - PAD_HALF} y={SEC.cuBot[0]} width={PAD_HALF * 2} height={SEC.cuBot[1] - SEC.cuBot[0]} fill="var(--pcb-copper)" />
            {/* 孔壁：两侧镀铜 */}
            <rect x={via - BARREL_HALF} y={SEC.maskTop[0]} width={BARREL_HALF - VOID_HALF} height={SEC.maskBot[1] - SEC.maskTop[0]} fill="var(--pcb-copper)" />
            <rect x={via + VOID_HALF} y={SEC.maskTop[0]} width={BARREL_HALF - VOID_HALF} height={SEC.maskBot[1] - SEC.maskTop[0]} fill="var(--pcb-copper)" />
            {/* 孔内空腔 */}
            <rect
              x={via - VOID_HALF}
              y={SEC.maskTop[0]}
              width={VOID_HALF * 2}
              height={SEC.maskBot[1] - SEC.maskTop[0]}
              fill="var(--pcb-hole)"
              stroke="var(--pcb-hair)"
              strokeWidth={0.8}
            />
          </g>
        ))}

        {/* ---------- 元件（贴片件剖面）与焊锡 ---------- */}
        <g>
          {/* 焊锡：焊盘上的角焊缝 */}
          {/* 焊盘（已包含在铜层里，这里加焊锡块） */}
          <rect x={PAD_A[0]} y={SEC.cuTop[0] - 4} width={PAD_A[1] - PAD_A[0]} height={4} fill="var(--pcb-solder)" opacity="0.9" />
          <rect x={PAD_B[0]} y={SEC.cuTop[0] - 4} width={PAD_B[1] - PAD_B[0]} height={4} fill="var(--pcb-solder)" opacity="0.9" />
          {/* 元件本体 */}
          <rect x={CHIP.x0} y={CHIP.y0} width={CHIP.x1 - CHIP.x0} height={CHIP.y1 - CHIP.y0} fill="var(--pcb-component)" stroke="var(--pcb-hair)" strokeWidth={1} />
          <rect x={CHIP.x0} y={CHIP.y0} width={CHIP.x1 - CHIP.x0} height={CHIP.y1 - CHIP.y0} fill="url(#sec-chip)" opacity="0.18" />
          {/* 两端电极 */}
          <rect x={CHIP.x0 - 8} y={CHIP.y0 + 4} width={10} height={CHIP.y1 - CHIP.y0 - 8} fill="var(--pcb-silver)" stroke="var(--pcb-hair)" strokeWidth={0.7} />
          <rect x={CHIP.x1 - 2} y={CHIP.y0 + 4} width={10} height={CHIP.y1 - CHIP.y0 - 8} fill="var(--pcb-silver)" stroke="var(--pcb-hair)" strokeWidth={0.7} />
        </g>

        {/* ---------- 板件轮廓 ---------- */}
        <rect x={x0} y={SEC.maskTop[0]} width={x1 - x0} height={SEC.maskBot[1] - SEC.maskTop[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.6} />
        <line x1={x0} y1={SEC.cuTop[0]} x2={x1} y2={SEC.cuTop[0]} stroke="var(--pcb-ink)" strokeWidth={0.9} opacity="0.55" />
        <line x1={x0} y1={SEC.cuTop[1]} x2={x1} y2={SEC.cuTop[1]} stroke="var(--pcb-ink)" strokeWidth="0.9" opacity="0.55" />
        <line x1={x0} y1={SEC.cuBot[0]} x2={x1} y2={SEC.cuBot[0]} stroke="var(--pcb-ink)" strokeWidth={0.9} opacity="0.55" />
        <line x1={x0} y1={SEC.cuBot[1]} x2={x1} y2={SEC.cuBot[1]} stroke="var(--pcb-ink)" strokeWidth={0.9} opacity="0.55" />

/* ---------- 尺寸标注 ---------- */
        {/* 板厚 1.6 mm */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x1 + 26} y1={SEC.maskTop[0]} x2={x1 + 26} y2={SEC.maskBot[1]} />
          <line x1={x1 + 20} y1={SEC.maskTop[0]} x2={x1 + 32} y2={SEC.maskTop[0]} />
          <line x1={x1 + 20} y1={SEC.maskBot[1]} x2={x1 + 32} y2={SEC.maskBot[1]} />
          <line x1={x1 + 4} y1={SEC.maskTop[0]} x2={x1 + 20} y2={SEC.maskTop[0]} strokeDasharray="4 3" />
          <line x1={x1 + 4} y1={SEC.maskBot[1]} x2={x1 + 20} y2={SEC.maskBot[1]} strokeDasharray="4 3" />
        </g>
        <text
          x={x1 + 46}
          y={(SEC.maskTop[0] + SEC.maskBot[1]) / 2}
          className={styles.dimText}
          transform={`rotate(-90 ${x1 + 46} ${(SEC.maskTop[0] + SEC.maskBot[1]) / 2})`}
          textAnchor="middle"
        >
          1.6 mm
        </text>

        {/* 铜厚 35 µm */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x0 - 24} y1={SEC.cuTop[0]} x2={x0 - 24} y2={SEC.cuTop[1]} />
          <line x1={x0 - 30} y1={SEC.cuTop[0]} x2={x0 - 18} y2={SEC.cuTop[0]} />
          <line x1={x0 - 30} y1={SEC.cuTop[1]} x2={x0 - 18} y2={SEC.cuTop[1]} />
        </g>
        <text x={x0 - 36} y={(SEC.cuTop[0] + SEC.cuTop[1]) / 2 + 3} className={styles.dimText} textAnchor="end">
          35 µm
        </text>

        {/* 孔径 0.3 mm */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={VIA1 - VOID_HALF} y1={188} x2={VIA1 + VOID_HALF} y2={188} />
          <line x1={VIA1 - VOID_HALF} y1={183} x2={VIA1 - VOID_HALF} y2={193} />
          <line x1={VIA1 + VOID_HALF} y1={183} x2={VIA1 + VOID_HALF} y2={193} />
        </g>
        <text x={VIA1} y={176} className={styles.dimText} textAnchor="middle">
          孔径 0.3
        </text>

        {/* 焊盘 0.6 mm */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={VIA2 - PAD_HALF} y1={188} x2={VIA2 + PAD_HALF} y2={188} />
          <line x1={VIA2 - PAD_HALF} y1={183} x2={VIA2 - PAD_HALF} y2={193} />
          <line x1={VIA2 + PAD_HALF} y1={183} x2={VIA2 + PAD_HALF} y2={193} />
        </g>
        <text x={VIA2} y={176} className={styles.dimText} textAnchor="middle">
          焊盘 0.6
        </text>

        {/* ---------- 引线标注 ---------- */}
        <Pointer from={[152, 130]} to={[172, SEC.silk[1]]} label="⑥ 丝印" sub="白色油墨" align="end" />
        <Pointer from={[318, 130]} to={[318, SEC.maskTop[0] + 4]} label="④ 阻焊层" sub="防焊油墨" align="end" />
        <Pointer from={[452, 130]} to={[452, SEC.cuTop[0] + 4]} label="⑤ 线路" sub="铜箔 35 µm" align="end" />
        <Pointer from={[606, 158]} to={[VIA2 + PAD_HALF + 2, SEC.cuTop[0] + 2]} label="③ 焊盘" sub="开窗露铜" align="end" />

        <Pointer from={[128, 398]} to={[VIA1 + 10, SEC.core[0] + 26]} label="② 通孔" sub="孔壁镀铜" align="start" />
        <Pointer from={[330, 398]} to={[330, SEC.core[0] + 66]} label="① 介质层" sub="FR-4" align="start" />

        <Pointer from={[286, 204]} to={[CHIP.x0 + 6, 200]} label="元件" align="end" />
        <Pointer from={[CHIP.x1 + 14, 200]} to={[PAD_B[0] + 8, SEC.cuTop[0] - 3]} label="焊锡" align="start" />      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 2. 覆铜板（CCL）：2D 分解剖面图
 *    三块料（铜箔 / 芯板 / 铜箔）沿竖直方向分开画，中间用压合箭头，
 *    右侧是压合后的总厚尺寸
 * ========================================================================= */

const CCL2 = {
  x0: 190,
  x1: 650,
  foilTop: [128, 136],
  core: [196, 306],
  foilBot: [366, 374],
};

export function CopperCladLaminate() {
  const { x0, x1 } = CCL2;

  const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
    </pattern>
  );

  return (
    <FigureShell
      no="FIG · 02"
      title="覆铜板（铜箔层压板，CCL）"
      meta="2D 分解剖面 · 单位 mm"
      plain
      legend={[
        { n: 1, label: '铜箔', hint: '1 oz ≈ 35 µm；2 oz ≈ 70 µm' },
        { n: 2, label: '芯板（FR-4）', hint: '玻纤布浸环氧树脂后固化，决定板厚' },
        { n: 3, label: '铜箔', hint: '与上层同规格，压合后成为板的两面' },
      ]}
      caption="双面覆铜板就是这三层压合而成：上下两张铜箔，中间一块浸过环氧树脂的玻纤布芯板。压合后铜箔与树脂成为一体，板厂再按你给的板厚、铜厚下料。"
      note="多层板里，芯板与芯板之间会再加半固化片（prepreg）粘合——那是一种还没完全固化的玻纤布。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-ccl2-title" className={styles.svg}>
        <title id="fig-ccl2-title">覆铜板 2D 分解剖面图：上下两张铜箔与中间芯板（FR-4，交叉剖面线）分开展示，箭头示压合方向</title>
        <defs>
          {hatch('ccl2-core', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('ccl2-core2', 'var(--pcb-hatch-2)', 1, 7, -45)}
          {hatch('ccl2-cu', '#ffffff', 1, 5.5, 45)}
        </defs>

        {/* ---------- ① 上层铜箔 ---------- */}
        <rect x={x0} y={CCL2.foilTop[0]} width={x1 - x0} height={CCL2.foilTop[1] - CCL2.foilTop[0]} fill="var(--pcb-copper)" />
        <rect x={x0} y={CCL2.foilTop[0]} width={x1 - x0} height={CCL2.foilTop[1] - CCL2.foilTop[0]} fill="url(#ccl2-cu)" opacity="0.35" />
        <rect x={x0} y={CCL2.foilTop[0]} width={x1 - x0} height={CCL2.foilTop[1] - CCL2.foilTop[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* ---------- ② 芯板 ---------- */}
        <rect x={x0} y={CCL2.core[0]} width={x1 - x0} height={CCL2.core[1] - CCL2.core[0]} fill="var(--pcb-fr4)" />
        <rect x={x0} y={CCL2.core[0]} width={x1 - x0} height={CCL2.core[1] - CCL2.core[0]} fill="url(#ccl2-core)" />
        <rect x={x0} y={CCL2.core[0]} width={x1 - x0} height={CCL2.core[1] - CCL2.core[0]} fill="url(#ccl2-core2)" />
        <rect x={x0} y={CCL2.core[0]} width={x1 - x0} height={CCL2.core[1] - CCL2.core[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* ---------- ③ 下层铜箔 ---------- */}
        <rect x={x0} y={CCL2.foilBot[0]} width={x1 - x0} height={CCL2.foilBot[1] - CCL2.foilBot[0]} fill="var(--pcb-copper)" />
        <rect x={x0} y={CCL2.foilBot[0]} width={x1 - x0} height={CCL2.foilBot[1] - CCL2.foilBot[0]} fill="url(#ccl2-cu)" opacity="0.35" />
        <rect x={x0} y={CCL2.foilBot[0]} width={x1 - x0} height={CCL2.foilBot[1] - CCL2.foilBot[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* ---------- 压合方向 ---------- */}
        {[
          { y1: CCL2.foilTop[1] + 4, y2: CCL2.core[0] - 4, dir: 1 },
          { y1: CCL2.core[1] + 4, y2: CCL2.foilBot[0] - 4, dir: -1 },
        ].map((arrow, i) => (
          <g key={`press-${i}`} stroke="var(--pcb-ink-dim)" strokeWidth={1.4} fill="none">
            <line x1={250 + i * 300} y1={arrow.y1} x2={250 + i * 300} y2={arrow.y2} strokeDasharray="5 4" />
            <polyline
              points={`${250 + i * 300 - 5},${(arrow.y1 + arrow.y2) / 2 + (arrow.dir > 0 ? -4 : 4)} ${250 + i * 300},${(arrow.y1 + arrow.y2) / 2 + (arrow.dir > 0 ? 4 : -4)} ${250 + i * 300 + 5},${(arrow.y1 + arrow.y2) / 2 + (arrow.dir > 0 ? -4 : 4)}`}
              strokeLinejoin="round"
            />
          </g>
        ))}
        <text x={420} y={CCL2.foilTop[1] + 34} className={styles.annoLabelDim} textAnchor="middle">
          压合
        </text>
        <text x={420} y={CCL2.foilBot[0] - 26} className={styles.annoLabelDim} textAnchor="middle">
          压合
        </text>

        {/* ---------- 厚度标注 ---------- */}
        {/* 铜箔 35 µm（上） */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x0 - 26} y1={CCL2.foilTop[0]} x2={x0 - 26} y2={CCL2.foilTop[1]} />
          <line x1={x0 - 32} y1={CCL2.foilTop[0]} x2={x0 - 20} y2={CCL2.foilTop[0]} />
          <line x1={x0 - 32} y1={CCL2.foilTop[1]} x2={x0 - 20} y2={CCL2.foilTop[1]} />
        </g>
        <text x={x0 - 38} y={(CCL2.foilTop[0] + CCL2.foilTop[1]) / 2 + 3} className={styles.dimText} textAnchor="end">
          35 µm
        </text>

        {/* 芯板厚度 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x0 - 26} y1={CCL2.core[0]} x2={x0 - 26} y2={CCL2.core[1]} />
          <line x1={x0 - 32} y1={CCL2.core[0]} x2={x0 - 20} y2={CCL2.core[0]} />
          <line x1={x0 - 32} y1={CCL2.core[1]} x2={x0 - 20} y2={CCL2.core[1]} />
        </g>
        <text
          x={x0 - 38}
          y={(CCL2.core[0] + CCL2.core[1]) / 2}
          className={styles.dimText}
          transform={`rotate(-90 ${x0 - 38} ${(CCL2.core[0] + CCL2.core[1]) / 2})`}
          textAnchor="middle"
        >
          芯板 1.53
        </text>

        {/* 压合后总厚 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x1 + 26} y1={CCL2.foilTop[0]} x2={x1 + 26} y2={CCL2.foilBot[1]} />
          <line x1={x1 + 20} y1={CCL2.foilTop[0]} x2={x1 + 32} y2={CCL2.foilTop[0]} />
          <line x1={x1 + 20} y1={CCL2.foilBot[1]} x2={x1 + 32} y2={CCL2.foilBot[1]} />
        </g>
        <text
          x={x1 + 46}
          y={(CCL2.foilTop[0] + CCL2.foilBot[1]) / 2}
          className={styles.dimText}
          transform={`rotate(-90 ${x1 + 46} ${(CCL2.foilTop[0] + CCL2.foilBot[1]) / 2})`}
          textAnchor="middle"
        >
          压合后 1.6 mm
        </text>

        {/* ---------- 引线标注 ---------- */}
        <Pointer from={[214, 96]} to={[214, CCL2.foilTop[0]]} label="① 铜箔" sub="35 µm" align="start" />
        <Pointer from={[214, 350]} to={[214, CCL2.core[1]]} label="② 芯板 FR-4" sub="玻纤布 + 环氧树脂" align="start" />
        <Pointer from={[214, 412]} to={[214, CCL2.foilBot[1]]} label="③ 铜箔" sub="与上层同规格" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 3. 四层板叠层：2D 叠层剖面图（左边层名、右边材质说明）
 * ========================================================================= */

const STK = {
  x0: 236,
  x1: 640,
  maskTop: [86, 90],
  l1: [90, 98],
  pre1: [98, 132],
  l2: [132, 140],
  core: [140, 236],
  l3: [236, 244],
  pre2: [244, 278],
  l4: [278, 286],
  maskBot: [286, 290],
  via: 300,
};

export function LayerStackup4() {
  const { x0, x1 } = STK;

  const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
    </pattern>
  );

  /** 左边一列层名 */
  const rows: { y: number; text: string; key: string; strong?: boolean }[] = [
    { y: (STK.l1[0] + STK.l1[1]) / 2, text: 'L1 信号层', key: 'l1', strong: true },
    { y: (STK.pre1[0] + STK.pre1[1]) / 2, text: '半固化片 prepreg', key: 'pre1' },
    { y: (STK.l2[0] + STK.l2[1]) / 2, text: 'L2 地平面', key: 'l2', strong: true },
    { y: (STK.core[0] + STK.core[1]) / 2, text: '芯板 core', key: 'core' },
    { y: (STK.l3[0] + STK.l3[1]) / 2, text: 'L3 电源平面', key: 'l3', strong: true },
    { y: (STK.pre2[0] + STK.pre2[1]) / 2, text: '半固化片 prepreg', key: 'pre2' },
    { y: (STK.l4[0] + STK.l4[1]) / 2, text: 'L4 信号层', key: 'l4', strong: true },
  ];

  return (
    <FigureShell
      no="FIG · 03"
      title="四层板叠层（SIG / GND / PWR / SIG）"
      meta="2D 叠层剖面 · 单位 mm"
      plain
      legend={[
        { n: 1, label: '铜箔（L1–L4）', hint: '每层 1 oz ≈ 35 µm，外层蚀刻成线路' },
        { n: 2, label: '半固化片 prepreg', hint: '未完全固化的玻纤布，压合时流动粘接' },
        { n: 3, label: '芯板 core', hint: '已固化的 FR-4，撑起板厚' },
        { n: 4, label: '金属化通孔', hint: '贯穿四层，把信号/电源/地连起来' },
      ]}
      caption="四层板的典型叠层：L1 与 L4 走信号，L2 做完整地平面、L3 做电源平面，中间夹芯板与半固化片。第二层的完整地平面既当参考面又当屏蔽层，这是「四层比两层好」的真正原因。"
      note="层的顺序比层的数量更重要：六层板常见的 SIG / GND / SIG / PWR / GND / SIG 也是同一个思路——每个信号层都紧挨一个参考面。"
    >
      <svg viewBox="0 0 900 400" role="img" aria-labelledby="fig-stk-title" className={styles.svg}>
        <title id="fig-stk-title">四层板 2D 叠层剖面图：自上而下为阻焊、L1 信号铜、半固化片、L2 地平面、芯板、L3 电源平面、半固化片、L4 信号铜、阻焊，一个金属化通孔贯穿</title>
        <defs>
          {hatch('stk-pre', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('stk-pre2', 'var(--pcb-hatch-2)', 1, 7, -45)}
          {hatch('stk-core', 'var(--pcb-hatch)', 1, 8, 45)}
          {hatch('stk-core2', 'var(--pcb-hatch-2)', 1, 8, -45)}
          {hatch('stk-cu', '#ffffff', 1, 5.5, 45)}
        </defs>

        {/* 介质：prepreg / core */}
        {[
          { band: STK.pre1, fill: 'var(--pcb-fr4)', h1: 'stk-pre', h2: 'stk-pre2' },
          { band: STK.core, fill: 'color-mix(in oklab, var(--pcb-fr4) 88%, var(--pcb-ink) 12%)', h1: 'stk-core', h2: 'stk-core2' },
          { band: STK.pre2, fill: 'var(--pcb-fr4)', h1: 'stk-pre', h2: 'stk-pre2' },
        ].map((item, i) => (
          <g key={`diel-${i}`}>
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={item.fill} />
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={`url(#${item.h1})`} />
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={`url(#${item.h2})`} />
          </g>
        ))}

        {/* 四层铜 */}
        {[STK.l1, STK.l2, STK.l3, STK.l4].map((band, i) => (
          <g key={`cu-${i}`}>
            <rect x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="var(--pcb-copper)" />
            <rect x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="url(#stk-cu)" opacity="0.35" />
          </g>
        ))}

        {/* 阻焊（上下） */}
        {[STK.maskTop, STK.maskBot].map((band, i) => (
          <g key={`mask-${i}`}>
            <rect x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="var(--pcb-mask)" />
          </g>
        ))}

        {/* 金属化通孔 */}
        <g>
          {[-13, 13].map((dx) => (
            <rect
              key={`wall-${dx}`}
              x={STK.via + dx - 4}
              y={STK.maskTop[0]}
              width={8}
              height={STK.maskBot[1] - STK.maskTop[0]}
              fill="var(--pcb-copper)"
            />
          ))}
          <rect
            x={STK.via - 9}
            y={STK.maskTop[0]}
            width={18}
            height={STK.maskBot[1] - STK.maskTop[0]}
            fill="var(--pcb-hole)"
            stroke="var(--pcb-hair)"
            strokeWidth={0.8}
          />
          {/* 孔口焊盘 */}
          <rect x={STK.via - 20} y={STK.l1[0]} width={40} height={STK.l1[1] - STK.l1[0]} fill="var(--pcb-copper)" />
          <rect x={STK.via - 20} y={STK.l4[0]} width={40} height={STK.l4[1] - STK.l4[0]} fill="var(--pcb-copper)" />
        </g>

        {/* 板件轮廓与分层线 */}
        <rect x={x0} y={STK.maskTop[0]} width={x1 - x0} height={STK.maskBot[1] - STK.maskTop[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.6} />
        {[STK.l1[1], STK.pre1[1], STK.l2[1], STK.core[1], STK.l3[1], STK.pre2[1], STK.l4[1]].map((y) => (
          <line key={`sep-${y}`} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--pcb-ink)" strokeWidth={0.9} opacity="0.5" />
        ))}

        {/* 左侧层名 */}
        {rows.map((row) => (
          <g key={row.key}>
            <line x1={x0 - 12} y1={row.y} x2={x0 - 4} y2={row.y} stroke="var(--pcb-hair-strong)" strokeWidth={1} />
            <text
              x={x0 - 18}
              y={row.y + 3.5}
              textAnchor="end"
              className={row.strong ? styles.layerLabel : styles.layerLabelDim}
            >
              {row.text}
            </text>
          </g>
        ))}

        {/* 总厚 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x1 + 26} y1={STK.maskTop[0]} x2={x1 + 26} y2={STK.maskBot[1]} />
          <line x1={x1 + 20} y1={STK.maskTop[0]} x2={x1 + 32} y2={STK.maskTop[0]} />
          <line x1={x1 + 20} y1={STK.maskBot[1]} x2={x1 + 32} y2={STK.maskBot[1]} />
        </g>
        <text
          x={x1 + 46}
          y={(STK.maskTop[0] + STK.maskBot[1]) / 2}
          className={styles.dimText}
          transform={`rotate(-90 ${x1 + 46} ${(STK.maskTop[0] + STK.maskBot[1]) / 2})`}
          textAnchor="middle"
        >
          1.6 mm
        </text>

        {/* 铜厚 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={x1 + 8} y1={STK.l1[0]} x2={x1 + 8} y2={STK.l1[1]} />
          <line x1={x1 + 4} y1={STK.l1[0]} x2={x1 + 12} y2={STK.l1[0]} />
          <line x1={x1 + 4} y1={STK.l1[1]} x2={x1 + 12} y2={STK.l1[1]} />
        </g>
        <text x={x1 + 16} y={STK.l1[0] - 6} className={styles.dimText}>
          35 µm
        </text>

        {/* 引线标注 */}
        <Pointer from={[300, 62]} to={[300, STK.l1[0] + 4]} label="① 铜箔" sub="35 µm" align="start" />
        <Pointer from={[300, 336]} to={[STK.via + 13, 250]} label="④ 通孔" sub="贯穿四层" align="end" />
        <Pointer from={[430, 336]} to={[430, STK.pre2[0] + 14]} label="② 半固化片" sub="prepreg" align="start" />
        <Pointer from={[566, 336]} to={[566, STK.core[0] + 56]} label="③ 芯板" sub="core" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 4. 孔的类型：2D 剖面图（同一切面上剖开通孔 / 盲孔 / 埋孔）
 *    与 FIG 01 / 03 同一套剖面线与线宽
 * ========================================================================= */

const VIA2D = {
  x0: 200,
  x1: 660,
  maskTop: [96, 100],
  l1: [100, 108],
  pre1: [108, 142],
  l2: [142, 150],
  core: [150, 250],
  l3: [250, 258],
  pre2: [258, 292],
  l4: [292, 300],
  maskBot: [300, 304],
  through: 280,
  blind: 420,
  buried: 560,
};

export function ViaTypes() {
  const { x0, x1 } = VIA2D;

  const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
      <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
    </pattern>
  );

  /** 一个孔的剖面：x 位置、起止 y、是否有孔口焊盘 */
  const Via = ({
    x,
    y0,
    y1,
    padTop,
    padBottom,
  }: {
    x: number;
    y0: number;
    y1: number;
    padTop: boolean;
    padBottom: boolean;
  }) => (
    <g>
      {padTop && (
        <rect x={x - 20} y={VIA2D.l1[0]} width={40} height={VIA2D.l1[1] - VIA2D.l1[0]} fill="var(--pcb-copper)" />
      )}
      {padBottom && (
        <rect x={x - 20} y={VIA2D.l4[0]} width={40} height={VIA2D.l4[1] - VIA2D.l4[0]} fill="var(--pcb-copper)" />
      )}
      {[-9, 9].map((dx) => (
        <rect key={`${x}-wall-${dx}`} x={x + dx - 3} y={y0} width={6} height={y1 - y0} fill="var(--pcb-copper)" />
      ))}
      <rect
        x={x - 6}
        y={y0}
        width={12}
        height={y1 - y0}
        fill="var(--pcb-hole)"
        stroke="var(--pcb-hair)"
        strokeWidth={0.8}
      />
    </g>
  );

  return (
    <FigureShell
      no="FIG · 04"
      title="孔的分类（四层板剖面）"
      meta="2D 剖面 · 3 种孔"
      plain
      legend={[
        { n: 1, label: '通孔', hint: '从一侧穿透到另一侧，一次钻通，成本最低' },
        { n: 2, label: '盲孔', hint: '表层 → 内层，不贯穿；需在压合前控深钻孔' },
        { n: 3, label: '埋孔', hint: '只存在于内层之间，表面看不到；需多次压合' },
      ]}
      caption="把四层板切开，三种孔的区别一眼可见：通孔贯穿全部四层；盲孔只从表面钻到第二层；埋孔完全藏在 L2 与 L3 之间，板面完全看不到。层数越多，能用的孔型越多，但每一种额外的孔型都要用一次压合来换。"
      note="HDI 里的微孔（≤ 0.15 mm，激光钻）是盲孔的一种极端形态；埋孔在部分资料里写作「盖孔」，指的是同一种孔。"
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-via2-title" className={styles.svg}>
        <title id="fig-via2-title">四层板 2D 剖面图：切面上分别剖出通孔、盲孔、埋孔的孔壁与深度差别</title>
        <defs>
          {hatch('via2-pre', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('via2-pre2', 'var(--pcb-hatch-2)', 1, 7, -45)}
          {hatch('via2-core', 'var(--pcb-hatch)', 1, 8, 45)}
          {hatch('via2-core2', 'var(--pcb-hatch-2)', 1, 8, -45)}
          {hatch('via2-cu', '#ffffff', 1, 5.5, 45)}
        </defs>

        {/* 介质 */}
        {[
          { band: VIA2D.pre1, fill: 'var(--pcb-fr4)', h1: 'via2-pre', h2: 'via2-pre2' },
          { band: VIA2D.core, fill: 'color-mix(in oklab, var(--pcb-fr4) 88%, var(--pcb-ink) 12%)', h1: 'via2-core', h2: 'via2-core2' },
          { band: VIA2D.pre2, fill: 'var(--pcb-fr4)', h1: 'via2-pre', h2: 'via2-pre2' },
        ].map((item, i) => (
          <g key={`diel-${i}`}>
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={item.fill} />
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={`url(#${item.h1})`} />
            <rect x={x0} y={item.band[0]} width={x1 - x0} height={item.band[1] - item.band[0]} fill={`url(#${item.h2})`} />
          </g>
        ))}

        {/* 四层铜 */}
        {[VIA2D.l1, VIA2D.l2, VIA2D.l3, VIA2D.l4].map((band, i) => (
          <g key={`cu-${i}`}>
            <rect x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="var(--pcb-copper)" />
            <rect x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="url(#via2-cu)" opacity="0.35" />
          </g>
        ))}

        {/* 阻焊 */}
        {[VIA2D.maskTop, VIA2D.maskBot].map((band, i) => (
          <rect key={`mask-${i}`} x={x0} y={band[0]} width={x1 - x0} height={band[1] - band[0]} fill="var(--pcb-mask)" />
        ))}

        {/* 三种孔 */}
        <Via x={VIA2D.through} y0={VIA2D.maskTop[0]} y1={VIA2D.maskBot[1]} padTop padBottom />
        <Via x={VIA2D.blind} y0={VIA2D.maskTop[0]} y1={VIA2D.l2[0]} padTop padBottom={false} />
        <Via x={VIA2D.buried} y0={VIA2D.l2[0]} y1={VIA2D.l3[1]} padTop={false} padBottom={false} />

        {/* 板件轮廓与分层线 */}
        <rect x={x0} y={VIA2D.maskTop[0]} width={x1 - x0} height={VIA2D.maskBot[1] - VIA2D.maskTop[0]} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.6} />
        {[VIA2D.l1[1], VIA2D.pre1[1], VIA2D.l2[1], VIA2D.core[1], VIA2D.l3[1], VIA2D.pre2[1], VIA2D.l4[1]].map((y) => (
          <line key={`sep-${y}`} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--pcb-ink)" strokeWidth={0.9} opacity="0.5" />
        ))}

        {/* 左侧层号 */}
        {[
          { band: VIA2D.l1, text: 'L1' },
          { band: VIA2D.l2, text: 'L2' },
          { band: VIA2D.l3, text: 'L3' },
          { band: VIA2D.l4, text: 'L4' },
        ].map((row) => (
          <g key={row.text}>
            <line
              x1={x0 - 12}
              y1={(row.band[0] + row.band[1]) / 2}
              x2={x0 - 4}
              y2={(row.band[0] + row.band[1]) / 2}
              stroke="var(--pcb-hair-strong)"
              strokeWidth={1}
            />
            <text x={x0 - 18} y={(row.band[0] + row.band[1]) / 2 + 4} textAnchor="end" className={styles.layerLabel}>
              {row.text}
            </text>
          </g>
        ))}

        {/* 深度提示 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} strokeDasharray="4 4" fill="none" opacity="0.8">
          <line x1={VIA2D.blind - 28} y1={VIA2D.l2[0]} x2={VIA2D.blind + 28} y2={VIA2D.l2[0]} />
          <line x1={VIA2D.buried - 28} y1={VIA2D.l2[0]} x2={VIA2D.buried + 28} y2={VIA2D.l2[0]} />
          <line x1={VIA2D.buried - 28} y1={VIA2D.l3[1]} x2={VIA2D.buried + 28} y2={VIA2D.l3[1]} />
        </g>

        {/* 引线标注 */}
        <Pointer from={[VIA2D.through - 34, 340]} to={[VIA2D.through - 9, 260]} label="① 通孔" sub="贯穿全部四层" align="end" />
        <Pointer from={[VIA2D.blind - 6, 340]} to={[VIA2D.blind + 9, 130]} label="② 盲孔" sub="表层 → L2" align="start" />
        <Pointer from={[VIA2D.buried + 10, 340]} to={[VIA2D.buried + 9, 226]} label="③ 埋孔" sub="L2 ↔ L3" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 5. 连接方式的四个阶段
 * ========================================================================= */

type EraPanel = { key: string; year: string; title: string; sub: string };

const ERA_PANELS: EraPanel[] = [
  { key: 'p2p', year: '1900s–1940s', title: '点对点接线', sub: '导线 + 搭棚，一致性靠人' },
  { key: 'single', year: '1940s–1950s', title: '单面板', sub: '铜箔只在单面，连线只能绕开' },
  { key: 'double', year: '1960s–1970s', title: '双面板 + 金属化孔', sub: '导线可穿过板面，双面布线成立' },
  { key: 'multi', year: '1980s–', title: '多层板 + 盲埋孔', sub: '内层互连，密度由叠层决定' },
];

const ERA_X = [22, 222, 422, 622];
const ERA_W = 165;

export function ConnectionEras() {
  return (
    <FigureShell
      no="FIG · 01"
      title="连接方式的四个阶段"
      meta="1920s → NOW · 截面示意"
      legend={[
        { swatch: 'copper', label: '导体', hint: '导线或蚀刻后的铜箔' },
        { swatch: 'via', label: '金属化孔', hint: '盲孔 / 埋孔 / 通孔' },
        { swatch: 'substrate', label: '介质基材', hint: 'FR-4 一类板材' },
        { swatch: 'component', label: '元件', hint: '管座、封装体、焊球' },
      ]}
      caption="四个阶段不是替代关系，而是今天同一块板上可以同时出现的历史遗迹：插件孔旁边就是微孔，丝印下面还压着色环电阻的时代。"
    >
      <svg viewBox="0 30 800 232" role="img" aria-labelledby="fig-era-title" className={styles.svg}>
        <title id="fig-era-title">连接方式的四个阶段：点对点接线、单面板、双面板加金属化孔、多层板加盲埋孔</title>
        <defs>
          <linearGradient id="ce-copper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--pcb-copper)" />
            <stop offset="1" stopColor="var(--pcb-copper-2)" />
          </linearGradient>
          <linearGradient id="ce-barrel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--pcb-copper-3)" />
            <stop offset="0.4" stopColor="var(--pcb-via)" />
            <stop offset="1" stopColor="var(--pcb-copper-2)" />
          </linearGradient>
          <linearGradient id="ce-shadow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--pcb-shadow)" />
            <stop offset="1" stopColor="var(--pcb-shadow)" stopOpacity="0" />
          </linearGradient>
          <pattern id="ce-weave" width="14" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7h14M7 0v14" stroke="var(--pcb-weave)" strokeWidth="1" fill="none" />
          </pattern>
        </defs>

        {ERA_PANELS.map((panel, i) => {
          const px = ERA_X[i];
          const shadowY = [192, 187, 183, 183][i];
          return (
            <g key={panel.key}>
              <text x={px + ERA_W / 2} y="44" textAnchor="middle" className={styles.panelMeta}>
                {panel.year}
              </text>
              <text x={px + ERA_W / 2} y="224" textAnchor="middle" className={styles.panelTitle}>
                {panel.title}
              </text>
              <text x={px + ERA_W / 2} y="242" textAnchor="middle" className={styles.panelSub}>
                {panel.sub}
              </text>
              <rect
                x={px + 12}
                y={shadowY}
                width={ERA_W - 24}
                height="10"
                rx="4"
                fill="url(#ce-shadow)"
              />

              {i === 0 && (
                <>
                  {/* 金属底盘 + 管座 + 飞线 */}
                  <rect x={px + 6} y="182" width={ERA_W - 12} height="9" rx="2" fill="var(--pcb-component)" fillOpacity="0.55" />
                  <rect x={px + 26} y="140" width="26" height="22" rx="3" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <rect x={px + 112} y="140" width="26" height="22" rx="3" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <g stroke="var(--pcb-hair-strong)" strokeWidth="2">
                    <line x1={px + 39} y1="162" x2={px + 39} y2="182" />
                    <line x1={px + 125} y1="162" x2={px + 125} y2="182" />
                  </g>
                  <path
                    d={`M${px + 39} 140 C${px + 39} 104 ${px + 125} 104 ${px + 125} 140`}
                    fill="none"
                    stroke="url(#ce-copper)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d={`M${px + 48} 140 C${px + 48} 122 ${px + 116} 122 ${px + 116} 140`}
                    fill="none"
                    stroke="var(--pcb-copper-2)"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                  />
                  <circle cx={px + 39} cy="140" r="2.6" fill="var(--pcb-via)" />
                  <circle cx={px + 125} cy="140" r="2.6" fill="var(--pcb-via)" />
                </>
              )}

              {i === 1 && (
                <>
                  <rect x={px + 10} y="160" width={ERA_W - 20} height="22" rx="2" fill="var(--pcb-substrate)" />
                  <rect x={px + 10} y="160" width={ERA_W - 20} height="22" rx="2" fill="url(#ce-weave)" />
                  <g fill="url(#ce-copper)">
                    <rect x={px + 18} y="182" width="42" height="4" rx="1.5" />
                    <rect x={px + 68} y="182" width="52" height="4" rx="1.5" />
                    <rect x={px + 128} y="182" width="20" height="4" rx="1.5" />
                  </g>
                  <rect x={px + 28} y="140" width="20" height="15" rx="2" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <rect x={px + 94} y="140" width="20" height="15" rx="2" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <g stroke="var(--pcb-hair-strong)" strokeWidth="2">
                    <line x1={px + 38} y1="155" x2={px + 38} y2="162" />
                    <line x1={px + 104} y1="155" x2={px + 104} y2="162" />
                  </g>
                  <circle cx={px + 38} cy="184" r="3" fill="var(--pcb-via)" />
                  <circle cx={px + 104} cy="184" r="3" fill="var(--pcb-via)" />
                </>
              )}

              {i === 2 && (
                <>
                  <rect x={px + 10} y="158" width={ERA_W - 20} height="24" rx="2" fill="var(--pcb-substrate)" />
                  <rect x={px + 10} y="158" width={ERA_W - 20} height="24" rx="2" fill="url(#ce-weave)" />
                  <g fill="url(#ce-copper)">
                    <rect x={px + 10} y="158" width="56" height="4" rx="1.5" />
                    <rect x={px + 96} y="158" width="59" height="4" rx="1.5" />
                    <rect x={px + 10} y="178" width="59" height="4" rx="1.5" />
                    <rect x={px + 96} y="178" width="59" height="4" rx="1.5" />
                  </g>
                  <rect x={px + 79} y="156" width="7" height="28" fill="url(#ce-barrel)" />
                  <rect x={px + 80.5} y="160" width="4" height="20" rx="2" fill="var(--pcb-hole)" />
                  <ellipse cx={px + 82.5} cy="158" rx="11" ry="3.4" fill="var(--pcb-via)" />
                  <ellipse cx={px + 82.5} cy="182" rx="11" ry="3.4" fill="var(--pcb-via)" />
                  <rect x={px + 62} y="136" width="20" height="15" rx="2" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <line x1={px + 72} y1="151" x2={px + 72} y2="158" stroke="var(--pcb-hair-strong)" strokeWidth="2" />
                </>
              )}

              {i === 3 && (
                <>
                  <rect x={px + 10} y="142" width={ERA_W - 20} height="40" rx="2" fill="var(--pcb-substrate)" />
                  <rect x={px + 10} y="142" width={ERA_W - 20} height="40" rx="2" fill="url(#ce-weave)" />
                  <g stroke="var(--pcb-copper)" strokeWidth="2.4" strokeLinecap="round">
                    <line x1={px + 16} y1="146" x2={px + ERA_W - 26} y2="146" />
                    <line x1={px + 16} y1="156" x2={px + ERA_W - 26} y2="156" />
                    <line x1={px + 16} y1="168" x2={px + ERA_W - 26} y2="168" />
                    <line x1={px + 16} y1="178" x2={px + ERA_W - 26} y2="178" />
                  </g>
                  <rect x={px + 43} y="142" width="5" height="14" fill="url(#ce-barrel)" />
                  <rect x={px + 88} y="156" width="5" height="12" fill="url(#ce-barrel)" />
                  <rect x={px + 124} y="142" width="6" height="36" fill="url(#ce-barrel)" />
                  <rect x={px + 125.5} y="146" width="3" height="28" rx="1.5" fill="var(--pcb-hole)" />
                  <ellipse cx={px + 127} cy="142" rx="9" ry="3" fill="var(--pcb-via)" />
                  <ellipse cx={px + 127} cy="182" rx="9" ry="3" fill="var(--pcb-via)" />
                  <rect x={px + 58} y="120" width="26" height="16" rx="2" fill="var(--pcb-component)" fillOpacity="0.85" />
                  <g fill="var(--pcb-via)">
                    <circle cx={px + 65} cy="139" r="2.4" />
                    <circle cx={px + 71} cy="139" r="2.4" />
                    <circle cx={px + 77} cy="139" r="2.4" />
                  </g>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </FigureShell>
  );
}
