'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * 微带线特性阻抗估算（IPC-2141 经验公式）：
 * Z0 = 87 / sqrt(εr + 1.41) · ln(5.98h / (0.8w + t))
 * 适用范围约 0.1 < w/h < 2.0，仅作教学演示。
 */
function microstrip(w: number, h: number, er: number, t = 1.4) {
  return (87 / Math.sqrt(er + 1.41)) * Math.log((5.98 * h) / (0.8 * w + t));
}

const PARAMS = [
  { key: 'w', label: '线宽 W', unit: 'mil', min: 3, max: 15, step: 0.5 },
  { key: 'h', label: '介质厚度 H', unit: 'mil', min: 2, max: 12, step: 0.5 },
  { key: 'er', label: '介电常数 εr', unit: '', min: 3, max: 4.8, step: 0.05 },
] as const;

type Key = (typeof PARAMS)[number]['key'];

export function Impedance() {
  const [v, setV] = useState<Record<Key, number>>({ w: 5, h: 3.5, er: 4.2 });
  const z = microstrip(v.w, v.h, v.er);
  const diff = z - 50;
  const ok = Math.abs(diff) <= 5;

  // 截面示意：线宽、介质厚度随参数缩放
  const traceW = 20 + v.w * 9;
  const dielH = 10 + v.h * 6;

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
      <div className="space-y-6">
        {PARAMS.map((p) => (
          <div key={p.key} className="space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-fd-muted-foreground">{p.label}</span>
              <span className="font-mono tabular-nums">
                {v[p.key].toFixed(p.key === 'er' ? 2 : 1)}
                {p.unit && <span className="ml-1 text-fd-muted-foreground">{p.unit}</span>}
              </span>
            </div>
            <Slider
              aria-label={p.label}
              min={p.min}
              max={p.max}
              step={p.step}
              value={v[p.key]}
              onValueChange={(n) => setV((s) => ({ ...s, [p.key]: n as number }))}
            />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-fd-border bg-fd-background p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-fd-muted-foreground">Z₀ · MICROSTRIP</p>
            <p className="mt-1 font-mono text-5xl font-semibold tracking-tighter tabular-nums">
              {z.toFixed(1)}
              <span className="ml-1 text-2xl text-fd-muted-foreground">Ω</span>
            </p>
          </div>
          <Badge variant={ok ? 'default' : 'outline'} className={ok ? '' : 'border-amber-500/50 text-amber-600 dark:text-amber-400'}>
            {ok ? '50 Ω ±10% 通过' : `偏离 ${diff > 0 ? '+' : ''}${diff.toFixed(1)} Ω`}
          </Badge>
        </div>

        <Separator className="my-6" />

        {/* 截面图：走线 / 介质 / 参考平面 */}
        <svg viewBox="0 0 320 140" className="w-full" role="img" aria-label="微带线截面示意">
          <rect x="0" y={120 - dielH} width="320" height={dielH} className="fill-fd-muted" />
          <rect x="0" y="120" width="320" height="10" rx="1" fill="#0a72ef" fillOpacity="0.85" />
          <rect
            x={160 - traceW / 2}
            y={120 - dielH - 9}
            width={traceW}
            height="9"
            rx="1"
            className="fill-fd-foreground transition-all duration-150"
          />
          {/* 电场线示意 */}
          {[-1, -0.5, 0, 0.5, 1].map((k) => (
            <path
              key={k}
              d={`M${160 + (k * traceW) / 2} ${120 - dielH} Q ${160 + k * (traceW / 2 + 22)} ${120 - dielH / 2} ${160 + k * (traceW / 2 + 34)} 120`}
              fill="none"
              stroke="#8b5cf6"
              strokeOpacity="0.5"
              strokeDasharray="3 3"
            />
          ))}
          <text x="6" y={116 - dielH / 2 + 8} className="fill-fd-muted-foreground font-mono" fontSize="10">
            FR-4 εr {v.er.toFixed(2)}
          </text>
          <text x="6" y="139" className="fill-fd-muted-foreground font-mono" fontSize="9">
            GND
          </text>
        </svg>
      </div>
    </div>
  );
}
