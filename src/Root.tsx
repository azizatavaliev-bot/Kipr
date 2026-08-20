import "./index.css";
import { Composition } from "remotion";
import { KiprPromo, PROMO_DURATION } from "./KiprPromo";
import { KiprAdRoute, KiprAdEntry, AD_DURATION } from "./ads";

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
      <Composition
        id="KiprAdRoute"
        component={KiprAdRoute}
        durationInFrames={AD_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="KiprAdEntry"
        component={KiprAdEntry}
        durationInFrames={AD_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
