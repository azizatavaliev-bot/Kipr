import "./index.css";
import { Composition } from "remotion";
import { KiprPromo, PROMO_DURATION } from "./KiprPromo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="KiprPromo"
        component={KiprPromo}
        durationInFrames={PROMO_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
