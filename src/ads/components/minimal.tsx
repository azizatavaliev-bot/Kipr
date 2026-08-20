import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// Палитра минимализма: почти-белый / почти-чёрный, один акцент.
export const light = {
  bg: "#FAFAF8",
  text: "#1D1D1F",
  dim: "rgba(29,29,31,0.55)",
  accent: "#0A84FF",
};
export const dark = {
  bg: "#000000",
  text: "#F5F5F7",
  dim: "rgba(245,245,247,0.64)",
  accent: "#0A84FF",
};

const APPLE_EASE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Единственный приём появления текста: подъём + фокус, без тряски и свечения.
 * Минимализм = одна кривая на весь ролик.
 */
export const Rise: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  durationInFrames?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame, durationInFrames, distance = 56, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames ?? Math.round(0.8 * fps);
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: APPLE_EASE,
  });

  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * distance}px)`,
        filter: `blur(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Tracking-in: буквы мягко «съезжаются» — второй и последний приём. */
export const TrackIn: React.FC<{
  children: React.ReactNode;
  startFrame: number;
  durationInFrames?: number;
  from?: number;
  to?: number;
  style?: React.CSSProperties;
}> = ({ children, startFrame, durationInFrames, from = 0.32, to = 0.06, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames ?? Math.round(1.4 * fps);
  const p = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: APPLE_EASE,
  });

  return (
    <div
      style={{
        opacity: Math.min(1, p * 2.2),
        letterSpacing: `${from + (to - from) * p}em`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Полноэкранное фото: медленный Ken Burns + деликатное затемнение под текст. */
export const PhotoBackdrop: React.FC<{
  src: string;
  durationInFrames: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  darken?: number; // 0..1 сила нижнего градиента
}> = ({ src, durationInFrames, zoomFrom = 1, zoomTo = 1.1, panX = 0, darken = 0.72 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const scale = zoomFrom + (zoomTo - zoomFrom) * p;

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${p * panX}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.05) 34%, rgba(0,0,0,${darken}) 78%, rgba(0,0,0,${Math.min(1, darken + 0.16)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Тонкая акцентная линия, растущая из центра. */
export const HairlineGrow: React.FC<{
  startFrame: number;
  width?: number;
  color?: string;
}> = ({ startFrame, width = 220, color = light.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = interpolate(frame, [startFrame, startFrame + 0.7 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: APPLE_EASE,
  });
  return (
    <div
      style={{
        height: 2,
        width: width * p,
        background: color,
        opacity: 0.35,
        borderRadius: 1,
      }}
    />
  );
};
