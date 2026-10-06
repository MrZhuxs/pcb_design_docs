'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * 交互式概念图组件（客户端组件）。
 *
 * 已注册到 components/mdx.tsx，MDX 中直接使用，无需 import。
 *
 * 组件清单：
 * - <ChargePair>    电荷同号相斥 / 异号相吸（可切换）
 * - <EnergyLadder>  能级填充顺序（可逐个填入电子）
 * - <LoopCurrent>   回流路径：参考平面完整 vs 被割断（可切换）
 * - <TraceGauge>    线宽 → 载流能力 / 电阻 / 压降（滑块）
 * - <WaveformRms>   波形与峰值 / 平均值 / 有效值（可切换）
 */

/* ======================================================== 电荷相斥相吸 */

const ctrl =
  'rounded-md border border-fd-border bg-fd-secondary px-2.5 py-1 text-xs font-medium text-fd-secondary-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground';

function Charge({ positive, className }: { positive: boolean; className?: string }) {
  return (
    <div
      className={cn(
        'grid size-14 shrink-0 place-items-center rounded-full border-2 text-xl font-bold transition-colors duration-300',
        positive
          ? 'border-fd-primary bg-fd-primary/10 text-fd-primary'
          : 'border-fd-muted-foreground bg-fd-muted-foreground/10 text-fd-muted-foreground',
        className,
      )}
    >
      {positive ? '+' : '−'}
    </div>
  );
}

export function ChargePair() {
  const [aPos, setAPos] = useState(true);
  const [bPos, setBPos] = useState(true);
  const repel = aPos === bPos;

  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <Charge positive={aPos} />
        <div
          className="flex items-center justify-center"
          style={{ width: repel ? 214 : 100, transition: 'width 520ms ease-out' }}
        >
          <svg width="86" height="56" viewBox="0 0 86 56" aria-hidden>
            <g className="text-fd-primary" stroke="currentColor" strokeWidth="2" fill="none">
              {repel ? (
                <>
                  <path d="M40 20 H10 M10 20l9-6M10 20l9 6" />
                  <path d="M46 20 H76 M76 20l-9-6M76 20l-9 6" />
                </>
              ) : (
                <>
                  <path d="M10 20 H40 M40 20l-9-6M40 20l-9 6" />
                  <path d="M76 20 H46 M46 20l9-6M46 20l9 6" />
                </>
              )}
            </g>
            <text x="43" y="48" textAnchor="middle" className="fill-fd-foreground text-[11px] font-medium">
              {repel ? '相斥' : '相吸'}
            </text>
          </svg>
        </div>
        <Charge positive={bPos} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-fd-muted-foreground">左侧电荷：</span>
        <button type="button" className={ctrl} onClick={() => setAPos((v) => !v)}>
          {aPos ? '+ 正电荷' : '− 负电荷'}
        </button>
        <span className="ml-2 text-xs text-fd-muted-foreground">右侧电荷：</span>
        <button type="button" className={ctrl} onClick={() => setBPos((v) => !v)}>
          {bPos ? '+ 正电荷' : '− 负电荷'}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-fd-muted-foreground">
        当前：{aPos && bPos ? '同号（+ +）' : !aPos && !bPos ? '同号（− −）' : '异号（+ −）'}
        {' → '}
        <span className="font-medium text-fd-foreground">{repel ? '互相排斥' : '互相吸引'}</span>
      </p>
    </div>
  );
}

/* ============================================================ 能级填充 */

const LEVELS: { id: string; cap: number; y: number; note?: string }[] = [
  { id: '1s', cap: 2, y: 292 },
  { id: '2s', cap: 2, y: 256 },
  { id: '2p', cap: 6, y: 220 },
  { id: '3s', cap: 2, y: 184 },
  { id: '3p', cap: 6, y: 148 },
  { id: '4s', cap: 2, y: 108, note: '能量低于 3d' },
  { id: '3d', cap: 10, y: 76 },
  { id: '4p', cap: 6, y: 48 },
];

const TOTAL = LEVELS.reduce((s, l) => s + l.cap, 0);

export function EnergyLadder() {
  const [n, setN] = useState(0);

  // 按填充顺序把 n 个电子分配到各能级
  let left = n;
  const filled = LEVELS.map((l) => {
    const take = Math.min(l.cap, left);
    left -= take;
    return take;
  });
  const currentIdx = filled.findIndex((f, i) => f < LEVELS[i].cap);
  const active = currentIdx === -1 ? -1 : currentIdx;

  const xStart = 140;
  const xEnd = 500;

  return (
    <div className="w-full">
      <svg viewBox="0 0 620 330" className="h-auto w-full" role="img" aria-label="电子能级填充顺序示意">
        <text x={16} y={22} className="fill-fd-muted-foreground text-[11px]">
          能量
        </text>
        <path d="M34 34 V306" className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M34 306 H44" className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M34 34 H44" className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />

        {LEVELS.map((lv, i) => {
          const isActive = i === active;
          const gap = (xEnd - xStart) / Math.max(lv.cap, 1);
          return (
            <g key={lv.id}>
              <text
                x={xStart - 16}
                y={lv.y + 4}
                textAnchor="end"
                className={cn('text-[12px]', isActive ? 'fill-fd-primary font-semibold' : 'fill-fd-foreground')}
              >
                {lv.id}
              </text>
              <path
                d={`M${xStart - 8} ${lv.y} H${xEnd}`}
                className={isActive ? 'text-fd-primary' : 'text-fd-border'}
                stroke="currentColor"
                strokeWidth={isActive ? 2.4 : 1.4}
                fill="none"
              />
              {Array.from({ length: lv.cap }).map((_, k) => {
                const on = k < filled[i];
                return (
                  <rect
                    key={k}
                    x={xStart - 8 + gap * (k + 0.5) - 5}
                    y={lv.y - 5.5}
                    width={11}
                    height={11}
                    rx={5.5}
                    className={cn(on ? 'text-fd-primary' : 'text-fd-border')}
                    fill="currentColor"
                    fillOpacity={on ? 1 : 0.25}
                  />
                );
              })}
              {lv.note && (
                <text x={xEnd + 8} y={lv.y + 4} className="fill-fd-muted-foreground text-[10px]">
                  {lv.note}
                </text>
              )}
            </g>
          );
        })}

        <text x={xStart - 16} y={322} textAnchor="end" className="fill-fd-muted-foreground text-[10px]">
          填充终点
        </text>
        <text x={xStart + (xEnd - xStart) / 2} y={322} textAnchor="middle" className="fill-fd-muted-foreground text-[10px]">
          每级容量 = 2n² 分解到各亚层（实心圆 = 已填入的电子，每态最多 2 个）
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={ctrl} onClick={() => setN((v) => Math.min(TOTAL, v + 1))}>
          + 填入 1 个电子
        </button>
        <button type="button" className={ctrl} onClick={() => setN((v) => Math.max(0, v - 1))}>
          − 退回 1 个
        </button>
        <button type="button" className={ctrl} onClick={() => setN(0)}>
          重置
        </button>
        <span className="ml-1 text-xs text-fd-muted-foreground">
          已填 {n} / {TOTAL}
          {active >= 0 && ` · 正在填 ${LEVELS[active].id}（${filled[active]}/${LEVELS[active].cap}）`}
        </span>
      </div>

      {active === 5 && (
        <p className="mt-2 text-center text-xs font-medium text-fd-primary">
          注意：4s 在 3d 之前被填满 —— 这是电子间库仑斥力与屏蔽造成的能级交错
        </p>
      )}
    </div>
  );
}

/* ============================================================ 回流路径 */

export function LoopCurrent() {
  const [intact, setIntact] = useState(true);

  return (
    <div className="w-full">
      <svg viewBox="0 0 620 290" className="h-auto w-full" role="img" aria-label="参考平面完整与割断时的回流路径对比">
        {/* 回路面积阴影 */}
        {intact ? (
          <rect x={60} y={80} width={500} height={100} className="text-fd-primary" fill="currentColor" fillOpacity={0.08} />
        ) : (
          <rect x={60} y={80} width={500} height={172} className="text-fd-muted-foreground" fill="currentColor" fillOpacity={0.08} />
        )}

        {/* 信号层 */}
        <path d="M60 80 H560" className="text-fd-foreground" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <g className="text-fd-primary" stroke="currentColor" strokeWidth="2" fill="none">
          <path d="M150 62 H210 M210 62l-9-6M210 62l-9 6" />
        </g>
        <text x={64} y={62} className="fill-fd-foreground text-[11px] font-medium">
          信号层：信号电流 →
        </text>

        {/* 参考平面 */}
        {intact ? (
          <path d="M60 180 H560" className="text-fd-border" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
        ) : (
          <>
            <path d="M60 180 H286" className="text-fd-border" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
            <path d="M334 180 H560" className="text-fd-border" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
            <path d="M286 168 V192" className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <path d="M334 168 V192" className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <text x={310} y={206} textAnchor="middle" className="fill-fd-muted-foreground text-[11px]">
              分割缝
            </text>
          </>
        )}

        {/* 回流路径 */}
        {intact ? (
          <g className="text-fd-primary" stroke="currentColor" strokeWidth="2.4" fill="none">
            <path d="M540 180 H90 M90 180l9-6M90 180l9 6" />
          </g>
        ) : (
          <g className="text-fd-muted-foreground" stroke="currentColor" strokeWidth="2.4" fill="none" strokeDasharray="7 4">
            <path d="M540 182 V252 H80 V184 M80 184l-9 6M80 184l9 6" />
          </g>
        )}
        <text x={64} y={intact ? 176 : 270} className={cn('text-[11px] font-medium', intact ? 'fill-fd-primary' : 'fill-fd-muted-foreground')}>
          {intact ? '回流电流 ←（贴着信号正下方）' : '回流被迫绕行 ←（回路面积暴涨）'}
        </text>

      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button type="button" className={ctrl} onClick={() => setIntact(true)}>
          参考平面完整
        </button>
        <button type="button" className={ctrl} onClick={() => setIntact(false)}>
          参考平面被割断
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {[
          { k: '回路面积', on: '小', off: '暴增' },
          { k: '回路电感 L', on: '小', off: '大' },
          { k: '辐射', on: '弱', off: '强' },
          { k: '阻抗连续性', on: '连续', off: '跳变' },
        ].map((r) => (
          <div key={r.k} className="rounded-md border border-fd-border bg-fd-secondary/50 px-2.5 py-1.5">
            <p className="text-[10px] text-fd-muted-foreground">{r.k}</p>
            <p className={cn('mt-0.5 font-medium', intact ? 'text-fd-primary' : 'text-fd-muted-foreground')}>
              {intact ? r.on : r.off}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======================================================== 波形与有效值 */

type Wf = 'dc' | 'sine' | 'sq50' | 'sq10';

const WF: Record<Wf, { name: string; pk: number; avg: number; rms: number }> = {
  dc: { name: '直流', pk: 1, avg: 1, rms: 1 },
  sine: { name: '正弦', pk: 1, avg: 0, rms: 1 / Math.SQRT2 },
  sq50: { name: '方波 50%', pk: 1, avg: 0.5, rms: Math.sqrt(0.5) },
  sq10: { name: '方波 10%', pk: 1, avg: 0.1, rms: Math.sqrt(0.1) },
};

export function WaveformRms() {
  const [wf, setWf] = useState<Wf>('sq10');

  // 正弦以 y=105 为中心上下对称；直流与方波的 0 电平在 y=153，峰顶在 y=57
  const isSine = wf === 'sine';
  const zeroY = isSine ? 105 : 153;
  const hiY = 57;
  const amp = 48;
  const x0 = 50;
  const x1 = 520;
  const w = x1 - x0;

  let d = '';
  if (wf === 'dc') {
    d = `M${x0} ${hiY} H${x1}`;
  } else if (isSine) {
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const t = i / 240;
      const y = zeroY - amp * Math.sin(2 * Math.PI * t * 2);
      pts.push(`${(x0 + w * t).toFixed(1)},${y.toFixed(1)}`);
    }
    d = `M${pts.join(' L')}`;
  } else {
    const duty = wf === 'sq50' ? 0.5 : 0.1;
    const period = w / 4;
    const segs: string[] = [`M${x0} ${zeroY}`];
    for (let k = 0; k < 4; k++) {
      const s = x0 + k * period;
      segs.push(
        `L${s} ${zeroY}`,
        `L${s} ${hiY}`,
        `L${s + period * duty} ${hiY}`,
        `L${s + period * duty} ${zeroY}`,
        `L${s + period} ${zeroY}`,
      );
    }
    d = segs.join(' ');
  }

  const m = WF[wf];
  const naive = 0.707;
  const heatErr = ((naive * naive) / (m.rms * m.rms) - 1) * 100;

  return (
    <div className="w-full">
      <svg viewBox="0 0 560 210" className="h-auto w-full" role="img" aria-label="四种电流波形的峰值、平均值与有效值">
        <path d={`M${x0} ${zeroY} H${x1}`} className="text-fd-border" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d={d} className="text-fd-primary" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinejoin="round" />
        <path
          d={`M${x0} ${hiY} H${x1}`}
          className="text-fd-muted-foreground"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
        <text x={x1 + 6} y={zeroY + 4} className="fill-fd-muted-foreground text-[10px]">
          0
        </text>
        <text x={x1 + 6} y={hiY + 4} className="fill-fd-muted-foreground text-[10px]">
          I_pk
        </text>
        <text x={x0} y={190} className="fill-fd-foreground text-[11px] font-medium">
          {m.name}
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {(Object.keys(WF) as Wf[]).map((k) => (
          <button
            key={k}
            type="button"
            className={cn(ctrl, wf === k && 'border-fd-primary text-fd-primary')}
            onClick={() => setWf(k)}
          >
            {WF[k].name}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {[
          { k: '峰值 I_pk（器件应力）', v: m.pk.toFixed(3) },
          { k: '平均值（电荷量）', v: m.avg.toFixed(3) },
          { k: '有效值 RMS（发热）', v: m.rms.toFixed(3) },
          { k: '相对发热 I²R', v: (m.rms * m.rms).toFixed(3) },
        ].map((r) => (
          <div key={r.k} className="rounded-md border border-fd-border bg-fd-secondary/50 px-2.5 py-1.5">
            <p className="text-[10px] leading-tight text-fd-muted-foreground">{r.k}</p>
            <p className="mt-1 font-mono font-medium text-fd-foreground">{r.v}</p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-fd-muted-foreground">
        {wf === 'sine' || wf === 'dc'
          ? '正弦波有效值 = I_pk/√2 ≈ 0.707；直流为 1.000'
          : Math.abs(heatErr) < 1
            ? '50% 占空比时 0.707 恰好等于正确值 —— 这是该误用长期存在的原因'
            : `若误用 I_pk/√2 = 0.707，发热将被高估 ${heatErr.toFixed(0)}%（正确值 ${m.rms.toFixed(3)}）`}
      </p>
    </div>
  );
}

/* ==================================================== 线宽与载流能力 */

const OZ_MIL = 1.378; // 1 oz 铜厚，单位 mil
const RHO = 1.72e-8; // 铜电阻率 Ω·m @ 20°C
const T_M = 35e-6; // 1 oz 铜厚，单位 m

function ampacity(wMil: number, dT: number, outer: boolean) {
  const A = wMil * OZ_MIL; // mil²
  return (outer ? 0.048 : 0.024) * Math.pow(dT, 0.44) * Math.pow(A, 0.725);
}

export function TraceGauge() {
  const [w, setW] = useState(0.5); // mm
  const [len, setLen] = useState(100); // mm
  const [dT, setDT] = useState(10); // °C

  const wMil = w / 0.0254;
  const A = wMil * OZ_MIL; // mil²
  const A_m2 = w * 1e-3 * T_M; // m²
  const iOut = ampacity(wMil, dT, true);
  const iIn = ampacity(wMil, dT, false);
  const r = (RHO * (len * 1e-3)) / A_m2; // Ω
  const dv = iOut * r;
  const p = iOut * iOut * r;

  const rows = [
    { k: `截面积`, v: `${A.toFixed(1)} mil² / ${(A_m2 * 1e6).toFixed(3)} mm²` },
    { k: `${dT}°C 温升 · 外层`, v: `${iOut.toFixed(3)} A`, hi: true },
    { k: `${dT}°C 温升 · 内层`, v: `${iIn.toFixed(3)} A` },
    { k: `${len} mm 走线电阻`, v: r < 1 ? `${(r * 1e3).toFixed(1)} mΩ` : `${r.toFixed(3)} Ω` },
    { k: `按外层载流时的压降`, v: `${(dv * 1e3).toFixed(0)} mV` },
    { k: `按外层载流时的功耗`, v: p < 1 ? `${(p * 1e3).toFixed(0)} mW` : `${p.toFixed(2)} W` },
  ];

  return (
    <div className="w-full">
      {/* 线宽示意 */}
      <svg viewBox="0 0 560 76" className="h-auto w-full" aria-hidden>
        <text x={0} y={16} className="fill-fd-muted-foreground text-[11px]">
          走线截面（1 oz 铜，35 µm 厚）
        </text>
        <rect x={10} y={30} width={Math.min(400, 40 + w * 45)} height={26} rx={3} className="text-fd-primary" fill="currentColor" fillOpacity={0.25} stroke="currentColor" strokeWidth="1.5" />
        <text x={20 + Math.min(400, 40 + w * 45)} y={48} className="fill-fd-foreground text-[11px] font-medium">
          {w.toFixed(2)} mm（{(w / 0.0254).toFixed(1)} mil）
        </text>
      </svg>

      <div className="mt-2 space-y-3">
        <label className="block text-xs">
          <span className="text-fd-muted-foreground">线宽：{w.toFixed(2)} mm</span>
          <input
            type="range"
            min={0.1}
            max={8}
            step={0.05}
            value={w}
            onChange={(e) => setW(Number(e.target.value))}
            className="mt-1 w-full accent-fd-primary"
          />
        </label>
        <label className="block text-xs">
          <span className="text-fd-muted-foreground">走线长度：{len} mm</span>
          <input
            type="range"
            min={5}
            max={200}
            step={5}
            value={len}
            onChange={(e) => setLen(Number(e.target.value))}
            className="mt-1 w-full accent-fd-primary"
          />
        </label>
        <label className="block text-xs">
          <span className="text-fd-muted-foreground">允许温升 ΔT：{dT} °C</span>
          <input
            type="range"
            min={5}
            max={40}
            step={5}
            value={dT}
            onChange={(e) => setDT(Number(e.target.value))}
            className="mt-1 w-full accent-fd-primary"
          />
        </label>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        {rows.map((row) => (
          <div
            key={row.k}
            className={cn(
              'rounded-md border px-2.5 py-1.5',
              row.hi ? 'border-fd-primary/40 bg-fd-primary/5' : 'border-fd-border bg-fd-secondary/50',
            )}
          >
            <p className="text-[10px] leading-tight text-fd-muted-foreground">{row.k}</p>
            <p className="mt-1 font-mono font-medium text-fd-foreground">{row.v}</p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-center text-[11px] text-fd-muted-foreground">
        按 IPC-2221 估算（I = 0.048·ΔT^0.44·A^0.725，外层）。系数为经验拟合，工程取值请以板厂工艺表或 IPC-2152 复核。
      </p>
    </div>
  );
}
