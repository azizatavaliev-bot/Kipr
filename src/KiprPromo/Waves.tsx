import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

const wavePath = (
  width: number,
  baseY: number,
  amplitude: number,
  wavelength: number,
  phase: number,
): string => {
  const points: string[] = [`M 0 ${baseY}`];
  const step = 20;
  for (let x = 0; x <= width; x += step) {
    const y = baseY + Math.sin((x / wavelength) * Math.PI * 2 + phase) * amplitude;
    points.push(`L ${x} ${y}`);
  }
  points.push(`L ${width} ${baseY + 600} L 0 ${baseY + 600} Z`);
  return points.join(" ");
};

/**
 * Едва заметные слои моря внизу кадра. Движение медленное (< 5% амплитуды кадра),
 * фон никогда не статичен, но и не отвлекает от focal point.
 */
export const Waves: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;

  const layers = [
    { y: height - 260, amp: 14, len: 620, speed: 0.55, color: `${theme.aqua}2E` },
    { y: height - 180, amp: 18, len: 480, speed: -0.4, color: `${theme.aqua}3D` },
    { y: height - 100, amp: 22, len: 560, speed: 0.3, color: `${theme.aqua}59` },
  ];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      {layers.map((l, i) => (
        <path key={i} d={wavePath(width, l.y, l.amp, l.len, t * l.speed * Math.PI)} fill={l.color} />
      ))}
    </svg>
  );
};
