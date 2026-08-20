import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Детерминированный псевдорандом — рендер воспроизводим кадр в кадр.
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Парящая пыль/светлячки: медленный дрейф вверх + синусоидальное качание +
 * мерцание. Глубина имитируется размером и blur.
 */
export const Particles: React.FC<{
  count?: number;
  color?: string;
  opacity?: number;
}> = ({ count = 26, color = "#9BE3F2", opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {Array.from({ length: count }).map((_, i) => {
        const depth = rand(i * 7 + 1); // 0 = далеко, 1 = близко
        const size = 2 + depth * 7;
        const baseX = rand(i * 3 + 2) * width;
        const baseY = rand(i * 5 + 3) * height;
        const speed = 8 + depth * 26; // px/сек вверх
        const sway = 14 + depth * 30;
        const y = ((baseY - t * speed) % (height + 80)) + (baseY - t * speed < -80 ? height + 80 : 0);
        const x = baseX + Math.sin(t * (0.4 + depth * 0.5) + i) * sway;
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * (1 + depth * 2) + i * 2.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: (0.12 + depth * 0.3) * twinkle,
              filter: `blur(${(1 - depth) * 2.5}px)`,
              boxShadow: depth > 0.6 ? `0 0 ${size * 2}px ${color}66` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
