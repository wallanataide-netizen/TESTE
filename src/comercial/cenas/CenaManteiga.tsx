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
import { TextoCena } from "../componentes/TextoCena";
import { clamp, IMAGENS } from "../tema";

// Cena 3 (7–11 s): Manteiga do Sertão entrando pela lateral, em vermelho e dourado
export const CenaManteiga: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill>
      <FundoMesa tom="vermelho" />

      {/* Faixas douradas atravessando o fundo em paralaxe */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -400,
            width: 2000,
            top: 260 + i * 330,
            height: 6 + i * 4,
            rotate: "-12deg",
            background:
              "linear-gradient(90deg, transparent, rgba(243,199,102,0.7), transparent)",
            translate: `${interpolate(frame, [0, durationInFrames], [300 + i * 120, -300 - i * 160])}px 0px`,
          }}
        />
      ))}

      <Interactive.Div
        name="Manteiga do Sertão"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 520,
          display: "flex",
          justifyContent: "center",
          translate: interpolate(
            frame,
            [0, 0.8 * fps, durationInFrames],
            ["900px 0px", "30px 0px", "-30px 0px"],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          rotate: interpolate(
            frame,
            [0, 0.8 * fps, durationInFrames],
            ["8deg", "0deg", "-1deg"],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
          transformOrigin: "50% 100%",
          scale: interpolate(frame, [0, durationInFrames], [1, 1.05], clamp),
        }}
      >
        <Embalagem
          src={IMAGENS.manteiga}
          altura={980}
          brilho={interpolate(frame, [1.3 * fps, 2.6 * fps], [0, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "extend",
          })}
        />
      </Interactive.Div>

      <TextoCena
        linhas={["Sabor e Tradição"]}
        inicio={0.6 * fps}
        fim={durationInFrames}
        top={1530}
        tamanho={96}
      />
    </AbsoluteFill>
  );
};
