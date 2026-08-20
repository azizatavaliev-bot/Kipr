import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Дышащий радиальный glow-фон — паттерн из Claude promo.
 * Один акцентный цвет, амплитуда пульсации < 5%, цикл 3-4 сек, sin easing.
 */
export const GlowBackground: React.FC<{
  color?: string; // акцентный цвет свечения
  bg?: string; // базовый фон
  cycleSeconds?: number;
  minScale?: number;
  maxScale?: number;
  centerX?: string; // напр. "50%"
  centerY?: string;
}> = ({
  color = "#FF4D2E",
  bg = "#0A0A0A",
  cycleSeconds = 3.5,
  minScale = 0.98,
  maxScale = 1.02,
  centerX = "50%",
  centerY = "45%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cycleFrames = cycleSeconds * fps;
  const t = (frame % cycleFrames) / cycleFrames; // 0..1
  const wave = Math.sin(t * Math.PI * 2) * 0.5 + 0.5; // 0..1 smooth
  const scale = interpolate(wave, [0, 1], [minScale, maxScale], {
    easing: Easing.inOut(Easing.sin),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: centerX,
          top: centerY,
          width: "120%",
          aspectRatio: "1",
          transform: `translate(-50%, -50%) scale(${scale})`,
          background: `radial-gradient(circle, ${color}55 0%, ${color}22 30%, transparent 65%)`,
          filter: "blur(40px)",
        }}
      />
    </div>
  );
};
