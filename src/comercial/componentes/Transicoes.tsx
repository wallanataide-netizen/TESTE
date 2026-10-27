import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp } from "../tema";

// Clarão dourado que cobre o corte entre duas cenas (o corte fica no meio)
export const Clarao: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, rgba(255,240,200,1) 0%, rgba(255,200,110,0.85) 40%, rgba(120,50,10,0.6) 100%)",
        opacity: interpolate(
          frame,
          [0, durationInFrames / 2, durationInFrames],
          [0, 0.95, 0],
          clamp,
        ),
      }}
    />
  );
};

// Painel vermelho com fio dourado que atravessa a tela da direita para a esquerda
export const TransicaoLateral: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          width: 2600,
          rotate: "8deg",
          background:
            "linear-gradient(90deg, #F3C766 0px, #C98A2B 16px, #A80F1B 16px, #7A0A10 100%)",
          boxShadow: "-30px 0 60px rgba(0,0,0,0.5)",
          left: interpolate(frame, [0, durationInFrames], [1200, -3800], {
            ...clamp,
            easing: Easing.bezier(0.7, 0, 0.3, 1),
          }),
        }}
      />
    </AbsoluteFill>
  );
};
