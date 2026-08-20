import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { SceneIntro } from "./SceneIntro";
import { SceneLines } from "./SceneLines";
import { SceneCards } from "./SceneCards";
import { SceneCta } from "./SceneCta";
import { theme } from "./theme";

const TRANSITION = 15;
export const SCENES = [105, 135, 130, 105];
// Переходы съедают по TRANSITION кадров между сценами.
export const PROMO_DURATION =
  SCENES.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

export const KiprPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <SceneLines />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <SceneCards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
          <SceneCta />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
