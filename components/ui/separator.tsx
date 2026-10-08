'use client';

import type * as React from 'react';
import { Separator as SeparatorPrimitive } from '@base-ui/react/separator';
import { cn } from '@/lib/cn';

/** shadcn/ui Separator（Base UI 版） */
export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'shrink-0 bg-fd-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className,
      )}
      {...props}
    />
  );
}
