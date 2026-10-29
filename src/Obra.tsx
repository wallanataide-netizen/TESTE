import React from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {
  Badge,
  Camera,
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
const NEON_ORANGE = "#ffa53a";

// Scene boundaries (absolute frames). Scenes overlap to allow transitions.
const S1 = { from: 0, dur: 55 }; // empty land -> time-lapse
const S2 = { from: 52, dur: 50 }; // construction, quick cuts
const S3 = { from: 86, dur: 69 }; // four takes at once
const S4 = { from: 148, dur: 77 }; // drone rises over the built loteamento
const DURATION = S4.from + S4.dur;

const ease = Easing.inOut(Easing.cubic);

const Photo: React.FC<{ src: string; cam: Camera; style?: React.CSSProperties }> = ({
  src,
  cam,
  style,
}) => (
  <div style={{ ...cameraStyle(cam), ...style }}>
    <Img src={staticFile(src)} style={{ width: W, height: H }} />
  </div>
);

// --- Scene 1: drone drifts left, then a time-lapse turns it into the works ------

const TIMELAPSE = [26, 52] as const;

// Dump truck from the construction photo, driven in from the highway.
const TRUCK = { x: 399, y: 1292, w: 130, h: 150 };

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow drift to the left that accelerates once the time-lapse kicks in.
  const cam = clampCamera({
    x: interpolate(frame, [0, TIMELAPSE[0], S1.dur], [640, 600, 540], {
      ...clamp,
      easing: Easing.in(Easing.quad),
    }),
    y: interpolate(frame, [0, S1.dur], [1080, 1050], clamp),
    zoom: interpolate(frame, [0, TIMELAPSE[0], S1.dur], [1.25, 1.22, 1.12], clamp),
  });

  // Time-lapse flicker: the construction photo pops in more and more often.
  const t = interpolate(frame, [...TIMELAPSE], [0, 1], clamp);
  const step = Math.floor(frame / 2);
  const showWorks = t >= 1 || (t > 0 && random(`tl-${step}`) < Math.pow(t, 0.7));
  const exposure = t > 0 && t < 1 ? 1 + (random(`exp-${step}`) - 0.5) * 0.18 : 1;

  const truckIn = interpolate(frame, [12, TIMELAPSE[1] - 4], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ filter: `brightness(${exposure})` }}>
      <Photo src="obra/1-terreno.jpg" cam={cam} />
      <Photo src="obra/2-obra.jpg" cam={cam} style={{ opacity: showWorks ? 1 : 0 }} />
      {/* truck arriving from the highway */}
      <div style={{ ...cameraStyle(cam), opacity: showWorks || truckIn <= 0 ? 0 : 1 }}>
        <div
          style={{
            position: "absolute",
            left: TRUCK.x - TRUCK.w / 2,
            top: TRUCK.y - TRUCK.h / 2,
            width: TRUCK.w,
            height: TRUCK.h,
            overflow: "hidden",
            maskImage: "radial-gradient(closest-side, black 55%, transparent 100%)",
            translate: `${interpolate(truckIn, [0, 1], [-90, 0])}px ${interpolate(truckIn, [0, 1], [230, 0])}px`,
          }}
        >
          <Img
            src={staticFile("obra/2-obra.jpg")}
            style={{
              position: "absolute",
              left: -(TRUCK.x - TRUCK.w / 2),
              top: -(TRUCK.y - TRUCK.h / 2),
              width: W,
              height: H,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: construction, quick cuts --------------------------------------------

const CUTS: { from: number; to: number; a: Camera; b: Camera }[] = [
  { from: 0, to: 13, a: { x: 540, y: 1050, zoom: 1.12 }, b: { x: 520, y: 1030, zoom: 1.3 } },
  { from: 13, to: 26, a: { x: 270, y: 1300, zoom: 2.0 }, b: { x: 290, y: 1270, zoom: 2.3 } },
  { from: 26, to: 42, a: { x: 760, y: 1190, zoom: 2.0 }, b: { x: 720, y: 1140, zoom: 3.4 } },
];

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = CUTS.find((c) => frame < c.to) ?? CUTS[CUTS.length - 1];
  const p = interpolate(frame, [cut.from, cut.to], [0, 1], clamp);
  const isLast = cut === CUTS[CUTS.length - 1];
  // Last cut ends with a fast punch-in that hands over to the four takes.
  const pe = isLast ? Easing.in(Easing.cubic)(p) : p;
  const cam = clampCamera({
    x: interpolate(pe, [0, 1], [cut.a.x, cut.b.x]),
    y: interpolate(pe, [0, 1], [cut.a.y, cut.b.y]),
    zoom: interpolate(pe, [0, 1], [cut.a.zoom, cut.b.zoom]),
  });
  const blur = isLast ? interpolate(frame, [34, 46], [0, 14], clamp) : 0;
  // Short flash on every cut.
  const flash = interpolate(frame - cut.from, [0, 4], [0.35, 0], clamp);

  return (
    <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
      <Photo src="obra/2-obra.jpg" cam={cam} />
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

// --- Scene 3: four takes playing at the same time --------------------------------

const GAP = 10;
const PANEL_H = (H - GAP * 3) / 4;
const TAKES = [
  { src: "obra/3-take1.jpg", origin: "60% 55%" },
  { src: "obra/3-take2.jpg", origin: "30% 60%" },
  { src: "obra/3-take3.jpg", origin: "45% 60%" },
  { src: "obra/3-take4.jpg", origin: "35% 45%" },
];

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  // Drone rises: the whole grid shrinks away and blurs before scene 4 takes over.
  const exit = interpolate(frame, [S4.from - S3.from, S3.dur], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        scale: String(1 - exit * 0.45),
        opacity: 1 - exit,
        filter: `blur(${exit * 10}px)`,
      }}
    >
      {TAKES.map((take, i) => {
        const enter = interpolate(frame, [i * 2.5, i * 2.5 + 8], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={take.src}
            style={{
              position: "absolute",
              left: 0,
              top: i * (PANEL_H + GAP),
              width: W,
              height: PANEL_H,
              overflow: "hidden",
              translate: `${(1 - enter) * (i % 2 ? 110 : -110)}% 0`,
            }}
          >
            <Img
              src={staticFile(take.src)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transformOrigin: take.origin,
                scale: String(
                  interpolate(frame, [0, S3.dur], [1.04, 1.24], { ...clamp, easing: Easing.out(Easing.quad) }),
                ),
                translate: `${interpolate(frame, [0, S3.dur], [0, i % 2 ? -18 : 18])}px 0`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Scene 4: built loteamento, cars driving, neon outline ------------------------

// Outline of the loteamento (streets included), traced on 4-construido.jpg.
const LOTE_OUTLINE =
  "M 160 790 L 400 845 L 600 886 L 926 968 L 932 1336 L 716 1336 L 716 1268 L 679 1268 L 600 1250 L 500 1222 L 372 1222 L 350 1227 L 160 1227 L 137 1243 L 137 800 Z";

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

const CARS: { route: string; offset: number; speed: number; color: string }[] = [
  { route: "rnDown", offset: 200, speed: 9, color: "#f2f2f2" },
  { route: "rnDown", offset: 900, speed: 9, color: "#c0392b" },
  { route: "rnUp", offset: 500, speed: 10, color: "#2c3e50" },
  { route: "rnUp", offset: 1400, speed: 10, color: "#f2f2f2" },
  { route: "top", offset: 60, speed: 5, color: "#f2f2f2" },
  { route: "topBack", offset: 380, speed: 4.5, color: "#7f8c8d" },
  { route: "middle", offset: 300, speed: 4.5, color: "#c0392b" },
  { route: "middleBack", offset: 80, speed: 5, color: "#f2f2f2" },
  { route: "right", offset: 40, speed: 3.5, color: "#2c3e50" },
  { route: "side", offset: 20, speed: 3, color: "#f2f2f2" },
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
  const g = segs[segs.length - 1];
  return { x: g.x0 + g.dx, y: g.y0 + g.dy, angle: 0 };
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

const OUTLINE_DRAW = [26, 52] as const;

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  // Drone climbs out of the construction and settles over the finished loteamento.
  const cam = clampCamera({
    x: interpolate(frame, [0, 34, S4.dur], [520, 540, 545], { ...clamp, easing: ease }),
    y: interpolate(frame, [0, 34, S4.dur], [1080, 1065, 1060], { ...clamp, easing: ease }),
    zoom: interpolate(frame, [0, 34, S4.dur], [3.4, 1.5, 1.38], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    }),
  });
  const enter = interpolate(frame, [0, 10], [0, 1], clamp);
  const blur = interpolate(frame, [0, 16], [12, 0], clamp);
  const draw = interpolate(frame, [...OUTLINE_DRAW], [0, 1], { ...clamp, easing: ease });
  const strokeW = 7 / cam.zoom;
  const anchor = project(cam, 420, 848);

  return (
    <AbsoluteFill style={{ opacity: enter, filter: `blur(${blur}px)` }}>
      <div style={cameraStyle(cam)}>
        <Img src={staticFile("obra/4-construido.jpg")} style={{ width: W, height: H }} />
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0 }}>
          <GlowDefs />
          <Cars frame={frame} />
          {/* dim everything outside the loteamento */}
          <path
            d={`M 0 0 H ${W} V ${H} H 0 Z ${LOTE_OUTLINE}`}
            fillRule="evenodd"
            fill="black"
            opacity={draw * 0.35}
          />
          <g opacity={0.88 + 0.12 * Math.sin(frame / 3)}>
            <NeonPath d={LOTE_OUTLINE} color={NEON_ORANGE} progress={draw} width={strokeW} closed />
          </g>
        </svg>
      </div>
      <Badge
        x={anchor.x}
        y={anchor.y}
        appearAt={44}
        color={NEON_ORANGE}
        icon={<HomeIcon />}
        title="LOTEAMENTO"
        subtitle="Seu novo endereço"
        side="top"
      />
    </AbsoluteFill>
  );
};

export const ObraVideo: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: "#000",
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}
  >
    <Sequence from={S1.from} durationInFrames={S1.dur} name="Terreno + time-lapse">
      <Scene1 />
    </Sequence>
    <Sequence from={S2.from} durationInFrames={S2.dur} name="Obra - cortes rápidos">
      <Scene2 />
    </Sequence>
    <Sequence from={S3.from} durationInFrames={S3.dur} name="Quatro takes">
      <Scene3 />
    </Sequence>
    <Sequence from={S4.from} durationInFrames={S4.dur} name="Loteamento construído">
      <Scene4 />
    </Sequence>
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
      }}
    />
  </AbsoluteFill>
);

export const ObraComposition: React.FC = () => (
  <Composition
    id="Obra"
    component={ObraVideo}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
