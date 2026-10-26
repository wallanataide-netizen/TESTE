import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  interpolate,
  useCurrentFrame,
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
      defaultProps={{ titulo: "Meu vídeo vertical" }}
      calculateMetadata={calculateMetadata}
    />
  );
};

export const MyComponent: React.FC<Props> = ({ titulo }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
        padding: 80,
      }}
    >
      <h1
        style={{
          color: "white",
          fontFamily: "sans-serif",
          fontSize: 110,
          textAlign: "center",
          opacity,
        }}
      >
        {titulo}
      </h1>
    </AbsoluteFill>
  );
};
