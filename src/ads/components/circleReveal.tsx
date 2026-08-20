import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type CircleProps = Record<string, never>;

/**
 * Фирменный Apple-переход: новая сцена раскрывается кругом из центра
 * и заполняет весь экран. Уходящая сцена остаётся снизу без движения.
 */
const CirclePresentation: React.FC<
  TransitionPresentationComponentProps<CircleProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const entering = presentationDirection === "entering";

  const style: React.CSSProperties = useMemo(() => {
    if (!entering) return {};
    const p = interpolate(presentationProgress, [0, 1], [0, 1], {
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    // 75% покрывает диагональ 9:16 с запасом
    const r = p * 78;
    return {
      clipPath: `circle(${r}% at 50% 50%)`,
      WebkitClipPath: `circle(${r}% at 50% 50%)`,
    };
  }, [entering, presentationProgress]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const circleReveal = (): TransitionPresentation<CircleProps> => ({
  component: CirclePresentation,
  props: {},
});
