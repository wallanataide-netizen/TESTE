import { Easing, interpolate, Interactive, useCurrentFrame } from "remotion";
import { clamp, FONTE_TITULO, GRADIENTE_OURO } from "../tema";

// Título elegante: revela da esquerda para a direita, com fio dourado embaixo
export const TextoCena: React.FC<{
  linhas: string[];
  inicio: number;
  fim: number;
  tamanho?: number;
  top: number;
}> = ({ linhas, inicio, fim, tamanho = 96, top }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [inicio, inicio + 22], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <Interactive.Div
      name="Texto"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: interpolate(frame, [fim - 10, fim], [1, 0], clamp),
        translate: interpolate(
          frame,
          [inicio, inicio + 22],
          ["0px 40px", "0px 0px"],
          {
            ...clamp,
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        ),
      }}
    >
      {linhas.map((linha, i) => (
        <div
          key={i}
          style={{
            fontFamily: FONTE_TITULO,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: tamanho,
            lineHeight: 1.12,
            textAlign: "center",
            backgroundImage: GRADIENTE_OURO,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.7))",
            clipPath: `inset(-20% ${100 - interpolate(frame, [inicio + i * 5, inicio + i * 5 + 24], [0, 100], { ...clamp, easing: Easing.bezier(0.33, 1, 0.68, 1) })}% -20% -5%)`,
          }}
        >
          {linha}
        </div>
      ))}
      <div
        style={{
          marginTop: 22,
          height: 4,
          width: 360 * entrada,
          borderRadius: 2,
          background:
            "linear-gradient(90deg, transparent, #F3C766, transparent)",
        }}
      />
    </Interactive.Div>
  );
};
