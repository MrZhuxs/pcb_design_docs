'use client';

import type * as React from 'react';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { cn } from '@/lib/cn';

/** shadcn/ui Tabs（Base UI 版） */
export function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col gap-2', className)}
      {...props}
    />
  );
}

export function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'relative inline-flex h-9 w-fit items-center justify-center rounded-lg bg-fd-muted p-[3px] text-fd-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        'relative z-10 inline-flex h-full flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium outline-none transition-colors hover:text-fd-foreground focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 data-[active]:text-fd-foreground',
        className,
      )}
      {...props}
    />
  );
}

/** 跟随激活标签滑动的底块 */
export function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
  return (
    <TabsPrimitive.Indicator
      data-slot="tabs-indicator"
      className={cn(
        'absolute left-[var(--active-tab-left)] top-[3px] z-0 h-[calc(100%-6px)] w-[var(--active-tab-width)] rounded-md bg-fd-background shadow-sm transition-all duration-200 ease-out',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn('flex-1 outline-none', className)}
      {...props}
    />
  );
}
