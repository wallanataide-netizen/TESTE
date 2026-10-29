import { MyComposition } from "./Composition";
import { FinalComposition } from "./Final";
import { LoteamentoComposition } from "./Loteamento";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <MyComposition />
      <LoteamentoComposition />
      <FinalComposition />
    </>
  );
};
