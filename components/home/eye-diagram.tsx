import { cn } from '@/lib/cn';
import styles from './home.module.css';

/**
 * 示波器眼图：多条随机抖动的 NRZ 过渡叠加，形成「眼睛」，配合扫描线动画。
 */

const W = 320;
const H = 160;
const HI = 36;
const LO = 124;

// 确定性伪随机，保证服务端/客户端一致
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function eyePaths() {
  const paths: string[] = [];
  const combos: [number, number, number][] = [
    [HI, HI, HI],
    [LO, LO, LO],
    [HI, LO, HI],
    [LO, HI, LO],
    [HI, HI, LO],
    [LO, LO, HI],
    [HI, LO, LO],
    [LO, HI, HI],
  ];
  let s = 1;
  for (let k = 0; k < 4; k++) {
    for (const [a, b, c] of combos) {
      const j = () => (rand(s++) - 0.5) * 10; // 时间抖动
      const n = () => (rand(s++) - 0.5) * 8; // 幅度噪声
      const x0 = 0;
      const x1 = 80 + j();
      const x2 = 240 + j();
      const x3 = W;
      const ya = a + n();
      const yb = b + n();
      const yc = c + n();
      paths.push(
        `M${x0} ${ya} L${x1 - 30} ${ya} C${x1} ${ya} ${x1} ${yb} ${x1 + 30} ${yb} ` +
          `L${x2 - 30} ${yb} C${x2} ${yb} ${x2} ${yc} ${x2 + 30} ${yc} L${x3} ${yc}`,
      );
    }
  }
  return paths;
}

const paths = eyePaths();

export function EyeDiagram({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-xl border border-fd-border bg-zinc-950 p-4">
        <div className="mb-3 flex items-center justify-between font-mono text-[11px] text-zinc-400">
          <span>CH1 · PCIe 4.0 · 16 GT/s</span>
          <span className="flex items-center gap-1.5 text-[#00dfd8]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#00dfd8]" />
            RUN
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="眼图示意">
          <defs>
            <pattern id="scope-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0 L0 0 0 32" fill="none" stroke="#ffffff" strokeOpacity="0.08" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#scope-grid)" />
          <g fill="none" stroke="#00dfd8" strokeWidth="1" strokeOpacity="0.32">
            {paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* 眼高 / 眼宽 模板 */}
          <polygon
            points="125,80 160,62 195,80 160,98"
            fill="#ff0080"
            fillOpacity="0.15"
            stroke="#ff0080"
            strokeDasharray="3 3"
          />
        </svg>
        <div
          className={cn(
            styles.scopeScan,
            'pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-transparent via-[#00dfd8]/25 to-transparent',
          )}
        />
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 font-mono text-[11px] text-zinc-400">
          <span>眼高 142 mV</span>
          <span>眼宽 0.71 UI</span>
          <span>抖动 4.2 ps</span>
        </div>
      </div>
    </div>
  );
}
