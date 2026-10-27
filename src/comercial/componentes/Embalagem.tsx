import { Img } from "remotion";

// Mostra a embalagem original sem distorcer: só a altura é definida,
// a largura acompanha a proporção da imagem.
export const Embalagem: React.FC<{
  src: string;
  altura: number;
  // Posição (0 a 1) de um brilho suave passando pela embalagem; fora disso fica invisível
  brilho?: number;
  sombra?: string;
  reflexo?: boolean;
}> = ({
  src,
  altura,
  brilho = -1,
  sombra = "drop-shadow(0 40px 45px rgba(0,0,0,0.55))",
  reflexo = true,
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Sombra de contato com a mesa */}
      <div
        style={{
          position: "absolute",
          bottom: -18,
          width: "95%",
          height: 50,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 70%)",
        }}
      />
      <div style={{ position: "relative", height: altura }}>
        <Img
          src={src}
          style={{ height: altura, display: "block", filter: sombra }}
        />
        {brilho >= 0 && brilho <= 1 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              maskImage: `url("${src}")`,
              maskSize: "100% 100%",
              WebkitMaskImage: `url("${src}")`,
              WebkitMaskSize: "100% 100%",
              background: `linear-gradient(105deg, transparent ${brilho * 140 - 30}%, rgba(255,255,255,0.32) ${brilho * 140 - 15}%, transparent ${brilho * 140}%)`,
            }}
          />
        ) : null}
      </div>
      {reflexo ? (
        <Img
          src={src}
          style={{
            position: "absolute",
            top: altura,
            height: altura,
            scale: "1 -1",
            opacity: 0.22,
            maskImage:
              "linear-gradient(0deg, rgba(0,0,0,1) 0%, transparent 22%)",
            WebkitMaskImage:
              "linear-gradient(0deg, rgba(0,0,0,1) 0%, transparent 22%)",
          }}
        />
      ) : null}
    </div>
  );
};
