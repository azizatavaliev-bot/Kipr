import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

const fontFamily = "Montserrat";

// Шрифты лежат локально в public/fonts — рендер не зависит от сети.
for (const weight of ["400", "600", "800"] as const) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/Montserrat-${weight}.ttf`),
    weight,
  });
}

export const theme = {
  fontFamily,
  bg: "#07131C",
  text: "#F5F5F7",
  textDim: "rgba(245,245,247,0.62)",
  aqua: "#2EC6E6",
  sun: "#FFB347",
  sunDeep: "#FF7A3D",
};
