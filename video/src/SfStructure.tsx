import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Chrome } from './fab/Chrome';
import { Body, Callout, Hair, Marker, Panel, Rise, Scene, Tag, Title } from './fab/prims';
import { C, F, FE, MONO, SANS, easeOut } from './fab/theme';

/* ──────────────────────────── 时间轴 ──────────────────────────── */

export const A_DURATION = 1290;

const CHAPTERS = [
  { no: '01', label: '四大作用', from: 0 },
  { no: '02', label: '剖面', from: 130 },
  { no: '03', label: '层名', from: 500 },
  { no: '04', label: '约束', from: 800 },
  { no: '05', label: '覆铜板', from: 1010 },
  { no: '06', label: '收束', from: 1190 },
] as const;

/* ──────────────────────── 01 · 四大作用 ──────────────────────── */

const ROLES = [
  { k: '支撑', how: '基材的机械强度', where: '介质层（FR-4 等）' },
  { k: '互连', how: '铜箔走线 + 金属化孔', where: '线路层与通孔' },
  { k: '绝缘', how: '基材本身 + 阻焊涂层', where: '介质层与阻焊层' },
  { k: '散热与屏蔽', how: '大面积铜、内层完整平面、金属基板', where: '铜箔 / 内电层 / 铝基板' },
];

const S0: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={0} to={132}>
    <div style={{ display: 'flex', gap: 56 }}>
      <div style={{ width: 860, paddingTop: 32 }}>
        <Rise frame={frame} at={2}>
          <Tag tone="dim">FIG · 01 · 剖面解剖</Tag>
        </Rise>
        <Rise frame={frame} at={8}>
          <Title size={76} style={{ marginTop: 22 }}>
            拆开一块板
          </Title>
        </Rise>
        <Rise frame={frame} at={16}>
          <Body size={21} style={{ marginTop: 20, maxWidth: 800 }}>
            双面板由五个要素构成。截面里它们贴在一起，分层之后才看得清各自的形状——
            每一层都对应 PCB 的一个作用。
          </Body>
        </Rise>
        <Rise frame={frame} at={78} style={{ marginTop: 44 }}>
          <Callout tone="idea" size={18}>
            规范叫法是「<span style={{ color: C.ink }}>印制</span>电路板」而不是「印刷电路板」——
            线路是靠<span style={{ color: C.ink }}>图形转移 + 蚀刻</span>「做」出来的，不是「印」上去的。
          </Callout>
        </Rise>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ROLES.map((r, i) => (
          <Rise key={r.k} frame={frame} at={30 + i * 10} style={{ flex: 1 }}>
            <Panel style={{ padding: '18px 22px', height: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.ghost, letterSpacing: '0.12em' }}>
                  0{i + 1}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 25, color: C.ink, letterSpacing: '-0.01em' }}>
                  {r.k}
                </span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 16, color: C.dim, marginTop: 8, lineHeight: 1.5 }}>
                {r.how}
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: 22,
                  top: 24,
                  fontFamily: MONO,
                  fontSize: 12,
                  letterSpacing: '0.04em',
                  color: C.blue,
                }}
              >
                {r.where}
              </div>
            </Panel>
          </Rise>
        ))}
      </div>
    </div>
  </Scene>
);

/* ─────────────────────── 02 · 剖面爆炸视图 ─────────────────────── */

type Band = { x0: number; x1: number };

const VIA1 = 330;
const VIA2 = 560;
const PAD = 27;
const BARREL = 11;
const VOID = 6;

const SILK: Band[] = [
  { x0: 212, x1: 300 },
  { x0: 470, x1: 556 },
];
const CU_TOP: Band[] = [
  { x0: 150, x1: VIA1 - PAD },
  { x0: VIA1 + PAD, x1: VIA2 - PAD },
  { x0: VIA2 + PAD, x1: 730 },
];
const CU_BOT: Band[] = [
  { x0: 150, x1: 402 },
  { x0: 424, x1: 730 },
];

/** 组装态各层 y / 厚 */
const LY = {
  silk: [196, 5],
  maskT: [204, 13],
  cuT: [219, 15],
  fr4: [236, 76],
  cuB: [314, 15],
  maskB: [331, 13],
} as const;

const FIELDS: {
  key: keyof typeof LY;
  idx: number;
  name: string;
  en: string;
  l1: string;
  l2: string;
  tone: string;
}[] = [
  { key: 'silk', idx: 0, name: '丝印', en: 'SILKSCREEN', l1: '位号 · 外框 · 方向与极性', l2: '给人和机器看的注释层，没有电气作用', tone: C.silk },
  { key: 'maskT', idx: 1, name: '阻焊层', en: 'SOLDER MASK', l1: '挡焊料 · 防氧化 · 防桥连', l2: '颜色不改变电气性能', tone: C.green },
  { key: 'cuT', idx: 2, name: '铜箔', en: 'COPPER', l1: '1 oz ≈ 35 µm 厚', l2: '线宽 / 间距常见 4/4 mil 起', tone: C.cu },
  { key: 'fr4', idx: 3, name: '介质层', en: 'FR-4', l1: '板厚 0.8 / 1.0 / 1.6 mm', l2: 'Tg 130–180 ℃；越薄阻抗越早出问题', tone: C.dim },
  { key: 'maskB', idx: 5, name: '通孔', en: 'PTH', l1: '孔径 0.2–0.3 mm', l2: '纵横比通常不超过 8:1', tone: C.blue },
];

const Anatomy: React.FC<{ explode: number }> = ({ explode }) => {
  const dy = (idx: number) => (idx - 2.5) * 52 * explode;
  const w = (b: Band) => b.x1 - b.x0;

  return (
    <svg width={1680} height={648} viewBox="40 0 1400 540">
      <defs>
        <pattern id="a-fr4" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
        </pattern>
        <pattern id="a-cu" width="5.5" height="5.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5.5" stroke="rgba(255,255,255,0.30)" strokeWidth={1} />
        </pattern>
      </defs>

      {/* 左侧总厚度尺寸线 */}
      <g opacity={1 - explode * 1.4}>
        <line x1={120} y1={LY.silk[0]} x2={120} y2={LY.maskB[0] + LY.maskB[1]} stroke={C.faint} strokeWidth={1} />
        <line x1={112} y1={LY.silk[0]} x2={128} y2={LY.silk[0]} stroke={C.faint} strokeWidth={1} />
        <line x1={112} y1={LY.maskB[0] + LY.maskB[1]} x2={128} y2={LY.maskB[0] + LY.maskB[1]} stroke={C.faint} strokeWidth={1} />
        <text
          x={104}
          y={(LY.silk[0] + LY.maskB[0] + LY.maskB[1]) / 2}
          fontFamily={MONO}
          fontSize={13}
          fill={C.dim}
          textAnchor="end"
          letterSpacing="0.08em"
        >
          t = 1.6 mm
        </text>
      </g>

      {/* 丝印 */}
      <g transform={`translate(0 ${dy(0)})`} opacity={1}>
        {SILK.map((b) => (
          <rect key={`s${b.x0}`} x={b.x0} y={LY.silk[0]} width={w(b)} height={LY.silk[1]} fill={C.silk} opacity={0.92} />
        ))}
      </g>

      {/* 阻焊上：开窗 */}
      <g transform={`translate(0 ${dy(1)})`}>
        {[
          [150, VIA1 - PAD - 3],
          [VIA1 + PAD + 3, VIA2 - PAD - 3],
          [VIA2 + PAD + 3, 730],
        ].map(([a, b]) => (
          <rect key={`mt${a}`} x={a} y={LY.maskT[0]} width={b - a} height={LY.maskT[1]} fill={C.mask} />
        ))}
        {[
          [150, VIA1 - PAD - 3],
          [VIA1 + PAD + 3, VIA2 - PAD - 3],
          [VIA2 + PAD + 3, 730],
        ].map(([a, b]) => (
          <rect key={`mtl${a}`} x={a} y={LY.maskT[0]} width={b - a} height={0.8} fill={C.maskLine} />
        ))}
      </g>

      {/* 铜箔上 */}
      <g transform={`translate(0 ${dy(2)})`}>
        {CU_TOP.map((b) => (
          <rect key={`ct${b.x0}`} x={b.x0} y={LY.cuT[0]} width={w(b)} height={LY.cuT[1]} fill={C.cu} />
        ))}
        {CU_TOP.map((b) => (
          <rect key={`cth${b.x0}`} x={b.x0} y={LY.cuT[0]} width={w(b)} height={LY.cuT[1]} fill="url(#a-cu)" opacity={0.5} />
        ))}
        {[VIA1, VIA2].map((v) => (
          <rect key={`cp${v}`} x={v - PAD} y={LY.cuT[0]} width={PAD * 2} height={LY.cuT[1]} fill={C.cu} />
        ))}
      </g>

      {/* 介质层 */}
      <g transform={`translate(0 ${dy(3)})`}>
        <rect x={150} y={LY.fr4[0]} width={580} height={LY.fr4[1]} fill={C.fr4} />
        <rect x={150} y={LY.fr4[0]} width={580} height={LY.fr4[1]} fill="url(#a-fr4)" />
        <rect x={150} y={LY.fr4[0]} width={580} height={LY.fr4[1]} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
      </g>

      {/* 铜箔下 */}
      <g transform={`translate(0 ${dy(4)})`}>
        {CU_BOT.map((b) => (
          <rect key={`cb${b.x0}`} x={b.x0} y={LY.cuB[0]} width={w(b)} height={LY.cuB[1]} fill={C.cu} />
        ))}
        {[VIA1, VIA2].map((v) => (
          <rect key={`cbp${v}`} x={v - PAD} y={LY.cuB[0]} width={PAD * 2} height={LY.cuB[1]} fill={C.cu} />
        ))}
      </g>

      {/* 阻焊下 */}
      <g transform={`translate(0 ${dy(5)})`}>
        {[
          [150, VIA1 - PAD - 3],
          [VIA1 + PAD + 3, VIA2 - PAD - 3],
          [VIA2 + PAD + 3, 730],
        ].map(([a, b]) => (
          <rect key={`mb${a}`} x={a} y={LY.maskB[0]} width={b - a} height={LY.maskB[1]} fill={C.mask} />
        ))}
      </g>

      {/* 金属化孔：组装态实体，爆炸态改为虚线引线 */}
      {[VIA1, VIA2].map((v) => (
        <g key={`via${v}`} opacity={1 - explode}>
          <rect x={v - BARREL} y={LY.cuT[0]} width={BARREL - VOID} height={LY.cuB[0] + LY.cuB[1] - LY.cuT[0]} fill={C.cu} />
          <rect x={v + VOID} y={LY.cuT[0]} width={BARREL - VOID} height={LY.cuB[0] + LY.cuB[1] - LY.cuT[0]} fill={C.cu} />
          <rect x={v - VOID} y={LY.cuT[0]} width={VOID * 2} height={LY.cuB[0] + LY.cuB[1] - LY.cuT[0]} fill={C.hole} stroke="rgba(255,255,255,0.18)" strokeWidth={0.8} />
        </g>
      ))}
      {[VIA1, VIA2].map((v) => (
        <g key={`vd${v}`} opacity={explode}>
          <line x1={v} y1={LY.cuT[0] + dy(2) + 7} x2={v} y2={LY.cuB[0] + dy(4) + 7} stroke={C.blue} strokeWidth={1} strokeDasharray="4 5" />
        </g>
      ))}

      {/* 右侧标签：行距固定（不随爆炸位移），引线连到浮动后的层次 */}
      {FIELDS.map((f) => {
        const [y0, h] = LY[f.key];
        // 「通孔」不是某一层，引线挂到孔壁虚线的下端，避免误指底部阻焊
        const isVia = f.key === 'maskB';
        const yLayer = isVia ? LY.cuB[0] + LY.cuB[1] + dy(4) + 8 : y0 + h / 2 + dy(f.idx);
        const xStart = isVia ? VIA2 + 10 : 736;
        const yRow = y0 + h / 2 + (f.idx - 2.5) * 58;
        const t = easeOut(Math.max(0, Math.min(1, (explode - 0.06) / 0.3)));
        return (
          <g key={f.name} opacity={t} transform={`translate(${(1 - t) * -14} 0)`}>
            <polyline
              points={`${xStart},${yLayer} 772,${yLayer} 800,${yRow + 10}`}
              fill="none"
              stroke={C.hair}
              strokeWidth={1}
            />
            <circle cx={xStart} cy={yLayer} r={2.6} fill={f.tone} />
            <text x={812} y={yRow - 10} fontFamily={SANS} fontSize={23} fill={C.ink} dominantBaseline="middle">
              {f.name}
            </text>
            <text
              x={812 + f.name.length * 23 + 14}
              y={yRow - 9}
              fontFamily={MONO}
              fontSize={12}
              fill={C.faint}
              letterSpacing="0.16em"
              dominantBaseline="middle"
            >
              {f.en}
            </text>
            <text x={812} y={yRow + 14} fontFamily={SANS} fontSize={15} fill={C.dim} dominantBaseline="middle">
              {f.l1}
            </text>
            <text x={812} y={yRow + 34} fontFamily={SANS} fontSize={13} fill={C.faint} dominantBaseline="middle">
              {f.l2}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const S1: React.FC<{ frame: number }> = ({ frame }) => {
  const explode = FE(frame, 176, 262, 0, 1);
  return (
    <Scene frame={frame} from={132} to={502}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <Tag tone="dim">剖面 · 5 LAYERS</Tag>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          自上而下：丝印 / 阻焊 / 铜箔 / FR-4 / 铜箔 / 阻焊 / 通孔
        </span>
      </div>
      <div style={{ marginTop: 24 }}>
        <Anatomy explode={explode} />
      </div>
      <div style={{ marginTop: -34, opacity: F(frame, 300, 330) }}>
        <Callout tone="info" size={17}>
          孔壁靠化学沉铜再电镀加厚——<span style={{ color: C.ink }}>孔金属化的质量直接决定可靠性</span>；没有通孔，双面板只是「两张单面板背靠背」。
        </Callout>
      </div>
    </Scene>
  );
};

/* ─────────────────────── 03 · EDA 层名与正负片 ─────────────────────── */

const LAYERS = [
  { cn: '信号层', eda: 'Top / Bottom / Mid 1…n', pol: '正片', note: '画的铜就是要留下的铜' },
  { cn: '内电层', eda: 'Internal Plane', pol: '负片', note: '画的是要挖掉的隔离带' },
  { cn: '阻焊层', eda: 'Solder Mask Top / Bottom', pol: '负片', note: '画的是露铜区' },
  { cn: '助焊层', eda: 'Paste Mask · 钢网层', pol: '正片', note: '只有贴片焊盘才有' },
  { cn: '丝印层', eda: 'Silkscreen / Overlay', pol: '正片', note: '位号、外框、极性' },
  { cn: '机械层', eda: 'Mechanical', pol: '—', note: '板框、尺寸，无电气含义' },
  { cn: '钻孔层', eda: 'Drill', pol: '—', note: '不是图形，是孔径表' },
];

const PolarityCard: React.FC<{
  title: string;
  draw: string;
  result: string;
  kind: 'mask' | 'plane';
  frame: number;
  at: number;
}> = ({ title, draw, result, kind, frame, at }) => {
  const t = easeOut(F(frame, at, at + 16));
  return (
    <Rise frame={frame} at={at} style={{ opacity: t }}>
      <Panel style={{ padding: '18px 20px', width: 404 }}>
        <div style={{ fontFamily: SANS, fontSize: 18, color: C.ink }}>{title}</div>
        <svg width={364} height={78} viewBox="0 0 364 78" style={{ marginTop: 10 }}>
          <rect x={0.5} y={0.5} width={363} height={77} fill="rgba(255,255,255,0.02)" stroke={C.hair} />
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`gx${i}`} x1={i * 28} y1={0} x2={i * 28} y2={78} stroke="rgba(255,255,255,0.045)" strokeWidth={1} />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <line key={`gy${i}`} x1={0} y1={i * 26} x2={364} y2={i * 26} stroke="rgba(255,255,255,0.045)" strokeWidth={1} />
          ))}
          {kind === 'mask' ? (
            <circle cx={100} cy={39} r={22} fill="none" stroke={C.blue} strokeWidth={1.6} />
          ) : (
            <line x1={40} y1={39} x2={324} y2={39} stroke={C.blue} strokeWidth={1.6} />
          )}
          <text x={12} y={16} fontFamily={MONO} fontSize={10} fill={C.faint} letterSpacing="0.12em">
            EDA 里画的
          </text>
        </svg>
        <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 8 }}>{draw}</div>

        <div style={{ textAlign: 'center', color: C.faint, fontSize: 15, margin: '4px 0' }}>↓</div>

        <svg width={364} height={86} viewBox="0 0 364 86" style={{ marginTop: 2 }}>
          {kind === 'mask' ? (
            <>
              <rect x={20} y={26} width={324} height={34} fill={C.mask} stroke={C.maskLine} strokeWidth={1} />
              <circle cx={100} cy={43} r={20} fill={C.cu} />
              <circle cx={100} cy={43} r={20} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
            </>
          ) : (
            <>
              <rect x={20} y={26} width={324} height={34} fill={C.cu} opacity={0.92} />
              <rect x={20} y={40} width={324} height={9} fill={C.bg} />
              <rect x={20} y={26} width={324} height={34} fill="none" stroke="rgba(255,255,255,0.18)" />
            </>
          )}
          <text x={12} y={16} fontFamily={MONO} fontSize={10} fill={C.faint} letterSpacing="0.12em">
            实际得到的
          </text>
        </svg>
        <div style={{ fontFamily: SANS, fontSize: 15, color: C.ink, marginTop: 6 }}>{result}</div>
      </Panel>
    </Rise>
  );
};

const S2: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={502} to={802}>
    <div style={{ display: 'flex', gap: 56 }}>
      <div style={{ width: 720 }}>
        <Rise frame={frame} at={506}>
          <Tag tone="dim">同一块板 · 另一套名字</Tag>
          <Title size={40} style={{ marginTop: 12 }}>
            层管理器里长这样
          </Title>
        </Rise>

        <div style={{ marginTop: 24 }}>
          {LAYERS.map((l, i) => (
            <Rise key={l.cn} frame={frame} at={522 + i * 8}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '9px 0',
                  borderBottom: `1px solid ${C.hairSoft}`,
                }}
              >
                <span style={{ width: 82, fontFamily: SANS, fontSize: 19, color: C.ink }}>{l.cn}</span>
                <span style={{ flex: 1, fontFamily: MONO, fontSize: 13, color: C.faint, letterSpacing: '0.02em' }}>
                  {l.eda}
                </span>
                <span
                  style={{
                    width: 46,
                    textAlign: 'center',
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: '0.06em',
                    color: l.pol === '负片' ? C.amber : l.pol === '正片' ? C.green : C.ghost,
                    border: `1px solid ${l.pol === '负片' ? 'rgba(245,166,35,0.4)' : l.pol === '正片' ? 'rgba(62,207,142,0.3)' : C.hair}`,
                    borderRadius: 3,
                    padding: '2px 0',
                  }}
                >
                  {l.pol}
                </span>
                <span style={{ width: 210, fontFamily: SANS, fontSize: 14, color: C.dim }}>{l.note}</span>
              </div>
            </Rise>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <PolarityCard
          frame={frame}
          at={560}
          title="阻焊层：你画一个圆"
          kind="mask"
          draw="画的是「哪里不要阻焊」"
          result="得到一个没有阻焊的圆窗 → 露铜"
        />
        <PolarityCard
          frame={frame}
          at={606}
          title="内电层：你画一条线"
          kind="plane"
          draw="画的是「哪里不要铜」"
          result="得到一条没有铜的隔离带"
        />
      </div>
    </div>

    <Rise frame={frame} at={700} style={{ marginTop: 22 }}>
      <Callout tone="warn" size={19}>
        <span style={{ color: C.ink }}>阻焊层和内电层画的都是「不要的部分」</span>
        ；信号层、丝印层、助焊层画的都是「要的部分」。
      </Callout>
    </Rise>
  </Scene>
);

/* ───────────────────────── 04 · 硬约束 ───────────────────────── */

const LIMITS = [
  { v: '+0.05–0.1', u: 'mm', k: '阻焊开窗单边', why: '补偿对位偏差；开窗不够，油墨会盖住焊盘边缘，焊接时润湿不良' },
  { v: '≥ 0.15', u: 'mm', k: '阻焊桥', why: '太窄会在曝光显影时断掉，回流时相邻焊盘连锡' },
  { v: '≥ 0.15', u: 'mm', k: '丝印到焊盘', why: '压盘会导致润湿不良、元件立碑、虚焊' },
  { v: '0.15 / 0.8', u: 'mm', k: '丝印线宽 / 字高', why: '板厂丝印精度的下限，再细就糊成一团' },
];

const S3: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={802} to={1012}>
    <Rise frame={frame} at={806}>
      <Tag tone="amber">硬约束 · 和层一一对应</Tag>
      <Title size={40} style={{ marginTop: 12 }}>
        四个不能拍脑袋的尺寸
      </Title>
    </Rise>

    <div style={{ display: 'flex', gap: 18, marginTop: 40 }}>
      {LIMITS.map((l, i) => (
        <Rise key={l.k} frame={frame} at={824 + i * 12} style={{ flex: 1 }}>
          <Panel style={{ padding: '22px 22px 26px', height: 250, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 34, color: C.ink, letterSpacing: '-0.02em' }}>{l.v}</span>
              <span style={{ fontFamily: MONO, fontSize: 14, color: C.faint }}>{l.u}</span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 19, color: C.blue, marginTop: 10 }}>{l.k}</div>
            <Hair style={{ margin: '14px 0' }} />
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, lineHeight: 1.65 }}>{l.why}</div>
          </Panel>
        </Rise>
      ))}
    </div>

    <Rise frame={frame} at={930} style={{ marginTop: 30 }}>
      <Callout tone="warn" size={18}>
        丝印压在焊盘上是<span style={{ color: C.ink }}>最典型的低级错误之一</span>——出图前一定检查「丝印压焊盘」这一项 DRC。
      </Callout>
    </Rise>
  </Scene>
);

/* ──────────────────────── 05 · 覆铜板 CCL ──────────────────────── */

const FAMILY = [
  { name: 'FR-4', make: '玻纤布 + 环氧树脂', feat: 'Dk ≈ 4.2–4.6，通用便宜', use: '绝大多数数字与消费类产品' },
  { name: 'CEM-1 / 3', make: '纸基或复合基 + 环氧', feat: '成本更低，耐热略逊', use: '单面板、低成本家电' },
  { name: '高频 PTFE', make: '聚四氟乙烯 / 改性树脂', feat: 'Dk 稳定、Df 低、损耗小', use: '射频、毫米波、高速背板' },
  { name: '铝基板', make: '铝基 + 绝缘层 + 铜', feat: '导热好，单面为主', use: 'LED、电源、功率模块' },
  { name: '柔性 PI', make: '聚酰亚胺（FPC）', feat: '可弯折、可动态弯折', use: '摄像头模组、连接排线' },
];

const S4: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1012} to={1192}>
    <div style={{ display: 'flex', gap: 64 }}>
      <div style={{ width: 520 }}>
        <Rise frame={frame} at={1016}>
          <Tag tone="dim">原料 · CCL</Tag>
          <Title size={40} style={{ marginTop: 12 }}>
            覆铜板
          </Title>
          <Body size={18} style={{ marginTop: 14, maxWidth: 470 }}>
            也叫铜箔层压板：一层或多层铜箔粘在一整块绝缘基材上。板厂问你「板材、铜厚、板厚」，问的就是它。
          </Body>
        </Rise>

        <Rise frame={frame} at={1050} style={{ marginTop: 30 }}>
          <svg width={470} height={190} viewBox="0 0 470 190">
            <rect x={30} y={34} width={410} height={20} fill={C.cu} />
            <rect x={30} y={34} width={410} height={20} fill="url(#a-cu)" opacity={0.45} />
            <rect x={30} y={58} width={410} height={76} fill={C.fr4} stroke="rgba(255,255,255,0.16)" />
            <rect x={30} y={58} width={410} height={76} fill="url(#a-fr4)" />
            <rect x={30} y={138} width={410} height={20} fill={C.cu} />
            <rect x={30} y={138} width={410} height={20} fill="url(#a-cu)" opacity={0.45} />
            <text x={450} y={48} fontFamily={MONO} fontSize={12} fill={C.cu} textAnchor="end" dominantBaseline="middle">
              铜箔
            </text>
            <text x={450} y={100} fontFamily={MONO} fontSize={12} fill={C.dim} textAnchor="end" dominantBaseline="middle">
              绝缘基材
            </text>
            <text x={450} y={152} fontFamily={MONO} fontSize={12} fill={C.cu} textAnchor="end" dominantBaseline="middle">
              铜箔
            </text>
            <defs>
              <pattern id="a-cu2" width="5.5" height="5.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
              </pattern>
            </defs>
          </svg>
        </Rise>

        <Rise frame={frame} at={1100} style={{ marginTop: 12 }}>
          <Callout tone="idea" size={17}>
            铜厚用 <span style={{ fontFamily: MONO, color: C.ink }}>oz</span> 表示：一平方英尺上的铜重一盎司 →{' '}
            <span style={{ fontFamily: MONO, color: C.ink }}>1 oz ≈ 35 µm</span>。载流大的板选 2 oz 甚至更厚。
          </Callout>
        </Rise>
      </div>

      <div style={{ flex: 1 }}>
        <Rise frame={frame} at={1030}>
          <div
            style={{
              display: 'flex',
              gap: 16,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.14em',
              color: C.faint,
              paddingBottom: 10,
              borderBottom: `1px solid ${C.hair}`,
            }}
          >
            <span style={{ width: 150 }}>板材</span>
            <span style={{ width: 240 }}>组成</span>
            <span style={{ flex: 1 }}>特点</span>
            <span style={{ width: 250 }}>典型用途</span>
          </div>
        </Rise>
        {FAMILY.map((f, i) => (
          <Rise key={f.name} frame={frame} at={1044 + i * 12}>
            <div
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: '13px 0',
                borderBottom: `1px solid ${C.hairSoft}`,
              }}
            >
              <span style={{ width: 150, fontFamily: MONO, fontSize: 16, color: C.ink, letterSpacing: '0.02em' }}>
                {f.name}
              </span>
              <span style={{ width: 240, fontFamily: SANS, fontSize: 15, color: C.dim }}>{f.make}</span>
              <span style={{ flex: 1, fontFamily: SANS, fontSize: 15, color: C.dim }}>{f.feat}</span>
              <span style={{ width: 250, fontFamily: SANS, fontSize: 15, color: C.faint }}>{f.use}</span>
            </div>
          </Rise>
        ))}
      </div>
    </div>
  </Scene>
);

/* ───────────────────────── 06 · 收束 ───────────────────────── */

const S5: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1192} to={1292}>
    <Rise frame={frame} at={1198}>
      <Tag tone="dim">收束</Tag>
      <Title size={54} style={{ marginTop: 20 }}>
        五层叠在一起，就是一块双面板。
      </Title>
    </Rise>
    <Rise frame={frame} at={1222} style={{ marginTop: 28 }}>
      <Body size={22} style={{ maxWidth: 1180 }}>
        板厚、铜厚、孔径、开窗——这些数字先定下来，后面所有工艺窗口都围着它们转。
      </Body>
    </Rise>
    <Rise frame={frame} at={1244} style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Marker tone={C.blue}>02</Marker>
        <span style={{ fontFamily: SANS, fontSize: 20, color: C.ink }}>
          下一段：从覆铜板到成品——九步主干、十四步真相，与四道命门。
        </span>
      </div>
    </Rise>
  </Scene>
);

/* ───────────────────────── 合成 ───────────────────────── */

export const SfStructure: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Chrome
        frame={frame}
        duration={A_DURATION}
        brand="PCB · STRUCTURE"
        sub="结构与制作工艺"
        code="SF · 01 / 03"
        chapters={[...CHAPTERS]}
      />
      <S0 frame={frame} />
      <S1 frame={frame} />
      <S2 frame={frame} />
      <S3 frame={frame} />
      <S4 frame={frame} />
      <S5 frame={frame} />
    </AbsoluteFill>
  );
};
