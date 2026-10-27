import { loadFont } from "@remotion/google-fonts/Lobster";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily: lobster } = loadFont();

// Cores tiradas da arte de referência
const VERMELHO = "#A00008";
const VERMELHO_BORDA = "#5A0A0E";
const VERMELHO_TEXTO_FUNDO = "rgba(205,20,32,0.55)";
const AMARELO = "#DB9204";
const BRANCO = "#ECE4E4";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const TaCalor: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, #B5040C 0%, ${VERMELHO} 45%, ${VERMELHO_BORDA} 100%)`,
        overflow: "hidden",
      }}
    >
      <PalavrasFundo />
      <OndasCalor />
      <Termometro />
      <Frase />
      <Granulado />
    </AbsoluteFill>
  );
};

// Palavras grandes e desfocadas ao fundo, como na arte original
const PalavrasFundo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const linhas = [
    { texto: "calorrr", top: 40, tamanho: 230, x: -120 },
    { texto: "Tá quente", top: 330, tamanho: 330, x: -300 },
    { texto: "calorrr", top: 1300, tamanho: 260, x: 260 },
    { texto: "Tá quente", top: 1560, tamanho: 340, x: -200 },
  ];

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, durationInFrames], [1.12, 1], {
          ...clamp,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        rotate: "-8deg",
      }}
    >
      {linhas.map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: l.top,
            left: l.x + (i % 2 === 0 ? 1 : -1) * frame * 0.6,
            whiteSpace: "nowrap",
            fontFamily: lobster,
            fontSize: l.tamanho,
            color: VERMELHO_TEXTO_FUNDO,
            filter: "blur(9px)",
          }}
        >
          {l.texto}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// Linhas onduladas de calor subindo pela tela
const OndasCalor: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], clamp),
      }}
    >
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 90 + i * 180;
        const y = 2000 - ((frame * (5 + (i % 3)) + i * 330) % 2300);
        const fase = frame / 6 + i;
        const d = `M 0 0 C ${30 * Math.sin(fase)} 40, ${-30 * Math.sin(fase)} 80, 0 120 S ${30 * Math.sin(fase)} 200, 0 240`;
        return (
          <svg
            key={i}
            width={80}
            height={260}
            viewBox="-40 -10 80 260"
            style={{
              position: "absolute",
              left: x - 40,
              top: y,
              filter: "blur(3px)",
              overflow: "visible",
            }}
          >
            <path
              d={d}
              fill="none"
              stroke="rgba(255,190,90,0.28)"
              strokeWidth={14}
              strokeLinecap="round"
            />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

// Frase "táááá Calorrr" com entrada dinâmica
const Frase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ta = "táááááááá".split("");
  const calor = "Calorrr".split("");
  const pancada = 1.0 * fps;
  // Tremidinha da tela quando "Calorrr" bate
  const tremor =
    interpolate(frame, [pancada, pancada + 10], [1, 0], clamp) *
    Math.sin(frame * 2.3) *
    14;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 120,
      }}
    >
      <Interactive.Div
        name="Frase"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          rotate: "-8deg",
          translate: `${tremor}px ${tremor * 0.5}px`,
        }}
      >
        {/* "táááá" esticando letra por letra */}
        <div
          style={{
            display: "flex",
            fontFamily: lobster,
            fontSize: 130,
            color: AMARELO,
            lineHeight: 1,
            marginRight: 10,
            textShadow: "0 6px 16px rgba(60,0,0,0.45)",
          }}
        >
          {ta.map((letra, i) => {
            const inicio = 0.25 * fps + i * 2;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transformOrigin: "50% 100%",
                  scale: interpolate(frame, [inicio, inicio + 8], [0, 1], {
                    ...clamp,
                    easing: Easing.spring({ damping: 9 }),
                  }),
                  translate: `0px ${Math.sin((frame - i * 3) / 5) * 6 * interpolate(frame, [inicio + 8, inicio + 14], [0, 1], clamp)}px`,
                }}
              >
                {letra}
              </span>
            );
          })}
        </div>

        {/* "Calorrr" batendo na tela e tremendo com o calor */}
        <div
          style={{
            display: "flex",
            fontFamily: lobster,
            fontSize: 330,
            lineHeight: 1,
            color: BRANCO,
            textShadow: "0 10px 30px rgba(60,0,0,0.5)",
            scale: interpolate(frame, [pancada, pancada + 12], [2.6, 1], {
              ...clamp,
              easing: Easing.spring({ damping: 11 }),
            }),
            opacity: interpolate(frame, [pancada, pancada + 4], [0, 1], clamp),
          }}
        >
          {calor.map((letra, i) => {
            const ehR = i >= 4;
            const balanco = interpolate(
              frame,
              [pancada + 12, pancada + 20],
              [0, 1],
              clamp,
            );
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  translate: `${ehR ? Math.sin(frame / 2 + i) * 4 * balanco : 0}px ${Math.sin((frame + i * 6) / 7) * (ehR ? 10 : 5) * balanco}px`,
                  rotate: `${ehR ? Math.sin(frame / 3 + i) * 4 * balanco : 0}deg`,
                }}
              >
                {letra}
              </span>
            );
          })}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Termômetro surgindo com o mercúrio subindo e a temperatura contando
const Termometro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subida = interpolate(frame, [1.8 * fps, 3.8 * fps], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.2, 1),
  });
  const topo = interpolate(frame, [3.8 * fps, 4.1 * fps], [0, 1], clamp);
  const graus = Math.round(interpolate(subida, [0, 1], [25, 40]));
  const tremor = topo * Math.sin(frame * 1.7) * 3;
  // Tubo: de y=40 a y=400; o mercúrio sobe a partir do bulbo (y=430)
  const alturaMercurio = interpolate(subida, [0, 1], [40, 360]);

  return (
    <AbsoluteFill style={{ alignItems: "center", top: 250, bottom: "auto" }}>
      <Interactive.Div
        name="Termômetro"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
          scale: interpolate(frame, [1.4 * fps, 1.9 * fps], [0, 1], {
            ...clamp,
            easing: Easing.spring({ damping: 10 }),
          }),
          rotate: interpolate(
            frame,
            [1.4 * fps, 1.9 * fps],
            ["-25deg", "-8deg"],
            {
              ...clamp,
              easing: Easing.spring({ damping: 10 }),
            },
          ),
          translate: `${tremor}px 0px`,
        }}
      >
        <svg
          width={170}
          height={520}
          viewBox="0 0 170 520"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="mercurio" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={AMARELO} />
              <stop offset="100%" stopColor="#FFC94A" />
            </linearGradient>
          </defs>
          {/* Brilho do bulbo quando chega ao máximo */}
          <circle
            cx={85}
            cy={440}
            r={70 + topo * 30}
            fill={AMARELO}
            opacity={topo * 0.35}
          />
          {/* Corpo */}
          <rect x={55} y={20} width={60} height={420} rx={30} fill={BRANCO} />
          <circle cx={85} cy={440} r={62} fill={BRANCO} />
          {/* Mercúrio */}
          <rect
            x={70}
            y={430 - alturaMercurio}
            width={30}
            height={alturaMercurio + 10}
            rx={15}
            fill="url(#mercurio)"
          />
          <circle cx={85} cy={440} r={46} fill="url(#mercurio)" />
          {/* Marcações */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect
              key={i}
              x={122}
              y={70 + i * 50}
              width={i % 2 === 0 ? 34 : 22}
              height={8}
              rx={4}
              fill={BRANCO}
            />
          ))}
          {/* Reflexo */}
          <rect
            x={64}
            y={45}
            width={8}
            height={300}
            rx={4}
            fill="white"
            opacity={0.6}
          />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Setas subindo */}
          <svg
            width={120}
            height={150}
            viewBox="0 0 120 150"
            style={{ opacity: subida > 0 ? 1 : 0 }}
          >
            {[0, 1].map((i) => {
              const ciclo = (frame / 20 + i * 0.5) % 1;
              return (
                <path
                  key={i}
                  d="M 20 70 L 60 30 L 100 70"
                  fill="none"
                  stroke={AMARELO}
                  strokeWidth={16}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform={`translate(0 ${60 - ciclo * 60})`}
                  opacity={Math.sin(ciclo * Math.PI)}
                />
              );
            })}
          </svg>
          <div
            style={{
              fontFamily: lobster,
              fontSize: 150,
              lineHeight: 1,
              color: BRANCO,
              textShadow: "0 8px 20px rgba(60,0,0,0.5)",
              scale: 1 + topo * 0.15 * Math.abs(Math.sin(frame / 4)),
              transformOrigin: "0% 50%",
            }}
          >
            {graus}°
          </div>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// Granulado de filme por cima de tudo, como na arte
const Granulado: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none" }}
    >
      <svg width="100%" height="100%">
        <filter id="grao">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.85}
            numOctaves={2}
            seed={Math.floor(frame / 2) % 8}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grao)" />
      </svg>
    </AbsoluteFill>
  );
};
