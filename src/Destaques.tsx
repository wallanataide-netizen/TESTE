import React from "react";
import { AbsoluteFill, Still } from "remotion";

/* Capas de destaques do Instagram — 1080×1920.
   O Instagram recorta um círculo no centro: o ícone fica dentro dele. */

const GOLD = "#ffc21a";
const st = { fill: "none", stroke: GOLD, strokeWidth: 3.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONES: Record<string, React.ReactNode> = {
  /* cardápio: livro aberto */
  cardapio: (
    <g {...st}>
      <path d="M8 14c6-2 12-2 16 2v32c-4-4-10-4-16-2z" />
      <path d="M40 14c-6-2-12-2-16 2v32c4-4 10-4 16-2z" />
      <path d="M12 22h8M12 28h8M12 34h6M28 22h8M28 28h8M28 34h6" />
    </g>
  ),
  /* sanduíches: hambúrguer */
  lanches: (
    <g {...st}>
      <path d="M9 24c0-8 7-13 15-13s15 5 15 13z" />
      <path d="M17 17h.01M24 15h.01M31 17h.01" strokeWidth={4} />
      <path d="M7 29c3 2 5 2 8 0s5-2 8 0 5 2 8 0 5-2 8 0 4 2 4 2" />
      <path d="M8 34h32" />
      <path d="M9 38h30c0 4-3 6-6 6H15c-3 0-6-2-6-6z" />
    </g>
  ),
  /* bebidas: copo com canudo */
  bebidas: (
    <g {...st}>
      <path d="M13 18h22l-3 28H16z" />
      <path d="M11 18h26" />
      <path d="M26 18l4-12 6-1" />
      <path d="M15 28h18" />
    </g>
  ),
  /* delivery: moto */
  delivery: (
    <g {...st}>
      <circle cx="12" cy="36" r="6" />
      <circle cx="38" cy="36" r="6" />
      <path d="M18 36h12l5-12h-7" />
      <path d="M22 24h-8l-4 6" />
      <path d="M28 18h5l2 6" />
      <rect x="8" y="14" width="12" height="9" rx="1.5" />
    </g>
  ),
  /* sorteios: presente */
  sorteios: (
    <g {...st}>
      <rect x="9" y="20" width="30" height="8" rx="1.5" />
      <path d="M11 28v16h26V28" />
      <path d="M24 20v24" />
      <path d="M24 20c-3-6-10-8-11-3s8 3 11 3c3 0 12 2 11-3s-8-3-11 3z" />
    </g>
  ),
  /* clientes: estrela com coração */
  clientes: (
    <g {...st}>
      <path d="M24 6l5.5 11.2 12.3 1.8-8.9 8.7 2.1 12.3L24 34.2l-11 5.8 2.1-12.3-8.9-8.7 12.3-1.8z" />
      <path d="M24 29c-3-2-6-4-6-7a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3-3 5-6 7z" />
    </g>
  ),
  /* contato: whatsapp/telefone */
  pedidos: (
    <g {...st}>
      <path d="M24 6a18 18 0 0 0-15.6 27L6 42l9.3-2.4A18 18 0 1 0 24 6z" />
      <path d="M17 16c-1 1-2 3 0 7s6 8 10 9 5 0 6-1l1-3-5-2-2 2c-2-1-5-3-6-6l2-2-2-5z" />
    </g>
  ),
};

export const Capa: React.FC<{ icone: string }> = ({ icone }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,190,50,.30) 0%, rgba(214,20,27,.18) 22%, transparent 60%)" }} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 980, height: 980, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #241812, #0b0706 70%)", boxShadow: "0 0 80px rgba(255,194,26,.25)" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `14px solid ${GOLD}` }} />
        <div style={{ position: "absolute", inset: 46, borderRadius: "50%", border: "3px solid rgba(255,194,26,.4)" }} />
        <svg viewBox="0 0 48 48" style={{ position: "absolute", left: 220, top: 220, width: 540, height: 540, filter: "drop-shadow(0 0 18px rgba(255,194,26,.45))" }}>
          {ICONES[icone]}
        </svg>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const CAPAS = ["cardapio", "lanches", "bebidas", "delivery", "pedidos", "sorteios", "clientes"];

export const CapasDestaques: React.FC = () => (
  <>
    {CAPAS.map((c) => (
      <Still key={c} id={`Capa-${c}`} component={Capa} defaultProps={{ icone: c }} width={1080} height={1920} />
    ))}
  </>
);
