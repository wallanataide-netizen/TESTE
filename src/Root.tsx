import { Composition } from "remotion";
import { Anuncio, DURACAO } from "./Anuncio";
import { MyComposition } from "./Composition";
import { PostsFixados } from "./Fixados";
import { PerfilStill } from "./Perfil";
import { CapasDestaques } from "./Destaques";
import { CombosStills } from "./Combos";

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
      <PostsFixados />
      <PerfilStill />
      <CapasDestaques />
      <CombosStills />
      <MyComposition />
    </>
  );
};
