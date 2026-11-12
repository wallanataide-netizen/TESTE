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
const Foto: React.FC<{ src: string; pos?: string; escala?: number }> = ({ src, pos = "50% 50%", escala = 1 }) => (
  <Img
    src={staticFile(src)}
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, scale: String(escala) }}
  />
);

const Degrade: React.FC<{ topo?: number; base?: number }> = ({ topo = 0.85, base = 0.96 }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(12,9,8,${topo}) 0%, rgba(12,9,8,0) 30%, rgba(12,9,8,0) 50%, rgba(12,9,8,${base}) 78%, rgba(12,9,8,1) 100%)`,
    }}
  />
);

/** Numeração da série + @ no topo, presente nas três artes. */
const Cabecalho: React.FC<{ n: number }> = ({ n }) => (
  <div style={{ position: "absolute", top: 56, left: M, right: M, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: TXT }}>
    <span style={{ fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", color: "#fff", opacity: 0.85 }}>@RONALDSLANCHES10</span>
    <span style={{ fontWeight: 600, fontSize: 22, letterSpacing: "0.2em", color: C.gold }}>
      0{n} <span style={{ color: "#fff", opacity: 0.5 }}>/ 03</span>
    </span>
  </div>
);

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

/* ======================= 01 — NOVO NOME ======================= */
export const Fixado1: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Foto src="cenas/img8.jpg" pos="50% 40%" />
    <AbsoluteFill style={{ background: "rgba(12,9,8,.55)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 40% at 50% 40%, rgba(255,170,30,.30), transparent 70%)" }} />
    <Degrade topo={0.7} base={0.97} />
    <Cabecalho n={1} />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
      <Logo largura={840} />
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "flex-end", padding: `0 ${M}px 110px`, gap: 26 }}>
      <Etiqueta texto="Nova fase" />
      <Titulo tam={150}>
        Novo nome,
        <br />
        <Caixa>mesmo</Caixa> sabor<Ponto />
      </Titulo>
      <Apoio>
        O lanche que você já conhece e ama agora se chama <B>Ronald's Lanches</B>. Mesma chapa, mesmo capricho.
      </Apoio>
    </AbsoluteFill>
  </AbsoluteFill>
);

/* ======================= 02 — CARDÁPIO / DESTAQUES ======================= */
const Miniatura: React.FC<{ src: string; nome: string; desc: string }> = ({ src, nome, desc }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ position: "relative", height: 300, borderRadius: 14, overflow: "hidden", border: `2px solid rgba(255,194,26,.55)` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", scale: "1.35" }} />
    </div>
    <div style={{ fontFamily: TIT, fontSize: 44, color: "#fff", textTransform: "uppercase", lineHeight: 1 }}>
      {nome}
      <Ponto />
    </div>
    <div style={{ fontFamily: TXT, fontSize: 21, lineHeight: 1.35, color: C.cream, opacity: 0.85 }}>{desc}</div>
  </div>
);

export const Fixado2: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 900, overflow: "hidden" }}>
      <Foto src="cenas/img4.jpg" pos="50% 46%" escala={1.05} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,9,8,.8) 0%, rgba(12,9,8,0) 22%, rgba(12,9,8,0) 42%, rgba(12,9,8,.9) 66%, rgba(12,9,8,1) 100%)" }} />
    </div>
    <Cabecalho n={2} />
    <div style={{ position: "absolute", left: M, right: M, top: 560, display: "flex", flexDirection: "column", gap: 20 }}>
      <Etiqueta texto="O campeão da casa" />
      <Titulo tam={140}>
        <Caixa>Ronald's</Caixa>
        <Ponto />
      </Titulo>
      <Apoio largura={900}>
        Dois hambúrgueres, frango, ovos, queijos, presuntos, calabresa, bacon e <B>tudo em dobro</B>.
      </Apoio>
    </div>
    <div style={{ position: "absolute", left: M, right: M, bottom: 90, display: "flex", gap: 30 }}>
      <Miniatura src="cenas/img1.jpg" nome="X-Tudo" desc="Carne, frango, ovo, bacon e tudo o que tem direito." />
      <Miniatura src="cenas/img2.jpg" nome="X-Picanha" desc="Picanha acebolada com queijo coalho." />
      <Miniatura src="cenas/img3.jpg" nome="Artesanal" desc="Hambúrguer artesanal, bacon e barbecue." />
    </div>
  </AbsoluteFill>
);

/* ======================= 03 — PEÇA PELO WHATSAPP ======================= */
const Item: React.FC<{ n: string; titulo: string; texto: string }> = ({ n, titulo, texto }) => (
  <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
    <div style={{ fontFamily: TIT, fontSize: 56, color: C.gold, lineHeight: 0.95, width: 70 }}>{n}</div>
    <div>
      <div style={{ fontFamily: TXT, fontWeight: 700, fontSize: 30, color: "#fff" }}>{titulo}</div>
      <div style={{ fontFamily: TXT, fontWeight: 400, fontSize: 24, color: C.cream, opacity: 0.85, marginTop: 2 }}>{texto}</div>
    </div>
  </div>
);

export const Fixado3: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 820, overflow: "hidden" }}>
      <Foto src="cenas/img6.jpg" pos="50% 40%" />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,9,8,.85) 0%, rgba(12,9,8,.1) 22%, rgba(12,9,8,.25) 42%, rgba(12,9,8,.9) 68%, rgba(12,9,8,1) 100%)" }} />
    </div>
    <Cabecalho n={3} />
    <div style={{ position: "absolute", left: M, right: M, top: 470, display: "flex", flexDirection: "column", gap: 24 }}>
      <Etiqueta texto="Delivery" />
      <Titulo tam={140}>
        Peça pelo
        <br />
        <Caixa>WhatsApp</Caixa>
        <Ponto />
      </Titulo>
    </div>
    <div style={{ position: "absolute", left: M, right: M, top: 870, display: "flex", flexDirection: "column", gap: 30 }}>
      <Item n="01" titulo="Escolha o seu lanche" texto="Confira o cardápio completo aqui no perfil." />
      <Item n="02" titulo="Chama no WhatsApp" texto="Mande o pedido e o endereço de entrega." />
      <Item n="03" titulo="É só aguardar" texto="Seu lanche sai da chapa direto pra você." />
    </div>
    <div
      style={{
        position: "absolute",
        left: M,
        right: M,
        bottom: 80,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "26px 34px",
        borderRadius: 18,
        background: `linear-gradient(90deg, ${C.redDk}, ${C.red})`,
        border: `2px solid ${C.gold}`,
      }}
    >
      <IconeWhats tam={84} />
      <div style={{ lineHeight: 1.05 }}>
        <div style={{ fontFamily: TXT, fontWeight: 600, fontSize: 22, letterSpacing: "0.24em", color: C.gold, textTransform: "uppercase" }}>Pedidos</div>
        <div style={{ fontFamily: TIT, fontSize: 78, color: "#fff", letterSpacing: "0.01em" }}>(84) 9 8869-8674</div>
      </div>
    </div>
  </AbsoluteFill>
);

/* ---------- Registro ---------- */
export const PostsFixados: React.FC = () => (
  <>
    <Still id="Fixado1" component={Fixado1} width={W} height={H} />
    <Still id="Fixado2" component={Fixado2} width={W} height={H} />
    <Still id="Fixado3" component={Fixado3} width={W} height={H} />
  </>
);
