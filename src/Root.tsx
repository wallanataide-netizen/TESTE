import { MyComposition } from "./Composition";
import { LoteamentoComposition } from "./Loteamento";
import { ObraComposition } from "./Obra";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LoteamentoComposition />
      <ObraComposition />
    </>
  );
};
