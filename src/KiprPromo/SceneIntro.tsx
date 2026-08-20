import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { GlowBackground } from "../components/GlowBackground";
import { BlurReveal } from "../components/BlurReveal";
import { Waves } from "./Waves";
import { theme } from "./theme";

/** Солнце поднимается из-за «моря», следом фокусируется заголовок. */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const rise = interpolate(frame, [0, 1.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const sunY = interpolate(rise, [0, 1], [height * 0.62, height * 0.34]);
  const sunOpacity = interpolate(rise, [0, 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground bg={theme.bg} color={theme.sunDeep} centerY="38%" />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: sunY,
          width: 340,
          height: 340,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 35%, #FFD98A 0%, ${theme.sun} 45%, ${theme.sunDeep} 100%)`,
          boxShadow: `0 0 140px 40px ${theme.sunDeep}55`,
          opacity: sunOpacity,
        }}
      />
      <Waves />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: height * 0.36,
        }}
      >
        <BlurReveal startFrame={Math.round(1.1 * fps)}>
          <div
            style={{
              fontSize: 210,
              fontWeight: 800,
              letterSpacing: "0.06em",
              color: theme.text,
              lineHeight: 1,
            }}
          >
            KIPR
          </div>
        </BlurReveal>
        <BlurReveal startFrame={Math.round(1.6 * fps)}>
          <div
            style={{
              marginTop: 36,
              fontSize: 52,
              fontWeight: 400,
              letterSpacing: "0.14em",
              color: theme.textDim,
              textTransform: "uppercase",
            }}
          >
            твой гид по Кипру
          </div>
        </BlurReveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
