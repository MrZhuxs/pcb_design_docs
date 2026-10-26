import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Timeline, TimelineItem } from './timeline';
import { FlowArrow, FlowBranch, FlowBranches, FlowChart, FlowNode } from './flowchart';
import { Concept, Figure, WhyItMatters } from './figure';
import { Approx, KeyBox, Mark, Pitfall } from './mark';
import {
  AtomModel,
  DisplacementCurrent,
  ForceCurve,
  ScaleChain,
  ScaleStep,
  TwoSpeeds,
} from './physics';
import { ChargePair, EnergyLadder, LoopCurrent, TraceGauge, WaveformRms } from './physics-live';
import {
  DischargeCompare,
  EnergyBalance,
  FieldMap,
  SlideCharge,
  UniformField,
} from './physics-field';
import { AcDcComparison } from './electricity/ac-dc-comparison';
import {
  BoardAnatomy,
  ConnectionEras,
  CopperCladLaminate,
  LayerStackup4,
  ViaTypes,
} from './pcb/pcb-figures';
import { IcPackages, PackageCompare, ResistorPackages } from './packaging/package-figures';
import { DesignSop, SchematicExcerpt } from './pcb/sop-figures';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,

    // 通用排版
    Timeline,
    TimelineItem,
    FlowChart,
    FlowNode,
    FlowArrow,
    FlowBranches,
    FlowBranch,

    // 概念图容器与三段式
    Figure,
    ConceptFigure: Figure,
    Concept,
    WhyItMatters,

    // 重点标记
    Mark,
    Pitfall,
    Approx,
    KeyBox,

    // 物理概念图（服务端，SMIL 动画）
    ScaleChain,
    ScaleStep,
    AtomModel,
    ForceCurve,
    TwoSpeeds,
    DisplacementCurrent,

    // 物理概念图（客户端，可交互）
    ChargePair,
    EnergyLadder,
    LoopCurrent,
    TraceGauge,
    WaveformRms,
    FieldMap,
    UniformField,
    EnergyBalance,
    SlideCharge,
    DischargeCompare,
    AcDcComparison,

    // PCB 结构类插图（服务端，跟随明暗主题）
    BoardAnatomy,
    CopperCladLaminate,
    LayerStackup4,
    ViaTypes,
    ConnectionEras,

    // 封装章节插图
    PackageCompare,
    ResistorPackages,
    IcPackages,

    // 从设计到打样（SOP）
    DesignSop,
    SchematicExcerpt,

    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
