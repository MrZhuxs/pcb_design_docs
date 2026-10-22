'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import styles from './ac-dc-comparison.module.css';

const AC_COLOR = 'var(--ac-color)';
const DC_COLOR = 'var(--dc-color)';

const acConfig = {
  voltage: { label: '交流瞬时电压', color: AC_COLOR },
} satisfies ChartConfig;

const dcConfig = {
  voltage: { label: '直流电压', color: DC_COLOR },
} satisfies ChartConfig;

const acData = Array.from({ length: 241 }, (_, index) => {
  const timeMs = (index / 240) * 60;
  const voltage = 311 * Math.sin((2 * Math.PI * 50 * timeMs) / 1000);
  return { timeMs, voltage: Number(voltage.toFixed(2)) };
});

const dcData = Array.from({ length: 61 }, (_, index) => ({
  timeMs: index,
  voltage: 5,
}));

const timeFormatter = (value: number) => `${Number(value).toFixed(0)} ms`;
const voltageFormatter = (value: number) => `${Number(value).toFixed(0)} V`;

function AcWaveChart() {
  const periodTicks = useMemo(() => [0, 20, 40, 60], []);
  return (
    <ChartContainer
      config={acConfig}
      id="ac-waveform"
      aria-label="交流正弦电压波形图，220伏有效值、50赫兹，峰值约311伏"
      className="aspect-[1.9/1] min-h-[205px] w-full"
    >
      <LineChart
        data={acData}
        margin={{ top: 20, right: 16, bottom: 4, left: 4 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis
          dataKey="timeMs"
          type="number"
          domain={[0, 60]}
          ticks={periodTicks}
          tickFormatter={timeFormatter}
          tickLine={false}
          axisLine={false}
          tickMargin={9}
          minTickGap={16}
        />
        <YAxis
          type="number"
          domain={[-360, 360]}
          ticks={[-311, 0, 311]}
          tickFormatter={(value) => `${value}V`}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <ReferenceLine y={0} stroke="var(--color-fd-foreground)" strokeOpacity={0.35} />
        <ReferenceLine y={311} stroke={AC_COLOR} strokeOpacity={0.22} strokeDasharray="4 4" />
        <ReferenceLine y={-311} stroke={AC_COLOR} strokeOpacity={0.22} strokeDasharray="4 4" />
        <ChartTooltip
          cursor={{ stroke: 'var(--color-fd-muted-foreground)', strokeDasharray: '4 4', strokeOpacity: 0.45 }}
          content={<ChartTooltipContent formatter={(value) => voltageFormatter(Number(value))} />}
        />
        <Line
          dataKey="voltage"
          name="voltage"
          type="monotone"
          stroke={AC_COLOR}
          strokeWidth={2.75}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, fill: 'var(--color-fd-card)' }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function DcWaveChart() {
  return (
    <ChartContainer
      config={dcConfig}
      id="dc-waveform"
      aria-label="直流电压波形图，5伏直流，随时间保持恒定"
      className="aspect-[1.9/1] min-h-[205px] w-full"
    >
      <LineChart
        data={dcData}
        margin={{ top: 20, right: 16, bottom: 4, left: 4 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} strokeDasharray="3 5" />
        <XAxis
          dataKey="timeMs"
          type="number"
          domain={[0, 60]}
          ticks={[0, 20, 40, 60]}
          tickFormatter={timeFormatter}
          tickLine={false}
          axisLine={false}
          tickMargin={9}
          minTickGap={16}
        />
        <YAxis
          type="number"
          domain={[0, 10]}
          ticks={[0, 5, 10]}
          tickFormatter={(value) => `${value}V`}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <ReferenceLine y={0} stroke="var(--color-fd-foreground)" strokeOpacity={0.35} />
        <ChartTooltip
          cursor={{ stroke: 'var(--color-fd-muted-foreground)', strokeDasharray: '4 4', strokeOpacity: 0.45 }}
          content={<ChartTooltipContent formatter={(value) => voltageFormatter(Number(value))} />}
        />
        <Line
          dataKey="voltage"
          name="voltage"
          type="linear"
          stroke={DC_COLOR}
          strokeWidth={2.75}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 2, fill: 'var(--color-fd-card)' }}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export function AcDcComparison() {
  return (
    <div className={`${styles.comparison} my-6 grid grid-cols-1 gap-4 md:grid-cols-2`}>
      <Card className={`${styles.card} [--card-accent:var(--ac-color)] gap-0 overflow-hidden py-0`}>
        <CardHeader className={`${styles.cardHeader} px-5 py-4`}>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-[var(--ac-color)]" />
            <CardTitle className="text-base text-fd-foreground">交流电 AC</CardTitle>
            <span className="ml-auto rounded-2xl border border-fd-border px-2 py-0 font-mono text-[10px] tracking-wide text-fd-muted-foreground">ALTERNATING</span>
          </div>
          <CardDescription className="mt-1.5 leading-relaxed">方向周期性交替；家用市电常见标称值为 220 V RMS、50 Hz。</CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-4 pt-3 sm:px-5">
          <div className={`${styles.chartSurface} rounded-lg px-1 pt-2`}>
            <AcWaveChart />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs text-fd-muted-foreground">
            <span>正弦波 · 极性周期性反转</span>
            <span className="font-mono tabular-nums">T = 20 ms</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-fd-muted-foreground">标称有效值 220 V；峰值约 +311 V / −311 V。</p>
        </CardContent>
      </Card>

      <Card className={`${styles.card} [--card-accent:var(--dc-color)] gap-0 overflow-hidden py-0`}>
        <CardHeader className={`${styles.cardHeader} px-5 py-4`}>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-[var(--dc-color)]" />
            <CardTitle className="text-base text-fd-foreground">直流电 DC</CardTitle>
            <span className="ml-auto rounded-2xl border border-fd-border px-2 py-0 font-mono text-[10px] tracking-wide text-fd-muted-foreground">DIRECT</span>
          </div>
          <CardDescription className="mt-1.5 leading-relaxed">电流方向保持不变；理想直流的电压大小也恒定。</CardDescription>
        </CardHeader>
        <CardContent className="px-3 pb-4 pt-3 sm:px-5">
          <div className={`${styles.chartSurface} rounded-lg px-1 pt-2`}>
            <DcWaveChart />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 text-xs text-fd-muted-foreground">
            <span>理想直流 · 极性保持不变</span>
            <span className="font-mono tabular-nums">V = 5 V</span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-fd-muted-foreground">示例：电池约 1.5 V，USB 供电通常为 5 V。实际电源可能带有纹波。</p>
        </CardContent>
      </Card>
    </div>
  );
}
