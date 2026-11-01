import type { ReactNode } from 'react';
import styles from './pcb-figures.module.css';
import { FigureShell } from './pcb-figures';

/**
 * 速记类插图。
 *
 * 与 pcb-figures.tsx 的「物件示意图」不同，这里的每张图都在做同一件事：
 * 把一章的结论压成一张可以反复回看的卡片墙 —— 铜色竖线当骨架、等宽字体当坐标、
 * 关键数字加粗。它们仍然套在同一个 FigureShell 里，所以编号、图注、明暗主题
 * 与实物剖面图完全一致。
 */

type FigProps = { no?: string };

type RowSpec = { k: string; v: ReactNode };

function Card({
  k,
  title,
  rows,
  foot,
}: {
  k?: string;
  title: string;
  rows: RowSpec[];
  foot?: ReactNode;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        {k && <span className={styles.cardKey}>{k}</span>}
        <span className={styles.cardTitle}>{title}</span>
      </div>
      <div className={styles.rows}>
        {rows.map((row) => (
          <div key={row.k} className={styles.row}>
            <span className={styles.rowKey}>{row.k}</span>
            <span className={styles.rowVal}>{row.v}</span>
          </div>
        ))}
      </div>
      {foot && <p className={styles.cardFoot}>{foot}</p>}
    </div>
  );
}

type StepSpec = { name: string; sub?: string; hot?: boolean };

function Chain({ groups }: { groups: { tag?: string; steps: StepSpec[] }[] }) {
  let counter = 0;
  return (
    <div className={styles.chain}>
      {groups.map((group, gi) => (
        <div key={gi} className={group.tag ? styles.chainGroup : undefined}>
          {group.tag && <span className={styles.groupTag}>{group.tag}</span>}
          {group.steps.map((step, si) => {
            counter += 1;
            return (
              <div key={`${gi}-${si}`} style={{ display: 'contents' }}>
                {si > 0 && (
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                )}
                <div className={step.hot ? `${styles.step} ${styles.stepHot}` : styles.step}>
                  <span className={styles.stepNo}>{String(counter).padStart(2, '0')}</span>
                  <span className={styles.stepName}>{step.name}</span>
                  {step.sub && <span className={styles.stepSub}>{step.sub}</span>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
 * 1. 从设计到打样：工具、产出与验证顺序
 * ========================================================================= */

export function SampleToolchain({ no = 'FIG · 08' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="从想法到第一块板：工具、产出与验证顺序"
      meta="速查 · EDA / 原理图 / 打样"
      plain
      caption="上半部分是「用什么画、画完要交什么」，下半部分那条链是拿到样板之后的通电顺序——顺序错了容易把器件烧掉。"
      note={
        <>
          分水岭：<b>出图之后每改一次都要花钱</b>。能在图纸上改的，别留到板子上改。
        </>
      }
    >
      <div className={styles.recap}>
        <Card
          k="EDA"
          title="四类工具，各管一段"
          rows={[
            { k: '组成', v: '原理图 + 仿真 + 版图 + 制造准备' },
            { k: '企业', v: 'Altium Designer，年费约 5 万元' },
            { k: '入门', v: '嘉立创 EDA：免费，打通商城与打样' },
          ]}
        />
        <Card
          k="SCH"
          title="原理图只管连接关系"
          rows={[
            { k: '回答', v: '谁和谁相连' },
            { k: '不描述', v: '位置与尺寸——那是版图的事' },
            {
              k: '产出',
              v: (
                <>
                  图（评审）+ <b>网表</b>（决定连通）+ <b>BOM</b>（决定采购与贴片）
                </>
              ),
            },
          ]}
        />
        <Card
          k="PCB"
          title="PCB 设计五件事"
          rows={[
            { k: '顺序', v: '元件选型 → 板框外形 → 布局 → 布线 → 丝印' },
            { k: '重心', v: '布局决定成败，布线只决定余量' },
          ]}
        />
        <Card
          k="打样"
          title="样板的目的与取舍"
          rows={[
            { k: '目的', v: '验证方案 / 验证功能性能 / 暴露潜在问题' },
            { k: 'SMT', v: '可选服务，额外收费' },
            { k: '建议', v: '样板先裸板自己焊，改起来快' },
          ]}
        />
      </div>
      <Chain
        groups={[
          {
            tag: '拿到样板后的通电顺序（别跳步）',
            steps: [
              { name: '测阻值', sub: '先查短路' },
              { name: '限流上电', sub: '限流电源' },
              { name: '分模块', sub: '一段段验' },
              { name: '边界条件', sub: '极限工况' },
              { name: '封闭测试', sub: '装壳老炼' },
            ],
          },
        ]}
      />
    </FigureShell>
  );
}

/* =========================================================================
 * 2. 制程链：十二步 / 十四步
 * ========================================================================= */

const TWELVE: StepSpec[] = [
  { name: '开料' },
  { name: '钻孔' },
  { name: '沉铜 / 电镀', sub: 'PTH' },
  { name: '贴干膜' },
  { name: '曝光显影' },
  { name: '蚀刻' },
  { name: '退膜' },
  { name: '阻焊' },
  { name: '表面处理' },
  { name: '丝印' },
  { name: '成型' },
  { name: '电测' },
];

export function FabProcessChain({
  no = 'FIG · 05',
  variant = 'twelve',
}: FigProps & { variant?: 'twelve' | 'fourteen' }) {
  if (variant === 'twelve') {
    return (
      <FigureShell
        no={no}
        title="双面板工艺链（12 步）"
        meta="制程 · 1930s 定型 · 七十年基本没变"
        plain
        caption="开料之后每一步都在回答同一个问题：铜怎么留在该留的地方、怎么去掉不该留的地方。贴干膜 + 曝光显影 + 蚀刻这三步就是「把图形变成铜」的全部秘密。"
        note="这条链的顺序七十年没变，变的只是每一环的精度——提高了两三个数量级。"
      >
        <Chain groups={[{ steps: TWELVE }]} />
      </FigureShell>
    );
  }

  return (
    <FigureShell
      no={no}
      title="多层板工艺链（14 步，四段）"
      meta="制程 · 4 段 · 内层 / 压合与孔 / 外层 / 收尾"
      plain
      caption="1–4 步只做内层；5–7 步把多层压成一块并把孔打通；8–11 步再做一遍外层图形并盖上油墨；12–14 步是通断与外观的终检。每一步失败都在后面才暴露，所以过程检验（AOI、切片）比终检更能救命。"
      note={
        <>
          <b>铜厚</b>：1 oz ≈ 35 µm；<b>孔铜</b>：化学沉铜 0.3–0.5 µm + 电镀到 20–25 µm。
        </>
      }
    >
      <Chain
        groups={[
          {
            tag: '① 内层 · 先把里面的铜画出来',
            steps: [
              { name: '开料' },
              { name: '内层图形', sub: '贴膜/曝光/显影/蚀刻/去膜' },
              { name: '内层 AOI', sub: '查图形缺陷' },
              { name: '棕化', sub: '粗化铜面提附着力' },
            ],
          },
          {
            tag: '② 压合与孔 · 叠成一块板并打通',
            steps: [
              { name: '层压', sub: 'PP 片 + 铜箔，180–200 ℃' },
              { name: '钻孔', sub: '通孔 / 盲孔 / 埋孔' },
              { name: '孔金属化', sub: '除胶渣/活化/沉铜/电镀', hot: true },
            ],
          },
          {
            tag: '③ 外层 · 再做一遍图形，盖上油墨',
            steps: [
              { name: '外层图形' },
              { name: '阻焊', sub: '只在焊盘开窗' },
              { name: '丝印', sub: '位号 / 外框 / 极性' },
            ],
          },
          {
            tag: '④ 收尾 · 做成能焊、能测的样子',
            steps: [
              { name: '表面处理', sub: '喷锡 / 沉金 / OSP' },
              { name: '成型', sub: '铣边 / 分板' },
              { name: '电测', sub: '飞针或测试架' },
              { name: '终检' },
            ],
          },
        ]}
      />
    </FigureShell>
  );
}

/* =========================================================================
 * 3. 时间轴：从电堆到封装级互连
 * ========================================================================= */

const MILESTONES: { year: string; text: ReactNode }[] = [
  { year: '1800', text: <>伏打电堆：电路实验终于有了电源</> },
  { year: '1833', text: <>法拉第电解定律：电镀的理论基础 → 后来的金属化孔</> },
  { year: '1845', text: <>基尔霍夫定律：电路成为可解的方程</> },
  { year: '1903–1925', text: <>箔材、印刷蚀刻、电镀图形：想法先到，产业没到</> },
  {
    year: '1936',
    text: (
      <>
        <b>Eisler 减成法</b>：覆铜 + 蚀刻 = 现代 PCB 原型
      </>
    ),
  },
  { year: '1943', text: <>近炸引信量产：PCBA 第一次通过大批量验证</> },
  {
    year: '1951',
    text: (
      <>
        <b>Auto-Sembly</b>：第一套可复制的制造规范
      </>
    ),
  },
  {
    year: '1950s 末',
    text: (
      <>
        <b>PTH 金属化孔</b>：双面板真正成立，孔成为设计对象
      </>
    ),
  },
  { year: '1958–1959', text: <>集成电路：板级互连被压缩到「连引脚、供电、散热」</> },
  { year: '1970s', text: <>多层板 + Gerber 数据标准 + 微处理器</> },
  { year: '1980s', text: <>SMT / BGA：焊盘取代孔，盲埋孔登场</> },
  { year: '1991', text: <>HDI 微孔（IBM SLC）：密度由叠层决定</> },
  { year: '2006', text: <>无铅化：材料、工艺窗口与设计一起重算</> },
  { year: '2000s→', text: <>高速：边沿而非频率定义「高速」，回流路径决定成败</> },
  { year: '今天', text: <>封装级互连：板与封装的边界在消失</> },
];

export function HistoryRail({ no = 'FIG · 03' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="两百年的时间线：每一步都在重新定义「连线」"
      meta="年表 · 15 个节点"
      plain
      caption="注意节奏：1900 年之前的三个节点都是「理论先到」，1936 年之后才是「产业落地」。这也解释了为什么 PCB 的规则几乎都能追到物理定律上——它们比工艺老得多。"
      note={
        <>
          一句话收尾：PCB 的历史，就是<b>「连线」这件事不断被重新定义的历史</b>。
        </>
      }
    >
      <div className={styles.rail}>
        {MILESTONES.map((m) => (
          <div key={m.year} className={styles.railRow}>
            <span className={styles.railYear}>{m.year}</span>
            <span className={styles.railTrack} aria-hidden>
              <span className={styles.railDot} />
            </span>
            <span className={styles.railText}>{m.text}</span>
          </div>
        ))}
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 4. 接地、电源完整性与 EMC 四张网
 * ========================================================================= */

export function GroundingRecap({ no = 'FIG · 06' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="四件事互为因果：接地、分割、PDN、EMC"
      meta="速查 · GND / 分割 / PI / EMC"
      plain
      caption="接地的拓扑由频率决定，分割的代价由回流决定，PDN 的目标是全频段低阻抗，EMC 的三要素缺一不可。四条线在「回流路径」上汇合——这也是本章反复出现的同一个词。"
      note={
        <>
          记住两条标准答案：<b>100 MHz → 多点接地</b>；<b>「分割越多 EMC 越好」是错的</b>。
        </>
      }
    >
      <div className={styles.recap}>
        <Card
          k="GND"
          title="三个目的，三种拓扑"
          rows={[
            { k: '三个目的', v: '低阻抗回流 / 稳定参考 / 泄放干扰' },
            { k: '单点', v: <>{'<'}1 MHz，无环路</> },
            { k: '混合', v: '1–10 MHz，λ/20 为界' },
            { k: '多点', v: <>{'>'}10 MHz</> },
            {
              k: '为什么',
              v: (
                <>
                  <b>Z = 2πfL</b>：频率越高，长地线阻抗越大 → 地弹 / 地环路 / 共阻抗耦合
                </>
              ),
            },
          ]}
          foot={
            <>
              100 MHz 的标准答案 = <b>多点接地</b>。
            </>
          }
        />
        <Card
          k="分割"
          title="分割是手段，不是目的"
          rows={[
            { k: '做法', v: '数模分区 + 单点 0 Ω／磁珠连接' },
            { k: '代价', v: '跨分割 → 回流断裂 → 环路面积暴涨' },
            { k: '必须', v: '跨时加缝合电容 0.01 µF；板边打缝合过孔' },
          ]}
          foot={
            <>
              「分割越多 EMC 越好」= <b>错误</b>。分割要跟着回流走，不是跟着分区走。
            </>
          }
        />
        <Card
          k="PI"
          title="PDN 的目标是全频段低阻抗"
          rows={[
            { k: '三级去耦', v: '10–100 µF 板级储能 / 0.1 µF 每脚主力 / 0.01 µF 或 1 nF 高频' },
            { k: '布局', v: '大容值远、小容值近；多过孔下地；注意反谐振' },
            {
              k: '电源地相邻',
              v: '平板电容 C=εr·ε0·A/d、减小回路面积、完整回流路径、相互屏蔽、降电源阻抗抑 SSN',
            },
          ]}
        />
        <Card
          k="EMC"
          title="EMI + EMS，缺一不可"
          rows={[
            { k: '定义', v: 'EMC = EMI（发射）+ EMS（抗扰）' },
            { k: '三要素', v: '干扰源 + 传播途径 + 敏感设备' },
            { k: '传播五种', v: '传导 150k–30M / 辐射 30M–1G / 电容性 / 电感性 / 共阻抗' },
            {
              k: 'PCB 十条',
              v: '完整地平面、不跨分割、3W/20H、高速走内层、I/O 干净地、就近接地、时钟包地、板边包地、π 滤波 + TVS、删悬空走线',
            },
          ]}
        />
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 5. 封装：从代号到真实尺寸
 * ========================================================================= */

const CHIP_SIZES: { name: string; mm: [number, number]; metric: string }[] = [
  { name: '0402', mm: [1.0, 0.5], metric: '1005' },
  { name: '0603', mm: [1.6, 0.8], metric: '1608' },
  { name: '0805', mm: [2.0, 1.25], metric: '2012' },
  { name: '1206', mm: [3.2, 1.6], metric: '3216' },
  { name: '1210', mm: [3.2, 2.5], metric: '3225' },
  { name: '2512', mm: [6.4, 3.2], metric: '6432' },
];

const MAX_MM = 6.4;

export function PackageRecap({ no = 'FIG · 07' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="封装代号换算与四类封装"
      meta="比例尺 · 1 格 = 2 mm · 片式元件"
      plain
      caption="条形长度按真实长边换算（满格 6.4 mm = 2512），所以这张图的宽度差就是实物差距。代号除以 100 得到的是英寸：0805 是 0.08 × 0.05 英寸，不是 0.8 × 0.5 毫米。"
      note={
        <>
          公制叫法完全不同：<b>0603 = 1608</b>、<b>0805 = 2012</b>。同一颗料，两种名字，报错一次就要重买一盘。
        </>
      }
    >
      <div className={styles.scale}>
        {CHIP_SIZES.map((c) => (
          <div key={c.name} className={styles.scaleRow}>
            <span className={styles.scaleName}>{c.name}</span>
            <span className={styles.scaleTrack}>
              <span
                className={styles.scaleBar}
                style={{ width: `${(c.mm[0] / MAX_MM) * 100}%` }}
              />
            </span>
            <span className={styles.scaleVal}>
              {c.mm[0]} × {c.mm[1]} mm · {c.metric}
            </span>
          </div>
        ))}
        <div className={styles.scaleAxis} aria-hidden>
          0 — 2 — 4 — 6 mm
        </div>
      </div>
      <div className={styles.recap}>
        <Card
          k="FAMILY"
          title="四类封装：间距决定能不能手工焊"
          rows={[
            { k: 'DIP', v: '双列直插 · 2.54 mm · 穿孔' },
            { k: 'SOIC', v: '小外形双列 · 1.27 mm · 贴片（鸥翼），TSSOP 更密 0.65 mm' },
            { k: 'QFP', v: '四边扁平 · 0.5/0.4/0.3 mm · 贴片，QFN 无外伸引脚' },
            { k: 'BGA', v: '球栅阵列 · 0.8/0.5 mm · 贴片，焊点看不见，靠 X-ray' },
            { k: '方向', v: '引脚从 1 号脚起逆时针编号；1 脚有圆点/缺口标记' },
          ]}
        />
        <Card
          k="PAD"
          title="焊盘与孔径的经验值"
          rows={[
            { k: '焊盘', v: '比引脚单边大 0.1–0.25 mm' },
            { k: '间距', v: '相邻焊盘 ≥ 0.3 mm' },
            { k: '插件孔', v: '孔径 = 引脚 + 0.2–0.3 mm' },
            { k: '孔环', v: '≥ 0.15 mm' },
            { k: '建库', v: '必须按 datasheet 的推荐焊盘，别自己猜' },
          ]}
          foot={
            <>
              封装 = 部件的外形 + 电气引出 + 机械尺寸。同参数不同封装（LED、电阻）看场合选，
              <b>不是越小越好</b>。
            </>
          }
        />
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 6. 拼板、出图、标准与 DFM
 * ========================================================================= */

export function OutputsRecap({ no = 'FIG · 07' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="发给板厂的那一套：拼板、出图、标准、能力表"
      meta="速查 · CAM / IPC / DFM"
      plain
      caption="拼板是为了让机器好生产（代价是面积），出图是为了让板厂看懂（代价是格式选错就要重做），标准是为了让双方对同一件事有同一个判据，DFM 能力表是为了让设计不越过工厂的门槛。"
      note={
        <>
          一定要做 <b>Gerber 回看</b>：把导出的 Gerber 当成「别人画的图」重新看一遍，能挡掉一大半返工。
        </>
      }
    >
      <div className={styles.recap}>
        <Card
          k="PANEL"
          title="拼板：为了 SMT 传送与产能"
          rows={[
            { k: 'V-CUT', v: '直线、便宜、无毛刺；切深 ≈1/3 板厚；元件距切口 ≥5 mm' },
            { k: '邮票孔', v: '任意形、贵、有毛刺；孔径 0.5–0.8、孔距 0.8–1.2 mm' },
            { k: '工艺边', v: '≥5 mm；板间距 1.6–3.0 mm；小板方向一致' },
            { k: 'Mark 点', v: '铜盘 ⌀1 mm、开窗 ⌀2 mm、周边 3 mm 无铜、≥3 个' },
            { k: '定位孔', v: '⌀2.0–3.0 mm，非金属化' },
          ]}
        />
        <Card
          k="CAM"
          title="出图格式：谁能真的拿去生产"
          rows={[
            { k: 'Gerber', v: 'RS-274X，最通用的光绘格式' },
            { k: 'ODB++', v: '完整制造数据' },
            { k: 'IPC-2581', v: '开放替代方案' },
            { k: 'Excellon', v: '钻孔格式；板框另给 DXF/DWG' },
            { k: 'PDF', v: '只能看，不能产' },
          ]}
          foot={
            <>
              出图流程：原理图 → 库 → 网表 → 板框叠层 → 布局 → 布线 → 覆铜 → DRC → 出图。
            </>
          }
        />
        <Card
          k="IPC"
          title="标准：记住一条主线就够"
          rows={[
            { k: '核心', v: 'IPC-2221 通用设计标准' },
            { k: '分支', v: '2222 刚性 / 2223 柔性 / 6012 性能 / A-600 板验收 / A-610 组装验收' },
            { k: '配套', v: '7351 焊盘 / 2152 载流 / 2581 数据 / 4101 基材' },
            { k: '其他', v: 'GB/T 4588、UL 94、RoHS、REACH' },
            { k: 'DRC', v: 'DRC 查版图；ERC 查原理图' },
          ]}
        />
        <Card
          k="DFM"
          title="能力表：越过这条线就要加钱"
          rows={[
            { k: '常规', v: '线宽线距 6/6 mil、机械孔 0.3 mm、纵横比 8:1' },
            { k: '常规续', v: '环宽 0.15 mm、阻焊桥 0.15 mm、阻抗 ±10%、字符 0.15/0.8 mm' },
            { k: '高精度', v: '4/4 甚至 3/3 mil、孔 0.2 mm、激光盲孔 0.1 mm、阻抗 ±5%' },
            { k: '检验', v: '开路短路→电测；外观→AOI；孔铜层间→切片/X-Ray；阻抗→TDR' },
          ]}
        />
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 7. 信号完整性速记
 * ========================================================================= */

export function SiRecap({ no = 'FIG · 07' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="信号完整性：一条判据、一个阻抗、七个后果"
      meta="速查 · 判据 / Z₀ / 反射 / 损耗 / 串扰 / 眼图"
      plain
      caption="顺序很重要：先用「长度 > 上升沿空间长度 / 6」判断要不要管，再用 Z₀ 定几何，再靠端接补不连续，最后用眼图验收。跳步就会陷入「拼命加宽线但眼图仍然闭合」的死胡同。"
      note={
        <>
          最反直觉的一条：<b>频率低不等于不是高速</b>——10 MHz 方波配 1 ns 边沿，3 cm 的线就要按传输线处理。
        </>
      }
    >
      <div className={styles.recap}>
        <Card
          k="判据"
          title="什么时候必须当传输线"
          rows={[
            { k: '判据', v: '走线长度 > 上升沿空间长度 / 6' },
            { k: '速度', v: '微带 140–150 ps/in；带状线 170–180 ps/in；FR-4 约 6 in/ns ≈ 15 cm/ns' },
            { k: '经验', v: '>50 MHz，或边沿 <1 ns，就按传输线设计' },
          ]}
        />
        <Card
          k="Z₀"
          title="只由截面与介质决定，与线长无关"
          rows={[
            { k: '单调性', v: 'w↑ Z₀↓；h↑ Z₀↑；εr↑ Z₀↓；t↑ Z₀↓（轻微）' },
            { k: '目标值', v: '50 单端；90 USB；100 以太网/HDMI/LVDS；120 CAN；85 PCIe' },
            { k: '数量级', v: '4 层板 0.2 mm 介质、1 oz 铜：50 Ω 微带约 0.35–0.4 mm' },
          ]}
          foot={
            <>
              阻抗控制不是画得越细越好，而是<b>刚好</b>。
            </>
          }
        />
        <Card
          k="反射"
          title="Γ = (Z_L − Z₀)/(Z_L + Z₀)"
          rows={[
            { k: '匹配', v: 'Z_L = Z₀ → Γ = 0，能量全部传给负载' },
            { k: '开路', v: 'Γ = +1，全反射且同相' },
            { k: '短路', v: 'Γ = −1，全反射且反相' },
            {
              k: '七后果',
              v: '反射 → 过冲下冲 → 振铃 → 失真抖动 → 边沿变缓 → EMI → 系统不稳',
            },
            { k: '端接', v: '串联 / 并联 / 戴维南 / RC / 二极管钳位' },
          ]}
        />
        <Card
          k="SI"
          title="四大问题与它们的来源"
          rows={[
            { k: '四大', v: '反射（阻抗不匹配）、串扰（相邻耦合）、衰减（损耗）、延迟（εr）' },
            { k: '另有', v: '地弹、SSN、电源噪声、Jitter、ISI' },
            { k: '反射点', v: '线宽变化、过孔、连接器、引脚焊盘、换层跨分割、stub' },
          ]}
        />
        <Card
          k="衰减"
          title="铜越用越薄，介质越用越热"
          rows={[
            { k: '趋肤', v: 'δ ≈ 66/√f(MHz) µm：100 MHz 6.6 µm，1 GHz 2.1 µm' },
            { k: '导体', v: '∝ √f；1 oz 铜 35 µm 在 100 MHz 只剩 1/5 截面' },
            { k: '介质', v: '∝ f，看 Df；几 GHz 时介质损耗超过导体损耗' },
            { k: '对策', v: '导体损耗→加宽加厚缩短；介质损耗→低 Df 板材、改叠层' },
          ]}
        />
        <Card
          k="串扰"
          title="两条通道，四个端口"
          rows={[
            { k: '两条通道', v: '容性（电场，dv/dt）+ 感性（磁场，di/dt），可部分抵消' },
            { k: 'NEXT', v: '近端，随长度增大后饱和' },
            { k: 'FEXT', v: '远端，与耦合长度成正比；带状线因对称而显著更小' },
            {
              k: '十条',
              v: '3W/4W、缩短平行、Guard Trace 多点接地、完整地平面、减小 h、邻层正交、不跨分割、降 slew rate、差分紧耦合、走内层',
            },
          ]}
        />
        <Card
          k="眼图"
          title="把上千个比特叠起来看"
          rows={[
            { k: '眼高', v: '垂直张开度 = 噪声容限（衰减、串扰、反射）' },
            { k: '眼宽', v: '水平张开度 = 时序容限（抖动、ISI）' },
            { k: '交叉点', v: '占空比失真、直流偏置' },
            { k: '抖动', v: '交叉点的模糊范围：时钟质量、电源噪声、串扰' },
          ]}
        />
      </div>
    </FigureShell>
  );
}

/* =========================================================================
 * 8. 结构与工艺速记
 * ========================================================================= */

export function StructureRecap({ no = 'FIG · 08' }: FigProps) {
  return (
    <FigureShell
      no={no}
      title="一块板的全套词汇：要素、层名、覆铜板、孔"
      meta="速查 · 五要素 / 叠层 / CCL / PTH"
      plain
      caption="先有「五要素」这个骨架，再往里填层名、材料与工艺。叠层四铁律和盲埋孔这两个约束必须在画的第一个小时就定下来——它们改不动。"
      note={
        <>
          两个早期锁定项：<b>叠层对称</b>、<b>盲埋孔结构</b>。等布线完了再改，等于重画。
        </>
      }
    >
      <div className={styles.recap}>
        <Card
          k="5 要素"
          title="双面板的全部零件"
          rows={[
            { k: '介质层', v: '玻纤布 + 环氧树脂（FR-4），绝缘与支撑' },
            { k: '线路', v: '铜箔经曝光 + 蚀刻形成；宽度管载流，间距管可制造性' },
            { k: '通孔', v: '孔壁镀铜，把上下层导通' },
            { k: '阻焊层', v: '防焊油墨，只在焊盘处开窗；颜色不影响性能' },
            { k: '丝印', v: '位号 / 外框 / 极性；不许压焊盘' },
          ]}
        />
        <Card
          k="LAYER"
          title="EDA 层名与尺寸下限"
          rows={[
            { k: '层名', v: '信号层 / 内电层 / 阻焊 / 助焊(钢网) / 丝印 / 机械 / 钻孔 / Keep-Out' },
            { k: '负片', v: '阻焊与内电层画的是「不要的部分」；助焊层只有贴片焊盘才有' },
            { k: '开窗', v: '阻焊开窗单边大 0.05–0.1 mm；阻焊桥 ≥0.15 mm' },
            { k: '丝印', v: '距焊盘 ≥0.15 mm；线宽 ≥0.15 mm、字高 ≥0.8 mm' },
          ]}
        />
        <Card
          k="CCL"
          title="覆铜板与四层叠层"
          rows={[
            { k: '定义', v: 'CCL = 铜箔 + 绝缘基材（+ 铜箔）；1 oz ≈ 35 µm' },
            { k: '四层板', v: '两块双面板 + 中间绝缘（半固化片压合）' },
            { k: '常用', v: 'SIG / GND / PWR / SIG' },
            { k: '四铁律', v: '对称；每层信号紧邻完整参考面；电源地成对且靠近；避免两信号层相邻' },
          ]}
        />
        <Card
          k="PP"
          title="PP 片、芯板与层压"
          rows={[
            { k: '区别', v: 'PP 是 B 阶段半固化片（胶+介质）；芯板是 C 阶段硬板（骨架）' },
            { k: '层压', v: '180–200 ℃ / 200–400 psi' },
            { k: '棕化', v: '粗化铜面提附着力，做不好就分层起泡' },
          ]}
        />
        <Card
          k="PTH"
          title="孔金属化与蚀刻"
          rows={[
            { k: '顺序', v: '除胶渣 → Pd 活化 → 化学沉铜 0.3–0.5 µm → 电镀到 20–25 µm' },
            { k: '蚀刻液', v: '三氯化铁（经典）/ 酸性氯化铜（工业主流）/ 碱性氨蚀（内层）' },
            { k: '侧蚀', v: '各向同性腐蚀导致线宽变细 → 阻抗偏高、载流不足' },
          ]}
        />
        <Card
          k="VIA"
          title="孔：三种，都要在叠层里先定"
          rows={[
            { k: '通孔', v: '穿全板' },
            { k: '盲孔', v: '表层 → 内层，外面看不见' },
            { k: '埋孔', v: '仅内层之间，板面完全看不到' },
            { k: '约束', v: '盲埋孔绑定叠层结构，设计早期就要定' },
          ]}
        />
      </div>
      <Chain
        groups={[
          {
            tag: '简版工艺链（从设计出发，背这条就够）',
            steps: [
              { name: '设计' },
              { name: '开料' },
              { name: '钻孔' },
              { name: '沉铜电镀', sub: 'PTH' },
              { name: '图形转移', sub: '曝光/显影' },
              { name: '蚀刻' },
              { name: '阻焊' },
              { name: '丝印' },
              { name: '表面处理' },
              { name: '成型' },
              { name: '电测' },
            ],
          },
        ]}
      />
    </FigureShell>
  );
}

/* =========================================================================
 * 9. 通用速查表：MDX 里现场拼装
 *    <RecapSheet title="…" caption="…">
 *      <RecapLead>一句话结论</RecapLead>
 *      <RecapCard k="01" title="分组名" foot="…">
 *        <RecapRow k="I = dQ/dt">单位安培；1 A = 1 C/s</RecapRow>
 *      </RecapCard>
 *      <RecapNote>表底注</RecapNote>
 *    </RecapSheet>
 *    公式块的键列更宽（rowWide），窄屏自动折成上下两行。
 * ========================================================================= */

export function RecapSheet({
  no = '速记 · 01',
  title,
  meta = '速记 · 速查表',
  caption,
  note,
  one,
  children,
}: {
  no?: string;
  title: string;
  meta?: string;
  caption?: ReactNode;
  note?: ReactNode;
  one?: boolean;
  children: ReactNode;
}) {
  return (
    <FigureShell no={no} title={title} meta={meta} plain caption={caption} note={note}>
      <div className={one ? `${styles.recap} ${styles.recapOne}` : styles.recap}>{children}</div>
    </FigureShell>
  );
}

export function RecapCard({
  k,
  title,
  foot,
  children,
}: {
  k?: string;
  title: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        {k && <span className={styles.cardKey}>{k}</span>}
        <span className={styles.cardTitle}>{title}</span>
      </div>
      <div className={styles.rows}>{children}</div>
      {foot && <p className={styles.cardFoot}>{foot}</p>}
    </div>
  );
}

export function RecapRow({
  k,
  wide = true,
  children,
}: {
  k: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? `${styles.row} ${styles.rowWide}` : styles.row}>
      <span className={styles.rowKey}>{k}</span>
      <span className={styles.rowVal}>{children}</span>
    </div>
  );
}

export function RecapLead({ children }: { children: ReactNode }) {
  return <p className={styles.recapLead}>{children}</p>;
}

export function RecapNote({ children }: { children: ReactNode }) {
  return <p className={styles.recapNote}>{children}</p>;
}
