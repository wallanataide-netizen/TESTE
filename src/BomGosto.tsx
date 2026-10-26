import { loadFont as loadLobster } from "@remotion/google-fonts/Lobster";
import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Interactive,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: lobster } = loadLobster();
const { fontFamily: poppins } = loadPoppins("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

// Paleta tirada da embalagem Massas Bom Gosto
const VERMELHO = "#D7192B";
const VERMELHO_ESCURO = "#8E0A16";
const AMARELO = "#FFC72C";
const DOURADO = "#F5A300";
const VERDE = "#1F8A3B";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const BomGosto: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: VERMELHO_ESCURO }}>
      <Fundo />
      <Raios />
      <Migalhas />
      <Produto />
      <Sequence
        name="Título Maragogi"
        from={3.4 * fps}
        durationInFrames={5.2 * fps}
      >
        <TituloProduto />
      </Sequence>
      <Sequence name="Destaques" from={8.9 * fps} durationInFrames={3.3 * fps}>
        <Destaques />
      </Sequence>
      <Sequence name="Prove e Aprove" from={12.2 * fps}>
        <Final />
      </Sequence>
      <Logo />
      <Sequence
        name="Transição 1"
        from={8.2 * fps}
        durationInFrames={0.6 * fps}
      >
        <Varredura />
      </Sequence>
      <Sequence
        name="Transição 2"
        from={11.8 * fps}
        durationInFrames={0.6 * fps}
      >
        <Varredura />
      </Sequence>
    </AbsoluteFill>
  );
};

// Fundo vermelho com o padrão de folhas da embalagem subindo devagar
const Fundo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, ${VERMELHO} 0%, #B8121F 50%, ${VERMELHO_ESCURO} 100%)`,
      }}
    >
      <svg width="100%" height="100%" style={{ opacity: 0.22 }}>
        <defs>
          <pattern
            id="folhas"
            width={80}
            height={70}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(0 ${-frame * 0.8})`}
          >
            <ellipse
              cx={28}
              cy={35}
              rx={10}
              ry={20}
              fill={VERMELHO_ESCURO}
              transform="rotate(-35 28 35)"
            />
            <ellipse
              cx={52}
              cy={35}
              rx={10}
              ry={20}
              fill={VERMELHO_ESCURO}
              transform="rotate(35 52 35)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#folhas)" />
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 40%, rgba(40,0,5,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Raios de luz amarelos girando atrás do produto
const Raios: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name="Raios"
      style={{
        position: "absolute",
        left: 540 - 1300,
        top: 960 - 1300,
        width: 2600,
        height: 2600,
        borderRadius: "50%",
        background: `repeating-conic-gradient(from 0deg, rgba(255,199,44,0.22) 0deg 9deg, transparent 9deg 18deg)`,
        maskImage: "radial-gradient(circle, black 0%, transparent 55%)",
        rotate: `${frame * 0.25}deg`,
        opacity: interpolate(frame, [0.2 * fps, 1 * fps], [0, 1], clamp),
      }}
    />
  );
};

// Migalhas douradas flutuando por toda a cena
const Migalhas: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {new Array(26).fill(true).map((_, i) => {
        const tamanho = 8 + random(`t${i}`) * 22;
        const velocidade = 1.2 + random(`v${i}`) * 2.8;
        const y =
          ((((random(`y${i}`) * 2200 - frame * velocidade) % 2200) + 2200) %
            2200) -
          140;
        const x = random(`x${i}`) * 1080 + Math.sin((frame + i * 20) / 30) * 20;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: tamanho,
              height: tamanho * 0.8,
              borderRadius: "45% 55% 40% 60%",
              background: `linear-gradient(135deg, ${AMARELO}, ${DOURADO})`,
              opacity: 0.35 + random(`o${i}`) * 0.45,
              rotate: `${frame * velocidade + i * 40}deg`,
              filter: tamanho > 22 ? "blur(3px)" : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Logo: estoura no centro e depois sobe para o topo
const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        name="Logo"
        style={{
          translate: interpolate(
            frame,
            [2.5 * fps, 3.2 * fps],
            ["0px 0px", "0px -715px"],
            {
              ...clamp,
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            },
          ),
          scale: interpolate(frame, [2.5 * fps, 3.2 * fps], [1, 0.55], {
            ...clamp,
            easing: Easing.bezier(0.65, 0, 0.35, 1),
          }),
        }}
      >
        {/* Anel que se expande quando a logo aparece */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `14px solid ${AMARELO}`,
            scale: interpolate(frame, [0.3 * fps, 1.3 * fps], [0.6, 2.2], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            opacity: interpolate(
              frame,
              [0.3 * fps, 0.5 * fps, 1.3 * fps],
              [0, 1, 0],
              clamp,
            ),
          }}
        />
        <div
          style={{
            position: "relative",
            width: 760,
            height: 431,
            borderRadius: "50%",
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(50,0,5,0.6)",
            scale: interpolate(frame, [0.2 * fps, 1.1 * fps], [0, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 11 }),
            }),
            rotate: interpolate(
              frame,
              [0.2 * fps, 1.1 * fps],
              ["-14deg", "0deg"],
              {
                ...clamp,
                easing: Easing.spring({ damping: 11 }),
              },
            ),
          }}
        >
          <Img
            src={staticFile("logo.png")}
            style={{ width: "100%", height: "100%" }}
          />
          {/* Brilho passando pela logo */}
          <div
            style={{
              position: "absolute",
              top: -100,
              bottom: -100,
              width: 160,
              left: interpolate(
                frame,
                [1.2 * fps, 1.9 * fps],
                [-260, 900],
                clamp,
              ),
              rotate: "20deg",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent)",
            }}
          />
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Produto: entra de baixo girando, flutua, vai para a esquerda e volta ao centro
const Produto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flutuar = Math.sin(frame / 18) * 14;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Brilho amarelo atrás do pacote */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,199,44,0.75) 0%, rgba(245,163,0,0.25) 45%, transparent 70%)`,
          scale: interpolate(frame, [3 * fps, 3.8 * fps], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <Interactive.Div
        name="Produto"
        style={{
          translate: interpolate(
            frame,
            [3 * fps, 3.9 * fps, 8.3 * fps, 9 * fps, 11.9 * fps, 12.6 * fps],
            [
              "0px 1700px",
              "0px 0px",
              "0px 0px",
              "-190px 20px",
              "-190px 20px",
              "0px -60px",
            ],
            { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) },
          ),
          rotate: interpolate(
            frame,
            [3 * fps, 3.9 * fps, 8.3 * fps, 9 * fps, 11.9 * fps, 12.6 * fps],
            ["-28deg", "-5deg", "-3deg", "-9deg", "-9deg", "0deg"],
            { ...clamp, easing: Easing.bezier(0.22, 1, 0.36, 1) },
          ),
          scale: interpolate(
            frame,
            [3.9 * fps, 8.3 * fps, 9 * fps, 11.9 * fps, 12.6 * fps, 15 * fps],
            [1, 1.06, 0.86, 0.86, 0.74, 0.8],
            { ...clamp, easing: Easing.bezier(0.45, 0, 0.55, 1) },
          ),
          marginTop: flutuar,
        }}
      >
        <Img
          src={staticFile("produto.png")}
          style={{
            width: 560,
            filter: "drop-shadow(0 50px 50px rgba(50,0,5,0.6))",
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Texto que entra letra por letra
const Letras: React.FC<{
  texto: string;
  inicio: number;
  style: React.CSSProperties;
}> = ({ texto, inicio, style }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", ...style }}>
      {texto.split("").map((letra, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            translate: interpolate(
              frame,
              [inicio + i * 2, inicio + i * 2 + 16],
              ["0px 140px", "0px 0px"],
              {
                ...clamp,
                easing: Easing.spring({ damping: 12 }),
              },
            ),
            opacity: interpolate(
              frame,
              [inicio + i * 2, inicio + i * 2 + 6],
              [0, 1],
              clamp,
            ),
          }}
        >
          {letra === " " ? " " : letra}
        </span>
      ))}
    </div>
  );
};

const estiloScript: React.CSSProperties = {
  fontFamily: lobster,
  color: "white",
  WebkitTextStroke: `6px ${VERMELHO_ESCURO}`,
  paintOrder: "stroke fill",
  textShadow: `0 6px 0 ${VERMELHO_ESCURO}, 0 12px 0 #5E0610, 0 22px 30px rgba(40,0,5,0.6)`,
};

const TituloProduto: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 110,
        opacity: interpolate(
          frame,
          [durationInFrames - 0.3 * fps, durationInFrames],
          [1, 0],
          clamp,
        ),
      }}
    >
      <Letras
        texto="Maragogi"
        inicio={0}
        style={{ ...estiloScript, fontSize: 190, lineHeight: 1 }}
      />
      <Interactive.Div
        name="Goiabada"
        style={{
          marginTop: 10,
          padding: "14px 56px",
          borderRadius: 999,
          backgroundColor: VERDE,
          border: `6px solid white`,
          color: "white",
          fontFamily: poppins,
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: 4,
          boxShadow: "0 14px 30px rgba(40,0,5,0.5)",
          scale: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 10 }),
          }),
        }}
      >
        GOIABADA
      </Interactive.Div>
    </AbsoluteFill>
  );
};

const Selo: React.FC<{
  titulo: string;
  texto: string;
  atraso: number;
}> = ({ titulo, texto, atraso }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: 390,
        padding: "26px 30px",
        borderRadius: 36,
        background: `linear-gradient(135deg, ${AMARELO}, ${DOURADO})`,
        border: `6px solid white`,
        boxShadow: "0 18px 40px rgba(40,0,5,0.55)",
        translate: interpolate(
          frame,
          [atraso * fps, (atraso + 0.6) * fps],
          ["700px 0px", "0px 0px"],
          {
            ...clamp,
            easing: Easing.spring({ damping: 13 }),
          },
        ),
        rotate: interpolate(
          frame,
          [atraso * fps, (atraso + 0.6) * fps],
          ["12deg", "-2deg"],
          {
            ...clamp,
            easing: Easing.spring({ damping: 13 }),
          },
        ),
      }}
    >
      <div
        style={{
          fontFamily: poppins,
          fontWeight: 900,
          fontSize: 30,
          color: VERMELHO_ESCURO,
          letterSpacing: 3,
        }}
      >
        {titulo}
      </div>
      <div
        style={{
          fontFamily: lobster,
          fontSize: 62,
          color: VERMELHO,
          lineHeight: 1.1,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const Destaques: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 50,
        gap: 40,
        opacity: interpolate(
          frame,
          [durationInFrames - 0.3 * fps, durationInFrames],
          [1, 0],
          clamp,
        ),
      }}
    >
      <Selo titulo="BISCOITO" texto="Maragogi" atraso={0.1} />
      <Selo titulo="SABOR" texto="Goiabada" atraso={0.45} />
      <Selo titulo="PESO LÍQUIDO" texto="300g" atraso={0.8} />
    </AbsoluteFill>
  );
};

const Final: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 150,
      }}
    >
      <Interactive.Div
        name="Prove e Aprove"
        style={{
          rotate: "-4deg",
          scale: interpolate(frame, [1 * fps, 2.8 * fps], [1, 1.06], clamp),
        }}
      >
        <Letras
          texto="Prove e Aprove!"
          inicio={0.2 * fps}
          style={{
            ...estiloScript,
            color: AMARELO,
            fontSize: 150,
            lineHeight: 1,
          }}
        />
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Faixa amarela diagonal que cruza a tela nas trocas de cena
const Varredura: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -800,
          top: 860,
          width: 2700,
          height: 260,
          rotate: "-30deg",
          background: `linear-gradient(90deg, ${DOURADO}, ${AMARELO}, ${DOURADO})`,
          boxShadow: `0 0 0 40px rgba(255,199,44,0.35)`,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 1700px", "0px -1700px"],
            {
              ...clamp,
              easing: Easing.bezier(0.65, 0, 0.35, 1),
            },
          ),
        }}
      />
    </AbsoluteFill>
  );
};
