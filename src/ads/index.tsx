import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { circleReveal } from "./components/circleReveal";
import { WhatsAppCta } from "./components/WhatsAppCta";
import { SceneHookRoute, SceneRouteMap, SceneMasters } from "./route/scenes";
import { SceneHookEntry, SceneCourses, SceneScheme } from "./entry/scenes";
import { light } from "./components/minimal";
import { SCENES, TRANSITION, AD_DURATION } from "./timeline";

export { AD_DURATION };

// Круг из центра — только на переходе белое→чёрное; дальше мягкие фейды.
const circleTiming = linearTiming({ durationInFrames: TRANSITION + 6 });
const fadeTiming = linearTiming({ durationInFrames: TRANSITION });

const AdShell: React.FC<{ scenes: [React.FC, React.FC, React.FC] }> = ({
  scenes: [S1, S2, S3],
}) => (
  <AbsoluteFill style={{ background: light.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES[0] + 6}>
        <S1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={circleReveal()}
        timing={circleTiming}
      />
      <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
        <S2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />
      <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
        <S3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={fadeTiming} />
      <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
        <WhatsAppCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile("audio/ad-soundtrack.wav")} volume={0.9} />
  </AbsoluteFill>
);

/** Вариант 2 — «Через маршрут». */
export const KiprAdRoute: React.FC = () => (
  <AdShell scenes={[SceneHookRoute, SceneRouteMap, SceneMasters]} />
);

/** Вариант 3 — «Через порог входа». */
export const KiprAdEntry: React.FC = () => (
  <AdShell scenes={[SceneHookEntry, SceneCourses, SceneScheme]} />
);
