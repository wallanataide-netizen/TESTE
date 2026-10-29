import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Badge,
  cameraStyle,
  clamp,
  clampCamera,
  GlowDefs,
  HomeIcon,
  NeonPath,
  project,
} from "./Loteamento";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 7 * FPS;
const NEON_ORANGE = "#ffa53a";

// Outline of the loteamento (internal streets included), traced on 4-construido.jpg.
const LOTE_OUTLINE =
  "M 160 790 L 400 845 L 600 886 L 926 968 L 932 1336 L 716 1336 L 716 1268 L 679 1268 L 600 1250 L 500 1222 L 372 1222 L 350 1227 L 160 1227 L 137 1243 L 137 800 Z";

// --- Cars -------------------------------------------------------------------------

type Pt = [number, number];
const ROUTES: Record<string, Pt[]> = {
  rnDown: [[114, -40], [114, 1960]],
  rnUp: [[128, 1960], [128, -40]],
  top: [[160, 803], [400, 856], [600, 898], [905, 970]],
  topBack: [[905, 978], [600, 906], [400, 864], [160, 811]],
  middle: [[165, 1018], [400, 1060], [600, 1098], [890, 1150]],
  middleBack: [[890, 1158], [600, 1106], [400, 1068], [165, 1026]],
  right: [[912, 975], [912, 1340]],
  side: [[362, 1240], [362, 1030]],
};

// Speeds are in image pixels per frame.
const CARS: { route: string; offset: number; speed: number; color: string }[] = [
  { route: "rnDown", offset: 700, speed: 6, color: "#f2f2f2" },
  { route: "rnDown", offset: 1300, speed: 6, color: "#c0392b" },
  { route: "rnUp", offset: 600, speed: 6.5, color: "#2c3e50" },
  { route: "rnUp", offset: 1500, speed: 6.5, color: "#f2f2f2" },
  { route: "top", offset: 40, speed: 2.6, color: "#f2f2f2" },
  { route: "top", offset: 520, speed: 2.6, color: "#7f8c8d" },
  { route: "topBack", offset: 300, speed: 2.4, color: "#c0392b" },
  { route: "middle", offset: 250, speed: 2.4, color: "#f2f2f2" },
  { route: "middleBack", offset: 60, speed: 2.6, color: "#2c3e50" },
  { route: "middleBack", offset: 560, speed: 2.6, color: "#f2f2f2" },
  { route: "right", offset: 30, speed: 1.6, color: "#7f8c8d" },
  { route: "side", offset: 10, speed: 1.2, color: "#f2f2f2" },
];

const pointAt = (pts: Pt[], dist: number) => {
  const segs = pts.slice(1).map((p, i) => {
    const [x0, y0] = pts[i];
    return { x0, y0, dx: p[0] - x0, dy: p[1] - y0, len: Math.hypot(p[0] - x0, p[1] - y0) };
  });
  const total = segs.reduce((s, g) => s + g.len, 0);
  let d = ((dist % total) + total) % total;
  for (const g of segs) {
    if (d <= g.len) {
      const k = d / g.len;
      return { x: g.x0 + g.dx * k, y: g.y0 + g.dy * k, angle: (Math.atan2(g.dy, g.dx) * 180) / Math.PI };
    }
    d -= g.len;
  }
  return { x: pts[0][0], y: pts[0][1], angle: 0 };
};

const Cars: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    {CARS.map((car, i) => {
      const p = pointAt(ROUTES[car.route], car.offset + frame * car.speed);
      return (
        <g key={i} transform={`translate(${p.x} ${p.y}) rotate(${p.angle})`}>
          <rect x={-11} y={-5.5} width={22} height={11} rx={3.5} fill="rgba(0,0,0,0.35)" transform="translate(1.5 2)" />
          <rect x={-11} y={-5.5} width={22} height={11} rx={3.5} fill={car.color} />
          <rect x={1} y={-4.2} width={6} height={8.4} rx={1.5} fill="rgba(20,30,40,0.75)" />
          <rect x={-8} y={-4.2} width={4} height={8.4} rx={1.2} fill="rgba(20,30,40,0.6)" />
        </g>
      );
    })}
  </g>
);

// --- Take ---------------------------------------------------------------------------

const OUTLINE_DRAW = [120, 160] as const;
const BADGE_AT = 152;

export const FinalVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Drone climbs slowly over the whole take, ending framed on the loteamento.
  const rise = Easing.inOut(Easing.sin);
  const cam = clampCamera({
    x: interpolate(frame, [0, DURATION], [500, 535], { ...clamp, easing: rise }),
    y: interpolate(frame, [0, DURATION], [1110, 1040], { ...clamp, easing: rise }),
    zoom: interpolate(frame, [0, DURATION], [2.2, 1.1], { ...clamp, easing: rise }),
  });
  const bank = interpolate(frame, [0, DURATION], [-1.5, 0.5]) + Math.sin(frame / 25) * 0.25;

  const draw = interpolate(frame, [...OUTLINE_DRAW], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const anchor = project(cam, 420, 848);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          rotate: `${bank}deg`,
          scale: "1.06",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        <div style={cameraStyle(cam)}>
          <Img
            src={staticFile("obra/4-construido.jpg")}
            style={{ width: W, height: H, filter: "saturate(1.08) contrast(1.04)" }}
          />
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
            <GlowDefs />
            <Cars frame={frame} />
            {/* dim everything outside the loteamento */}
            <path
              d={`M 0 0 H ${W} V ${H} H 0 Z ${LOTE_OUTLINE}`}
              fillRule="evenodd"
              fill="black"
              opacity={draw * 0.38}
            />
            <g opacity={0.88 + 0.12 * Math.sin(frame / 3)}>
              <NeonPath d={LOTE_OUTLINE} color={NEON_ORANGE} progress={draw} width={7 / cam.zoom} closed />
            </g>
          </svg>
        </div>
        <Badge
          x={anchor.x}
          y={anchor.y}
          appearAt={BADGE_AT}
          color={NEON_ORANGE}
          icon={<HomeIcon />}
          title="LOTEAMENTO"
          subtitle="Seu novo endereço"
          side="top"
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const FinalComposition: React.FC = () => (
  <Composition
    id="LoteamentoFinal"
    component={FinalVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
