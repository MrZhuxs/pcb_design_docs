'use client';

import { Switch as SwitchPrimitive } from '@base-ui/react/switch';
import { cn } from '@/lib/cn';

/** shadcn/ui Switch（Base UI 版） */
export function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-fd-accent shadow-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fd-ring data-[checked]:bg-fd-primary disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-4 translate-x-0.5 rounded-full bg-fd-background shadow-sm ring-0 transition-transform data-[checked]:translate-x-[calc(100%+2px)]" />
    </SwitchPrimitive.Root>
  );
}
