import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Easing,
  interpolate,
  Interactive,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Props = {
  titulo: string;
};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="Vertical"
      component={MyComponent}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ titulo: "TESTE" }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const LARANJA = "#FF6A00";

export const MyComponent: React.FC<Props> = ({ titulo }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 40%, #FF9A3C 0%, ${LARANJA} 55%, #E85400 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo titulo={titulo} />
    </AbsoluteFill>
  );
};

const Logo: React.FC<Props> = ({ titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <Interactive.Div
      name="Logo"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 70,
        translate: interpolate(frame, [0, 1.2 * fps], ["0px 1400px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 14 }),
        }),
      }}
    >
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: 120,
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 40px 80px rgba(120, 40, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        <SetaParaBaixo />
      </div>
      <Interactive.Div
        name="Nome"
        style={{
          color: "white",
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: 800,
          fontSize: 120,
          letterSpacing: 24,
          paddingLeft: 24,
          opacity: interpolate(frame, [1.2 * fps, 2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(
            frame,
            [1.2 * fps, 2 * fps],
            ["0px 40px", "0px 0px"],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {titulo}
      </Interactive.Div>
    </Interactive.Div>
  );
};

const SetaParaBaixo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Leve "quique" contínuo para baixo depois que a seta entra
  const quique =
    frame > 2 * fps
      ? Math.abs(Math.sin(((frame - 2 * fps) / fps) * Math.PI * 1.5)) * 30
      : 0;

  return (
    <Interactive.Svg
      name="Seta"
      width={240}
      height={260}
      viewBox="0 0 240 260"
      style={{
        opacity: interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(
          frame,
          [0.6 * fps, 1.6 * fps],
          ["0px -260px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
          },
        ),
        marginTop: quique,
      }}
    >
      <path
        d="M120 20 V200 M40 130 L120 210 L200 130"
        fill="none"
        stroke={LARANJA}
        strokeWidth={44}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Interactive.Svg>
  );
};
