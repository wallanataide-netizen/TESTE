import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Poeira dourada discreta subindo devagar
export const Particulas: React.FC<{
  quantidade?: number;
  opacidade?: number;
}> = ({ quantidade = 30, opacidade = 0.7 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(quantidade).fill(true).map((_, i) => {
        const tamanho = 3 + random(`p${i}`) * 7;
        const velocidade = 0.6 + random(`pv${i}`) * 1.6;
        const y =
          ((((random(`py${i}`) * 2000 - frame * velocidade) % 2000) + 2000) %
            2000) -
          40;
        const x =
          random(`px${i}`) * 1080 + Math.sin((frame + i * 13) / 25) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: tamanho,
              height: tamanho,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #FFF4CF 0%, #F3C766 50%, transparent 75%)",
              opacity:
                opacidade *
                (0.3 + random(`po${i}`) * 0.7) *
                (0.6 + 0.4 * Math.sin((frame + i * 9) / 12)),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
