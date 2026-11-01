import styles from './pcb/pcb-figures.module.css';
import { Badge, FigureShell, Pointer } from './pcb/pcb-figures';

/**
 * 原子与能带类插图。
 *
 * 与 pcb 系列共用同一套卡片骨架（FigureShell）与配色令牌，
 * 所以放在别的章节里也不会显得像另一本书的图。
 */

const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
  </pattern>
);

/* =========================================================================
 * 1. 能级跃迁：吸收与放出光子
 * ========================================================================= */

const JUMP = { e2: 118, e1: 250, x0: 122, x1: 736 };

export function PhotonJump({ no = 'FIG · 03' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="一个电子的两次跳跃：吸收光子 / 放出光子"
      meta="能级 · 2 LEVELS · ΔE = h·f"
      plain
      caption="电子只能待在离散的能级上，所以它吸收和放出的光也是离散的：一次跳跃对应一个频率，也就是一种颜色。LED 的颜色不是染出来的，是材料带隙决定的。"
      note="反过来用就是激光与光电二极管：受激辐射与光生载流子，都是这条式子在做工。"
    >
      <svg viewBox="0 0 900 360" role="img" aria-labelledby="fig-jump-title" className={styles.svg}>
        <title id="fig-jump-title">能级跃迁图：电子吸收光子从 E1 跃迁到 E2，再落回 E1 并放出光子</title>
        <defs>
          <marker id="jump-up" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--pcb-copper)" />
          </marker>
          <marker id="jump-down" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--pcb-silk)" />
          </marker>
          <marker id="jump-dim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--pcb-ink-dim)" />
          </marker>
        </defs>

        {/* 两条能级 */}
        <line x1={JUMP.x0} y1={JUMP.e2} x2={JUMP.x1} y2={JUMP.e2} stroke="var(--pcb-copper)" strokeWidth={3} />
        <line x1={JUMP.x0} y1={JUMP.e1} x2={JUMP.x1} y2={JUMP.e1} stroke="var(--pcb-copper)" strokeWidth={3} />

        <text x={JUMP.x0 - 14} y={JUMP.e2 + 5} textAnchor="end" className={styles.layerLabel}>
          E₂
        </text>
        <text x={JUMP.x0 - 14} y={JUMP.e1 + 5} textAnchor="end" className={styles.layerLabel}>
          E₁
        </text>
        <text x={JUMP.x0 - 14} y={JUMP.e1 + 24} textAnchor="end" className={styles.layerLabelDim}>
          基态
        </text>

        {/* 吸收：上箭头 */}
        <line x1={300} y1={JUMP.e1 - 4} x2={300} y2={JUMP.e2 + 6} stroke="var(--pcb-copper)" strokeWidth={2.4} markerEnd="url(#jump-up)" />
        <circle cx={300} cy={JUMP.e1} r={5.5} fill="var(--pcb-ink)" opacity="0.35" />
        <circle cx={300} cy={JUMP.e2} r={5.5} fill="var(--pcb-ink)" />
        <text x={318} y={186} className={styles.annoLabel}>
          ① 吸收光子
        </text>
        <text x={318} y={203} className={styles.annoLabelDim}>
          h·f 正好等于 ΔE 才吸收
        </text>

        {/* 放出：下箭头 + 光子波形 */}
        <line x1={560} y1={JUMP.e2 + 4} x2={560} y2={JUMP.e1 - 6} stroke="var(--pcb-silk)" strokeWidth={2.4} markerEnd="url(#jump-down)" />
        <circle cx={560} cy={JUMP.e2} r={5.5} fill="var(--pcb-ink)" />
        <circle cx={560} cy={JUMP.e1} r={5.5} fill="var(--pcb-ink)" opacity="0.35" />
        <text x={578} y={186} className={styles.annoLabel}>
          ② 放出光子（发光）
        </text>
        <text x={578} y={203} className={styles.annoLabelDim}>
          自发辐射：频率由 ΔE 定死
        </text>
        <path
          d="M 604 250 q 8 -16 16 0 q 8 16 16 0 q 8 -16 16 0 q 8 16 16 0"
          fill="none"
          stroke="var(--pcb-silk)"
          strokeWidth={2}
        />

        {/* ΔE 尺寸线 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1}>
          <line x1={JUMP.x1 + 8} y1={JUMP.e2} x2={784} y2={JUMP.e2} strokeDasharray="3 3" />
          <line x1={JUMP.x1 + 8} y1={JUMP.e1} x2={784} y2={JUMP.e1} strokeDasharray="3 3" />
          <line x1={784} y1={JUMP.e2} x2={784} y2={JUMP.e1} markerStart="url(#jump-dim)" markerEnd="url(#jump-dim)" />
        </g>
        <text x={798} y={170} className={styles.code}>
          ΔE
        </text>
        <text x={798} y={190} className={styles.dimText}>
          = h·f
        </text>
        <text x={798} y={207} className={styles.dimText}>
          = E₂ − E₁
        </text>

        <text x={122} y={300} className={styles.panelMeta}>
          λ(nm) = 1240 / ΔE(eV)　——　同一式子反过来用，就是 LED 颜色与带隙的换算
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 2. 能带结构：导体 / 半导体 / 绝缘体
 * ========================================================================= */

type BandCol = {
  key: string;
  title: string;
  sub: string;
  top: [number, number];
  gap: [number, number] | null;
  bottom: [number, number];
  eg: string;
  egSub: string;
  conductor?: boolean;
};

const COLS: BandCol[] = [
  {
    key: 'cu',
    title: '导体 · 铜',
    sub: '导带与价带重叠',
    top: [86, 168],
    gap: null,
    bottom: [168, 250],
    eg: 'Eg ≈ 0',
    egSub: '没有间隙，电子随手可用',
    conductor: true,
  },
  {
    key: 'si',
    title: '半导体 · 硅',
    sub: '一条窄间隙',
    top: [74, 138],
    gap: [138, 206],
    bottom: [206, 270],
    eg: 'Eg ≈ 1.1 eV',
    egSub: '常温下少量电子能跨过去',
  },
  {
    key: 'fr4',
    title: '绝缘体 · FR-4 / SiO₂',
    sub: '一条宽间隙',
    top: [58, 112],
    gap: [112, 248],
    bottom: [248, 302],
    eg: 'Eg ≈ 5–9 eV',
    egSub: '跨不过去 → 不导电',
  },
];

const COL_X = [70, 350, 630];
const COL_W = 200;

export function BandStructure({ no = 'FIG · 04' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="同一张能带图，三种材料"
      meta="能带 · 导体 / 半导体 / 绝缘体"
      plain
      legend={[
        { swatch: 'copper', label: '可占据的能态', hint: '浅色＝空着，深色＝有电子' },
        { swatch: 'substrate', label: '禁带 Eg', hint: '电子不能停留的能量区间' },
        { n: 1, label: '费米面', hint: '电子填充到这根线的位置（绝对零度）' },
      ]}
      caption="三张图的区别只有一处：禁带有多宽。导体根本没有禁带，半导体窄到常温就有一部分电子跨得过去，绝缘体宽到跨不过去。所谓「导电」，就是有没有电子能爬到空着的能态上。"
      note="温度升高会让更多电子跨过禁带，所以半导体的电阻随温度升高而下降——这和铜正好相反。"
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-band-title" className={styles.svg}>
        <title id="fig-band-title">能带结构对比：导体的导带与价带重叠，半导体有 1.1 eV 禁带，绝缘体禁带 5 到 9 eV</title>
        <defs>
          {hatch('band-empty', 'var(--pcb-hatch)', 1, 6, 45)}
          {hatch('band-full', 'var(--pcb-hatch-2)', 1, 6, -45)}
        </defs>

        {COLS.map((col, i) => {
          const x = COL_X[i];
          const cx = x + COL_W / 2;
          return (
            <g key={col.key}>
              {/* 面板标题 */}
              <text x={cx} y={40} textAnchor="middle" className={styles.panelTitle}>
                {col.title}
              </text>
              <text x={cx} y={58} textAnchor="middle" className={styles.panelSub}>
                {col.sub}
              </text>

              {/* 导带（部分/全部空着） */}
              <rect
                x={x}
                y={col.top[0]}
                width={COL_W}
                height={col.top[1] - col.top[0]}
                fill="var(--pcb-copper)"
                opacity={col.conductor ? 0.42 : 0.22}
              />
              <rect
                x={x}
                y={col.top[0]}
                width={COL_W}
                height={col.top[1] - col.top[0]}
                fill="url(#band-empty)"
                opacity="0.5"
              />
              <rect
                x={x}
                y={col.top[0]}
                width={COL_W}
                height={col.top[1] - col.top[0]}
                fill="none"
                stroke="var(--pcb-ink)"
                strokeWidth={1.2}
              />
              <text x={cx} y={col.top[0] + (col.top[1] - col.top[0]) / 2 + 4} textAnchor="middle" className={styles.panelMeta}>
                导带
              </text>

              {/* 禁带 */}
              {col.gap && (
                <g>
                  <rect x={x} y={col.gap[0]} width={COL_W} height={col.gap[1] - col.gap[0]} fill="var(--pcb-mask)" opacity="0.16" />
                  <line x1={x} y1={col.gap[0]} x2={x + COL_W} y2={col.gap[0]} stroke="var(--pcb-ink-dim)" strokeWidth={1} strokeDasharray="4 4" />
                  <line x1={x} y1={col.gap[1]} x2={x + COL_W} y2={col.gap[1]} stroke="var(--pcb-ink-dim)" strokeWidth={1} strokeDasharray="4 4" />
                  <text x={cx} y={col.gap[0] + (col.gap[1] - col.gap[0]) / 2 - 2} textAnchor="middle" className={styles.code}>
                    {col.eg}
                  </text>
                  <text x={cx} y={col.gap[0] + (col.gap[1] - col.gap[0]) / 2 + 15} textAnchor="middle" className={styles.annoLabelDim}>
                    {col.egSub}
                  </text>
                </g>
              )}

              {/* 价带（填满） */}
              <rect x={x} y={col.bottom[0]} width={COL_W} height={col.bottom[1] - col.bottom[0]} fill="var(--pcb-copper)" opacity="0.55" />
              <rect x={x} y={col.bottom[0]} width={COL_W} height={col.bottom[1] - col.bottom[0]} fill="url(#band-full)" opacity="0.45" />
              <rect
                x={x}
                y={col.bottom[0]}
                width={COL_W}
                height={col.bottom[1] - col.bottom[0]}
                fill="none"
                stroke="var(--pcb-ink)"
                strokeWidth={1.2}
              />
              <text x={cx} y={col.bottom[0] + (col.bottom[1] - col.bottom[0]) / 2 + 4} textAnchor="middle" className={styles.panelMeta}>
                价带（满）
              </text>

              {/* 金属：重叠处虚线 + 费米面 */}
              {col.conductor && (
                <g>
                  <line x1={x} y1={col.top[1]} x2={x + COL_W} y2={col.top[1]} stroke="var(--pcb-ink)" strokeWidth={1} strokeDasharray="5 4" opacity="0.7" />
                  <line x1={x - 8} y1={168} x2={x + COL_W + 8} y2={168} stroke="var(--pcb-ink)" strokeWidth={1.6} />
                  <text x={x + COL_W + 12} y={172} className={styles.annLabelDim}>
                    费米面
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <Badge x={COL_X[0] - 20} y={168} n={1} />
        <Pointer from={[COL_X[2] + 6, 336]} to={[COL_X[2] + COL_W / 2, 250]} label="禁带越宽，越难导电" sub="Eg 5–9 eV：常温下几乎没有电子能跨过去" />
        <text x={70} y={366} className={styles.panelMeta}>
          横轴不是空间，而是能量：同一根竖线上的位置越高，能量越大
        </text>
      </svg>
    </FigureShell>
  );
}
