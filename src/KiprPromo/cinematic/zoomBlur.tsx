import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Easing } from "remotion";
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";

type ZoomBlurProps = Record<string, never>;

/**
 * Кастомный переход «zoom + blur» (классика AE): уходящая сцена
 * увеличивается и расфокусируется, новая — прилетает из лёгкого зума в фокус.
 */
const ZoomBlurPresentation: React.FC<
  TransitionPresentationComponentProps<ZoomBlurProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;

  const style: React.CSSProperties = useMemo(() => {
    if (entering) {
      const e = interpolate(p, [0, 1], [0, 1], {
        easing: Easing.out(Easing.cubic),
      });
      return {
        opacity: interpolate(e, [0, 0.4, 1], [0, 1, 1]),
        transform: `scale(${interpolate(e, [0, 1], [1.14, 1])})`,
        filter: `blur(${interpolate(e, [0, 1], [14, 0])}px)`,
      };
    }
    const x = interpolate(p, [0, 1], [0, 1], {
      easing: Easing.in(Easing.cubic),
    });
    return {
      opacity: interpolate(x, [0, 0.6, 1], [1, 1, 0]),
      transform: `scale(${interpolate(x, [0, 1], [1, 1.1])})`,
      filter: `blur(${interpolate(x, [0, 1], [0, 12])}px)`,
    };
  }, [entering, p]);

  return <AbsoluteFill style={style}>{children}</AbsoluteFill>;
};

export const zoomBlur = (): TransitionPresentation<ZoomBlurProps> => ({
  component: ZoomBlurPresentation,
  props: {},
});
