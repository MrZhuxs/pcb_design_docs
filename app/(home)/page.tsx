import type * as React from 'react';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import { ArrowRight, ArrowUpRight, Atom, BookOpen, CircuitBoard, Cpu, Layers, ListChecks, Minus, Package, ScrollText, Zap } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import styles from '@/components/home/home.module.css';
import { NetExplorer } from '@/components/home/net-explorer';
import { Board } from '@/components/home/board';

import { Stackup } from '@/components/home/stackup';
import { EyeDiagram } from '@/components/home/eye-diagram';
import { Impedance } from '@/components/home/impedance';
import { DrcLog } from '@/components/home/drc-log';
import { Marquee } from '@/components/home/marquee';

const geist = Geist({ subsets: ['latin'] });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

/** Vercel 品牌三段渐变 */


const btnPrimary = cn(
  buttonVariants({ variant: 'primary' }),
  'h-11 gap-2 rounded-full px-6 text-sm hover:bg-fd-primary/85',
);
const btnOutline = cn(
  buttonVariants({ variant: 'outline' }),
  'h-11 gap-2 rounded-full border-fd-border bg-fd-background px-6 text-sm',
);

/** Vercel 式网格交点「+」标记 */
function Cross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('pointer-events-none absolute size-6 text-fd-foreground/40', className)}
    >
      <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

const chapters = [
  { href: '/docs', icon: BookOpen, tag: '序章', title: '如何开始学习 PCB 设计', desc: '学习路线、必备基础、工具选型与工程流程。' },
  { href: '/docs/pcb-design-manufacturing/history', icon: ScrollText, tag: '历史', title: 'PCB 与电路发展史', desc: '从伏打电堆到任意层 HDI，看懂每条规则为什么存在。' },
  { href: '/docs/pcb-design-manufacturing/design-to-sample', icon: ListChecks, tag: '流程', title: '从设计到打样 SOP', desc: 'EDA 选型、原理图、PCB 设计、出图、打样、贴片与验证。' },
  { href: '/docs/pcb-design-manufacturing/structure-and-fabrication', icon: Layers, tag: '工艺', title: 'PCB 的结构与制作工艺', desc: '双面板五要素、九步工艺流程、四层叠层与三类孔。' },
  { href: '/docs/concepts/atom', icon: Atom, tag: '概念', title: '原子、电子与四种力', desc: '从能级、能带到导电性，搞清电流的物理根源。' },
  { href: '/docs/concepts/current', icon: Zap, tag: '概念', title: '电流与回流路径', desc: '位移电流、di/dt、高频效应与板上八种电流。' },
  { href: '/docs/basics/resistor', icon: Minus, tag: '器件', title: '电阻', desc: '规格识读、典型用法与高速场景下的真实行为。' },
  { href: '/docs/pcb-design-manufacturing/packaging', icon: Package, tag: '封装', title: '插件与贴片，以及常见 IC 封装', desc: 'DIP / SOIC / QFP / BGA 的引脚排布与安装方式。' },
  { href: '/docs/schematic-design-spec', icon: CircuitBoard, tag: '规范', title: '原理图设计规范', desc: '电路概念、元件分类与十条设计纪律，画完可逐条自查。' },
  { href: '/docs/capstone-mini-pc', icon: Cpu, tag: '终章', title: '迷你主机主板', desc: '6 层紧凑主板：LPDDR4X、NVMe、HDMI 2.1、USB 3.1。' },
];

const stats = [
  { value: '50 Ω', label: '单端阻抗目标' },
  { value: '±5 mil', label: 'DDR 字节组等长' },
  { value: '16 GT/s', label: 'PCIe 4.0 单通道' },
  { value: 'λ/20', label: '回流过孔间距' },
];

/** 区块标题：编号 + 标题 + 说明 */
function SectionHead({ no, title, desc }: { no: string; title: string; desc: string }) {
  return (
    <div className="max-w-xl">
      <p className="font-mono text-xs tracking-wider text-fd-muted-foreground">{no}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-[2.5rem] sm:leading-[1.1]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-fd-muted-foreground text-pretty">{desc}</p>
    </div>
  );
}

/** 带四角「+」的网格单元 */
function Cell({ className, children, crosses = false }: { className?: string; children: React.ReactNode; crosses?: boolean }) {
  return (
    <div className={cn('relative', className)}>
      {crosses && (
        <>
          <Cross className="-left-3 -top-3" />
          <Cross className="-bottom-3 -right-3" />
        </>
      )}
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <main
      className={cn(
        styles.root,
        geist.className,
        geistMono.variable,
        'relative flex flex-1 flex-col overflow-x-clip antialiased',
      )}
    >
      {/* ---------- Hero ---------- */}
      <section className="relative isolate px-6 pt-20 pb-16 sm:pt-28">
        {/* 背景：淡网格 + 顶部光晕 */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-fd-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fd-border)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(10,114,239,0.18),rgba(139,92,246,0.10),transparent)] blur-2xl" />

        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Link href="/docs/capstone-mini-pc" className="group">
            <Badge variant="outline" className="h-7 gap-2 bg-fd-background/70 px-3 font-normal text-fd-muted-foreground backdrop-blur transition-colors group-hover:text-fd-foreground">
              <span className="size-1.5 rounded-full bg-[#0a72ef]" />
              新章节：迷你主机主板蓝图
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Badge>
          </Link>

          <h1 className="mt-8 space-y-3">
            <div className={cn(
              styles.titleMain,
              "text-5xl font-bold tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem] lg:leading-[1.05]"
            )}>
              构建可靠的硬件
            </div>
            <div className={cn(
              styles.titleSub,
              "text-3xl font-medium tracking-[-0.02em] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]"
            )}>
              让每个信号完美传输
            </div>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground text-balance sm:text-xl">
            从电子在铜箔里的运动，到 16 GT/s 的眼图张开。一份把物理原理、叠层、阻抗与回流路径讲透的高速 PCB 设计笔记。
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/docs" className={btnPrimary}>
              开始阅读
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/docs/concepts/current" className={btnOutline}>
              从电流讲起
            </Link>
          </div>
        </div>

        {/* 主视觉：可交互 PCB */}
        <Cell crosses className="mx-auto mt-16 max-w-6xl sm:mt-20">
          <NetExplorer />
        </Cell>
      </section>

      <Marquee />

      {/* ---------- 数据条 ---------- */}
      <section className="mx-auto grid w-full max-w-6xl grid-cols-2 border-x border-b border-fd-border md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              'px-6 py-10 text-center',
              i % 2 === 1 && 'border-l border-fd-border',
              i === 2 && 'md:border-l',
              i >= 2 && 'border-t border-fd-border md:border-t-0',
            )}
          >
            <div className="font-mono text-3xl font-semibold tracking-tight tabular-nums">{s.value}</div>
            <div className="mt-2 text-sm text-fd-muted-foreground">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ---------- 01 叠层 ---------- */}
      <section className="mx-auto w-full max-w-6xl border-x border-b border-fd-border p-8 sm:p-12">
        <SectionHead no="01 / STACKUP" title="叠层决定一切" desc="悬停查看 14 层 HDI 板的爆炸视图。信号层紧贴参考平面，阻抗才可控，回流才有路。" />
        <div className="mt-10">
          <Stackup />
        </div>
      </section>

      {/* ---------- 02 眼图 ---------- */}
      <section className="mx-auto w-full max-w-6xl border-x border-b border-fd-border p-8 sm:p-12">
        <SectionHead no="02 / SIGNAL INTEGRITY" title="用眼图说话" desc="损耗、反射、串扰与抖动，最终都体现在眼睛张开的程度上。" />
        <div className="grid grid-cols-2 gap-4 py-2">
          <EyeDiagram />
          <DrcLog />
        </div>

      </section>

      {/* ---------- 03 阻抗计算 ---------- */}
      <section className="mx-auto w-full max-w-6xl border-x border-b border-fd-border p-8 sm:p-12">
        <SectionHead no="03 / IMPEDANCE" title="线宽、介质与 50 Ω" desc="拖动参数，实时观察微带线特性阻抗如何随几何尺寸与材料变化。" />
        <div className="mt-10">
          <Impedance />
        </div>
      </section>

      {/* ---------- 04 章节 ---------- */}
      <section className="mx-auto w-full max-w-6xl border-x border-b border-fd-border p-8 sm:p-12">
        <SectionHead no="04 / CHAPTERS" title="从原子到主板" desc="先把物理讲清楚，再把走线画漂亮。按顺序读，或直接跳到你关心的章节。" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <Link key={c.href} href={c.href} className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-fd-ring">
              <Card className="h-full gap-2 transition-colors group-hover:border-fd-foreground/30 group-hover:bg-fd-accent/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg border border-fd-border bg-fd-background">
                      <c.icon className="size-4" />
                    </span>
                    <Badge variant="secondary" className="font-mono font-normal">{c.tag}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-base">{c.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{c.desc}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <ArrowUpRight className="size-4 text-fd-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fd-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative isolate mx-auto w-full max-w-6xl overflow-hidden border-x border-b border-fd-border px-8 py-24 text-center">
        <Board id="cta" animate={false} className="absolute inset-0 -z-10 size-full opacity-40 [mask-image:radial-gradient(ellipse_at_center,transparent_25%,black_80%)]" />
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">准备好布第一块高速板了吗？</h2>
        <p className="mx-auto mt-4 max-w-md text-fd-muted-foreground">从电流与回流路径开始，一步步走到完整的 6 层主板。</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/docs" className={btnPrimary}>
            进入笔记
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/docs/capstone-mini-pc" className={btnOutline}>
            查看蓝图项目
          </Link>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-10">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-3 font-mono text-xs text-fd-muted-foreground sm:flex-row">
          <span>高速PCB设计笔记 · REV A</span>
          <span>MINI-PC MAINBOARD · 6L · 1.6 mm</span>
        </div>
      </footer>
    </main>
  );
}
