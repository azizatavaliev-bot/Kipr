import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

/**
 * Медленный push-in камеры на всю сцену (приём из AE: ни один план не статичен).
 * Амплитуда < 8%, линейно-плавная на всю длину сцены.
 */
export const CameraPush: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  from?: number;
  to?: number;
  driftX?: number; // px лёгкого бокового дрейфа
}> = ({ children, durationInFrames, from = 1, to = 1.06, driftX = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const scale = interpolate(p, [0, 1], [from, to]);
  const x = interpolate(p, [0, 1], [0, driftX]);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale}) translateX(${x}px)` }}>
      {children}
    </AbsoluteFill>
  );
};
