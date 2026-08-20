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
import { GlassCard } from "../components/GlassCard";
import { BlurReveal } from "../components/BlurReveal";
import { CameraPush } from "./cinematic/CameraPush";
import { Particles } from "./cinematic/Particles";
import { IconBeach, IconMountain, IconColumn } from "./Icons";
import { theme } from "./theme";
import { SCENES } from "./timeline";

const CARDS = [
  { Icon: IconBeach, title: "Пляжи", sub: "Нисси-Бич и Голубая лагуна" },
  { Icon: IconMountain, title: "Горы", sub: "Троодос и горные деревни" },
  { Icon: IconColumn, title: "История", sub: "Курион, Пафос, Саламин" },
];

/** Карточка въезжает в 3D-перспективе (rotateX) + блик пробегает по стеклу. */
const Card: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round((0.9 + index * 0.5) * fps);

  const s = spring({
    frame: frame - start,
    fps,
    config: { damping: 17, mass: 0.9, stiffness: 110 },
  });
  const shine = interpolate(
    frame,
    [start + 0.5 * fps, start + 1.5 * fps],
    [-260, 900],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) },
  );
  const iconPop = spring({
    frame: frame - start - 5,
    fps,
    config: { damping: 11, mass: 0.6 },
  });

  const { Icon, title, sub } = CARDS[index];

  return (
    <div style={{ perspective: 1400 }}>
      <div
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 130}px) rotateX(${(1 - s) * 24}deg) scale(${0.94 + s * 0.06})`,
          transformOrigin: "50% 100%",
        }}
      >
        <GlassCard
          tint="rgba(12,26,36,0.62)"
          style={{
            width: 800,
            display: "flex",
            alignItems: "center",
            gap: 40,
            padding: "40px 46px",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 32,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(46,198,230,0.08)",
              border: "1px solid rgba(46,198,230,0.22)",
              transform: `scale(${iconPop})`,
            }}
          >
            <Icon />
          </div>
          <div>
            <div style={{ fontSize: 60, fontWeight: 800, color: theme.text }}>
              {title}
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 400,
                color: theme.textDim,
                marginTop: 10,
              }}
            >
              {sub}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: -40,
              bottom: -40,
              left: shine,
              width: 110,
              transform: "skewX(-20deg)",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.09), transparent)",
            }}
          />
        </GlassCard>
      </div>
    </div>
  );
};

export const SceneCards: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[2]} from={1} to={1.06} driftX={12}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="26%" />
        <Particles opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 46 }}
        >
          <BlurReveal startFrame={Math.round(0.15 * fps)} style={{ marginBottom: 6 }}>
            <div
              style={{
                fontSize: 34,
                fontWeight: 600,
                letterSpacing: "0.34em",
                color: theme.aqua,
                textTransform: "uppercase",
              }}
            >
              путеводитель
            </div>
          </BlurReveal>
          <BlurReveal startFrame={Math.round(0.3 * fps)} style={{ marginBottom: 30 }}>
            <div
              style={{
                fontSize: 82,
                fontWeight: 800,
                color: theme.text,
                letterSpacing: "0.02em",
              }}
            >
              Всё в одном месте
            </div>
          </BlurReveal>
          {CARDS.map((_, i) => (
            <Card key={i} index={i} />
          ))}
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
