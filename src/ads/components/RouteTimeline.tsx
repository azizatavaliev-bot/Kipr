import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { GlassCard } from "../../components/GlassCard";
import { theme } from "../adTheme";

export type RouteStop = {
  Icon: React.FC<{ size?: number }>;
  title: string;
  sub: string;
  accent?: boolean;
};

const LINE_X = 110; // отступ линии маршрута от левого края блока

/**
 * Вертикальный маршрут: светящаяся линия прорисовывается вниз (как stroke в AE),
 * остановки-карточки вылетают по мере прохождения, точки вспыхивают.
 */
export const RouteTimeline: React.FC<{
  stops: RouteStop[];
  startFrame: number;
  stepSeconds?: number;
  width?: number;
  rowHeight?: number;
}> = ({ stops, startFrame, stepSeconds = 0.8, width = 860, rowHeight = 230 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalH = rowHeight * stops.length;

  const draw = interpolate(
    frame,
    [startFrame, startFrame + stepSeconds * fps * stops.length],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const lineH = draw * (totalH - rowHeight / 2);

  return (
    <div style={{ position: "relative", width, height: totalH }}>
      <div
        style={{
          position: "absolute",
          left: LINE_X - 3,
          top: rowHeight / 2,
          width: 6,
          height: lineH,
          borderRadius: 3,
          background: `linear-gradient(180deg, ${theme.aqua}, ${theme.aqua}44)`,
          boxShadow: `0 0 24px ${theme.aqua}66`,
        }}
      />
      {stops.map((stop, i) => {
        const start = startFrame + i * stepSeconds * fps;
        const s = spring({
          frame: frame - start,
          fps,
          config: { damping: 16, mass: 0.8, stiffness: 120 },
        });
        const dotPop = spring({
          frame: frame - start,
          fps,
          config: { damping: 9, mass: 0.5 },
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: i * rowHeight,
              left: 0,
              width: "100%",
              height: rowHeight,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: LINE_X - 17,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: theme.bg,
                border: `4px solid ${stop.accent ? theme.sun : theme.aqua}`,
                boxShadow: `0 0 ${20 * dotPop}px ${stop.accent ? theme.sun : theme.aqua}AA`,
                transform: `scale(${dotPop})`,
              }}
            />
            <div
              style={{
                marginLeft: LINE_X + 50,
                flex: 1,
                opacity: s,
                transform: `translateX(${(1 - s) * 90}px)`,
                filter: `blur(${(1 - s) * 8}px)`,
              }}
            >
              <GlassCard
                tint="rgba(12,26,36,0.62)"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 32,
                  padding: "30px 36px",
                  border: `1px solid ${stop.accent ? "rgba(255,179,71,0.35)" : "rgba(255,255,255,0.1)"}`,
                }}
              >
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 26,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(46,198,230,0.08)",
                    border: "1px solid rgba(46,198,230,0.22)",
                  }}
                >
                  <stop.Icon size={62} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 48,
                      fontWeight: 800,
                      color: stop.accent ? theme.sun : theme.text,
                      lineHeight: 1.1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {stop.title}
                  </div>
                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 400,
                      color: theme.textDim,
                      marginTop: 8,
                    }}
                  >
                    {stop.sub}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        );
      })}
    </div>
  );
};
