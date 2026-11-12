import "@fontsource/anton/400.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import React from "react";
import { AbsoluteFill, Img, staticFile, Still } from "remotion";

/* =====================================================================
   Ronald's Lanches — 9 artes de combo, 1080×1080 (envio no WhatsApp)
   EDITE AQUI os itens e preços. foto: 2 = 2 lanches + 2 caçulinhas,
   3 = 3 lanches + refri 1 litro, 1 = X-Tudo + refri PET.
   ===================================================================== */
export const COMBOS: { itens: string[]; preco: string; foto: 1 | 2 | 3 }[] = [
  { itens: ["2 Bauru Especial", "2 Refri caçulinha"], preco: "30", foto: 2 },
  { itens: ["2 Carioca", "2 Refri caçulinha"], preco: "28", foto: 2 },
  { itens: ["1 X-Tudo", "1 Refri PET"], preco: "21", foto: 1 },
  { itens: ["2 Carioca c/ Frango", "2 Refri caçulinha"], preco: "32", foto: 2 },
  { itens: ["3 Carioca", "1 Refri 1 litro"], preco: "41", foto: 3 },
  { itens: ["2 Bauru Especial", "c/ Frango", "2 Refri caçulinha"], preco: "34", foto: 2 },
  { itens: ["3 Carioca c/ Frango", "1 Refri 1 litro"], preco: "47", foto: 3 },
  { itens: ["3 Bauru Especial", "c/ Frango", "1 Refri 1 litro"], preco: "50", foto: 3 },
  { itens: ["3 Bauru Especial", "1 Refri 1 litro"], preco: "44", foto: 3 },
];

/* posição das garrafas reais (atrás dos lanches) para cada tipo de foto */
const GARRAFAS: Record<1 | 2 | 3, { src: string; x: number; y: number; h: number; r: number }[]> = {
  1: [{ src: "guarana-237", x: 360, y: -60, h: 430, r: 6 }],
  2: [
    { src: "pepsi", x: 230, y: -220, h: 600, r: -6 },
    { src: "guarana-237", x: 470, y: -170, h: 540, r: 6 },
  ],
  3: [{ src: "guarana-1l", x: 370, y: -260, h: 720, r: 4 }],
};
/* reduz o grupo (garrafas + lanches) para caber à esquerda do texto */
const ESCALA: Record<1 | 2 | 3, number> = { 1: 0.8, 2: 0.7, 3: 0.68 };

const C = { bg: "#0c0908", red: "#d6141b", redDk: "#7d0a0e", gold: "#ffc21a", goldLt: "#ffdf6b", goldDk: "#d98a00", cream: "#f3e9d8", ink: "#140906" };
const TIT = "'Anton', sans-serif";
const TXT = "'Poppins', sans-serif";
const S = 1080;

const Logo: React.FC<{ largura: number }> = ({ largura }) => {
  const c: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  return (
    <div style={{ position: "relative", width: largura, aspectRatio: "16 / 9" }}>
      <Img src={staticFile("marca/logo-arco.png")} style={c} />
      <Img src={staticFile("marca/logo-burger.png")} style={c} />
      <Img src={staticFile("marca/logo-nome.png")} style={c} />
    </div>
  );
};

const Whats: React.FC = () => (
  <svg width={46} height={46} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#25d366" />
    <path fill="#fff" d="M17.2 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.2z" />
  </svg>
);

export const ArteCombo: React.FC<{ n: number }> = ({ n }) => {
  const c = COMBOS[n];
  const grande = c.itens.length <= 2;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* foto: fundo, garrafas reais atrás e lanches recortados na frente */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 50% at 28% 55%, rgba(255,150,20,.16), transparent 70%), linear-gradient(180deg, #0f0b0a, #070505)" }} />
      <div style={{ position: "absolute", inset: 0, translate: "0px 120px", scale: String(ESCALA[c.foto]), transformOrigin: "2% 74%" }}>
        <Img src={staticFile(`combos/foto${c.foto}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
          WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 35% 50%, #000 55%, transparent 100%)", maskImage: "radial-gradient(ellipse 75% 70% at 35% 50%, #000 55%, transparent 100%)" }} />
        {GARRAFAS[c.foto].map((g, k) => (
          <Img key={k} src={staticFile(`combos/${g.src}.png`)} style={{ position: "absolute", left: g.x, top: g.y, height: g.h, rotate: `${g.r}deg`, filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }} />
        ))}
        <Img src={staticFile(`combos/lanche${c.foto}.png`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(12,9,8,0) 44%, rgba(12,9,8,.8) 56%, rgba(12,9,8,.96) 66%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,9,8,.55) 0%, rgba(12,9,8,0) 22%, rgba(12,9,8,0) 78%, rgba(12,9,8,.85) 100%)" }} />

      {/* moldura fina */}
      <div style={{ position: "absolute", inset: 22, border: `2px solid rgba(255,194,26,.55)`, borderRadius: 6 }} />

      {/* coluna de texto à direita */}
      <div style={{ position: "absolute", right: 70, top: 120, width: 470, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ alignSelf: "center", marginBottom: 6 }}>
          <Logo largura={380} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: TXT, fontWeight: 600, fontSize: 20, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginTop: 10 }}>
          <span style={{ width: 46, height: 3, background: C.gold }} /> Combo do dia
        </div>
        <div style={{ fontFamily: TIT, fontSize: 96, color: "#fff", textTransform: "uppercase", lineHeight: 1, marginTop: 10 }}>
          Combo<span style={{ color: C.gold }}>.</span>
        </div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {c.itens.map((t, k) => {
            const sub = t.startsWith("c/");
            return (
              <div key={k} style={{ fontFamily: TIT, fontSize: sub ? 40 : grande ? 54 : 48, lineHeight: 1.08, textTransform: "uppercase", color: sub ? C.gold : "#fff", paddingLeft: sub ? 4 : 0 }}>
                {t}
              </div>
            );
          })}
        </div>
        {/* preço */}
        <div style={{ marginTop: 26, display: "inline-flex", alignItems: "flex-start", background: `linear-gradient(180deg, ${C.goldLt}, ${C.gold} 55%, ${C.goldDk})`, color: C.ink, padding: "8px 26px 6px 22px", borderRadius: 10, boxShadow: `0 10px 0 ${C.redDk}` }}>
          <span style={{ fontFamily: TIT, fontSize: 46, marginTop: 18, marginRight: 6 }}>R$</span>
          <span style={{ fontFamily: TIT, fontSize: 150, lineHeight: 1 }}>{c.preco}</span>
          <span style={{ fontFamily: TIT, fontSize: 56, marginTop: 14 }}>,00</span>
        </div>
      </div>

      {/* rodapé */}
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 22, height: 96, background: `linear-gradient(90deg, ${C.redDk}, ${C.red} 50%, ${C.redDk})`, borderTop: `3px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 44px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Whats />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontFamily: TXT, fontWeight: 600, fontSize: 15, letterSpacing: "0.26em", color: C.goldLt }}>PEÇA JÁ O SEU</div>
            <div style={{ fontFamily: TIT, fontSize: 44, color: "#fff" }}>(84) 9 8869-8674</div>
          </div>
        </div>
        <div style={{ fontFamily: TXT, fontWeight: 600, fontSize: 22, color: "#fff" }}>@ronaldslanches10</div>
      </div>
      <div style={{ position: "absolute", left: 50, bottom: 128, zIndex: 2, fontFamily: TXT, fontSize: 13, color: "rgba(255,255,255,.55)" }}>
        Imagens meramente ilustrativas.
      </div>
    </AbsoluteFill>
  );
};

export const CombosStills: React.FC = () => (
  <>
    {COMBOS.map((_, n) => (
      <Still key={n} id={`Combo${n + 1}`} component={ArteCombo} defaultProps={{ n }} width={S} height={S} />
    ))}
  </>
);
