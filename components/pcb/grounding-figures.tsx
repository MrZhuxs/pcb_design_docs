import { Badge, FigureShell, Pointer } from './pcb-figures';
import styles from './pcb-figures.module.css';

/**
 * 接地、电源完整性（PDN）类插图。
 *
 * 三张图的画法各不相同：
 * - FIG 16 三种接地方式：并列方块图，只画「地线怎么走」
 * - FIG 17 平面分割与回流：俯视平面图，把回流路径画成可见的走线
 * - FIG 18 PDN 阻抗曲线 + 电容摆放：左曲线右示意图
 */

/* =========================================================================
 * 16. 单点 / 多点 / 混合接地
 * ========================================================================= */

const SCHEMES = [
  {
    title: '① 单点接地',
    freq: 'f < 1 MHz',
    why: '无地环路，避免共阻抗耦合',
    cost: '地线长 → 高频感抗大',
    mode: 'one',
  },
  {
    title: '② 混合接地',
    freq: '1 ~ 10 MHz',
    why: '低频走单点，高频经电容旁路',
    cost: '设计复杂，要看实际线长',
    mode: 'mixed',
  },
  {
    title: '③ 多点接地',
    freq: 'f > 10 MHz',
    why: '路径最短、接地阻抗最低',
    cost: '易形成地环路',
    mode: 'multi',
  },
] as const;

export function GroundingSchemes() {
  const panelX = (i: number) => 40 + i * 288;
  const bx = (i: number, j: number) => panelX(i) + 24 + j * 68;
  const blockY = 118;
  const blockW = 52;
  const blockH = 34;
  const commonY = 236;
  const planeY = 286;

  return (
    <FigureShell
      no="FIG · 16"
      title="三种接地：差别只在「地线有多长」"
      meta="方块图 · Z = 2πfL"
      legend={[
        { n: 1, label: '电路模块', hint: '数字、模拟、接口各算一块' },
        { n: 2, label: '汇合点 / 地平面', hint: '单点是唯一汇合处，多点是一整片铜' },
        { n: 3, label: '旁路电容', hint: '混合接地里给高频电流开一条短路' },
      ]}
      caption="单点与多点的取舍，本质是「地线的电感 L」在多高频率下变得不可忽略。低频时 L 可以不理，重点是别形成环路；高频时 Z = 2πfL 迅速变大，地线必须越短越好，环路只能靠完整平面来消化。"
      note="100 MHz 的综合题标准答案：选多点接地。理由链条写全——频率远高于 10 MHz → 地线感抗 2πfL 显著增大 → 单点接地路径长、阻抗高 → 形成地环路与地电位差 → 回流不畅、共模辐射 → 多点接地就近入平面，路径最短、阻抗最低、环路面积最小。"
    >
      <svg viewBox="0 0 900 430" role="img" aria-labelledby="fig-gnd-title" className={styles.svg}>
        <title id="fig-gnd-title">
          三种接地方式对比：单点接地把三个模块的地线汇到一个点再进地平面；混合接地让低频模块单点汇合，高频模块经电容就近入平面；多点接地让每个模块直接向下接入大地平面
        </title>

        {SCHEMES.map((s, i) => {
          const px = panelX(i);
          return (
            <g key={`sch-${i}`}>
              <rect x={px} y={54} width={268} height={286} rx={10} fill="none" stroke="var(--pcb-hair)" strokeWidth={1} />
              <text x={px + 16} y={78} className={styles.panelTitle}>
                {s.title}
              </text>
              <text x={px + 16} y={98} className={styles.code}>
                {s.freq}
              </text>

              {/* 模块 */}
              {[0, 1, 2].map((j) => (
                <g key={`blk-${i}-${j}`}>
                  <rect
                    x={bx(i, j)}
                    y={blockY}
                    width={blockW}
                    height={blockH}
                    rx={3}
                    fill="var(--pcb-component)"
                    stroke="var(--pcb-hair-strong)"
                    strokeWidth={1}
                  />
                  <text x={bx(i, j) + blockW / 2} y={blockY + 21} textAnchor="middle" className={styles.panelMeta}>
                    {['数字', '模拟', '接口'][j]}
                  </text>
                </g>
              ))}

              {/* 单点 / 混合：下垂到汇合点 */}
              {s.mode !== 'multi' && (
                <g stroke="var(--pcb-wire)" strokeWidth={1.6} fill="none">
                  {[0, 1, 2].map((j) => (
                    <path
                      key={`ln-${i}-${j}`}
                      d={`M${bx(i, j) + blockW / 2} ${blockY + blockH} L${bx(i, j) + blockW / 2} ${commonY - 24} L${px + 134} ${commonY - 24} L${px + 134} ${commonY}`}
                      opacity={s.mode === 'mixed' && j === 2 ? 0.35 : 1}
                    />
                  ))}
                </g>
              )}

              {/* 单点：汇合点 */}
              {s.mode === 'one' && (
                <g>
                  <circle cx={px + 134} cy={commonY} r={5} fill="var(--pcb-callout)" />
                  <line x1={px + 134} y1={commonY} x2={px + 134} y2={planeY} stroke="var(--pcb-wire)" strokeWidth={1.8} />
                </g>
              )}

              {/* 混合：低频汇合 + 高频走电容 */}
              {s.mode === 'mixed' && (
                <g>
                  <circle cx={px + 134} cy={commonY} r={5} fill="var(--pcb-callout)" />
                  <line x1={px + 134} y1={commonY} x2={px + 134} y2={planeY} stroke="var(--pcb-wire)" strokeWidth={1.8} />
                  <line
                    x1={bx(i, 2) + blockW / 2}
                    y1={blockY + blockH}
                    x2={bx(i, 2) + blockW / 2}
                    y2={commonY - 6}
                    stroke="var(--pcb-wire)"
                    strokeWidth={1.6}
                  />
                  <g stroke="var(--pcb-callout)" strokeWidth={1.8}>
                    <line x1={bx(i, 2) + blockW / 2 - 11} y1={commonY - 6} x2={bx(i, 2) + blockW / 2 + 11} y2={commonY - 6} />
                    <line x1={bx(i, 2) + blockW / 2 - 11} y1={commonY + 2} x2={bx(i, 2) + blockW / 2 + 11} y2={commonY + 2} />
                  </g>
                  <line
                    x1={bx(i, 2) + blockW / 2}
                    y1={commonY + 2}
                    x2={bx(i, 2) + blockW / 2}
                    y2={planeY}
                    stroke="var(--pcb-wire)"
                    strokeWidth={1.6}
                  />
                  <text x={bx(i, 2) + blockW / 2 + 16} y={commonY + 4} className={styles.dimText}>
                    C
                  </text>
                </g>
              )}

              {/* 多点：各自直下 */}
              {s.mode === 'multi' && (
                <g stroke="var(--pcb-wire)" strokeWidth={1.8} fill="none">
                  {[0, 1, 2].map((j) => (
                    <line key={`ml-${i}-${j}`} x1={bx(i, j) + blockW / 2} y1={blockY + blockH} x2={bx(i, j) + blockW / 2} y2={planeY} />
                  ))}
                </g>
              )}

              {/* 地平面 */}
              <rect
                x={px + 16}
                y={planeY}
                width={236}
                height={16}
                rx={2}
                fill="var(--pcb-copper-2)"
                opacity={s.mode === 'multi' ? 1 : 0.45}
              />
              <text x={px + 134} y={planeY + 34} textAnchor="middle" className={styles.dimText}>
                {s.mode === 'multi' ? '大面积地平面（多路径并联）' : '系统地'}
              </text>

              <text x={px + 16} y={352} className={styles.panelSub}>
                ✓ {s.why}
              </text>
              <text x={px + 16} y={372} className={styles.panelSub} opacity={0.75}>
                ✗ {s.cost}
              </text>
            </g>
          );
        })}

        <Badge x={panelX(0) + 4} y={blockY + 16} n={1} />
        <Badge x={panelX(2) + 4} y={planeY + 8} n={2} />
        <Badge x={panelX(1) + 236} y={commonY - 4} n={3} />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 17. 跨分割：回流被迫绕行
 * ========================================================================= */

export function SplitPlane() {
  return (
    <FigureShell
      no="FIG · 17"
      title="跨分割：回流路径被切断的那一刻"
      meta="俯视平面 · 回流面积"
      legend={[
        { n: 1, label: '信号线', hint: '从数字区走向模拟区' },
        { n: 2, label: '平面缝隙', hint: '数字地/模拟地之间的分割缝' },
        { n: 3, label: '回流路径', hint: '正常应紧贴信号线正下方，跨缝时必须绕行' },
        { n: 4, label: '缝合电容', hint: '0.01 µF，为高频回流搭一座桥' },
      ]}
      caption="信号的回流电流永远走「阻抗最低」的路径，高频时就是紧贴信号线正下方的平面。一旦平面被缝切开，回流只能绕到缝的尽头——环路面积瞬间从「一条线」变成「一大片」，辐射与串扰同步放大。"
      note="这也是「电源平面分割越多 EMC 越好」这个说法错在哪里：分割越多，回流越破碎。能靠布局分区解决就别分割；非割不可，就在跨接处加缝合电容（0.01 µF），或者干脆绕开。"
    >
      <svg viewBox="0 0 900 440" role="img" aria-labelledby="fig-split-title" className={styles.svg}>
        <title id="fig-split-title">
          两幅平面对比：左图中信号线跨过数字地与模拟地之间的缝隙，回流电流被迫绕到缝的尽头，环路面积很大；右图在跨接处加了一颗缝合电容，回流可以就近通过电容闭合
        </title>

        {[
          { x: 40, ok: false, title: '✗ 直接跨过去', sub: '回流被迫绕行 · 环路面积暴涨' },
          { x: 470, ok: true, title: '✓ 跨接处加缝合电容', sub: '高频回流有了就近回路' },
        ].map((p, i) => (
          <g key={`cv-${i}`}>
            <text x={p.x} y={54} className={styles.panelTitle}>
              {p.title}
            </text>
            <text x={p.x} y={74} className={styles.panelSub}>
              {p.sub}
            </text>

            {/* 两块平面 */}
            <rect x={p.x} y={92} width={190} height={200} rx={3} fill="var(--pcb-copper-2)" opacity={0.55} />
            <rect x={p.x + 212} y={92} width={190} height={200} rx={3} fill="var(--pcb-copper-2)" opacity={0.32} />
            <text x={p.x + 95} y={306} textAnchor="middle" className={styles.dimText}>
              数字地 GND_D
            </text>
            <text x={p.x + 307} y={306} textAnchor="middle" className={styles.dimText}>
              模拟地 GND_A
            </text>

            {/* 缝隙 */}
            <line x1={p.x + 202} y1={92} x2={p.x + 202} y2={292} stroke="var(--pcb-substrate)" strokeWidth={10} />
            <line x1={p.x + 202} y1={92} x2={p.x + 202} y2={292} stroke="var(--pcb-edge)" strokeWidth={1} strokeDasharray="4 4" />

            {/* 信号线 */}
            <line x1={p.x + 30} y1={150} x2={p.x + 372} y2={150} stroke="var(--pcb-trace-top)" strokeWidth={8} strokeLinecap="round" />

            {/* 回流路径 */}
            {p.ok ? (
              <g>
                <path
                  d={`M${p.x + 60} 172 L${p.x + 202} 172`}
                  stroke="var(--pcb-callout)"
                  strokeWidth={2.4}
                  fill="none"
                  strokeDasharray="7 4"
                />
                <path
                  d={`M${p.x + 202} 172 L${p.x + 202} 214`}
                  stroke="var(--pcb-callout)"
                  strokeWidth={2.4}
                  fill="none"
                  strokeDasharray="7 4"
                />
                <path
                  d={`M${p.x + 202} 214 L${p.x + 344} 214`}
                  stroke="var(--pcb-callout)"
                  strokeWidth={2.4}
                  fill="none"
                  strokeDasharray="7 4"
                />
                {/* 缝合电容：接在缝上 */}
                <line x1={p.x + 202} y1={172} x2={p.x + 202} y2={204} stroke="var(--pcb-wire)" strokeWidth={1.6} />
                <g stroke="var(--pcb-wire)" strokeWidth={2}>
                  <line x1={p.x + 191} y1={204} x2={p.x + 213} y2={204} />
                  <line x1={p.x + 191} y1={214} x2={p.x + 213} y2={214} />
                </g>
                <text x={p.x + 220} y={197} className={styles.dimText}>
                  0.01 µF
                </text>
              </g>
            ) : (
              <g>
                {/* 回流绕到缝尽头 */}
                <path
                  d={`M${p.x + 60} 172 L${p.x + 202} 172 L${p.x + 202} 282 L${p.x + 330} 282 L${p.x + 330} 172`}
                  stroke="var(--pcb-callout)"
                  strokeWidth={2.4}
                  fill="none"
                  strokeDasharray="7 4"
                />
                <text x={p.x + 236} y={278} className={styles.dimText}>
                  绕行
                </text>
                {/* 环路面积阴影 */}
                <path
                  d={`M${p.x + 60} 150 L${p.x + 330} 150 L${p.x + 330} 282 L${p.x + 202} 282 L${p.x + 202} 172 L${p.x + 60} 172 z`}
                  fill="var(--pcb-callout)"
                  opacity={0.09}
                />
              </g>
            )}

            <Badge x={p.x + 180} y={138} n={1} />
            <Badge x={p.x + 184} y={250} n={2} />
            {!p.ok && <Badge x={p.x + 350} y={262} n={3} />}
            {p.ok && <Badge x={p.x + 214} y={186} n={4} />}
          </g>
        ))}

        <Pointer
          from={[300, 400]}
          to={[212, 300]}
          label="跨缝那一段，是整块板最容易出 EMC 问题的地方"
          sub="环路面积变大 → 辐射 ∝ 面积 × di/dt"
          align="start"
        />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 18. PDN 阻抗曲线 + 电容摆放
 * ========================================================================= */

type Cx = { re: number; im: number };

const cmul = (a: Cx, b: Cx): Cx => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
const cdiv = (a: Cx, b: Cx): Cx => {
  const d = b.re * b.re + b.im * b.im;
  return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d };
};
const zcap = (f: number, C: number, L: number, esr: number): Cx => {
  const w = 2 * Math.PI * f;
  return { re: esr, im: w * L - 1 / (w * C) };
};

export function DecouplingNetwork() {
  const X = (f: number) => 100 + ((Math.log10(f) - 3) / 6) * 460;
  const Y = (z: number) => 330 - ((Math.log10(z) + 2) / 5) * 250;

  const zPar = (f: number) => {
    const z1 = zcap(f, 100e-9, 1.2e-9, 0.02);
    const z2 = zcap(f, 1e-9, 0.55e-9, 0.05);
    return cdiv(cmul(z1, z2), { re: z1.re + z2.re, im: z1.im + z2.im });
  };

  const samples = Array.from({ length: 200 }, (_, i) => Math.pow(10, 3 + (i / 199) * 6));
  const curve = (() => {
    let d = '';
    samples.forEach((f) => {
      const z = zPar(f);
      const mag = Math.hypot(z.re, z.im);
      if (mag < 0.008 || mag > 1200) return;
      d += `${d ? 'L' : 'M'}${X(f).toFixed(1)} ${Y(mag).toFixed(1)}`;
    });
    return d;
  })();

  return (
    <FigureShell
      no="FIG · 18"
      title="PDN 阻抗：为什么一颗电容不够"
      meta="阻抗-频率曲线 + 摆放示意"
      legend={[
        { n: 1, label: '目标阻抗 Z_target', hint: '整条曲线都压在它下面才算过' },
        { n: 2, label: '自谐振点', hint: '容抗与感抗抵消，此处阻抗最低' },
        { n: 3, label: '反谐振峰', hint: '两种容值并联时在中间频段反而变高' },
        { n: 4, label: '多过孔下地', hint: '每多一个过孔，接地电感就并联减小一分' },
      ]}
      caption="每颗电容自己也是一条 Z 曲线：低频时容性、越往高频阻抗越低，到自谐振点触底，再往上是感性的、阻抗重新升高。所以单颗电容只能管一段频带；容值不同的两颗并联能接得更宽，但在它们中间会顶出一个反谐振峰。"
      note="反谐振峰为什么会被顶起来：在一颗已经呈感性的频段上并一颗还呈容性的电容，两者构成 LC 并联谐振。工程上的对策不是「多加几颗」了事，而是选好容值间隔、控制 ESL（用小封装、多过孔），必要时用平面电容或埋容。"
    >
      <svg viewBox="0 0 900 430" role="img" aria-labelledby="fig-pdn-title" className={styles.svg}>
        <title id="fig-pdn-title">
          左图为电源分配网络的阻抗随频率变化曲线，呈两个低谷与一个中间的反谐振峰，并有一条目标阻抗水平线；右图为去耦电容摆放示意，大容值电容在板级入口、小容值电容紧贴芯片引脚，每个电容用多个过孔就近下地平面
        </title>

        {/* ---------- 左：阻抗曲线 ---------- */}
        <text x={100} y={52} className={styles.panelTitle}>
          阻抗 vs 频率
        </text>

        {[1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9].map((f) => (
          <line key={`gx-${f}`} x1={X(f)} y1={Y(0.01)} x2={X(f)} y2={Y(1000)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}
        {[0.01, 0.1, 1, 10, 100, 1000].map((z) => (
          <line key={`gy-${z}`} x1={100} y1={Y(z)} x2={560} y2={Y(z)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}

        <g stroke="var(--pcb-hair-strong)" strokeWidth={1.2} fill="none">
          <line x1={100} y1={Y(0.01)} x2={570} y2={Y(0.01)} />
          <line x1={100} y1={Y(0.01)} x2={100} y2={Y(1000)} />
        </g>

        {[
          { f: 1e3, t: '1k' },
          { f: 1e5, t: '100k' },
          { f: 1e7, t: '10M' },
          { f: 1e9, t: '1G' },
        ].map((it) => (
          <text key={`tx-${it.f}`} x={X(it.f)} y={Y(0.01) + 18} textAnchor="middle" className={styles.dimText}>
            {it.t}
          </text>
        ))}
        <text x={570} y={Y(0.01) + 38} textAnchor="end" className={styles.dimText}>
          频率 / Hz
        </text>
        {[
          { z: 0.01, t: '10m' },
          { z: 1, t: '1' },
          { z: 100, t: '100' },
        ].map((it) => (
          <text key={`ty-${it.z}`} x={92} y={Y(it.z) + 4} textAnchor="end" className={styles.dimText}>
            {it.t}
          </text>
        ))}
        <text x={92} y={Y(1000) - 10} textAnchor="end" className={styles.dimText}>
          Z / Ω
        </text>

        {/* 目标阻抗 */}
        <line x1={100} y1={Y(0.05)} x2={560} y2={Y(0.05)} stroke="var(--pcb-solder)" strokeWidth={2} strokeDasharray="8 5" />
        <text x={150} y={Y(0.05) - 8} className={styles.dimText}>
          Z_target
        </text>
        <Badge x={420} y={Y(0.05) - 18} n={1} />

        <path d={curve} fill="none" stroke="var(--pcb-callout)" strokeWidth={2.6} />

        <circle cx={X(1.6e7)} cy={Y(0.021)} r={4} fill="var(--pcb-callout)" />
        <circle cx={X(1.7e8)} cy={Y(0.055)} r={4} fill="var(--pcb-callout)" />
        <circle cx={X(6e7)} cy={Y(0.42)} r={4} fill="var(--pcb-silk)" />

        <Badge x={X(1.6e7) + 12} y={Y(0.021) - 22} n={2} />
        <Badge x={X(6e7) + 14} y={Y(0.42) - 20} n={3} />
        <Pointer from={[300, 96]} to={[X(6e7), Y(0.42)]} label="反谐振峰" sub="两种容值之间的坑" align="start" />

        {/* ---------- 右：摆放 ---------- */}
        <text x={620} y={52} className={styles.panelTitle}>
          摆放：大远小近
        </text>

        {/* 板级入口 */}
        <rect x={620} y={70} width={70} height={40} rx={3} fill="var(--pcb-component)" stroke="var(--pcb-hair-strong)" strokeWidth={1} />
        <text x={655} y={94} textAnchor="middle" className={styles.panelMeta}>
          电源入口
        </text>

        {/* 大电容 */}
        <g>
          <rect x={712} y={78} width={16} height={24} rx={1} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.6} />
          <text x={738} y={86} className={styles.dimText}>
            10–100 µF
          </text>
          <text x={738} y={102} className={styles.dimText}>
            低频储能
          </text>
        </g>

        {/* IC */}
        <rect x={700} y={150} width={130} height={110} rx={4} fill="var(--pcb-substrate)" stroke="var(--pcb-hair-strong)" strokeWidth={1.4} />
        <text x={765} y={210} textAnchor="middle" className={styles.panelMeta}>
          IC
        </text>
        {/* 引脚 */}
        {[0, 1, 2, 3].map((j) => (
          <rect key={`pin-${j}`} x={706 + j * 30} y={142} width={16} height={8} fill="var(--pcb-copper)" />
        ))}

        {/* 0.1 µF 紧贴 */}
        {[0, 1, 2, 3].map((j) => (
          <g key={`c-${j}`}>
            <rect x={708 + j * 30} y={120} width={12} height={16} rx={1} fill="var(--pcb-surface)" stroke="var(--pcb-wire)" strokeWidth={1.5} />
            <circle cx={714 + j * 30} cy={139} r={2} fill="var(--pcb-wire)" />
          </g>
        ))}
        <text x={676} y={132} textAnchor="end" className={styles.dimText}>
          0.1 µF × 每脚
        </text>

        {/* 多过孔下地 */}
        <g>
          {[0, 1, 2].map((j) => (
            <circle key={`via-${j}`} cx={760 + j * 22} cy={272} r={5} fill="var(--pcb-via)" stroke="var(--pcb-hole)" strokeWidth={1} />
          ))}
          <text x={800} y={276} className={styles.dimText}>
            多过孔下地
          </text>
        </g>
        <text x={700} y={306} className={styles.panelSub}>
          引线电感会抵消去耦效果
        </text>
        <text x={700} y={326} className={styles.panelSub} opacity={0.75}>
          回路面积最小 = 去耦最有效
        </text>

        <Badge x={792} y={148} n={4} />
      </svg>
    </FigureShell>
  );
}
