import React from "react";

/**
 * Стеклянная UI-карточка (backdrop blur, тонкая обводка, мягкая тень) —
 * паттерн из UI-дропдаунов Claude promo / карточек Botanica.
 */
export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  tint?: string; // базовый цвет подложки
}> = ({ children, style, tint = "rgba(20,20,20,0.55)" }) => {
  return (
    <div
      style={{
        background: tint,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        padding: "20px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
