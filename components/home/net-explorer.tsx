'use client';

import { useState } from 'react';
import { Board, NET_META, type NetSelection } from './board';
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const OPTIONS: { value: NetSelection; label: string }[] = [
  { value: 'all', label: '全部网络' },
  { value: 'ddr', label: NET_META.ddr.label },
  { value: 'pcie', label: NET_META.pcie.label },
  { value: 'io', label: NET_META.io.label },
];

/** 主视觉：可按网络类别高亮的 PCB 板 */
export function NetExplorer() {
  const [active, setActive] = useState<NetSelection>('all');
  const [pulse, setPulse] = useState(true);
  const meta = active === 'all' ? null : NET_META[active];

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-background shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.25)]">
      {/* 工具栏：模仿 EDA 窗口标题栏 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-fd-foreground/15" />
          <span className="size-2.5 rounded-full bg-fd-foreground/15" />
          <span className="size-2.5 rounded-full bg-fd-foreground/15" />
          <span className="ml-2 font-mono text-xs text-fd-muted-foreground">mini-pc.brd</span>
        </div>
        <Tabs value={active} onValueChange={(v) => setActive(v as NetSelection)}>
          <TabsList>
            {OPTIONS.map((o) => (
              <TabsTrigger key={o.value} value={o.value} className="px-2.5 text-xs">
                {o.value !== 'all' && (
                  <span className="size-1.5 rounded-full" style={{ background: NET_META[o.value].color }} />
                )}
                {o.label}
              </TabsTrigger>
            ))}
            <TabsIndicator />
          </TabsList>
        </Tabs>
        <label className="flex items-center gap-2 text-xs text-fd-muted-foreground">
          <Switch checked={pulse} onCheckedChange={setPulse} aria-label="信号脉冲动画" />
          信号脉冲
        </label>
      </div>

      <Board id="hero" active={active} animate={pulse} intro className="block w-full" />

      {/* 状态栏 */}
      <div className="flex items-center justify-between gap-4 border-t border-fd-border px-4 py-2.5 font-mono text-[11px] text-fd-muted-foreground">
        <span className="truncate" aria-live="polite">
          {meta ? `${meta.label} — ${meta.spec}` : '32 条高速网络 · 6 层 · DRC 0 错误'}
        </span>
        <span className="hidden shrink-0 sm:inline">GRID 20 mil · UNITS mm</span>
      </div>
    </div>
  );
}
