import "@fontsource/anton/400.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import React from "react";
import { AbsoluteFill, Img, staticFile, Still } from "remotion";

/* =====================================================================
   Ronald's Lanches — 3 posts fixados do Instagram (feed 1080×1440)
   Mesmo sistema do anúncio: Anton + Poppins, caixa dourada, grade de 80 px.
   Sem preços (peças permanentes).
   ===================================================================== */

const C = {
  bg: "#0c0908",
  red: "#d6141b",
  redDk: "#7d0a0e",
  gold: "#ffc21a",
  cream: "#f3e9d8",
  ink: "#140906",
};
const TIT = "'Anton', sans-serif";
const TXT = "'Poppins', sans-serif";
const M = 80;
const W = 1080;
const H = 1440;

/* ---------- Tipografia ---------- */
const Caixa: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ display: "inline-block", background: C.gold, color: C.ink, padding: "0 0.14em", margin: "0 0.04em", lineHeight: 1.02 }}>
    {children}
  </span>
);
const Ponto: React.FC<{ c?: string }> = ({ c = "." }) => <span style={{ color: C.gold }}>{c}</span>;
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 700, color: C.gold }}>{children}</b>;

const Titulo: React.FC<{ tam: number; children: React.ReactNode; centro?: boolean }> = ({ tam, children, centro }) => (
  <div style={{ fontFamily: TIT, fontSize: tam, lineHeight: 1.0, color: "#fff", textTransform: "uppercase", textAlign: centro ? "center" : "left" }}>
    {children}
  </div>
);

const Etiqueta: React.FC<{ texto: string; centro?: boolean }> = ({ texto, centro }) => {
  const fio = <span style={{ display: "inline-block", width: 56, height: 3, background: C.gold }} />;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: centro ? "center" : "flex-start", gap: 16 }}>
      {fio}
      <span style={{ fontFamily: TXT, fontWeight: 600, fontSize: 22, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>{texto}</span>
      {centro ? fio : null}
    </div>
  );
};

const Apoio: React.FC<{ children: React.ReactNode; largura?: number; centro?: boolean }> = ({ children, largura = 860, centro }) => (
  <div style={{ fontFamily: TXT, fontWeight: 400, fontSize: 32, lineHeight: 1.4, color: C.cream, maxWidth: largura, textAlign: centro ? "center" : "left" }}>
    {children}
  </div>
);

/* ---------- Base ---------- */
/** Logo em camadas (arco · hambúrguer · nome), sem efeitos. */
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

const IconeWhats: React.FC<{ tam: number }> = ({ tam }) => (
  <svg width={tam} height={tam} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#25d366" />
    <path fill="#fff" d="M17.2 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.2z" />
  </svg>
);

const Miniatura: React.FC<{ src: string; nome: string; desc: string }> = ({ src, nome, desc }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ position: "relative", height: 250, borderRadius: 14, overflow: "hidden", border: `2px solid rgba(255,194,26,.55)` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", scale: "1.35" }} />
    </div>
    <div style={{ fontFamily: TIT, fontSize: 44, color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
      {nome}
      <Ponto />
    </div>
    <div style={{ fontFamily: TXT, fontSize: 21, lineHeight: 1.35, color: C.cream, opacity: 0.85 }}>{desc}</div>
  </div>
);

const Item: React.FC<{ n: string; titulo: string; texto: string }> = ({ n, titulo, texto }) => (
  <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
    <div style={{ fontFamily: TIT, fontSize: 56, color: C.gold, lineHeight: 0.95, width: 70 }}>{n}</div>
    <div>
      <div style={{ fontFamily: TXT, fontWeight: 700, fontSize: 30, color: "#fff" }}>{titulo}</div>
      <div style={{ fontFamily: TXT, fontWeight: 400, fontSize: 24, color: C.cream, opacity: 0.85, marginTop: 2 }}>{texto}</div>
    </div>
  </div>
);


/* ======================= PAINEL ÚNICO 3240×1440 =======================
   Uma arte só, cortada em 3 posts. Fundo, fotos, faixa e fio dourado
   atravessam os cortes; os textos ficam sempre dentro de cada post. */
const PW = W * 3;

/** Foto que se funde nas laterais (máscara horizontal) para não ter emenda. */
const FotoFundida: React.FC<{ src: string; x: number; w: number; pos?: string; esq?: boolean; dir?: boolean; escala?: number }> = ({
  src, x, w, pos = "50% 50%", esq = true, dir = true, escala = 1,
}) => {
  const m = `linear-gradient(90deg, ${esq ? "transparent 0%, #000 28%" : "#000 0%"}, ${dir ? "#000 72%, transparent 100%" : "#000 100%"})`;
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: w, height: H, overflow: "hidden", WebkitMaskImage: m, maskImage: m }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, scale: String(escala) }} />
    </div>
  );
};

/** Setas que "puxam" o olhar para o post seguinte. */
const Seta: React.FC<{ x: number }> = ({ x }) => (
  <div style={{ position: "absolute", left: x, bottom: 22, fontFamily: TIT, fontSize: 40, color: C.gold, letterSpacing: "-0.12em", lineHeight: 1 }}>›››</div>
);

const Faixa: React.FC = () => (
  <div style={{ position: "absolute", left: 0, width: PW, bottom: 0, height: 88, background: `linear-gradient(90deg, ${C.redDk}, ${C.red} 30%, ${C.red} 70%, ${C.redDk})`, borderTop: `4px solid ${C.gold}` }}>
    {[
      ["Novo nome, mesmo sabor", 0],
      ["O melhor da chapa", 1],
      ["@ronaldslanches10", 2],
    ].map(([t, k]) => (
      <div key={k as number} style={{ position: "absolute", left: (k as number) * W + M, top: 0, height: 84, display: "flex", alignItems: "center", fontFamily: TXT, fontWeight: 700, fontSize: 26, letterSpacing: "0.24em", color: "#fff", textTransform: "uppercase" }}>
        {t as string}
      </div>
    ))}
    <Seta x={W - M - 40} />
    <Seta x={2 * W - M - 40} />
  </div>
);

/** Fio dourado contínuo, em onda, passando pelos três posts. */
const FioDourado: React.FC = () => (
  <svg width={PW} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
    <defs>
      <linearGradient id="ouro" x1="0" x2="1">
        <stop offset="0" stopColor={C.gold} stopOpacity="0" />
        <stop offset="0.08" stopColor={C.gold} />
        <stop offset="0.92" stopColor={C.gold} />
        <stop offset="1" stopColor={C.gold} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={`M 0 128 C 700 128, 900 112, 1620 112 S 2600 128, ${PW} 128`} fill="none" stroke="url(#ouro)" strokeWidth="3" />
  </svg>
);

/** Brasas douradas espalhadas por toda a largura. */
const Brasas: React.FC = () => {
  const pts = Array.from({ length: 70 }, (_, i) => {
    const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
    return { x: r(1) * PW, y: 150 + r(2) * 360, s: 2 + r(3) * 5, o: 0.25 + r(4) * 0.6 };
  });
  return (
    <>
      {pts.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: p.s, height: p.s, borderRadius: "50%", background: C.gold, opacity: p.o, boxShadow: `0 0 ${p.s * 3}px ${C.gold}` }} />
      ))}
    </>
  );
};

const CabecalhoP: React.FC<{ k: number }> = ({ k }) => (
  <div style={{ position: "absolute", top: 54, left: k * W + M, width: W - 2 * M, display: "flex", justifyContent: "space-between", fontFamily: TXT, fontWeight: 600, fontSize: 22, letterSpacing: "0.2em" }}>
    <span style={{ color: "#fff", opacity: 0.85 }}>RONALD'S LANCHES</span>
    <span style={{ color: C.gold }}>
      0{k + 1} <span style={{ color: "#fff", opacity: 0.5 }}>/ 03</span>
    </span>
  </div>
);

export const Panorama: React.FC = () => (
  <AbsoluteFill style={{ width: PW, height: H, background: C.bg }}>
    {/* fotos contínuas */}
    <FotoFundida src="cenas/img8.jpg" x={-120} w={1480} pos="50% 42%" esq={false} />
    <FotoFundida src="cenas/img4.jpg" x={W - 260} w={W + 520} pos="50% 40%" />
    <FotoFundida src="cenas/img6.jpg" x={2 * W - 300} w={W + 300} pos="60% 38%" dir={false} />
    {/* escurecimento contínuo para leitura */}
    <AbsoluteFill style={{ width: PW, background: "linear-gradient(180deg, rgba(12,9,8,.82) 0%, rgba(12,9,8,.15) 16%, rgba(12,9,8,.1) 28%, rgba(12,9,8,.82) 44%, rgba(12,9,8,.9) 58%, rgba(12,9,8,.98) 74%, rgba(12,9,8,1) 100%)" }} />
    <AbsoluteFill style={{ width: PW, background: `radial-gradient(ellipse 22% 30% at 16.6% 26%, rgba(255,170,30,.28), transparent 70%)` }} />
    <Brasas />
    <FioDourado />
    {[0, 1, 2].map((k) => <CabecalhoP key={k} k={k} />)}

    {/* 01 — Novo nome */}
    <div style={{ position: "absolute", left: 120, top: 170 }}>
      <Logo largura={840} />
    </div>
    <div style={{ position: "absolute", left: M, width: W - 2 * M, top: 820, display: "flex", flexDirection: "column", gap: 24 }}>
      <Etiqueta texto="Nova fase" />
      <Titulo tam={136}>
        Novo nome,
        <br />
        <Caixa>mesmo</Caixa> sabor<Ponto />
      </Titulo>
      <Apoio largura={900}>
        O lanche que você já conhece e ama agora se chama <B>Ronald's Lanches</B>.
      </Apoio>
    </div>

    {/* 02 — Campeão + destaques */}
    <div style={{ position: "absolute", left: W + M, width: W - 2 * M, top: 560, display: "flex", flexDirection: "column", gap: 18 }}>
      <Etiqueta texto="O campeão da casa" />
      <Titulo tam={130}>
        <Caixa>Ronald's</Caixa>
        <Ponto />
      </Titulo>
      <Apoio largura={900}>
        Dois hambúrgueres, frango, ovos, bacon e <B>tudo em dobro</B>.
      </Apoio>
    </div>
    <div style={{ position: "absolute", left: W + M, width: W - 2 * M, top: 900, display: "flex", gap: 28 }}>
      <Miniatura src="cenas/img1.jpg" nome="X-Tudo" desc="Carne, frango, ovo, bacon e muito mais." />
      <Miniatura src="cenas/img2.jpg" nome="X-Picanha" desc="Picanha acebolada com queijo coalho." />
      <Miniatura src="cenas/img3.jpg" nome="Artesanal" desc="Artesanal com bacon e barbecue." />
    </div>

    {/* 03 — WhatsApp */}
    <div style={{ position: "absolute", left: 2 * W + M, width: W - 2 * M, top: 560, display: "flex", flexDirection: "column", gap: 22 }}>
      <Etiqueta texto="Delivery" />
      <Titulo tam={128}>
        Peça pelo
        <br />
        <Caixa>WhatsApp</Caixa>
        <Ponto />
      </Titulo>
    </div>
    <div style={{ position: "absolute", left: 2 * W + M, width: W - 2 * M, top: 900, display: "flex", flexDirection: "column", gap: 22 }}>
      <Item n="01" titulo="Escolha o seu lanche" texto="Confira o cardápio completo aqui no perfil." />
      <Item n="02" titulo="Chama no WhatsApp" texto="Mande o pedido e o endereço de entrega." />
    </div>
    <div style={{ position: "absolute", left: 2 * W + M, width: W - 2 * M, top: 1130, display: "flex", alignItems: "center", gap: 22, padding: "20px 30px", borderRadius: 18, background: "rgba(12,9,8,.9)", border: `2px solid ${C.gold}`, boxSizing: "border-box" }}>
      <IconeWhats tam={74} />
      <div style={{ lineHeight: 1.05 }}>
        <div style={{ fontFamily: TXT, fontWeight: 600, fontSize: 20, letterSpacing: "0.24em", color: C.gold, textTransform: "uppercase" }}>Pedidos</div>
        <div style={{ fontFamily: TIT, fontSize: 70, color: "#fff" }}>(84) 9 8869-8674</div>
      </div>
    </div>

    <Faixa />
  </AbsoluteFill>
);

const Recorte: React.FC<{ k: number }> = ({ k }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: C.bg }}>
    <div style={{ position: "absolute", left: -k * W, top: 0, width: PW, height: H }}>
      <Panorama />
    </div>
  </AbsoluteFill>
);
export const Fixado1: React.FC = () => <Recorte k={0} />;
export const Fixado2: React.FC = () => <Recorte k={1} />;
export const Fixado3: React.FC = () => <Recorte k={2} />;

/* ---------- Registro ---------- */
export const PostsFixados: React.FC = () => (
  <>
    <Still id="FixadosPanorama" component={Panorama} width={PW} height={H} />
    <Still id="Fixado1" component={Fixado1} width={W} height={H} />
    <Still id="Fixado2" component={Fixado2} width={W} height={H} />
    <Still id="Fixado3" component={Fixado3} width={W} height={H} />
  </>
);
