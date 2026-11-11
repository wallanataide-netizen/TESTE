import { Composition } from "remotion";
import { Anuncio, DURACAO } from "./Anuncio";
import { MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RonaldsAnuncio"
        component={Anuncio}
        durationInFrames={Math.round(DURACAO * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      <MyComposition />
    </>
  );
};
