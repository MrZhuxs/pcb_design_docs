import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Chrome } from './components/Chrome';
import { Schematic, type Pin } from './components/Schematic';
import { Scope } from './components/Scope';
import { C, MONO, SANS } from './theme';
import { clamp01, easeOut, prog } from './lib/anim';

const F = (frame: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(frame, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const T = {
  title: [0, 112],
  energy: [430, 590],
  states: [590, 910],
  pins: [910, 1250],
  params: [1250, 1700],
  outro: [1700, 1820],
} as const;

/** 九个引脚：先功率，再控制 */
const PIN_ROWS: { no: string; name: Pin; role: string; line: string; warn: string }[] = [
  {
    no: '7',
    name: 'VIN',
    role: '功率 · 输入',
    line: '12 V 从这里进，同时给芯片内部稳压供电',
    warn: '没有就近的旁路电容，回路电感的储能会在关断瞬间变成尖峰，直接打在芯片上。',
  },
  {
    no: '1',
    name: 'SW',
    role: '功率 · 输出',
    line: '上管源极，全板 dv/dt 最大的一个点',
    warn: '它不是「5 V 输出脚」，只是开关节点。探针、走线、相邻信号都要按噪声源对待。',
  },
  {
    no: '5',
    name: 'GND',
    role: '功率 · 地',
    line: '内部功率地与信号地的公共点',
    warn: '地弹会直接叠在 0.8 V 基准上，输出电压跟着一起抖。',
  },
  {
    no: '9',
    name: 'EP',
    role: '功率 · 散热',
    line: '裸露焊盘，内部连 GND，靠过孔阵列散热',
    warn: '不打过孔、不铺铜，热量出不去，满载时等热关断自己出场。',
  },
  {
    no: '8',
    name: 'BST',
    role: '功率 · 自举',
    line: '内部约 5 V 稳压，跨 C2 抬着上管栅极',
    warn: 'C2 容量不足，上管开不透、体电阻大、发热；BST–SW 耐压同样只有 6 V。',
  },
  {
    no: '2',
    name: 'EN',
    role: '控制 · 开关',
    line: '1.5 V 阈值，内部有上拉，回差约 300 mV',
    warn: '绝对最大 6 V：把 EN 直接接 12 V 母线是过压，不是「反正内部有上拉」。',
  },
  {
    no: '4',
    name: 'FB',
    role: '控制 · 看',
    line: '误差放大器反相端，正端固定 0.8 V',
    warn: '高阻节点，最怕 SW 的电场。取电压要从输出电容焊盘取，不要从电感那头取。',
  },
  {
    no: '3',
    name: 'COMP',
    role: '控制 · 调',
    line: '误差放大器输出，外挂 RC 决定相位余量',
    warn: '补偿值跟着电感与电容走；换了输出电容却不动补偿，先变慢，再振。',
  },
  {
    no: '6',
    name: 'FREQ',
    role: '控制 · 定频',
    line: '外接电阻到地，设定开关频率',
    warn: '开路就没有确定的频率，所有按频率算出来的 L、C、纹波一并作废。',
  },
];
const PIN_LEN = 34;

/** 四个带电阻的引脚：为什么必须有电阻、阻值怎么反推 */
const PARAMS: {
  pin: Pin;
  index: string;
  title: string;
  formula: string;
  result: string;
  bullets: string[];
}[] = [
  {
    pin: 'FB',
    index: '01',
    title: 'FB：先定下臂，再由比值定上臂',
    formula: 'Vout = 0.8 V × (1 + R4 / R5)',
    result: 'R5 = 40.2 kΩ → R4 = 40.2 k × 5.25 ≈ 211 k → 取 210 k → 4.98 V',
    bullets: [
      '为什么要有电阻：FB 脚只能站 0.8 V，5 V 直接接上去等于「报告过压」，芯片会一路把占空比压到 0。分压器就是把这根脚的眼睛缩小到 0.8 V 的量程。',
      '为什么下臂不能大：空载时自举电路会往输出注入约 20 µA，这 20 µA 流过 R5 变成误差 ΔV = 20 µA × R5。40.2 kΩ 时约 0.8 mV（0.1%），400 kΩ 就是 8 mV（1%）。手册给的上限 40 kΩ 就是这么来的。',
      '算法顺序：先按误差上限挑 R5（40.2 kΩ，E96 就近值）→ 再由目标电压求比值 → 乘出 R4 → 落到标准值 → 回算实际输出电压。',
    ],
  },
  {
    pin: 'EN',
    index: '02',
    title: 'EN：先定起机点，再定分压比',
    formula: 'Vtrip = 1.5 V × (1 + R1 / R2)',
    result: 'R1 = 100 kΩ → R2 = 100 k / 4 = 25 k → 取 24.9 k → 起机 7.5 V',
    bullets: [
      '为什么要有电阻：两个理由叠在一起。一是绝对最大值 6 V，12 V 母线直连就超了；二是让它在输入还没稳的时候别急着开关，起机点抬到 7.5 V 以上。',
      '阻值怎么定：先写下「我要 7.5 V 才起机」→ 分压比 = 1.5 / 7.5 = 0.2 → R2 = R1 / 4。R1 取 100 kΩ 是功耗与抗噪的折中：支路电流约 96 µA，远大于引脚漏电流，又只耗 1.2 mW。',
      '顺序反过来也行：先定支路电流（100 µA 量级）→ 得到 R1+R2 的总阻 → 再用比值分配。两种算法落在同一组值上。',
    ],
  },
  {
    pin: 'FREQ',
    index: '03',
    title: 'FREQ：不是算出来的，是查表加的权衡',
    formula: 'R3 = 100 kΩ → fsw = 900 kHz',
    result: 'f ↑ → L、C 变小、纹波小，但开关损耗与最小导通时间更紧',
    bullets: [
      '为什么要有电阻：芯片内部把这只电阻上的电流镜像给振荡器，电阻值直接就是频率。它没有「默认频率」，开路等于把设计变量交还给运气。',
      '阻值怎么定：查手册的 R–f 曲线（100 kΩ 对应 900 kHz），不是解方程。选 900 kHz 是在「15 µH 电感买得到、体积能接受」和「开关损耗可接受」之间取的点。',
      '连带后果：频率一改，电感量、输出电容、补偿零点三样都要重算。这就是为什么电阻看着不起眼，却是整张图的基准。',
    ],
  },
  {
    pin: 'COMP',
    index: '04',
    title: 'COMP：用 R 放零点，用 C 收高频',
    formula: 'fz = 1 / (2π · R6 · C5) ≈ 10.6 kHz',
    result: 'R6 = 100 kΩ 定零点位置，C5 = 150 pF 定高频增益',
    bullets: [
      '为什么要有电阻：这里不是分压，是补偿。输出 LC 在低频有个双极点，会把相位拖掉 180°，单靠误差放大器必然振荡。R6 串 C5 造一个零点，把相位补回来。',
      '阻值怎么定：手册表按 (Vout, L, Cout) 给出组合——1.8 V 用 47 k/100 pF、3.3 V 用 68.1 k/220 pF、5 V 用 100 k/150 pF。它绑的是 LC，不是芯片型号。',
      '判断标准：拉一下负载，看恢复时间与过冲有没有振铃。振铃说明零点靠后、相位不够；恢复太慢说明带宽不够。',
    ],
  },
];

export const DcdcSchematic: React.FC = () => {
  const frame = useCurrentFrame();

  const inStates = frame >= T.states[0] && frame < T.states[1];
  const inEnergy = frame >= T.energy[0] && frame < T.energy[1];
  const inPins = frame >= T.pins[0] && frame < T.pins[1];
  const inParams = frame >= T.params[0] && frame < T.params[1];
  const inOutro = frame >= T.outro[0];

  /* ---------------- 两个状态：4 个相位循环 ---------------- */
  const phaseSpan = 80;
  const phaseOffset = Math.floor((frame - T.states[0]) / phaseSpan);
  const phaseIndex = inStates ? phaseOffset % 4 : 0;
  const phaseStart = T.states[0] + phaseOffset * phaseSpan;
  const phaseT = clamp01((frame - phaseStart) / phaseSpan);
  const switchOn = phaseIndex % 2 === 0;

  /* ---------------- 九脚逐个走一遍 ---------------- */
  const pinIndex = inPins
    ? Math.min(Math.floor((frame - T.pins[0]) / PIN_LEN), PIN_ROWS.length - 1)
    : -1;
  const pinRow = pinIndex >= 0 ? PIN_ROWS[pinIndex] : null;
  const rowT = pinIndex >= 0 ? clamp01((frame - T.pins[0] - pinIndex * PIN_LEN) / 10) : 0;

  /* ---------------- 四组电阻的来历 ---------------- */
  const paramSpan = 112;
  const paramIndex = inParams
    ? Math.min(Math.floor((frame - T.params[0]) / paramSpan), PARAMS.length - 1)
    : -1;
  const param = paramIndex >= 0 ? PARAMS[paramIndex] : null;
  const paramT =
    paramIndex >= 0
      ? clamp01((frame - T.params[0] - paramIndex * paramSpan) / 14)
      : 0;

  /* ---------------- 电流回路 ---------------- */
  const energyLoopP = easeOut(prog(frame, T.energy[0] + 8, T.energy[0] + 48));
  const stateLoopP = easeOut(prog(frame, phaseStart, phaseStart + 16));
  const loop: 'none' | 'on' | 'off' = inEnergy
    ? 'on'
    : inStates
      ? switchOn
        ? 'on'
        : 'off'
      : 'none';
  const loopProgress = inEnergy ? energyLoopP : inStates ? stateLoopP : 0;
  const pulse = inEnergy
    ? (frame - T.energy[0] - 30) / 90
    : inStates
      ? phaseT
      : null;

  /* ---------------- 版面：每章把原理图挪到不挡字的位置 ---------------- */
  const layout = inParams
    ? { scale: 0.72, x: 0, y: -34, opacity: 0.5 }
    : inPins
      ? { scale: 0.62, x: 390, y: 120, opacity: 0.85 }
      : { scale: 1, x: 0, y: 0, opacity: 1 };

  const schematicOpacity = inOutro
    ? F(frame, T.outro[0], T.outro[0] + 20, 1, 0.1)
    : F(frame, 96, 118, 0, 1) * layout.opacity;

  const focus = inEnergy || inStates || inPins || inParams ? 'power' : 'none';
  const pinFocus = pinRow ? pinRow.name : param ? param.pin : null;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Chrome frame={frame} />

      <AbsoluteFill
        style={{
          opacity: schematicOpacity,
          transform: `translate(${layout.x}px, ${layout.y}px) scale(${layout.scale})`,
          transformOrigin: '50% 45%',
        }}
      >
        <Schematic
          frame={frame}
          focus={focus}
          loop={loop}
          loopProgress={loopProgress}
          pulse={pulse}
          chipState={inStates || inEnergy ? (switchOn ? 'on' : 'off') : null}
          pinFocus={pinFocus}
        />
      </AbsoluteFill>

      {/* ================================ 标题 ================================ */}
      {frame < T.title[1] ? (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              marginTop: -60,
              textAlign: 'center',
              opacity: F(frame, 0, 22) * F(frame, 84, 110, 1, 0),
              transform: `translateY(${F(frame, 0, 30, 14, 0)}px)`,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: '0.32em',
                color: C.blue,
                marginBottom: 26,
              }}
            >
              C05 · SCHEMATIC
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 92,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: C.ink,
                lineHeight: 1.05,
              }}
            >
              非同步降压
            </div>
            <div
              style={{
                margin: '28px auto 0',
                width: 720,
                height: 1,
                backgroundColor: C.hair,
              }}
            />
            <div
              style={{
                marginTop: 26,
                fontFamily: MONO,
                fontSize: 17,
                letterSpacing: '0.14em',
                color: C.dim,
              }}
            >
              MP1584EN · 12 V → 5 V / 3 A · 900 kHz
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: SANS,
                fontSize: 18,
                color: C.faint,
                letterSpacing: '0.04em',
              }}
            >
              先能量，再控制 —— 一张图读懂九个外围
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ============================== 02 能量 ============================== */}
      {inEnergy ? (
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 112,
            width: 640,
            opacity: F(frame, T.energy[0] + 6, T.energy[0] + 24) * F(frame, T.energy[1] - 18, T.energy[1], 1, 0),
            transform: `translateY(${F(frame, T.energy[0] + 6, T.energy[0] + 30, 10, 0)}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.2em',
              color: C.blue,
              marginBottom: 12,
            }}
          >
            02 · 能量
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: C.ink,
            }}
          >
            能量只走这一条
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: MONO,
              fontSize: 15,
              color: C.dim,
              letterSpacing: '0.02em',
            }}
          >
            VIN → 上管 → SW → L1 → +5V ／ 回程：GND 总线
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: SANS,
              fontSize: 17,
              color: C.faint,
              lineHeight: 1.6,
              maxWidth: 620,
            }}
          >
            其余七个引脚一个都不在这条线上。它们不流负载电流，
            但每一个都在改变这条线的行为。
          </div>
        </div>
      ) : null}

      {/* ============================ 03 两个状态 ============================ */}
      {inStates ? (
        <div
          style={{
            position: 'absolute',
            right: 72,
            top: 120,
            width: 420,
            textAlign: 'right',
            opacity: F(frame, T.states[0], T.states[0] + 14),
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: '0.2em',
              color: C.faint,
              marginBottom: 12,
            }}
          >
            03 · 状态 · PHASE {String(phaseIndex + 1).padStart(2, '0')} / 04
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: switchOn ? C.ink : C.dim,
            }}
          >
            {switchOn ? 'Q1 导通' : 'Q1 关断'}
          </div>
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 22,
              fontFamily: MONO,
              fontSize: 14,
              color: C.dim,
            }}
          >
            <span>
              SW ={' '}
              <span style={{ color: switchOn ? C.blue : C.ink }}>{switchOn ? '12 V' : '−0.4 V'}</span>
            </span>
            <span style={{ color: C.faint }}>di/dt {switchOn ? '> 0' : '< 0'}</span>
          </div>
        </div>
      ) : null}

      {inStates ? (
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 806,
            width: 900,
            opacity: F(frame, T.states[0], T.states[0] + 16),
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              fontSize: 26,
              fontWeight: 600,
              color: C.ink,
              letterSpacing: '0.01em',
            }}
          >
            电感电流方向不变，只是斜率变号
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: MONO,
              fontSize: 13,
              color: C.dim,
              letterSpacing: '0.02em',
            }}
          >
            上管通：VIN 给电感充能 ／ 上管断：D1 接班，把磁场里的能量交给负载
          </div>
        </div>
      ) : null}

      {inStates ? <Scope cursor={frame - T.states[0]} on={switchOn} /> : null}

      {/* ============================ 04 九个引脚 ============================ */}
      {inPins && pinRow ? (
        <div style={{ position: 'absolute', left: 72, top: 128, width: 800 }}>
          <div
            style={{
              fontFamily: SANS,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: C.ink,
              marginBottom: 16,
            }}
          >
            九个脚，三种角色
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10 }}>
            <span
              style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', color: C.blue }}
            >
              04 · 引脚
            </span>
            <span style={{ flex: 1, height: 1, backgroundColor: C.hair }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.1em' }}>
              {String(pinIndex + 1).padStart(2, '0')} / 09
            </span>
          </div>
          {PIN_ROWS.map((row, i) => {
            if (frame < T.pins[0] + i * PIN_LEN) return null;
            const active = i === pinIndex;
            return (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                  height: 52,
                  borderTop: `1px solid ${active ? C.blue : C.hair}`,
                  opacity: active ? 1 : 0.4,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: active ? C.blue : C.faint,
                    width: 14,
                  }}
                >
                  {row.no}
                </span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 16,
                    fontWeight: 600,
                    color: active ? C.ink : C.dim,
                    width: 58,
                  }}
                >
                  {row.name}
                </span>
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.faint, width: 86 }}>
                  {row.role}
                </span>
                <span
                  style={{
                    fontFamily: SANS,
                    fontSize: 14,
                    color: active ? C.ink : C.dim,
                    letterSpacing: '0.01em',
                  }}
                >
                  {row.line}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      {inPins && pinRow ? (
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 726,
            width: 800,
            opacity: rowT,
            transform: `translateY(${(1 - rowT) * 10}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: '0.16em',
              color: C.faint,
              marginBottom: 8,
            }}
          >
            接错会怎样
          </div>
          <div style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.75, color: C.dim }}>
            {pinRow.warn}
          </div>
        </div>
      ) : null}

      {/* ============================ 05 阻值从哪来 ============================ */}
      {inParams && param ? (
        <div
          style={{
            position: 'absolute',
            left: 72,
            top: 588,
            width: 1776,
            opacity: paramT,
            transform: `translateY(${(1 - paramT) * 14}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 16,
              paddingTop: 20,
              borderTop: `1px solid ${C.hair}`,
            }}
          >
            <span
              style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.2em', color: C.blue }}
            >
              05 · 阻值 · {param.index} / 04
            </span>
            <span style={{ flex: 1, height: 1, backgroundColor: C.hair }} />
            <span style={{ fontFamily: MONO, fontSize: 12, color: C.faint, letterSpacing: '0.08em' }}>
              为什么要有电阻 ／ 阻值怎么来的
            </span>
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: SANS,
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: C.ink,
            }}
          >
            {param.title}
          </div>
          <div style={{ display: 'flex', gap: 44, marginTop: 20 }}>
            <div style={{ width: 700, borderLeft: `2px solid ${C.blue}`, paddingLeft: 20 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 21,
                  color: C.blue,
                  letterSpacing: '0.01em',
                  lineHeight: 1.4,
                }}
              >
                {param.formula}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: MONO,
                  fontSize: 14,
                  color: C.dim,
                  lineHeight: 1.6,
                }}
              >
                {param.result}
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {param.bullets.map((b, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: SANS,
                    fontSize: 14.5,
                    lineHeight: 1.7,
                    color: C.dim,
                    letterSpacing: '0.01em',
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* ============================== 06 收束 ============================== */}
      {inOutro ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: F(frame, T.outro[0] + 6, T.outro[0] + 34),
          }}
        >
          <div style={{ width: 1100, marginTop: -30 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: '0.28em',
                color: C.blue,
                marginBottom: 20,
              }}
            >
              06 · 收束
            </div>
            <div
              style={{
                fontFamily: SANS,
                fontSize: 52,
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: C.ink,
                lineHeight: 1.15,
              }}
            >
              换一颗芯片，这四句话一条都不用改
            </div>
            <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['输入电容贴着 VIN 脚', '热环面积决定尖峰与辐射'],
                ['FB 从输出电容焊盘取', '0.8 V 的高阻节点，怕 SW 的噪声'],
                ['补偿跟着 LC 走', '芯片换了，电感没换，值就不用动'],
                ['续流器件永远在 SW 与地之间', '它是续流环的唯一路径'],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 18,
                    opacity: F(frame, T.outro[0] + 16 + i * 6, T.outro[0] + 34 + i * 6),
                    paddingTop: 14,
                    borderTop: `1px solid ${C.hairSoft}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      color: C.faint,
                      letterSpacing: '0.1em',
                      width: 26,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontFamily: SANS,
                      fontSize: 24,
                      color: C.ink,
                      letterSpacing: '0.01em',
                      width: 430,
                    }}
                  >
                    {k}
                  </span>
                  <span style={{ fontFamily: SANS, fontSize: 17, color: C.dim }}>{v}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 34,
                fontFamily: MONO,
                fontSize: 13,
                color: C.faint,
                letterSpacing: '0.06em',
                opacity: F(frame, T.outro[0] + 60, T.outro[0] + 80),
              }}
            >
              circuits/dcdc-converter · 配套笔记：FIG · C05 / C06
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
