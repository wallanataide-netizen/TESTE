import {
  AbsoluteFill,
  Easing,
  interpolate,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Embalagem } from "../componentes/Embalagem";
import { FundoMesa } from "../componentes/FundoMesa";
import { Particulas } from "../componentes/Particulas";
import { TextoCena } from "../componentes/TextoCena";
import { clamp, IMAGENS } from "../tema";

// Cena 1 (0–3 s): mesa de café com luz dourada, câmera recuando sobre os três produtos
export const Abertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const camera = { ...clamp, easing: Easing.bezier(0.25, 0.1, 0.25, 1) };

  return (
    <AbsoluteFill>
      <FundoMesa tom="cafe" />

      {/* Feixes de luz dourada vindos do alto */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(115deg, rgba(255,214,140,0.0) 20%, rgba(255,214,140,0.22) 32%, rgba(255,214,140,0) 44%, rgba(255,214,140,0.15) 55%, rgba(255,214,140,0) 66%)",
          mixBlendMode: "screen",
          opacity: interpolate(frame, [0, 1 * fps], [0, 1], clamp),
        }}
      />

      <Interactive.Div
        name="Câmera"
        style={{
          position: "absolute",
          inset: 0,
          scale: interpolate(
            frame,
            [0, durationInFrames],
            [1.22, 1.02],
            camera,
          ),
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 120px", "0px 0px"],
            camera,
          ),
        }}
      >
        {/* Produtos ao fundo, desfocados para dar profundidade */}
        <div
          style={{
            position: "absolute",
            left: 40,
            bottom: 520,
            rotate: "-5deg",
            filter: `blur(${interpolate(frame, [0, durationInFrames], [7, 3], clamp)}px)`,
            translate: interpolate(
              frame,
              [0, durationInFrames],
              ["-30px 0px", "0px 0px"],
              camera,
            ),
          }}
        >
          <Embalagem src={IMAGENS.calabresa} altura={720} reflexo={false} />
        </div>
        <div
          style={{
            position: "absolute",
            right: 20,
            bottom: 520,
            rotate: "5deg",
            filter: `blur(${interpolate(frame, [0, durationInFrames], [7, 3], clamp)}px)`,
            translate: interpolate(
              frame,
              [0, durationInFrames],
              ["30px 0px", "0px 0px"],
              camera,
            ),
          }}
        >
          <Embalagem src={IMAGENS.rainha} altura={720} reflexo={false} />
        </div>
        {/* Produto em primeiro plano */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 520,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Embalagem src={IMAGENS.manteiga} altura={840} />
        </div>
      </Interactive.Div>

      <Particulas quantidade={24} opacidade={0.6} />

      <TextoCena
        linhas={["Sabor que", "conquista"]}
        inicio={0.4 * fps}
        fim={durationInFrames + 20}
        top={150}
        tamanho={108}
      />

      {/* Abertura a partir do preto */}
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: interpolate(frame, [0, 0.6 * fps], [1, 0], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
