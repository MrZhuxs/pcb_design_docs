import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 时间轴 / 流程轴组件。
 *
 * 用法（MDX 中无需 import，已注册到 components/mdx.tsx）：
 *
 * <Timeline>
 *   <TimelineItem marker="01" title="需求定义">要点内容</TimelineItem>
 *   <TimelineItem marker="02" title="原理图设计">要点内容</TimelineItem>
 * </Timeline>
 *
 * marker 支持任意 ReactNode：数字、短文本、"P1"、图标均可。
 * 末项通过 `:last-child` 自动隐藏连接线。
 */
export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('my-6 flex flex-col', className)} role="list">
      {children}
    </div>
  );
}

export function TimelineItem({
  marker,
  title,
  children,
  className,
}: {
  /** 节点内容，例如阶段序号或短标签 */
  marker?: ReactNode;
  /** 阶段标题 */
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('group/item relative flex gap-4', className)} role="listitem">
      {/* 左侧：节点标记 + 连接线 */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            'z-1 grid size-8 shrink-0 place-items-center rounded-full shadow-sm',
            'border border-fd-border bg-fd-secondary text-[11px] font-semibold tabular-nums',
            'text-fd-secondary-foreground',
          )}
        >
          {marker}
        </span>
        <span
          aria-hidden
          className="w-px flex-1 bg-fd-border group-last/item:hidden"
        />
      </div>

      {/* 右侧：内容卡片 */}
      <div className="min-w-0 flex-1 pb-6 group-last/item:pb-1">
        {title && (
          <p
            className={cn(
              'mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium text-fd-foreground',
            )}
          >
            {title}
          </p>
        )}
        {children && (
          <div className="mt-1.5 text-sm text-fd-muted-foreground prose-no-margin">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
