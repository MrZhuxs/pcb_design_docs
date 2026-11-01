import styles from './pcb-figures.module.css';
import { FigureShell, Pointer } from './pcb-figures';

/**
 * 钳形表的两种夹法：夹一根线 = 差模；夹整束线 = 共模。
 *
 * ASCII 版里只能画方框和等号，看不出"钳口套住了什么"这件事本身。
 * 这里把钳口画成一个有缺口的环（真实钳表的形状），让"套进去的导体数量"
 * 成为两张图唯一的差别 —— 这正是差模 / 共模的分界。
 */

const R = 58; // 钳口半径

function Jaw({ cx, cy }: { cx: number; cy: number }) {
  const gap = 26; // 缺口半宽
  return (
    <g>
      {/* 钳口环：底部留缺口 */}
      <path
        d={`M ${cx - gap} ${cy + R - 6} A ${R} ${R} 0 1 1 ${cx + gap} ${cy + R - 6}`}
        fill="none"
        stroke="var(--pcb-silver)"
        strokeWidth={13}
        strokeLinecap="round"
      />
      {/* 环内的芯（磁芯截面） */}
      <path
        d={`M ${cx - gap} ${cy + R - 6} A ${R} ${R} 0 1 1 ${cx + gap} ${cy + R - 6}`}
        fill="none"
        stroke="var(--pcb-ink)"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.45}
      />
      {/* 手柄与表体 */}
      <rect
        x={cx - 15}
        y={cy + R + 6}
        width={30}
        height={12}
        rx={4}
        fill="var(--pcb-component)"
        stroke="var(--pcb-ink)"
        strokeWidth={1.4}
      />
    </g>
  );
}

export function ClampMeter({ no = 'FIG · 01' }: { no?: string }) {
  const aCx = 250;
  const bCx = 660;
  const cy = 190;

  return (
    <FigureShell
      no={no}
      title="钳形表的两种夹法：差模与共模"
      meta="测量手法 · 2 种夹法"
      plain
      legend={[
        { n: 1, label: '只夹一根线', hint: '钳口里只有一条导体 → 读到该导体的差模电流' },
        { n: 2, label: '整束一起夹', hint: '信号线与回流线同时在钳口内 → 差模抵消，只剩共模' },
      ]}
      caption="两张图唯一的差别是钳口里套了几根导体。钳表测的是「穿过钳口的净电流」：一条线进去、另一条线出来，等量反向的差模分量在钳口里正好抵消，指针上剩下的就是共模分量。测共模时若只夹一根，读到的是那根线的差模电流——这是最常见的误判。"
      note={
        <>
          推论：测共模必须把<b>信号、回流、屏蔽层</b>一起夹进去；只要漏掉一根，共模就被差模淹没。
        </>
      }
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-clamp-title" className={styles.svg}>
        <title id="fig-clamp-title">
          钳形表两种夹法对比：左侧钳口只套一根信号线，读到差模电流；右侧钳口套住信号线与回流线组成的整束线，差模抵消，读到共模电流
        </title>

        {/* ---------- 面板 A：只夹一根线 ---------- */}
        <text x={40} y={34} className={styles.panelTitle}>
          ① 只夹一根线
        </text>
        <text x={40} y={52} className={styles.panelSub}>
          读到的是该线的差模电流
        </text>

        <g>
          {/* 信号线穿过钳口 */}
          <line x1={70} y1={cy} x2={430} y2={cy} stroke="var(--pcb-wire)" strokeWidth={3.2} strokeLinecap="round" />
          <Jaw cx={aCx} cy={cy} />
          <text x={aCx} y={cy + 4} textAnchor="middle" className={styles.annoLabelDim}>
            单根导体
          </text>
        </g>

        <text x={70} y={cy - 12} className={styles.dimText}>
          去
        </text>
        <text x={398} y={cy - 12} className={styles.dimText}>
          回
        </text>
        <text x={250} y={cy + 108} textAnchor="middle" className={styles.annoLabelDim}>
          净电流 = 差模分量
        </text>

        {/* ---------- 面板 B：整束一起夹 ---------- */}
        <text x={470} y={34} className={styles.panelTitle}>
          ② 整束线一起夹
        </text>
        <text x={470} y={52} className={styles.panelSub}>
          读到的是共模电流
        </text>

        <g>
          {/* 信号 + 回流 + 屏蔽：三条并行走线 */}
          <line x1={492} y1={cy - 13} x2={840} y2={cy - 13} stroke="var(--pcb-wire)" strokeWidth={2.6} strokeLinecap="round" />
          <line x1={492} y1={cy} x2={840} y2={cy} stroke="var(--pcb-trace-side)" strokeWidth={2.6} strokeLinecap="round" />
          <line x1={492} y1={cy + 13} x2={840} y2={cy + 13} stroke="var(--pcb-silk)" strokeWidth={2.6} strokeDasharray="7 4" strokeLinecap="round" />
          <Jaw cx={bCx} cy={cy} />
          <text x={bCx} y={cy + 4} textAnchor="middle" className={styles.annoLabelDim}>
            整束
          </text>
        </g>

        <text x={492} y={cy - 26} className={styles.dimText}>
          信号
        </text>
        <text x={492} y={cy + 32} className={styles.dimText}>
          回流
        </text>
        <text x={840} y={cy - 26} textAnchor="end" className={styles.dimText}>
          屏蔽
        </text>

        {/* 抵消说明 */}
        <g>
          <line
            x1={500}
            y1={cy + 96}
            x2={826}
            y2={cy + 96}
            stroke="var(--pcb-hair-strong)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <text x={663} y={cy + 90} textAnchor="middle" className={styles.annoLabelDim}>
            差模分量等量反向 → 互相抵消
          </text>
          <text x={663} y={cy + 118} textAnchor="middle" className={styles.annoLabel}>
            只剩共模分量
          </text>
        </g>

        {/* 引线标注 */}
        <Pointer from={[aCx - 96, 372]} to={[aCx - 30, cy + 52]} label="钳口" sub="套住导体才有读数" align="end" />
        <Pointer from={[bCx + 106, 372]} to={[bCx + 34, cy + 52]} label="同一个钳口" sub="套住的导体不同" align="start" />
      </svg>
    </FigureShell>
  );
}
