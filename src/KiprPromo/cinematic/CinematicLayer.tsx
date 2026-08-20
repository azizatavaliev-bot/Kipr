import React from "react";
import { AbsoluteFill, useCurrentFrame, staticFile } from "remotion";

/**
 * Кинематографичный слой поверх сцены: плёночное зерно + виньетка.
 * Зерно — бесшовно тайлящаяся noise-текстура, сдвигаемая каждый кадр.
 */
export const CinematicLayer: React.FC<{ grainOpacity?: number }> = ({
  grainOpacity = 0.05,
}) => {
  const frame = useCurrentFrame();
  // Детерминированный псевдослучайный сдвиг тайла зерна.
  const ox = (frame * 97) % 512;
  const oy = (frame * 53) % 512;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 72% at 50% 46%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `url(${staticFile("textures/grain.png")})`,
          backgroundRepeat: "repeat",
          backgroundPosition: `${ox}px ${oy}px`,
          mixBlendMode: "overlay",
          opacity: grainOpacity,
        }}
      />
    </AbsoluteFill>
  );
};
