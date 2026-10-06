import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 架构流程图组件（纯 CSS，无第三方依赖）。
 *
 * 用法（MDX 中无需 import，已注册到 components/mdx.tsx）：
 *
 * <FlowChart title="标题">
 *   <FlowNode label="12V 输入" sub="宽压 9–20V" />
 *   <FlowArrow label="可选说明" />
 *   <FlowNode label="RK3588" sub="4×A76 + 4×A55" accent />
 *   <FlowBranches>
 *     <FlowBranch label="LPDDR4X" sub="板载" device="16bit ×2" />
 *     <FlowBranch label="PCIe 3.0" device="M.2 NVMe" />
 *   </FlowBranches>
 * </FlowChart>
 *
 * 设计说明：
 * - 节点为盒子，箭头以竖直连线 + 三角表示
 * - `<FlowBranches>` 为一行分支，顶部画横线 + 每列竖臂，形成 T 型分叉
 * - 所有颜色取自 Fumadocs 主题令牌，自动适配明暗模式
 */

/* ---------------------------------------------------------------- 容器 */

export function FlowChart({
  title,
  children,
  className,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'my-6 flex flex-col items-center rounded-xl border border-fd-border bg-fd-card/40 p-4 sm:p-6',
        className,
      )}
      role="img"
      aria-label={typeof title === 'string' ? title : '系统架构流程图'}
    >
      {title && (
        <p className="mb-4 text-xs font-medium tracking-wide text-fd-muted-foreground">{title}</p>
      )}
      <div className="flex w-full flex-col items-center">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- 节点 */

export function FlowNode({
  label,
  sub,
  accent,
  className,
}: {
  label: ReactNode;
  sub?: ReactNode;
  /** 强调色边框，用于核心器件 */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border px-3 py-2 text-center shadow-sm',
        accent
          ? 'border-fd-primary/40 bg-fd-primary/5 text-fd-foreground'
          : 'border-fd-border bg-fd-secondary text-fd-secondary-foreground',
        className,
      )}
    >
      <span className={cn('text-[13px] leading-tight', accent && 'font-semibold')}>{label}</span>
      {sub && (
        <span className="mt-0.5 text-[10px] leading-tight text-fd-muted-foreground">{sub}</span>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- 箭头 */

export function FlowArrow({ label, className }: { label?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center', className)} aria-hidden>
      <span className="h-4 w-px bg-fd-border" />
      <svg
        className="-mt-px size-3 text-fd-muted-foreground"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 21 4 9h16z" />
      </svg>
      {label && (
        <span className="mt-0.5 text-[10px] text-fd-muted-foreground">{label}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ 分叉结构 */

export function FlowBranches({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full flex-col items-center', className)}>
      {/* 主干引出的一小段竖线 */}
      <span className="h-5 w-px bg-fd-border" aria-hidden />
      {/*
        分支容器用 w-fit + mx-auto 居中；顶部横线由每个分支自绘半段
        （:first-child 只画右半、:last-child 只画左半），
        这样横线永远对准分支中心，与分支数量、列宽、断点无关。
      */}
      <div className="relative mt-4 flex w-fit max-w-full items-start justify-center gap-2">
        {children}
      </div>
    </div>
  );
}

export function FlowBranch({
  label,
  sub,
  device,
  className,
}: {
  /** 分支名称（如接口名） */
  label: ReactNode;
  /** 分支说明 */
  sub?: ReactNode;
  /** 末端器件（画在竖臂下方） */
  device?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative flex w-24 flex-col items-center', className)}>
      {/* 横线左右各半段；-mx-4 抵消 gap-2，使相邻半段首尾相接 */}
      <span
        aria-hidden
        className={cn(
          'absolute -top-4 left-0 -mx-4 h-px w-1/2 bg-fd-border',
          'first:bg-transparent last:bg-fd-border',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute -top-4 right-0 -mx-4 h-px w-1/2 bg-fd-border',
          'first:bg-fd-border last:bg-transparent',
        )}
      />
      {/* 竖臂：向上接到横线 */}
      <span className="h-4 w-px bg-fd-border" aria-hidden />
      <FlowNode label={label} sub={sub} />
      {device && (
        <>
          <FlowArrow />
          <FlowNode label={device} className="w-full border-dashed" />
        </>
      )}
    </div>
  );
}
