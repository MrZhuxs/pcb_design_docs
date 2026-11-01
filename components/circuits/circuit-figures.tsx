import { FigureShell } from '../pcb/pcb-figures';
import styles from '../pcb/pcb-figures.module.css';

/**
 * 「常见电路设计方案」专用插图。
 *
 * 只画四张：12V 输入链、多相 VRM、上电时序、PCIe 金手指。
 * 外壳、图例、图注与配色全部复用 pcb-figures（同一套 --pcb-* 变量），
 * 不新建 CSS，保证与前面各章的工程图画法一致。
 */

const INK = 'var(--color-fd-foreground)';
const PRIMARY = 'var(--color-fd-primary)';
const HAIR = 'var(--pcb-hair)';
const HAIR_STRONG = 'var(--pcb-hair-strong)';
const WIRE = 'var(--pcb-wire)';
const COMP = 'var(--pcb-component)';
const COPPER = 'var(--pcb-copper)';

/* ------------------------------------------------------------------ 基元 */

function Block({
  x,
  y,
  w = 150,
  h = 76,
  title,
  sub,
  accent,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  title: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={accent ? 'var(--pcb-copper-2)' : 'var(--pcb-surface)'}
        stroke={accent ? PRIMARY : HAIR_STRONG}
        strokeWidth={accent ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 3 : h / 2 + 4.5)}
        textAnchor="middle"
        className={styles.panelTitle}
      >
        {title}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className={styles.panelSub}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({
  x,
  y,
  len = 44,
  label,
  dashed,
}: {
  x: number;
  y: number;
  len?: number;
  label?: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={x + len - 6}
        y2={y}
        stroke={HAIR_STRONG}
        strokeWidth={1.4}
        strokeDasharray={dashed ? '4 3' : undefined}
      />
      <path
        d={`M${x + len - 7} ${y - 4}L${x + len} ${y}L${x + len - 7} ${y + 4}Z`}
        fill={HAIR_STRONG}
      />
      {label && (
        <text x={x + len / 2} y={y - 8} textAnchor="middle" className={styles.annoLabelDim}>
          {label}
        </text>
      )}
    </g>
  );
}

function Chip({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--pcb-surface)" stroke={HAIR_STRONG} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" className={styles.panelSub}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" className={styles.annoLabelDim}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** 竖直电容符号：两段横板 */
function Cap({ x, y, size = 16 }: { x: number; y: number; size?: number }) {
  return (
    <g stroke={COMP} strokeWidth={2} fill="none">
      <line x1={x - size} y1={y - 4} x2={x + size} y2={y - 4} />
      <line x1={x - size} y1={y + 4} x2={x + size} y2={y + 4} />
    </g>
  );
}

/* =========================================================================
 * FIG · C01 —— 12V 输入与保护：从连接器到板内母线
 * ========================================================================= */

export function PowerInputChain() {
  const busY = 236;
  const viaX: number[] = [];
  for (let x = 150; x <= 830; x += 46) viaX.push(x);

  return (
    <FigureShell
      no="FIG · C01"
      title="12V 输入与保护链：分路熔断 → 钳位 → 母线汇流"
      meta="方框 + 铜皮剖面 · 单位 mm"
      legend={[
        { n: 1, label: '输入连接器', hint: '金手指 / 8pin / 12VHPWR，每路有自己的额定电流' },
        { n: 2, label: '分路熔断', hint: '一路短路只烧这一路，不能共用一颗保险' },
        { n: 3, label: '钳位与滤波', hint: 'TVS 放在保险之后：TVS 失效短路时由保险切断' },
        { n: 4, label: '母线电容', hint: '吸收负载跃变，容量按 C·ΔV = I·Δt 估' },
        { n: 5, label: '12V_IN 母线', hint: '整层铜皮＋过孔阵列，不是走线' },
      ]}
      caption="四条输入（金手指、两路 8pin、12VHPWR）各自熔断后并入 12V_IN 母线，再按电源域分下去。母线用整层铜皮并把过孔打进内层，是因为 50 A 级电流靠走线根本过不去；虚线框是压降预算要核算的三段。"
      note="电流与过孔数的算法见本篇第四节；规范额定值以 PCI-SIG CEM 与连接器厂商 datasheet 为准。"
    >
      <svg viewBox="0 0 900 460" role="img" aria-labelledby="fig-c01-title" className={styles.svg}>
        <title id="fig-c01-title">
          12V 输入保护链方框图：输入连接器经分路熔断、钳位滤波、母线电容汇入 12V_IN 铜皮母线，再分到 VRM、存储器与辅助轨
        </title>

        {/* 第一段：连接器 → 熔断 */}
        <Block x={36} y={64} w={170} title="输入连接器" sub="金手指 / 8pin / 12VHPWR" accent />
        <Arrow x={208} y={102} label="分路" />
        <Block x={254} y={64} w={148} title="熔断" sub="慢断保险 / eFuse" />
        <Arrow x={404} y={102} />
        <Block x={450} y={64} w={148} title="钳位" sub="TVS + 磁珠" />
        <Arrow x={600} y={102} />
        <Block x={646} y={64} w={160} title="母线电容" sub="聚合物 + 陶瓷" />

        {/* 引线到母线 */}
        <path
          d={`M806 102 L 858 102 L 858 ${busY - 8}`}
          fill="none"
          stroke={HAIR_STRONG}
          strokeWidth={1.4}
        />

        {/* 母线：铜皮 + 过孔 */}
        <rect x={132} y={busY - 8} width={726} height={16} rx={3} fill={COPPER} opacity={0.85} />
        <rect
          x={132}
          y={busY - 8}
          width={726}
          height={16}
          rx={3}
          fill="none"
          stroke={INK}
          strokeWidth={0.8}
          opacity={0.35}
        />
        {viaX.map((x) => (
          <circle key={x} cx={x} cy={busY} r={4.6} fill="var(--color-fd-background)" stroke={INK} strokeWidth={1} opacity={0.75} />
        ))}
        <text x={132} y={busY - 20} className={styles.panelTitle}>
          12V_IN 母线
        </text>
        <text x={858} y={busY - 20} textAnchor="end" className={styles.panelMeta}>
          整层铜皮 · 0.3 mm 过孔阵列
        </text>

        {/* 母线分出三路 */}
        {[
          { x: 210, t: '多相 VRM', s: '0.6～1.1 V' },
          { x: 440, t: '存储器供电', s: 'VDDQ / VDDCI / VPP' },
          { x: 680, t: '辅助轨', s: '1.8 V / 3.3 V / PEX' },
        ].map((d) => (
          <g key={d.t}>
            <line x1={d.x} y1={busY + 8} x2={d.x} y2={306} stroke={HAIR_STRONG} strokeWidth={1.4} />
            <path d={`M${d.x - 4} 300 L ${d.x} 308 L ${d.x + 4} 300 Z`} fill={HAIR_STRONG} />
            <Chip x={d.x - 78} y={312} w={156} h={52} label={d.t} sub={d.s} />
          </g>
        ))}

        {/* 压降预算：三段虚线框 */}
        <rect x={36} y={56} width={366} height={92} rx={14} fill="none" stroke={PRIMARY} strokeWidth={1.2} strokeDasharray="5 4" />
        <text x={44} y={150} className={styles.annoLabelDim}>
          段① 连接器 → 熔断 → 钳位：≤ 40 mV
        </text>
        <rect x={646} y={56} width={212} height={92} rx={14} fill="none" stroke={PRIMARY} strokeWidth={1.2} strokeDasharray="5 4" />
        <text x={852} y={150} textAnchor="end" className={styles.annoLabelDim}>
          段② 电容 → 母线：≤ 20 mV
        </text>
        <text x={132} y={396} className={styles.annoLabel}>
          段③ 母线与过孔：满载 ≤ 40 mV、温升 ≤ 30 K
        </text>
        <text x={132} y={418} className={styles.annoLabelDim}>
          50 A 需要约 20 mm 宽 2 oz 表层；四层各 6 mm 并联即可，过孔按约 1.5 A/颗（0.3 mm 孔、25 µm 镀铜、10 °C 温升）取 1 A 保守值
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * FIG · C02 —— 多相 VRM：单相拓扑 + 多相平面
 * ========================================================================= */

export function VrmPhaseTopology() {
  const cols = [470, 610, 750];
  return (
    <FigureShell
      no="FIG · C02"
      title="多相 VRM：单相拓扑与多相平面布置"
      meta="拓扑 + 平面示意 · 不以比例尺计"
      legend={[
        { n: 1, label: '输入电容', hint: '每相自带，紧贴 DrMOS，功率环路的起点' },
        { n: 2, label: '功率级', hint: 'DrMOS / SPS：上下管 + 驱动集成在一颗里' },
        { n: 3, label: 'SW 节点', hint: '电压跳变点，铜皮只做到够过流，不铺大面积' },
        { n: 4, label: '电感', hint: '按每相 30–40% 纹波电流选感量，Isat > 1.4× 相电流' },
        { n: 5, label: '输出汇流', hint: '相间对称，sense 从负载焊盘 Kelvin 取' },
      ]}
      caption="左边是一相：12V → 输入电容 → 功率级 → SW → 电感 → 输出。右边是 N 个这样的单元并排，输出在汇流排上汇总。真正决定成败的不是拓扑，而是右图里每相是否等长、每相的输入电容是否都在自己那相脚边。"
      note="相数、频率、感量与本图无关，按参数表算；图中数值仅作示例。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-c02-title" className={styles.svg}>
        <title id="fig-c02-title">
          多相 VRM：左侧单相 buck 拓扑（12V、输入电容、DrMOS、SW、电感、输出电容），右侧三相等距并排的平面布置与功率环路
        </title>

        {/* ---------- 左：单相拓扑 ---------- */}
        <text x={40} y={40} className={styles.panelTitle}>
          一相的内部
        </text>

        {/* 12V 竖轨 */}
        <line x1={56} y1={68} x2={56} y2={214} stroke={WIRE} strokeWidth={2} />
        <text x={56} y={60} textAnchor="middle" className={styles.annoLabel}>
          12V
        </text>

        {/* Cin 支路 */}
        <line x1={56} y1={104} x2={96} y2={104} stroke={WIRE} strokeWidth={2} />
        <line x1={112} y1={104} x2={112} y2={92} stroke={WIRE} strokeWidth={2} />
        <line x1={112} y1={128} x2={112} y2={214} stroke={WIRE} strokeWidth={2} />
        <Cap x={104} y={110} size={14} />
        <text x={118} y={104} className={styles.annoLabelDim}>
          Cin
        </text>

        {/* DrMOS */}
        <rect x={112} y={68} width={104} height={62} rx={8} fill="var(--pcb-surface)" stroke={PRIMARY} strokeWidth={1.5} />
        <text x={164} y={96} textAnchor="middle" className={styles.panelTitle}>
          DrMOS
        </text>
        <text x={164} y={114} textAnchor="middle" className={styles.panelSub}>
          HS + LS + 驱动
        </text>
        <line x1={56} y1={68} x2={112} y2={68} stroke={WIRE} strokeWidth={2} />
        <line x1={56} y1={214} x2={112} y2={214} stroke={WIRE} strokeWidth={2} />

        {/* 自举 */}
        <line x1={216} y1={82} x2={236} y2={82} stroke={HAIR_STRONG} strokeWidth={1.2} />
        <line x1={236} y1={82} x2={236} y2={104} stroke={HAIR_STRONG} strokeWidth={1.2} />
        <text x={242} y={88} className={styles.annoLabelDim}>
          BST
        </text>

        {/* SW 节点 */}
        <line x1={216} y1={108} x2={252} y2={108} stroke={WIRE} strokeWidth={2} />
        <circle cx={248} cy={108} r={3.4} fill={INK} />
        <text x={252} y={96} className={styles.annoLabel}>
          SW
        </text>

        {/* 电感 */}
        <path
          d="M252 108 q10 -14 20 0 q10 -14 20 0 q10 -14 20 0 q10 -14 20 0"
          fill="none"
          stroke={COMP}
          strokeWidth={2}
        />
        <text x={292} y={88} textAnchor="middle" className={styles.annoLabelDim}>
          L
        </text>
        <line x1={332} y1={108} x2={404} y2={108} stroke={WIRE} strokeWidth={2} />
        <text x={404} y={96} textAnchor="end" className={styles.panelTitle}>
          VOUT
        </text>

        {/* Cout */}
        <line x1={376} y1={108} x2={376} y2={116} stroke={WIRE} strokeWidth={2} />
        <Cap x={376} y={122} size={14} />
        <line x1={376} y1={130} x2={376} y2={214} stroke={WIRE} strokeWidth={2} />
        <text x={386} y={110} className={styles.annoLabelDim}>
          Cout
        </text>

        {/* 地轨 */}
        <line x1={56} y1={214} x2={404} y2={214} stroke={INK} strokeWidth={1.6} opacity={0.6} />
        <text x={56} y={232} className={styles.annoLabelDim}>
          GND（每相各自的回流）
        </text>

        <text x={40} y={272} className={styles.annoLabel}>
          功率环路 = Cin(+) → HS → SW → LS → Cin(−)
        </text>
        <text x={40} y={292} className={styles.annoLabelDim}>
          这个圈越小，寄生电感越低，开关尖峰越小
        </text>

        {/* ---------- 右：多相平面 ---------- */}
        <line x1={432} y1={40} x2={432} y2={430} stroke={HAIR} strokeWidth={1} />
        <text x={470} y={40} className={styles.panelTitle}>
          N 相并排（以三相为例）
        </text>

        {/* 输出汇流 */}
        <rect x={468} y={96} width={392} height={14} rx={3} fill={COPPER} opacity={0.85} />
        <text x={468} y={86} className={styles.annoLabel}>
          VCORE 输出汇流
        </text>
        <text x={860} y={86} textAnchor="end" className={styles.annoLabelDim}>
          相间到这里的路径必须等长
        </text>

        {cols.map((x, i) => (
          <g key={x}>
            {/* 电感 */}
            <rect x={x} y={132} width={110} height={34} rx={5} fill="var(--pcb-surface)" stroke={HAIR_STRONG} strokeWidth={1} />
            <text x={x + 55} y={153} textAnchor="middle" className={styles.panelSub}>
              L
            </text>
            <line x1={x + 55} y1={110} x2={x + 55} y2={132} stroke={WIRE} strokeWidth={1.8} />
            <line x1={x + 55} y1={166} x2={x + 55} y2={182} stroke={WIRE} strokeWidth={1.8} />

            {/* DrMOS */}
            <rect x={x} y={182} width={110} height={52} rx={5} fill="var(--pcb-copper-2)" stroke={PRIMARY} strokeWidth={1.2} />
            <text x={x + 55} y={204} textAnchor="middle" className={styles.panelSub}>
              功率级
            </text>
            <text x={x + 55} y={220} textAnchor="middle" className={styles.annoLabelDim}>
              相 {i + 1}
            </text>
            <line x1={x + 55} y1={234} x2={x + 55} y2={252} stroke={WIRE} strokeWidth={1.8} />

            {/* 输入电容 */}
            <rect x={x} y={252} width={110} height={30} rx={5} fill="var(--pcb-surface)" stroke={HAIR_STRONG} strokeWidth={1} />
            <text x={x + 55} y={272} textAnchor="middle" className={styles.panelSub}>
              Cin
            </text>
            <line x1={x + 55} y1={282} x2={x + 55} y2={306} stroke={WIRE} strokeWidth={1.8} />

            {/* 功率环路高亮 */}
            <rect
              x={x - 8}
              y={174}
              width={126}
              height={116}
              rx={9}
              fill="none"
              stroke={PRIMARY}
              strokeWidth={1.1}
              strokeDasharray="5 4"
              opacity={0.85}
            />
          </g>
        ))}

        {/* 12V 与地 */}
        <rect x={468} y={306} width={392} height={12} rx={3} fill={COPPER} opacity={0.7} />
        <text x={468} y={336} className={styles.annoLabelDim}>
          12V 铜皮（母线的分支）
        </text>
        <text x={860} y={336} textAnchor="end" className={styles.annoLabelDim}>
          GND 平面整层完整
        </text>

        {/* 控制器 */}
        <rect x={468} y={356} width={392} height={44} rx={8} fill="var(--pcb-surface)" stroke={HAIR_STRONG} strokeWidth={1} />
        <text x={664} y={383} textAnchor="middle" className={styles.panelSub}>
          多相控制器 · 均流 / VID / 遥测
        </text>
        {cols.map((x) => (
          <line
            key={`pwm-${x}`}
            x1={x + 55}
            y1={356}
            x2={x + 55}
            y2={334}
            stroke={HAIR_STRONG}
            strokeWidth={1.1}
            strokeDasharray="4 3"
          />
        ))}
        <text x={470} y={420} className={styles.annoLabelDim}>
          相邻相错开 360°/N，输入纹波互相抵消；均流失效时，最先过流的那相会先热
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * FIG · C03 —— 上电时序与 PG 链
 * ========================================================================= */

export function PowerSequenceWave() {
  const rails = [
    { name: '1V8（IO）', y: 96, t: 176, color: WIRE },
    { name: 'VDDQ', y: 168, t: 268, color: WIRE },
    { name: 'VPP', y: 240, t: 348, color: WIRE },
    { name: 'VCORE', y: 312, t: 430, color: PRIMARY },
  ];
  const amp = 44;
  const downAt = [716, 748, 780, 812];

  return (
    <FigureShell
      no="FIG · C03"
      title="上电顺序与 PG 级联：上电正序、下电逆序"
      meta="时序示意 · 时间轴非等比例"
      legend={[
        { n: 1, label: '常电轨', hint: '3.3 V AUX / 1.8 V，主机待机时就有电' },
        { n: 2, label: '前级 PG 触发后级 EN', hint: '级联链，不是各自定时上电' },
        { n: 3, label: '延时', hint: '优先用芯片自带的 PG 延时，其次 RC + 施密特' },
        { n: 4, label: 'RESET 释放', hint: '全部 PG 有效后再等 1–10 ms，一次性放开' },
        { n: 5, label: '下电逆序', hint: '先关核心，避免 IO 带电反灌 core' },
      ]}
      caption="每一轨在上一轨 PG 有效之后才被放开，这是级联不是各自定时。下电时的顺序必须反过来，而且必须是主动拉低 EN，而不是等电容自然放电——自然放电的顺序由容量和负载决定，不受控。"
      note="具体顺序、延时与阈值以芯片 PDG（电源设计指南）为准，本图只画方法。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-c03-title" className={styles.svg}>
        <title id="fig-c03-title">
          上电时序波形：1.8V、VDDQ、VPP、VCORE 依次按前级 PG 延时上电，RESET 最后释放；右侧先关核心再逆序下电
        </title>

        {/* 坐标轴 */}
        <line x1={120} y1={48} x2={120} y2={372} stroke={INK} strokeWidth={1.2} opacity={0.55} />
        <line x1={120} y1={372} x2={868} y2={372} stroke={INK} strokeWidth={1.2} opacity={0.55} />
        <text x={120} y={40} textAnchor="middle" className={styles.annoLabelDim}>
          V
        </text>
        <text x={862} y={392} textAnchor="end" className={styles.annoLabelDim}>
          t →
        </text>

        {rails.map((r, i) => {
          const top = r.y - amp;
          const down = downAt[rails.length - 1 - i];
          return (
            <g key={r.name}>
              {/* 0V 基线 */}
              <line x1={120} y1={r.y} x2={868} y2={r.y} stroke={HAIR} strokeWidth={0.8} strokeDasharray="2 5" />
              {/* 波形 */}
              <polyline
                points={`120,${r.y} ${r.t},${r.y} ${r.t + 6},${top} 700,${top} ${down},${top} ${down + 6},${r.y} 868,${r.y}`}
                fill="none"
                stroke={r.color}
                strokeWidth={i === 3 ? 2.4 : 1.9}
              />
              <text x={112} y={r.y + 4} textAnchor="end" className={styles.panelSub}>
                {r.name}
              </text>
              {/* 上电边沿的延时标注 */}
              <line x1={r.t} y1={top - 6} x2={r.t} y2={top + amp - 2} stroke={PRIMARY} strokeWidth={0.9} strokeDasharray="3 3" opacity={0.7} />
              <text x={r.t + 4} y={top - 10} className={styles.annoLabelDim}>
                T{i + 1}
              </text>
            </g>
          );
        })}

        {/* PG 链 */}
        <text x={112} y={352} textAnchor="end" className={styles.panelSub}>
          PG（各级）
        </text>
        {[
          { x: 182, w: 84 },
          { x: 274, w: 74 },
          { x: 354, w: 76 },
          { x: 436, w: 264 },
        ].map((p) => (
          <rect key={p.x} x={p.x} y={344} width={p.w} height={14} fill="none" stroke={HAIR_STRONG} strokeWidth={1} />
        ))}
        <text x={182} y={338} className={styles.annoLabelDim}>
          各级 PG 依次抬高
        </text>

        {/* RESET */}
        <text x={112} y={424} textAnchor="end" className={styles.panelSub}>
          RESET#
        </text>
        <polyline
          points={`120,428 500,428 500,408 700,408 700,428 868,428`}
          fill="none"
          stroke={INK}
          strokeWidth={1.8}
          opacity={0.75}
        />
        <line x1={500} y1={400} x2={500} y2={444} stroke={PRIMARY} strokeWidth={0.9} strokeDasharray="3 3" opacity={0.8} />
        <text x={506} y={402} className={styles.annoLabelDim}>
          全部 PG 有效 + 1–10 ms 才释放
        </text>

        {/* 下电区 */}
        <rect x={700} y={62} width={168} height={300} rx={10} fill="var(--pcb-surface)" stroke={PRIMARY} strokeWidth={1} strokeDasharray="5 4" opacity={0.55} />
        <text x={784} y={452} textAnchor="middle" className={styles.annoLabel}>
          下电：逆序
        </text>
        <text x={784} y={470} textAnchor="middle" className={styles.annoLabelDim}>
          VCORE → VPP → VDDQ → 1V8
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * FIG · C04 —— PCIe 金手指：引脚分区 + 差分对
 * ========================================================================= */

export function PcieFingerMap() {
  /* 金手指分区（示意，按功能而非实际脚位） */
  const groups = [
    { x: 84, w: 96, label: '12V', color: COPPER, hint: '3 脚有效' },
    { x: 184, w: 54, label: 'GND', color: 'var(--pcb-mask)', hint: '' },
    { x: 242, w: 64, label: '3.3V', color: COPPER, hint: '3 脚' },
    { x: 310, w: 60, label: 'AUX', color: COPPER, hint: '3.3Vaux' },
    { x: 374, w: 108, label: '边带', color: COMP, hint: 'PRSNT · PERST# · REFCLK' },
    { x: 486, w: 200, label: '差分对 lane 0–15', color: WIRE, hint: '85 Ω ±10%' },
    { x: 690, w: 54, label: 'GND', color: 'var(--pcb-mask)', hint: '' },
    { x: 748, w: 60, label: '边带', color: COMP, hint: 'SMBus · WAKE#' },
  ];

  return (
    <FigureShell
      no="FIG · C04"
      title="PCIe 金手指：引脚分区与差分对连接"
      meta="俯视示意 · 脚位以 CEM 表格为准"
      legend={[
        { n: 1, label: '电源脚区', hint: '12V 每脚 ≤ 5.5 A；同区铜皮要能承载全部引脚之和' },
        { n: 2, label: '边带信号', hint: 'PRSNT、PERST#、REFCLK、SMBus、WAKE#、CLKREQ#' },
        { n: 3, label: '高速差分对', hint: 'TX 侧贴 AC 耦合电容，RX 侧不贴' },
        { n: 4, label: 'AC 耦合', hint: '100 nF（75–200 nF），成对、等值、靠近发送端' },
        { n: 5, label: '阻抗控制', hint: 'PCIe 是 85 Ω 差分，不是 USB/以太网的 100 Ω' },
      ]}
      caption="金手指上的引脚按功能分区，电源区决定整卡能从插槽取多少电，边带区决定主机认不认这张卡，差分区决定链路能跑几代。上方是引脚分区，下方是一对 TX 的连接方式：电容只在发送侧，两侧都要 85 Ω 并做对内等长。"
      note="12V 引脚的实际有效数量与排列在 x1/x4/x8/x16 之间不同，画板前查 CEM 规范表。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-c04-title" className={styles.svg}>
        <title id="fig-c04-title">
          PCIe 金手指引脚分区图（电源、地、边带与十六对差分）以及 TX 差分对经 100 nF 交流耦合进金手指的连接示意
        </title>

        {/* A 面 */}
        <text x={40} y={64} className={styles.panelTitle}>
          A 面
        </text>
        <rect x={72} y={80} width={756} height={44} rx={6} fill="none" stroke={HAIR_STRONG} strokeWidth={1} />
        {groups.map((g) => (
          <g key={`a-${g.x}`}>
            <rect x={g.x} y={86} width={g.w} height={32} rx={3} fill={g.color} opacity={0.55} stroke={INK} strokeWidth={0.6} strokeOpacity={0.25} />
            <text x={g.x + g.w / 2} y={107} textAnchor="middle" className={styles.chipLabel}>
              {g.label}
            </text>
            {g.hint && (
              <text x={g.x + g.w / 2} y={76} textAnchor="middle" className={styles.annoLabelDim}>
                {g.hint}
              </text>
            )}
          </g>
        ))}

        {/* B 面：同结构，说明镜像 */}
        <text x={40} y={168} className={styles.panelTitle}>
          B 面
        </text>
        <rect x={72} y={184} width={756} height={44} rx={6} fill="none" stroke={HAIR_STRONG} strokeWidth={1} />
        {groups.map((g) => (
          <rect
            key={`b-${g.x}`}
            x={g.x}
            y={190}
            width={g.w}
            height={32}
            rx={3}
            fill={g.color}
            opacity={0.28}
            stroke={INK}
            strokeWidth={0.6}
            strokeOpacity={0.2}
          />
        ))}
        <text x={828} y={212} textAnchor="end" className={styles.annoLabelDim}>
          镜像布局，电源与地成对分布
        </text>

        {/* 分隔 */}
        <line x1={40} y1={252} x2={862} y2={252} stroke={HAIR} strokeWidth={1} />

        {/* 差分对连接示意 */}
        <text x={40} y={284} className={styles.panelTitle}>
          一对 TX 的连接（RX 对同理但无耦合电容）
        </text>

        <rect x={48} y={304} width={132} height={62} rx={8} fill="var(--pcb-surface)" stroke={HAIR_STRONG} strokeWidth={1} />
        <text x={114} y={330} textAnchor="middle" className={styles.panelSub}>
          主控 IC / PHY
        </text>
        <text x={114} y={348} textAnchor="middle" className={styles.annoLabelDim}>
          TX 驱动
        </text>

        {/* 两路线 */}
        {[318, 350].map((y, i) => (
          <g key={y}>
            <line x1={180} y1={y} x2={300} y2={y} stroke={WIRE} strokeWidth={2} />
            <Cap x={310} y={y} size={12} />
            <line x1={322} y1={y} x2={470} y2={y} stroke={WIRE} strokeWidth={2} />
            <text x={240} y={y - 8} textAnchor="middle" className={styles.annoLabelDim}>
              {i === 0 ? 'D+' : 'D−'}
            </text>
          </g>
        ))}
        <text x={310} y={392} textAnchor="middle" className={styles.annoLabel}>
          100 nF ×2
        </text>
        <text x={310} y={410} textAnchor="middle" className={styles.annoLabelDim}>
          只贴在发送侧
        </text>

        {/* 金手指端 */}
        <rect x={470} y={300} width={70} height={70} rx={6} fill={COMP} opacity={0.35} stroke={INK} strokeWidth={0.8} strokeOpacity={0.35} />
        <text x={505} y={340} textAnchor="middle" className={styles.chipLabel}>
          金手指
        </text>

        {/* 标注：阻抗与等长 */}
        <line x1={240} y1={430} x2={460} y2={430} stroke={PRIMARY} strokeWidth={1.2} />
        <line x1={240} y1={424} x2={240} y2={436} stroke={PRIMARY} strokeWidth={1.2} />
        <line x1={460} y1={424} x2={460} y2={436} stroke={PRIMARY} strokeWidth={1.2} />
        <text x={350} y={452} textAnchor="middle" className={styles.annoLabel}>
          85 Ω 差分 · 对内失配 ≤ 5 mil
        </text>

        <text x={570} y={310} className={styles.annoLabel}>
          布线要点
        </text>
        {[
          '内层走线，参考完整地平面',
          '换层时成对过孔 + 两侧回流地孔',
          '金手指下方禁走线、禁铺铜',
          '对边带信号加超低容 ESD（≤0.5 pF）',
        ].map((t, i) => (
          <text key={t} x={570} y={336 + i * 22} className={styles.annoLabelDim}>
            · {t}
          </text>
        ))}
      </svg>
    </FigureShell>
  );
}
