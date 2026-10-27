import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Embalagem } from "../componentes/Embalagem";
import { FundoMesa } from "../componentes/FundoMesa";
import { Particulas } from "../componentes/Particulas";
import {
  clamp,
  CORES,
  FONTE_TEXTO,
  FONTE_TITULO,
  GRADIENTE_OURO,
  IMAGENS,
  PROPORCAO,
} from "../tema";

const ALTURA = 600;

// Cena 5 (16–20 s): os três produtos lado a lado, logo e assinatura
export const Encerramento: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = (atraso: number) => ({
    translate: interpolate(
      frame,
      [atraso, atraso + 0.6 * fps],
      ["0px 260px", "0px 0px"],
      {
        ...clamp,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      },
    ),
    opacity: interpolate(frame, [atraso, atraso + 0.3 * fps], [0, 1], clamp),
  });

  return (
    <AbsoluteFill>
      <FundoMesa tom="cafe" linhaMesa={1280} />

      {/* Raios dourados girando atrás dos produtos */}
      <div
        style={{
          position: "absolute",
          left: 540 - 1100,
          top: 960 - 1100,
          width: 2200,
          height: 2200,
          borderRadius: "50%",
          background:
            "repeating-conic-gradient(from 0deg, rgba(255,214,140,0.10) 0deg 8deg, transparent 8deg 16deg)",
          maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
          rotate: `${frame * 0.15}deg`,
        }}
      />

      <Interactive.Div
        name="Logo"
        style={{
          position: "absolute",
          left: 540 - 270,
          top: 130,
          scale: interpolate(frame, [0, 0.7 * fps], [0.6, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 12 }),
          }),
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], clamp),
        }}
      >
        <Img
          src={IMAGENS.logo}
          style={{
            display: "block",
            width: 540,
            height: 540 / PROPORCAO.logo,
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.55))",
          }}
        />
      </Interactive.Div>

      {/* Três produtos inteiros, sem sobreposição */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1280 - ALTURA,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        <Interactive.Div name="Pastel Calabresa" style={entrada(0.2 * fps)}>
          <Embalagem src={IMAGENS.calabresa} altura={ALTURA} />
        </Interactive.Div>
        <Interactive.Div name="Manteiga do Sertão" style={entrada(0.35 * fps)}>
          <Embalagem src={IMAGENS.manteiga} altura={ALTURA} />
        </Interactive.Div>
        <Interactive.Div name="Rainha Especial" style={entrada(0.5 * fps)}>
          <Embalagem src={IMAGENS.rainha} altura={ALTURA} />
        </Interactive.Div>
      </div>

      <Particulas quantidade={20} opacidade={0.5} />

      <Interactive.Div
        name="Massas Bom Gosto"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1420,
          textAlign: "center",
          fontFamily: FONTE_TITULO,
          fontWeight: 800,
          fontSize: 82,
          letterSpacing: 6,
          backgroundImage: GRADIENTE_OURO,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.8))",
          opacity: interpolate(frame, [1 * fps, 1.5 * fps], [0, 1], clamp),
          translate: interpolate(
            frame,
            [1 * fps, 1.6 * fps],
            ["0px 30px", "0px 0px"],
            {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        MASSAS BOM GOSTO
      </Interactive.Div>

      <AbsoluteFill style={{ top: 1560, bottom: "auto", alignItems: "center" }}>
        <Interactive.Div
          name="Prove e Aprove"
          style={{
            padding: "22px 64px",
            borderRadius: 999,
            background: `linear-gradient(180deg, #E8303B, ${CORES.vermelho} 60%, #A80F1B)`,
            border: "5px solid #F3C766",
            boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
            color: CORES.creme,
            fontFamily: FONTE_TEXTO,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: 4,
            scale: interpolate(frame, [1.8 * fps, 2.4 * fps], [0, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 11 }),
            }),
          }}
        >
          PROVE E APROVE!
        </Interactive.Div>
      </AbsoluteFill>

      {/* Fade final */}
      <AbsoluteFill
        style={{
          backgroundColor: "black",
          opacity: interpolate(frame, [3.6 * fps, 4 * fps], [0, 0.35], clamp),
        }}
      />
    </AbsoluteFill>
  );
};
