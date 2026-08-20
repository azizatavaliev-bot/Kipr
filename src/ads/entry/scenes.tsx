import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { CameraPush } from "../../KiprPromo/cinematic/CameraPush";
import { CinematicLayer } from "../../KiprPromo/cinematic/CinematicLayer";
import { theme } from "../adTheme";
import {
  light,
  dark,
  Rise,
  TrackIn,
  PhotoBackdrop,
  HairlineGrow,
} from "../components/minimal";
import { StepRow } from "../route/scenes";
import { SCENES } from "../timeline";

/** Хук на белом: закрываем возражение первой секундой. */
export const SceneHookEntry: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: light.bg }}>
      <CameraPush durationInFrames={SCENES[0]} from={1.03} to={1}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 30 }}
        >
          <Rise startFrame={Math.round(0.25 * fps)}>
            <div
              style={{
                fontSize: 116,
                fontWeight: 700,
                color: light.text,
                letterSpacing: "-0.02em",
              }}
            >
              Английский?
            </div>
          </Rise>
          <Rise startFrame={Math.round(0.85 * fps)}>
            <div
              style={{
                fontSize: 136,
                fontWeight: 700,
                color: light.accent,
                letterSpacing: "-0.02em",
              }}
            >
              Не нужен
            </div>
          </Rise>
          <div style={{ marginTop: 22 }}>
            <HairlineGrow startFrame={Math.round(1.4 * fps)} />
          </div>
          <TrackIn startFrame={Math.round(1.5 * fps)}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 400,
                color: light.dim,
                textTransform: "uppercase",
              }}
            >
              на старте
            </div>
          </TrackIn>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** 6 месяцев курсов — на фоне лагуны, с тонкой линией прогресса. */
export const SceneCourses: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.6 * fps, 1.7 * fps], [0, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }),
  );
  const barP = interpolate(frame, [0.6 * fps, 2.0 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <PhotoBackdrop
        src="photos/lagoon.jpg"
        durationInFrames={SCENES[1]}
        zoomFrom={1.12}
        zoomTo={1}
        darken={0.78}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 110px 210px",
          gap: 40,
        }}
      >
        <Rise startFrame={Math.round(0.3 * fps)}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
            <span
              style={{
                fontSize: 260,
                fontWeight: 700,
                lineHeight: 1,
                color: dark.text,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
              }}
            >
              {count}
            </span>
            <span style={{ fontSize: 72, fontWeight: 600, color: dark.text }}>
              месяцев
            </span>
          </div>
        </Rise>
        <Rise startFrame={Math.round(0.7 * fps)}>
          <div style={{ fontSize: 48, fontWeight: 400, color: dark.dim }}>
            языковые курсы — уже на Кипре
          </div>
        </Rise>
        <div
          style={{
            height: 3,
            width: "100%",
            background: "rgba(255,255,255,0.18)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${barP * 100}%`,
              background: dark.text,
              borderRadius: 2,
            }}
          />
        </div>
      </AbsoluteFill>
      <CinematicLayer grainOpacity={0.04} />
    </AbsoluteFill>
  );
};

/** Дальше — схема: шаги на фоне побережья. */
export const SceneScheme: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <PhotoBackdrop
        src="photos/coast.jpg"
        durationInFrames={SCENES[2]}
        zoomFrom={1}
        zoomTo={1.12}
        panX={-24}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 110px 200px",
          gap: 58,
        }}
      >
        <TrackIn startFrame={Math.round(0.2 * fps)}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: dark.text,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            дальше — схема
          </div>
        </TrackIn>
        <StepRow
          n="01"
          title="Кипр — 2 года"
          sub="бакалавриат у моря"
          startFrame={Math.round(0.7 * fps)}
        />
        <StepRow
          n="02"
          title="Германия — 2 года"
          sub="финал в Европе"
          startFrame={Math.round(1.5 * fps)}
        />
        <StepRow
          n="03"
          title="Диплом ЕС"
          sub="и право работать в ЕС"
          startFrame={Math.round(2.3 * fps)}
        />
      </AbsoluteFill>
      <CinematicLayer grainOpacity={0.04} />
    </AbsoluteFill>
  );
};
