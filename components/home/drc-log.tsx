import type * as React from 'react';
import { cn } from '@/lib/cn';
import styles from './home.module.css';

/** 仿 EDA 的 DRC / SI 检查日志，逐行出现 */
const lines: { text: string; tone: 'muted' | 'ok' | 'warn' | 'cmd' }[] = [
  { text: '$ pcb check --board mini-pc.brd --rules hs', tone: 'cmd' },
  { text: '› 载入叠层：6 层 · 1.6 mm · FR-4 / Megtron 6', tone: 'muted' },
  { text: '✓ 单端阻抗 50 Ω ±10%          通过', tone: 'ok' },
  { text: '✓ 差分阻抗 90 Ω（USB 3.1）     通过', tone: 'ok' },
  { text: '✓ 差分阻抗 100 Ω（PCIe 4.0）   通过', tone: 'ok' },
  { text: '✓ LPDDR4X 字节组等长 ±5 mil    通过', tone: 'ok' },
  { text: '! HDMI 2.1 TX2 跨分割 1 处     警告', tone: 'warn' },
  { text: '✓ 回流过孔间距 < λ/20          通过', tone: 'ok' },
  { text: '› 0 错误 · 1 警告 · 耗时 2.84 s', tone: 'muted' },
];

const toneClass = {
  muted: 'text-zinc-400',
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
  cmd: 'text-zinc-100',
};

export function DrcLog({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-fd-border bg-zinc-950 shadow-2xl',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-500/80" />
        <span className="size-2.5 rounded-full bg-amber-500/80" />
        <span className="size-2.5 rounded-full bg-emerald-500/80" />
        <span className="ml-3 font-mono text-[11px] text-zinc-500">signal-integrity.log</span>
      </div>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[12px] leading-6">
        {lines.map((l, i) => (
          <div
            key={i}
            className={cn(styles.lineIn, toneClass[l.tone])}
            style={{ '--delay': `${0.3 + i * 0.35}s` } as React.CSSProperties}
          >
            {l.text}
          </div>
        ))}
      </pre>
    </div>
  );
}
