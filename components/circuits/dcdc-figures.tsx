import { FigureShell } from '../pcb/pcb-figures';
import styles from '../pcb/pcb-figures.module.css';

/**
 * 「DC-DC 模块设计」插图。
 *
 * 只画两张：MP1584EN 的 12V→5V 原理图、以及上管通/断两种状态下的电流路径。
 * 画法与 sop-figures 的 SchematicExcerpt 保持一致：
 * 连线用 --pcb-wire，元件符号用 --pcb-ink，位号 annoLabel、参数 dimText。
 */

const INK = 'var(--pcb-ink)';
const WIRE = 'var(--pcb-wire)';
/** 电流回路的高亮色：用铜色而不是 primary——primary 在浅色主题下几乎等于墨色，看不出高亮 */
const FLOW = 'var(--pcb-copper-2)';

/* ------------------------------------------------------------------ 基元 */

/** 连线：一条折线写完，省的摆一堆 line */
function Wire({ d, stroke = WIRE, width = 1.8 }: { d: string; stroke?: string; width?: number }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** 结点：三个以上引脚交汇的地方才打点 */
function Dot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={3} fill={INK} />;
}

/** 地符号：三根递减横线 */
function Gnd({ x, y, dim }: { x: number; y: number; dim?: boolean }) {
  const color = dim ? 'var(--pcb-hair-strong)' : INK;
  return (
    <g stroke={color} strokeWidth={1.6} fill="none">
      <line x1={x - 16} y1={y} x2={x + 16} y2={y} />
      <line x1={x - 10} y1={y + 6} x2={x + 10} y2={y + 6} />
      <line x1={x - 5} y1={y + 12} x2={x + 5} y2={y + 12} />
    </g>
  );
}

/** 竖直电容：两块横板，中心在 y */
function CapV({ x, y, size = 15 }: { x: number; y: number; size?: number }) {
  return (
    <g stroke={INK} strokeWidth={2} fill="none">
      <line x1={x - size} y1={y - 4} x2={x + size} y2={y - 4} />
      <line x1={x - size} y1={y + 4} x2={x + size} y2={y + 4} />
    </g>
  );
}

/** 水平电容：两块竖板，中心在 x */
function CapH({ x, y, size = 10 }: { x: number; y: number; size?: number }) {
  return (
    <g stroke={INK} strokeWidth={2} fill="none">
      <line x1={x - 4} y1={y - size} x2={x - 4} y2={y + size} />
      <line x1={x + 4} y1={y - size} x2={x + 4} y2={y + size} />
    </g>
  );
}

/** 竖直电阻（IEC 矩形），上沿在 y，高 24 */
function ResV({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x - 5.5}
      y={y}
      width={11}
      height={24}
      rx={1}
      fill="var(--color-fd-background)"
      stroke={INK}
      strokeWidth={1.4}
    />
  );
}

/** 水平电阻（IEC 矩形），左沿在 x，宽 30 */
function ResH({ x, y }: { x: number; y: number }) {
  return (
    <rect
      x={x}
      y={y - 5.5}
      width={30}
      height={11}
      rx={1}
      fill="var(--color-fd-background)"
      stroke={INK}
      strokeWidth={1.4}
    />
  );
}

/** 竖直二极管：阴极（横杠）在上，三角形朝上，共 24 高 */
function DiodeV({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={1.6} fill="none">
      <line x1={x - 9} y1={y} x2={x + 9} y2={y} />
      <path d={`M${x - 9} ${y + 24}L${x + 9} ${y + 24}L${x} ${y}Z`} fill="var(--color-fd-background)" />
    </g>
  );
}

/** 水平电感：n 个半圆，从 x 起、总宽 w */
function IndH({ x, y, w = 84, humps = 4 }: { x: number; y: number; w?: number; humps?: number }) {
  const s = w / humps;
  let d = `M${x} ${y}`;
  for (let i = 0; i < humps; i += 1) d += ` q${s / 2} -13 ${s} 0`;
  return <path d={d} fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />;
}

/** 电流方向箭头 */
function FlowArrow({ x, y, dir }: { x: number; y: number; dir: 'r' | 'l' | 'u' | 'd' }) {
  const s = 6;
  const points = {
    r: `${x - s},${y - s} ${x + s},${y} ${x - s},${y + s}`,
    l: `${x + s},${y - s} ${x - s},${y} ${x + s},${y + s}`,
    u: `${x - s},${y + s} ${x},${y - s} ${x + s},${y + s}`,
    d: `${x - s},${y - s} ${x},${y + s} ${x + s},${y - s}`,
  }[dir];
  return <polygon points={points} fill={FLOW} />;
}

/* =========================================================================
 * FIG · C05 —— MP1584EN：12V → 5V / 3A 的降压电路
 *
 * 版面分区（从左到右）：输入电容 → EN/FREQ → 芯片 → 续流与储能 → 输出电容。
 * 每个分区占一条竖带，元件符号与文字互不压线；
 * R4 到 +5V 的那根线从 D1 的阴极引线上跨过去，用一个小圆弧表示"只跨不接"。
 * ========================================================================= */

export function Mp1584BuckSchematic() {
  return (
    <FigureShell
      no="FIG · C05"
      title="MP1584EN 降压电路：12 V 进、5 V / 3 A 出"
      meta="原理图 · 非同步 buck · SOIC8E"
      plain
      legend={[
        { n: 1, label: '输入电容 C6 ‖ C1', hint: '两颗 10 µF 并联，紧贴 VIN 脚；要分担约 1.5 A RMS 的脉动电流' },
        { n: 2, label: 'EN 分压 R1 / R2', hint: '100k / 24.9k 把起机点抬到约 7.5 V；EN 脚耐压只有 6 V，12 V 输入必须分压' },
        { n: 3, label: 'FREQ 电阻 R3', hint: '100 kΩ → 900 kHz，直接决定电感与电容能取多小' },
        { n: 4, label: '自举电容 C2', hint: '100 nF 跨在 BST–SW 间，给上管的浮地栅极当油箱' },
        { n: 5, label: '续流二极管 D1', hint: 'B340A，40 V / 3 A 肖特基；阴极朝 SW、阳极朝地，接反就是短路' },
        { n: 6, label: '电感 L1', hint: '15 µH，ΔI ≈ 0.2 A 峰峰；峰值 3.1 A 仍低于 4.0 A 的最小限流点' },
        { n: 7, label: 'FB 分压 R4 / R5', hint: '210k / 40.2k → 0.8 V × (1 + 210/40.2) ≈ 4.98 V；下臂别超过 40 kΩ' },
        { n: 8, label: '补偿网络 C5 + R6', hint: '150 pF 串 100 kΩ，零点约 10.6 kHz，只对这套 LC 成立' },
        { n: 9, label: '输出电容 C3 ‖ C4', hint: '两颗 22 µF；直流偏压下实际容量可能只剩一半' },
      ]}
      caption="这张图能读出三件事：能量从 VIN 经上管、L1 到 +5V；D1 只在上管关断时接班；FB、COMP、EN、FREQ 四个引脚各自回答「该不该、多快、何时」的问题。厂家典型应用图保证芯片能转起来，之所以还值得逐脚读，是因为每个引脚都对应一个可以算、可以改的参数。"
      note="换一颗片子，这几块的位置几乎不会变：输入电容永远贴着 VIN，FB 永远从输出取，补偿永远跟着 LC 走，续流器件永远在 SW 与地之间。这就是读一张图比背十张图有用的原因。"
    >
      <svg viewBox="0 84 920 320" role="img" aria-labelledby="fig-c05-title" className={styles.svg}>
        <title id="fig-c05-title">
          MP1584EN 降压电路原理图：12V 输入经 C6/C1 旁路、R1/R2 分压使能、R3 设定 900kHz 开关频率，芯片 SW 经 D1 续流、L1 储能得到 +5V，R4/R5 反馈分压、C5/R6 补偿
        </title>

        {/* ---------------- ① 输入侧 ---------------- */}
        <text x={60} y={138} className={styles.annoLabel}>
          VIN · 12 V
        </text>
        <Wire d="M60 150 H310" />
        <Wire d="M110 150 V168 M110 176 V200" />
        <CapV x={110} y={172} />
        <Gnd x={110} y={200} />
        <text x={110} y={244} textAnchor="middle" className={styles.dimText}>
          C6 10 µF
        </text>

        <Wire d="M180 150 V168 M180 176 V200" />
        <CapV x={180} y={172} />
        <Gnd x={180} y={200} />
        <text x={180} y={244} textAnchor="middle" className={styles.dimText}>
          C1 10 µF
        </text>

        {/* ② EN 分压 */}
        <Wire d="M260 150 V158 M260 182 V190" />
        <ResV x={260} y={158} />
        <Wire d="M260 190 H310" />
        <Wire d="M260 190 V202 M260 226 V236" />
        <ResV x={260} y={202} />
        <Gnd x={260} y={236} />
        <text x={246} y={170} textAnchor="end" className={styles.annoLabel}>
          R1
        </text>
        <text x={246} y={184} textAnchor="end" className={styles.dimText}>
          100 kΩ
        </text>
        <text x={246} y={214} textAnchor="end" className={styles.annoLabel}>
          R2
        </text>
        <text x={246} y={228} textAnchor="end" className={styles.dimText}>
          24.9 kΩ
        </text>

        {/* ③ FREQ */}
        <Wire d="M310 240 H300 M300 240 V252 M300 276 V296" />
        <ResV x={300} y={252} />
        <Gnd x={300} y={296} />
        <text x={286} y={268} textAnchor="end" className={styles.annoLabel}>
          R3
        </text>
        <text x={286} y={282} textAnchor="end" className={styles.dimText}>
          100 kΩ
        </text>

        {/* ---------------- 芯片 ---------------- */}
        <rect
          x={310}
          y={130}
          width={170}
          height={160}
          rx={3}
          fill="color-mix(in oklab, var(--pcb-component) 18%, transparent)"
          stroke={INK}
          strokeWidth={1.4}
        />
        <text x={395} y={104} textAnchor="middle" className={styles.annoLabel}>
          U1 · MP1584EN-LF-Z
        </text>
        <text x={395} y={120} textAnchor="middle" className={styles.annoLabelDim}>
          3 A 非同步降压 · SOIC8E
        </text>

        {[
          { x: 322, y: 154, name: 'VIN', anchor: 'start' as const },
          { x: 322, y: 194, name: 'EN', anchor: 'start' as const },
          { x: 322, y: 244, name: 'FREQ', anchor: 'start' as const },
          { x: 468, y: 146, name: 'BST', anchor: 'end' as const },
          { x: 468, y: 182, name: 'SW', anchor: 'end' as const },
          { x: 468, y: 226, name: 'FB', anchor: 'end' as const },
          { x: 468, y: 266, name: 'COMP', anchor: 'end' as const },
          { x: 350, y: 284, name: 'EP', anchor: 'middle' as const },
          { x: 440, y: 284, name: 'GND', anchor: 'middle' as const },
        ].map((pin) => (
          <text key={pin.name} x={pin.x} y={pin.y} textAnchor={pin.anchor} className={styles.annoLabelDim}>
            {pin.name}
          </text>
        ))}

        {[
          { x: 302, y: 146, no: '7', anchor: 'end' as const },
          { x: 302, y: 186, no: '2', anchor: 'end' as const },
          { x: 302, y: 236, no: '6', anchor: 'end' as const },
          { x: 488, y: 138, no: '8', anchor: 'start' as const },
          { x: 488, y: 174, no: '1', anchor: 'start' as const },
          { x: 488, y: 218, no: '4', anchor: 'start' as const },
          { x: 488, y: 258, no: '3', anchor: 'start' as const },
          { x: 356, y: 318, no: '9', anchor: 'start' as const },
          { x: 446, y: 318, no: '5', anchor: 'start' as const },
        ].map((pin) => (
          <text key={pin.no} x={pin.x} y={pin.y} textAnchor={pin.anchor} className={styles.dimText}>
            {pin.no}
          </text>
        ))}

        {/* EP / GND 落地 */}
        <Wire d="M350 290 V326 M440 290 V326" />
        <Gnd x={350} y={326} />
        <Gnd x={440} y={326} />
        <text x={395} y={358} textAnchor="middle" className={styles.annoLabelDim}>
          EP 与 GND 都直接铺大地铜皮
        </text>

        {/* ---------------- ④ 自举 ---------------- */}
        <Wire d="M480 142 H500 M500 142 V112 M500 112 H512" />
        <CapH x={516} y={112} />
        <Wire d="M520 112 H545 M545 112 V178" />
        <text x={516} y={96} textAnchor="middle" className={styles.dimText}>
          C2 100 nF
        </text>

        {/* ---------------- ⑤ 功率通路 ---------------- */}
        <Wire d="M480 178 H650" />
        <Wire d="M640 178 V182 M640 206 V258" />
        <DiodeV x={640} y={182} />
        <Gnd x={640} y={258} />
        <text x={654} y={192} className={styles.annoLabel}>
          D1
        </text>
        <text x={654} y={206} className={styles.dimText}>
          B340A-13-F
        </text>

        <IndH x={650} y={178} w={84} humps={4} />
        <Wire d="M734 178 H900" />
        <text x={692} y={158} textAnchor="middle" className={styles.annoLabel}>
          L1 15 µH
        </text>
        <text x={900} y={166} textAnchor="end" className={styles.annoLabel}>
          +5V
        </text>

        <Wire d="M770 178 V196 M770 204 V236" />
        <CapV x={770} y={200} />
        <Gnd x={770} y={236} />
        <text x={790} y={202} className={styles.annoLabel}>
          C3
        </text>
        <text x={790} y={216} className={styles.dimText}>
          22 µF
        </text>

        <Wire d="M840 178 V196 M840 204 V236" />
        <CapV x={840} y={200} />
        <Gnd x={840} y={236} />
        <text x={862} y={202} className={styles.annoLabel}>
          C4
        </text>
        <text x={862} y={216} className={styles.dimText}>
          22 µF
        </text>

        {/* ---------------- ⑥ 反馈分压 ---------------- */}
        <Wire d="M480 222 H580" />
        <Wire d="M560 222 V234 M560 258 V276" />
        <ResV x={560} y={234} />
        <Gnd x={560} y={276} />
        {/* 跨过 D1 的阴极引线：小圆弧表示只跨不接。
            R4 远端绕到两颗输出电容之后才接到 +5V——分压器取的是电容滤波之后的电压 */}
        <Wire d="M610 222 H630 A9 9 0 0 1 648 222 H690 V300 H880 V178" />
        <ResH x={580} y={222} />
        <text x={595} y={206} textAnchor="middle" className={styles.dimText}>
          R4 210 kΩ
        </text>
        <text x={572} y={240} className={styles.annoLabel}>
          R5
        </text>
        <text x={572} y={254} className={styles.dimText}>
          40.2 kΩ
        </text>

        {/* ---------------- ⑦ 补偿网络 ---------------- */}
        <Wire d="M480 262 H520 M520 262 V300 M520 308 V320 M520 344 V362" />
        <CapV x={520} y={304} />
        <ResV x={520} y={320} />
        <Gnd x={520} y={362} />
        <text x={540} y={308} className={styles.dimText}>
          C5 150 pF
        </text>
        <text x={540} y={342} className={styles.dimText}>
          R6 100 kΩ
        </text>

        {/* ---------------- 结点 ---------------- */}
        <Dot x={110} y={150} />
        <Dot x={180} y={150} />
        <Dot x={260} y={150} />
        <Dot x={260} y={190} />
        <Dot x={545} y={178} />
        <Dot x={640} y={178} />
        <Dot x={880} y={178} />
        <Dot x={770} y={178} />
        <Dot x={840} y={178} />
        <Dot x={560} y={222} />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * FIG · C06 —— 上管通 / 断两种状态下的电流路径
 * ========================================================================= */

function MiniBuck({ x0, on }: { x0: number; on: boolean }) {
  const loop = on
    ? `M${x0 + 8} 110 H${x0 + 340} V166 H${x0 + 55} V110`
    : `M${x0 + 256} 110 H${x0 + 340} V166 H${x0 + 168} V110 H${x0 + 256}`;

  return (
    <g>
      <text x={x0} y={24} className={styles.annoLabel}>
        {on ? '① 上管导通：VIN 给电感充能' : '② 上管关断：电感经 D1 续流'}
      </text>
      <text x={x0} y={42} className={styles.dimText}>
        {on ? 'VIN → 上管 → L1 → 负载 → 地 → Cin' : 'L1 → 负载 → 地 → D1 → SW → L1'}
      </text>

      {/* 走线 → 高亮回路 → 元件符号 → 标注，顺序不能反：后画的压在上面 */}
      <Wire d={`M${x0 + 8} 110 H${x0 + 86}`} />
      <Wire d={`M${x0 + 154} 110 H${x0 + 180}`} />
      <Wire d={`M${x0 + 256} 110 H${x0 + 340}`} />
      <Wire d={`M${x0 + 55} 110 V130 M${x0 + 55} 138 V166`} />
      <Wire d={`M${x0 + 168} 110 V132 M${x0 + 168} 156 V166`} />
      <Wire d={`M${x0 + 268} 110 V130 M${x0 + 268} 138 V166`} />
      <Wire d={`M${x0 + 340} 110 V130 M${x0 + 340} 156 V166`} />
      <Wire d={`M${x0 + 55} 166 H${x0 + 340}`} />

      <Wire d={loop} stroke={FLOW} width={3} />

      <IndH x={x0 + 180} y={110} w={76} humps={4} />
      <CapV x={x0 + 55} y={134} size={13} />
      <DiodeV x={x0 + 168} y={132} />
      <CapV x={x0 + 268} y={134} size={13} />
      <rect
        x={x0 + 332}
        y={130}
        width={16}
        height={26}
        rx={1}
        fill="var(--color-fd-background)"
        stroke={INK}
        strokeWidth={1.4}
      />
      <Gnd x={x0 + 300} y={166} />

      {/* 上管 */}
      <rect
        x={x0 + 86}
        y={86}
        width={68}
        height={38}
        rx={6}
        fill="color-mix(in oklab, var(--pcb-component) 16%, transparent)"
        stroke={INK}
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />
      <circle cx={x0 + 96} cy={110} r={2.6} fill={INK} />
      <circle cx={x0 + 140} cy={110} r={2.6} fill={INK} />
      <line
        x1={x0 + 96}
        y1={110}
        x2={on ? x0 + 138 : x0 + 132}
        y2={on ? 110 : 92}
        stroke={INK}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <text x={x0 + 120} y={78} textAnchor="middle" className={styles.annoLabelDim}>
        上管{on ? '' : '（已关断）'}
      </text>

      <text x={x0 + 8} y={96} className={styles.annoLabelDim}>
        VIN
      </text>
      <text x={x0 + 292} y={96} textAnchor="middle" className={styles.annoLabelDim}>
        +5V
      </text>
      <text x={x0 + 356} y={148} className={styles.annoLabelDim}>
        负载
      </text>

      {on ? (
        <>
          <FlowArrow x={x0 + 310} y={110} dir="r" />
          <FlowArrow x={x0 + 220} y={166} dir="l" />
        </>
      ) : (
        <>
          <FlowArrow x={x0 + 300} y={110} dir="r" />
          <FlowArrow x={x0 + 262} y={166} dir="l" />
          <FlowArrow x={x0 + 168} y={146} dir="u" />
        </>
      )}

      <text x={x0} y={212} className={styles.annoLabelDim}>
        {on
          ? '输入电容在这一段放电；这个圈越小，尖峰与辐射越小'
          : '电感电流不能突变，D1 提供这条续流回路'}
      </text>

      <Dot x={x0 + 55} y={110} />
      <Dot x={x0 + 168} y={110} />
      <Dot x={x0 + 268} y={110} />
    </g>
  );
}

export function BuckCurrentPaths() {
  return (
    <FigureShell
      no="FIG · C06"
      title="同一个电路的两个状态：谁在给电感续命"
      meta="电流路径 · 高亮线为当前流过的回路"
      plain
      legend={[
        { n: 1, label: '上管导通', hint: 'VIN 经上管把能量灌进电感，同时给输出电容和负载供电' },
        { n: 2, label: '上管关断', hint: '电感电流无处可去，只能从地经 D1 抽回来' },
        { n: 3, label: '两个状态共用的那段', hint: 'L1 → 负载 → 地，在两个状态里电流方向都不变' },
      ]}
      caption="开关电源之所以叫「开关」，就是因为这两个状态在不停地换。电感电流连续、方向不变，是它能把能量「搬」过去的原因；而上管一关，电流就改走 D1——这条回路存不存在，决定了你的板子是一个 buck，还是一个发热的电阻。"
      note="PCB 上的热点就在这两条回路上：导通时是 Cin → 上管 → L1，关断时是 地 → D1 → L1。把它们各自的包围面积压到最小，比换更低 DCR 的电感有用得多。"
    >
      <svg viewBox="0 0 900 236" role="img" aria-labelledby="fig-c06-title" className={styles.svg}>
        <title id="fig-c06-title">
          降压电路两种开关状态的电流路径：上管导通时电流从输入经上管与电感流向负载，上管关断时电感电流经二极管续流
        </title>
        <MiniBuck x0={20} on />
        <MiniBuck x0={460} on={false} />
      </svg>
    </FigureShell>
  );
}
