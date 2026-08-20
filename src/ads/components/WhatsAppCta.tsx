import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { CameraPush } from "../../KiprPromo/cinematic/CameraPush";
import { CinematicLayer } from "../../KiprPromo/cinematic/CinematicLayer";
import { IconChat } from "./AdIcons";
import { theme, whatsapp } from "../adTheme";
import { dark, Rise } from "./minimal";
import { SCENES } from "../timeline";

/** Финальная CTA-сцена: чистый чёрный, типографика, одна кнопка. */
export const WhatsAppCta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const btn = spring({
    frame: frame - Math.round(1.05 * fps),
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 130 },
  });
  const shine = interpolate(frame, [1.7 * fps, 2.9 * fps], [-220, 760], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const ringP = interpolate(frame, [1.4 * fps, 3.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ fontFamily: theme.fontFamily, background: dark.bg }}>
      <CameraPush durationInFrames={SCENES[3]} from={1.04} to={1}>
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", gap: 46 }}
        >
          <Rise startFrame={Math.round(0.25 * fps)}>
            <div
              style={{
                fontSize: 108,
                fontWeight: 700,
                color: dark.text,
                textAlign: "center",
                lineHeight: 1.14,
                letterSpacing: "-0.02em",
              }}
            >
              Напиши
              <br />в WhatsApp
            </div>
          </Rise>
          <Rise startFrame={Math.round(0.7 * fps)}>
            <div style={{ fontSize: 44, fontWeight: 400, color: dark.dim }}>
              разберём твой случай
            </div>
          </Rise>
          <div style={{ position: "relative", marginTop: 26 }}>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 220 + ringP * 420,
                height: 220 + ringP * 420,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: `1.5px solid ${whatsapp}`,
                opacity: (1 - ringP) * 0.35,
              }}
            />
            <div
              style={{
                opacity: btn,
                transform: `scale(${0.8 + btn * 0.2}) translateY(${(1 - btn) * 50}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "32px 60px",
                borderRadius: 90,
                background: whatsapp,
                boxShadow: `0 20px 60px rgba(37,211,102,0.28)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <IconChat size={58} />
              <div
                style={{
                  fontSize: 50,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.01em",
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
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
      </CameraPush>
      <CinematicLayer grainOpacity={0.035} />
    </AbsoluteFill>
  );
};
