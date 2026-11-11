import "@fontsource/lilita-one/400.css";
import "@fontsource/permanent-marker/400.css";
import "@fontsource/oswald/600.css";
import "@fontsource/oswald/700.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
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

/* ---------- Paleta do encarte ---------- */
const C = {
  bg: "#0c0908",
  red: "#d6141b",
  redDk: "#7d0a0e",
  gold: "#ffc21a",
  goldLt: "#ffdf6b",
  goldDk: "#d98a00",
  ink: "#1a0a05",
};
const FOOD = "'Lilita One', sans-serif"; // títulos "food", grossos como a logo
const PINCEL = "'Permanent Marker', cursive"; // pincel branco, como o "LANCHES" da logo
const OSW = "'Oswald', sans-serif";
const MON = "'Montserrat', sans-serif";

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

/* Clipes do Kling em public/cenas/clipN.mp4 — enquanto não existirem, usa a imagem img N */
const USAR_CLIPES = false;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

/* ======================= TIPOGRAFIA FOOD ANIMADA ======================= */
type Estilo = "ouro" | "branco" | "vermelho";
const preenchimento: Record<Estilo, string> = {
  ouro: `linear-gradient(180deg, #fff3b0 0%, ${C.goldLt} 22%, ${C.gold} 55%, ${C.goldDk} 100%)`,
  branco: "linear-gradient(180deg, #ffffff 0%, #fff6e6 60%, #f1dcc0 100%)",
  vermelho: `linear-gradient(180deg, #ff4a4f 0%, ${C.red} 55%, #9b0c11 100%)`,
};

/** Frase de destaque: cada letra entra com pulo, giro e quique; preenchimento em degradê,
 *  contorno grosso e sombra em relevo (mesma linguagem da logo). */
const TituloFood: React.FC<{
  texto: string;
  tam: number;
  estilo?: Estilo;
  atraso?: number;
  intervalo?: number;
  inclinacao?: number;
  contorno?: string;
}> = ({ texto, tam, estilo = "ouro", atraso = 0, intervalo = 1.6, inclinacao = -4, contorno }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stroke = contorno ?? (estilo === "vermelho" ? C.ink : C.redDk);
  let idx = 0;
  return (
    <div
      style={{
        fontFamily: FOOD,
        fontSize: tam,
        lineHeight: 1,
        textAlign: "center",
        textTransform: "uppercase",
        rotate: `${inclinacao}deg`,
        filter: `drop-shadow(0 ${tam * 0.07}px 0 ${C.ink}) drop-shadow(0 ${tam * 0.12}px ${tam * 0.12}px rgba(0,0,0,.55))`,
      }}
    >
      {texto.split("\n").map((linha, l) => (
        <div key={l} style={{ whiteSpace: "nowrap" }}>
          {linha.split("").map((ch, k) => {
            const i = idx++;
            const p = spring({ frame: frame - atraso - i * intervalo, fps, config: { damping: 9, stiffness: 180, mass: 0.6 } });
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  backgroundImage: preenchimento[estilo],
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextStroke: `${Math.max(4, tam * 0.06)}px ${stroke}`,
                  paintOrder: "stroke fill",
                  scale: String(interpolate(p, [0, 1], [0, 1])),
                  rotate: `${interpolate(p, [0, 1], [i % 2 ? 25 : -25, 0])}deg`,
                  translate: interpolate(p, [0, 1], [`0px ${tam * 0.5}px`, "0px 0px"]),
                  opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Palavra em pincel branco com faixa vermelha atrás (como o "LANCHES" da logo). */
const Pincel: React.FC<{ texto: string; tam: number; atraso?: number }> = ({ texto, tam, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 14, stiffness: 160 } });
  const revela = interpolate(frame, [atraso, atraso + 10], [0, 100], { ...clamp, easing: outExpo });
  return (
    <div style={{ position: "relative", display: "inline-block", rotate: "-5deg", scale: String(interpolate(p, [0, 1], [0.7, 1])) }}>
      <div
        style={{
          position: "absolute",
          inset: `${tam * 0.18}px -${tam * 0.35}px ${tam * 0.05}px`,
          background: `linear-gradient(90deg, ${C.redDk}, ${C.red} 30%, ${C.red} 70%, ${C.redDk})`,
          borderTop: `${tam * 0.05}px solid ${C.gold}`,
          borderBottom: `${tam * 0.05}px solid ${C.gold}`,
          clipPath: `inset(0 ${100 - revela}% 0 0)`,
          transform: "skewX(-12deg)",
        }}
      />
      <div
        style={{
          position: "relative",
          fontFamily: PINCEL,
          fontSize: tam,
          color: "#fff",
          lineHeight: 1.15,
          padding: `0 ${tam * 0.2}px`,
          clipPath: `inset(0 ${100 - revela}% 0 0)`,
          textShadow: `0 ${tam * 0.05}px 0 ${C.ink}`,
          whiteSpace: "nowrap",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

/** Etiqueta de preço em "selo" que gira e quica. */
const Preco: React.FC<{ valor: string; atraso?: number }> = ({ valor, atraso = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 8, stiffness: 170 } });
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        fontFamily: FOOD,
        color: C.ink,
        padding: "10px 34px 4px",
        borderRadius: 18,
        background: `linear-gradient(180deg, ${C.goldLt}, ${C.gold} 55%, ${C.goldDk})`,
        border: `5px solid ${C.redDk}`,
        boxShadow: `0 10px 0 ${C.ink}`,
        scale: String(interpolate(p, [0, 1], [0, 1])),
        rotate: `${interpolate(p, [0, 1], [-30, 4])}deg`,
      }}
    >
      <span style={{ fontSize: 44 }}>R$</span>
      <span style={{ fontSize: 96, lineHeight: 1 }}>{valor}</span>
    </div>
  );
};

/* ======================= PEÇAS DE CENA ======================= */
const Fundo: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 80% 45% at 50% 38%, rgba(255,150,20,.20), transparent 70%),
        radial-gradient(ellipse 90% 40% at 50% 100%, rgba(214,20,27,.28), transparent 70%), ${C.bg}`,
    }}
  />
);

const Midia: React.FC<{ i: number; zoomDe?: number; zoomAte?: number }> = ({ i, zoomDe = 1.0, zoomAte = 1.12 }) => {
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
  return USAR_CLIPES ? (
    <Video src={staticFile(`cenas/clip${i}.mp4`)} muted style={style} />
  ) : (
    <Img src={staticFile(`cenas/img${i}.jpg`)} style={style} />
  );
};

const Vinheta: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(12,9,8,.80) 0%, rgba(12,9,8,0) 24%, rgba(12,9,8,0) 60%, rgba(12,9,8,.92) 100%)",
    }}
  />
);

const Flash: React.FC<{ em: number }> = ({ em }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#fff", opacity: interpolate(frame, [em, em + 3, em + 9], [0, 0.85, 0], clamp) }} />;
};

const BrilhoVarre: React.FC<{ inicio: number; dur: number }> = ({ inicio, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(105deg, transparent 40%, rgba(255,240,200,.55) 50%, transparent 60%)",
        mixBlendMode: "overlay",
        translate: interpolate(frame, [inicio, inicio + dur], ["-120% 0px", "120% 0px"], clamp),
      }}
    />
  );
};

const Pincelada: React.FC<{ cor: string; top: number; atraso: number; rot: number; h: number }> = ({ cor, top, atraso, rot, h }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: -200,
        top,
        width: 1500,
        height: h,
        background: cor,
        rotate: `${rot}deg`,
        borderRadius: h,
        translate: interpolate(frame, [atraso, atraso + 12], ["-1600px 0px", "0px 0px"], { ...clamp, easing: outExpo }),
      }}
    />
  );
};

/* ======================= CENAS ======================= */
const CenaAbertura: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, 10], [0, 1], clamp) }}>
      <Midia i={0} zoomDe={1.12} zoomAte={1.0} />
      <Vinheta />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 420, gap: 10 }}>
        <TituloFood texto="Aquele lanche" tam={120} estilo="branco" atraso={12} />
        <Pincel texto="que você ama" tam={96} atraso={40} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Pagina: React.FC<{ src: string; atraso: number; rot: number; x: number }> = ({ src, atraso, rot, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - atraso, fps, config: { damping: 15, stiffness: 110 } });
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        width: 560,
        left: 540 - 280 + x,
        top: 560,
        borderRadius: 10,
        border: `3px solid ${C.gold}`,
        boxShadow: "0 30px 80px rgba(0,0,0,.6)",
        rotate: `${interpolate(p, [0, 1], [rot * 3, rot])}deg`,
        translate: interpolate(p, [0, 1], ["0px 1400px", "0px 0px"], clamp),
        scale: String(interpolate(frame, [atraso, atraso + 3 * fps], [1, 1.06], clamp)),
      }}
    />
  );
};

const CenaMudou: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Fundo />
      <Pincelada cor={C.red} top={660} atraso={0} rot={-8} h={320} />
      <Pincelada cor={`linear-gradient(90deg, ${C.goldDk}, ${C.gold}, ${C.goldLt})`} top={1040} atraso={4} rot={-8} h={180} />
      <Pagina src="marca/cardapio-2.jpg" atraso={5} rot={9} x={150} />
      <Pagina src="marca/cardapio-1.jpg" atraso={9} rot={-7} x={-130} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 270 }}>
        <TituloFood texto="Cara nova!" tam={150} atraso={4} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 400 }}>
        <Pincel texto="nome novo" tam={120} atraso={Math.round(1.3 * fps)} />
      </AbsoluteFill>
      <Flash em={Math.round(2.6 * fps)} />
    </AbsoluteFill>
  );
};

const CenaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 11, stiffness: 120 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 46%, rgba(255,180,40,.45), rgba(214,20,27,.18) 35%, transparent 60%)`,
          scale: String(interpolate(frame, [0, 2.4 * fps], [0.6, 1.3], clamp)),
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <TituloFood texto="Agora é..." tam={90} estilo="branco" atraso={0} intervalo={1.2} />
        <div style={{ position: "relative", width: 980, scale: String(interpolate(p, [0, 1], [0.55, 1])), opacity: interpolate(frame, [8, 14], [0, 1], clamp), overflow: "hidden" }}>
          <Img src={staticFile("marca/logo-ronalds-fundo.png")} style={{ width: "100%", display: "block", mixBlendMode: "lighten" }} />
          <BrilhoVarre inicio={18} dur={22} />
        </div>
      </AbsoluteFill>
      <Flash em={0} />
    </AbsoluteFill>
  );
};

const LANCHES = [
  { i: 1, nome: "X-Tudo", preco: "18,00" },
  { i: 2, nome: "X-Picanha", preco: "16,00" },
  { i: 3, nome: "Artesanal", preco: "18,00" },
  { i: 4, nome: "Ronald's", preco: "22,00", destaque: true },
];

const PlanoLanche: React.FC<{ i: number; nome: string; preco: string; destaque?: boolean }> = ({ i, nome, preco, destaque }) => (
  <AbsoluteFill>
    <Midia i={i} zoomDe={1.08} zoomAte={1.0} />
    <Vinheta />
    <AbsoluteFill style={{ alignItems: "center", paddingTop: destaque ? 250 : 290 }}>
      {destaque ? <Pincel texto="o campeão da casa" tam={64} atraso={0} /> : null}
    </AbsoluteFill>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 400, gap: 28 }}>
      <TituloFood texto={nome} tam={destaque ? 180 : 150} estilo={destaque ? "ouro" : "branco"} atraso={2} intervalo={1.4} />
      <Preco valor={preco} atraso={9} />
    </AbsoluteFill>
    <Flash em={0} />
  </AbsoluteFill>
);

const CenaLanches: React.FC = () => {
  const { fps } = useVideoConfig();
  const total = (T.lanches[1] - T.lanches[0]) * fps;
  const cortes = [0, 0.22, 0.44, 0.64].map((f) => Math.round(f * total));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250, zIndex: 2 }}>
        <Sequence durationInFrames={Math.round(1.6 * fps)} layout="none">
          <TituloFood texto="Mesmo sabor!" tam={110} atraso={0} intervalo={1.2} />
        </Sequence>
      </AbsoluteFill>
      {LANCHES.map((l, k) => (
        <Sequence key={l.nome} from={cortes[k]} durationInFrames={(cortes[k + 1] ?? total) - cortes[k]} premountFor={fps}>
          <PlanoLanche {...l} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Gelo: React.FC<{ x: number; atraso: number; tam: number }> = ({ x, atraso, tam }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: interpolate(frame, [atraso, atraso + 40], [-150, 1500], clamp),
        width: tam,
        height: tam,
        borderRadius: tam * 0.18,
        background: "linear-gradient(135deg, rgba(255,255,255,.85), rgba(200,230,255,.35))",
        border: "2px solid rgba(255,255,255,.7)",
        rotate: `${interpolate(frame, [atraso, atraso + 40], [0, 160])}deg`,
        opacity: 0.85,
      }}
    />
  );
};

const CenaBebidas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pLata = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const pSuco = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 30% at 50% 62%, rgba(255,150,20,.35), transparent 70%)" }} />
      {[[120, 0, 90], [820, 8, 70], [420, 16, 60], [700, 24, 85], [240, 30, 55]].map(([x, a, t]) => (
        <Gelo key={`${x}-${a}`} x={x} atraso={a} tam={t} />
      ))}
      <Img src={staticFile("marca/suco-laranja.webp")} style={{ position: "absolute", width: 820, left: 210, top: 700, scale: String(interpolate(pSuco, [0, 1], [0.6, 1])), opacity: interpolate(pSuco, [0, 1], [0, 1], clamp) }} />
      <Img src={staticFile("marca/coca-cola-lata.webp")} style={{ position: "absolute", height: 760, left: 90, top: 800, rotate: `${interpolate(pLata, [0, 1], [-14, -4])}deg`, translate: interpolate(pLata, [0, 1], ["-400px 0px", "0px 0px"], clamp) }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 280, gap: 18 }}>
        <TituloFood texto="Refri geladinho" tam={112} estilo="branco" atraso={6} intervalo={1.2} />
        <Pincel texto="+ suco natural" tam={88} atraso={34} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ----- Celular com o Instagram de cara nova ----- */
const TelaPerfil: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rolagem = interpolate(frame, [1.6 * fps, 3.6 * fps], [0, -260], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const toque = interpolate(frame, [3.9 * fps, 4.1 * fps, 4.3 * fps], [1, 0.9, 1], clamp);
  const seguindo = frame > 4.1 * fps;
  const Stat = ({ n, l }: { n: string; l: string }) => (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: MON, fontWeight: 700, fontSize: 30, color: "#fff" }}>{n}</div>
      <div style={{ fontFamily: MON, fontWeight: 600, fontSize: 20, color: "#bbb" }}>{l}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "#000", overflow: "hidden" }}>
      <div style={{ translate: `0px ${rolagem}px` }}>
        <div style={{ height: 90, marginTop: 64, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MON, fontWeight: 700, fontSize: 30, color: "#fff" }}>
          ronaldslanches10
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "10px 30px" }}>
          <div style={{ width: 170, height: 170, borderRadius: "50%", padding: 6, background: `conic-gradient(${C.gold}, ${C.red}, ${C.goldDk}, ${C.gold})` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "4px solid #000" }}>
              <Img src={staticFile("marca/logo-ronalds-recorte.png")} style={{ width: "92%" }} />
            </div>
          </div>
          <div style={{ display: "flex", flex: 1, justifyContent: "space-around" }}>
            <Stat n="Novo" l="perfil" />
            <Stat n="100%" l="sabor" />
            <Stat n="Delivery" l="WhatsApp" />
          </div>
        </div>
        <div style={{ padding: "8px 30px", fontFamily: MON, color: "#fff" }}>
          <div style={{ fontWeight: 700, fontSize: 28 }}>Ronald's Lanches</div>
          <div style={{ fontWeight: 600, fontSize: 22, color: "#ddd", lineHeight: 1.4 }}>
            🍔 Novo nome, mesmo sabor!
            <br />
            📲 Peça: (84) 9 8869-8674
          </div>
        </div>
        <div style={{ padding: "14px 30px", display: "flex", gap: 14 }}>
          <div style={{ flex: 1, scale: String(toque), textAlign: "center", fontFamily: MON, fontWeight: 700, fontSize: 24, padding: "14px 0", borderRadius: 12, color: seguindo ? "#fff" : C.ink, background: seguindo ? "#262626" : C.gold }}>
            {seguindo ? "Seguindo ✓" : "Seguir"}
          </div>
          <div style={{ flex: 1, textAlign: "center", fontFamily: MON, fontWeight: 700, fontSize: 24, padding: "14px 0", borderRadius: 12, color: "#fff", background: "#262626" }}>
            Mensagem
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, marginTop: 10 }}>
          {[1, 4, 2, 3, 0, 1, 4, 2, 3].map((n, k) => (
            <div key={k} style={{ aspectRatio: "3 / 4", overflow: "hidden", opacity: interpolate(frame, [0.6 * fps + k * 3, 0.6 * fps + k * 3 + 8], [0, 1], clamp) }}>
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
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 200 }}>
        <TituloFood texto="Siga o novo insta!" tam={86} atraso={4} intervalo={1.1} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1800 }}>
        <div
          style={{
            width: 600,
            height: 1220,
            marginTop: 110,
            borderRadius: 86,
            padding: 18,
            background: "linear-gradient(145deg, #3a3a3a, #111 40%, #2a2a2a)",
            boxShadow: `0 0 0 3px #555, 0 40px 120px rgba(214,20,27,.35), 0 0 160px rgba(255,170,30,.18)`,
            rotate: `${interpolate(p, [0, 1], [-14, -3])}deg`,
            translate: interpolate(p, [0, 1], ["0px 900px", "0px 0px"], clamp),
            transform: `rotateY(${interpolate(frame, [0, 5 * fps], [22, -8])}deg)`,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 70, overflow: "hidden" }}>
            <TelaPerfil />
            <div style={{ position: "absolute", top: 14, left: "50%", translate: "-50% 0px", width: 180, height: 40, borderRadius: 30, background: "#000" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 370 }}>
        <Sequence from={Math.round(3.2 * fps)} layout="none">
          <WhatsChip />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const WhatsChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 9, stiffness: 170 } });
  const pulso = 1 + 0.06 * Math.max(0, Math.sin((frame / fps) * Math.PI * 4));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, background: `linear-gradient(180deg, ${C.red}, ${C.redDk})`, border: `4px solid ${C.gold}`, borderRadius: 60, padding: "14px 36px", boxShadow: `0 10px 0 ${C.ink}`, scale: String(interpolate(p, [0, 1], [0, 1])), rotate: "-3deg" }}>
      <svg width="58" height="58" viewBox="0 0 24 24" style={{ scale: String(pulso) }}><circle cx="12" cy="12" r="11" fill="#25d366" /><path fill="#fff" d="M17.2 14.3c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.1-.4-2.1-1.3-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 2.2.9 2.6.7 3.1.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.2z" /></svg>
      <span style={{ fontFamily: FOOD, fontSize: 62, color: "#fff" }}>(84) 9 8869-8674</span>
    </div>
  );
};

const CenaFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, rgba(255,180,40,.35), transparent 55%)" }} />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 360 }}>
        <div style={{ position: "relative", width: 900, overflow: "hidden", scale: String(interpolate(p, [0, 1], [0.7, 1])), opacity: interpolate(frame, [0, 6], [0, 1], clamp) }}>
          <Img src={staticFile("marca/logo-ronalds-fundo.png")} style={{ width: "100%", display: "block", mixBlendMode: "lighten" }} />
          <BrilhoVarre inicio={20} dur={24} />
        </div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <TituloFood texto="Novo nome," tam={120} estilo="branco" atraso={12} intervalo={1.2} />
          <TituloFood texto="mesmo sabor!" tam={130} atraso={26} intervalo={1.2} />
        </div>
        <div style={{ marginTop: 50, display: "flex", gap: 30, fontFamily: OSW, fontWeight: 600, fontSize: 44, color: "#fff", opacity: interpolate(frame, [2 * fps, 2.4 * fps], [0, 1], clamp) }}>
          <span>@ronaldslanches10</span>
          <span style={{ color: C.gold }}>|</span>
          <span>(84) 9 8869-8674</span>
        </div>
      </AbsoluteFill>
      <Flash em={0} />
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
      <Audio src={staticFile("locucao.mp3")} />
    </AbsoluteFill>
  );
};
