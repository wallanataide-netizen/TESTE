import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { CORES } from "../tema";

type Tom = "cafe" | "vermelho" | "dourado";

const CEU: Record<Tom, string> = {
  cafe: `radial-gradient(ellipse at 50% 30%, #6B3A1C 0%, ${CORES.cafe} 55%, ${CORES.cafeEscuro} 100%)`,
  vermelho: `radial-gradient(ellipse at 50% 30%, #E0303A 0%, #A80F1B 50%, #4A0509 100%)`,
  dourado: `radial-gradient(ellipse at 50% 30%, #F7C35A 0%, #B86B1C 55%, #3A1A08 100%)`,
};

const LUZES: Record<Tom, string> = {
  cafe: "255,196,110",
  vermelho: "255,210,120",
  dourado: "255,236,170",
};

// Fundo de "mesa de café": parede com luzes desfocadas e tampo de madeira
export const FundoMesa: React.FC<{
  tom: Tom;
  linhaMesa?: number;
}> = ({ tom, linhaMesa = 1400 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: CEU[tom], overflow: "hidden" }}>
      {/* Luzes desfocadas (bokeh) */}
      {new Array(14).fill(true).map((_, i) => {
        const tamanho = 90 + random(`b${i}`) * 220;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left:
                random(`bx${i}`) * 1180 -
                50 +
                Math.sin((frame + i * 37) / 70) * 25,
              top:
                random(`by${i}`) * (linhaMesa - 200) -
                60 +
                Math.cos((frame + i * 23) / 80) * 18,
              width: tamanho,
              height: tamanho,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(${LUZES[tom]},0.55) 0%, rgba(${LUZES[tom]},0.12) 55%, transparent 72%)`,
              opacity: 0.25 + random(`bo${i}`) * 0.4,
              filter: "blur(6px)",
            }}
          />
        );
      })}

      {/* Tampo de madeira */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: linhaMesa,
          bottom: 0,
          background: `linear-gradient(180deg, ${CORES.madeiraClara} 0%, ${CORES.madeira} 25%, #2B1409 100%)`,
          boxShadow: `0 -2px 0 rgba(255,214,150,0.35)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.18,
            background:
              "repeating-linear-gradient(180deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 22px)",
          }}
        />
      </div>

      {/* Vinheta cinematográfica */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(10,3,0,0.7) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
