import { loadFont } from "@remotion/google-fonts/Roboto";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const { fontFamily } = loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700", "900"],
});

const disappearBeforeEnd = 20;

const formatViews = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
};

export const Overlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const entryScale = spring({ fps, frame, config: { mass: 0.4, damping: 12 } });

  const out = spring({
    fps,
    frame: frame - durationInFrames + disappearBeforeEnd,
    config: { damping: 200 },
    durationInFrames: disappearBeforeEnd,
  });

  const textIn1 = spring({ fps, frame: frame - 4, config: { mass: 0.3, damping: 10 } });
  const textIn2 = spring({ fps, frame: frame - 10, config: { mass: 0.3, damping: 10 } });
  const textIn3 = spring({ fps, frame: frame - 18, config: { mass: 0.3, damping: 10 } });

  const pulse = Math.sin(frame * 0.18) * 0.08 + 1;
  const outY = interpolate(out, [0, 1], [0, -600]);
  const outRotate = interpolate(out, [0, 1], [0, -0.15]);

  const activeFrames = durationInFrames - disappearBeforeEnd;
  const progress = interpolate(frame, [10, activeFrames], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const views = Math.floor(
    interpolate(frame, [5, activeFrames], [0, 2_400_000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          transformOrigin: "bottom left",
          transform: `scale(${entryScale}) translateY(${outY}px) rotate(${outRotate}rad)`,
        }}
      >
        {/* Glow halo behind card */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            borderRadius: 60,
            background:
              "radial-gradient(ellipse at 40% 60%, rgba(180,50,255,0.35) 0%, transparent 70%)",
            filter: "blur(30px)",
            pointerEvents: "none",
          }}
        />

        {/* Glassmorphism card */}
        <div
          style={{
            position: "relative",
            background:
              "linear-gradient(135deg, rgba(10,0,35,0.88) 0%, rgba(25,0,55,0.92) 100%)",
            backdropFilter: "blur(24px)",
            borderRadius: 28,
            padding: "36px 44px",
            minWidth: 500,
            border: "1px solid rgba(200,120,255,0.28)",
            boxShadow: [
              "0 0 0 1px rgba(255,255,255,0.05) inset",
              "0 0 60px rgba(160,60,255,0.35)",
              "0 24px 64px rgba(0,0,0,0.55)",
            ].join(", "),
          }}
        >
          {/* Badge row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 20,
              opacity: textIn1,
              transform: `translateY(${interpolate(textIn1, [0, 1], [12, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 38,
                display: "inline-block",
                transform: `scale(${pulse})`,
              }}
            >
              🔥
            </span>
            <div
              style={{
                background: "linear-gradient(90deg, #ff3cac, #7928ca, #2b86c5)",
                borderRadius: 100,
                padding: "5px 18px",
                fontFamily,
                fontWeight: "700",
                fontSize: 13,
                color: "white",
                letterSpacing: 2.5,
                textTransform: "uppercase",
                boxShadow: "0 0 20px rgba(255,60,172,0.5)",
              }}
            >
              Going Viral
            </div>
          </div>

          {/* View count */}
          <div
            style={{
              fontFamily,
              fontSize: 80,
              fontWeight: "900",
              color: "white",
              lineHeight: 1,
              marginBottom: 6,
              opacity: textIn2,
              transform: `translateY(${interpolate(textIn2, [0, 1], [24, 0])}px)`,
              textShadow: "0 0 50px rgba(190,100,255,0.9)",
            }}
          >
            {formatViews(views)}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily,
              fontSize: 18,
              fontWeight: "400",
              color: "rgba(210,160,255,0.85)",
              marginBottom: 28,
              opacity: textIn2,
              letterSpacing: 0.5,
            }}
          >
            views in the last hour
          </div>

          {/* Progress bar */}
          <div
            style={{
              opacity: textIn3,
              transform: `translateY(${interpolate(textIn3, [0, 1], [12, 0])}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily,
                fontSize: 13,
                color: "rgba(200,150,255,0.65)",
                marginBottom: 10,
                letterSpacing: 0.5,
              }}
            >
              <span>Virality Score</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: 100,
                height: 7,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(90deg, #ff3cac, #7928ca, #2b86c5)",
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 100,
                  boxShadow: "0 0 14px rgba(255,60,172,0.75)",
                  transition: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
