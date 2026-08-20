import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";

/**
 * Blur-to-focus reveal — паттерн из Botanica / Just Sfx / Claude промо.
 * Элемент входит расфокусированным + чуть увеличенным, "фокусируется" за durationInFrames.
 * Использовать на строку текста / иконку / карточку — НЕ на весь текстовый блок сразу.
 */
export const BlurReveal: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  durationInFrames?: number; // по умолчанию ~0.5s на 30fps
  maxBlur?: number; // px
  fromScale?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  startFrame = 0,
  durationInFrames,
  maxBlur = 14,
  fromScale = 1.05,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = durationInFrames ?? Math.round(fps * 0.5);
  const local = frame - startFrame;

  const progress = interpolate(local, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const blur = interpolate(progress, [0, 1], [maxBlur, 0]);
  const scale = interpolate(progress, [0, 1], [fromScale, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        filter: `blur(${blur}px)`,
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Кроссфейд-стек строк: следующая строка начинает blur-in, пока предыдущая ещё
 * не закончила fade-out (overlap ~30%). Паттерн из Just Sfx / Botanica.
 */
export const BlurLineStack: React.FC<{
  lines: string[];
  perLineDurationInFrames: number; // сколько строка держится на экране целиком
  overlapRatio?: number; // 0..1, доля перекрытия со следующей строкой
  style?: React.CSSProperties;
}> = ({ lines, perLineDurationInFrames, overlapRatio = 0.3, style }) => {
  const overlap = Math.round(perLineDurationInFrames * overlapRatio);
  const step = perLineDurationInFrames - overlap;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {lines.map((line, i) => (
        <BlurReveal
          key={i}
          startFrame={i * step}
          durationInFrames={Math.round(perLineDurationInFrames * 0.4)}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...style,
          }}
        >
          {line}
        </BlurReveal>
      ))}
    </div>
  );
};
