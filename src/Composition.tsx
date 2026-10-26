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
      defaultProps={{ titulo: "O Alan" }}
      calculateMetadata={calculateMetadata}
    />
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #312e81 0%, #111827 55%, #030712 100%)",
        scale: interpolate(frame, [0, durationInFrames], [1, 1.12], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

const Ring: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        name="Anel"
        style={{
          width: 820,
          height: 820,
          borderRadius: "50%",
          border: "6px solid #818cf8",
          boxShadow: "0 0 80px #6366f1, inset 0 0 80px #6366f1",
          scale: interpolate(frame, [0, 1.2 * fps], [0.2, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
          opacity: interpolate(frame, [0, 0.6 * fps], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          rotate: interpolate(frame, [0, 5 * fps], ["0deg", "90deg"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const Letter: React.FC<{ char: string; index: number }> = ({ char, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = 0.5 * fps + index * 0.12 * fps;

  return (
    <Interactive.Span
      name={`Letra ${char === " " ? "espaço" : char}`}
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        opacity: interpolate(frame, [start, start + 0.3 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(
          frame,
          [start, start + 0.8 * fps],
          ["0px 160px", "0px 0px"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
          },
        ),
        rotate: interpolate(
          frame,
          [start, start + 0.8 * fps],
          ["-25deg", "0deg"],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
          },
        ),
      }}
    >
      {char}
    </Interactive.Span>
  );
};

const Title: React.FC<Props> = ({ titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Interactive.Div
        name="Título"
        style={{
          color: "white",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 900,
          fontSize: 200,
          letterSpacing: 4,
          textAlign: "center",
          textShadow: "0 12px 50px rgba(99, 102, 241, 0.8)",
          scale: interpolate(frame, [2 * fps, 5 * fps], [1, 1.08], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      >
        {titulo.split("").map((char, i) => (
          <Letter key={i} char={char} index={i} />
        ))}
      </Interactive.Div>
      <Interactive.Div
        name="Sublinhado"
        style={{
          marginTop: 30,
          height: 14,
          width: 560,
          borderRadius: 7,
          background: "linear-gradient(90deg, #22d3ee, #a855f7)",
          transformOrigin: "left center",
          scale: interpolate(frame, [1.6 * fps, 2.4 * fps], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
    </AbsoluteFill>
  );
};

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        opacity: interpolate(frame, [4.5 * fps, 5 * fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    />
  );
};

export const MyComponent: React.FC<Props> = ({ titulo }) => {
  return (
    <AbsoluteFill>
      <Background />
      <Ring />
      <Title titulo={titulo} />
      <FadeOut />
    </AbsoluteFill>
  );
};
