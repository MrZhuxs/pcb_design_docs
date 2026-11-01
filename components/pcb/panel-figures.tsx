import { Badge, FigureShell, Pointer } from './pcb-figures';
import styles from './pcb-figures.module.css';

/**
 * 拼板（Panelization）类插图。
 *
 * FIG 19 是「同一个问题的两种解」：V-CUT 与邮票孔，各配俯视 + 剖面对照；
 * FIG 20 是整张生产板的平面布置：工艺边、Mark 点、定位孔、板间距。
 * 两图共用 1 mm ≈ 8 单位的比例，所以尺寸标注可以互相印证。
 */

const MM = 8; // 1 mm = 8 单位

/* =========================================================================
 * 19. V-CUT vs 邮票孔
 * ========================================================================= */

export function VcutVsMousebite() {
  const t = 48; // 板厚（示意）
  const vDepth = t / 3;

  return (
    <FigureShell
      no="FIG · 19"
      title="分板的两条路：切一条 V 槽，或者留一排小孔"
      meta="俯视 + 剖面 · 单位 mm"
      legend={[
        { n: 1, label: 'V-CUT 线', hint: '只在板边切，切深约板厚 1/3，留下中间的连接筋' },
        { n: 2, label: '邮票孔', hint: '孔径 0.5–0.8 mm、孔距 0.8–1.2 mm，像邮票齿' },
        { n: 3, label: '连接筋 / 桥', hint: '分板时掰断的就是这里，所以元件要离远一点' },
        { n: 4, label: '元件禁布距离', hint: 'V-CUT 线两侧各留 ≥5 mm' },
      ]}
      caption="V-CUT 便宜、分板后板边整齐无毛刺，但只能切直线，而且元件必须离切口 ≥5 mm，否则掰板时的应力会直接把焊点扯裂。邮票孔能走任意形状（异形板、圆板）、分板应力小，代价是贵一点、分完还要修毛刺。"
      note="为什么 V-CUT 只能走直线：它是一把 V 形铣刀沿一条直道推过去，正反两面各切一刀，形成上下对称的两道 V 槽。要拐弯就得抬刀，槽就断了——等于没切。"
    >
      <svg viewBox="0 0 900 480" role="img" aria-labelledby="fig-vcut-title" className={styles.svg}>
        <title id="fig-vcut-title">
          V割与邮票孔对比：上排为 V 割，俯视是沿直线切出的 V 槽、旁边标注元件禁布五毫米，剖面显示上下各切入约板厚三分之一、中间留下连接筋；下排为邮票孔，俯视为一排小孔、标注孔径与孔距，剖面为铣穿的槽与细桥
        </title>

        {/* ================= 上排：V-CUT ================= */}
        <text x={40} y={44} className={styles.panelTitle}>
          ① V-CUT（V 割）
        </text>
        <text x={40} y={64} className={styles.panelSub}>
          直线、便宜、板边整齐 · 元件离切口 ≥5 mm
        </text>

        {/* 俯视 */}
        <rect x={40} y={86} width={220} height={140} rx={3} fill="var(--pcb-mask)" opacity={0.28} />
        <rect x={276} y={86} width={220} height={140} rx={3} fill="var(--pcb-mask)" opacity={0.28} />
        <line x1={268} y1={86} x2={268} y2={226} stroke="var(--pcb-callout)" strokeWidth={2.4} strokeDasharray="9 5" />
        <text x={150} y={112} textAnchor="middle" className={styles.panelMeta}>
          小板 A
        </text>
        <text x={386} y={112} textAnchor="middle" className={styles.panelMeta}>
          小板 B
        </text>

        {/* 5 mm 禁布 */}
        <rect x={268 - 5 * MM} y={130} width={10 * MM} height={70} fill="var(--pcb-callout)" opacity={0.1} />
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={268 - 5 * MM} y1={208} x2={268} y2={208} />
          <line x1={268 - 5 * MM} y1={203} x2={268 - 5 * MM} y2={213} />
          <line x1={268} y1={203} x2={268} y2={213} />
        </g>
        <text x={268 - 2.5 * MM} y={198} textAnchor="middle" className={styles.dimText}>
          5
        </text>
        <Badge x={256} y={120} n={4} />

        {/* 剖面 */}
        <text x={540} y={100} className={styles.dimText}>
          剖面 A–A
        </text>
        <g>
          <rect x={560} y={120} width={280} height={t} fill="var(--pcb-substrate)" stroke="var(--pcb-edge)" strokeWidth={1} />
          {/* 上下 V 槽 */}
          <path d={`M${700 - 26} 120 L700 ${120 + vDepth} L${700 + 26} 120 z`} fill="var(--pcb-substrate-2)" stroke="var(--pcb-callout)" strokeWidth={1.6} />
          <path d={`M${700 - 26} ${120 + t} L700 ${120 + t - vDepth} L${700 + 26} ${120 + t} z`} fill="var(--pcb-substrate-2)" stroke="var(--pcb-callout)" strokeWidth={1.6} />
          {/* 连接筋尺寸 */}
          <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
            <line x1={730} y1={120 + vDepth} x2={762} y2={120 + vDepth} />
            <line x1={730} y1={120 + t - vDepth} x2={762} y2={120 + t - vDepth} />
            <line x1={752} y1={120 + vDepth} x2={752} y2={120 + t - vDepth} />
          </g>
          <text x={768} y={120 + t / 2 + 4} className={styles.dimText}>
            1/3 t
          </text>
          {/* 板厚 */}
          <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
            <line x1={572} y1={120} x2={548} y2={120} />
            <line x1={572} y1={120 + t} x2={548} y2={120 + t} />
            <line x1={556} y1={120} x2={556} y2={120 + t} />
          </g>
          <text x={540} y={120 + t / 2 + 4} textAnchor="end" className={styles.dimText}>
            t
          </text>
          <Badge x={706} y={120 + vDepth + 4} n={1} />
          <Badge x={700} y={120 + t / 2 - 10} n={3} />
        </g>
        <text x={700} y={200} textAnchor="middle" className={styles.dimText}>
          上下对称切 → 掰断后无毛刺
        </text>

        {/* ================= 下排：邮票孔 ================= */}
        <text x={40} y={272} className={styles.panelTitle}>
          ② 邮票孔（Mouse Bite）
        </text>
        <text x={40} y={292} className={styles.panelSub}>
          任意形状、应力小 · 分板后有毛刺需修整
        </text>

        {/* 俯视 */}
        <rect x={40} y={314} width={196} height={130} rx={3} fill="var(--pcb-mask)" opacity={0.28} />
        <rect x={300} y={314} width={196} height={130} rx={3} fill="var(--pcb-mask)" opacity={0.28} />
        <text x={138} y={340} textAnchor="middle" className={styles.panelMeta}>
          小板 A
        </text>
        <text x={398} y={340} textAnchor="middle" className={styles.panelMeta}>
          小板 B
        </text>
        {/* 桥 + 孔 */}
        <rect x={236} y={314} width={64} height={130} fill="var(--pcb-substrate)" stroke="var(--pcb-edge)" strokeWidth={1} />
        {Array.from({ length: 7 }, (_, i) => (
          <circle key={`mb-${i}`} cx={268} cy={330 + i * 17} r={4} fill="var(--pcb-hole)" />
        ))}
        <Badge x={288} y={322} n={2} />
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={236} y1={460} x2={300} y2={460} />
          <line x1={236} y1={455} x2={236} y2={465} />
          <line x1={300} y1={455} x2={300} y2={465} />
        </g>
        <text x={268} y={478} textAnchor="middle" className={styles.dimText}>
          1.6–3.0（板间距）
        </text>

        {/* 剖面 */}
        <text x={540} y={330} className={styles.dimText}>
          剖面 A–A
        </text>
        <g>
          <rect x={560} y={350} width={96} height={t} fill="var(--pcb-substrate)" stroke="var(--pcb-edge)" strokeWidth={1} />
          <rect x={744} y={350} width={96} height={t} fill="var(--pcb-substrate)" stroke="var(--pcb-edge)" strokeWidth={1} />
          {/* 铣穿的槽 */}
          <rect x={656} y={350} width={88} height={t} fill="var(--pcb-substrate-2)" opacity={0.5} stroke="var(--pcb-edge)" strokeWidth={1} strokeDasharray="4 4" />
          {/* 桥 */}
          <rect x={686} y={350} width={28} height={t} fill="var(--pcb-substrate)" stroke="var(--pcb-callout)" strokeWidth={1.4} />
          <circle cx={700} cy={350 + t / 2} r={4} fill="var(--pcb-hole)" />
          <text x={700} y={350 + t + 20} textAnchor="middle" className={styles.dimText}>
            桥 · 掰断处
          </text>
          <Badge x={712} y={350 + 6} n={3} />
          <Badge x={672} y={350 + 6} n={2} />
        </g>
        <text x={700} y={424} textAnchor="middle" className={styles.dimText}>
          铣槽 + 留桥 → 可走曲线
        </text>

        <Pointer
          from={[300, 236]}
          to={[268, 214]}
          label="一刀直线切过去，所以做不了异形板"
          sub="V-CUT 的物理上限就在这里"
          align="start"
        />
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 20. 整张生产板：工艺边 / Mark 点 / 定位孔 / 板间距
 * ========================================================================= */

export function PanelLayout() {
  const px0 = 150;
  const px1 = 750;
  const py0 = 62;
  const py1 = 470;
  const rail = 40;

  const boards = [
    { x: px0 + rail, y: py0 + rail, w: 252, h: 157, name: 'B1' },
    { x: px0 + rail + 268, y: py0 + rail, w: 252, h: 157, name: 'B2' },
    { x: px0 + rail, y: py0 + rail + 173, w: 252, h: 157, name: 'B3' },
    { x: px0 + rail + 268, y: py0 + rail + 173, w: 252, h: 157, name: 'B4' },
  ];

  const marks = [
    { x: px0 + 20, y: py0 + 20 },
    { x: px1 - 20, y: py0 + 20 },
    { x: px0 + 20, y: py1 - 20 },
  ];

  return (
    <FigureShell
      no="FIG · 20"
      title="一张生产板上的四类「非电路」要素"
      meta="俯视平面 · 按 1 mm ≈ 8 单位绘制"
      legend={[
        { n: 1, label: '工艺边 Rail', hint: '≥5 mm，给 SMT 设备传送夹持，分板后去掉' },
        { n: 2, label: 'Mark 点', hint: '⌀1 mm 裸铜、开窗 ⌀2 mm、周围 3 mm 无铜无丝印，至少 3 个' },
        { n: 3, label: '定位孔 Tooling Hole', hint: '⌀2.0–3.0 mm，非金属化，测试架/工装用' },
        { n: 4, label: '板间距', hint: '1.6–3.0 mm，V-CUT 取小、邮票孔取大' },
        { n: 5, label: 'V-CUT 分板线', hint: '同一拼板内所有小板方向一致' },
      ]}
      caption="拼板把单块小板变成一整张生产板，是为了让 SMT 线跑得动：太小的板会卡在传送轨道上、印刷与贴片也抓不稳。代价是这一圈「非电路」的空间——工艺边、Mark 点、定位孔、板间距，全都要从板面积里扣出来。"
      note="Mark 点为什么是「铜盘 1 mm、开窗 2 mm」：贴片机的相机看的是「铜与阻焊的反差」，开窗比铜盘大一圈，才能保证铜盘边缘没有阻焊搭边；周围 3 mm 不许有别的铜和丝印，是为了让算法能干净地找到它的重心。"
    >
      <svg viewBox="0 0 900 520" role="img" aria-labelledby="fig-panel-title" className={styles.svg}>
        <title id="fig-panel-title">
          拼板平面布置图：外围是工艺边，内部是二乘二排列的四块小板，板与板之间留间距并以 V 割线分开，三个角上有 Mark 点，两侧工艺边上各有一个定位孔
        </title>

        {/* 生产板外形 */}
        <rect x={px0} y={py0} width={px1 - px0} height={py1 - py0} fill="var(--pcb-substrate)" stroke="var(--pcb-edge)" strokeWidth={1.6} rx={2} />

        {/* 工艺边：用剖面线示意「最后会被去掉」 */}
        <defs>
          <pattern id="pnl-hatch" width={8} height={8} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1={0} y1={0} x2={0} y2={8} stroke="var(--pcb-hatch-2)" strokeWidth={2} />
          </pattern>
        </defs>
        <rect x={px0} y={py0} width={px1 - px0} height={rail} fill="url(#pnl-hatch)" opacity={0.65} />
        <rect x={px0} y={py1 - rail} width={px1 - px0} height={rail} fill="url(#pnl-hatch)" opacity={0.65} />
        <rect x={px0} y={py0} width={rail} height={py1 - py0} fill="url(#pnl-hatch)" opacity={0.65} />
        <rect x={px1 - rail} y={py0} width={rail} height={py1 - py0} fill="url(#pnl-hatch)" opacity={0.65} />

        {/* 小板 */}
        {boards.map((b) => (
          <g key={b.name}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="var(--pcb-mask)" opacity={0.42} stroke="var(--pcb-hair-strong)" strokeWidth={1} />
            <text x={b.x + b.w / 2} y={b.y + b.h / 2} textAnchor="middle" className={styles.panelMeta}>
              {b.name}
            </text>
          </g>
        ))}

        {/* V-CUT 线 */}
        <line x1={px0 + rail + 252 + 8} y1={py0 + rail} x2={px0 + rail + 252 + 8} y2={py1 - rail} stroke="var(--pcb-callout)" strokeWidth={2.2} strokeDasharray="10 6" />
        <line x1={px0 + rail} y1={py0 + rail + 157 + 8} x2={px1 - rail} y2={py0 + rail + 157 + 8} stroke="var(--pcb-callout)" strokeWidth={2.2} strokeDasharray="10 6" />

        {/* Mark 点 */}
        {marks.map((m, i) => (
          <g key={`mk-${i}`}>
            <circle cx={m.x} cy={m.y} r={2 * MM} fill="none" stroke="var(--pcb-silk)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={m.x} cy={m.y} r={MM} fill="var(--pcb-copper)" stroke="var(--pcb-silk)" strokeWidth={0.8} />
          </g>
        ))}

        {/* 定位孔 */}
        {[
          { x: px0 + 20, y: (py0 + py1) / 2 },
          { x: px1 - 20, y: (py0 + py1) / 2 },
        ].map((h, i) => (
          <g key={`th-${i}`}>
            <circle cx={h.x} cy={h.y} r={12} fill="none" stroke="var(--pcb-silk)" strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={h.x} cy={h.y} r={9} fill="var(--pcb-hole)" />
          </g>
        ))}

        {/* 工艺边尺寸 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={px1 + 16} y1={py0} x2={px1 + 16} y2={py0 + rail} />
          <line x1={px1 + 11} y1={py0} x2={px1 + 21} y2={py0} />
          <line x1={px1 + 11} y1={py0 + rail} x2={px1 + 21} y2={py0 + rail} />
        </g>
        <text x={px1 + 30} y={py0 + rail / 2 + 4} className={styles.dimText}>
          ≥5
        </text>

        {/* 板间距尺寸 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={px0 + rail + 252} y1={py1 - rail + 14} x2={px0 + rail + 268} y2={py1 - rail + 14} />
        </g>
        <text x={px0 + rail + 260} y={py1 - rail + 30} textAnchor="middle" className={styles.dimText}>
          1.6–3.0
        </text>

        {/* 总尺寸 */}
        <g stroke="var(--pcb-ink-dim)" strokeWidth={1} fill="none">
          <line x1={px0} y1={py0 - 22} x2={px1} y2={py0 - 22} />
          <line x1={px0} y1={py0 - 27} x2={px0} y2={py0 - 17} />
          <line x1={px1} y1={py0 - 27} x2={px1} y2={py0 - 17} />
        </g>
        <text x={(px0 + px1) / 2} y={py0 - 28} textAnchor="middle" className={styles.dimText}>
          生产板外形（Panel）
        </text>

        <Badge x={px0 + 60} y={py0 + rail / 2} n={1} />
        <Badge x={marks[0].x + 16} y={marks[0].y + 12} n={2} />
        <Badge x={px0 + 32} y={(py0 + py1) / 2 - 18} n={3} />
        <Badge x={px0 + rail + 250} y={py1 - rail + 4} n={4} />
        <Badge x={px0 + rail + 254} y={py0 + rail + 20} n={5} />

        <Pointer
          from={[300, 500]}
          to={[px0 + 130, py1 - 18]}
          label="工艺边分板后整条去掉，不留在成品上"
          sub="所以这里不许放任何需要保留的东西"
          align="start"
        />
      </svg>
    </FigureShell>
  );
}
