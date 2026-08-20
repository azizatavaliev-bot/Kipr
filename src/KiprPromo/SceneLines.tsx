import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { GlowBackground } from "../components/GlowBackground";
import { CameraPush } from "./cinematic/CameraPush";
import { Particles } from "./cinematic/Particles";
import { theme } from "./theme";
import { SCENES } from "./timeline";

/** Обёртка строки: blur-вход + blur-уход. */
const useLineState = (from: number, to: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inDur = 0.5 * fps;
  const outDur = 0.4 * fps;
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
  return { enter, exit, opacity: enter * exit };
};

/** Счётчик 0→320 с пружинным settle — фирменный приём моушн-графики. */
const CountUp: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { enter, exit, opacity } = useLineState(from, to);

  const count = Math.round(
    interpolate(frame, [from + 0.2 * fps, from + 1.4 * fps], [0, 320], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );
  const settle = spring({
    frame: frame - from - 1.3 * fps,
    fps,
    config: { damping: 12, mass: 0.7 },
  });
  const scale = 1 + (1 - Math.min(settle, 1)) * 0 + (settle > 0 ? (1 - settle) * 0.06 : 0);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          opacity,
          filter: `blur(${(1 - enter) * 16 + (1 - exit) * 12}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 300,
            fontWeight: 800,
            lineHeight: 1,
            color: theme.aqua,
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${scale})`,
            textShadow: `0 0 120px ${theme.aqua}55`,
          }}
        >
          {count}
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 74,
            fontWeight: 600,
            color: theme.text,
            letterSpacing: "0.04em",
          }}
        >
          дней солнца в году
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Слова появляются по одному, с blur и подъёмом — потом уходят вместе. */
const WordCascade: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { exit } = useLineState(from, to);
  const words = ["Море.", "Горы.", "Античность."];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          opacity: exit,
          filter: `blur(${(1 - exit) * 12}px)`,
        }}
      >
        {words.map((w, i) => {
          const s = spring({
            frame: frame - from - i * 9,
            fps,
            config: { damping: 15, mass: 0.8, stiffness: 120 },
          });
          const isAccent = i === words.length - 1;
          return (
            <div
              key={w}
              style={{
                fontSize: isAccent ? 118 : 96,
                fontWeight: isAccent ? 800 : 600,
                color: isAccent ? theme.aqua : theme.text,
                opacity: s,
                transform: `translateY(${(1 - s) * 70}px)`,
                filter: `blur(${(1 - s) * 10}px)`,
                textShadow: isAccent ? `0 0 90px ${theme.aqua}66` : undefined,
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const SceneLines: React.FC = () => {
  const { fps } = useVideoConfig();
  const hold = Math.round(2.5 * fps);
  const overlap = Math.round(0.35 * fps);

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[1]} from={1} to={1.07} driftX={-14}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="50%" />
        <Particles opacity={0.9} />
        <CountUp from={0} to={hold} />
        <WordCascade from={hold - overlap} to={SCENES[1]} />
      </CameraPush>
    </AbsoluteFill>
  );
};
