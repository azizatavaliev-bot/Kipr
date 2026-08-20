import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { GlowBackground } from "../../components/GlowBackground";
import { BlurReveal } from "../../components/BlurReveal";
import { CameraPush } from "../../KiprPromo/cinematic/CameraPush";
import { Particles } from "../../KiprPromo/cinematic/Particles";
import { Waves } from "../../KiprPromo/Waves";
import { SlamText, MaskRise } from "../components/SlamText";
import { RouteTimeline } from "../components/RouteTimeline";
import { IconCyprus, IconGermany, IconDiploma, IconCalendar } from "../components/AdIcons";
import { theme } from "../adTheme";
import { SCENES } from "../timeline";

/** Хук: «Английский? Не нужен на старте.» */
export const SceneHookEntry: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[0]} from={1.06} to={1}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="42%" />
        <Particles opacity={0.8} />
        <Waves opacity={0.4} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 36 }}
        >
          <SlamText startFrame={Math.round(0.2 * fps)}>
            <div
              style={{
                fontSize: 118,
                fontWeight: 800,
                color: theme.text,
              }}
            >
              Английский?
            </div>
          </SlamText>
          <SlamText startFrame={Math.round(0.8 * fps)}>
            <div
              style={{
                fontSize: 132,
                fontWeight: 800,
                color: theme.aqua,
                textShadow: `0 0 110px ${theme.aqua}66`,
              }}
            >
              Не нужен
            </div>
          </SlamText>
          <MaskRise startFrame={Math.round(1.4 * fps)}>
            <div
              style={{
                fontSize: 58,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: theme.textDim,
                textTransform: "uppercase",
              }}
            >
              на старте
            </div>
          </MaskRise>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** 6 месяцев языковых курсов — на месте. Сегменты прогресса заполняются. */
export const SceneCourses: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const count = Math.round(
    interpolate(frame, [0.7 * fps, 1.8 * fps], [0, 6], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[1]} from={1} to={1.07} driftX={-12}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="40%" />
        <Particles opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 46 }}
        >
          <BlurReveal startFrame={Math.round(0.15 * fps)}>
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(46,198,230,0.08)",
                border: "1px solid rgba(46,198,230,0.25)",
              }}
            >
              <IconCalendar size={84} />
            </div>
          </BlurReveal>
          <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
            <span
              style={{
                fontSize: 300,
                fontWeight: 800,
                lineHeight: 1,
                color: theme.aqua,
                fontVariantNumeric: "tabular-nums",
                textShadow: `0 0 120px ${theme.aqua}55`,
              }}
            >
              {count}
            </span>
            <span style={{ fontSize: 78, fontWeight: 600, color: theme.text }}>
              месяцев
            </span>
          </div>
          <BlurReveal startFrame={Math.round(0.5 * fps)}>
            <div
              style={{
                fontSize: 52,
                fontWeight: 400,
                color: theme.textDim,
                textAlign: "center",
                lineHeight: 1.4,
              }}
            >
              языковые курсы —<br />
              <span style={{ color: theme.text, fontWeight: 600 }}>
                уже на Кипре
              </span>
            </div>
          </BlurReveal>
          <div style={{ display: "flex", gap: 18, marginTop: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const filled = i < count;
              const s = spring({
                frame: frame - (0.7 + i * 0.18) * fps,
                fps,
                config: { damping: 12, mass: 0.5 },
              });
              return (
                <div
                  key={i}
                  style={{
                    width: 96,
                    height: 16,
                    borderRadius: 8,
                    transform: `scaleY(${0.5 + s * 0.5})`,
                    background: filled
                      ? `linear-gradient(90deg, ${theme.aqua}, #8FE8F7)`
                      : "rgba(255,255,255,0.1)",
                    boxShadow: filled ? `0 0 20px ${theme.aqua}66` : undefined,
                  }}
                />
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};

/** Дальше — стандартная схема: маршрут. */
export const SceneScheme: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[2]} from={1} to={1.06} driftX={10}>
        <GlowBackground bg={theme.bg} color={theme.aqua} centerY="30%" />
        <Particles opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 56 }}
        >
          <BlurReveal startFrame={Math.round(0.15 * fps)}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: theme.text,
                textAlign: "center",
              }}
            >
              Дальше — схема
            </div>
          </BlurReveal>
          <RouteTimeline
            startFrame={Math.round(0.5 * fps)}
            stepSeconds={0.85}
            stops={[
              { Icon: IconCyprus, title: "Кипр — 2 года", sub: "бакалавриат у моря" },
              { Icon: IconGermany, title: "Германия — 2 года", sub: "финал в Европе" },
              { Icon: IconDiploma, title: "Диплом ЕС", sub: "и право работать в ЕС", accent: true },
            ]}
          />
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
