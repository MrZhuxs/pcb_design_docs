'use client';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';
import { cn } from '@/lib/cn';

/** shadcn/ui Slider（Base UI 版，单滑块） */
export function Slider({ className, ...props }: SliderPrimitive.Root.Props<number>) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('relative w-full touch-none select-none', className)}
      {...props}
    >
      <SliderPrimitive.Control className="flex h-5 w-full items-center">
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-fd-muted">
          <SliderPrimitive.Indicator className="absolute h-full bg-fd-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={props['aria-label'] as string | undefined}
          className="block size-4 shrink-0 rounded-full border border-fd-primary bg-fd-background shadow-sm outline-none transition-[box-shadow] hover:ring-4 hover:ring-fd-ring/30 focus-visible:ring-4 focus-visible:ring-fd-ring/50"
        />
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
