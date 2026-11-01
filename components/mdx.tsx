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
import { DiffPairAnatomy, LengthTuning, PlacementPlan, SpacingRules, TraceCurrent } from './pcb/routing-figures';
import { CrosstalkChannels, EyeDiagram, ReflectionWave, SkinDepth, TerminationBank } from './pcb/si-figures';
import { DecouplingNetwork, GroundingSchemes, SplitPlane } from './pcb/grounding-figures';
import { PanelLayout, VcutVsMousebite } from './pcb/panel-figures';
import { IcPackages, PackageCompare, ResistorPackages } from './packaging/package-figures';
import { DesignSop, SchematicExcerpt } from './pcb/sop-figures';
import { ClampMeter } from './pcb/current-figures';
import { Formula, FormulaResult, FormulaRow } from './formula';
import { BandStructure, PhotonJump } from './atom-figures';
import { MountTypes, SmdResistorAnatomy } from './basics/resistor-figures';
import {
  FabProcessChain,
  GroundingRecap,
  HistoryRail,
  OutputsRecap,
  PackageRecap,
  RecapCard,
  RecapLead,
  RecapNote,
  RecapRow,
  RecapSheet,
  SampleToolchain,
  SiRecap,
  StructureRecap,
} from './pcb/recap-figures';

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

    // 公式 / 算例框（正文内联，不占图号）
    Formula,
    FormulaRow,
    FormulaResult,

    // 通用速查表（MDX 现场拼装）
    RecapSheet,
    RecapCard,
    RecapRow,
    RecapLead,
    RecapNote,

    // 概念章专用插图
    ClampMeter,
    PhotonJump,
    BandStructure,
    MountTypes,
    SmdResistorAnatomy,

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

    // 布局与布线
    PlacementPlan,
    TraceCurrent,
    SpacingRules,
    DiffPairAnatomy,
    LengthTuning,

    // 传输线与信号完整性
    TerminationBank,
    ReflectionWave,
    EyeDiagram,
    CrosstalkChannels,
    SkinDepth,

    // 接地 / 电源完整性 / EMC
    GroundingSchemes,
    SplitPlane,
    DecouplingNetwork,

    // 拼板与出图
    VcutVsMousebite,
    PanelLayout,

    // 封装章节插图
    PackageCompare,
    ResistorPackages,
    IcPackages,

    // 从设计到打样（SOP）
    DesignSop,
    SchematicExcerpt,

    // 章节要点速记 / 工艺链 / 年表（HTML 版，跟随明暗主题）
    SampleToolchain,
    FabProcessChain,
    HistoryRail,
    GroundingRecap,
    PackageRecap,
    OutputsRecap,
    SiRecap,
    StructureRecap,

    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
