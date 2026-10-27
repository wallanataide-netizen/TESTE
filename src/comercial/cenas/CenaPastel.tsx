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

// Cena 2 (3–7 s): Pastel Calabresa com aproximação e luz lateral
export const CenaPastel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <FundoMesa tom="cafe" />

      <Interactive.Div
        name="Pastel Calabresa"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 520,
          display: "flex",
          justifyContent: "center",
          transformOrigin: "50% 100%",
          scale: interpolate(frame, [0, durationInFrames], [0.84, 1.04], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          rotate: interpolate(
            frame,
            [0, durationInFrames],
            ["-2deg", "0deg"],
            clamp,
          ),
        }}
      >
        <Embalagem
          src={IMAGENS.calabresa}
          altura={980}
          sombra="drop-shadow(45px 35px 40px rgba(0,0,0,0.6))"
          brilho={interpolate(frame, [0.8 * fps, 2.2 * fps], [0, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "extend",
          })}
        />
      </Interactive.Div>

      {/* Luz lateral quente vinda da esquerda e sombra à direita */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(255,180,90,0.32) 0%, rgba(255,180,90,0.08) 35%, rgba(0,0,0,0) 55%, rgba(10,3,0,0.45) 100%)",
          mixBlendMode: "soft-light",
        }}
      />

      <Particulas quantidade={16} opacidade={0.45} />

      <TextoCena
        linhas={["Crocância e Sabor"]}
        inicio={0.5 * fps}
        fim={durationInFrames}
        top={1530}
        tamanho={92}
      />
    </AbsoluteFill>
  );
};
