import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Chrome } from './fab/Chrome';
import { Body, Callout, Hair, Marker, Panel, Rise, Scene, Tag, Title } from './fab/prims';
import { C, F, FE, MONO, SANS, easeOut } from './fab/theme';

/* ──────────────────────────── 时间轴 ──────────────────────────── */

export const B_DURATION = 1620;

const CHAPTERS = [
  { no: '01', label: '主干九步', from: 0 },
  { no: '02', label: '三分法', from: 600 },
  { no: '03', label: '十四步', from: 740 },
  { no: '04', label: '孔金属化', from: 980 },
  { no: '05', label: '四命门', from: 1140 },
  { no: '06', label: '侧蚀', from: 1320 },
  { no: '07', label: '表面处理', from: 1470 },
] as const;

/** 工艺分类色 */
const G = {
  prep: C.ghost,
  add: C.blue,
  sub: C.amber,
  cover: C.green,
} as const;

/* ──────────────────────── 00 · 开场 ──────────────────────── */

const S0: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={0} to={124}>
    <Rise frame={frame} at={2}>
      <Tag tone="dim">FIG · 02 · 制造</Tag>
    </Rise>
    <Rise frame={frame} at={8}>
      <Title style={{ marginTop: 18 }}>从覆铜板到成品</Title>
    </Rise>
    <Rise frame={frame} at={16}>
      <Body style={{ marginTop: 18, maxWidth: 1120 }}>
        一张覆铜板上本来铺满整面铜。要把「整面铜」变成「线路 + 孔 + 焊盘」，
        靠的是九步主干——以及被大部分教程略过的十四步真相。
      </Body>
    </Rise>
    <Rise frame={frame} at={34}>
      <div style={{ display: 'flex', gap: 12, marginTop: 44 }}>
        {[
          { t: '加法', d: '钻孔 + 金属化', c: G.add },
          { t: '减法', d: '图形转移 + 蚀刻', c: G.sub },
          { t: '选择性覆盖', d: '阻焊 / 丝印 / 表面处理', c: G.cover },
        ].map((x) => (
          <Panel key={x.t} accent={x.c} style={{ padding: '16px 20px', minWidth: 300 }}>
            <div style={{ fontFamily: SANS, fontSize: 22, color: C.ink }}>{x.t}</div>
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.dim, marginTop: 6, letterSpacing: '0.04em' }}>
              {x.d}
            </div>
          </Panel>
        ))}
      </div>
    </Rise>
  </Scene>
);

/* ──────────────────────── 01 · 九步主干 ──────────────────────── */

type Step = { no: string; name: string; goal: string; ctrl: string; g: keyof typeof G };

const STEPS: Step[] = [
  { no: '01', name: '设计', goal: '出图：原理图 / 版图 / BOM', ctrl: '网表一致 · DRC / DFM', g: 'prep' },
  { no: '02', name: '开料', goal: '把大料裁成拼板尺寸', ctrl: '板材 / 板厚 / 铜厚 · 烤板去应力', g: 'prep' },
  { no: '03', name: '钻孔', goal: '钻出所有孔位', ctrl: '孔径 · 孔位精度 · 孔壁粗糙度', g: 'add' },
  { no: '04', name: '金属化孔', goal: '让孔壁导电', ctrl: '孔铜厚度 · 背光等级', g: 'add' },
  { no: '05', name: '图形转移', goal: '把线路「印」到板上（抗蚀层）', ctrl: '对位精度 · 曝光能量', g: 'sub' },
  { no: '06', name: '蚀刻', goal: '去掉没有被保护的铜', ctrl: '侧蚀 · 线宽均匀性 · 药水浓度', g: 'sub' },
  { no: '07', name: '阻焊', goal: '盖住不该沾锡的地方', ctrl: '开窗偏移 · 油墨厚度 · 固化度', g: 'cover' },
  { no: '08', name: '丝印', goal: '打上位号与外框', ctrl: '不许压焊盘 · 字符清晰度', g: 'cover' },
  { no: '09', name: '表面处理', goal: '让焊盘能焊、能存', ctrl: 'HASL / 沉金 / OSP 的选择与厚度', g: 'cover' },
];

const S1: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={124} to={602}>
    <Rise frame={frame} at={128}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Tag tone="dim">主干 · 9 STEPS</Tag>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          每一步都写「目的」与「关键控制点」——控制点就是它的失效模式
        </span>
      </div>
      <Title size={38} style={{ marginTop: 12 }}>
        九步主干
      </Title>
    </Rise>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 14,
        marginTop: 26,
      }}
    >
      {STEPS.map((s, i) => (
        <Rise key={s.no} frame={frame} at={150 + i * 7}>
          <Panel style={{ padding: '16px 18px', height: 186, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: G[s.g], letterSpacing: '0.08em' }}>
                {s.no}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 21, color: C.ink }}>{s.name}</span>
              <span
                style={{
                  marginLeft: 'auto',
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: G[s.g],
                }}
              />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 12, lineHeight: 1.5 }}>
              {s.goal}
            </div>
            <div
              style={{
                position: 'absolute',
                left: 18,
                right: 18,
                bottom: 16,
                paddingTop: 10,
                borderTop: `1px solid ${C.hairSoft}`,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: '0.04em',
                color: C.faint,
                lineHeight: 1.5,
              }}
            >
              {s.ctrl}
            </div>
          </Panel>
        </Rise>
      ))}
    </div>

    <Rise frame={frame} at={500} style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
        {[
          { l: '准备', c: G.prep },
          { l: '加法', c: G.add },
          { l: '减法', c: G.sub },
          { l: '选择性覆盖', c: G.cover },
        ].map((x) => (
          <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 2, background: x.c }} />
            <span style={{ fontFamily: SANS, fontSize: 14, color: C.dim }}>{x.l}</span>
          </div>
        ))}
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.06em' }}>
          九步的颜色 = 三种本质
        </span>
      </div>
    </Rise>
  </Scene>
);

/* ──────────────────────── 02 · 三分法 ──────────────────────── */

const KINDS = [
  {
    t: '加法',
    c: G.add,
    steps: '03 钻孔 · 04 金属化孔',
    body: '往板上「加」东西：先钻出孔，再把铜镀进孔壁，让上下两面的铜连起来。',
    sub: '孔铜厚度决定它会不会在回流时被拉断',
  },
  {
    t: '减法',
    c: G.sub,
    steps: '05 图形转移 · 06 蚀刻',
    body: '减成法：用抗蚀层保护住要留的铜，其余整片蚀掉——线路是「剩下的部分」。',
    sub: '侧蚀决定线宽，线宽决定阻抗与载流',
  },
  {
    t: '选择性覆盖',
    c: G.cover,
    steps: '07 阻焊 · 08 丝印 · 09 表面处理',
    body: '只在需要的地方覆盖、镀覆：阻焊挡住焊料，丝印打上标记，表面处理保护焊盘。',
    sub: '这三步决定「好不好焊、存不存得住」',
  },
];

const S2: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={602} to={742}>
    <Rise frame={frame} at={606}>
      <Tag tone="dim">本质 · 只有三件事</Tag>
      <Title size={36} style={{ marginTop: 12 }}>
        九步不是九件独立的事
      </Title>
    </Rise>
    <div style={{ display: 'flex', gap: 20, marginTop: 34 }}>
      {KINDS.map((k, i) => (
        <Rise key={k.t} frame={frame} at={622 + i * 12} style={{ flex: 1 }}>
          <Panel accent={k.c} style={{ padding: '22px 24px', height: 300 }}>
            <div style={{ fontFamily: SANS, fontSize: 30, color: C.ink, letterSpacing: '-0.01em' }}>
              {k.t}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: k.c, marginTop: 8, letterSpacing: '0.06em' }}>
              {k.steps}
            </div>
            <Hair style={{ margin: '16px 0' }} />
            <div style={{ fontFamily: SANS, fontSize: 17, color: C.dim, lineHeight: 1.62 }}>{k.body}</div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.faint, marginTop: 14 }}>{k.sub}</div>
          </Panel>
        </Rise>
      ))}
    </div>
    <Rise frame={frame} at={700} style={{ marginTop: 22 }}>
      <Callout tone="idea" size={17}>
        <span style={{ color: C.ink }}>01 设计与 02 开料只是准备</span>
        ：它们不改变铜的形状，但把后面七步的窗口全部定死——板厚、铜厚、孔径在这一步就写进订单了。
      </Callout>
    </Rise>
  </Scene>
);

/* ──────────────────── 03 · 十四步真相 + Core / PP ──────────────────── */

const RAIL: { no: string; name: string }[] = [
  { no: '01', name: '内层曝光显影' },
  { no: '02', name: '内层蚀刻' },
  { no: '03', name: 'AOI 检查' },
  { no: '04', name: '棕化' },
  { no: '05', name: '层压压合' },
  { no: '06', name: '钻孔' },
  { no: '07', name: '除胶渣' },
  { no: '08', name: '活化' },
  { no: '09', name: '沉铜 + 电镀' },
  { no: '10', name: '外层图形' },
  { no: '11', name: '外层蚀刻' },
  { no: '12', name: '阻焊 / 丝印 / 表处' },
  { no: '13', name: '成型' },
  { no: '14', name: '电测' },
];

const GROUPS: { from: number; to: number; label: string }[] = [
  { from: 0, to: 1, label: '内层图形' },
  { from: 2, to: 3, label: '检查 / 前处理' },
  { from: 4, to: 4, label: '压合' },
  { from: 5, to: 8, label: '钻孔镀孔' },
  { from: 9, to: 10, label: '外层图形' },
  { from: 11, to: 13, label: '后段' },
];

const Rail: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const X0 = 40;
  const X1 = 1600;
  const dx = (X1 - X0) / (RAIL.length - 1);
  const axisY = 96;
  return (
    <svg width={1660} height={252} viewBox="0 0 1660 252">
      <line x1={X0} y1={axisY} x2={X1} y2={axisY} stroke={C.hair} strokeWidth={1} />
      {RAIL.map((r, i) => {
        const x = X0 + i * dx;
        const up = i % 2 === 0;
        const t = easeOut(F(frame, at + i * 4, at + i * 4 + 12));
        const gate = i === 2 || i === 3 || i === 6 || i === 7 || i === 8 || i === 1;
        const tone = gate ? C.blue : C.faint;
        return (
          <g key={r.no} opacity={t}>
            <line
              x1={x}
              y1={axisY - 7}
              x2={x}
              y2={axisY + 7}
              stroke={tone}
              strokeWidth={gate ? 1.6 : 1}
            />
            <circle cx={x} cy={axisY} r={gate ? 3 : 2} fill={gate ? C.blue : C.faint} />
            <text
              x={x}
              y={up ? axisY - 26 : axisY + 34}
              fontFamily={MONO}
              fontSize={11}
              fill={C.ghost}
              textAnchor="middle"
              letterSpacing="0.1em"
            >
              {r.no}
            </text>
            <text
              x={x}
              y={up ? axisY - 46 : axisY + 54}
              fontFamily={SANS}
              fontSize={13}
              fill={gate ? C.ink : C.dim}
              textAnchor="middle"
            >
              {r.name}
            </text>
          </g>
        );
      })}
      {GROUPS.map((g, i) => {
        const xa = X0 + g.from * dx;
        const xb = X0 + g.to * dx;
        const t = easeOut(F(frame, at + 60 + i * 5, at + 60 + i * 5 + 12));
        return (
          <g key={g.label} opacity={t * 0.95}>
            <path
              d={`M${xa} 168 L${xa} 176 L${xb} 176 L${xb} 168`}
              fill="none"
              stroke={C.hair}
              strokeWidth={1}
            />
            <text
              x={(xa + xb) / 2}
              y={198}
              fontFamily={SANS}
              fontSize={13}
              fill={C.faint}
              textAnchor="middle"
              letterSpacing="0.02em"
            >
              {g.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const StackMini: React.FC<{ frame: number; at: number }> = ({ frame, at }) => {
  const rows = [
    { h: 16, fill: C.cu, label: '铜箔 · L1' },
    { h: 20, fill: 'rgba(192,138,62,0.18)', label: 'PP 半固化片' },
    { h: 56, fill: C.fr4, label: 'CORE 芯板（两面有铜 → L2 / L3）' },
    { h: 20, fill: 'rgba(192,138,62,0.18)', label: 'PP 半固化片' },
    { h: 16, fill: C.cu, label: '铜箔 · L4' },
  ];
  let y = 12;
  return (
    <svg width={520} height={176} viewBox="0 0 520 176">
      <defs>
        <pattern id="b-fr4" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
        </pattern>
      </defs>
      {rows.map((r, i) => {
        const t = easeOut(F(frame, at + i * 6, at + i * 6 + 12));
        const top = y;
        y += r.h + 6;
        return (
          <g key={r.label} opacity={t} transform={`translate(${(1 - t) * 12} 0)`}>
            <rect x={10} y={top} width={300} height={r.h} fill={r.fill} />
            {i === 2 && <rect x={10} y={top} width={300} height={r.h} fill="url(#b-fr4)" />}
            <rect x={10} y={top} width={300} height={r.h} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
            <text
              x={326}
              y={top + r.h / 2}
              fontFamily={MONO}
              fontSize={11}
              fill={C.dim}
              dominantBaseline="middle"
              letterSpacing="0.02em"
            >
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const S3: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={742} to={982}>
    <Rise frame={frame} at={746}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <Tag tone="amber">真相 · 14 STEPS</Tag>
        <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.14em' }}>
          双面板没有压合；从四层板开始，内层先做完再压在一起
        </span>
      </div>
    </Rise>
    <div style={{ marginTop: 6 }}>
      <Rail frame={frame} at={760} />
    </div>

    <div style={{ display: 'flex', gap: 36, marginTop: -6 }}>
      <div style={{ width: 640 }}>
        <Rise frame={frame} at={820}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Panel style={{ padding: '16px 18px' }}>
              <div style={{ fontFamily: SANS, fontSize: 19, color: C.ink }}>
                CORE 芯板<span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, marginLeft: 10 }}>C 阶段</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 8, lineHeight: 1.55 }}>
                已<b style={{ color: C.ink }}>完全固化</b>，两面有铜，是整叠板的骨架，承载内层线路。
              </div>
            </Panel>
            <Panel style={{ padding: '16px 18px' }}>
              <div style={{ fontFamily: SANS, fontSize: 19, color: C.ink }}>
                PP 半固化片<span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, marginLeft: 10 }}>B 阶段</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 15, color: C.dim, marginTop: 8, lineHeight: 1.55 }}>
                玻纤布浸环氧、烘到半干即停。<b style={{ color: C.ink }}>无铜</b>——它是胶水，也是介质。
              </div>
            </Panel>
          </div>
        </Rise>
      </div>

      <div style={{ flex: 1 }}>
        <Rise frame={frame} at={840}>
          <div style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.12em' }}>
            四层叠层 · 从下往上：铜箔 + PP + 芯板 + PP + 铜箔
          </div>
          <div style={{ marginTop: 10 }}>
            <StackMini frame={frame} at={850} />
          </div>
        </Rise>
        <Rise frame={frame} at={890} style={{ marginTop: 14 }}>
          <Callout tone="warn" size={16}>
            层压 = 180–200 ℃、200–400 psi 真空热压：PP 熔融流动、填满铜面，再固化把整叠粘成一块。
          </Callout>
        </Rise>
      </div>
    </div>
  </Scene>
);

/* ──────────────────── 04 · 孔金属化三步 ──────────────────── */

const HoleFig: React.FC<{ frame: number; at: number; stage: 0 | 1 | 2 }> = ({ frame, at, stage }) => {
  const grow = stage === 2 ? FE(frame, at + 10, at + 40, 0, 1) : 0;
  return (
    <svg width={330} height={230} viewBox="0 0 330 230">
      <defs>
        <pattern id="b-fr42" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
        </pattern>
      </defs>
      {/* 上下铜面 */}
      <rect x={40} y={22} width={250} height={14} fill={C.cu} />
      <rect x={40} y={196} width={250} height={14} fill={C.cu} />
      {/* 介质 */}
      <rect x={40} y={36} width={250} height={160} fill={C.fr4} />
      <rect x={40} y={36} width={250} height={160} fill="url(#b-fr42)" />
      <rect x={40} y={36} width={250} height={160} fill="none" stroke="rgba(255,255,255,0.14)" />
      {/* 孔 */}
      <rect x={148} y={22} width={34} height={188} fill={C.hole} />
      <rect x={148} y={22} width={34} height={188} fill="none" stroke="rgba(255,255,255,0.12)" />

      {stage === 0 &&
        [
          [148, 60, 34, 12],
          [148, 118, 34, 9],
          [148, 160, 34, 14],
        ].map(([x, y, w, h]) => (
          <rect key={`sm${y}`} x={x} y={y} width={w} height={h} fill="rgba(245,166,35,0.5)" />
        ))}

      {stage === 1 &&
        Array.from({ length: 9 }).map((_, i) => {
          const t = F(frame, at + 2 + i, at + 8 + i);
          return (
            <g key={`pd${i}`} opacity={t}>
              <circle cx={151} cy={44 + i * 21} r={2.6} fill={C.blue} />
              <circle cx={179} cy={44 + i * 21} r={2.6} fill={C.blue} />
            </g>
          );
        })}

      {stage === 2 && (
        <>
          <rect x={148 - 7 * grow} y={22} width={7 * grow} height={188} fill={C.cu} />
          <rect x={182} y={22} width={7 * grow} height={188} fill={C.cu} />
          <rect x={148} y={22} width={34} height={188} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        </>
      )}
      <text x={165} y={218} fontFamily={MONO} fontSize={10} fill={C.ghost} textAnchor="middle" letterSpacing="0.1em">
        SECTION
      </text>
    </svg>
  );
};

const METAL = [
  {
    no: '01',
    t: '除胶渣 Desmear',
    d: '钻孔的高温摩擦会在孔壁留下熔融的树脂「钻污」，用高锰酸钾咬掉它，露出内层铜环。',
    bad: '去不净 → 孔壁与内层铜接不上 → 孔无铜',
    stage: 0 as const,
  },
  {
    no: '02',
    t: '活化',
    d: '把钯（Pd）催化颗粒吸附到孔壁上，给后面的化学沉铜提供「种子」。',
    bad: '活化不足 → 局部镀不上 → 孔壁空洞',
    stage: 1 as const,
  },
  {
    no: '03',
    t: '沉铜 + 电镀',
    d: '化学沉铜先长 0.3–0.5 µm 的薄导电层，再全板电镀加厚到 20–25 µm。',
    bad: '孔铜偏薄 → 回流或热循环时拉断 → 断路',
    stage: 2 as const,
  },
];

const S4: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={982} to={1142}>
    <Rise frame={frame} at={986}>
      <Tag tone="blue">加法 · 最难的一步</Tag>
      <Title size={38} style={{ marginTop: 12 }}>
        孔金属化：把绝缘的孔变成导线
      </Title>
    </Rise>
    <div style={{ display: 'flex', gap: 18, marginTop: 24 }}>
      {METAL.map((m, i) => (
        <Rise key={m.no} frame={frame} at={1000 + i * 14} style={{ flex: 1 }}>
          <Panel style={{ padding: '16px 18px', height: 400 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: C.blue }}>{m.no}</span>
              <span style={{ fontFamily: SANS, fontSize: 20, color: C.ink }}>{m.t}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
              <HoleFig frame={frame} at={1010 + i * 14} stage={m.stage} />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.6 }}>{m.d}</div>
            <div
              style={{
                marginTop: 10,
                fontFamily: SANS,
                fontSize: 13,
                color: C.amber,
                lineHeight: 1.5,
              }}
            >
              {m.bad}
            </div>
          </Panel>
        </Rise>
      ))}
    </div>
  </Scene>
);

/* ──────────────────── 05 · 四命门 ──────────────────── */

const GATES = [
  {
    t: 'AOI',
    where: '03 · 11',
    what: '相机拍板面，与 CAM 数据逐点比对，揪出开路、短路、缺口、残铜、针孔。',
    why: '一块有缺陷的芯板压进去，整板报废——它是压合前唯一的闸门。',
  },
  {
    t: '棕化',
    where: '04 · 05',
    what: '在内层铜面生成粗糙的棕黑色氧化层。目的不是防氧化，而是增大铜与 PP 的接触面积。',
    why: '棕化不良 → 附着力不够 → 压合后分层、起泡。',
  },
  {
    t: '除胶渣 / 活化',
    where: '07 · 08 · 09',
    what: '决定孔壁能不能完整镀上铜：去钻污、种钯、沉铜，三步任一失手都是孔壁空洞。',
    why: '孔无铜是「通着电才发现」的失效，返工等于报废。',
  },
  {
    t: '侧蚀',
    where: '02 · 11',
    what: '蚀刻是各向同性的：向下蚀的同时也向侧面蚀，导线截面变成上窄下宽的梯形。',
    why: '线宽实际变细 → 阻抗偏高、载流不足。',
  },
];

const S5: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1142} to={1322}>
    <Rise frame={frame} at={1146}>
      <Tag tone="red">四道命门</Tag>
      <Title size={38} style={{ marginTop: 12 }}>
        出问题都在看不见的地方
      </Title>
    </Rise>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 26 }}>
      {GATES.map((g, i) => (
        <Rise key={g.t} frame={frame} at={1162 + i * 14}>
          <Panel style={{ padding: '20px 22px', height: 214 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontFamily: SANS, fontSize: 25, color: C.ink }}>{g.t}</span>
              <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.1em' }}>
                STEP {g.where}
              </span>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 15.5, color: C.dim, marginTop: 12, lineHeight: 1.6 }}>
              {g.what}
            </div>
            <div
              style={{
                marginTop: 12,
                paddingLeft: 12,
                borderLeft: `2px solid ${C.amber}`,
                fontFamily: SANS,
                fontSize: 14,
                color: C.ink,
                lineHeight: 1.55,
              }}
            >
              {g.why}
            </div>
          </Panel>
        </Rise>
      ))}
    </div>
    <Rise frame={frame} at={1250} style={{ marginTop: 20 }}>
      <Callout tone="warn" size={17}>
        这四项的共同点：<span style={{ color: C.ink }}>全部要事后切片才能确认</span>
        ——所以板厂的工艺能力（而不是报价）才是真正的分水岭。
      </Callout>
    </Rise>
  </Scene>
);

/* ──────────────────── 06 · 侧蚀 ──────────────────── */

const S6: React.FC<{ frame: number }> = ({ frame }) => {
  const u = FE(frame, 1352, 1410, 0, 1);
  const topX0 = 350;
  const topX1 = 550;
  const botX0 = topX0 - 52 * u;
  const botX1 = topX1 + 52 * u;
  const Y_TOP = 150;
  const Y_BOT = 300;

  return (
    <Scene frame={frame} from={1322} to={1472}>
      <Rise frame={frame} at={1326}>
        <Tag tone="amber">微观 · 减法代价</Tag>
        <Title size={38} style={{ marginTop: 12 }}>
          侧蚀：线路是「被剩下的铜」
        </Title>
      </Rise>

      <div style={{ display: 'flex', gap: 40, marginTop: 16 }}>
        <svg width={940} height={400} viewBox="0 0 940 400">
          <defs>
            <pattern id="b-fr4s" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" stroke={C.fr4Line} strokeWidth={1} />
            </pattern>
          </defs>
          {/* 基材 */}
          <rect x={120} y={Y_BOT} width={700} height={54} fill={C.fr4} />
          <rect x={120} y={Y_BOT} width={700} height={54} fill="url(#b-fr4s)" />
          <line x1={120} y1={Y_BOT} x2={820} y2={Y_BOT} stroke="rgba(255,255,255,0.14)" />

          {/* 铜线：梯形 */}
          <polygon
            points={`${topX0},${Y_TOP} ${topX1},${Y_TOP} ${botX1},${Y_BOT} ${botX0},${Y_BOT}`}
            fill={C.cu}
          />
          <polygon
            points={`${topX0},${Y_TOP} ${topX1},${Y_TOP} ${botX1},${Y_BOT} ${botX0},${Y_BOT}`}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
          />

          {/* 抗蚀层 */}
          <rect x={topX0 - 12} y={Y_TOP - 34} width={topX1 - topX0 + 24} height={34} fill="#3A3A3A" />
          <rect x={topX0 - 12} y={Y_TOP - 34} width={topX1 - topX0 + 24} height={34} fill="none" stroke="rgba(255,255,255,0.2)" />
          <text x={450} y={Y_TOP - 14} fontFamily={MONO} fontSize={12} fill={C.dim} textAnchor="middle" letterSpacing="0.08em">
            RESIST 抗蚀层
          </text>

          {/* 蚀刻液箭头 */}
          {[0, 1, 2].map((i) => (
            <g key={`e${i}`} opacity={0.85}>
              <line
                x1={topX0 - 96 - i * 26}
                y1={Y_TOP + 22 + i * 34}
                x2={botX0 - 12 - i * 4}
                y2={Y_TOP + 22 + i * 34}
                stroke={C.amber}
                strokeWidth={1}
              />
              <line
                x1={topX1 + 96 + i * 26}
                y1={Y_TOP + 22 + i * 34}
                x2={botX1 + 12 + i * 4}
                y2={Y_TOP + 22 + i * 34}
                stroke={C.amber}
                strokeWidth={1}
              />
            </g>
          ))}

          {/* 上宽标注 */}
          <g opacity={1}>
            <line x1={topX0} y1={Y_TOP - 62} x2={topX1} y2={Y_TOP - 62} stroke={C.faint} strokeWidth={1} />
            <line x1={topX0} y1={Y_TOP - 68} x2={topX0} y2={Y_TOP - 56} stroke={C.faint} />
            <line x1={topX1} y1={Y_TOP - 68} x2={topX1} y2={Y_TOP - 56} stroke={C.faint} />
            <text x={450} y={Y_TOP - 72} fontFamily={MONO} fontSize={12} fill={C.dim} textAnchor="middle" letterSpacing="0.06em">
              顶宽 = 设计线宽
            </text>
          </g>

          {/* 侧蚀量 */}
          <g opacity={u}>
            <line x1={topX1} y1={Y_BOT + 26} x2={botX1} y2={Y_BOT + 26} stroke={C.red} strokeWidth={1} />
            <line x1={topX1} y1={Y_BOT + 20} x2={topX1} y2={Y_BOT + 32} stroke={C.red} />
            <line x1={botX1} y1={Y_BOT + 20} x2={botX1} y2={Y_BOT + 32} stroke={C.red} />
            <text x={botX1 + 10} y={Y_BOT + 30} fontFamily={MONO} fontSize={12} fill={C.red} letterSpacing="0.04em">
              undercut 侧蚀
            </text>
          </g>

          {/* 铜厚 */}
          <g>
            <line x1={botX1 + 96} y1={Y_TOP} x2={botX1 + 96} y2={Y_BOT} stroke={C.faint} />
            <text
              x={botX1 + 106}
              y={(Y_TOP + Y_BOT) / 2}
              fontFamily={MONO}
              fontSize={12}
              fill={C.dim}
              dominantBaseline="middle"
            >
              t 铜厚
            </text>
          </g>

          <text x={120} y={Y_BOT + 84} fontFamily={SANS} fontSize={14} fill={C.faint}>
            上窄下宽 = 梯形截面；顶宽才是实际导通宽度
          </text>
        </svg>

        <div style={{ flex: 1, paddingTop: 8 }}>
          <Rise frame={frame} at={1360}>
            <div style={{ fontFamily: SANS, fontSize: 18, color: C.ink }}>蚀刻因子</div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 24,
                color: C.blue,
                marginTop: 10,
                letterSpacing: '0.02em',
              }}
            >
              蚀刻深度 ÷ 侧蚀量
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.faint, marginTop: 8 }}>
              例：铜厚 35 µm、单边侧蚀 10 µm → 因子 3.5。数字越大，侧蚀控制越好。
            </div>
          </Rise>

          <Rise frame={frame} at={1396}>
            <Hair style={{ margin: '22px 0 18px' }} />
            <div style={{ fontFamily: SANS, fontSize: 18, color: C.ink, marginBottom: 12 }}>三条控制路径</div>
            {[
              '铜层别太厚：1 oz 比 2 oz 好控侧蚀',
              '药水新鲜、喷淋均匀：局部浓度差就是线宽差',
              '蚀得快：刚好蚀穿就停，多蚀一秒都在吃线宽',
            ].map((x, i) => (
              <div key={x} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <Marker tone={C.amber} size={22}>
                  {i + 1}
                </Marker>
                <span style={{ fontFamily: SANS, fontSize: 15, color: C.dim, lineHeight: 1.5 }}>{x}</span>
              </div>
            ))}
          </Rise>
        </div>
      </div>
    </Scene>
  );
};

/* ──────────────────── 07 · 表面处理 + 收束 ──────────────────── */

const FINISH = [
  { n: 'HASL 喷锡', th: '较厚', flat: '差，不平整', cost: '低', use: '便宜可焊好；细间距 / BGA 不友好' },
  { n: '镀锡', th: '薄', flat: '中', cost: '低', use: '多次回流后仍会氧化' },
  { n: 'ENIG 沉金', th: '薄', flat: '平整', cost: '高', use: '细间距与金手指；注意黑盘' },
  { n: '电镀硬金', th: '厚', flat: '平整耐磨', cost: '很高', use: '插拔寿命长；只用在触点' },
  { n: 'OSP', th: '极薄', flat: '平整', cost: '低', use: '环保；怕多次回流与长期存放' },
];

const S7: React.FC<{ frame: number }> = ({ frame }) => (
  <Scene frame={frame} from={1472} to={1622}>
    <Rise frame={frame} at={1476}>
      <Tag tone="dim">最后一步 · 决定「能存多久、好不好焊」</Tag>
      <Title size={34} style={{ marginTop: 12 }}>
        五种表面处理，选一个
      </Title>
    </Rise>

    <div style={{ marginTop: 20 }}>
      <Rise frame={frame} at={1490}>
        <div
          style={{
            display: 'flex',
            gap: 16,
            paddingBottom: 9,
            borderBottom: `1px solid ${C.hair}`,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: '0.14em',
            color: C.faint,
          }}
        >
          <span style={{ width: 170 }}>工艺</span>
          <span style={{ width: 90 }}>厚度</span>
          <span style={{ width: 120 }}>平整度</span>
          <span style={{ width: 80 }}>成本</span>
          <span style={{ flex: 1 }}>适用与注意</span>
        </div>
      </Rise>
      {FINISH.map((f, i) => (
        <Rise key={f.n} frame={frame} at={1500 + i * 10}>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              padding: '11px 0',
              borderBottom: `1px solid ${C.hairSoft}`,
            }}
          >
            <span style={{ width: 170, fontFamily: SANS, fontSize: 17, color: C.ink }}>{f.n}</span>
            <span style={{ width: 90, fontFamily: SANS, fontSize: 14, color: C.dim }}>{f.th}</span>
            <span style={{ width: 120, fontFamily: SANS, fontSize: 14, color: C.dim }}>{f.flat}</span>
            <span style={{ width: 80, fontFamily: MONO, fontSize: 13, color: C.faint }}>{f.cost}</span>
            <span style={{ flex: 1, fontFamily: SANS, fontSize: 14.5, color: C.dim }}>{f.use}</span>
          </div>
        </Rise>
      ))}
    </div>

    <Rise frame={frame} at={1560} style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ fontFamily: SANS, fontSize: 19, color: C.ink, whiteSpace: 'nowrap' }}>
          下单四件事
        </div>
        <div style={{ display: 'flex', gap: 10, flex: 1 }}>
          {['板材类型', '板厚', '铜厚', '表面处理'].map((x, i) => (
            <div
              key={x}
              style={{
                flex: 1,
                padding: '10px 0',
                textAlign: 'center',
                border: `1px solid ${C.hair}`,
                borderRadius: 6,
                fontFamily: SANS,
                fontSize: 15,
                color: C.ink,
                background: i === 3 ? C.greenSoft : 'transparent',
              }}
            >
              {x}
            </div>
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          → 报价与交期才准
        </div>
      </div>
    </Rise>
  </Scene>
);

/* ───────────────────────── 合成 ───────────────────────── */

export const SfFab: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Chrome
        frame={frame}
        duration={B_DURATION}
        brand="PCB · FABRICATION"
        sub="从覆铜板到成品"
        code="SF · 02 / 03"
        chapters={[...CHAPTERS]}
      />
      <S0 frame={frame} />
      <S1 frame={frame} />
      <S2 frame={frame} />
      <S3 frame={frame} />
      <S4 frame={frame} />
      <S5 frame={frame} />
      <S6 frame={frame} />
      <S7 frame={frame} />
    </AbsoluteFill>
  );
};
