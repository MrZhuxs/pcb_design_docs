import React from 'react';
import { Composition } from 'remotion';
import { DcdcSchematic } from './DcdcSchematic';
import { DURATION, FPS } from './theme';
import { SfStructure, A_DURATION } from './SfStructure';
import { SfFab, B_DURATION } from './SfFab';
import { SfStackVia, C_DURATION } from './SfStackVia';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DcdcSchematic"
      component={DcdcSchematic}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="SfStructure"
      component={SfStructure}
      durationInFrames={A_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="SfFab"
      component={SfFab}
      durationInFrames={B_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="SfStackVia"
      component={SfStackVia}
      durationInFrames={C_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
