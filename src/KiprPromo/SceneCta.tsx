import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { GlowBackground } from "../components/GlowBackground";
import { BlurReveal } from "../components/BlurReveal";
import { Waves } from "./Waves";
import { theme } from "./theme";

/** Финал: иконка приложения (солнце в скруглённом квадрате) + CTA. */
export const SceneCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - Math.round(0.3 * fps),
    fps,
    config: { damping: 14, mass: 0.9 },
  });
  const shine = interpolate(frame, [0.9 * fps, 2.2 * fps], [-160, 460], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground bg={theme.bg} color={theme.sunDeep} centerY="42%" />
      <Waves opacity={0.55} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56 }}>
        <div
          style={{
            width: 300,
            height: 300,
            borderRadius: 68,
            transform: `scale(${pop})`,
            background: `linear-gradient(160deg, #10222F 0%, #0A1620 100%)`,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: `0 30px 90px rgba(0,0,0,0.5), 0 0 90px ${theme.sunDeep}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              background: `radial-gradient(circle at 50% 35%, #FFD98A 0%, ${theme.sun} 45%, ${theme.sunDeep} 100%)`,
              boxShadow: `0 0 60px 12px ${theme.sunDeep}66`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: shine,
              width: 90,
              transform: "skewX(-18deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)",
            }}
          />
        </div>
        <BlurReveal startFrame={Math.round(0.8 * fps)}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 800,
              letterSpacing: "0.05em",
              color: theme.text,
            }}
          >
            Kipr
          </div>
        </BlurReveal>
        <BlurReveal startFrame={Math.round(1.2 * fps)}>
          <div
            style={{
              fontSize: 50,
              fontWeight: 400,
              letterSpacing: "0.1em",
              color: theme.textDim,
              textTransform: "uppercase",
            }}
          >
            скачай и поехали
          </div>
        </BlurReveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
