# Kipr

кипр приложение

## Remotion video project

Проект создан через `npx create-video@latest` (Remotion 4, React 19, TypeScript, Tailwind v4).

### Команды

```bash
npm i                # установить зависимости
npm run dev          # открыть Remotion Studio (превью)
npx remotion render MyComp out/video.mp4   # отрендерить видео
npm run lint         # eslint + tsc
```

### Структура

- `src/Root.tsx` — регистрация композиций (размер, fps, длительность)
- `src/Composition.tsx` — сама композиция (React-компонент видео)
- `public/` — ассеты (картинки, аудио, видео), доступны через `staticFile()`
- `remotion.config.ts` — конфиг CLI

### Рендер в окружениях без доступа к remotion.media

Remotion при первом рендере скачивает свой headless-браузер. Если сеть это блокирует,
укажите путь к установленному Chromium headless shell через переменную окружения:

```bash
REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  npx remotion render MyComp out/video.mp4
```

Переменная подхватывается в `remotion.config.ts`.
