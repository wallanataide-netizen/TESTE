import React from "react";
import { AbsoluteFill, Img, staticFile, Still } from "remotion";

/* Foto de perfil do Instagram — 1080×1080, exibida em círculo.
   Logo em camadas centralizada, brilho atrás e anel dourado na borda. */

const S = 1080;
const GOLD = "#ffc21a";

export const FotoPerfil: React.FC = () => {
  const camada: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* brilho dourado/vermelho atrás da logo */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(255,190,50,.42) 0%, rgba(255,140,20,.22) 22%, rgba(214,20,27,.20) 38%, rgba(0,0,0,0) 60%)",
        }}
      />
      {/* raios suaves */}
      <AbsoluteFill
        style={{
          background:
            "repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,194,26,.06) 0deg 6deg, transparent 6deg 18deg)",
          WebkitMaskImage: "radial-gradient(circle at 50% 46%, #000 0%, #000 25%, transparent 55%)",
          maskImage: "radial-gradient(circle at 50% 46%, #000 0%, #000 25%, transparent 55%)",
        }}
      />
      {/* anel dourado duplo na borda do círculo */}
      <div style={{ position: "absolute", inset: 18, borderRadius: "50%", border: `6px solid ${GOLD}`, boxShadow: `0 0 40px rgba(255,194,26,.45), inset 0 0 40px rgba(255,194,26,.25)` }} />
      <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: "2px solid rgba(255,194,26,.45)" }} />
      {/* logo */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: 960, aspectRatio: "16 / 9", marginTop: -14, filter: "drop-shadow(0 18px 30px rgba(0,0,0,.6))" }}>
          <Img src={staticFile("marca/logo-arco.png")} style={camada} />
          <Img src={staticFile("marca/logo-burger.png")} style={camada} />
          <Img src={staticFile("marca/logo-nome.png")} style={camada} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PerfilStill: React.FC = () => <Still id="FotoPerfil" component={FotoPerfil} width={S} height={S} />;
