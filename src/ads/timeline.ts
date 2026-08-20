export const FPS = 30;
export const TRANSITION = 18;
// Одинаковый таймлайн для обоих вариантов — общий саундтрек попадает в ритм.
export const SCENES = [105, 150, 135, 140];

export const AD_DURATION =
  SCENES.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

export const SCENE_STARTS = SCENES.reduce<number[]>((acc, _, i) => {
  if (i === 0) return [0];
  return [...acc, acc[i - 1] + SCENES[i - 1] - TRANSITION];
}, []);
