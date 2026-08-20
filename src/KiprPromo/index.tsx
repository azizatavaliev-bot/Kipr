import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { zoomBlur } from "./cinematic/zoomBlur";
import { CinematicLayer } from "./cinematic/CinematicLayer";
import { SceneIntro } from "./SceneIntro";
import { SceneLines } from "./SceneLines";
import { SceneCards } from "./SceneCards";
import { SceneCta } from "./SceneCta";
import { theme } from "./theme";
import { SCENES, TRANSITION, PROMO_DURATION } from "./timeline";

export { PROMO_DURATION };

const timing = linearTiming({ durationInFrames: TRANSITION });

export const KiprPromo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
          <SceneLines />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
          <SceneCards />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
          <SceneCta />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <CinematicLayer />
      <Audio src={staticFile("audio/soundtrack.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
