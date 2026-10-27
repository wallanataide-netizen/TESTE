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

// Cena 4 (11–16 s): Rainha Especial Agridoce com luz quente e partículas
export const CenaRainha: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const suave = { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) };

  return (
    <AbsoluteFill>
      <FundoMesa tom="dourado" />

      {/* Halo quente atrás da embalagem */}
      <div
        style={{
          position: "absolute",
          left: 540 - 520,
          top: 900 - 520,
          width: 1040,
          height: 1040,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,230,160,0.55) 0%, rgba(255,190,80,0.15) 50%, transparent 70%)",
          scale: interpolate(frame, [0, durationInFrames], [0.9, 1.1], suave),
        }}
      />

      <Interactive.Div
        name="Rainha Especial"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 520,
          display: "flex",
          justifyContent: "center",
          transformOrigin: "50% 100%",
          scale: interpolate(frame, [0, durationInFrames], [0.95, 1.06], suave),
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["-25px 0px", "25px 0px"],
            suave,
          ),
          rotate: interpolate(
            frame,
            [0, durationInFrames],
            ["-1.5deg", "1deg"],
            suave,
          ),
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], clamp),
        }}
      >
        <Embalagem
          src={IMAGENS.rainha}
          altura={940}
          brilho={interpolate(frame, [1.5 * fps, 3 * fps], [0, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "extend",
          })}
        />
      </Interactive.Div>

      <Particulas quantidade={34} opacidade={0.75} />

      <TextoCena
        linhas={["Especial em", "Cada Momento"]}
        inicio={0.6 * fps}
        fim={durationInFrames}
        top={1480}
        tamanho={88}
      />
    </AbsoluteFill>
  );
};
