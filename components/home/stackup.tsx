'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

// 14层HDI叠层（基于RK3588类设计）
const STACKUP = [
  { id: 'L1', name: 'L1 Top Signal', type: 'signal', cu: '1 oz', desc: 'SoC, caps, DDR start' },
  { id: 'PP1', name: 'Prepreg 2116', type: 'prepreg', thickness: 4.5, er: 3.9 },
  { id: 'L2', name: 'L2 GND', type: 'plane', cu: '1 oz', desc: 'Primary reference' },
  { id: 'C1', name: 'Core 1080', type: 'core', thickness: 3.2, er: 4.2 },
  { id: 'L3', name: 'L3 PWR', type: 'plane', cu: '1 oz', desc: '1.0V / 1.8V split' },
  { id: 'PP2', name: 'Prepreg 2116', type: 'prepreg', thickness: 4.5, er: 3.9 },
  { id: 'L4', name: 'L4 Signal', type: 'signal', cu: '1 oz', desc: 'PCIe Gen3 x4, DDR' },
  { id: 'PP3', name: 'Prepreg 1080', type: 'prepreg', thickness: 3.2, er: 3.9 },
  { id: 'L5', name: 'L5 Signal', type: 'signal', cu: '1 oz', desc: 'DDR addr/cmd, USB3' },
  { id: 'PP4', name: 'Prepreg 2116', type: 'prepreg', thickness: 4.5, er: 3.9 },
  { id: 'L6', name: 'L6 PWR', type: 'plane', cu: '1 oz', desc: '3.3V / 5V split' },
  { id: 'C2', name: 'Core 1080', type: 'core', thickness: 3.2, er: 4.2 },
  { id: 'L7', name: 'L7 GND', type: 'plane', cu: '1 oz', desc: 'Secondary reference' },
  { id: 'PP5', name: 'Prepreg 2116', type: 'prepreg', thickness: 4.5, er: 3.9 },
  { id: 'L8', name: 'L8 Bottom Signal', type: 'signal', cu: '1 oz', desc: 'PMIC, passives' },
];

export function Stackup() {
  const [exploded, setExploded] = useState(false);

  return (
    <div 
      className="group relative mx-auto h-[600px] w-full cursor-pointer overflow-hidden rounded-xl border border-fd-border bg-gradient-to-br from-[#05070c] to-[#0f131c] p-6"
      onMouseEnter={() => setExploded(true)}
      onMouseLeave={() => setExploded(false)}
    >
      {/* 标题 */}
      <div className="absolute left-6 top-6 z-50">
        <h3 className="text-sm font-semibold text-fd-foreground">14-Layer HDI Stackup</h3>
        <p className="mt-1 text-xs text-fd-muted-foreground">Hover to explode · 1.6mm total</p>
      </div>

      {/* 图例 */}
      <div className="absolute right-6 top-6 z-50 space-y-1.5 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-6 rounded-sm bg-gradient-to-r from-[#d4af37] to-[#b8945f]" />
          <span className="text-fd-muted-foreground">Cu (1 oz)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-6 rounded-sm bg-[#f59e0b]/30" />
          <span className="text-fd-muted-foreground">Prepreg</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-6 rounded-sm bg-[#10b981]/30" />
          <span className="text-fd-muted-foreground">Core</span>
        </div>
      </div>

      {/* 3D场景容器 */}
      <div 
        className="absolute left-1/2 top-1/2"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1800px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(58deg) rotateZ(-38deg)',
            width: '480px',
            height: '280px',
          }}
        >
          {STACKUP.map((layer, index) => {
            const isCu = layer.type === 'signal' || layer.type === 'plane';
            const isPrepreg = layer.type === 'prepreg';
            const isCore = layer.type === 'core';
            
            // 层间距：常态紧凑，悬停爆炸
            const spacing = exploded ? 38 : 6;
            const zOffset = index * spacing;
            
            // 层高度
            const layerHeight = isCu ? 12 : (isCore ? 18 : 24);
            
            return (
              <div
                key={layer.id}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${zOffset}px)`,
                  width: '480px',
                  height: '280px',
                }}
              >
                {/* 主层面 */}
                <div
                  className={cn(
                    'relative h-full w-full rounded transition-all duration-700',
                    exploded && 'shadow-2xl'
                  )}
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: isCu 
                      ? '0 0 20px rgba(212, 175, 55, 0.3)'
                      : '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <svg
                    viewBox="0 0 480 280"
                    className="h-full w-full"
                    style={{ display: 'block' }}
                  >
                    <defs>
                      {/* 铜箔渐变 */}
                      <linearGradient id={`cu-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="1" />
                        <stop offset="50%" stopColor="#c9a961" stopOpacity="1" />
                        <stop offset="100%" stopColor="#8b7355" stopOpacity="1" />
                      </linearGradient>
                      
                      {/* Prepreg 橙色半透明 */}
                      <linearGradient id={`pp-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.35" />
                      </linearGradient>
                      
                      {/* Core 绿色半透明 */}
                      <linearGradient id={`core-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.35" />
                      </linearGradient>

                      {/* 铜纹理 */}
                      <pattern id={`cu-tex-${index}`} width="2" height="2" patternUnits="userSpaceOnUse">
                        <rect width="2" height="2" fill="none"/>
                        <path d="M0,0 L2,2 M2,0 L0,2" stroke="#000" strokeWidth="0.2" opacity="0.15"/>
                      </pattern>
                      
                      {/* 玻纤纹理 */}
                      <pattern id={`fiber-${index}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                        <line x1="0" y1="1.5" x2="3" y2="1.5" stroke="#fff" strokeWidth="0.3" opacity="0.2"/>
                      </pattern>
                    </defs>

                    {/* 背景填充 */}
                    <rect
                      width="480"
                      height="280"
                      fill={isCu ? `url(#cu-${index})` : (isCore ? `url(#core-${index})` : `url(#pp-${index})`)}
                      rx="3"
                    />
                    
                    {/* 叠加纹理 */}
                    {isCu && <rect width="480" height="280" fill={`url(#cu-tex-${index})`} rx="3"/>}
                    {!isCu && <rect width="480" height="280" fill={`url(#fiber-${index})`} rx="3"/>}

                    {/* 层内容 */}
                    {layer.id === 'L1' && <TopLayerContent />}
                    {layer.id === 'L2' && <GroundPlaneContent />}
                    {layer.id === 'L3' && <PowerPlaneContent voltage="1.0V/1.8V" index={index} />}
                    {layer.id === 'L4' && <SignalLayerPCIeDDR />}
                    {layer.id === 'L5' && <SignalLayerDDRUSB />}
                    {layer.id === 'L6' && <PowerPlaneContent voltage="3.3V/5V" index={index} />}
                    {layer.id === 'L7' && <GroundPlaneContent />}
                    {layer.id === 'L8' && <BottomLayerContent />}
                  </svg>
                </div>

                {/* 侧边标签（爆炸时显示） */}
                {exploded && (
                  <div 
                    className="absolute left-full top-1/2 ml-6 w-32 whitespace-nowrap rounded border border-fd-border/50 bg-fd-background/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur-sm"
                    style={{ 
                      transform: 'rotateZ(38deg) rotateX(-58deg) translateY(-50%)',
                      transformOrigin: 'left center',
                    }}
                  >
                    <div className="font-mono text-[11px] font-semibold text-fd-foreground">{layer.name}</div>
                    {layer.cu && <div className="mt-0.5 text-[10px] text-fd-muted-foreground">{layer.cu}</div>}
                    {layer.thickness && <div className="text-[10px] text-fd-accent-foreground">{layer.thickness} mil · εr {layer.er}</div>}
                    {layer.desc && <div className="mt-0.5 text-[10px] text-fd-muted-foreground/80">{layer.desc}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// L1 Top层：SoC BGA + 去耦电容阵列 + DDR/PCIe起始走线
function TopLayerContent() {
  return (
    <g opacity="0.85">
      {/* 中央 SoC BGA (RK3588) */}
      <rect x="190" y="105" width="100" height="70" fill="#0a0a0a" stroke="#d4af37" strokeWidth="2" rx="3" />
      <text x="240" y="135" fill="#888" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="monospace">RK3588</text>
      <text x="240" y="148" fill="#555" fontSize="7" textAnchor="middle" fontFamily="monospace">19×19 BGA</text>
      
      {/* BGA 球阵（简化表示） */}
      {Array.from({ length: 50 }, (_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const x = 202 + col * 8;
        const y = 118 + row * 7;
        return <circle key={`ball-${i}`} cx={x} cy={y} r="0.7" fill="#c9a961" opacity="0.6" />;
      })}
      
      {/* 去耦电容密集阵列（环绕 SoC） */}
      {Array.from({ length: 28 }, (_, i) => {
        const angle = (i / 28) * Math.PI * 2;
        const radius = 60;
        const x = 240 + Math.cos(angle) * radius;
        const y = 140 + Math.sin(angle) * radius * 0.6;
        return (
          <g key={`cap-${i}`}>
            <rect x={x - 2} y={y - 1.5} width="4" height="3" fill="#1a1a1a" stroke="#666" strokeWidth="0.3" rx="0.5" />
          </g>
        );
      })}
      
      {/* DDR 走线（蛇形等长，向右延伸） */}
      {[0, 1, 2, 3].map((i) => {
        const startY = 115 + i * 11;
        const serpentine = `M 295 ${startY} ${Array.from({ length: 5 }, (_, seg) => {
          const x = 305 + seg * 28;
          const wiggle = seg % 2 === 0 ? 5 : -5;
          return `L ${x} ${startY} L ${x + 4} ${startY + wiggle} L ${x + 8} ${startY}`;
        }).join(' ')} L 460 ${startY}`;
        return <path key={`ddr-trace-${i}`} d={serpentine} stroke="#a855f7" strokeWidth="1.1" fill="none" opacity="0.8" />;
      })}
      
      {/* PCIe Gen3 差分对（向左延伸到 M.2） */}
      {[0, 1, 2].map((lane) => {
        const y = 120 + lane * 10;
        return (
          <g key={`pcie-lane${lane}`}>
            <path d={`M 190 ${y} L 30 ${y}`} stroke="#3b82f6" strokeWidth="1.2" fill="none" opacity="0.85" />
            <path d={`M 190 ${y + 3} L 30 ${y + 3}`} stroke="#3b82f6" strokeWidth="1.2" fill="none" opacity="0.85" />
          </g>
        );
      })}
      
      {/* M.2 连接器位置标记 */}
      <rect x="8" y="110" width="20" height="45" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,2" rx="2" />
      <text x="18" y="160" fill="#64748b" fontSize="6" textAnchor="middle">M.2</text>
      
      {/* HDMI 差分对（向上） */}
      {[0, 1, 2].map((i) => {
        const x = 225 + i * 13;
        return (
          <g key={`hdmi-${i}`}>
            <path d={`M ${x} 100 L ${x} 25`} stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.8" />
            <path d={`M ${x + 2.5} 100 L ${x + 2.5} 25`} stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        );
      })}
      
      {/* USB3 差分对（向下） */}
      {[0, 1].map((port) => {
        const x = 230 + port * 22;
        return (
          <g key={`usb3-${port}`}>
            <path d={`M ${x} 180 L ${x} 255`} stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
            <path d={`M ${x + 2.5} 180 L ${x + 2.5} 255`} stroke="#10b981" strokeWidth="1" fill="none" opacity="0.8" />
          </g>
        );
      })}
      
      {/* 过孔（换层用） */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = 70 + (i % 5) * 75;
        const y = 45 + Math.floor(i / 5) * 50;
        return <circle key={`via-${i}`} cx={x} cy={y} r="1.1" fill="#c9a961" stroke="#8b7355" strokeWidth="0.4" opacity="0.7" />;
      })}
    </g>
  );
}

// L2/L7 完整 GND 平面
function GroundPlaneContent() {
  return (
    <g opacity="0.75">
      {/* 完整覆铜区域 */}
      <rect x="5" y="5" width="470" height="270" fill="#8b7355" opacity="0.35" rx="3" />
      
      {/* SoC 下方开窗（散热） */}
      <rect x="190" y="105" width="100" height="70" fill="#0a0a0a" stroke="#666" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.5" />
      
      {/* 过孔密集阵列（地过孔，遍布全板） */}
      {Array.from({ length: 140 }, (_, i) => {
        const col = i % 14;
        const row = Math.floor(i / 14);
        const x = 25 + col * 32;
        const y = 22 + row * 24;
        
        // 跳过 SoC 区域
        if (x > 185 && x < 295 && y > 100 && y < 180) return null;
        
        return (
          <circle 
            key={`gnd-via-${i}`} 
            cx={x} 
            cy={y} 
            r="1.2" 
            fill="#c9a961" 
            stroke="#8b7355" 
            strokeWidth="0.3" 
            opacity="0.65" 
          />
        );
      })}
      
      {/* DDR 走线区域加密过孔 */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = 300 + (i % 6) * 22;
        const y = 110 + Math.floor(i / 6) * 10;
        return (
          <circle 
            key={`ddr-gnd-${i}`} 
            cx={x} 
            cy={y} 
            r="1" 
            fill="#c9a961" 
            opacity="0.7" 
          />
        );
      })}
    </g>
  );
}

// L3/L6 电源平面（分割区域）
function PowerPlaneContent({ voltage, index }: { voltage: string; index: number }) {
  const [v1, v2] = voltage.split('/');
  
  return (
    <g opacity="0.7">
      {/* 分割线 */}
      <line x1="240" y1="10" x2="240" y2="270" stroke="#0a0a0a" strokeWidth="3" opacity="0.6" />
      
      {/* 左侧电源区 */}
      <rect x="10" y="10" width="225" height="260" fill="#dc2626" opacity="0.18" rx="3" />
      <text 
        x="122" 
        y="145" 
        fill="#dc2626" 
        fontSize="14" 
        fontWeight="700" 
        textAnchor="middle" 
        opacity="0.5"
        fontFamily="monospace"
      >
        {v1}
      </text>
      
      {/* 右侧电源区 */}
      <rect x="245" y="10" width="225" height="260" fill="#f59e0b" opacity="0.18" rx="3" />
      <text 
        x="357" 
        y="145" 
        fill="#f59e0b" 
        fontSize="14" 
        fontWeight="700" 
        textAnchor="middle" 
        opacity="0.5"
        fontFamily="monospace"
      >
        {v2}
      </text>
      
      {/* 电源过孔（密集分布） */}
      {Array.from({ length: 160 }, (_, i) => {
        const col = i % 16;
        const row = Math.floor(i / 16);
        const x = 22 + col * 28;
        const y = 28 + row * 25;
        
        // 避开分割线
        if (x > 230 && x < 250) return null;
        
        return (
          <circle 
            key={`pwr-via-${i}`} 
            cx={x} 
            cy={y} 
            r="0.9" 
            fill="#c9a961" 
            opacity="0.55" 
          />
        );
      })}
    </g>
  );
}

// L4 信号层：PCIe Gen3 + DDR 数据
function SignalLayerPCIeDDR() {
  return (
    <g opacity="0.8">
      {/* PCIe Gen3 x4 差分对（4个 lane，每个 lane 2条线） */}
      {[0, 1, 2, 3].map((lane) => {
        const baseY = 45 + lane * 30;
        return (
          <g key={`pcie-l4-${lane}`}>
            {/* TX 对 */}
            <path 
              d={`M 40 ${baseY} L 190 ${baseY}`} 
              stroke="#3b82f6" 
              strokeWidth="1.1" 
              fill="none" 
              opacity="0.75"
              strokeDasharray="4,2"
            />
            <path 
              d={`M 40 ${baseY + 3.5} L 190 ${baseY + 3.5}`} 
              stroke="#3b82f6" 
              strokeWidth="1.1" 
              fill="none" 
              opacity="0.75"
              strokeDasharray="4,2"
            />
            
            {/* RX 对 */}
            <path 
              d={`M 40 ${baseY + 10} L 190 ${baseY + 10}`} 
              stroke="#60a5fa" 
              strokeWidth="1.1" 
              fill="none" 
              opacity="0.75"
              strokeDasharray="4,2"
            />
            <path 
              d={`M 40 ${baseY + 13.5} L 190 ${baseY + 13.5}`} 
              stroke="#60a5fa" 
              strokeWidth="1.1" 
              fill="none" 
              opacity="0.75"
              strokeDasharray="4,2"
            />
          </g>
        );
      })}
      
      {/* DDR4X 数据线（DQ，蛇形等长） */}
      {[0, 1, 2, 3, 4].map((byte) => {
        const startY = 40 + byte * 35;
        const serpentine = `M 300 ${startY} ${Array.from({ length: 6 }, (_, seg) => {
          const x = 313 + seg * 25;
          const wiggle = seg % 2 === 0 ? 6 : -6;
          return `L ${x} ${startY} L ${x + 3.5} ${startY + wiggle} L ${x + 7} ${startY}`;
        }).join(' ')} L 465 ${startY}`;
        
        return (
          <g key={`ddr-dq-${byte}`}>
            <path d={serpentine} stroke="#a855f7" strokeWidth="0.9" fill="none" opacity="0.8" />
            <path 
              d={serpentine.replace(new RegExp(String(startY), 'g'), String(startY + 4.5))} 
              stroke="#a855f7" 
              strokeWidth="0.9" 
              fill="none" 
              opacity="0.8" 
            />
          </g>
        );
      })}
      
      {/* 换层过孔 */}
      {Array.from({ length: 25 }, (_, i) => {
        const x = 60 + (i % 5) * 70;
        const y = 55 + Math.floor(i / 5) * 42;
        return (
          <circle 
            key={`via-l4-${i}`} 
            cx={x} 
            cy={y} 
            r="1.3" 
            fill="#c9a961" 
            stroke="#8b7355" 
            strokeWidth="0.4" 
            opacity="0.7" 
          />
        );
      })}
    </g>
  );
}

// L5 信号层：DDR 地址/命令 + USB3
function SignalLayerDDRUSB() {
  return (
    <g opacity="0.8">
      {/* DDR 地址/命令总线（单端，但需等长） */}
      {Array.from({ length: 12 }, (_, i) => {
        const y = 45 + i * 14;
        const wigglePattern = `M 300 ${y} ${Array.from({ length: 5 }, (_, seg) => {
          const x = 313 + seg * 28;
          const offset = (i + seg) % 2 === 0 ? 3.5 : -3.5;
          return `L ${x} ${y} L ${x + 2.5} ${y + offset} L ${x + 5} ${y}`;
        }).join(' ')} L 460 ${y}`;
        
        return (
          <path 
            key={`ddr-addr-${i}`} 
            d={wigglePattern} 
            stroke="#c084fc" 
            strokeWidth="0.85" 
            fill="none" 
            opacity="0.75" 
          />
        );
      })}
      
      {/* USB3.1 差分对 x2 */}
      {[0, 1].map((port) => {
        const x = 85 + port * 105;
        return (
          <g key={`usb3-l5-${port}`}>
            <path 
              d={`M ${x} 210 L ${x} 265`} 
              stroke="#10b981" 
              strokeWidth="1" 
              fill="none" 
              opacity="0.8"
              strokeDasharray="3,1.5"
            />
            <path 
              d={`M ${x + 3.5} 210 L ${x + 3.5} 265`} 
              stroke="#10b981" 
              strokeWidth="1" 
              fill="none" 
              opacity="0.8"
              strokeDasharray="3,1.5"
            />
          </g>
        );
      })}
      
      {/* 过孔 */}
      {Array.from({ length: 20 }, (_, i) => {
        const x = 325 + (i % 5) * 32;
        const y = 55 + Math.floor(i / 5) * 42;
        return (
          <circle 
            key={`via-l5-${i}`} 
            cx={x} 
            cy={y} 
            r="1.2" 
            fill="#c9a961" 
            opacity="0.65" 
          />
        );
      })}
    </g>
  );
}

// L8 Bottom层：PMIC + 被动元件
function BottomLayerContent() {
  return (
    <g opacity="0.85">
      {/* PMIC (电源管理芯片) */}
      <rect x="70" y="90" width="60" height="45" fill="#0a0a0a" stroke="#d4af37" strokeWidth="1.6" rx="2.5" />
      <text x="100" y="110" fill="#888" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">PMIC</text>
      <text x="100" y="121" fill="#555" fontSize="6" textAnchor="middle">RK806</text>
      
      {/* 电感（DC-DC 输出） */}
      {[0, 1, 2, 3].map((i) => {
        const x = 145 + i * 75;
        const y = 108;
        return (
          <g key={`inductor-${i}`}>
            <rect x={x} y={y} width="16" height="11" fill="#1a1a1a" stroke="#64748b" strokeWidth="0.8" rx="1" />
            <circle cx={x + 3.5} cy={y + 5.5} r="2.2" fill="none" stroke="#64748b" strokeWidth="0.6" />
            <circle cx={x + 12.5} cy={y + 5.5} r="2.2" fill="none" stroke="#64748b" strokeWidth="0.6" />
          </g>
        );
      })}
      
      {/* 散布的电容/电阻 */}
      {Array.from({ length: 45 }, (_, i) => {
        const x = 45 + (i % 9) * 45;
        const y = 175 + Math.floor(i / 9) * 20;
        const isResistor = i % 3 === 0;
        
        return (
          <rect 
            key={`passive-${i}`} 
            x={x} 
            y={y} 
            width={isResistor ? 5.5 : 3.5} 
            height="2.8" 
            fill={isResistor ? "#333" : "#1a1a1a"} 
            stroke="#555" 
            strokeWidth="0.3" 
            rx="0.5" 
          />
        );
      })}
      
      {/* 底层走线（电源分配网络） */}
      {[0, 1, 2, 3, 4].map((i) => (
        <path 
          key={`bot-trace-${i}`} 
          d={`M 70 ${45 + i * 45} L 410 ${45 + i * 45}`} 
          stroke="#d4af37" 
          strokeWidth="2.2" 
          fill="none" 
          opacity="0.4" 
        />
      ))}
      
      {/* 过孔 */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = 85 + (i % 6) * 60;
        const y = 55 + Math.floor(i / 6) * 42;
        return (
          <circle 
            key={`via-bot-${i}`} 
            cx={x} 
            cy={y} 
            r="1.2" 
            fill="#c9a961" 
            stroke="#8b7355" 
            strokeWidth="0.4" 
            opacity="0.7" 
          />
        );
      })}
    </g>
  );
}
