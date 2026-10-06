import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * 概念图容器。
 *
 * 用法（MDX 中无需 import，已注册到 components/mdx.tsx）：
 *
 * <Figure title="原子结构" caption="示意图，不按比例">
 *   ...任意内容：组件、SVG、表格...
 * </Figure>
 *
 * 设计说明：
 * - 上栏为标题，下栏为图注（尺寸、条件、注释等）
 * - 只做容器与排版，不限定内部内容形态
 */

export function Figure({
  title,
  caption,
  children,
  className,
}: {
  /** 图题 */
  title?: ReactNode;
  /** 图注：尺寸、条件、补充说明 */
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card/40',
        className,
      )}
    >
      {title && (
        <p className="border-b border-fd-border bg-fd-secondary/40 px-4 py-2 text-xs font-medium text-fd-foreground">
          {title}
        </p>
      )}
      <div className="overflow-x-auto p-4 flex justify-center">{children}</div>
      {caption && (
        <p className="border-t border-fd-border px-4 py-2 text-xs leading-relaxed text-fd-muted-foreground">
          {caption}
        </p>
      )}
    </div>
  );
}

/**
 * 「概念 → 有什么用 → 参数/定理」三段式中的第一段容器。
 *
 * 用法：
 *
 * <Concept>
 *   用平实语言说清这个量/现象是什么，不摆数据。
 * </Concept>
 *
 * <WhyItMatters>
 *   它在 PCB / 电路里对应什么现象、决定哪些设计取舍。
 * </WhyItMatters>
 */
export function Concept({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-fd-border bg-fd-background p-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-fd-primary">
        {title ?? '概念'}
      </p>
      <div className="text-sm leading-relaxed text-fd-foreground [&>p]:my-0 [&>p+p]:mt-2">
        {children}
      </div>
    </div>
  );
}

export function WhyItMatters({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-fd-primary/30 bg-fd-primary/5 p-4">
      <p className="mb-2 text-xs font-semibold tracking-wide text-fd-primary">
        {title ?? '有什么用'}
      </p>
      <div className="text-sm leading-relaxed text-fd-foreground [&>p]:my-0 [&>p+p]:mt-2">
        {children}
      </div>
    </div>
  );
}
