import styles from './symbols.module.css';
import { Mark } from '../mark';
import { Badge, FigureShell } from '../pcb/pcb-figures';

/**
 * 附录 · 引脚名解剖。
 *
 * 画法沿用 appendix/symbols.tsx：元件线走 --pcb-ink，符号内部 fill 用
 * --color-fd-background 压住背景；长文字交给 HTML，SVG 里只保留引脚名这类短代号
 * （引脚名本来就是原理图上的最短代号，画在图里比列在表里更直观）。
 */

const INK = 'var(--pcb-ink)';
const BG = 'var(--color-fd-background)';

type PinSpec = { pin: number | string; name: string; bar?: boolean };

/** 左侧引脚：从 pin1 起逆时针，1 在最上 */
const LEFT_PINS: PinSpec[] = [
  { pin: 1, name: 'EN' },
  { pin: 2, name: 'NRST', bar: true },
  { pin: 3, name: 'VDD1' },
  { pin: 4, name: 'VDD2' },
  { pin: 5, name: 'AGND' },
];

/** 右侧引脚：编号接着逆时针往上走，所以 10 在最上 */
const RIGHT_PINS: PinSpec[] = [
  { pin: 10, name: 'SW' },
  { pin: 9, name: 'BOOT' },
  { pin: 8, name: 'FB' },
  { pin: 7, name: 'PGOOD' },
  { pin: 6, name: 'PGND' },
];

const BODY = { x: 200, y: 56, w: 220, h: 236 };
const PIN_Y = [80, 118, 156, 194, 232];
const LEAD = 36;

/** 一组引脚（含引线、引脚号、引脚名，可选的上划线） */
function PinRow({ spec, y, side }: { spec: PinSpec; y: number; side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  const leadX1 = isLeft ? BODY.x - LEAD : BODY.x + BODY.w;
  const leadX2 = isLeft ? BODY.x : BODY.x + BODY.w + LEAD;
  const nameX = isLeft ? BODY.x + 12 : BODY.x + BODY.w - 12;
  const numX = isLeft ? BODY.x - LEAD / 2 : BODY.x + BODY.w + LEAD / 2;
  // 等宽 13px，一个字符约 7.8px，上划线用它估长度
  const barLen = spec.name.length * 7.8;
  const barX1 = isLeft ? nameX : nameX - barLen;

  return (
    <g>
      <line x1={leadX1} y1={y} x2={leadX2} y2={y} stroke={INK} strokeWidth={1.6} fill="none" />
      <text
        x={numX}
        y={y - 5}
        textAnchor="middle"
        className={styles.glyphText}
        style={{ fontSize: 10, opacity: 0.75 }}
      >
        {spec.pin}
      </text>
      <text
        x={nameX}
        y={y + 5}
        textAnchor={isLeft ? 'start' : 'end'}
        className={styles.glyphText}
        style={{ fontSize: 13, fontWeight: 600 }}
      >
        {spec.name}
      </text>
      {spec.bar && (
        <line x1={barX1} y1={y - 8} x2={barX1 + barLen} y2={y - 8} stroke={INK} strokeWidth={1.3} />
      )}
    </g>
  );
}

export function PinNameAnatomy({ no = '附录 · 08' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="一只芯片的引脚名：字母说的都是同一件事——这只脚是干什么的"
      meta="读图 · 引脚名解剖"
      plain
      caption="引脚名不是随便起的缩写，而是「域 + 功能 + 极性 + 序号」的组合。读得懂这四个成分，90% 的芯片不用翻手册也能猜出接线方向。"
      note="图里这颗是虚构的 10 脚芯片，但它身上的每一类标记都真实存在于常见芯片上：EN 使能、NRST 低有效复位、VDD1/VDD2 双电源脚、AGND/PGND 分开的地、SW 与 BOOT 成对、FB 反馈、PGOOD 电源良好指示。"
    >
      <div className={styles.anatomy}>
        <div className={styles.anatomyArt}>
          <svg viewBox="0 0 560 320" role="img" aria-labelledby="pin-title">
            <title id="pin-title">
              引脚名解剖：10 脚芯片左侧为 EN、带低有效上划线的 NRST、VDD1、VDD2、AGND，右侧为 SW、BOOT、FB、PGOOD、PGND，底部虚线框是裸露焊盘 EP，附引脚编号与四组标注
            </title>

            {/* 芯片本体 */}
            <rect
              x={BODY.x}
              y={BODY.y}
              width={BODY.w}
              height={BODY.h}
              rx={4}
              fill={BG}
              stroke={INK}
              strokeWidth={1.8}
            />

            {/* pin1 圆点 */}
            <circle cx={BODY.x + 14} cy={BODY.y + 10} r={2.4} fill={INK} />

            {/* 裸露焊盘 EP */}
            <rect
              x={272}
              y={252}
              width={76}
              height={26}
              rx={3}
              fill="none"
              stroke={INK}
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
            <text x={310} y={269} textAnchor="middle" className={styles.glyphText} style={{ fontSize: 10 }}>
              EP
            </text>

            {/* 引脚 */}
            {LEFT_PINS.map((p, i) => (
              <PinRow key={`l-${p.name}`} spec={p} y={PIN_Y[i]} side="left" />
            ))}
            {RIGHT_PINS.map((p, i) => (
              <PinRow key={`r-${p.name}`} spec={p} y={PIN_Y[i]} side="right" />
            ))}

            <Badge x={140} y={118} n={1} />
            <Badge x={140} y={175} n={2} />
            <Badge x={310} y={240} n={3} />
            <Badge x={480} y={100} n={4} />
          </svg>
        </div>

        <ol className={styles.points}>
          <li>
            <b>上划线 = 低电平有效</b>：NRST 就是「低电平复位」。没有上划线的位置时，还会写成 RST#、RST_N、/RST、RESETB —— 四种写法一个意思。
          </li>
          <li>
            <b>域前缀 + 同名多路</b>：VDD 是总电源，AVDD、DVDD、IOVDD、PVDD 是同一颗芯片里模拟、数字、接口、功率四个域；VDD1、VDD2 则是同一个域的两只脚，<Mark>两只都要接</Mark>。
          </li>
          <li>
            <b>EP / EPAD / PAD 也是引脚</b>：裸露焊盘通常兼做散热与地回流，必须焊到地，并按功率打一排过孔。
          </li>
          <li>
            <b>成对出现的引脚</b>：SW 与 BOOT 之间必有一只自举电容，FB 上必有两个分压电阻，PGOOD 上必有一只上拉电阻。看到名字就知道旁边该有什么——这是抄板时最快的验证方法。
          </li>
          <li>
            <b>编号从 pin1 起逆时针</b>：所以右侧引脚号是从下往上递增的。pin1 由圆点、缺口或斜角标出，装反了整块板报废。
          </li>
          <li>
            <b>方向靠字母判，不靠猜</b>：EN、FB、VIN 是输入，PGOOD、SW 是输出，SDA、D+/D− 是双向。datasheet 引脚表第一列就写着 I / O / P / N。
          </li>
        </ol>
      </div>
    </FigureShell>
  );
}
