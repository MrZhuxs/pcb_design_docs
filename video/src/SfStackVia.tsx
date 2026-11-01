import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Chrome } from './fab/Chrome';
import { Body, Callout, Marker, Panel, Rise, Scene, Tag, Title } from './fab/prims';
import { C, F, FE, MONO, SANS, easeOut } from './fab/theme';

/* ──────────────────────────── 时间轴 ──────────────────────────── */

export const C_DURATION = 1400;

const CHAPTERS = [
  { no: '01', label: '四层叠层', from: 0 },
  { no: '02', label: '四铁律', from: 520 },
  { no: '03', label: '排法判定', from: 760 },
  { no: '04', label: '通 / 盲 / 埋', from: 900 },
  { no: '05', label: '特殊孔', from: 1100 },
  { no: '06', label: '层数成本', from: 1240 },
] as const;

type Kind = 'SIG' | 'GND' | 'PWR';
const KC: Record<Kind, string> = { SIG: C.blue, GND: C.green, PWR: C.amber };

/* ──────────────────────── 00 · 开场 ──────────────────────── */

const S0: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={0} to={124}>
    <Rise frame={frame} at={2}>
      <Tag tone="dim">FIG · 03 · 叠层与孔</Tag>
    </Rise>
    <Rise frame={frame} at={8}>
      <Title style={{ marginTop: 18 }}>
        层数一加，游戏就变了
      </Title>
    </Rise>
    <Rise frame={frame} at={16}>
      <Body style={{ marginTop: 18, maxWidth: 1140 }}>
        四层板不是「四张板叠起来」，而是两块双面板夹着绝缘基材压成一块。
        层数带来的最大好处不是「多两条线」，而是<span style={{ color: C.ink }}>多一个完整的参考平面</span>。
      </Body>
    </Rise>
    <Rise frame={frame} at={40} style={{ marginTop: 46 }}>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          看下去：
        </span>
        {['四层叠层', '四条铁律', '三种孔', '层数与成本'].map((x, i) => (
          <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Marker tone={C.blue} size={22}>
              {i + 1}
            </Marker>
            <span style={{ fontFamily: SANS, fontSize: 17, color: C.dim }}>{x}</span>
          </div>
        ))}
      </div>
    </Rise>
  </Scene>
);

/* ───────────────────── 01 · 四层叠层（爆炸） ───────────────────── */

const SLABS = [
  { h: 18, fill: C.cu, l1: 'L1 · SIG', l2: '信号层（外层铜箔）', tone: KC.SIG },
  { h: 26, fill: 'rgba(192,138,62,0.16)', l1: 'PP', l2: '半固化片：胶水 + 介质', tone: C.faint },
  { h: 92, fill: C.fr4, l1: 'CORE', l2: '芯板：L2 / L3 就在它两面', tone: C.dim },
  { h: 26, fill: 'rgba(192,138,62,0.16)', l1: 'PP', l2: '半固化片：胶水 + 介质', tone: C.faint },
  { h: 18, fill: C.cu, l1: 'L4 · SIG', l2: '信号层（外层铜箔）', tone: KC.SIG },
];

const StackFig: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const e = FE(frame, at + 8, at + 60, 0, 1);
  const gap = 12 + 16 * e;
  const total = SLABS.reduce((s, x) => s + x.h, 0) + gap * (SLABS.length - 1);
  let y = 300 - total / 2;
  const tops: number[] = [];
  SLABS.forEach((s) => {
    tops.push(y);
    y += s.h + gap;
  });
  const coreTop = tops[2];
  return (
    <svg width={900} height={600} viewBox="0 0 900 600">
      <defs>
        <pattern id="c-fr4" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
        </pattern>
        <pattern id="c-cu" width="5.5" height="5.5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
        </pattern>
      </defs>

      {SLABS.map((s, i) => {
        const t = easeOut(F(frame, at + i * 7, at + i * 7 + 14));
        const top = tops[i];
        return (
          <g key={`${s.l1}${i}`} opacity={t} transform={`translate(${(1 - t) * -16} 0)`}>
            <rect x={70} y={top} width={400} height={s.h} fill={s.fill} />
            {i === 2 && <rect x={70} y={top} width={400} height={s.h} fill="url(#c-fr4)" />}
            {i !== 2 && i % 2 === 0 && (
              <rect x={70} y={top} width={400} height={s.h} fill="url(#c-cu)" opacity={0.5} />
            )}
            <rect x={70} y={top} width={400} height={s.h} fill="none" stroke="rgba(255,255,255,0.16)" />
            <line x1={54} y1={top + s.h / 2} x2={70} y2={top + s.h / 2} stroke={s.tone} strokeWidth={1} />
            <text
              x={46}
              y={top + s.h / 2}
              fontFamily={MONO}
              fontSize={12}
              fill={s.tone}
              textAnchor="end"
              dominantBaseline="middle"
              letterSpacing="0.04em"
            >
              {s.l1}
            </text>
            {i !== 2 && (
              <text
                x={492}
                y={top + s.h / 2}
                fontFamily={SANS}
                fontSize={13}
                fill={C.faint}
                dominantBaseline="middle"
              >
                {s.l2}
              </text>
            )}
          </g>
        );
      })}

      {/* CORE 内部：L2 / L3 铜面 */}
      <g opacity={easeOut(F(frame, at + 26, at + 46))}>
        <rect x={70} y={coreTop} width={400} height={18} fill={C.green} opacity={0.9} />
        <rect x={70} y={coreTop + 74} width={400} height={18} fill={C.amber} opacity={0.9} />
        <text x={486} y={coreTop + 9} fontFamily={MONO} fontSize={13} fill={C.green} dominantBaseline="middle">
          L2 · GND 完整地平面
        </text>
        <text x={486} y={coreTop + 83} fontFamily={MONO} fontSize={13} fill={C.amber} dominantBaseline="middle">
          L3 · PWR 电源平面
        </text>
        <text x={486} y={coreTop + 46} fontFamily={SANS} fontSize={12} fill={C.faint} dominantBaseline="middle">
          CORE 介质
        </text>
        {/* 平板电容场线 */}
        <g opacity={easeOut(F(frame, at + 60, at + 84))}>
          {[100, 170, 240, 310, 380, 440].map((x) => (
            <line
              key={`f${x}`}
              x1={x}
              y1={coreTop + 20}
              x2={x}
              y2={coreTop + 72}
              stroke={C.blueLine}
              strokeWidth={1}
              strokeDasharray="3 5"
            />
          ))}
          <text x={270} y={coreTop + 46} fontFamily={MONO} fontSize={11} fill={C.blue} textAnchor="middle" letterSpacing="0.1em">
            PLANE CAP
          </text>
        </g>
      </g>

      <text x={70} y={556} fontFamily={SANS} fontSize={13} fill={C.faint}>
        从下往上：铜箔 + PP + 芯板（两面有铜）+ PP + 铜箔 —— 两块双面板夹绝缘基材
      </text>
    </svg>
  );
};

const S1: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={124} to={522}>
    <Rise frame={frame} at={128}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Tag tone="dim">经典四层 · SIG / GND / PWR / SIG</Tag>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          L2 是参考面，L2 + L3 是平板电容
        </span>
      </div>
    </Rise>

    <div style={{ display: 'flex', gap: 30 }}>
      <StackFig frame={frame} at={150} />

      <div style={{ flex: 1, paddingTop: 40 }}>
        <Rise frame={frame} at={210}>
          <Panel accent={C.green} style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: SANS, fontSize: 19, color: C.ink }}>L2 完整地平面 = 两件事</div>
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 10, lineHeight: 1.6 }}>
              <b style={{ color: C.ink }}>参考面</b>：相邻信号层的回流电流就近走，回路面积最小；
              <br />
              <b style={{ color: C.ink }}>屏蔽层</b>：把两侧信号层隔开，辐射与串扰一起降。
            </div>
          </Panel>
        </Rise>

        <Rise frame={frame} at={252} style={{ marginTop: 14 }}>
          <Panel accent={C.amber} style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: SANS, fontSize: 19, color: C.ink }}>L2 + L3 紧耦合 = 天然平板电容</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 15, color: C.blue, letterSpacing: '0.04em' }}>
                C = ε · A / d
              </span>
              <span style={{ fontFamily: SANS, fontSize: 14, color: C.dim, lineHeight: 1.5 }}>
                介质越薄，d 越小，电源平面之间的电容越大 → 电源阻抗越低
              </span>
            </div>
          </Panel>
        </Rise>

        <Rise frame={frame} at={300} style={{ marginTop: 20 }}>
          <Callout tone="idea" size={17}>
            层数增加的最大好处，是<span style={{ color: C.ink }}>多一个完整参考平面</span>
            ——不是多布几条线。
          </Callout>
        </Rise>
      </div>
    </div>
  </Scene>
);

/* ───────────────────── 02 · 四铁律 ───────────────────── */

const LAWS = [
  {
    k: '对称',
    d: '以板厚中间为轴：介质厚度、铜厚、层数都对称。',
    bad: '压合应力不平衡 → 板翘，贴片时贴不平',
  },
  {
    k: '每层信号紧邻完整参考面',
    d: '参考面只能是 GND 或 PWR，而且必须完整——不能被大片挖空。',
    bad: '回流路径被切断 → 阻抗突变、辐射变大',
  },
  {
    k: '电源与地层成对且靠近',
    d: '两层之间介质尽量薄，形成足够大的平板电容。',
    bad: '平板电容小 → 电源阻抗高、SSN 加剧',
  },
  {
    k: '避免两个信号层直接相邻',
    d: '中间没有参考面时，两者的电场直接耦合。',
    bad: '层间串扰显著增大',
  },
];

const S2: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={522} to={762}>
    <Rise frame={frame} at={526}>
      <Tag tone="amber">叠层四条铁律</Tag>
      <Title size={38} style={{ marginTop: 12 }}>
        顺序不是审美，是电磁
      </Title>
    </Rise>
    <div style={{ marginTop: 26 }}>
      {LAWS.map((l, i) => (
        <Rise key={l.k} frame={frame} at={542 + i * 12}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '17px 0',
              borderBottom: `1px solid ${C.hairSoft}`,
            }}
          >
            <Marker tone={C.blue} size={30}>
              {i + 1}
            </Marker>
            <div style={{ width: 330 }}>
              <div style={{ fontFamily: SANS, fontSize: 21, color: C.ink }}>{l.k}</div>
            </div>
            <div style={{ flex: 1, fontFamily: SANS, fontSize: 15.5, color: C.dim, lineHeight: 1.55 }}>
              {l.d}
            </div>
            <div
              style={{
                width: 400,
                paddingLeft: 14,
                borderLeft: `2px solid ${C.amber}`,
                fontFamily: SANS,
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.5,
              }}
            >
              违反 → {l.bad}
            </div>
          </div>
        </Rise>
      ))}
    </div>
  </Scene>
);

/* ───────────────────── 03 · 排法判定 ───────────────────── */

const MiniStack: React.FC<{
  layers: Kind[];
  verdict: 'ok' | 'bad';
  title: string;
  reason: string;
  frame: number;
  at: number;
}> = ({ layers, verdict, title, reason, frame, at }) => {
  const t = easeOut(F(frame, at, at + 16));
  return (
    <Rise frame={frame} at={at} style={{ flex: 1 }}>
      <Panel style={{ padding: '18px 20px', height: 320, opacity: t }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              color: verdict === 'ok' ? C.green : C.red,
            }}
          >
            {verdict === 'ok' ? '✓' : '✕'}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 13, color: C.dim, letterSpacing: '0.06em' }}>
            {title}
          </span>
        </div>
        <div style={{ marginTop: 14 }}>
          {layers.map((k, i) => (
            <div key={`${k}${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <span style={{ width: 22, fontFamily: MONO, fontSize: 10, color: C.ghost }}>
                L{i + 1}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 20,
                  background: `linear-gradient(to right, ${KC[k]}44, ${KC[k]}14)`,
                  borderLeft: `2px solid ${KC[k]}`,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: 11, color: KC[k], letterSpacing: '0.1em' }}>
                  {k}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: SANS,
            fontSize: 13.5,
            color: verdict === 'ok' ? C.dim : C.ink,
            lineHeight: 1.55,
          }}
        >
          {reason}
        </div>
      </Panel>
    </Rise>
  );
};

const S3: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={762} to={902}>
    <Rise frame={frame} at={766}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Tag tone="dim">判定 · 拿四条铁律过一遍</Tag>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          SIG 信号 · GND 地 · PWR 电源
        </span>
      </div>
    </Rise>
    <div style={{ display: 'flex', gap: 18, marginTop: 24 }}>
      <MiniStack
        frame={frame}
        at={782}
        layers={['SIG', 'GND', 'PWR', 'SIG']}
        verdict="ok"
        title="四层 · 经典"
        reason="L2 参考面完整，L2/L3 成对 → 四条铁律全过。"
      />
      <MiniStack
        frame={frame}
        at={800}
        layers={['SIG', 'SIG', 'GND', 'PWR']}
        verdict="bad"
        title="四层 · 常见错误的省事排法"
        reason="L1 与 L2 两个信号层直接相邻，且 L1 没有相邻参考面 → 串扰与回流双输。"
      />
      <MiniStack
        frame={frame}
        at={818}
        layers={['SIG', 'GND', 'SIG', 'PWR', 'GND', 'SIG']}
        verdict="ok"
        title="六层 · 每个信号层都有参考面"
        reason="L3 夹在 GND / PWR 之间，L4/L5 成对；六层里最稳的一种。"
      />
    </div>
  </Scene>
);

/* ───────────────────── 04 · 通 / 盲 / 埋 ───────────────────── */

type ViaKind = 'through' | 'blind' | 'buried';

const ViaFig: React.FC<{ kind: ViaKind; frame: number; at: number }> = ({ kind, frame, at }) => {
  const t = easeOut(F(frame, at + 8, at + 34));
  const CU = [70, 130, 190, 250];
  const Y0 = 96;
  const X = 190;
  const W = 22;

  // 孔的两端（以 L1 顶为 0 基准）
  const span: Record<ViaKind, [number, number]> = {
    through: [CU[0], CU[3] + 12],
    blind: [CU[0], CU[1] + 12],
    buried: [CU[1], CU[2] + 12],
  };
  const [ya, yb] = span[kind];

  return (
    <svg width={400} height={330} viewBox="0 0 400 330">
      <defs>
        <pattern id="c-fr43" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
        </pattern>
      </defs>
      <rect x={60} y={CU[0] + 12} width={290} height={CU[3] - CU[0] - 12} fill={C.fr4} />
      <rect x={60} y={CU[0] + 12} width={290} height={CU[3] - CU[0] - 12} fill="url(#c-fr43)" />
      {CU.map((y, i) => (
        <g key={`cu${y}`}>
          <rect x={60} y={y} width={290} height={12} fill={C.cu} opacity={0.92} />
          <text x={366} y={y + 6} fontFamily={MONO} fontSize={10} fill={C.faint} dominantBaseline="middle">
            L{i + 1}
          </text>
        </g>
      ))}

      <g opacity={t}>
        <rect x={X - W} y={ya} width={W * 2} height={yb - ya} fill={C.hole} stroke="rgba(255,255,255,0.14)" />
        <rect x={X - W} y={ya} width={4} height={yb - ya} fill={C.cu} />
        <rect x={X + W - 4} y={ya} width={4} height={yb - ya} fill={C.cu} />
        {kind !== 'through' && (
          <>
            <line x1={X - W - 60} y1={ya + (yb - ya) / 2} x2={X - W - 8} y2={ya + (yb - ya) / 2} stroke={C.blue} strokeWidth={1} strokeDasharray="3 4" />
            <line x1={X + W + 8} y1={ya + (yb - ya) / 2} x2={X + W + 60} y2={ya + (yb - ya) / 2} stroke={C.blue} strokeWidth={1} strokeDasharray="3 4" />
          </>
        )}
      </g>
    </svg>
  );
};

const VIAS = [
  {
    kind: 'through' as const,
    t: '通孔 Through',
    d: '贯穿所有层。压合完成后一次钻通、一次电镀。',
    cost: '成本最低',
    when: '绝大多数常规孔、插件与过孔',
    tone: C.green,
  },
  {
    kind: 'blind' as const,
    t: '盲孔 Blind',
    d: '从表层钻到某个内层，不贯穿。必须在对应压合阶段之前钻好、电镀好。',
    cost: '成本较高',
    when: 'BGA 扇出、HDI 的高密度区域',
    tone: C.amber,
  },
  {
    kind: 'buried' as const,
    t: '埋孔 Buried',
    d: '只在内层之间，与表层不相连。压合前完成钻孔与电镀，外面完全看不见。',
    cost: '成本最高',
    when: '高层数板的密集互连',
    tone: C.red,
  },
];

const S4: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={902} to={1102}>
    <Rise frame={frame} at={906}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Tag tone="dim">三种孔 · 差异只在「钻在什么时候」</Tag>
      </div>
      <Title size={36} style={{ marginTop: 12 }}>
        通孔、盲孔、埋孔
      </Title>
    </Rise>

    <div style={{ display: 'flex', gap: 18, marginTop: 20 }}>
      {VIAS.map((v, i) => (
        <Rise key={v.t} frame={frame} at={922 + i * 14} style={{ flex: 1 }}>
          <Panel accent={v.tone} style={{ padding: '16px 18px', height: 470 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: SANS, fontSize: 21, color: C.ink }}>{v.t}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: v.tone, marginLeft: 'auto', letterSpacing: '0.08em' }}>
                {v.cost}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 10px' }}>
              <ViaFig kind={v.kind} frame={frame} at={930 + i * 14} />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.6 }}>{v.d}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.faint, marginTop: 10 }}>{v.when}</div>
          </Panel>
        </Rise>
      ))}
    </div>
  </Scene>
);

/* ───────────────────── 05 · 特殊孔 ───────────────────── */

const SPECIAL = [
  {
    t: '微孔 Microvia',
    m: '≤ 0.15 mm · 激光钻',
    d: '机械钻头钻不了这么细，只能用激光。微孔是 HDI（高密度互连）的入场券，代价是层压次数成倍增加。',
  },
  {
    t: '盘中孔 Via in Pad',
    m: '必须填孔电镀',
    d: '孔直接开在焊盘上，省掉扇出走线。但不填孔就是一根空心管子：回流时焊料被吸进孔里，焊点虚了。',
  },
  {
    t: '背钻 Back Drill',
    m: '去掉残桩 stub',
    d: '通孔没用到的下半段是一截「残桩」，高速信号会在上面反射。背钻就是把这截多余铜壁再钻掉。',
  },
  {
    t: '孔环与纵横比',
    m: '环 = (焊盘外径 − 孔径) / 2',
    d: '孔环太小会破环、孔壁与焊盘分离；纵横比 = 板厚 ÷ 孔径，通常不超过 8:1，太深就镀不透。',
  },
];

const S5: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1102} to={1242}>
    <Rise frame={frame} at={1106}>
      <Tag tone="dim">四个常见的「特殊孔」</Tag>
      <Title size={34} style={{ marginTop: 12 }}>
        孔不只是「打通两层」
      </Title>
    </Rise>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
      {SPECIAL.map((s, i) => (
        <Rise key={s.t} frame={frame} at={1122 + i * 12}>
          <Panel style={{ padding: '18px 20px', height: 186 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: SANS, fontSize: 20, color: C.ink }}>{s.t}</span>
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: C.blue, letterSpacing: '0.04em' }}>
                {s.m}
              </span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, marginTop: 12, lineHeight: 1.62 }}>
              {s.d}
            </div>
          </Panel>
        </Rise>
      ))}
    </div>
  </Scene>
);

/* ───────────────────── 06 · 层数成本 + 收束 ───────────────────── */

const COST = [
  { n: '2 层', s: 'SIG / SIG', x: 0.28, note: '最低' },
  { n: '4 层', s: 'SIG / GND / PWR / SIG', x: 0.5, note: '约 1.5–2 倍双层' },
  { n: '6 层', s: 'DDR / 千兆 / 射频', x: 0.72, note: '明显上升' },
  { n: '8 层以上', s: '服务器 / 交换机', x: 0.94, note: '大幅上升' },
];

const S6: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1242} to={1402}>
    <Rise frame={frame} at={1246}>
      <Tag tone="amber">成本</Tag>
      <Title size={36} style={{ marginTop: 12 }}>
        层数是最贵的一种「解决办法」
      </Title>
    </Rise>

    <div style={{ marginTop: 30 }}>
      {COST.map((c, i) => (
        <Rise key={c.n} frame={frame} at={1262 + i * 10}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
            <span style={{ width: 96, fontFamily: SANS, fontSize: 18, color: C.ink }}>{c.n}</span>
            <div style={{ flex: 1, height: 22, background: C.hairSoft, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 22,
                  width: `${c.x * 100 * easeOut(F(frame, 1270 + i * 10, 1300 + i * 10))}%`,
                  background:
                    i === 0
                      ? 'rgba(62,207,142,0.5)'
                      : i === 1
                        ? 'rgba(0,112,243,0.5)'
                        : i === 2
                          ? 'rgba(245,166,35,0.45)'
                          : 'rgba(255,92,92,0.45)',
                }}
              />
            </div>
            <span style={{ width: 250, fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.04em' }}>
              {c.s}
            </span>
            <span style={{ width: 150, fontFamily: SANS, fontSize: 14, color: C.dim }}>{c.note}</span>
          </div>
        </Rise>
      ))}
    </div>

    <Rise frame={frame} at={1320} style={{ marginTop: 10 }}>
      <Callout tone="idea" size={19}>
        <span style={{ color: C.ink }}>别用层数解决布线焦虑</span>
        ：先问有没有完整参考平面、能不能压缩介质厚度、能不能把电源与地层成对。
      </Callout>
    </Rise>
  </Scene>
);

/* ───────────────────────── 合成 ───────────────────────── */

export const SfStackVia: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Chrome
        frame={frame}
        duration={C_DURATION}
        brand="PCB · STACK & VIA"
        sub="层与孔"
        code="SF · 03 / 03"
        chapters={[...CHAPTERS]}
      />
      <S0 frame={frame} />
      <S1 frame={frame} />
      <S2 frame={frame} />
      <S3 frame={frame} />
      <S4 frame={frame} />
      <S5 frame={frame} />
      <S6 frame={frame} />
    </AbsoluteFill>
  );
};
