import { Composition } from "remotion";
import { Comercial } from "./comercial/Comercial";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <Composition
        id="ComercialBomGosto"
        component={Comercial}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
