import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 重点标记组件（用于快速记忆与查找）。
 *
 * 已注册到 components/mdx.tsx，MDX 中直接使用，无需 import。
 *
 * - <Mark>      行内高亮：必须记住的数字、结论、公式结果
 * - <Pitfall>   行内易错标记：⚠ + 内容
 * - <Approx>    适用条件框：近似公式的适用范围与依赖参数
 * - <KeyBox>    重点框：一段里最该带走的那句话 / 那组数
 *
 * 标记约定（两篇笔记开头各有一行说明）：
 *   浅底 = 必记　⚠ = 易错　适用条件框 = 近似与边界　重点框 = 核心结论
 */

/**
 * 行内高亮：必须记住的数字、结论、公式结果。
 *
 * 视觉上用「极浅的中性底色 + 中等字重」，不用饱和色块 —— 因为一篇里会有
 * 十几到二十处，实心色块会把正文切得很碎、看着很吵。
 * 底色取 fd-primary 的 10%，同时避免与链接颜色混淆：只加底、不变字色。
 */
export function Mark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <mark
      className={cn(
        'rounded-[3px] bg-fd-primary/10 px-0.5 font-medium text-fd-foreground',
        '[box-decoration-break:clone]',
        className,
      )}
    >
      {children}
    </mark>
  );
}

/** 行内易错标记 */
export function Pitfall({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('text-fd-error', className)}>
      <span aria-hidden className="mr-0.5 font-semibold">
        ⚠
      </span>
      {children}
    </span>
  );
}

/** 适用条件框：近似公式的适用范围、依赖参数、失效情形 */
export function Approx({
  title = '适用条件',
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
        'my-4 rounded-lg border border-fd-info/30 border-l-4 border-l-fd-info bg-fd-info/5 px-4 py-3',
        className,
      )}
    >
      <p className="mb-1 text-xs font-semibold text-fd-info">{title}</p>
      <div className="text-sm leading-relaxed text-fd-foreground [&>p]:my-0 [&>p+p]:mt-1.5">
        {children}
      </div>
    </div>
  );
}

/** 重点框：一段里最该带走的内容 */
export function KeyBox({
  title = '重点',
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
        'my-4 rounded-lg border border-fd-warning/30 border-l-4 border-l-fd-warning bg-fd-warning/5 px-4 py-3',
        className,
      )}
    >
      <p className="mb-1 text-xs font-semibold text-fd-warning">{title}</p>
      <div className="text-sm leading-relaxed text-fd-foreground [&>p]:my-0 [&>p+p]:mt-1.5">
        {children}
      </div>
    </div>
  );
}
