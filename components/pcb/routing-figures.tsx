import { Badge, FigureShell, Pointer } from './pcb-figures';
import styles from './pcb-figures.module.css';

/**
 * 布局与布线类插图组件。
 *
 * 与 pcb-figures.tsx 同一套约定：
 * 外层卡片（头 / 画布 / 图例 / 图注）+ 内层 SVG（只画物件）；
 * 文字尽量交给 HTML，SVG 里只留编号徽标、短代号与尺寸数字；
 * 颜色全部取自 pcb-figures.module.css 的 --pcb-* 变量。
 *
 * 本文件的图都在「板面」上看，是俯视平面图，与结构篇的剖面图互补。
 */

/* =========================================================================
 * 6. 布局分区：俯视平面图
 *    板框 + 功能分区 + 结构约束（安装孔 / 板边留白 / 接口靠边）
 * ========================================================================= */

/** 板面上的功能分区：丝印虚线框 + 区名 */
function Zone({
  x,
  y,
  w,
  h,
  label,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill="color-mix(in oklab, var(--pcb-silk) 9%, transparent)"
        stroke="color-mix(in oklab, var(--pcb-silk) 52%, transparent)"
        strokeWidth={1.1}
        strokeDasharray="6 4"
      />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4.5)} textAnchor="middle" className={styles.silkText}>
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className={styles.silkText} opacity={0.72}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** 板上元件：灰色本体 + 丝印外框 */
function Part({ x, y, w, h, corner = 2 }: { x: number; y: number; w: number; h: number; corner?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={corner} fill="var(--pcb-component)" opacity={0.92} />
      <rect
        x={x - 2.5}
        y={y - 2.5}
        width={w + 5}
        height={h + 5}
        rx={corner + 1}
        fill="none"
        stroke="var(--pcb-silk)"
        strokeWidth={1}
        opacity={0.66}
      />
    </g>
  );
}

export function PlacementPlan() {
  const bx = 200;
  const by = 70;
  const bw = 500;
  const bh = 390;
  const bx1 = bx + bw;
  const by1 = by + bh;

  const holes: [number, number][] = [
    [bx + 36, by + 38],
    [bx1 - 36, by + 38],
    [bx + 36, by1 - 38],
    [bx1 - 36, by1 - 38],
  ];

  return (
    <FigureShell
      no="FIG · 06"
      title="布局分区图：把 70% 的布线难度在布局阶段解决"
      meta="俯视平面 · 板框 100 × 68 mm"
      legend={[
        { n: 1, label: '接口区靠板边', hint: '连接器方向一致、不超出板框' },
        { n: 2, label: '电源区单独成块', hint: '大电流环路面积最小，远离小信号' },
        { n: 3, label: '主控居中', hint: '到各方向引脚的平均距离最短' },
        { n: 4, label: '晶振紧贴 OSC 引脚', hint: '下方不走线，外面包地' },
        { n: 5, label: '去耦电容贴电源引脚', hint: '小容值最近，回路面积越小越好' },
        { n: 6, label: '安装孔禁布区', hint: '螺丝头半径内不放元件与走线' },
        { n: 7, label: '板边留白 ≥3–5 mm', hint: '铣边公差、拼板工艺边与 ESD 都靠它' },
      ]}
      caption="同一块板，布局决定后面是「体力活」还是「拆东墙补西墙」。这张图里的每一块虚线区域都是一个要在原理图上先想清楚的问题：谁和谁必须挨着，谁和谁必须分开。"
      note="注意分区顺序不是随意的：接口区由外壳决定，先定；电源与数字区的相对位置决定了电源噪声会不会灌进小信号；主控摆在几何中心，是因为它是走线密度最高的那个点。"
    >
      <svg viewBox="0 0 900 560" role="img" aria-labelledby="fig-place-title" className={styles.svg}>
        <title id="fig-place-title">
          一块 100 × 68 mm 的板俯视图：左侧接口区、左上电源区、中部数字区与主控芯片、右上模拟区、下部高速接口区，四角有安装孔，板边有一圈 3 到 5 mm 的禁布留白
        </title>

        {/* 板框 */}
        <rect x={bx} y={by} width={bw} height={bh} rx={14} fill="var(--pcb-mask)" stroke="var(--pcb-edge)" strokeWidth={2.4} />

        {/* 板边禁布区：丝印虚线内缩 */}
        <rect
          x={bx + 20}
          y={by + 20}
          width={bw - 40}
          height={bh - 40}
          rx={8}
          fill="none"
          stroke="var(--pcb-silk)"
          strokeWidth={1}
          strokeDasharray="7 5"
          opacity={0.45}
        />

        {/* 功能分区 */}
        <Zone x={bx + 12} y={by + 96} w={72} h={230} label="接口区" sub="靠边" />
        <Zone x={bx + 96} y={by + 18} w={140} h={122} label="电源区" sub="大电流" />
        <Zone x={bx + 250} y={by + 50} w={150} h={190} label="数字区" sub="主控" />
        <Zone x={bx + 416} y={by + 18} w={78} h={122} label="模拟区" sub="小信号" />
        <Zone x={bx + 250} y={by + 260} w={240} h={96} label="高速接口区" sub="远离电源" />

        {/* 接口：三个连接器，全部贴着板边 */}
        <g>
          {[180, 252, 320].map((y, i) => (
            <g key={`conn-${i}`}>
              <rect x={bx + 14} y={y} width={38} height={i === 0 ? 52 : 44} rx={3} fill="var(--pcb-silver)" stroke="var(--pcb-copper-3)" strokeWidth={1.4} />
              <rect x={bx + 52} y={y + 6} width={10} height={i === 0 ? 40 : 32} rx={2} fill="var(--pcb-copper)" />
            </g>
          ))}
        </g>

        {/* 电源区：电感 + 开关管 + 滤波电容 */}
        <Part x={bx + 108} y={by + 40} w={46} h={46} corner={4} />
        <Part x={bx + 168} y={by + 40} w={30} h={26} />
        <Part x={bx + 108} y={by + 100} w={90} h={16} corner={1} />
        <text x={bx + 131} y={by + 66} textAnchor="middle" className={styles.silkText} fontSize={10}>
          L1
        </text>

        {/* 主控 */}
        <Part x={bx + 270} y={by + 80} w={104} h={104} corner={5} />
        <text x={bx + 322} y={by + 136} textAnchor="middle" className={styles.silkText}>
          MCU
        </text>
        {/* 引脚 */}
        {Array.from({ length: 9 }, (_, i) => (
          <g key={`pin-${i}`}>
            <rect x={bx + 276 + i * 11} y={by + 74} width={5} height={7} fill="var(--pcb-copper)" />
            <rect x={bx + 276 + i * 11} y={by + 183} width={5} height={7} fill="var(--pcb-copper)" />
          </g>
        ))}

        {/* 晶振与包地 */}
        <rect
          x={bx + 386}
          y={by + 88}
          width={44}
          height={46}
          rx={4}
          fill="none"
          stroke="var(--pcb-copper)"
          strokeWidth={4}
          opacity={0.5}
        />
        <Part x={bx + 392} y={by + 96} w={30} h={30} corner={3} />
        <text x={bx + 407} y={by + 116} textAnchor="middle" className={styles.silkText} fontSize={10}>
          Y1
        </text>

        {/* 去耦电容：紧贴 MCU 上方电源引脚 */}
        {[0, 1, 2, 3].map((i) => (
          <g key={`cap-${i}`}>
            <rect x={bx + 272 + i * 26} y={by + 64} width={14} height={9} rx={1} fill="var(--pcb-copper)" />
            <rect x={bx + 272 + i * 26} y={by + 64} width={14} height={9} rx={1} fill="none" stroke="var(--pcb-silk)" strokeWidth={0.8} opacity={0.5} />
          </g>
        ))}

        {/* 模拟区 */}
        <Part x={bx + 428} y={by + 40} w={54} h={40} corner={3} />
        <circle cx={bx + 455} cy={by + 112} r={9} fill="none" stroke="var(--pcb-silk)" strokeWidth={1.2} opacity={0.7} />

        {/* 高速接口区 */}
        <Part x={bx + 262} y={by + 286} w={62} h={48} corner={2} />
        <Part x={bx + 336} y={by + 286} w={62} h={48} corner={2} />

        {/* 安装孔：铜环 + 孔 + 禁布圈 */}
        {holes.map(([hx, hy], i) => (
          <g key={`hole-${i}`}>
            <circle cx={hx} cy={hy} r={26} fill="none" stroke="var(--pcb-silk)" strokeWidth={1} strokeDasharray="4 4" opacity={0.45} />
            <circle cx={hx} cy={hy} r={17} fill="var(--pcb-copper)" />
            <circle cx={hx} cy={hy} r={9} fill="var(--pcb-hole)" stroke="var(--pcb-copper-3)" strokeWidth={1.2} />
          </g>
        ))}

        {/* 板边留白尺寸 */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none" opacity={0.8}>
          <line x1={bx + 150} y1={by} x2={bx + 150} y2={by + 20} />
          <line x1={bx + 144} y1={by} x2={bx + 156} y2={by} />
          <line x1={bx + 144} y1={by + 20} x2={bx + 156} y2={by + 20} />
        </g>
        <text x={bx + 162} y={by + 16} className={styles.silkText} fontSize={10}>
          3–5 mm
        </text>

        {/* 编号徽标 */}
        <Badge x={bx + 50} y={by + 190} n={1} />
        <Badge x={bx + 116} y={by + 130} n={2} />
        <Badge x={bx + 322} y={by + 132} n={3} />
        <Badge x={bx + 408} y={by + 146} n={4} />
        <Badge x={bx + 322} y={by + 68} n={5} />
        <Badge x={bx + 36} y={by + 38} n={6} />
        <Badge x={bx + 150} y={by + 34} n={7} />

        {/* 引线：晶振为什么紧贴 MCU */}
        <Pointer from={[650, 250]} to={[bx + 407, by + 126]} label="晶振贴着 OSC 引脚" sub="下方不走线，外圈包地" align="start" />
        <Pointer from={[650, 300]} to={[bx + 322, by + 210]} label="主控居中" sub="到各方向引脚距离最短" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 7. 线宽与载流：IPC-2221 曲线（1 oz 铜，允许温升 10 ℃）
 * ========================================================================= */

export function TraceCurrent() {
  /** IPC-2221：I = k · ΔT^0.44 · A^0.725，A 单位 mil² */
  const amp = (mm: number, k: number) => k * Math.pow(10, 0.44) * Math.pow((mm / 0.0254) * 1.378, 0.725);
  const X = (mm: number) => 172 + (mm / 3) * 556;
  const Y = (a: number) => 356 - (a / 5.5) * 286;
  const widths = [0.15, 0.2, 0.3, 0.5, 0.8, 1, 1.5, 2, 2.5, 3];
  const curve = (k: number) =>
    widths
      .map((mm, i) => `${i === 0 ? 'M' : 'L'}${X(mm).toFixed(1)} ${Y(amp(mm, k)).toFixed(1)}`)
      .join(' ');

  return (
    <FigureShell
      no="FIG · 07"
      title="线宽决定载流：IPC-2221 载流曲线"
      meta="1 oz 铜（35 µm）· ΔT = 10 ℃"
      legend={[
        { n: 1, label: '外层走线', hint: 'k ≈ 0.048，1 mm 约 2.4 A' },
        { n: 2, label: '内层走线', hint: 'k ≈ 0.024，只有外层的 50% 左右' },
        { n: 3, label: '常用取值点', hint: '电源与地按电流留 2 倍以上余量' },
      ]}
      caption="同样 1 mm 宽，外层可以走 2.4 A，内层只能走 1.2 A——差别不在铜，而在散热。内层被板材包住，热只能顺着铜往边上导，所以载流能力要打折。"
      note="曲线来自 IPC-2221 的经验公式 I = k·ΔT^0.44·A^0.725（A 为截面积，mil²）。它描述的是「允许温升」，不是「会不会烧断」，所以工程上还要再乘安全系数。"
    >
      <svg viewBox="0 0 900 440" role="img" aria-labelledby="fig-cur-title" className={styles.svg}>
        <title id="fig-cur-title">
          IPC-2221 载流曲线：横轴为线宽 0 到 3 毫米，纵轴为载流 0 到 5 安培，外层曲线在 1 毫米处约 2.4 安培，内层约为其一半
        </title>

        {/* 网格 */}
        {[1, 2, 3, 4, 5].map((a) => (
          <line key={`gy-${a}`} x1={172} y1={Y(a)} x2={730} y2={Y(a)} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}
        {[0.5, 1, 1.5, 2, 2.5, 3].map((mm) => (
          <line key={`gx-${mm}`} x1={X(mm)} y1={70} x2={X(mm)} y2={356} stroke="var(--pcb-grid)" strokeWidth={1} />
        ))}

        {/* 坐标轴 */}
        <g stroke="var(--pcb-hair-strong)" strokeWidth={1.2} fill="none">
          <line x1={172} y1={356} x2={742} y2={356} />
          <line x1={172} y1={356} x2={172} y2={62} />
        </g>
        {[1, 2, 3, 4, 5].map((a) => (
          <g key={`ty-${a}`}>
            <line x1={166} y1={Y(a)} x2={172} y2={Y(a)} stroke="var(--pcb-hair-strong)" strokeWidth={1} />
            <text x={158} y={Y(a) + 4} textAnchor="end" className={styles.dimText}>
              {a}
            </text>
          </g>
        ))}
        {[0.5, 1, 1.5, 2, 2.5, 3].map((mm) => (
          <g key={`tx-${mm}`}>
            <line x1={X(mm)} y1={356} x2={X(mm)} y2={362} stroke="var(--pcb-hair-strong)" strokeWidth={1} />
            <text x={X(mm)} y={378} textAnchor="middle" className={styles.dimText}>
              {mm}
            </text>
          </g>
        ))}
        <text x={742} y={398} textAnchor="end" className={styles.dimText}>
          线宽 / mm
        </text>
        <text x={150} y={58} textAnchor="middle" className={styles.dimText}>
          载流 / A
        </text>

        {/* 内层曲线（虚线） */}
        <path d={curve(0.024)} fill="none" stroke="var(--pcb-trace-side)" strokeWidth={2.4} strokeDasharray="7 5" />
        {/* 外层曲线 */}
        <path d={curve(0.048)} fill="none" stroke="var(--pcb-callout)" strokeWidth={2.8} />

        {/* 1 mm 处的取值点 */}
        <g>
          <line x1={X(1)} y1={Y(amp(1, 0.048))} x2={X(1)} y2={356} stroke="var(--pcb-callout)" strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />
          <circle cx={X(1)} cy={Y(amp(1, 0.048))} r={4.2} fill="var(--pcb-callout)" />
          <circle cx={X(1)} cy={Y(amp(1, 0.024))} r={4.2} fill="var(--pcb-trace-side)" />
        </g>

        {/* 标注 */}
        <Pointer from={[420, 92]} to={[X(1.9), Y(amp(1.9, 0.048))]} label="① 外层" sub="1 mm ≈ 2.4 A" align="start" />
        <Pointer from={[420, 300]} to={[X(1.9), Y(amp(1.9, 0.024))]} label="② 内层" sub="同样线宽只有一半" align="start" />
        <Pointer from={[236, 470 - 60]} to={[X(0.5), Y(amp(0.5, 0.048))]} label="③ 0.5 mm ≈ 1.4 A" align="start" />

        <Badge x={X(2.4) + 6} y={Y(amp(2.4, 0.048)) - 18} n={1} />
        <Badge x={X(2.4) + 6} y={Y(amp(2.4, 0.024)) + 20} n={2} />
        <Badge x={X(0.5) - 16} y={Y(amp(0.5, 0.048)) - 14} n={3} />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 8. 间距与边缘：3W 原则（俯视）+ 20H 原则（剖面）
 * ========================================================================= */

export function SpacingRules() {
  const W = 22;
  const yA = 168;
  const yB = yA + 3 * W; // 中心间距 3W

  return (
    <FigureShell
      no="FIG · 08"
      title="两条间距规则：3W 管串扰，20H 管边缘辐射"
      meta="左：俯视平面 · 右：叠层剖面"
      legend={[
        { n: 1, label: '3W 原则', hint: '中心间距 ≥3 倍线宽，电场耦合降约 70%' },
        { n: 2, label: '20H 原则', hint: '电源层比地层内缩 20 倍介质厚度，边缘辐射降约 70%' },
      ]}
      caption="3W 和 20H 是同一件事的两个方向：串扰是「线对线」的耦合，边缘辐射是「平面对空气」的耦合。一个在板面上拉开距离，一个在叠层上把边缘推进去。"
      note="3W 说的是中心距（center-to-center）不是边距，这是最常见的记忆错误：3W 的中心距，对应边到边只有 2W 的间隙。"
    >
      <svg viewBox="0 0 900 460" role="img" aria-labelledby="fig-sp-title" className={styles.svg}>
        <title id="fig-sp-title">
          左图为板面俯视：两条平行走线中心距为三倍线宽，中间画出电场耦合弧线；右图为叠层剖面：电源层比地层边缘内缩二十倍介质厚度，边缘的辐射箭头被削弱
        </title>

        {/* ---------- 左：3W（俯视） ---------- */}
        <text x={40} y={54} className={styles.panelTitle}>
          ① 3W：拉开线间距
        </text>
        <text x={40} y={76} className={styles.panelSub}>
          俯视 · 中心距 = 3 × 线宽
        </text>

        <rect x={40} y={104} width={400} height={230} rx={10} fill="var(--pcb-mask)" stroke="var(--pcb-edge)" strokeWidth={1.8} />

        {/* 两条走线 */}
        {[yA, yB].map((y, i) => (
          <g key={`tr-${i}`}>
            <rect x={78} y={y - W / 2} width={324} height={W} rx={2} fill="var(--pcb-trace-top)" />
            <rect x={78} y={y - W / 2} width={324} height={W} rx={2} fill="none" stroke="var(--pcb-trace-side)" strokeWidth={1.2} />
          </g>
        ))}
        <text x={88} y={yA - W / 2 - 10} className={styles.silkText} fontSize={10}>
          攻击线
        </text>
        <text x={88} y={yB + W / 2 + 20} className={styles.silkText} fontSize={10}>
          受害线
        </text>

        {/* 耦合场：三条弧形虚线 */}
        {[150, 230, 310].map((x, i) => (
          <path
            key={`cp-${i}`}
            d={`M${x} ${yA + W / 2 + 2} Q${x + 14} ${(yA + yB) / 2} ${x} ${yB - W / 2 - 2}`}
            fill="none"
            stroke="var(--pcb-callout)"
            strokeWidth={1.4}
            strokeDasharray="3 3"
            markerEnd="url(#sp-arrow)"
            opacity={0.9}
          />
        ))}
        <defs>
          <marker id="sp-arrow" viewBox="0 0 8 8" refX={4} refY={4} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0 0 L8 4 L0 8 z" fill="var(--pcb-callout)" />
          </marker>
        </defs>

        {/* 尺寸：线宽 W */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={432} y1={yA - W / 2} x2={432} y2={yA + W / 2} />
          <line x1={426} y1={yA - W / 2} x2={438} y2={yA - W / 2} />
          <line x1={426} y1={yA + W / 2} x2={438} y2={yA + W / 2} />
        </g>
        <text x={444} y={yA + 4} className={styles.silkText} fontSize={10}>
          W
        </text>

        {/* 尺寸：中心距 3W */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={110} y1={yA} x2={110} y2={yB} />
          <line x1={104} y1={yA} x2={116} y2={yA} />
          <line x1={104} y1={yB} x2={116} y2={yB} />
        </g>
        <rect x={86} y={(yA + yB) / 2 - 12} width={48} height={22} rx={4} fill="var(--pcb-mask)" />
        <text x={110} y={(yA + yB) / 2 + 4} textAnchor="middle" className={styles.silkText} fontSize={11}>
          3W
        </text>
        <Badge x={110} y={yB + 52} n={1} />

        {/* ---------- 右：20H（剖面） ---------- */}
        <text x={500} y={54} className={styles.panelTitle}>
          ② 20H：把电源层推进去
        </text>
        <text x={500} y={76} className={styles.panelSub}>
          剖面 · 内缩 = 20 × 介质厚度 H
        </text>

        {/* 地层（完整） */}
        <rect x={500} y={150} width={340} height={12} fill="var(--pcb-copper)" />
        <text x={834} y={159} textAnchor="end" className={styles.silkText} fontSize={10}>
          GND 完整
        </text>

        {/* 介质 */}
        <rect x={500} y={162} width={340} height={46} fill="var(--pcb-fr4)" />
        <rect x={500} y={162} width={340} height={46} fill="url(#sp-hatch)" />
        <defs>
          <pattern id="sp-hatch" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2={7} stroke="var(--pcb-hatch)" strokeWidth={1} />
          </pattern>
        </defs>

        {/* 电源层（内缩 20H） */}
        <rect x={500 + 76} y={208} width={340 - 76} height={12} fill="var(--pcb-copper)" />
        <text x={834} y={217} textAnchor="end" className={styles.silkText} fontSize={10}>
          PWR 内缩
        </text>

        {/* 边缘辐射箭头：内缩处变淡 */}
        {[520, 546, 572].map((x, i) => (
          <g key={`fringe-${i}`} opacity={0.55}>
            <path d={`M${x} 150 Q${x - 16} 116 ${x - 4} 92`} fill="none" stroke="var(--pcb-callout)" strokeWidth={1.6} strokeDasharray="4 3" markerEnd="url(#sp-arrow)" />
          </g>
        ))}
        {[604, 630].map((x, i) => (
          <path
            key={`fringe2-${i}`}
            d={`M${x} 150 Q${x - 10} 124 ${x - 2} 108`}
            fill="none"
            stroke="var(--pcb-callout)"
            strokeWidth={1}
            strokeDasharray="2 4"
            opacity={0.3}
            markerEnd="url(#sp-arrow)"
          />
        ))}
        <text x={512} y={82} className={styles.panelSub} fontSize={11} fill="var(--pcb-callout)">
          fringing
        </text>

        {/* 尺寸：H 与 20H */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={536} y1={162} x2={536} y2={208} />
          <line x1={530} y1={162} x2={542} y2={162} />
          <line x1={530} y1={208} x2={542} y2={208} />
        </g>
        <text x={546} y={190} className={styles.dimText}>
          H
        </text>

        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={576} y1={140} x2={500 + 76} y2={140} />
          <line x1={576} y1={134} x2={576} y2={146} />
          <line x1={500 + 76} y1={134} x2={500 + 76} y2={146} />
        </g>
        <text x={600} y={134} className={styles.dimText}>
          20H
        </text>
        <Badge x={600} y={250} n={2} />
        <Pointer from={[640, 300]} to={[560, 214]} label="边缘电场被推离板边" sub="辐射与对外耦合一起下降" align="start" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 9. 差分对：俯视平面图（等宽 / 等距 / 等长 / 同参考面）
 * ========================================================================= */

export function DiffPairAnatomy() {
  return (
    <FigureShell
      no="FIG · 09"
      title="差分对：四条要求画在同一张图上"
      meta="俯视平面 · 对内间距 s、线宽 w"
      legend={[
        { n: 1, label: '等宽等距', hint: 'w 与 s 全程恒定，差分阻抗才稳定' },
        { n: 2, label: '对内等长', hint: '两条线长度差 <5 mil，相位差 → 共模噪声' },
        { n: 3, label: '对间 ≥3W', hint: '与相邻差分对或单线拉开距离' },
        { n: 4, label: '同层同参考面', hint: '换层要成对打孔，旁边配回流地孔' },
      ]}
      caption="差分对画出「两条线」，实际要管的是「一条线」：它的截面（w、s、h）决定 90 Ω 或 100 Ω 的差分阻抗，它的长度差决定共模噪声，它的相邻关系决定串扰。"
      note="为什么长度差会变成共模噪声：差分接收端只看两条线的电位差，长度不等意味着两条线上的信号有相位差，这个相位差在接收端无法被完全抵消，一部分能量就转成了共模——它既辐射，也更容易被外部干扰。"
    >
      <svg viewBox="0 0 900 460" role="img" aria-labelledby="fig-dp-title" className={styles.svg}>
        <title id="fig-dp-title">
          差分对俯视图：两条平行等宽走线从左侧引脚出发，经过两个四十五度折弯后在右侧汇合到连接器，内侧线有一段额外的蛇形补偿以消除长度差，旁边有另一条单线距离三倍线宽
        </title>

        <rect x={50} y={60} width={800} height={330} rx={12} fill="var(--pcb-mask)" stroke="var(--pcb-edge)" strokeWidth={2} />

        {/* 相邻单线（对间距离示意） */}
        <path d="M70 130 H820" fill="none" stroke="var(--pcb-trace-top)" strokeWidth={10} opacity={0.55} />
        <text x={80} y={116} className={styles.silkText} fontSize={10}>
          相邻信号
        </text>

        {/* 差分对：两条 45° 折线 */}
        <path d="M70 230 H360 L420 290 H560 L620 230 H820" fill="none" stroke="var(--pcb-copper)" strokeWidth={12} />
        <path d="M70 268 H352 L412 328 H552 L612 268 H820" fill="none" stroke="var(--pcb-copper)" strokeWidth={12} />

        {/* 内侧补偿段 */}
        <path d="M700 268 v-26 h14 v26 h14 v-26 h14 v26" fill="none" stroke="var(--pcb-copper)" strokeWidth={12} />

        {/* 尺寸：s */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={150} y1={236} x2={150} y2={262} />
          <line x1={144} y1={236} x2={156} y2={236} />
          <line x1={144} y1={262} x2={156} y2={262} />
        </g>
        <text x={160} y={254} className={styles.silkText} fontSize={10}>
          s
        </text>

        {/* 尺寸：w */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={250} y1={224} x2={250} y2={236} />
          <line x1={244} y1={224} x2={256} y2={224} />
          <line x1={244} y1={236} x2={256} y2={236} />
        </g>
        <text x={260} y={234} className={styles.silkText} fontSize={10}>
          w
        </text>

        {/* 尺寸：对间 3W */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none" opacity={0.9}>
          <line x1={480} y1={136} x2={480} y2={224} />
          <line x1={474} y1={136} x2={486} y2={136} />
          <line x1={474} y1={224} x2={486} y2={224} />
        </g>
        <rect x={456} y={168} width={48} height={22} rx={4} fill="var(--pcb-mask)" />
        <text x={480} y={184} textAnchor="middle" className={styles.silkText} fontSize={11}>
          ≥3W
        </text>

        {/* 等长标记 */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none" strokeDasharray="4 3">
          <path d="M70 330 q 330 40 750 0" />
        </g>
        <text x={444} y={358} textAnchor="middle" className={styles.silkText} fontSize={10}>
          L₁ = L₂ ± 5 mil
        </text>

        {/* 焊盘出线口 */}
        {[230, 268].map((y, i) => (
          <circle key={`pad-${i}`} cx={62} cy={y} r={9} fill="var(--pcb-copper)" stroke="var(--pcb-copper-3)" strokeWidth={1.2} />
        ))}

        <Badge x={340} y={200} n={1} />
        <Badge x={748} y={300} n={2} />
        <Badge x={480} y={104} n={3} />
        <Badge x={70} y={210} n={4} />

        <Pointer from={[640, 120]} to={[482, 176]} label="对间间距" sub="相邻对之间也要拉开" align="start" />
        <Pointer from={[796, 380]} to={[728, 268]} label="相位补偿" sub="只在内侧补，且分散补" align="end" />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 10. 等长与蛇形：补偿段的尺寸约束
 * ========================================================================= */

export function LengthTuning() {
  return (
    <FigureShell
      no="FIG · 10"
      title="蛇形绕线：长度是补出来的，不是随手绕出来的"
      meta="俯视平面 · 尺寸单位为线宽 W"
      legend={[
        { n: 1, label: '单段 ≥3W', hint: '短于 3W 的折段自身也会耦合' },
        { n: 2, label: '蛇形间距 ≥4W', hint: '相邻折段之间不能互相串扰' },
        { n: 3, label: '分散补偿', hint: '不要在一处密集绕，沿路径均匀补' },
        { n: 4, label: '长度报告可查', hint: 'DDR / 时钟组要出等长报告' },
      ]}
      caption="等长不是「把短的绕长」这么简单：绕出来的每一段本身都是耦合结构，绕得太密，补偿长度还不如新引入的串扰代价大。所以有 3W 与 4W 两条下限。"
      note="补偿量怎么算：每绕一个 U 形折段，长度大约增加 2 × 折段高度。需要的补偿量先由等长报告给出（例如某根 DQ 短 120 mil），再换算成折段数量，而不是凭手感绕。"
    >
      <svg viewBox="0 0 900 420" role="img" aria-labelledby="fig-lt-title" className={styles.svg}>
        <title id="fig-lt-title">
          蛇形绕线俯视图：一条走线从左侧进入，在两个位置各绕出三段 U 形折段，单段高度为三倍线宽，折段间距为四倍线宽
        </title>

        <rect x={50} y={70} width={800} height={280} rx={12} fill="var(--pcb-mask)" stroke="var(--pcb-edge)" strokeWidth={2} />

        {/* 主走线：两处绕线 */}
        <path
          d="M70 240 H210 v-60 h26 v60 h26 v-60 h26 v60 H470 v-48 h24 v48 h24 v-48 h24 v48 H830"
          fill="none"
          stroke="var(--pcb-copper)"
          strokeWidth={11}
        />

        {/* 尺寸：单段 3W（折段高度） */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={196} y1={180} x2={196} y2={240} />
          <line x1={190} y1={180} x2={202} y2={180} />
          <line x1={190} y1={240} x2={202} y2={240} />
        </g>
        <text x={188} y={214} textAnchor="end" className={styles.silkText} fontSize={10}>
          ≥3W
        </text>

        {/* 尺寸：间距 4W */}
        <g stroke="var(--pcb-silk)" strokeWidth={1} fill="none">
          <line x1={186} y1={300} x2={248} y2={300} />
          <line x1={186} y1={294} x2={186} y2={306} />
          <line x1={248} y1={294} x2={248} y2={306} />
        </g>
        <text x={217} y={320} textAnchor="middle" className={styles.silkText} fontSize={10}>
          ≥4W
        </text>

        {/* 直通参考线（同一组的另一根线） */}
        <path d="M70 340 H830" fill="none" stroke="var(--pcb-trace-top)" strokeWidth={9} opacity={0.5} />
        <text x={80} y={362} className={styles.silkText} fontSize={10}>
          同组其他信号
        </text>
        <text x={700} y={132} className={styles.silkText} fontSize={10} opacity={0.85}>
          只补够，不多补
        </text>

        <Badge x={236} y={168} n={1} />
        <Badge x={217} y={286} n={2} />
        <Badge x={560} y={200} n={3} />
        <Badge x={818} y={262} n={4} />

        <Pointer from={[520, 330]} to={[480, 262]} label="第二处只绕一段" sub="差额被分散到两处" align="start" />
      </svg>
    </FigureShell>
  );
}
