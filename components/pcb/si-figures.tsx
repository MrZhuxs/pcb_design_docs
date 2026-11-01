import { Badge, FigureShell, Pointer } from './pcb-figures';
import styles from './pcb-figures.module.css';

/**
 * 传输线、信号完整性类插图。
 *
 * 与 pcb-figures.tsx 同一套约定（卡片 + SVG + 图例）。
 * 本文件的图有三类画法：
 * - 电路图：端接方式（FIG 11）
 * - 波形图：反射与眼图（FIG 12 / 13）
 * - 平面与剖面混合：串扰、趋肤深度（FIG 14 / 15）
 * 波形一律用解析式采样生成，不手绘点列，免得「看着像」但量不对。
 */

/* =========================================================================
 * 11. 五种端接：一行一种，只看「元件挂在哪里」
 * ========================================================================= */

const TERM_ROWS = [
  '① 串联（源端）',
  '② 并联（终端）',
  '③ 戴维南',
  '④ RC',
  '⑤ 二极管钳位',
];

export function TerminationBank() {
  const rowY = (i: number) => 74 + i * 78;
  const railL = 208;
  const srcX = 180;
  const loadX = 616;
  const gndDrop = 42;

  return (
    <FigureShell
      no="FIG · 11"
      title="五种端接：把「阻抗不连续」用一个网络补回来"
      meta="电路示意 · 传输线阻抗 Z₀"
      legend={[
        { n: 1, label: '串联端接', hint: '源端串 R ≈ Z₀ − R_out；功耗低，只适合点对点' },
        { n: 2, label: '并联端接', hint: '终端接 R = Z₀ 到地；简单但静态功耗大' },
        { n: 3, label: '戴维南端接', hint: '两个电阻分压，等效 Z₀；功耗小于并联' },
        { n: 4, label: 'RC 端接', hint: 'R + C 到地；没有直流功耗，只对高频有效' },
        { n: 5, label: '二极管端接', hint: '肖特基钳位；只压过冲，不消除反射' },
      ]}
      caption="五种端接解决的是同一个问题：让信号在末端看到的阻抗等于 Z₀，从而不再反射。差别在于「在哪里补」和「代价是什么」——串联省功耗但拖慢边沿，并联最直接但一直耗电，RC 折中但只对高频有效，二极管只是钳位、并不真正匹配。"
      note="无论哪一种，都要放在「阻抗不连续点」附近：串联电阻要靠近源端引脚，并联与 RC 要靠近接收端，否则电阻与负载之间的那段线仍然是不连续的。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-term-title" className={styles.svg}>
        <title id="fig-term-title">
          五种端接方式并排示意：串联电阻接在源端与传输线之间；并联电阻从终端接到地；戴维南用两个电阻分别接电源与地；RC 端接为电阻与电容串联到地；二极管端接用两个肖特基二极管分别钳位到电源与地
        </title>

        <defs>
          <marker id="term-dot" viewBox="0 0 6 6" refX={3} refY={3} markerWidth={4} markerHeight={4}>
            <circle cx={3} cy={3} r={2.4} fill="var(--pcb-wire)" />
          </marker>
        </defs>

        {TERM_ROWS.map((label, i) => {
          const y = rowY(i);
          const gy = y + gndDrop;
          return (
            <g key={`term-${i}`}>
              {/* 行分隔 */}
              <line x1={30} y1={y + 62} x2={870} y2={y + 62} stroke="var(--pcb-hair)" strokeWidth={1} />
              {/* 行名 */}
              <text x={30} y={y + 6} className={styles.annoLabel}>
                {label}
              </text>

              {/* 源与负载 */}
              <rect x={srcX - 22} y={y - 11} width={44} height={22} rx={4} fill="none" stroke="var(--pcb-wire)" strokeWidth={1.4} />
              <text x={srcX} y={y + 4} textAnchor="middle" className={styles.panelMeta}>
                源
              </text>
              <rect x={loadX - 24} y={y - 11} width={48} height={22} rx={4} fill="none" stroke="var(--pcb-wire)" strokeWidth={1.4} />
              <text x={loadX} y={y + 4} textAnchor="middle" className={styles.panelMeta}>
                负载
              </text>

              {/* 地轨 */}
              <line x1={srcX} y1={gy} x2={loadX} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.2} />
              <line x1={srcX} y1={y + 11} x2={srcX} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.2} />
              <g stroke="var(--pcb-wire)" strokeWidth={1.2}>
                <line x1={420} y1={gy} x2={420} y2={gy + 8} />
                <line x1={410} y1={gy + 8} x2={430} y2={gy + 8} />
                <line x1={414} y1={gy + 13} x2={426} y2={gy + 13} />
              </g>

              {/* 串联：电阻串在源与线之间 */}
              {i === 0 ? (
                <g>
                  <line x1={srcX + 22} y1={y} x2={railL - 14} y2={y} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <rect x={railL - 14} y={y - 6} width={28} height={12} rx={1} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <text x={railL} y={y - 12} textAnchor="middle" className={styles.dimText}>
                    R
                  </text>
                  <line x1={railL + 14} y1={y} x2={loadX - 24} y2={y} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                </g>
              ) : (
                <line x1={srcX + 22} y1={y} x2={loadX - 24} y2={y} stroke="var(--pcb-wire)" strokeWidth={1.6} />
              )}

              {/* 传输线标注 */}
              <text x={(srcX + loadX) / 2} y={y - 10} textAnchor="middle" className={styles.code}>
                Z₀
              </text>

              {/* 并联 */}
              {i === 1 && (
                <g>
                  <line x1={540} y1={y} x2={540} y2={y + 14} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <rect x={534} y={y + 14} width={12} height={28} rx={1} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <text x={556} y={y + 32} className={styles.dimText}>
                    R = Z₀
                  </text>
                  <line x1={540} y1={y + 42} x2={540} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                </g>
              )}

              {/* 戴维南 */}
              {i === 2 && (
                <g>
                  <line x1={440} y1={y - 34} x2={640} y2={y - 34} stroke="var(--pcb-wire)" strokeWidth={1.4} />
                  <text x={648} y={y - 30} className={styles.code}>
                    VCC
                  </text>
                  <line x1={540} y1={y} x2={540} y2={y - 20} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <rect x={534} y={y - 20} width={12} height={20} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y - 34} x2={540} y2={y - 20} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y} x2={540} y2={y + 14} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <rect x={534} y={y + 14} width={12} height={20} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y + 34} x2={540} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <text x={556} y={y + 6} className={styles.dimText}>
                    R1 / R2
                  </text>
                </g>
              )}

              {/* RC */}
              {i === 3 && (
                <g>
                  <line x1={540} y1={y} x2={540} y2={y + 12} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <rect x={534} y={y + 12} width={12} height={20} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y + 32} x2={540} y2={y + 38} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <g stroke="var(--pcb-wire)" strokeWidth={1.8}>
                    <line x1={528} y1={y + 38} x2={552} y2={y + 38} />
                    <line x1={528} y1={y + 45} x2={552} y2={y + 45} />
                  </g>
                  <line x1={540} y1={y + 45} x2={540} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <text x={560} y={y + 30} className={styles.dimText}>
                    R
                  </text>
                  <text x={560} y={y + 46} className={styles.dimText}>
                    C
                  </text>
                </g>
              )}

              {/* 二极管 */}
              {i === 4 && (
                <g>
                  <line x1={440} y1={y - 34} x2={640} y2={y - 34} stroke="var(--pcb-wire)" strokeWidth={1.4} />
                  <text x={648} y={y - 30} className={styles.code}>
                    VCC
                  </text>
                  <line x1={540} y1={y} x2={540} y2={y - 16} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <path d={`M534 ${y - 14} L546 ${y - 14} L540 ${y - 26} z`} fill="var(--pcb-wire)" />
                  <line x1={534} y1={y - 26} x2={546} y2={y - 26} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y - 26} x2={540} y2={y - 34} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y} x2={540} y2={y + 14} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <path d={`M534 ${y + 26} L546 ${y + 26} L540 ${y + 14} z`} fill="var(--pcb-wire)" />
                  <line x1={534} y1={y + 26} x2={546} y2={y + 26} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                  <line x1={540} y1={y + 26} x2={540} y2={gy} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                </g>
              )}

              <Badge x={150} y={y + 4} n={i + 1} />
            </g>
          );
        })}
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 12. 反射波形：理想阶跃 vs 有反射的阶跃
 * ========================================================================= */

export function ReflectionWave() {
  /** 绘图坐标 */
  const X = (t: number) => 360 + t * 118;
  const Y = (v: number) => 306 - v * 148;
  const ts = Array.from({ length: 121 }, (_, i) => -1.3 + i * 0.035);

  /** 反射后的阶跃：1 + 过冲项 */
  const step = (t: number) => (t < 0 ? 0 : 1);
  const ring = (t: number) => (t < 0 ? 0 : 1 + 0.42 * Math.exp(-t / 0.86) * Math.cos(6.4 * t));

  const toPath = (f: (t: number) => number) =>
    ts.map((t, i) => `${i === 0 ? 'M' : 'L'}${X(t).toFixed(1)} ${Y(f(t)).toFixed(1)}`).join(' ');

  return (
    <FigureShell
      no="FIG · 12"
      title="反射是怎么把方波变成振铃的"
      meta="波形示意 · Γ = (Z_L − Z₀)/(Z_L + Z₀)"
      legend={[
        { n: 1, label: '理想阶跃', hint: '参考：只有入射波，没有反射' },
        { n: 2, label: '过冲 / 下冲', hint: '超出逻辑电平范围，可能击穿 ESD 二极管' },
        { n: 3, label: '振铃与震荡', hint: '多次反射叠加，在阈值附近反复穿越' },
      ]}
      caption="方波的高频分量在阻抗不连续点被反射回来，与原信号叠加——叠加的结果就是过冲、下冲和一串逐渐衰减的振荡。所谓「振铃」不是一种新的信号，它就是反射。"
      note="Γ 的符号决定极性：负载开路（Z_L = ∞）时 Γ = +1，反射波与入射波同相，叠加出过冲；负载短路（Z_L = 0）时 Γ = −1，反射波反相，先出现下冲。"
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-refl-title" className={styles.svg}>
        <title id="fig-refl-title">
          反射波形图：虚线为理想阶跃，实线为带反射的阶跃，先冲高约百分之四十二形成过冲，随后在目标电平上下振荡并逐渐收敛，标注出过冲、下冲与振铃区
        </title>

        {/* 网格 */}
        {[0, 0.5, 1, 1.5].map((v) => (
          <line key={`gy-${v}`} x1={100} y1={Y(v)} x2={760} y2={Y(v)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}
        {[-1, 0, 1, 2].map((t) => (
          <line key={`gx-${t}`} x1={X(t)} y1={Y(1.6)} x2={X(t)} y2={Y(0)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}

        {/* 坐标轴 */}
        <g stroke="var(--pcb-hair-strong)" strokeWidth={1.2} fill="none">
          <line x1={100} y1={Y(0)} x2={772} y2={Y(0)} />
          <line x1={100} y1={Y(0)} x2={100} y2={Y(1.62)} />
        </g>
        {[0, 0.5, 1, 1.5].map((v) => (
          <text key={`ty-${v}`} x={92} y={Y(v) + 4} textAnchor="end" className={styles.dimText}>
            {v === 0 ? '0' : v.toFixed(1)}
          </text>
        ))}
        <text x={96} y={Y(1.62) - 8} className={styles.dimText}>
          U / U₀
        </text>
        <text x={772} y={Y(0) + 22} textAnchor="end" className={styles.dimText}>
          t
        </text>

        {/* 逻辑阈值参考 */}
        {[0.3, 0.7].map((v) => (
          <line key={`th-${v}`} x1={100} y1={Y(v)} x2={760} y2={Y(v)} stroke="var(--pcb-hair)" strokeWidth={1} strokeDasharray="2 5" />
        ))}
        <text x={764} y={Y(0.7) + 4} className={styles.dimText}>
          阈值
        </text>

        {/* 理想阶跃（虚线） */}
        <path d={toPath(step)} fill="none" stroke="var(--pcb-trace-side)" strokeWidth={2} strokeDasharray="6 5" />
        {/* 带反射的阶跃 */}
        <path d={toPath(ring)} fill="none" stroke="var(--pcb-callout)" strokeWidth={2.6} />

        {/* 过冲标注 */}
        <circle cx={X(0.245)} cy={Y(ring(0.245))} r={4} fill="var(--pcb-callout)" />
        <circle cx={X(0.73)} cy={Y(ring(0.73))} r={4} fill="var(--pcb-callout)" />

        <Badge x={X(0.245)} y={Y(1.42) - 16} n={2} />
        <Badge x={760} y={Y(1.0) - 16} n={1} />
        <Badge x={X(1.6)} y={Y(0.55)} n={3} />

        <Pointer from={[470, 78]} to={[X(0.9), Y(ring(0.9))]} label="振铃" sub="多次反射叠加，逐渐收敛" align="start" />
        <Pointer from={[150, 118]} to={[X(0.245), Y(1.42)]} label="过冲" sub="≈ 0.4 U₀（Γ ≈ 0.5 时）" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 13. 眼图：张开与闭合
 * ========================================================================= */

export function EyeDiagram() {
  /** 眼图坐标：一个眼宽 = 180，中心 x = 320 */
  const yH = 150;
  const yL = 256;
  const yM = (yH + yL) / 2;
  const cx = 320;

  const eyeTraces = (jitter: number, amp: number, spread: number) => {
    const items: string[] = [];
    const lift = (yH - yL) / 2 * amp;
    for (let k = -2; k <= 2; k++) {
      const dx = k * spread;
      // 上升沿
      items.push(
        `M${cx - 150 + dx} ${yM + lift} C${cx - 60 + dx} ${yM + lift} ${cx - 20 + dx} ${yM - lift * 0.55} ${cx + jitter * 0.4} ${yM - lift}`,
      );
      // 下降沿
      items.push(
        `M${cx - 150 + dx} ${yM - lift} C${cx - 60 + dx} ${yM - lift} ${cx - 20 + dx} ${yM + lift * 0.55} ${cx + jitter * 0.4} ${yM + lift}`,
      );
    }
    return items;
  };

  /** 闭合的眼：多条轨迹的相位、幅度、抖动都被打乱，挤成一团 */
  const closedTraces = Array.from({ length: 7 }, (_, k) => {
    const a = 8 + k * 5;
    const b = ((k * 37) % 23) - 11;
    return `M664 ${yM + b} C700 ${yM + a + b} 730 ${yM - a + b} 760 ${yM + b} S810 ${yM - a * 0.8 + b} 856 ${yM + b * 0.6}`;
  });

  return (
    <FigureShell
      no="FIG · 13"
      title="眼图：把上千个比特叠在一张图上"
      meta="眼图示意 · 眼高 / 眼宽 / 交叉点 / 抖动"
      legend={[
        { n: 1, label: '眼高（垂直张开度）', hint: '噪声容限：还能容忍多大的幅度干扰' },
        { n: 2, label: '眼宽（水平张开度）', hint: '时序容限：还能容忍多大的采样时刻偏移' },
        { n: 3, label: '交叉点与抖动', hint: '交叉点越模糊、抖动越大，采样越危险' },
      ]}
      caption="眼图是信号的「体检报告」：把大量比特按同一个时钟叠起来，张开的菱形就是「这个时刻、这个电平一定是对的」的区域。反射让眼高变小，抖动让眼宽变小，衰减让两者一起变小。"
      note="为什么眼图比单项测量更可信：示波器单看一个上升沿，看不到抖动与码间干扰的统计分布；而眼图把最坏情况直接画出来了——只要采样点落在眼睛张开的地方，误码率就有保证。"
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-eye-title" className={styles.svg}>
        <title id="fig-eye-title">
          眼图：左侧是良好张开的眼，标注眼高与眼宽；右侧是闭合的眼，多条轨迹挤在一起，说明噪声与抖动已经把判决余量吃光
        </title>

        {/* ---------- 左：张开 ---------- */}
        <text x={40} y={54} className={styles.panelTitle}>
          张开：还能判
        </text>
        <rect x={40} y={74} width={560} height={280} rx={8} fill="none" stroke="var(--pcb-hair)" strokeWidth={1} />

        {/* 判决电平与采样点 */}
        <line x1={44} y1={yM} x2={596} y2={yM} stroke="var(--pcb-hair-strong)" strokeWidth={1} strokeDasharray="3 4" />
        <line x1={cx} y1={80} x2={cx} y2={348} stroke="var(--pcb-hair-strong)" strokeWidth={1} strokeDasharray="3 4" />

        {eyeTraces(0, 1, 9).map((d, i) => (
          <path key={`eye-${i}`} d={d} fill="none" stroke="var(--pcb-trace-top)" strokeWidth={1.8} opacity={0.85} />
        ))}

        {/* 眼高 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={cx + 62} y1={yH - 6} x2={cx + 62} y2={yL + 6} />
          <line x1={cx + 56} y1={yH - 6} x2={cx + 68} y2={yH - 6} />
          <line x1={cx + 56} y1={yL + 6} x2={cx + 68} y2={yL + 6} />
        </g>
        <text x={cx + 74} y={yM} className={styles.dimText}>
          眼高
        </text>

        {/* 眼宽 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={cx - 62} y1={yM + 40} x2={cx + 62} y2={yM + 40} />
          <line x1={cx - 62} y1={yM + 34} x2={cx - 62} y2={yM + 46} />
          <line x1={cx + 62} y1={yM + 34} x2={cx + 62} y2={yM + 46} />
        </g>
        <text x={cx} y={yM + 58} textAnchor="middle" className={styles.dimText}>
          眼宽
        </text>

        <Badge x={cx + 62} y={yH - 22} n={1} />
        <Badge x={cx} y={yM + 70} n={2} />
        <Badge x={cx - 18} y={yM - 26} n={3} />

        {/* ---------- 右：闭合 ---------- */}
        <text x={640} y={54} className={styles.panelTitle}>
          闭合：判不了
        </text>
        <rect x={640} y={74} width={220} height={280} rx={8} fill="none" stroke="var(--pcb-hair)" strokeWidth={1} />
        <line x1={644} y1={yM} x2={856} y2={yM} stroke="var(--pcb-hair-strong)" strokeWidth={1} strokeDasharray="3 4" />
        <g>
          {closedTraces.map((d, i) => (
            <path key={`cl-${i}`} d={d} fill="none" stroke="var(--pcb-callout)" strokeWidth={1.6} opacity={0.62} />
          ))}
        </g>
        <text x={750} y={yM - 62} textAnchor="middle" className={styles.panelSub}>
          噪声 + 抖动 + 衰减
        </text>
        <text x={750} y={yM + 78} textAnchor="middle" className={styles.panelSub}>
          眼高、眼宽双双收窄 → BER 升高
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 14. 串扰：NEXT / FEXT，微带与带状线的差别
 * ========================================================================= */

export function CrosstalkChannels() {
  const traceH = 12;

  return (
    <FigureShell
      no="FIG · 14"
      title="串扰的两端：NEXT 与 FEXT"
      meta="俯视 + 剖面 · 耦合长度 L"
      legend={[
        { n: 1, label: '攻击线（aggressor）', hint: '信号翻转的那一根' },
        { n: 2, label: '受害线（victim）', hint: '被耦合出噪声的那一根' },
        { n: 3, label: 'NEXT 近端串扰', hint: '在受害线靠近源端一侧测到，随耦合长度先增大后饱和' },
        { n: 4, label: 'FEXT 远端串扰', hint: '在受害线远端测到；带状线中因介质均匀、两通道抵消，显著更小' },
      ]}
      caption="串扰不是一个方向上的东西：近端（NEXT）是耦合在源端一侧堆起来的，远端（FEXT）则是随信号一路跑过去、沿途不断累加的。这也是为什么带状线的 FEXT 特别小——上下介质对称，容性与感性两条通道在前向方向上互相抵消。"
      note="「远端串扰在带状线里几乎消失」是有前提的：两条线的传播速度必须一致。一旦叠层不对称、或者用了不同介质，抵消就不彻底，FEXT 会重新出现。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-xt-title" className={styles.svg}>
        <title id="fig-xt-title">
          串扰示意图：上行是微带线情形，攻击线与受害线平行，两侧分别标出近端串扰与远端串扰；下行是带状线情形，上下均有介质与平面，远端串扰被大幅抵消
        </title>

        <defs>
          <marker id="xt-arrow" viewBox="0 0 8 8" refX={4} refY={4} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--pcb-callout)" />
          </marker>
        </defs>

        {[
          { y: 70, title: '微带线：一边是空气，一边是 FR-4', fext: 0.95, note: '介质不均匀 → 抵消不彻底' },
          { y: 270, title: '带状线：上下都是 FR-4', fext: 0.22, note: '介质对称 → FEXT 几乎抵消' },
        ].map((row, ri) => {
          const yA = row.y + 46;
          const yV = yA + 34;
          return (
            <g key={`row-${ri}`}>
              <text x={40} y={row.y + 18} className={styles.panelTitle}>
                {ri === 0 ? '①' : '②'} {row.title}
              </text>
              <text x={40} y={row.y + 38} className={styles.panelSub}>
                {row.note}
              </text>

              <rect x={40} y={row.y + 30} width={820} height={110} rx={8} fill="var(--pcb-mask)" opacity={0.92} />
              {/* 攻击线 */}
              <rect x={90} y={yA - traceH / 2} width={720} height={traceH} rx={1} fill="var(--pcb-copper)" />
              {/* 受害线 */}
              <rect x={90} y={yV - traceH / 2} width={720} height={traceH} rx={1} fill="var(--pcb-copper)" opacity={0.72} />
              <text x={96} y={yA - 12} className={styles.silkText} fontSize={10}>
                攻击线 · 驱动 →
              </text>
              <text x={96} y={yV + 24} className={styles.silkText} fontSize={10}>
                受害线
              </text>

              {/* NEXT：源端一侧 */}
              <path d={`M${118} ${yV - 16} L${118} ${yV - 3}`} stroke="var(--pcb-callout)" strokeWidth={1.8} markerEnd="url(#xt-arrow)" />
              <text x={126} y={yV - 20} className={styles.silkText} fontSize={10}>
                NEXT
              </text>

              {/* FEXT：远端 */}
              <path
                d={`M${790} ${yV - 16} L${790} ${yV - 3}`}
                stroke="var(--pcb-callout)"
                strokeWidth={1.8}
                opacity={row.fext}
                markerEnd="url(#xt-arrow)"
              />
              <text x={782} y={yV - 20} textAnchor="end" className={styles.silkText} fontSize={10} opacity={row.fext}>
                FEXT
              </text>

              {/* 耦合长度 */}
              <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none" opacity={0.7}>
                <line x1={90} y1={row.y + 128} x2={810} y2={row.y + 128} />
                <line x1={90} y1={row.y + 123} x2={90} y2={row.y + 133} />
                <line x1={810} y1={row.y + 123} x2={810} y2={row.y + 133} />
              </g>
              <text x={450} y={row.y + 144} textAnchor="middle" className={styles.dimText}>
                耦合长度 L：越长，串扰越大
              </text>

              <Badge x={70} y={yA} n={1} />
              <Badge x={70} y={yV} n={2} />
              <Badge x={150} y={yV - 40} n={3} />
              <Badge x={756} y={yV - 40} n={4} />
            </g>
          );
        })}

        <Pointer from={[430, 420]} to={[300, 300]} label="上下对称时，容性与感性补偿互相抵消" sub="所以带状线的 FEXT 可以忽略" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 15. 趋肤深度：δ = 66 / √f(MHz) µm
 * ========================================================================= */

export function SkinDepth() {
  const X = (f: number) => 150 + (Math.log10(f) / 4) * 540;
  const Y = (d: number) => 330 - (d / 70) * 250;
  const delta = (f: number) => 66 / Math.sqrt(f);

  const samples = Array.from({ length: 120 }, (_, i) => Math.pow(10, (i / 119) * 4));
  const path = (() => {
    // 以对数横轴采样，画成折线
    let d = '';
    samples.forEach((f, i) => {
      d += `${i === 0 ? 'M' : 'L'}${X(f).toFixed(1)} ${Y(delta(f)).toFixed(1)}`;
    });
    return d;
  })();

  return (
    <FigureShell
      no="FIG · 15"
      title="趋肤效应：频率越高，铜越「薄」"
      meta="δ ≈ 66 / √f(MHz) µm"
      legend={[
        { n: 1, label: '1 oz 铜 = 35 µm', hint: '低于这条频率线，电流还占满整个铜厚' },
        { n: 2, label: '100 MHz：δ ≈ 6.6 µm', hint: '只剩铜厚的五分之一在导电' },
        { n: 3, label: '1 GHz：δ ≈ 2.1 µm', hint: '损耗随 √f 增大，边沿被吃掉' },
      ]}
      caption="交流电流不会均匀分布在导体里，而是往表面挤。频率越高挤得越狠，有效导电截面越小，交流电阻越大——这就是「导体损耗」，也是高速信号走远了边沿变缓的第一号原因。"
      note="δ = 35 µm 对应的频率约为 3.6 MHz。换句话说，只要信号的高频分量超过几 MHz，1 oz 铜的整个厚度就已经不参与导电了；再往上加铜厚，对损耗的改善很有限。"
    >
      <svg viewBox="0 0 900 430" role="img" aria-labelledby="fig-skin-title" className={styles.svg}>
        <title id="fig-skin-title">
          趋肤深度随频率变化曲线：横轴为 1 兆赫至 10 吉赫的对数频率，纵轴为 0 到 70 微米，铜厚 35 微米处画一条水平参考线，100 兆赫时趋肤深度约 6.6 微米，1 吉赫时约 2.1 微米
        </title>

        {[0.1, 0.2, 0.3, 0.4].map((d) => (
          <line key={`gy-${d}`} x1={150} y1={Y(d * 100)} x2={690} y2={Y(d * 100)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}
        {[1, 10, 100, 1000, 10000].map((f) => (
          <line key={`gx-${f}`} x1={X(f)} y1={Y(70)} x2={X(f)} y2={Y(0)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}

        <g stroke="var(--pcb-hair-strong)" strokeWidth={1.2} fill="none">
          <line x1={150} y1={Y(0)} x2={700} y2={Y(0)} />
          <line x1={150} y1={Y(0)} x2={150} y2={Y(70)} />
        </g>

        {[10, 20, 30, 40, 50, 60, 70].map((d) => (
          <text key={`ty-${d}`} x={142} y={Y(d) + 4} textAnchor="end" className={styles.dimText}>
            {d}
          </text>
        ))}
        {[
          { f: 1, t: '1M' },
          { f: 10, t: '10M' },
          { f: 100, t: '100M' },
          { f: 1000, t: '1G' },
          { f: 10000, t: '10G' },
        ].map((it) => (
          <g key={`tx-${it.f}`}>
            <line x1={X(it.f)} y1={Y(0)} x2={X(it.f)} y2={Y(0) + 6} stroke="var(--pcb-hair-strong)" strokeWidth={1} />
            <text x={X(it.f)} y={Y(0) + 22} textAnchor="middle" className={styles.dimText}>
              {it.t}
            </text>
          </g>
        ))}
        <text x={700} y={Y(0) + 42} textAnchor="end" className={styles.dimText}>
          频率 / MHz
        </text>
        <text x={142} y={Y(70) - 12} textAnchor="end" className={styles.dimText}>
          δ / µm
        </text>

        {/* 铜厚参考线 */}
        <line x1={150} y1={Y(35)} x2={690} y2={Y(35)} stroke="var(--pcb-copper-2)" strokeWidth={2} strokeDasharray="7 5" />
        <text x={520} y={Y(35) - 8} textAnchor="middle" className={styles.dimText}>
          1 oz 铜厚 35 µm
        </text>

        <path d={path} fill="none" stroke="var(--pcb-callout)" strokeWidth={2.6} />

        {/* 两个关键点 */}
        {[
          { f: 100, n: 2 },
          { f: 1000, n: 3 },
        ].map((p) => (
          <g key={`pt-${p.f}`}>
            <circle cx={X(p.f)} cy={Y(delta(p.f))} r={4.2} fill="var(--pcb-callout)" />
            <line x1={X(p.f)} y1={Y(delta(p.f))} x2={X(p.f)} y2={Y(0)} stroke="var(--pcb-callout)" strokeWidth={1} strokeDasharray="3 4" opacity={0.6} />
            <Badge x={X(p.f) + 18} y={Y(delta(p.f)) - 14} n={p.n} />
          </g>
        ))}

        <Badge x={330} y={Y(35) - 20} n={1} />

        <Pointer from={[300, 96]} to={[X(100), Y(6.6)]} label="100 MHz ≈ 6.6 µm" sub="只剩 1/5 铜厚导电" align="start" />
        <Pointer from={[560, 150]} to={[X(1000), Y(2.1)]} label="1 GHz ≈ 2.1 µm" sub="损耗随 √f 上升" align="start" />
      </svg>
    </FigureShell>
  );
}
