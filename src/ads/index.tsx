import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { zoomBlur } from "../KiprPromo/cinematic/zoomBlur";
import { CinematicLayer } from "../KiprPromo/cinematic/CinematicLayer";
import { WhatsAppCta } from "./components/WhatsAppCta";
import { SceneHookRoute, SceneRouteMap, SceneMasters } from "./route/scenes";
import { SceneHookEntry, SceneCourses, SceneScheme } from "./entry/scenes";
import { theme } from "./adTheme";
import { SCENES, TRANSITION, AD_DURATION } from "./timeline";

export { AD_DURATION };

const timing = linearTiming({ durationInFrames: TRANSITION });

const AdShell: React.FC<{ scenes: [React.FC, React.FC, React.FC] }> = ({
  scenes: [S1, S2, S3],
}) => (
  <AbsoluteFill style={{ background: theme.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENES[0]}>
        <S1 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={SCENES[1]}>
        <S2 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={SCENES[2]}>
        <S3 />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={zoomBlur()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={SCENES[3]}>
        <WhatsAppCta />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <CinematicLayer />
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
