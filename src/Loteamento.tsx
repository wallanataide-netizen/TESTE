import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const W = 1080;
const H = 1920;
const FPS = 30;
const DURATION = 7 * FPS;

const NEON_GREEN = "#39ff6a";
const NEON_ORANGE = "#ffa53a";
const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

type Camera = { x: number; y: number; zoom: number };

// Keeps the camera inside the photo so no edge is ever visible.
const clampCamera = ({ x, y, zoom }: Camera): Camera => {
  const halfW = W / 2 / zoom;
  const halfH = H / 2 / zoom;
  return {
    zoom,
    x: Math.min(Math.max(x, halfW), W - halfW),
    y: Math.min(Math.max(y, halfH), H - halfH),
  };
};

// Image-space point -> screen-space point for a given camera.
const project = (cam: Camera, px: number, py: number) => ({
  x: (px - cam.x) * cam.zoom + W / 2,
  y: (py - cam.y) * cam.zoom + H / 2,
});

const cameraStyle = (cam: Camera): React.CSSProperties => ({
  position: "absolute",
  width: W,
  height: H,
  transformOrigin: "0 0",
  transform: `translate(${W / 2 - cam.x * cam.zoom}px, ${H / 2 - cam.y * cam.zoom}px) scale(${cam.zoom})`,
});

// --- Coordinates traced from the reference photo (vista-cidade.jpg) ---

// RN-086 stretch, following the centre of the highway from the loteamento
// up to the commercial center.
const RN086_PATH =
  "M 133 1472 L 145 1350 L 157 1200 L 169 1090 L 179 1000 L 186 948";

// Commercial center outline, running along the streets around it: the top
// cross street, the side streets and the avenue (RN-086) itself.
const CENTRO_PATH =
  "M 44 388 L 489 384 L 489 510 L 524 510 L 524 645 L 227 645 L 218 720 L 207 800 L 196 900 L 186 948 L 30 950 L 40 800 L 44 700 Z";

// --- Neon stroke --------------------------------------------------------------

const NeonPath: React.FC<{
  d: string;
  color: string;
  progress: number;
  width: number;
  closed?: boolean;
}> = ({ d, color, progress, width, closed }) => {
  const dash = {
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  };
  const common = {
    d,
    fill: "none",
    stroke: color,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    style: dash,
  };
  return (
    <g>
      {closed ? (
        <path d={d} fill={color} opacity={0.1 * progress} stroke="none" />
      ) : null}
      <path {...common} strokeWidth={width * 4} opacity={0.35} filter="url(#glowWide)" />
      <path {...common} strokeWidth={width * 1.8} opacity={0.9} filter="url(#glow)" />
      <path {...common} stroke="#f4fff6" strokeWidth={width * 0.55} />
    </g>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="glowWide" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
  </defs>
);

// --- Icons ----------------------------------------------------------------------

const RoadIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <path d="M7 3 3 21M17 3l4 18" stroke="#0b1a10" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M12 4v3M12 10.5v3M12 17v3" stroke="#0b1a10" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const StoreIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9l1.6-5h14.8L21 9M3 9h18M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"
      stroke="#0b1a10"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M5 12v8h14v-8M10 20v-5h4v5" stroke="#0b1a10" strokeWidth="1.9" strokeLinejoin="round" />
  </svg>
);

const HomeIcon: React.FC = () => (
  <svg width="54" height="54" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 11 12 3l9 8M5 9.5V21h14V9.5M10 21v-6h4v6"
      stroke="#1d1204"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

// --- Badge with pin --------------------------------------------------------------

const Badge: React.FC<{
  x: number;
  y: number;
  appearAt: number;
  // Optional frame where the badge starts leaving the screen.
  exitAt?: number;
  color: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  // Where the card sits relative to the anchor point.
  side: "right" | "top";
}> = ({ x, y, appearAt, exitAt, color, icon, title, subtitle, side }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const line = interpolate(frame - appearAt, [0, 10], [0, 1], clamp);
  const pulse = ((frame - appearAt) % 30) / 30;
  const exit =
    exitAt === undefined ? 1 : interpolate(frame, [exitAt, exitAt + 10], [1, 0], clamp);
  const show = frame >= appearAt && exit > 0;

  const lineLen = side === "right" ? 90 : 120;
  const card: React.CSSProperties =
    side === "right"
      ? { left: x + lineLen, top: y, translate: "0 -50%", transformOrigin: "left center" }
      : { left: x, top: y - lineLen, translate: "-50% -100%", transformOrigin: "center bottom" };

  return (
    <AbsoluteFill style={{ opacity: show ? exit : 0 }}>
      {/* pulsing pin */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 90,
          height: 90,
          marginLeft: -45,
          marginTop: -45,
          borderRadius: "50%",
          border: `4px solid ${color}`,
          scale: String(0.3 + pulse * 1.2),
          opacity: (1 - pulse) * pop,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 26,
          height: 26,
          marginLeft: -13,
          marginTop: -13,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 18px ${color}, 0 0 40px ${color}`,
          border: "4px solid white",
          scale: String(pop),
        }}
      />
      {/* connector */}
      <div
        style={{
          position: "absolute",
          left: side === "right" ? x : x - 2,
          top: side === "right" ? y - 2 : y - lineLen * line,
          width: side === "right" ? lineLen * line : 4,
          height: side === "right" ? 4 : lineLen * line,
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      {/* card */}
      <div
        style={{
          position: "absolute",
          ...card,
          scale: String(pop),
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "20px 34px 20px 20px",
          borderRadius: 28,
          background: "rgba(10, 16, 14, 0.82)",
          border: `3px solid ${color}`,
          boxShadow: `0 0 28px ${color}88, 0 18px 40px rgba(0,0,0,0.45)`,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 22,
            background: color,
            boxShadow: `0 0 24px ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              color: "white",
              fontSize: 50,
              fontWeight: 800,
              letterSpacing: 1,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          <div style={{ color: "#d6e6dc", fontSize: 30, fontWeight: 500 }}>
            {subtitle}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Loteamento blocks (orange), traced over the clean photo.
const LOTE_BLOCKS = [
  "M 200 1275 L 199 1247 L 215 1205 L 275 1165 L 430 1175 L 420 1270 L 412 1305 Z",
  "M 447 1257 L 455 1170 L 775 1195 L 970 1267 L 1020 1392 L 437 1312 Z",
  "M 187 1310 L 405 1340 L 412 1500 L 180 1480 Z",
  "M 430 1347 L 782 1392 L 797 1410 L 820 1515 L 655 1517 L 597 1490 L 520 1490 L 435 1450 Z",
  "M 835 1405 L 1030 1432 L 1078 1545 L 865 1543 Z",
];

// --- Timeline (frames) ------------------------------------------------------------

const LOTE_DRAW = [4, 36] as const;
const ROAD_DRAW = [50, 86] as const;
const CENTRO_DRAW = [118, 158] as const;

// Drone path: starts over the loteamento, flies along RN-086 and closes in on
// the commercial center.
const droneCamera = (frame: number): Camera => {
  const t = [0, 120, DURATION] as const;
  const ease = Easing.inOut(Easing.cubic);
  return clampCamera({
    x: interpolate(frame, [...t], [620, 420, 350], { ...clamp, easing: ease }),
    y: interpolate(frame, [...t], [1380, 1030, 690], { ...clamp, easing: ease }),
    zoom: interpolate(frame, [...t], [1.75, 1.32, 1.6], { ...clamp, easing: ease }),
  });
};

export const LoteamentoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = droneCamera(frame);

  // Gentle drone banking + hover sway applied to the whole frame.
  const bank = interpolate(frame, [0, DURATION], [-1.2, 1.6]) + Math.sin(frame / 22) * 0.35;
  const sway = Math.sin(frame / 17) * 6;

  const draw = (range: readonly [number, number]) =>
    interpolate(frame, [...range], [0, 1], {
      ...clamp,
      easing: Easing.inOut(Easing.cubic),
    });
  const neonFlicker = 0.85 + 0.15 * Math.sin(frame / 3);
  const strokeW = 9 / cam.zoom;
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);

  const loteAnchor = project(cam, 700, 1250);
  const roadAnchor = project(cam, 166, 1130);
  const centroAnchor = project(cam, 285, 389);

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
          translate: `${sway}px ${sway * 0.6}px`,
          scale: "1.09",
          opacity: fadeIn,
        }}
      >
        <div style={cameraStyle(cam)}>
          <Img
            src={staticFile("vista-cidade.jpg")}
            style={{ width: W, height: H, filter: "saturate(1.12) contrast(1.06)" }}
          />
          <svg
            width={W}
            height={H}
            viewBox={`0 0 ${W} ${H}`}
            style={{ position: "absolute", left: 0, top: 0, opacity: neonFlicker }}
          >
            <GlowDefs />
            {LOTE_BLOCKS.map((d) => (
              <NeonPath
                key={d}
                d={d}
                color={NEON_ORANGE}
                progress={draw(LOTE_DRAW)}
                width={strokeW * 0.8}
                closed
              />
            ))}
            <NeonPath d={RN086_PATH} color={NEON_GREEN} progress={draw(ROAD_DRAW)} width={strokeW * 1.3} />
            <NeonPath d={CENTRO_PATH} color={NEON_GREEN} progress={draw(CENTRO_DRAW)} width={strokeW} closed />
          </svg>
        </div>
        <Badge
          x={loteAnchor.x}
          y={loteAnchor.y}
          appearAt={20}
          exitAt={60}
          color={NEON_ORANGE}
          icon={<HomeIcon />}
          title="LOTEAMENTO"
          subtitle="Lotes à venda"
          side="top"
        />
        <Badge
          x={roadAnchor.x}
          y={roadAnchor.y}
          appearAt={74}
          color={NEON_GREEN}
          icon={<RoadIcon />}
          title="RN-086"
          subtitle="Acesso direto pela rodovia"
          side="right"
        />
        <Badge
          x={centroAnchor.x}
          y={centroAnchor.y}
          appearAt={148}
          color={NEON_GREEN}
          icon={<StoreIcon />}
          title="CENTRO COMERCIAL"
          subtitle="Comércio e serviços próximos"
          side="top"
        />
      </AbsoluteFill>

      {/* Cinematic vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const LoteamentoComposition: React.FC = () => (
  <Composition
    id="Loteamento"
    component={LoteamentoVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
