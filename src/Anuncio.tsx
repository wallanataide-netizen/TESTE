import "@fontsource/anton/400.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { Audio, Video } from "@remotion/media";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* =====================================================================
   Ronald's Lanches — anúncio vertical 1080×1920
   Direção: editorial premium. Títulos em Anton (condensada pesada),
   apoio em Poppins, palavra-chave em caixa dourada, grade de 90 px.
   ===================================================================== */

const C = {
  bg: "#0c0908",
  red: "#d6141b",
  redDk: "#7d0a0e",
  gold: "#ffc21a",
  goldLt: "#ffdf6b",
  cream: "#f3e9d8",
  ink: "#140906",
};
const TIT = "'Anton', sans-serif";
const TXT = "'Poppins', sans-serif";
const M = 90; // margem lateral da grade

/* ---------- Tempos (segundos) — ajuste aqui para casar com a locução ---------- */
export const T = {
  abertura: [0, 3.8],
  mudou: [3.8, 6.6],
  logo: [6.6, 9.0],
  lanches: [9.0, 15.2],
  bebidas: [15.2, 19.4],
  insta: [19.4, 24.6],
  final: [24.6, 29.0],
} as const;
export const DURACAO = 29.0;

/* Clipes do Kling 4.0 em public/cenas/clipN.mp4 (fora da lista usa a imagem imgN.jpg)
   0 chapa · 1 X-Tudo · 2 X-Picanha · 3 Artesanal · 4 Ronald's · 5 bebidas */
const CLIPES = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8]);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

/* ======================= TIPOGRAFIA ======================= */

/** Linha que sobe por trás de uma máscara. */
const Linha: React.FC<{ atraso: number; children: React.ReactNode }> = ({ atraso, children }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ overflow: "hidden", paddingTop: "0.16em", marginTop: "-0.16em", paddingBottom: "0.04em" }}>
      <div style={{ translate: interpolate(frame, [atraso, atraso + 16], ["0px 110%", "0px 0%"], { ...clamp, easing: suave }) }}>
        {children}
      </div>
    </div>
  );
};

/** Palavra-chave dentro de uma caixa dourada que desliza da esquerda. */
const Caixa: React.FC<{ atraso: number; children: React.ReactNode }> = ({ atraso, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [atraso, atraso + 12], [0, 1], { ...clamp, easing: suave });
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 0.14em", margin: "0 0.04em" }}>
      <span style={{ position: "absolute", inset: "0.06em 0 0.02em", background: C.gold, scale: `${p} 1`, transformOrigin: "left center" }} />
      <span style={{ position: "relative", color: p > 0.55 ? C.ink : "#fff" }}>{children}</span>
    </span>
  );
};

/** Título em Anton: cada linha entra mascarada, com pequeno atraso entre linhas. */
const Titulo: React.FC<{ linhas: React.ReactNode[]; tam: number; atraso?: number; alinhar?: "left" | "center" }> = ({
  linhas,
  tam,
  atraso = 0,
  alinhar = "left",
}) => (
  <div style={{ fontFamily: TIT, fontSize: tam, lineHeight: 0.98, color: "#fff", textTransform: "uppercase", textAlign: alinhar, letterSpacing: "0.005em" }}>
    {linhas.map((l, k) => (
      <Linha key={k} atraso={atraso + k * 4}>
        {l}
      </Linha>
    ))}
  </div>
);

const Ponto: React.FC = () => <span style={{ color: C.gold }}>.</span>;

/** Etiqueta pequena com filete dourado que se desenha. */
const Etiqueta: React.FC<{ texto: string; atraso?: number; centro?: boolean }> = ({ texto, atraso = 0, centro }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [atraso, atraso + 14], [0, 64], { ...clamp, easing: suave });
  const o = interpolate(frame, [atraso + 4, atraso + 14], [0, 1], clamp);
  const fio = <span style={{ display: "inline-block", width: w, height: 3, background: C.gold }} />;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: centro ? "center" : "flex-start", gap: 18 }}>
      {fio}
      <span style={{ fontFamily: TXT, fontWeight: 600, fontSize: 26, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", opacity: o }}>{texto}</span>
      {centro ? fio : null}
    </div>
  );
};

/** Texto de apoio em Poppins; use <B> para o destaque dourado. */
const Apoio: React.FC<{ children: React.ReactNode; atraso?: number; largura?: number }> = ({ children, atraso = 0, largura = 820 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: TXT,
        fontWeight: 400,
        fontSize: 36,
        lineHeight: 1.35,
        color: C.cream,
        maxWidth: largura,
        opacity: interpolate(frame, [atraso, atraso + 12], [0, 1], clamp),
        translate: interpolate(frame, [atraso, atraso + 14], ["0px 24px", "0px 0px"], { ...clamp, easing: suave }),
      }}
    >
      {children}
    </div>
  );
};
const B: React.FC<{ children: React.ReactNode }> = ({ children }) => <b style={{ fontWeight: 700, color: C.gold }}>{children}</b>;

/* ======================= BASE VISUAL ======================= */
const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 45% at 50% 42%, rgba(255,150,20,.16), transparent 70%),
        radial-gradient(ellipse 90% 35% at 50% 100%, rgba(214,20,27,.22), transparent 70%), ${C.bg}`,
    }}
  />
);

const Midia: React.FC<{ i: number; zoomDe?: number; zoomAte?: number }> = ({ i, zoomDe = 1.0, zoomAte = 1.1 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const style: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    scale: String(interpolate(frame, [0, durationInFrames], [zoomDe, zoomAte], clamp)),
  };
  return CLIPES.has(i) ? <Video src={staticFile(`cenas/clip${i}.mp4`)} muted style={style} /> : <Img src={staticFile(`cenas/img${i}.jpg`)} style={style} />;
};

/** Escurece topo e base para o texto ter leitura. */
const Vinheta: React.FC<{ forte?: boolean; topo?: boolean }> = ({ forte, topo }) => (
  <AbsoluteFill
    style={{
      background: topo
        ? "linear-gradient(180deg, rgba(12,9,8,.96) 0%, rgba(12,9,8,.85) 30%, rgba(12,9,8,0) 52%, rgba(12,9,8,0) 82%, rgba(12,9,8,.8) 100%)"
        : `linear-gradient(180deg, rgba(12,9,8,.75) 0%, rgba(12,9,8,0) 22%, rgba(12,9,8,0) ${forte ? 45 : 52}%, rgba(12,9,8,.94) ${forte ? 78 : 84}%, rgba(12,9,8,.98) 100%)`,
    }}
  />
);

/** Cortina de entrada: faixa escura com filete dourado que sobe e revela a cena. */
const Cortina: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg, translate: interpolate(frame, [0, 10], ["0% 0%", "0% -100%"], { ...clamp, easing: suave }) }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: C.gold }} />
    </AbsoluteFill>
  );
};

const BlocoBase: React.FC<{ children: React.ReactNode; base?: number }> = ({ children, base = 380 }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", padding: `0 ${M}px ${base}px`, gap: 26 }}>{children}</AbsoluteFill>
);
const BlocoTopo: React.FC<{ children: React.ReactNode; topo?: number }> = ({ children, topo = 270 }) => (
  <AbsoluteFill style={{ justifyContent: "flex-start", padding: `${topo}px ${M}px 0`, gap: 26 }}>{children}</AbsoluteFill>
);

/* ======================= LOGO EM CAMADAS =======================
   logo-arco.png (fundo) + logo-burger.png (na frente do arco, flutuando de leve) + logo-nome.png (na frente de tudo).
   A luz percorre SOMENTE o recorte do nome (máscara pelo próprio PNG). */
const LogoAnimada: React.FC<{ largura: number; atraso?: number; luzEm?: number }> = ({ largura, atraso = 0, luzEm = 22 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 200 }, durationInFrames: 26 });
  const pb = spring({ frame: frame - atraso - 6, fps, config: { damping: 18, stiffness: 90 } });
  const t = (frame - atraso) / fps;
  const camada: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  const mascara = `url(${staticFile("marca/logo-nome.png")})`;
  return (
    <div style={{ position: "relative", width: largura, aspectRatio: "16 / 9", scale: String(interpolate(p, [0, 1], [0.92, 1])), opacity: p }}>
      <Img src={staticFile("marca/logo-arco.png")} style={camada} />
      <Img
        src={staticFile("marca/logo-burger.png")}
        style={{
          ...camada,
          translate: `${interpolate(pb, [0, 1], [-40, 0]) + Math.sin(t * 1.6) * 6}px ${interpolate(pb, [0, 1], [70, 0]) + Math.sin(t * 2.1) * 8}px`,
          rotate: `${Math.sin(t * 1.3) * 1.2}deg`,
          scale: String(interpolate(pb, [0, 1], [0.94, 1])),
        }}
      />
      <Img src={staticFile("marca/logo-nome.png")} style={camada} />
      <div
        style={{
          ...camada,
          WebkitMaskImage: mascara,
          maskImage: mascara,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          background: "linear-gradient(110deg, transparent 42%, rgba(255,250,225,.75) 50%, transparent 58%)",
          backgroundSize: "250% 100%",
          backgroundPosition: `${interpolate(frame, [atraso + luzEm, atraso + luzEm + 26], [100, 0], { ...clamp, easing: Easing.inOut(Easing.quad) })}% 0`,
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
};

/* ======================= CENAS ======================= */
/* Abertura: 3 cortes rápidos da chapa (6 smash de cima · 7 nível da chapa · 8 queijo derretendo) */
const CenaAbertura: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = Math.round((T.abertura[1] - T.abertura[0]) * fps);
  const corte = Math.round(total / 3);
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 8], [0, 1], clamp) }}>
      {[6, 7, 8].map((i, k) => (
        <Sequence key={i} from={k * corte} durationInFrames={k === 2 ? total - 2 * corte : corte} premountFor={fps}>
          <Midia i={i} zoomDe={1.08} zoomAte={1.0} />
          {k > 0 ? <Cortina /> : null}
        </Sequence>
      ))}
      <Vinheta />
      <BlocoBase>
        <Etiqueta texto="Ronald's Lanches" atraso={10} />
        <Titulo tam={140} atraso={14} linhas={["Sabe aquele", <Caixa key="c" atraso={30}>lanche</Caixa>, <>que você ama<span style={{ color: C.gold }}>?</span></>]} />
      </BlocoBase>
    </AbsoluteFill>
  );
};

const Pagina: React.FC<{ src: string; atraso: number; rot: number; x: number; y: number }> = ({ src, atraso, rot, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 200 }, durationInFrames: 22 });
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: 520,
        left: x,
        top: y,
        borderRadius: 6,
        boxShadow: "0 40px 90px rgba(0,0,0,.65)",
        rotate: `${interpolate(p, [0, 1], [rot + 6, rot])}deg`,
        translate: interpolate(p, [0, 1], ["0px 260px", "0px 0px"], clamp),
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
      }}
    />
  );
};

const CenaMudou: React.FC = () => (
  <AbsoluteFill>
    <Fundo />
    <Pagina src="marca/cardapio-2.jpg" atraso={8} rot={7} x={470} y={900} />
    <Pagina src="marca/cardapio-1.jpg" atraso={12} rot={-5} x={150} y={940} />
    <BlocoTopo>
      <Etiqueta texto="Nova fase" atraso={2} />
      <Titulo tam={150} atraso={6} linhas={["Cara nova,", <>nome <Caixa key="n" atraso={30}>novo</Caixa><Ponto /></>]} />
      <Apoio atraso={34}>O mesmo capricho de sempre, agora com <B>visual novo</B>.</Apoio>
    </BlocoTopo>
    <Cortina />
  </AbsoluteFill>
);

const CenaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const fio = interpolate(frame, [24, 44], [0, 560], { ...clamp, easing: suave });
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 47%, rgba(255,180,40,.28), rgba(214,20,27,.10) 32%, transparent 58%)", opacity: interpolate(frame, [0, 30], [0, 1], clamp) }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <Etiqueta texto="Agora é" atraso={0} centro />
        <LogoAnimada largura={980} atraso={4} luzEm={24} />
        <div style={{ width: fio, height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)` }} />
      </AbsoluteFill>
      <Cortina />
    </AbsoluteFill>
  );
};

const LANCHES: { i: number; num: string; nome: string; apoio: React.ReactNode; etiqueta?: string }[] = [
  { i: 1, num: "01", nome: "X-Tudo", apoio: <>Carne, frango, ovo, bacon e <B>tudo o que tem direito</B>.</> },
  { i: 2, num: "02", nome: "X-Picanha", apoio: <>Picanha acebolada com <B>queijo coalho</B> na chapa.</> },
  { i: 3, num: "03", nome: "Artesanal", apoio: <>Hambúrguer artesanal com <B>bacon e barbecue</B>.</> },
  { i: 4, num: "04", nome: "Ronald's", apoio: <>Dois hambúrgueres e <B>tudo em dobro</B>.</>, etiqueta: "O campeão da casa" },
];

const PlanoLanche: React.FC<(typeof LANCHES)[number]> = ({ i, num, nome, apoio, etiqueta }) => (
  <AbsoluteFill>
    <Midia i={i} zoomDe={1.06} zoomAte={1.0} />
    <Vinheta forte />
    <BlocoBase>
      <Etiqueta texto={etiqueta ?? `${num} / 04`} atraso={2} />
      <Titulo tam={etiqueta ? 200 : 180} atraso={4} linhas={[etiqueta ? <Caixa key="c" atraso={14}>{nome}</Caixa> : <>{nome}<Ponto /></>]} />
      <Apoio atraso={12}>{apoio}</Apoio>
    </BlocoBase>
    <Cortina />
  </AbsoluteFill>
);

const CenaLanches: React.FC = () => {
  const { fps } = useVideoConfig();
  const total = (T.lanches[1] - T.lanches[0]) * fps;
  const cortes = [0, 0.22, 0.44, 0.64].map((f) => Math.round(f * total));
  return (
    <AbsoluteFill>
      {LANCHES.map((l, k) => (
        <Sequence key={l.nome} from={cortes[k]} durationInFrames={(cortes[k + 1] ?? total) - cortes[k]} premountFor={fps}>
          <PlanoLanche {...l} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/* Bebidas: cena gerada no Nano Banana (mesa, suco sendo derramado) animada no Kling */
const CenaBebidas: React.FC = () => (
  <AbsoluteFill>
    <Midia i={5} zoomDe={1.04} zoomAte={1.0} />
    <Vinheta topo />
    <BlocoTopo>
      <Etiqueta texto="Para acompanhar" atraso={2} />
      <Titulo tam={150} atraso={6} linhas={[<>Refri <Caixa key="g" atraso={26}>gelado</Caixa></>, <>+ suco natural<Ponto /></>]} />
      <Apoio atraso={30}>Laranja, graviola, cajá, uva, manga, morango, goiaba e <B>maracujá</B>.</Apoio>
    </BlocoTopo>
    <Cortina />
  </AbsoluteFill>
);

/* ----- Celular com o Instagram de cara nova ----- */
const TelaPerfil: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rolagem = interpolate(frame, [1.6 * fps, 3.4 * fps], [0, -240], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const toque = interpolate(frame, [3.7 * fps, 3.85 * fps, 4.0 * fps], [1, 0.92, 1], clamp);
  const seguindo = frame > 3.85 * fps;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden", fontFamily: TXT, color: "#fff" }}>
      <div style={{ translate: `0px ${rolagem}px` }}>
        <div style={{ height: 80, marginTop: 64, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 28 }}>ronaldslanches10</div>
        <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "10px 30px" }}>
          <div style={{ width: 160, height: 160, borderRadius: "50%", padding: 5, background: `conic-gradient(${C.gold}, ${C.red}, ${C.gold})` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "4px solid #000" }}>
              <Img src={staticFile("marca/logo-ronalds-recorte.png")} style={{ width: "92%" }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 30 }}>Ronald's Lanches</div>
            <div style={{ fontWeight: 400, fontSize: 21, color: "#cfcfcf", lineHeight: 1.45, marginTop: 6 }}>
              Novo nome, mesmo sabor.
              <br />
              Delivery pelo WhatsApp
            </div>
          </div>
        </div>
        <div style={{ padding: "18px 30px", display: "flex", gap: 12 }}>
          <div style={{ flex: 1, scale: String(toque), textAlign: "center", fontWeight: 600, fontSize: 23, padding: "13px 0", borderRadius: 10, color: seguindo ? "#fff" : C.ink, background: seguindo ? "#262626" : C.gold }}>
            {seguindo ? "Seguindo" : "Seguir"}
          </div>
          <div style={{ flex: 1, textAlign: "center", fontWeight: 600, fontSize: 23, padding: "13px 0", borderRadius: 10, background: "#262626" }}>Mensagem</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginTop: 6 }}>
          {[1, 4, 2, 3, 0, 1, 4, 2, 3, 0, 1, 4].map((n, k) => (
            <div key={k} style={{ aspectRatio: "3 / 4", overflow: "hidden", opacity: interpolate(frame, [0.5 * fps + k * 2, 0.5 * fps + k * 2 + 8], [0, 1], clamp) }}>
              <Img src={staticFile(`cenas/img${n}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CenaInsta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 6, fps, config: { damping: 200 }, durationInFrames: 30 });
  return (
    <AbsoluteFill>
      <Fundo />
      <BlocoTopo>
        <Etiqueta texto="@ronaldslanches10" atraso={2} />
        <Titulo tam={140} atraso={6} linhas={[<>Siga o <Caixa key="n" atraso={24}>novo</Caixa></>, <>Instagram<Ponto /></>]} />
      </BlocoTopo>
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 700,
          width: 580,
          height: 1180,
          borderRadius: 82,
          padding: 16,
          background: "linear-gradient(145deg, #3c3c3c, #121212 40%, #2b2b2b)",
          boxShadow: "0 0 0 2px #555, 0 50px 120px rgba(0,0,0,.7), 0 0 140px rgba(255,170,30,.14)",
          rotate: `${interpolate(p, [0, 1], [-2, -6])}deg`,
          translate: interpolate(p, [0, 1], ["0px 700px", "0px 0px"], clamp),
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 68, overflow: "hidden" }}>
          <TelaPerfil />
          <div style={{ position: "absolute", top: 14, left: "50%", translate: "-50% 0px", width: 170, height: 38, borderRadius: 30, background: "#000" }} />
        </div>
      </div>
      <Sequence from={Math.round(3.1 * fps)} layout="none">
        <ChipWhats />
      </Sequence>
      <Cortina />
    </AbsoluteFill>
  );
};

const ChipWhats: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: M,
        bottom: 360,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "18px 30px",
        borderRadius: 16,
        background: "rgba(12,9,8,.92)",
        border: `2px solid ${C.gold}`,
        opacity: interpolate(frame, [0, 10], [0, 1], clamp),
        translate: interpolate(frame, [0, 14], ["-40px 0px", "0px 0px"], { ...clamp, easing: suave }),
      }}
    >
      <svg width="52" height="52" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#25d366" /><path fill="#fff" d="M17.2 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.2z" /></svg>
      <div style={{ fontFamily: TXT, lineHeight: 1.1 }}>
        <div style={{ fontWeight: 500, fontSize: 20, letterSpacing: "0.2em", color: C.gold, textTransform: "uppercase" }}>Peça pelo WhatsApp</div>
        <div style={{ fontFamily: TIT, fontSize: 52, color: "#fff", letterSpacing: "0.02em" }}>(84) 9 8869-8674</div>
      </div>
    </div>
  );
};

const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(255,180,40,.24), transparent 50%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingBottom: 60 }}>
        <LogoAnimada largura={900} atraso={2} luzEm={30} />
        <div style={{ marginTop: 20 }}>
          <Titulo tam={150} atraso={16} alinhar="center" linhas={["Novo nome,", <><Caixa key="m" atraso={34}>mesmo</Caixa> sabor<Ponto /></>]} />
        </div>
        <div style={{ marginTop: 50, display: "flex", alignItems: "center", gap: 28, fontFamily: TXT, fontWeight: 500, fontSize: 34, color: C.cream, opacity: interpolate(frame, [1.6 * fps, 2 * fps], [0, 1], clamp) }}>
          <span>@ronaldslanches10</span>
          <span style={{ width: 2, height: 34, background: C.gold }} />
          <span>(84) 9 8869-8674</span>
        </div>
      </AbsoluteFill>
      <Cortina />
    </AbsoluteFill>
  );
};

/* ======================= COMPOSIÇÃO ======================= */
export const Anuncio: React.FC = () => {
  const { fps } = useVideoConfig();
  const seq = (k: keyof typeof T) => ({
    from: Math.round(T[k][0] * fps),
    durationInFrames: Math.round((T[k][1] - T[k][0]) * fps),
    premountFor: fps,
  });
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence name="Abertura (chapa)" {...seq("abertura")}><CenaAbertura /></Sequence>
      <Sequence name="Cara nova + cardápio" {...seq("mudou")}><CenaMudou /></Sequence>
      <Sequence name="Logo" {...seq("logo")}><CenaLogo /></Sequence>
      <Sequence name="Lanches" {...seq("lanches")}><CenaLanches /></Sequence>
      <Sequence name="Bebidas" {...seq("bebidas")}><CenaBebidas /></Sequence>
      <Sequence name="Instagram" {...seq("insta")}><CenaInsta /></Sequence>
      <Sequence name="Final" {...seq("final")}><CenaFinal /></Sequence>
      <Audio src={staticFile("locucao.mp3")} volume={0.85} />
    </AbsoluteFill>
  );
};
