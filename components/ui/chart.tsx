'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/cn';

const THEMES = { light: '', dark: '.dark' } as const;

type ChartConfigItem = {
  label?: React.ReactNode;
  icon?: React.ComponentType;
  color?: string;
  theme?: Record<keyof typeof THEMES, string>;
};

export type ChartConfig = Record<string, ChartConfigItem>;

type ChartContextValue = { config: ChartConfig };
const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) throw new Error('useChart must be used within a <ChartContainer />');
  return context;
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme || item.color);
  if (colorConfig.length === 0) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(([theme, prefix]) => {
            const rules = colorConfig
              .map(([key, item]) => {
                const color = item.theme?.[theme as keyof typeof THEMES] ?? item.color;
                return color ? `  --color-${key}: ${color};` : '';
              })
              .filter(Boolean)
              .join('\n');
            return `${prefix} [data-chart="${id}"] {\n${rules}\n}`;
          })
          .join('\n'),
      }}
    />
  );
}

export function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & { config: ChartConfig; id?: string }) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        data-slot="chart"
        className={cn(
          'flex aspect-video min-h-[220px] w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-fd-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-fd-border/60 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-fd-border [&_.recharts-dot[stroke="#fff"]]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke="#ccc"]]:stroke-fd-border [&_.recharts-radial-bar-background-sector]:fill-fd-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-fd-muted [&_.recharts-reference-line_[stroke="#ccc"]]:stroke-fd-border [&_.recharts-sector[stroke="#fff"]]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none',
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = RechartsPrimitive.Tooltip;
export const ChartLegend = RechartsPrimitive.Legend;

/** 提示框里一项数据的最小形状（recharts v3 的 hook 类型不再暴露 payload） */
type TooltipItem = {
  name?: string | number;
  dataKey?: string | number;
  value?: unknown;
  color?: string;
  payload?: unknown;
};

type ChartTooltipContentProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  active?: boolean;
  payload?: TooltipItem[];
  label?: React.ReactNode;
  labelFormatter?: (value: unknown, payload: unknown[]) => React.ReactNode;
  formatter?: (value: unknown, name: unknown, item: unknown, index: number, payload: unknown) => React.ReactNode;
  color?: string;
  indicator?: 'line' | 'dot' | 'dashed';
  hideLabel?: boolean;
  hideIndicator?: boolean;
  nameKey?: string;
  labelKey?: string;
};

export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart();
  const tooltipLabel = labelFormatter
    ? labelFormatter(label, payload as unknown[])
    : label;

  if (!active || !payload?.length) return null;

  return (
    <div className={cn('grid min-w-[9rem] gap-1.5 rounded-lg border border-fd-border bg-fd-popover px-3 py-2 text-xs text-fd-popover-foreground shadow-xl', className)}>
      {!hideLabel && <div className="font-medium">{tooltipLabel}</div>}
      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`;
          const itemConfig = config[key];
          const itemColor = color ?? item.color ?? itemConfig?.color;
          const value = item.value;
          const formatted = (formatter?.(value, item.name, item, index, item.payload) ?? value) as React.ReactNode;

          return (
            <div key={`${item.dataKey ?? item.name ?? 'value'}-${index}`} className="flex w-full items-center gap-2">
              {!hideIndicator && (
                <span
                  className={cn(
                    'shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]',
                    indicator === 'line' && 'h-2.5 w-1',
                    indicator === 'dot' && 'size-2 rounded-full',
                    indicator === 'dashed' && 'w-3 border-[1.5px] border-dashed bg-transparent',
                  )}
                  style={{
                    '--color-bg': itemColor,
                    '--color-border': itemColor,
                  } as React.CSSProperties}
                />
              )}
              <span className="flex-1 text-fd-muted-foreground">{itemConfig?.label ?? item.name}</span>
              <span className="font-mono font-medium tabular-nums text-fd-foreground">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegendContent({
  className,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: React.ComponentProps<'div'> & {
  payload?: TooltipItem[];
  verticalAlign?: 'top' | 'bottom' | 'middle';
  nameKey?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn('flex items-center justify-center gap-4 pt-3', verticalAlign === 'top' && 'pb-3 pt-0', className)}>
      {payload.map((item) => {
        const key = `${nameKey ?? item.dataKey ?? item.value ?? 'value'}`;
        const itemConfig = config[key];
        return (
          <div key={key} className="flex items-center gap-1.5 text-xs text-fd-muted-foreground">
            <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
            {itemConfig?.label ?? (item.value as React.ReactNode)}
          </div>
        );
      })}
    </div>
  );
}
