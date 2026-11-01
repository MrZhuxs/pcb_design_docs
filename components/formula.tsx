import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 公式 / 算例框。
 *
 * 正文里夹着的单条公式、两三种写法、一个代入算例，用 ```text 代码块排出来
 * 会显得很"命令行"，和其余插图不是一套语言。这里给它们一个统一的容器：
 * 等宽公式在左，解释/单位在右，带细分隔线与可选表底注。
 *
 * 约定：不需要编号、不需要图注的东西才用 Formula；
 * 需要被反复回看、需要图号与图注的，用 RecapSheet（速查表）或专用插图。
 *
 * 用法：
 *   <Formula title="电流的定义" note="1 A = 1 C/s">
 *     <FormulaRow k="I = dQ/dt" note="单位：A" />
 *   </Formula>
 */

export function Formula({
  title,
  note,
  children,
  className,
}: {
  title?: ReactNode;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'my-4 overflow-hidden rounded-lg border border-fd-border bg-fd-card/40',
        className,
      )}
    >
      {title && (
        <p className="flex items-center gap-1.5 border-b border-fd-border/70 bg-fd-muted/25 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-fd-muted-foreground">
          <span aria-hidden className="inline-block size-1.5 rounded-full bg-fd-primary/60" />
          {title}
        </p>
      )}
      <div className="divide-y divide-fd-border/40">{children}</div>
      {note && (
        <p className="border-t border-fd-border/60 bg-fd-muted/15 px-3.5 py-2 text-[11.5px] leading-relaxed text-fd-muted-foreground">
          {note}
        </p>
      )}
    </div>
  );
}

/** 公式框里的一行：左侧等宽公式，右侧解释 / 取值 / 单位 */
export function FormulaRow({
  k,
  note,
  children,
}: {
  k: ReactNode;
  note?: ReactNode;
  children?: ReactNode;
}) {
  const side = note ?? children;
  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-baseline gap-x-4 gap-y-0.5 px-3.5 py-2 max-sm:grid-cols-1">
      <span className="font-mono text-[13px] font-semibold leading-relaxed text-fd-foreground">
        {k}
      </span>
      {side && (
        <span className="text-[11.5px] leading-relaxed text-fd-muted-foreground max-sm:mt-0.5">
          {side}
        </span>
      )}
    </div>
  );
}

/** 公式框里的"结果"行：一行跨满，用来放代入后的数值结论 */
export function FormulaResult({
  k,
  children,
}: {
  k?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-3.5 py-2">
      {k && <span className="font-mono text-[12px] text-fd-muted-foreground">{k}</span>}
      <span className="font-mono text-[12.5px] font-semibold text-fd-primary">{children}</span>
    </div>
  );
}
