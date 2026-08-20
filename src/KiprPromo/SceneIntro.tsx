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

const TITLE = "KIPR";

/** По-буквенный spring-каскад заголовка + tracking-in (приём AE). */
const KineticTitle: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tracking = interpolate(
    frame,
    [startFrame, startFrame + 1.6 * fps],
    [0.34, 0.08],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <div style={{ display: "flex" }}>
      {TITLE.split("").map((ch, i) => {
        const s = spring({
          frame: frame - startFrame - i * 4,
          fps,
          config: { damping: 16, mass: 0.8, stiffness: 130 },
        });
        return (
          <div
            key={i}
            style={{
              fontSize: 220,
              fontWeight: 800,
              color: theme.text,
              lineHeight: 1,
              marginRight: `${tracking}em`,
              opacity: s,
              transform: `translateY(${(1 - s) * 110}px) rotate(${(1 - s) * 6}deg)`,
              filter: `blur(${(1 - s) * 12}px)`,
              textShadow: "0 8px 60px rgba(0,0,0,0.45)",
            }}
          >
            {ch}
          </div>
        );
      })}
    </div>
  );
};

/** Солнце: диск + медленно вращающиеся лучи + анаморфный горизонтальный блик. */
const Sun: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const rise = interpolate(frame, [0, 1.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(rise, [0, 1], [height * 0.6, height * 0.315]);
  const opacity = interpolate(rise, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });
  const raysAngle = (frame / fps) * 4; // 4°/сек — едва заметно
  const flare = interpolate(frame, [1.5 * fps, 2.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: y,
        transform: "translate(-50%, -50%)",
        opacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 900,
          height: 900,
          transform: `translate(-50%, -50%) rotate(${raysAngle}deg)`,
          background: `repeating-conic-gradient(from 0deg, ${theme.sunDeep}12 0deg 9deg, transparent 9deg 24deg)`,
          borderRadius: "50%",
          maskImage:
            "radial-gradient(circle, transparent 22%, black 30%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 22%, black 30%, transparent 68%)",
        }}
      />
      <div
        style={{
          width: 330,
          height: 330,
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 35%, #FFE3A8 0%, ${theme.sun} 45%, ${theme.sunDeep} 100%)`,
          boxShadow: `0 0 160px 50px ${theme.sunDeep}55, 0 0 44px 8px ${theme.sun}88`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1500 * flare,
          height: 3,
          transform: "translate(-50%, -50%)",
          background: `linear-gradient(90deg, transparent, ${theme.sun}AA 30%, #FFFFFFE0 50%, ${theme.sun}AA 70%, transparent)`,
          opacity: flare * 0.85,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 640 * flare,
          height: 26,
          transform: "translate(-50%, -50%)",
          background: `linear-gradient(90deg, transparent, ${theme.sunDeep}66, transparent)`,
          opacity: flare * 0.7,
          filter: "blur(10px)",
        }}
      />
    </div>
  );
};

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const overlineWidth = interpolate(
    frame,
    [2.3 * fps, 3 * fps],
    [0, 260],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[0]} from={1.05} to={1}>
        <GlowBackground bg={theme.bg} color={theme.sunDeep} centerY="36%" />
        <Sun />
        <Particles color="#FFD9A0" opacity={0.8} />
        <Waves />
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingTop: height * 0.37,
          }}
        >
          <KineticTitle startFrame={Math.round(1.15 * fps)} />
          <div
            style={{
              marginTop: 44,
              height: 2,
              width: overlineWidth,
              background: `linear-gradient(90deg, transparent, ${theme.sun}, transparent)`,
            }}
          />
          <BlurReveal startFrame={Math.round(2.1 * fps)}>
            <div
              style={{
                marginTop: 34,
                fontSize: 50,
                fontWeight: 400,
                letterSpacing: "0.22em",
                color: theme.textDim,
                textTransform: "uppercase",
              }}
            >
              твой гид по Кипру
            </div>
          </BlurReveal>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
