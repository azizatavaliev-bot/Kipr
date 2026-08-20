import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

/**
 * «Slam in» из AE: текст падает из увеличенного размытого состояния
 * и жёстко встаёт на место с микро-тряской кадра в момент удара.
 */
export const SlamText: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  style?: React.CSSProperties;
  shake?: boolean;
}> = ({ children, startFrame, style, shake = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;

  const s = spring({
    frame: local,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 210 },
  });
  const scale = interpolate(s, [0, 1], [1.7, 1]);
  const blur = interpolate(s, [0, 1], [18, 0]);

  // Затухающая тряска сразу после «удара» (~0.23s от старта пружины)
  const impactAt = 7;
  const sh = local - impactAt;
  const shakeAmp = shake && sh >= 0 ? 7 * Math.exp(-sh / 4) : 0;
  const dx = shakeAmp * Math.sin(sh * 2.7);
  const dy = shakeAmp * Math.cos(sh * 3.4) * 0.6;

  return (
    <div
      style={{
        opacity: Math.min(1, s * 1.6),
        transform: `scale(${scale}) translate(${dx}px, ${dy}px)`,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Подстрочный reveal: маска снизу вверх (клип), классика кинетики. */
export const MaskRise: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  durationInFrames?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame, durationInFrames, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames ?? Math.round(0.55 * fps);
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: p > 0 ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
};
