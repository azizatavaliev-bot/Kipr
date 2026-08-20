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
import { BlurReveal } from "../components/BlurReveal";
import { CameraPush } from "./cinematic/CameraPush";
import { Particles } from "./cinematic/Particles";
import { Waves } from "./Waves";
import { theme } from "./theme";
import { SCENES } from "./timeline";

/** Пульсирующее кольцо, расходящееся от иконки. */
const PulseRing: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = 2.2 * fps;
  const local = (frame - delay + cycle * 10) % cycle;
  const p = interpolate(local, [0, cycle], [0, 1], {
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 300 + p * 320,
        height: 300 + p * 320,
        transform: "translate(-50%, -50%)",
        borderRadius: 90 + p * 160,
        border: `2px solid ${theme.sun}`,
        opacity: (1 - p) * 0.35,
      }}
    />
  );
};

const StoreBadge: React.FC<{ label: string; startFrame: number }> = ({
  label,
  startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.7 },
  });

  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        padding: "22px 44px",
        borderRadius: 60,
        border: "1px solid rgba(255,255,255,0.16)",
        background: "rgba(255,255,255,0.05)",
        fontSize: 36,
        fontWeight: 600,
        letterSpacing: "0.05em",
        color: theme.text,
      }}
    >
      {label}
    </div>
  );
};

export const SceneCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame: frame - Math.round(0.3 * fps),
    fps,
    config: { damping: 13, mass: 0.9 },
  });
  const shine = interpolate(frame, [0.9 * fps, 2.1 * fps], [-170, 470], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const iconGlow = 0.5 + 0.5 * Math.sin((frame / fps) * 1.8);

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[3]} from={1.06} to={1}>
        <GlowBackground bg={theme.bg} color={theme.sunDeep} centerY="40%" />
        <Particles color="#FFD9A0" opacity={0.8} />
        <Waves opacity={0.5} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 52 }}
        >
          <div style={{ position: "relative" }}>
            <PulseRing delay={Math.round(0.8 * fps)} />
            <PulseRing delay={Math.round(0.8 * fps + 1.1 * fps)} />
            <div
              style={{
                width: 300,
                height: 300,
                borderRadius: 70,
                transform: `scale(${pop}) rotate(${(1 - pop) * -8}deg)`,
                background: "linear-gradient(160deg, #11242F 0%, #0A1620 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 ${90 + iconGlow * 40}px ${theme.sunDeep}44`,
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
                  background: `radial-gradient(circle at 50% 35%, #FFE3A8 0%, ${theme.sun} 45%, ${theme.sunDeep} 100%)`,
                  boxShadow: `0 0 60px 14px ${theme.sunDeep}66`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  bottom: 30,
                  height: 10,
                  borderRadius: 5,
                  background: `linear-gradient(90deg, ${theme.aqua}88, ${theme.aqua}22)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: shine,
                  width: 100,
                  transform: "skewX(-18deg)",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
            </div>
          </div>
          <BlurReveal startFrame={Math.round(0.7 * fps)}>
            <div
              style={{
                fontSize: 128,
                fontWeight: 800,
                letterSpacing: "0.05em",
                color: theme.text,
              }}
            >
              Kipr
            </div>
          </BlurReveal>
          <BlurReveal startFrame={Math.round(1.05 * fps)}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 400,
                letterSpacing: "0.16em",
                color: theme.textDim,
                textTransform: "uppercase",
              }}
            >
              скачай и поехали
            </div>
          </BlurReveal>
          <div style={{ display: "flex", gap: 30, marginTop: 8 }}>
            <StoreBadge label="App Store" startFrame={Math.round(1.5 * fps)} />
            <StoreBadge label="▶ Google Play" startFrame={Math.round(1.65 * fps)} />
          </div>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
