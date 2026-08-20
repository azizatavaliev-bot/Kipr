import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { GlowBackground } from "../../components/GlowBackground";
import { BlurReveal } from "../../components/BlurReveal";
import { CameraPush } from "../../KiprPromo/cinematic/CameraPush";
import { Particles } from "../../KiprPromo/cinematic/Particles";
import { Waves } from "../../KiprPromo/Waves";
import { SlamText, MaskRise } from "../components/SlamText";
import { RouteTimeline } from "../components/RouteTimeline";
import { IconCyprus, IconGermany, IconDiploma, IconUsa, IconOnline } from "../components/AdIcons";
import { GlassCard } from "../../components/GlassCard";
import { theme } from "../adTheme";
import { SCENES } from "../timeline";

/** Хук: «2 года — Кипр. 2 года — Германия.» */
export const SceneHookRoute: React.FC = () => {
  const { fps } = useVideoConfig();

  const Row: React.FC<{
    n: string;
    label: string;
    start: number;
    accent?: boolean;
  }> = ({ n, label, start, accent }) => (
    <SlamText startFrame={start}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
        <span
          style={{
            fontSize: 230,
            fontWeight: 800,
            lineHeight: 1,
            color: accent ? theme.sun : theme.aqua,
            textShadow: `0 0 110px ${accent ? theme.sun : theme.aqua}55`,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n}
        </span>
        <span style={{ fontSize: 66, fontWeight: 600, color: theme.text }}>
          {label}
        </span>
      </div>
    </SlamText>
  );

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[0]} from={1.06} to={1}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="42%" />
        <Particles opacity={0.8} />
        <Waves opacity={0.4} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 40 }}
        >
          <Row n="2" label="года — Кипр" start={Math.round(0.2 * fps)} />
          <Row n="2" label="года — Германия" start={Math.round(0.75 * fps)} accent />
          <MaskRise startFrame={Math.round(1.5 * fps)} style={{ marginTop: 30 }}>
            <div
              style={{
                fontSize: 56,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: theme.textDim,
                textTransform: "uppercase",
              }}
            >
              диплом — европейский
            </div>
          </MaskRise>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** Маршрут по остановкам. */
export const SceneRouteMap: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[1]} from={1} to={1.06} driftX={-12}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="30%" />
        <Particles opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 60 }}
        >
          <BlurReveal startFrame={Math.round(0.15 * fps)}>
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: "0.3em",
                color: theme.aqua,
                textTransform: "uppercase",
              }}
            >
              твой маршрут
            </div>
          </BlurReveal>
          <RouteTimeline
            startFrame={Math.round(0.5 * fps)}
            stepSeconds={0.85}
            stops={[
              { Icon: IconCyprus, title: "Кипр — 2 года", sub: "старт без стресса, у моря" },
              { Icon: IconGermany, title: "Германия — 2 года", sub: "продолжение в Европе" },
              { Icon: IconDiploma, title: "Диплом ЕС", sub: "признаётся по всей Европе", accent: true },
            ]}
          />
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** Магистратура: Кипр + США или онлайн. */
export const SceneMasters: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const Chip: React.FC<{
    Icon: React.FC<{ size?: number }>;
    title: string;
    sub: string;
    start: number;
  }> = ({ Icon, title, sub, start }) => {
    const s = spring({
      frame: frame - start,
      fps,
      config: { damping: 15, mass: 0.8, stiffness: 120 },
    });
    return (
      <div
        style={{
          opacity: s,
          transform: `translateY(${(1 - s) * 90}px) scale(${0.94 + s * 0.06})`,
        }}
      >
        <GlassCard
          tint="rgba(12,26,36,0.62)"
          style={{
            width: 760,
            display: "flex",
            alignItems: "center",
            gap: 34,
            padding: "36px 42px",
          }}
        >
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 28,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(46,198,230,0.08)",
              border: "1px solid rgba(46,198,230,0.22)",
            }}
          >
            <Icon size={66} />
          </div>
          <div>
            <div style={{ fontSize: 54, fontWeight: 800, color: theme.text }}>
              {title}
            </div>
            <div style={{ fontSize: 35, color: theme.textDim, marginTop: 8 }}>
              {sub}
            </div>
          </div>
        </GlassCard>
      </div>
    );
  };

  const orOnline = spring({
    frame: frame - Math.round(2.1 * fps),
    fps,
    config: { damping: 13, mass: 0.7 },
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[2]} from={1} to={1.06} driftX={10}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="34%" />
        <Particles opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 44 }}
        >
          <SlamText startFrame={Math.round(0.2 * fps)}>
            <div style={{ fontSize: 96, fontWeight: 800, color: theme.text }}>
              Магистратура?
            </div>
          </SlamText>
          <Chip
            Icon={IconCyprus}
            title="Год — Кипр"
            sub="учёба у моря"
            start={Math.round(0.8 * fps)}
          />
          <Chip
            Icon={IconUsa}
            title="Год — США"
            sub="опыт за океаном"
            start={Math.round(1.3 * fps)}
          />
          <div
            style={{
              opacity: orOnline,
              transform: `scale(${orOnline})`,
              display: "flex",
              alignItems: "center",
              gap: 22,
              padding: "22px 46px",
              borderRadius: 70,
              border: `1px solid ${theme.sun}55`,
              background: "rgba(255,179,71,0.08)",
            }}
          >
            <IconOnline size={52} />
            <span style={{ fontSize: 44, fontWeight: 600, color: theme.sun }}>
              или полностью онлайн
            </span>
          </div>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
