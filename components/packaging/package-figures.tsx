import type { ReactNode } from 'react';
import styles from '../pcb/pcb-figures.module.css';
import { FigureShell, Pointer } from '../pcb/pcb-figures';

/**
 * 封装类插图（与 PCB 章节共用同一套 2D 制图语言）：
 * 分层色带 + 剖面线 + 尺寸/间距标注 + 引线编号，明暗主题各自取色。
 *
 * 统一约定：
 * - 板子用「阻焊 / 铜 / FR-4 / 铜 / 阻焊」五条带简化表示，和 PCB 章节一致
 * - 元件本体用中性灰，引脚/焊盘用铜色，焊锡用浅银灰
 */

const BOARD = {
  maskTop: [214, 220],
  cuTop: [220, 226],
  core: [226, 258],
  cuBot: [258, 264],
  maskBot: [264, 270],
};

/** 一条简化板层（复用于三张图） */
function BoardBand({
  x0,
  x1,
  holes = [],
  pads = [],
}: {
  x0: number;
  x1: number;
  /** 钻孔（世界 x 位置 + 半宽），会打断所有层 */
  holes?: { x: number; half: number }[];
  /** 表面焊盘（x 起止），只打断阻焊层 */
  pads?: [number, number][];
}) {
  const seg = (y: [number, number], fill: string, opacity = 1) => (
    <rect key={`${fill}-${y[0]}-${opacity}`} x={x0} y={y[0]} width={x1 - x0} height={y[1] - y[0]} fill={fill} opacity={opacity} />
  );

  /** 把 [x0,x1] 减去所有开窗后的若干段 */
  const subtract = (cuts: [number, number][]) => {
    const out: [number, number][] = [];
    let cursor = x0;
    [...cuts]
      .sort((a, b) => a[0] - b[0])
      .forEach(([a, b]) => {
        if (a > cursor) out.push([cursor, a]);
        cursor = Math.max(cursor, b);
      });
    if (cursor < x1) out.push([cursor, x1]);
    return out.filter(([a, b]) => b - a > 0.5);
  };

  const holeCuts: [number, number][] = holes.map((h) => [h.x - h.half, h.x + h.half]);

  return (
    <g>
      {/* 介质 */}
      <rect x={x0} y={BOARD.core[0]} width={x1 - x0} height={BOARD.core[1] - BOARD.core[0]} fill="var(--pcb-fr4)" />
      <rect
        x={x0}
        y={BOARD.core[0]}
        width={x1 - x0}
        height={BOARD.core[1] - BOARD.core[0]}
        fill="url(#pkg-core)"
      />
      <rect
        x={x0}
        y={BOARD.core[0]}
        width={x1 - x0}
        height={BOARD.core[1] - BOARD.core[0]}
        fill="url(#pkg-core2)"
      />
      {/* 铜（被孔打断） */}
      {[BOARD.cuTop, BOARD.cuBot].map((band, bi) =>
        subtract(holeCuts).map(([a, b]) => (
          <rect key={`cu-${bi}-${a}`} x={a} y={band[0]} width={b - a} height={band[1] - band[0]} fill="var(--pcb-copper)" />
        )),
      )}
      {/* 阻焊（被孔和焊盘打断） */}
      {[BOARD.maskTop, BOARD.maskBot].map((band, bi) =>
        subtract([...holeCuts, ...pads]).map(([a, b]) => (
          <rect key={`mask-${bi}-${a}`} x={a} y={band[0]} width={b - a} height={band[1] - band[0]} fill="var(--pcb-mask)" />
        )),
      )}
      {/* 板轮廓与分层线 */}
      <rect
        x={x0}
        y={BOARD.maskTop[0]}
        width={x1 - x0}
        height={BOARD.maskBot[1] - BOARD.maskTop[0]}
        fill="none"
        stroke="var(--pcb-ink)"
        strokeWidth={1.4}
      />
      {[BOARD.maskTop[1], BOARD.cuTop[1], BOARD.core[1], BOARD.cuBot[1]].map((y) => (
        <line key={`sep-${y}`} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--pcb-ink)" strokeWidth={0.8} opacity="0.45" />
      ))}
    </g>
  );
}

/** 图 1：插件 LED 与贴片 LED 的装法对比 */
export function PackageCompare() {
  const holesA = [
    { x: 150, half: 7 },
    { x: 290, half: 7 },
  ];

  return (
    <FigureShell
      no="FIG · 01"
      title="同一颗 LED 的两种装法：插件式 / 贴片式"
      meta="2D 剖面 · 对照"
      plain
      legend={[
        { swatch: 'component', label: '元件本体', hint: '发光体封装在外壳里，电气参数可以完全相同' },
        { swatch: 'copper', label: '引脚 / 焊盘', hint: '插件走引脚穿孔，贴片直接焊在表面焊盘上' },
        { swatch: 'substrate', label: 'PCB', hint: '两者的差别只在板子怎么配合它' },
        { swatch: 'solder', label: '焊锡', hint: '插件多为波峰焊/手工焊，贴片为回流焊' },
      ]}
      caption="同样一颗 LED，电气参数可以一模一样，装法却分两派：插件式的引脚要穿过板子上的钻孔再焊，贴片式的本体直接坐在表面焊盘上。插件要在 PCB 上打孔，贴片不需要——这是两类封装最本质的区别。"
    >
      <svg viewBox="0 0 880 400" role="img" aria-labelledby="pkg-cmp-title" className={styles.svg}>
        <title id="pkg-cmp-title">插件 LED 与贴片 LED 的安装方式对比：左侧引脚穿过 PCB 钻孔焊接，右侧本体贴在表面焊盘上</title>
        <defs>
          <pattern id="pkg-core" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--pcb-hatch)" strokeWidth={1} />
          </pattern>
          <pattern id="pkg-core2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--pcb-hatch-2)" strokeWidth={1} />
          </pattern>
        </defs>

        {/* ---------------- 左：插件式 ---------------- */}
        <g>
          <rect x="40" y="120" width="0" height="0" />
          <BoardBand x0={40} x1={400} holes={holesA} />

          {/* 钻孔（孔内为背景色） */}
          {holesA.map((h) => (
            <rect
              key={`hole-${h.x}`}
              x={h.x - h.half}
              y={BOARD.maskTop[0]}
              width={h.half * 2}
              height={BOARD.maskBot[1] - BOARD.maskTop[0]}
              fill="var(--pcb-hole)"
              stroke="var(--pcb-hair)"
              strokeWidth={0.8}
            />
          ))}

          {/* LED 本体：圆柱 + 半球头 */}
          <path
            d="M 200 150 L 200 96 A 32 32 0 0 1 240 96 L 240 150 L 218 150 L 218 96 A 10 10 0 0 0 198 96 L 198 150 Z"
            fill="none"
            stroke="none"
          />
          <rect x={196} y={118} width={48} height={96} rx={3} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
          <path d="M 196 118 A 24 24 0 0 1 244 118 Z" fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={1.2} opacity="0.9" />
          <rect x={204} y={130} width={32} height={10} rx={2} fill="var(--pcb-solder)" opacity="0.5" />

          {/* 引脚：从本体底部穿过孔，再翻到背面 */}
          {holesA.map((h) => (
            <g key={`lead-${h.x}`}>
              <rect x={h.x - 2.5} y={BOARD.maskTop[0] - 8} width={5} height={BOARD.maskBot[1] - BOARD.maskTop[0] + 12} fill="var(--pcb-silver)" stroke="var(--pcb-hair)" strokeWidth={0.6} />
              {/* 背面焊点 */}
              <path
                d={`M ${h.x - 16} ${BOARD.maskBot[1]} Q ${h.x} ${BOARD.maskBot[1] - 6} ${h.x + 16} ${BOARD.maskBot[1]} L ${h.x + 16} ${BOARD.maskBot[1] + 5} L ${h.x - 16} ${BOARD.maskBot[1] + 5} Z`}
                fill="var(--pcb-solder)"
                stroke="var(--pcb-ink)"
                strokeWidth={0.8}
              />
            </g>
          ))}
          {/* 本体与引脚的连接 */}
          <rect x={150 - 2.5} y={196} width={5} height={20} fill="var(--pcb-silver)" />
          <rect x={290 - 2.5} y={196} width={5} height={20} fill="var(--pcb-silver)" />
          <line x1={150} y1={204} x2={196} y2={204} stroke="var(--pcb-silver)" strokeWidth={4} />
          <line x1={244} y1={204} x2={290} y2={204} stroke="var(--pcb-silver)" strokeWidth={4} />

          <text x={220} y={306} textAnchor="middle" className={styles.panelTitle}>
            插件式（Through-Hole）
          </text>
          <text x={220} y={326} textAnchor="middle" className={styles.panelSub}>
            引脚穿孔 → 背面焊点；板上必须钻孔
          </text>

          <Pointer from={[96, 90]} to={[196, 176]} label="本体" align="end" />
          <Pointer from={[330, 96]} to={[290, 214]} label="引脚" sub="穿过钻孔" align="start" />
          <Pointer from={[336, 288]} to={[296, 268]} label="焊点" sub="背面" align="start" />
        </g>

        {/* ---------------- 右：贴片式 ---------------- */}
        <g>
          <BoardBand x0={480} x1={840} pads={[[534, 566], [634, 666]]} />

          {/* 焊盘（露铜） */}
          {[[534, 566], [634, 666]].map(([a, b]) => (
            <rect key={`pad-${a}`} x={a} y={BOARD.maskTop[0]} width={b - a} height={BOARD.cuTop[1] - BOARD.maskTop[0]} fill="var(--pcb-copper)" />
          ))}

          {/* 本体 */}
          <rect x={566} y={172} width={68} height={42} rx={3} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
          <rect x={576} y={180} width={48} height={18} rx={2} fill="var(--pcb-solder)" opacity="0.75" />
          {/* 端电极 + 焊锡 */}
          <rect x={560} y={180} width={8} height={34} fill="var(--pcb-silver)" stroke="var(--pcb-hair)" strokeWidth={0.6} />
          <rect x={632} y={180} width={8} height={34} fill="var(--pcb-silver)" stroke="var(--pcb-hair)" strokeWidth={0.6} />
          {[[534, 568], [632, 666]].map(([a, b]) => (
            <path
              key={`fillet-${a}`}
              d={`M ${a + 2} ${BOARD.maskTop[0]} L ${a + 2} ${BOARD.maskTop[0] - 7} Q ${a + 2} ${BOARD.maskTop[0]} ${a + 10} ${BOARD.maskTop[0]} Z`}
              fill="var(--pcb-solder)"
              stroke="var(--pcb-ink)"
              strokeWidth={0.7}
            />
          ))}
          <rect x={534} y={BOARD.maskTop[0] - 7} width={34} height={7} fill="var(--pcb-solder)" opacity="0.9" />
          <rect x={632} y={BOARD.maskTop[0] - 7} width={34} height={7} fill="var(--pcb-solder)" opacity="0.9" />

          <text x={660} y={306} textAnchor="middle" className={styles.panelTitle}>
            贴片式（Surface Mount）
          </text>
          <text x={660} y={326} textAnchor="middle" className={styles.panelSub}>
            本体坐在表面焊盘上；板上不需要钻孔
          </text>

          <Pointer from={[770, 120]} to={[600, 172]} label="本体" align="start" />
          <Pointer from={[790, 200]} to={[650, 214]} label="焊盘" sub="无孔，只露铜" align="start" />
        </g>
      </svg>
    </FigureShell>
  );
}

/** 图 2：电阻的两种封装（插件 / 贴片） */
export function ResistorPackages() {
  return (
    <FigureShell
      no="FIG · 02"
      title="电阻的两种封装：轴向插件 / 贴片"
      meta="2D 侧视 · 含尺寸"
      plain
      legend={[
        { n: 1, label: '轴向插件电阻', hint: '圆柱本体 + 两侧引线，常见 1/4 W 体长约 6.3 mm' },
        { n: 2, label: '贴片电阻', hint: '长方体 + 两端电极，尺寸用英寸码表示' },
      ]}
      caption="同样 10 kΩ，插件电阻靠两根引线穿两个孔固定，贴片电阻则直接躺在两个焊盘之间。贴片电阻的尺寸用「英寸码」命名：0402 约 1.0×0.5 mm，0603 约 1.6×0.8 mm，0805 约 2.0×1.25 mm——数字越大，功率越大越好焊。"
    >
      <svg viewBox="0 0 880 280" role="img" aria-labelledby="pkg-res-title" className={styles.svg}>
        <title id="pkg-res-title">插件电阻与贴片电阻的封装对比：轴向引线穿孔安装，贴片电阻两端电极坐在焊盘上</title>
        <defs>
          <pattern id="res-core" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="var(--pcb-hatch)" strokeWidth={1} />
          </pattern>
        </defs>

        {/* 插件电阻：本体 + 两侧引线 + 板与孔 */}
        <g>
          {/* 板：三段色带（阻焊 / FR-4 / 阻焊），引线处开孔 */}
          <rect x={90} y={150} width={250} height={42} fill="var(--pcb-mask)" opacity="0.9" />
          <rect x={90} y={156} width={250} height={30} fill="var(--pcb-fr4)" />
          <rect x={90} y={156} width={250} height={30} fill="url(#res-core)" />
          <rect x={90} y={150} width={250} height={42} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.3} />
          {/* 钻孔 */}
          {[110, 330].map((x) => (
            <rect key={`hole-${x}`} x={x - 7} y={150} width={14} height={42} fill="var(--pcb-hole)" stroke="var(--pcb-hair)" strokeWidth={0.9} />
          ))}
          {/* 本体 */}
          <rect x={150} y={92} width={140} height={44} rx={10} fill="var(--pcb-fr4)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
          {/* 色环 */}
          {[178, 198, 218, 250].map((x, i) => (
            <rect key={`band-${x}`} x={x} y={92} width={i === 3 ? 8 : 7} height={44} fill={['#8b5e3c', '#1f2937', '#b91c1c', '#c8a24a'][i]} opacity="0.85" />
          ))}
          {/* 引线：水平伸出 → 折下穿过孔 */}
          <line x1={110} y1={114} x2={150} y2={114} stroke="var(--pcb-silver)" strokeWidth={5} />
          <line x1={290} y1={114} x2={330} y2={114} stroke="var(--pcb-silver)" strokeWidth={5} />
          <path d="M 110 114 L 110 200" stroke="var(--pcb-silver)" strokeWidth={5} fill="none" />
          <path d="M 330 114 L 330 200" stroke="var(--pcb-silver)" strokeWidth={5} fill="none" />
          {/* 背面焊点 */}
          {[110, 330].map((x) => (
            <circle key={`solder-${x}`} cx={x} cy={198} r={9} fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={1} />
          ))}
          {/* 尺寸：体长与引脚间距 */}
          <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
            <line x1={150} y1={72} x2={290} y2={72} />
            <line x1={150} y1={67} x2={150} y2={77} />
            <line x1={290} y1={67} x2={290} y2={77} />
            <line x1={110} y1={228} x2={330} y2={228} />
            <line x1={110} y1={223} x2={110} y2={233} />
            <line x1={330} y1={223} x2={330} y2={233} />
          </g>
          <text x={220} y={66} textAnchor="middle" className={styles.dimText}>
            体长 ≈ 6.3 mm
          </text>
          <text x={220} y={246} textAnchor="middle" className={styles.dimText}>
            引脚间距（决定两个孔的位置）
          </text>
          <text x={60} y={40} className={styles.panelTitle}>
            ① 轴向插件电阻
          </text>
          <text x={60} y={60} className={styles.panelSub}>
            要打两个孔
          </text>
        </g>

        <line x1={440} y1={40} x2={440} y2={250} stroke="var(--pcb-hair)" strokeWidth={1} strokeDasharray="4 5" />

        {/* 贴片电阻：本体 + 两端电极 + 焊盘 */}
        <g>
          {/* 板：三段色带 */}
          <rect x={520} y={150} width={260} height={42} fill="var(--pcb-mask)" opacity="0.9" />
          <rect x={520} y={156} width={260} height={30} fill="var(--pcb-fr4)" />
          <rect x={520} y={156} width={260} height={30} fill="url(#res-core)" />
          <rect x={520} y={150} width={260} height={42} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.3} />
          {/* 焊盘（露铜，无孔） */}
          <rect x={560} y={150} width={44} height={8} fill="var(--pcb-copper)" />
          <rect x={696} y={150} width={44} height={8} fill="var(--pcb-copper)" />
          {/* 本体 */}
          <rect x={604} y={112} width={92} height={38} rx={2} fill="var(--pcb-fr4)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
          {/* 端电极 */}
          <rect x={596} y={114} width={12} height={34} fill="var(--pcb-silver)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
          <rect x={692} y={114} width={12} height={34} fill="var(--pcb-silver)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
          {/* 焊锡 */}
          <rect x={560} y={144} width={44} height={6} fill="var(--pcb-solder)" opacity="0.95" />
          <rect x={696} y={144} width={44} height={6} fill="var(--pcb-solder)" opacity="0.95" />
          {/* 尺寸 */}
          <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
            <line x1={596} y1={92} x2={704} y2={92} />
            <line x1={596} y1={87} x2={596} y2={97} />
            <line x1={704} y1={87} x2={704} y2={97} />
          </g>
          <text x={650} y={86} textAnchor="middle" className={styles.dimText}>
            长 1.6 mm（0603）
          </text>
          <text x={650} y={216} textAnchor="middle" className={styles.panelSub}>
            两个焊盘，无需钻孔
          </text>
          <text x={490} y={40} className={styles.panelTitle}>
            ② 贴片电阻
          </text>
          <text x={490} y={60} className={styles.panelSub}>
            尺寸码：0402 / 0603 / 0805 / 1206
          </text>
        </g>
      </svg>
    </FigureShell>
  );
}

/** 图 3：四种常见 IC 封装（俯视 + 侧视） */
export function IcPackages() {
  type Pkg = {
    key: string;
    name: string;
    pitch: string;
    mount: string;
    note: string;
    draw: (cx: number, cy: number) => ReactNode;
  };

  const pinRow = (x0: number, x1: number, y: number, count: number, len: number, dir: 1 | -1) =>
    Array.from({ length: count }, (_, i) => {
      const step = (x1 - x0) / count;
      const x = x0 + step * i + step / 2 - 2.5;
      return (
        <rect
          key={`p-${x0}-${y}-${i}`}
          x={x}
          y={dir > 0 ? y : y - len}
          width={5}
          height={len}
          fill="var(--pcb-copper)"
        />
      );
    });

  const packages: Pkg[] = [
    {
      key: 'dip',
      name: 'DIP',
      pitch: '2.54 mm',
      mount: '穿孔',
      note: '双列直插',
      draw: (cx, cy) => (
        <g>
          <rect x={cx - 52} y={cy - 24} width={104} height={48} rx={2} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.3} />
          <path d={`M ${cx - 8} ${cy - 24} a 8 8 0 0 0 16 0`} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.2} />
          {pinRow(cx - 44, cx + 44, cy - 24, 8, 12, -1)}
          {pinRow(cx - 44, cx + 44, cy + 24, 8, 12, 1)}
          <circle cx={cx - 40} cy={cy + 14} r={3} fill="var(--pcb-silk)" />
        </g>
      ),
    },
    {
      key: 'soic',
      name: 'SOIC',
      pitch: '1.27 mm',
      mount: '贴片',
      note: '小外形双列',
      draw: (cx, cy) => (
        <g>
          <rect x={cx - 40} y={cy - 18} width={80} height={36} rx={2} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.3} />
          <path d={`M ${cx - 6} ${cy - 18} a 6 6 0 0 0 12 0`} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.1} />
          {pinRow(cx - 33, cx + 33, cy - 18, 8, 9, -1)}
          {pinRow(cx - 33, cx + 33, cy + 18, 8, 9, 1)}
          <circle cx={cx - 31} cy={cy + 10} r={2.6} fill="var(--pcb-silk)" />
        </g>
      ),
    },
    {
      key: 'qfp',
      name: 'QFP',
      pitch: '0.5 mm',
      mount: '贴片',
      note: '四边引脚',
      draw: (cx, cy) => (
        <g>
          <rect x={cx - 34} y={cy - 34} width={68} height={68} rx={2} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.3} />
          {Array.from({ length: 9 }, (_, i) => {
            const step = 56 / 9;
            const x = cx - 28 + step * i + step / 2 - 1.8;
            return (
              <g key={`tb-${i}`}>
                <rect x={x} y={cy - 34 - 9} width={3.6} height={9} fill="var(--pcb-copper)" />
                <rect x={x} y={cy + 34} width={3.6} height={9} fill="var(--pcb-copper)" />
              </g>
            );
          })}
          {Array.from({ length: 9 }, (_, i) => {
            const step = 56 / 9;
            const y = cy - 28 + step * i + step / 2 - 1.8;
            return (
              <g key={`lr-${i}`}>
                <rect x={cx - 34 - 9} y={y} width={9} height={3.6} fill="var(--pcb-copper)" />
                <rect x={cx + 34} y={y} width={9} height={3.6} fill="var(--pcb-copper)" />
              </g>
            );
          })}
          <circle cx={cx - 26} cy={cy - 26} r={3} fill="var(--pcb-silk)" />
        </g>
      ),
    },
    {
      key: 'bga',
      name: 'BGA',
      pitch: '0.8 mm',
      mount: '贴片',
      note: '底面锡球阵列',
      draw: (cx, cy) => (
        <g>
          <rect x={cx - 36} y={cy - 36} width={72} height={72} rx={3} fill="color-mix(in oklab, var(--pcb-component) 70%, var(--pcb-ink) 30%)" stroke="var(--pcb-ink)" strokeWidth={1.3} opacity="0.35" />
          {Array.from({ length: 7 }, (_, r) =>
            Array.from({ length: 7 }, (_, c) => (
              <circle
                key={`ball-${r}-${c}`}
                cx={cx - 27 + c * 9}
                cy={cy - 27 + r * 9}
                r={3.4}
                fill="var(--pcb-silver)"
                stroke="var(--pcb-ink)"
                strokeWidth={0.5}
              />
            )),
          )}
        </g>
      ),
    },
  ];

  return (
    <FigureShell
      no="FIG · 03"
      title="四种常见 IC 封装（俯视）"
      meta="2D 对照 · 间距 / 安装方式"
      plain
      legend={[
        { n: 1, label: 'DIP', hint: '双列直插：两排引脚穿过板子，间距 2.54 mm' },
        { n: 2, label: 'SOIC', hint: '小外形双列：贴片，鸥翼引脚，间距 1.27 mm' },
        { n: 3, label: 'QFP', hint: '四边扁平：四边都有引脚，间距 0.5 mm 起' },
        { n: 4, label: 'BGA', hint: '球栅阵列：底面锡球阵列，引脚密度最高' },
      ]}
      caption="四种封装的引脚排布方式完全不同：DIP 两排长引脚穿板；SOIC 把同一种双列引脚做小、改成贴片；QFP 把引脚摊到四条边，靠数量取胜；BGA 干脆把引脚变成底面的锡球阵列，密度最高，但焊完看不见，只能靠 X-ray 检查。"
      note="右下角的小圆点是 1 号脚标记；实际 PCB 上的丝印外框与 1 脚标记，就是按这个位置画的。"
    >
      <svg viewBox="0 0 880 320" role="img" aria-labelledby="pkg-ic-title" className={styles.svg}>
        <title id="pkg-ic-title">DIP、SOIC、QFP、BGA 四种 IC 封装的俯视引脚排布对比</title>
        {packages.map((pkg, i) => {
          const cx = 130 + i * 210;
          return (
            <g key={pkg.key}>
              {pkg.draw(cx, 120)}
              <text x={cx} y={214} textAnchor="middle" className={styles.panelTitle}>
                {pkg.name}
              </text>
              <text x={cx} y={234} textAnchor="middle" className={styles.panelSub}>
                {pkg.note}
              </text>
              <text x={cx} y={254} textAnchor="middle" className={styles.panelMeta}>
                间距 {pkg.pitch} · {pkg.mount}
              </text>
              {i < packages.length - 1 && (
                <line x1={cx + 105} y1={60} x2={cx + 105} y2={270} stroke="var(--pcb-hair)" strokeWidth={1} strokeDasharray="4 5" />
              )}
            </g>
          );
        })}
      </svg>
    </FigureShell>
  );
}
