'use client';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

const words = [
  '阻抗控制',
  '差分对',
  '回流路径',
  '串扰',
  '叠层设计',
  '去耦电容',
  'PDN 目标阻抗',
  '等长绕线',
  '过孔残桩',
  '趋肤效应',
  '介质损耗',
  '眼图',
  'S 参数',
  'EMC',
  'LPDDR4X',
  'PCIe 4.0',
  'HDMI 2.1',
  'USB 3.1',
];

/** 高速设计关键词跑马灯 */
export function Marquee() {
  return (
    <section className="relative mx-auto max-w-6xl border-x border-fd-border bg-fd-background/50 py-6">
      <div className="pointer-events-none absolute left-1/2 top-0 w-screen -translate-x-1/2 border-t border-fd-border" />

      <InfiniteSlider gap={12} reverse speed={60} speedOnHover={20}>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
          >
            {word}
          </span>
        ))}
      </InfiniteSlider>

      <ProgressiveBlur
        blurIntensity={1.5}
        className="pointer-events-none absolute left-0 top-0 h-full w-40"
        direction="left"
      />
      <ProgressiveBlur
        blurIntensity={1.5}
        className="pointer-events-none absolute right-0 top-0 h-full w-40"
        direction="right"
      />

      <div className="pointer-events-none absolute left-1/2 bottom-0 w-screen -translate-x-1/2 border-b border-fd-border" />
    </section>
  );
}
