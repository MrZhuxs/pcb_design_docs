import styles from '../pcb/pcb-figures.module.css';
import { Badge, FigureShell, Pointer } from '../pcb/pcb-figures';

/**
 * 电阻的机械结构类插图：封装怎么装在板上、贴片电阻里面是什么。
 */

const hatch = (id: string, stroke: string, w: number, gap: number, angle = 45) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <line x1="0" y1="0" x2="0" y2={gap} stroke={stroke} strokeWidth={w} />
  </pattern>
);

/* =========================================================================
 * 1. 两种安装方式：引脚穿过孔 / 平贴在焊盘上
 * ========================================================================= */

export function MountTypes({ no = 'FIG · 01' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="两种安装方式：引脚穿过孔，还是平贴在焊盘上"
      meta="剖面 · THT / SMT"
      plain
      legend={[
        { swatch: 'component', label: '封装本体', hint: '电阻的陶瓷体与外壳' },
        { swatch: 'copper', label: '焊盘', hint: '露铜、上锡的那块铜皮' },
        { swatch: 'solder', label: '焊锡', hint: '成型的焊点（焊缝）' },
        { swatch: 'via', label: '引脚', hint: '金属引线或端头' },
      ]}
      caption="两张剖面图唯一的区别是焊点在哪一面：直插的焊点全在背面，元件本体在正面；贴片的焊点与元件在同一面，板子不用钻孔。这条差别决定了后面所有的工艺选择：要不要过波峰焊、能不能双面贴、拆焊难不难。"
      note="直插的孔既是机械固定，也是电气连接；贴片没有孔，全靠焊盘上的那点焊锡把机械与电气一起承担——所以贴片焊盘对「焊锡量」比直插敏感得多。"
    >
      <svg viewBox="0 0 900 470" role="img" aria-labelledby="fig-mount-title" className={styles.svg}>
        <title id="fig-mount-title">两种安装方式剖面：直插的引脚穿过 PCB 在背面成焊点，贴片的引脚平贴在正面焊盘上</title>
        <defs>
          {hatch('mount-fr4', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('mount-fr4b', 'var(--pcb-hatch-2)', 1, 7, -45)}
        </defs>

        {/* ---------- ① 直插 ---------- */}
        <text x={90} y={36} className={styles.panelTitle}>
          ① 直插 · Through-Hole（THT / DIP）
        </text>
        <text x={90} y={55} className={styles.panelSub}>
          引脚【穿过】PCB 的孔，焊锡在背面成型
        </text>

        {/* 板 */}
        <rect x={90} y={140} width={530} height={40} fill="var(--pcb-fr4)" />
        <rect x={90} y={140} width={530} height={40} fill="url(#mount-fr4)" />
        <rect x={90} y={140} width={530} height={40} fill="url(#mount-fr4b)" />
        <rect x={90} y={136} width={530} height={4} fill="var(--pcb-copper)" />
        <rect x={90} y={184} width={530} height={4} fill="var(--pcb-copper)" />
        <rect x={90} y={136} width={530} height={52} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* 本体 */}
        <rect x={200} y={74} width={320} height={58} rx={3} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
        <text x={360} y={109} textAnchor="middle" className={styles.panelMeta}>
          电阻本体（正面）
        </text>

        {/* 引脚 + 孔 + 焊点 */}
        {[270, 450].map((x) => (
          <g key={`tht-${x}`}>
            <line x1={x} y1={132} x2={x} y2={206} stroke="var(--pcb-via)" strokeWidth={6} strokeLinecap="round" />
            <circle cx={x} cy={138} r={14} fill="var(--pcb-copper)" />
            <circle cx={x} cy={138} r={6.5} fill="var(--pcb-substrate)" stroke="var(--pcb-ink)" strokeWidth={1} />
            <circle cx={x} cy={186} r={14} fill="var(--pcb-copper)" />
            <path d={`M ${x - 15} 188 L ${x + 15} 188 L ${x + 10} 206 L ${x - 10} 206 Z`} fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
          </g>
        ))}

        <Pointer from={[650, 120]} to={[521, 104]} label="元件在【正面】" sub="看得见、好更换" />
        <Pointer from={[650, 160]} to={[464, 158]} label="引脚穿过孔" sub="孔既是电气连接也是机械固定" />
        <Pointer from={[650, 214]} to={[465, 200]} label="焊锡在【背面】" sub="波峰焊 / 手工烙铁都从这一面成型" />

        {/* ---------- ② 贴片 ---------- */}
        <text x={90} y={272} className={styles.panelTitle}>
          ② 贴片 · SMD / SMT
        </text>
        <text x={90} y={291} className={styles.panelSub}>
          引脚【平贴】在表面焊盘上，同一面成焊点，不钻孔
        </text>

        {/* 板 */}
        <rect x={90} y={330} width={530} height={40} fill="var(--pcb-fr4)" />
        <rect x={90} y={330} width={530} height={40} fill="url(#mount-fr4)" />
        <rect x={90} y={330} width={530} height={40} fill="url(#mount-fr4b)" />
        <rect x={90} y={326} width={530} height={4} fill="var(--pcb-copper)" />
        <rect x={90} y={370} width={530} height={4} fill="var(--pcb-copper)" />
        <rect x={90} y={326} width={530} height={48} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* 焊盘 */}
        <rect x={228} y={320} width={92} height={10} fill="var(--pcb-copper)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
        <rect x={390} y={320} width={92} height={10} fill="var(--pcb-copper)" stroke="var(--pcb-ink)" strokeWidth={0.9} />

        {/* 本体（端头压在焊盘上） */}
        <rect x={250} y={266} width={210} height={56} rx={2} fill="var(--pcb-component)" stroke="var(--pcb-ink)" strokeWidth={1.4} />
        <rect x={250} y={266} width={34} height={56} fill="var(--pcb-silver)" stroke="var(--pcb-ink)" strokeWidth={1} />
        <rect x={426} y={266} width={34} height={56} fill="var(--pcb-silver)" stroke="var(--pcb-ink)" strokeWidth={1} />
        <text x={355} y={299} textAnchor="middle" className={styles.panelMeta}>
          本体与焊点同一面
        </text>

        {/* 焊缝 */}
        <path d="M 226 322 L 250 322 L 254 334 L 226 334 Z" fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
        <path d="M 460 322 L 484 322 L 484 334 L 456 334 Z" fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={0.9} />

        <Pointer from={[650, 300]} to={[461, 292]} label="焊锡在【同一面】" sub="回流焊一次成型" />
        <Pointer from={[650, 340]} to={[462, 330]} label="焊盘即全部连接" sub="没有孔——机械与电气都靠焊点" />

        <text x={90} y={404} className={styles.panelMeta}>
          判断口诀：板子背面有没有穿出来的引脚——有就是直插，没有就是贴片
        </text>
      </svg>
    </FigureShell>
  );
}

/* =========================================================================
 * 2. 贴片电阻的六层结构
 * ========================================================================= */

export function SmdResistorAnatomy({ no = 'FIG · 02' }: { no?: string }) {
  return (
    <FigureShell
      no={no}
      title="一颗贴片电阻切开是什么样"
      meta="剖面 · 6 层 · 0402–2512 通用"
      plain
      legend={[
        { n: 1, label: '电阻膜', hint: '厚膜印刷 / 薄膜溅射，真正决定阻值的一层' },
        { n: 2, label: '保护层', hint: '玻璃或树脂，防潮防机械损伤' },
        { n: 3, label: '陶瓷基板', hint: '氧化铝 Al₂O₃，绝缘兼散热载体' },
        { n: 4, label: '端电极', hint: '三层镀（Ag / Ni / Sn），负责可焊性' },
        { n: 5, label: '焊盘', hint: '板上的铜皮，datasheet 推荐尺寸' },
        { n: 6, label: '焊锡', hint: '焊缝形状决定焊接强度与可靠性' },
      ]}
      caption="阻值只由第 ① 层决定，但可靠性由 ④⑤⑥ 三层共同决定：端电极的可焊性、焊盘尺寸、焊缝形貌，任何一环出问题，阻值再准也白搭。这就是「封装与阻值无关，却与可靠性有关」的物理原因。"
      note="端电极是三明治结构：内层银与电阻膜接触，中间镍阻挡层防止锡向内部扩散，外层锡保证润湿。所谓「可焊性不良」，八成是镍层氧化或锡层太薄。"
    >
      <svg viewBox="0 0 900 440" role="img" aria-labelledby="fig-smd-title" className={styles.svg}>
        <title id="fig-smd-title">贴片电阻剖面：电阻膜、保护层、陶瓷基板、两端端电极，以及下方焊盘与焊锡</title>
        <defs>
          {hatch('smd-fr4', 'var(--pcb-hatch)', 1, 7, 45)}
          {hatch('smd-fr4b', 'var(--pcb-hatch-2)', 1, 7, -45)}
          {hatch('smd-ceramic', 'var(--pcb-hatch)', 1, 6, 45)}
        </defs>

        {/* 板 */}
        <rect x={80} y={330} width={600} height={44} fill="var(--pcb-fr4)" />
        <rect x={80} y={330} width={600} height={44} fill="url(#smd-fr4)" />
        <rect x={80} y={330} width={600} height={44} fill="url(#smd-fr4b)" />
        <rect x={80} y={326} width={600} height={4} fill="var(--pcb-copper)" />
        <rect x={80} y={374} width={600} height={4} fill="var(--pcb-copper)" />
        <rect x={80} y={326} width={600} height={52} fill="none" stroke="var(--pcb-ink)" strokeWidth={1.4} />

        {/* ⑤ 焊盘 */}
        <rect x={204} y={318} width={132} height={12} fill="var(--pcb-copper)" stroke="var(--pcb-ink)" strokeWidth={1} />
        <rect x={424} y={318} width={132} height={12} fill="var(--pcb-copper)" stroke="var(--pcb-ink)" strokeWidth={1} />

        {/* ③ 陶瓷基板 */}
        <rect x={238} y={288} width={284} height={32} fill="var(--pcb-substrate-2)" stroke="var(--pcb-ink)" strokeWidth={1.3} />
        <rect x={238} y={288} width={284} height={32} fill="url(#smd-ceramic)" opacity="0.55" />

        {/* ① 电阻膜 */}
        <rect x={300} y={270} width={160} height={18} fill="var(--pcb-copper)" stroke="var(--pcb-ink)" strokeWidth={1.1} />

        {/* ② 保护层 */}
        <rect x={238} y={248} width={284} height={22} fill="var(--pcb-mask)" opacity="0.55" stroke="var(--pcb-ink)" strokeWidth={1.1} />

        {/* ④ 端电极（两端三明治） */}
        {[238, 452].map((x) => (
          <g key={`cap-${x}`}>
            <rect x={x} y={248} width={70} height={72} fill="var(--pcb-silver)" stroke="var(--pcb-ink)" strokeWidth={1.2} />
            <line x1={x + 12} y1={250} x2={x + 12} y2={318} stroke="var(--pcb-ink)" strokeWidth={0.8} opacity="0.45" />
            <line x1={x + 24} y1={250} x2={x + 24} y2={318} stroke="var(--pcb-ink)" strokeWidth="0.8" opacity="0.45" />
          </g>
        ))}

        {/* ⑥ 焊锡（两侧焊缝） */}
        <path d="M 208 320 L 242 320 L 240 334 L 204 334 Z" fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={0.9} />
        <path d="M 518 320 L 552 320 L 556 334 L 520 334 Z" fill="var(--pcb-solder)" stroke="var(--pcb-ink)" strokeWidth={0.9} />

        {/* 编号与引线 */}
        <Badge x={388} y={279} n={1} />
        <Badge x={224} y={259} n={2} />
        <Badge x={224} y={304} n={3} />
        <Badge x={320} y={266} n={4} />
        <Badge x={196} y={324} n={5} />
        <Badge x={196} y={348} n={6} />

        <Pointer from={[560, 270]} to={[462, 279]} label="① 电阻膜" sub="阻值由这一层的方阻与图形长度决定" />
        <Pointer from={[560, 300]} to={[524, 258]} label="② 保护层" sub="玻璃 / 树脂，防潮与防划伤" />
        <Pointer from={[560, 330]} to={[524, 304]} label="③ 陶瓷基板" sub="Al₂O₃：绝缘 + 散热载体" />
        <Pointer from={[90, 300]} to={[240, 284]} label="④ 端电极" sub="Ag / Ni / Sn 三层镀" align="start" />
        <Pointer from={[700, 300]} to={[516, 324]} label="⑤ 焊盘" sub="按 datasheet 推荐尺寸建库" />
        <Pointer from={[700, 366]} to={[540, 330]} label="⑥ 焊锡" sub="焊缝形状决定强度" />

        <text x={80} y={404} className={styles.panelMeta}>
          同一张图也解释了「为什么贴片电阻怕弯板」：弯折时陶瓷基板与端电极之间会产生剪切应力，裂纹往往从端电极根部开始
        </text>
      </svg>
    </FigureShell>
  );
}
