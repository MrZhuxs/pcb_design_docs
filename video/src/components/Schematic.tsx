import React from 'react';
import { C, MONO, ORIGIN, SANS, SCALE } from '../theme';
import { easeOut, pointAt, prog, toPath, type Pt } from '../lib/anim';

const INK = C.ink;
const WIRE = '#CFCFCF';
const BLUE = C.blue;

export type Focus = 'none' | 'control' | 'power';
export type Pin = 'FB' | 'COMP' | 'EN' | 'FREQ' | 'BST' | 'VIN' | 'SW' | 'GND' | 'EP';

/* ------------------------------------------------------------------ 基元 */

const W: React.FC<{ d: string; p?: number; stroke?: string; width?: number; opacity?: number }> = ({
  d,
  p = 1,
  stroke = WIRE,
  width = 1.5,
  opacity = 1,
}) => (
  <path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    opacity={opacity}
    pathLength={p < 1 ? 1 : undefined}
    strokeDasharray={p < 1 ? '1 1' : undefined}
    strokeDashoffset={p < 1 ? 1 - p : 0}
  />
);

const Dot: React.FC<{ x: number; y: number; p: number; fill?: string }> = ({ x, y, p, fill = INK }) =>
  p <= 0 ? null : <circle cx={x} cy={y} r={2.6} fill={fill} opacity={p} />;

const Gnd: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <g stroke={INK} strokeWidth={1.5} fill="none" opacity={p}>
    <line x1={x - 15} y1={y} x2={x + 15} y2={y} />
    <line x1={x - 9} y1={y + 6} x2={x + 9} y2={y + 6} />
    <line x1={x - 4} y1={y + 12} x2={x + 4} y2={y + 12} />
  </g>
);

const CapV: React.FC<{ x: number; y: number; p: number; size?: number }> = ({
  x,
  y,
  p,
  size = 14,
}) => (
  <g stroke={INK} strokeWidth={1.9} fill="none" opacity={p}>
    <line x1={x - size} y1={y - 4} x2={x + size} y2={y - 4} />
    <line x1={x - size} y1={y + 4} x2={x + size} y2={y + 4} />
  </g>
);

const CapH: React.FC<{ x: number; y: number; p: number; size?: number }> = ({
  x,
  y,
  p,
  size = 10,
}) => (
  <g stroke={INK} strokeWidth={1.9} fill="none" opacity={p}>
    <line x1={x - 4} y1={y - size} x2={x - 4} y2={y + size} />
    <line x1={x + 4} y1={y - size} x2={x + 4} y2={y + size} />
  </g>
);

const ResV: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <rect
    x={x - 5.5}
    y={y}
    width={11}
    height={24}
    rx={1}
    fill={C.bg}
    stroke={INK}
    strokeWidth={1.4}
    opacity={p}
  />
);

const ResH: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
  <rect
    x={x}
    y={y - 5.5}
    width={30}
    height={11}
    rx={1}
    fill={C.bg}
    stroke={INK}
    strokeWidth={1.4}
    opacity={p}
  />
);

const DiodeV: React.FC<{ x: number; y: number; p: number; lit?: boolean }> = ({ x, y, p, lit }) => (
  <g stroke={lit ? BLUE : INK} strokeWidth={1.6} fill="none" opacity={p}>
    <line x1={x - 9} y1={y} x2={x + 9} y2={y} />
    <path d={`M${x - 9} ${y + 22}L${x + 9} ${y + 22}L${x} ${y}Z`} fill={C.bg} />
  </g>
);

const IndH: React.FC<{ x: number; y: number; p: number; w?: number; humps?: number }> = ({
  x,
  y,
  p,
  w = 84,
  humps = 4,
}) => {
  const s = w / humps;
  let d = `M${x} ${y}`;
  for (let i = 0; i < humps; i += 1) d += ` q${s / 2} -12 ${s} 0`;
  return (
    <path
      d={d}
      fill="none"
      stroke={INK}
      strokeWidth={1.6}
      strokeLinecap="round"
      opacity={p}
      pathLength={p < 1 ? 1 : undefined}
      strokeDasharray={p < 1 ? '1 1' : undefined}
      strokeDashoffset={p < 1 ? 1 - p : 0}
    />
  );
};

const T: React.FC<{
  x: number;
  y: number;
  p: number;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  color?: string;
  mono?: boolean;
  weight?: number;
  ls?: number;
  children: React.ReactNode;
}> = ({ x, y, p, size = 11, anchor = 'start', color = INK, mono = false, weight = 400, ls = 0, children }) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    opacity={p}
    fill={color}
    fontFamily={mono ? MONO : SANS}
    fontSize={size}
    fontWeight={weight}
    letterSpacing={ls}
    style={{ transform: `translateY(${(1 - p) * 3}px)` }}
  >
    {children}
  </text>
);

/* ------------------------------------------------------------------ 主图 */

export const Schematic: React.FC<{
  frame: number;
  focus: Focus;
  loop: 'none' | 'on' | 'off';
  loopProgress: number;
  pulse: number | null;
  chipState: 'on' | 'off' | null;
  pinFocus?: Pin | null;
}> = ({ frame, focus, loop, loopProgress, pulse, chipState, pinFocus }) => {
  const t = (from: number, to: number) => easeOut(prog(frame, from, to));

  // 分组出现窗口（绝对帧）
  const A = {
    chip: t(112, 150),
    chipLbl: t(146, 180),
    pins: t(158, 214),
    pinNo: t(196, 236),
    vin: t(168, 206),
    c6: t(200, 232),
    c1: t(216, 248),
    en: t(238, 280),
    freq: t(256, 296),
    bst: t(272, 308),
    sw: t(292, 330),
    d1: t(302, 338),
    l1: t(312, 348),
    out: t(326, 364),
    fb: t(342, 378),
    comp: t(356, 392),
    ep: t(372, 408),
  };

  // 焦点变暗：控制网络在「能量」「状态」章节降到 16%
  const focusIsControl = pinFocus
    ? (['EN', 'FB', 'COMP', 'FREQ', 'BST'] as Pin[]).includes(pinFocus)
    : false;
  const controlDim =
    focus === 'power' && !pinFocus ? 0.16 : pinFocus && !focusIsControl ? 0.25 : 1;
  const pinDim = (pin: Pin) =>
    pinFocus && focusIsControl && pinFocus !== pin ? 0.12 : 1;
  // 讲单根控制脚时，功率通路退成背景，但仍留作参照
  const pwrDim = focusIsControl ? 0.34 : 1;

  // 导通：输入段（VIN → 芯片左沿）+ 输出段（SW → L1 → 负载 → 地 → 回程）
  // 波形高亮分开画，避免一条斜线穿过芯片本体。
  const onIn: Pt[] = [
    [60, 150],
    [310, 150],
  ];
  const onOut: Pt[] = [
    [480, 178],
    [650, 178],
    [734, 178],
    [900, 178],
    [900, 386],
    [60, 386],
    [60, 150],
  ];
  // 关断：L1 → 负载 → 地 → D1 → SW（穿过 D1 本体）
  const offLoop: Pt[] = [
    [640, 178],
    [650, 178],
    [734, 178],
    [900, 178],
    [900, 386],
    [640, 386],
    [640, 178],
  ];

  const loopPaths: Pt[][] = loop === 'on' ? [onIn, onOut] : loop === 'off' ? [offLoop] : [];
  const pulsePath: Pt[] | null =
    loop === 'on' ? [...onIn, ...onOut] : loop === 'off' ? offLoop : null;
  const pulseAt = pulsePath && pulse !== null ? pointAt(pulsePath, pulse) : null;

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: 'absolute', inset: 0 }}
      viewBox="0 0 1920 1080"
    >
      <g transform={`translate(${ORIGIN.x} ${ORIGIN.y}) scale(${SCALE}) translate(0 ${-ORIGIN.vboxTop})`}>
        {/* 回程母线：只在讲电流回路时出现（虚线＝示意，不是画出来的导线） */}
        <g opacity={loop === 'none' ? 0 : 1}>
          <path
            d="M900 386 H60 M640 274 V386 M900 178 V386"
            fill="none"
            stroke={C.faint}
            strokeWidth={1.1}
            strokeDasharray="5 7"
            opacity={0.45}
          />
          <T x={470} y={402} p={1} size={9} anchor="middle" color={C.faint} mono>
            回程 · GND
          </T>
          <T x={890} y={332} p={1} size={9} anchor="end" color={C.faint} mono>
            负载
          </T>
        </g>

        {/* ---------- 输入 ---------- */}
        <g opacity={pwrDim}>
          <T x={60} y={138} p={A.vin} size={11.5} weight={600} ls={0.6}>
            VIN · 12 V
          </T>
          <W d="M60 150 H310" p={A.vin} />
          <W d="M110 150 V168 M110 176 V200" p={A.c6} />
          <CapV x={110} y={172} p={A.c6} />
          <Gnd x={110} y={200} p={A.c6} />
          <T x={110} y={244} p={A.c6} size={10} anchor="middle" color={C.dim} mono>
            C6 10 µF
          </T>
          <W d="M180 150 V168 M180 176 V200" p={A.c1} />
          <CapV x={180} y={172} p={A.c1} />
          <Gnd x={180} y={200} p={A.c1} />
          <T x={180} y={244} p={A.c1} size={10} anchor="middle" color={C.dim} mono>
            C1 10 µF
          </T>
        </g>

        {/* ---------- EN 分压（控制网络） ---------- */}
        <g opacity={A.en * controlDim * pinDim('EN')}>
          <W d="M260 150 V158 M260 182 V190 M260 190 H310" p={A.en} />
          <ResV x={260} y={158} p={A.en} />
          <W d="M260 190 V202 M260 226 V236" p={A.en} />
          <ResV x={260} y={202} p={A.en} />
          <Gnd x={260} y={236} p={A.en} />
          <T x={246} y={170} p={A.en} size={12} anchor="end" weight={600}>
            R1
          </T>
          <T x={246} y={184} p={A.en} size={10} anchor="end" color={C.dim} mono>
            100 kΩ
          </T>
          <T x={246} y={214} p={A.en} size={12} anchor="end" weight={600}>
            R2
          </T>
          <T x={246} y={228} p={A.en} size={10} anchor="end" color={C.dim} mono>
            24.9 kΩ
          </T>
        </g>

        {/* ---------- FREQ（控制网络） ---------- */}
        <g opacity={A.freq * controlDim * pinDim('FREQ')}>
          <W d="M310 240 H300 M300 240 V252 M300 276 V296" p={A.freq} />
          <ResV x={300} y={252} p={A.freq} />
          <Gnd x={300} y={296} p={A.freq} />
          <T x={286} y={268} p={A.freq} size={12} anchor="end" weight={600}>
            R3
          </T>
          <T x={286} y={282} p={A.freq} size={10} anchor="end" color={C.dim} mono>
            100 kΩ
          </T>
        </g>

        {/* ---------- 自举 ---------- */}
        <g>
          <rect
            x={310}
            y={130}
            width={170}
            height={160}
            rx={3}
            fill={C.chip}
            stroke={C.chipStroke}
            strokeWidth={1.3}
            opacity={A.chip}
          />
          {chipState ? (
            <rect
              x={310}
              y={130}
              width={170}
              height={160}
              rx={3}
              fill={C.blueSoft}
              opacity={A.chip * (chipState === 'on' ? 0.45 : 0.14)}
            />
          ) : null}
          <T x={395} y={104} p={A.chipLbl} size={12.5} anchor="middle" weight={600}>
            U1 · MP1584EN-LF-Z
          </T>
          <T x={395} y={120} p={A.chipLbl} size={10} anchor="middle" color={C.faint} mono>
            3 A 非同步降压 · SOIC8E
          </T>

          {[
            { x: 322, y: 154, name: 'VIN', anchor: 'start' as const, pin: 'VIN' as const },
            { x: 322, y: 194, name: 'EN', anchor: 'start' as const, pin: 'EN' as const },
            { x: 322, y: 244, name: 'FREQ', anchor: 'start' as const, pin: 'FREQ' as const },
            { x: 468, y: 146, name: 'BST', anchor: 'end' as const, pin: 'BST' as const },
            { x: 468, y: 182, name: 'SW', anchor: 'end' as const, pin: 'SW' as const },
            { x: 468, y: 226, name: 'FB', anchor: 'end' as const, pin: 'FB' as const },
            { x: 468, y: 266, name: 'COMP', anchor: 'end' as const, pin: 'COMP' as const },
            { x: 350, y: 284, name: 'EP', anchor: 'middle' as const, pin: 'EP' as const },
            { x: 440, y: 284, name: 'GND', anchor: 'middle' as const, pin: 'GND' as const },
          ].map((pin) => {
            const lit = pinFocus && pin.pin === pinFocus;
            return (
              <T
                key={pin.name}
                x={pin.x}
                y={pin.y}
                p={A.pins}
                size={12}
                anchor={pin.anchor}
                color={lit ? BLUE : C.dim}
                weight={lit ? 600 : 400}
                mono
              >
                {pin.name}
              </T>
            );
          })}

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
            <T key={pin.no} x={pin.x} y={pin.y} p={A.pinNo} size={9.5} anchor={pin.anchor} color={C.faint} mono>
              {pin.no}
            </T>
          ))}

          {/* 芯片内部：上管 */}
          {chipState ? (
            <g opacity={A.chip}>
              <rect
                x={346}
                y={168}
                width={104}
                height={48}
                rx={2}
                fill="none"
                stroke={chipState === 'on' ? BLUE : C.faint}
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.85}
              />
              <circle cx={360} cy={192} r={3.2} fill={chipState === 'on' ? BLUE : '#3A3A3A'} />
              <T x={372} y={188} p={1} size={9.5} color={chipState === 'on' ? BLUE : C.dim} mono>
                上管 Q1
              </T>
              <T x={372} y={203} p={1} size={9.5} color={chipState === 'on' ? BLUE : C.faint} mono>
                {chipState === 'on' ? 'ON' : 'OFF'}
              </T>
            </g>
          ) : null}
        </g>

        {/* ---------- 自举（控制网络） ---------- */}
        <g opacity={A.bst * controlDim * pinDim('BST')}>
          <W d="M480 142 H500 M500 142 V112 M500 112 H512" p={A.bst} />
          <CapH x={516} y={112} p={A.bst} />
          <W d="M520 112 H545 M545 112 V178" p={A.bst} />
          <T x={516} y={96} p={A.bst} size={10} anchor="middle" color={C.dim} mono>
            C2 100 nF
          </T>
        </g>

        {/* ---------- 功率通路 ---------- */}
        <g opacity={pwrDim}>
          <W d="M480 178 H650" p={A.sw} />
          <W d="M640 178 V182 M640 204 V258" p={A.d1} />
          <DiodeV x={640} y={182} p={A.d1} lit={loop === 'off'} />
          <Gnd x={640} y={258} p={A.d1} />
          <T x={654} y={192} p={A.d1} size={12} weight={600}>
            D1
          </T>
          <T x={654} y={206} p={A.d1} size={10} color={C.dim} mono>
            B340A-13-F
          </T>

          <IndH x={650} y={178} p={A.l1} w={84} humps={4} />
          <W d="M734 178 H900" p={A.l1} />
          <T x={692} y={158} p={A.l1} size={12} anchor="middle" weight={600}>
            L1 15 µH
          </T>
          <T x={900} y={166} p={A.out} size={12.5} anchor="end" weight={600}>
            +5V
          </T>

          <W d="M770 178 V196 M770 204 V236" p={A.out} />
          <CapV x={770} y={200} p={A.out} />
          <Gnd x={770} y={236} p={A.out} />
          <T x={790} y={202} p={A.out} size={12} weight={600}>
            C3
          </T>
          <T x={790} y={216} p={A.out} size={10} color={C.dim} mono>
            22 µF
          </T>

          <W d="M840 178 V196 M840 204 V236" p={A.out} />
          <CapV x={840} y={200} p={A.out} />
          <Gnd x={840} y={236} p={A.out} />
          <T x={862} y={202} p={A.out} size={12} weight={600}>
            C4
          </T>
          <T x={862} y={216} p={A.out} size={10} color={C.dim} mono>
            22 µF
          </T>

          <W d="M350 290 V326 M440 290 V326" p={A.ep} />
          <Gnd x={350} y={326} p={A.ep} />
          <Gnd x={440} y={326} p={A.ep} />
          <T x={395} y={358} p={A.ep} size={10} anchor="middle" color={C.faint}>
            EP 与 GND 都直接铺大地铜皮
          </T>
        </g>

        {/* ---------- FB 反馈分压（控制网络） ---------- */}
        <g opacity={A.fb * controlDim * pinDim('FB')}>
          <W d="M480 222 H580" p={A.fb} />
          <W d="M560 222 V234 M560 258 V276" p={A.fb} />
          <ResV x={560} y={234} p={A.fb} />
          <Gnd x={560} y={276} p={A.fb} />
          <W d="M610 222 H630 A9 9 0 0 1 648 222 H690 V300 H880 V178" p={A.fb} />
          <ResH x={580} y={222} p={A.fb} />
          <T x={595} y={206} p={A.fb} size={10} anchor="middle" color={C.dim} mono>
            R4 210 kΩ
          </T>
          <T x={572} y={240} p={A.fb} size={12} weight={600}>
            R5
          </T>
          <T x={572} y={254} p={A.fb} size={10} color={C.dim} mono>
            40.2 kΩ
          </T>
        </g>

        {/* ---------- COMP 补偿（控制网络） ---------- */}
        <g opacity={A.comp * controlDim * pinDim('COMP')}>
          <W d="M480 262 H520 M520 262 V300 M520 308 V320 M520 344 V362" p={A.comp} />
          <CapV x={520} y={304} p={A.comp} />
          <ResV x={520} y={320} p={A.comp} />
          <Gnd x={520} y={362} p={A.comp} />
          <T x={540} y={308} p={A.comp} size={10} color={C.dim} mono>
            C5 150 pF
          </T>
          <T x={540} y={342} p={A.comp} size={10} color={C.dim} mono>
            R6 100 kΩ
          </T>
        </g>

        {/* ---------- 结点 ---------- */}
        <g>
          <Dot x={110} y={150} p={A.c6} />
          <Dot x={180} y={150} p={A.c1} />
          <Dot x={260} y={150} p={A.en} />
          <Dot x={260} y={190} p={A.en} />
          <Dot x={545} y={178} p={A.bst} />
          <Dot x={640} y={178} p={A.d1} />
          <Dot x={880} y={178} p={A.fb} />
          <Dot x={770} y={178} p={A.out} />
          <Dot x={840} y={178} p={A.out} />
          <Dot x={560} y={222} p={A.fb} />
        </g>

        {/* ---------- 电流回路高亮 ---------- */}
        {loopPaths.length ? (
          <g>
            {loopPaths.map((pts, i) => (
              <path
                key={`glow-${i}`}
                d={toPath(pts)}
                fill="none"
                stroke={BLUE}
                strokeWidth={9}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.12}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - loopProgress}
              />
            ))}
            {loopPaths.map((pts, i) => (
              <path
                key={`line-${i}`}
                d={toPath(pts)}
                fill="none"
                stroke={BLUE}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.92}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - loopProgress}
              />
            ))}
            {pulseAt ? (
              <g>
                <circle cx={pulseAt[0]} cy={pulseAt[1]} r={9} fill={BLUE} opacity={0.18} />
                <circle cx={pulseAt[0]} cy={pulseAt[1]} r={4} fill={BLUE} />
              </g>
            ) : null}
          </g>
        ) : null}
      </g>
    </svg>
  );
};
