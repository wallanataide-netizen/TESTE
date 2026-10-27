import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  staticFile,
  Track,
  useVideoConfig,
} from "remotion";
import { Abertura } from "./cenas/Abertura";
import { CenaManteiga } from "./cenas/CenaManteiga";
import { CenaPastel } from "./cenas/CenaPastel";
import { CenaRainha } from "./cenas/CenaRainha";
import { Encerramento } from "./cenas/Encerramento";
import { Clarao, TransicaoLateral } from "./componentes/Transicoes";

// Comercial Massas Bom Gosto: 20 s, 1080x1920, 30 fps.
// Os tempos de cada cena e de cada fala estão aqui para ajustes rápidos.
export const Comercial: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Track name="Cenas">
        <Sequence name="1. Abertura" durationInFrames={3 * fps}>
          <Abertura />
        </Sequence>
        <Sequence
          name="2. Pastel Calabresa"
          from={3 * fps}
          durationInFrames={4 * fps}
        >
          <CenaPastel />
        </Sequence>
        <Sequence
          name="3. Manteiga do Sertão"
          from={7 * fps}
          durationInFrames={4 * fps}
        >
          <CenaManteiga />
        </Sequence>
        <Sequence
          name="4. Rainha Especial"
          from={11 * fps}
          durationInFrames={5 * fps}
        >
          <CenaRainha />
        </Sequence>
        <Sequence
          name="5. Encerramento"
          from={16 * fps}
          durationInFrames={4 * fps}
        >
          <Encerramento />
        </Sequence>
      </Track>

      <Track name="Transições">
        <Sequence name="Clarão 3 s" from={3 * fps - 6} durationInFrames={12}>
          <Clarao />
        </Sequence>
        <Sequence name="Lateral 7 s" from={7 * fps - 9} durationInFrames={18}>
          <TransicaoLateral />
        </Sequence>
        <Sequence name="Clarão 11 s" from={11 * fps - 6} durationInFrames={12}>
          <Clarao />
        </Sequence>
        <Sequence name="Clarão 16 s" from={16 * fps - 6} durationInFrames={12}>
          <Clarao />
        </Sequence>
      </Track>

      {/* Narração: troque os arquivos em public/audio/ para usar outra voz */}
      <Track name="Narração">
        <Audio
          name="Fala 1"
          src={staticFile("audio/narracao-1.mp3")}
          from={6}
          durationInFrames={84}
        />
        <Audio
          name="Fala 2"
          src={staticFile("audio/narracao-2.mp3")}
          from={93}
          durationInFrames={117}
        />
        <Audio
          name="Fala 3"
          src={staticFile("audio/narracao-3.mp3")}
          from={213}
          durationInFrames={117}
        />
        <Audio
          name="Fala 4"
          src={staticFile("audio/narracao-4.mp3")}
          from={333}
          durationInFrames={147}
        />
        <Audio
          name="Fala 5"
          src={staticFile("audio/narracao-5.mp3")}
          from={483}
          durationInFrames={117}
        />
      </Track>

      <Audio
        name="Trilha"
        src={staticFile("audio/trilha.mp3")}
        volume={(f) =>
          interpolate(f, [0, 10, 19 * fps, 20 * fps], [0, 0.3, 0.3, 0], {
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
