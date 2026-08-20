import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { GlowBackground } from "../components/GlowBackground";
import { theme } from "./theme";

const Line: React.FC<{
  text: React.ReactNode;
  from: number;
  to: number;
}> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inDur = Math.round(0.5 * fps);
  const outDur = Math.round(0.4 * fps);

  const enter = interpolate(frame, [from, from + inDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(frame, [to - outDur, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  const blur = interpolate(enter, [0, 1], [16, 0]) + interpolate(exit, [0, 1], [12, 0]);
  const scale = interpolate(enter, [0, 1], [1.06, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
          opacity: enter * exit,
          textAlign: "center",
          padding: "0 90px",
          fontSize: 96,
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: "0.02em",
          color: theme.text,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Кинетическая типографика: строки сменяют друг друга через blur-кроссфейд. */
export const SceneLines: React.FC = () => {
  const { fps } = useVideoConfig();
  const hold = Math.round(2.1 * fps);
  const overlap = Math.round(0.35 * fps);

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground bg={theme.bg} color={theme.aqua} centerY="52%" />
      <Line
        text={
          <>
            <span style={{ fontWeight: 800, color: theme.aqua }}>320 дней</span>
            <br />
            солнца в году
          </>
        }
        from={0}
        to={hold}
      />
      <Line
        text={
          <>
            Море. Горы.
            <br />
            <span style={{ fontWeight: 800, color: theme.aqua }}>Античность.</span>
          </>
        }
        from={hold - overlap}
        to={2 * hold}
      />
    </AbsoluteFill>
  );
};
