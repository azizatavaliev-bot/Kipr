export const FPS = 30;
export const TRANSITION = 18;
export const SCENES = [120, 150, 145, 125];

export const PROMO_DURATION =
  SCENES.reduce((a, b) => a + b, 0) - TRANSITION * (SCENES.length - 1);

// Кадр начала каждой сцены в глобальном таймлайне (с учётом переходов).
export const SCENE_STARTS = SCENES.reduce<number[]>((acc, _, i) => {
  if (i === 0) return [0];
  return [...acc, acc[i - 1] + SCENES[i - 1] - TRANSITION];
}, []);
