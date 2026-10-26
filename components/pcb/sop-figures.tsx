import styles from '../pcb/pcb-figures.module.css';
import { FigureShell, Pointer } from '../pcb/pcb-figures';

/**
 * 「从设计到打样」章节的插图，与 PCB 章节共用同一套 2D 制图语言。
 */

/** 图 1：从需求到量产的 SOP 流程 */
export function DesignSop() {
  const steps: { n: string; title: string; hint: string; optional?: boolean }[] = [
    { n: '1', title: '需求与规格', hint: '功能框图\n电压 / 电流 / 尺寸' },
    { n: '2', title: '原理图', hint: '符号 + 连线\n决定电气关系' },
    { n: '3', title: 'PCB 设计', hint: '选型 / 外形\n布局 / 布线 / 丝印' },
    { n: '4', title: '检查与出图', hint: 'DRC / DFM\nGerber + BOM' },
    { n: '5', title: '打样', hint: '小批量试产\n验证设计与工艺' },
    { n: '6', title: 'SMT 贴片', hint: '可选服务\n额外收费', optional: true },
    { n: '7', title: '功能验证', hint: '分模块通电\n封闭测试' },
  ];

  const BOX_W = 108;
  const GAP = 14;
  const x0 = 20;
  const yTop = 96;
  const boxH = 62;

  return (
    <FigureShell
      no="FIG · 01"
      title="一块板从设计到打样的标准流程"
      meta="SOP · 7 个环节"
      plain
      legend={[
        { swatch: 'copper', label: '设计环节', hint: '在 EDA 里完成，改一次只花时间' },
        { swatch: 'mask', label: '制造环节', hint: '交给板厂 / 贴片厂，改一次要花钱' },
        { swatch: 'solder', label: '可选环节', hint: 'SMT 贴片由板厂代做，按点数收费' },
      ]}
      caption="这七步是顺序的：前一步的输出就是后一步的输入。真正费钱的边界在第 4 步之后——前面改一次只是改文件，后面改一次就是重新开料、重新打样。"
      note="小批量打样时，把 SMT 贴片一起下单能省掉手工焊接的时间；但样板阶段建议先只打裸板，自己焊一遍，这样工艺问题与设计问题才分得清。"
    >
      <svg viewBox="0 0 880 240" role="img" aria-labelledby="sop-flow-title" className={styles.svg}>
        <title id="sop-flow-title">PCB 从设计到打样的七步流程：需求与规格、原理图、PCB 设计、检查与出图、打样、SMT 贴片（可选）、功能验证</title>
        <defs>
          <marker id="sop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--pcb-ink-dim)" />
          </marker>
        </defs>

        {steps.map((step, i) => {
          const x = x0 + i * (BOX_W + GAP);
          const isBuild = i >= 4 && i !== 5;
          const isOptional = step.optional === true;
          return (
            <g key={step.n}>
              <rect
                x={x}
                y={yTop}
                width={BOX_W}
                height={boxH}
                rx={8}
                fill={
                  isOptional
                    ? 'color-mix(in oklab, var(--pcb-solder) 34%, transparent)'
                    : isBuild
                      ? 'color-mix(in oklab, var(--pcb-mask) 22%, transparent)'
                      : 'color-mix(in oklab, var(--pcb-copper) 18%, transparent)'
                }
                stroke={isOptional ? 'var(--pcb-solder)' : 'var(--pcb-ink-dim)'}
                strokeWidth={isOptional ? 1.2 : 1}
                strokeDasharray={isOptional ? '5 4' : undefined}
              />
              <circle cx={x + 16} cy={yTop + 16} r={9} fill="var(--color-fd-foreground)" />
              <text x={x + 16} y={yTop + 19.6} textAnchor="middle" fill="var(--color-fd-background)" className={styles.badgeText}>
                {step.n}
              </text>
              <text x={x + BOX_W / 2} y={yTop + 38} textAnchor="middle" className={styles.annoLabel}>
                {step.title}
              </text>
              {step.hint.split('\n').map((line, li) => (
                <text
                  key={`${step.n}-h-${li}`}
                  x={x + BOX_W / 2}
                  y={yTop + boxH + 20 + li * 15}
                  textAnchor="middle"
                  className={styles.annoLabelDim}
                >
                  {line}
                </text>
              ))}
              {isOptional && (
                <text x={x + BOX_W / 2} y={yTop - 10} textAnchor="middle" className={styles.dimText}>
                  可选
                </text>
              )}
              {i < steps.length - 1 && (
                <line
                  x1={x + BOX_W + 2}
                  y1={yTop + boxH / 2}
                  x2={x + BOX_W + GAP - 3}
                  y2={yTop + boxH / 2}
                  stroke="var(--pcb-ink-dim)"
                  strokeWidth={1.2}
                  markerEnd="url(#sop-arrow)"
                />
              )}
            </g>
          );
        })}

        {/* 费钱边界 */}
        <line x1={x0 + 4 * (BOX_W + GAP) - 7} y1={yTop - 26} x2={x0 + 4 * (BOX_W + GAP) - 7} y2={yTop + boxH + 52} stroke="var(--pcb-ink-dim)" strokeWidth={1} strokeDasharray="5 4" />
        <text x={x0 + 4 * (BOX_W + GAP) - 12} y={yTop - 30} textAnchor="end" className={styles.dimText}>
          这之后每改一次都要花钱
        </text>
      </svg>
    </FigureShell>
  );
}

/** 图 2：一小段原理图示例（符号 + 连线 + 网络标签） */
export function SchematicExcerpt() {
  return (
    <FigureShell
      no="FIG · 02"
      title="原理图长什么样（示例：MCU 的一个 LED 指示灯）"
      meta="符号 + 连线 · 与物理尺寸无关"
      plain
      legend={[
        { n: 1, label: '元件符号', hint: '只表达功能，不表达尺寸与外形' },
        { n: 2, label: '连线（wire）', hint: '表示电气相连，怎么拐弯都不影响电气' },
        { n: 3, label: '参数与位号', hint: 'R1 / 1 kΩ：后面 BOM 与贴片就靠它' },
        { n: 4, label: '电源 / 地符号', hint: '全局网络：所有 GND 默认连在一起' },
      ]}
      caption="原理图描述的是「谁和谁在电气上相连」，不描述「摆在哪儿、长什么样」。同一个网络可以画成一条长线，也可以两头各放一个同名网络标签——在 EDA 里它们电气等价。"
    >
      <svg viewBox="0 0 880 320" role="img" aria-labelledby="sch-title" className={styles.svg}>
        <title id="sch-title">原理图示例：MCU 的 GPIO 经限流电阻驱动 LED 到地，3V3 经去耦电容到地，含网络标签与地符号</title>

        {/* ---- MCU 块 ---- */}
        <rect x={70} y={104} width={150} height={120} rx={3} fill="color-mix(in oklab, var(--pcb-component) 22%, transparent)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
        <text x={145} y={96} textAnchor="middle" className={styles.annoLabel}>
          U1  MCU
        </text>
        {[
          { y: 134, name: 'GPIO' },
          { y: 174, name: '3V3' },
          { y: 204, name: 'GND' },
        ].map((pin) => (
          <g key={pin.name}>
            <line x1={220} y1={pin.y} x2={244} y2={pin.y} stroke="var(--pcb-ink)" strokeWidth={1.4} />
            <text x={214} y={pin.y - 5} textAnchor="end" className={styles.dimText}>
              {pin.name}
            </text>
          </g>
        ))}

        {/* ---- GPIO → R1 → LED → GND ---- */}
        <g stroke="var(--pcb-wire)" strokeWidth={1.8} fill="none">
          <line x1={244} y1={134} x2={300} y2={134} />
          <line x1={360} y1={134} x2={430} y2={134} />
          <line x1={500} y1={134} x2={560} y2={134} />
          <line x1={560} y1={134} x2={560} y2={196} />
          <line x1={560} y1={196} x2={560} y2={196} />
        </g>
        {/* R1：矩形符号（IEC） */}
        <rect x={300} y={122} width={60} height={24} fill="var(--color-fd-background)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
        <text x={330} y={112} textAnchor="middle" className={styles.annoLabel}>
          R1
        </text>
        <text x={330} y={162} textAnchor="middle" className={styles.dimText}>
          1 kΩ
        </text>

        {/* LED：三角形 + 竖线 + 两个出射箭头 */}
        <g>
          <path d="M 430 120 L 430 148 L 460 134 Z" fill="var(--color-fd-background)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
          <line x1={460} y1={120} x2={460} y2={148} stroke="var(--pcb-ink)" strokeWidth={1.8} />
          <line x1={470} y1={134} x2={500} y2={134} stroke="var(--pcb-wire)" strokeWidth={1.8} />
          <g stroke="var(--pcb-ink)" strokeWidth={1.1} fill="none">
            <line x1={444} y1={114} x2={456} y2={102} />
            <polyline points="450,103 456,102 455,108" />
            <line x1={456} y1={120} x2={468} y2={108} />
            <polyline points="462,109 468,108 467,114" />
          </g>
          <text x={444} y={162} textAnchor="middle" className={styles.annoLabel}>
            D1
          </text>
          <text x={444} y={178} textAnchor="middle" className={styles.dimText}>
            LED
          </text>
        </g>

        {/* GND 符号（LED 侧） */}
        <g stroke="var(--pcb-ink)" strokeWidth={1.6} fill="none">
          <line x1={560} y1={196} x2={560} y2={206} />
          <line x1={544} y1={206} x2={576} y2={206} />
          <line x1={550} y1={212} x2={570} y2={212} />
          <line x1={555} y1={218} x2={565} y2={218} />
        </g>

        {/* ---- 3V3 网络标签 ---- */}
        <g>
          <line x1={244} y1={174} x2={300} y2={174} stroke="var(--pcb-wire)" strokeWidth={1.8} />
          <line x1={300} y1={174} x2={330} y2={174} stroke="var(--pcb-wire)" strokeWidth={1.8} />
          <path d="M 300 166 L 340 166 L 348 174 L 340 182 L 300 182 Z" fill="color-mix(in oklab, var(--pcb-copper) 26%, transparent)" stroke="var(--pcb-ink)" strokeWidth={1.2} />
          <text x={306} y={178} className={styles.dimText}>
            3V3
          </text>
          {/* 去耦电容：极板 */}
          <g>
            <line x1={330} y1={174} x2={330} y2={214} stroke="var(--pcb-wire)" strokeWidth={1.8} />
            <line x1={316} y1={214} x2={344} y2={214} stroke="var(--pcb-ink)" strokeWidth={2} />
            <line x1={316} y1={222} x2={344} y2={222} stroke="var(--pcb-ink)" strokeWidth={2} />
            <line x1={330} y1={222} x2={330} y2={244} stroke="var(--pcb-wire)" strokeWidth={1.8} />
            <text x={352} y={214} className={styles.annoLabel}>
              C1
            </text>
            <text x={352} y={230} className={styles.dimText}>
              100 nF
            </text>
            {/* 地符号 */}
            <g stroke="var(--pcb-ink)" strokeWidth={1.6} fill="none">
              <line x1={314} y1={244} x2={346} y2={244} />
              <line x1={320} y1={250} x2={340} y2={250} />
              <line x1={325} y1={256} x2={335} y2={256} />
            </g>
          </g>
        </g>

        {/* ---- MCU 的 GND 引脚 ---- */}
        <g stroke="var(--pcb-wire)" strokeWidth={1.8} fill="none">
          <line x1={244} y1={204} x2={268} y2={204} />
          <line x1={268} y1={204} x2={268} y2={244} />
        </g>
        <g stroke="var(--pcb-ink)" strokeWidth={1.6} fill="none">
          <line x1={252} y1={244} x2={284} y2={244} />
          <line x1={258} y1={250} x2={278} y2={250} />
          <line x1={263} y1={256} x2={273} y2={256} />
        </g>

        {/* ---- 标注 ---- */}
        <Pointer from={[120, 268]} to={[330, 124]} label="① 元件符号" sub="只表达功能" align="start" />
        <Pointer from={[420, 268]} to={[470, 134]} label="② 连线" sub="电气相连" align="start" />
        <Pointer from={[560, 84]} to={[330, 116]} label="③ 位号与参数" sub="进 BOM" align="end" />
        <Pointer from={[700, 268]} to={[560, 210]} label="④ 地符号" sub="全局网络 GND" align="start" />
      </svg>
    </FigureShell>
  );
}
