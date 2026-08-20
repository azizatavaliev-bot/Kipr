import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { GlowBackground } from "../components/GlowBackground";
import { GlassCard } from "../components/GlassCard";
import { BlurReveal } from "../components/BlurReveal";
import { theme } from "./theme";

const CARDS = [
  { icon: "🏖️", title: "Пляжи", sub: "Нисси-Бич и Голубая лагуна" },
  { icon: "⛰️", title: "Горы", sub: "Троодос и горные деревни" },
  { icon: "🏛️", title: "История", sub: "Курион, Пафос, Саламин" },
];

const Card: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = Math.round((0.9 + index * 0.55) * fps);

  const progress = interpolate(frame, [start, start + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const y = interpolate(progress, [0, 1], [70, 0]);

  return (
    <div style={{ opacity: progress, transform: `translateY(${y}px)` }}>
      <GlassCard
        tint="rgba(12,26,36,0.6)"
        style={{
          width: 780,
          display: "flex",
          alignItems: "center",
          gap: 36,
          padding: "38px 44px",
        }}
      >
        <div style={{ fontSize: 92, lineHeight: 1 }}>{CARDS[index].icon}</div>
        <div>
          <div style={{ fontSize: 58, fontWeight: 800, color: theme.text }}>
            {CARDS[index].title}
          </div>
          <div style={{ fontSize: 38, fontWeight: 400, color: theme.textDim, marginTop: 8 }}>
            {CARDS[index].sub}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

/** Три стеклянные карточки появляются по очереди — время вместо тесноты. */
export const SceneCards: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily }}>
      <GlowBackground bg={theme.bg} color={theme.aqua} centerY="30%" />
      <AbsoluteFill
        style={{ alignItems: "center", justifyContent: "center", gap: 44 }}
      >
        <BlurReveal startFrame={Math.round(0.2 * fps)} style={{ marginBottom: 26 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: theme.text,
              letterSpacing: "0.03em",
            }}
          >
            Всё в одном месте
          </div>
        </BlurReveal>
        {CARDS.map((_, i) => (
          <Card key={i} index={i} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
