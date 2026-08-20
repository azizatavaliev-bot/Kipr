import React from "react";
import { theme } from "./theme";

const IconBase: React.FC<{ children: React.ReactNode; id: string }> = ({
  children,
  id,
}) => (
  <svg width={96} height={96} viewBox="0 0 96 96" fill="none">
    <defs>
      <linearGradient id={`g-${id}`} x1="0" y1="0" x2="96" y2="96">
        <stop offset="0%" stopColor="#8FE8F7" />
        <stop offset="100%" stopColor={theme.aqua} />
      </linearGradient>
    </defs>
    <g
      stroke={`url(#g-${id})`}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  </svg>
);

/** Пляж: зонт + линия горизонта с волной. */
export const IconBeach: React.FC = () => (
  <IconBase id="beach">
    <path d="M48 16 C30 16 18 30 16 44 L48 22 L80 44 C78 30 66 16 48 16 Z" fill="none" />
    <path d="M48 16 L48 22" />
    <path d="M48 22 L58 72" />
    <path d="M12 80 C22 72 32 72 42 78 C52 84 62 84 72 78 C78 74 84 74 88 76" />
  </IconBase>
);

/** Горы: два пика со снегом и солнцем. */
export const IconMountain: React.FC = () => (
  <IconBase id="mountain">
    <path d="M8 76 L36 30 L52 56 L62 42 L88 76 Z" />
    <path d="M30 40 L36 46 L42 40" />
    <circle cx="74" cy="24" r="8" />
  </IconBase>
);

/** Античность: греческая колонна с капителью. */
export const IconColumn: React.FC = () => (
  <IconBase id="column">
    <path d="M20 20 L76 20" />
    <path d="M24 30 L72 30" />
    <path d="M34 30 L34 66 M48 30 L48 66 M62 30 L62 66" />
    <path d="M24 66 L72 66" />
    <path d="M20 78 L76 78" />
  </IconBase>
);
