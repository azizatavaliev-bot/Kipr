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
import { SlamText } from "./SlamText";
import { IconChat } from "./AdIcons";
import { theme, whatsapp } from "../adTheme";
import { SCENES } from "../timeline";

const Ring: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycle = 1.9 * fps;
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
        width: 200 + p * 380,
        height: 200 + p * 380,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: `2px solid ${whatsapp}`,
        opacity: (1 - p) * 0.4,
      }}
    />
  );
};

/** Финальная CTA-сцена (общая для всех вариантов). */
export const WhatsAppCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btn = spring({
    frame: frame - Math.round(1.1 * fps),
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const shine = interpolate(frame, [1.7 * fps, 2.7 * fps], [-220, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  // Микро-пульс кнопки, зовущий нажать
  const pulse = 1 + 0.02 * Math.sin((frame / fps) * Math.PI * 2 * 0.9);

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: theme.bg }}>
      <CameraPush durationInFrames={SCENES[3]} from={1.05} to={1}>
        <GlowBackground bg={theme.bg} color={whatsapp} centerY="46%" />
        <Particles color="#A9F0C8" opacity={0.7} />
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 54 }}
        >
          <SlamText startFrame={Math.round(0.25 * fps)}>
            <div
              style={{
                fontSize: 104,
                fontWeight: 800,
                color: theme.text,
                textAlign: "center",
                lineHeight: 1.15,
              }}
            >
              Напиши
              <br />в WhatsApp
            </div>
          </SlamText>
          <BlurReveal startFrame={Math.round(0.75 * fps)}>
            <div
              style={{
                fontSize: 46,
                fontWeight: 400,
                letterSpacing: "0.06em",
                color: theme.textDim,
              }}
            >
              разберём твой случай
            </div>
          </BlurReveal>
          <div style={{ position: "relative", marginTop: 20 }}>
            <Ring delay={Math.round(1.5 * fps)} />
            <Ring delay={Math.round(1.5 * fps + 0.95 * fps)} />
            <div
              style={{
                opacity: btn,
                transform: `scale(${btn * pulse}) translateY(${(1 - btn) * 60}px)`,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "34px 62px",
                borderRadius: 90,
                background: `linear-gradient(180deg, ${whatsapp}, #1DA851)`,
                boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 70px ${whatsapp}55`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <IconChat size={64} />
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                }}
              >
                Написать
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: shine,
                  width: 120,
                  transform: "skewX(-20deg)",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </CameraPush>
    </AbsoluteFill>
  );
};
