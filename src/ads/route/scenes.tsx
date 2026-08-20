import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
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
import { SCENES } from "../timeline";

/** Шаг маршрута: номер + текст, без карточек. */
export const StepRow: React.FC<{
  n: string;
  title: string;
  sub: string;
  startFrame: number;
}> = ({ n, title, sub, startFrame }) => (
  <Rise startFrame={startFrame}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 34 }}>
      <div
        style={{
          fontSize: 40,
          fontWeight: 600,
          color: dark.dim,
          fontVariantNumeric: "tabular-nums",
          paddingTop: 14,
        }}
      >
        {n}
      </div>
      <div>
        <div style={{ fontSize: 74, fontWeight: 700, color: dark.text, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ fontSize: 38, fontWeight: 400, color: dark.dim, marginTop: 8 }}>
          {sub}
        </div>
      </div>
    </div>
  </Rise>
);

/** Хук на белом: чистая типографика. */
export const SceneHookRoute: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        fontFamily: theme.fontFamily,
        background: light.bg,
      }}
    >
      <CameraPush durationInFrames={SCENES[0]} from={1.03} to={1}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 34 }}
        >
          <Rise startFrame={Math.round(0.25 * fps)}>
            <div
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: light.text,
                lineHeight: 1.12,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              2 года — Кипр.
            </div>
          </Rise>
          <Rise startFrame={Math.round(0.75 * fps)}>
            <div
              style={{
                fontSize: 120,
                fontWeight: 700,
                color: light.text,
                lineHeight: 1.12,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              2 года —{" "}
              <span style={{ color: light.accent }}>Германия.</span>
            </div>
          </Rise>
          <div style={{ marginTop: 26 }}>
            <HairlineGrow startFrame={Math.round(1.35 * fps)} />
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
              диплом — европейский
            </div>
          </TrackIn>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** Маршрут на фоне побережья. */
export const SceneRouteMap: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <PhotoBackdrop
        src="photos/coast.jpg"
        durationInFrames={SCENES[1]}
        zoomFrom={1.12}
        zoomTo={1}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 110px 200px",
          gap: 64,
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
            твой маршрут
          </div>
        </TrackIn>
        <StepRow
          n="01"
          title="Кипр — 2 года"
          sub="старт у моря, без стресса"
          startFrame={Math.round(0.7 * fps)}
        />
        <StepRow
          n="02"
          title="Германия — 2 года"
          sub="продолжение в Европе"
          startFrame={Math.round(1.5 * fps)}
        />
        <StepRow
          n="03"
          title="Диплом ЕС"
          sub="признаётся по всей Европе"
          startFrame={Math.round(2.3 * fps)}
        />
      </AbsoluteFill>
      <CinematicLayer grainOpacity={0.04} />
    </AbsoluteFill>
  );
};

/** Магистратура на фоне заката. */
export const SceneMasters: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <PhotoBackdrop
        src="photos/sunset.jpg"
        durationInFrames={SCENES[2]}
        zoomFrom={1}
        zoomTo={1.12}
        panX={-30}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 110px 220px",
          gap: 54,
        }}
      >
        <Rise startFrame={Math.round(0.25 * fps)}>
          <div style={{ fontSize: 108, fontWeight: 700, color: dark.text }}>
            Магистратура?
          </div>
        </Rise>
        <StepRow
          n="01"
          title="Год — Кипр"
          sub="учёба у моря"
          startFrame={Math.round(0.9 * fps)}
        />
        <StepRow
          n="02"
          title="Год — США"
          sub="или полностью онлайн"
          startFrame={Math.round(1.6 * fps)}
        />
      </AbsoluteFill>
      <CinematicLayer grainOpacity={0.04} />
    </AbsoluteFill>
  );
};
