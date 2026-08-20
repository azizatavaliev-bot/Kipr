import React from "react";
import { theme } from "../adTheme";

const Base: React.FC<{ children: React.ReactNode; id: string; size?: number }> = ({
  children,
  id,
  size = 64,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id={`ag-${id}`} x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="#8FE8F7" />
        <stop offset="100%" stopColor={theme.aqua} />
      </linearGradient>
    </defs>
    <g
      stroke={`url(#ag-${id})`}
      strokeWidth={3.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </g>
  </svg>
);

/** Кипр: солнце над волной. */
export const IconCyprus: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="cy" size={size}>
    <circle cx="32" cy="26" r="10" />
    <path d="M32 8 L32 12 M32 40 L32 44 M14 26 L10 26 M54 26 L50 26 M19 13 L22 16 M45 13 L42 16" />
    <path d="M8 52 C16 46 24 46 32 52 C40 58 48 58 56 52" />
  </Base>
);

/** Германия: Бранденбургские ворота (упрощённо). */
export const IconGermany: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="de" size={size}>
    <path d="M10 18 L54 18 M14 12 L50 12 L54 18 L10 18 Z" />
    <path d="M14 18 L14 52 M26 22 L26 52 M38 22 L38 52 M50 18 L50 52" />
    <path d="M8 52 L56 52" />
  </Base>
);

/** Диплом: академическая шапочка. */
export const IconDiploma: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="dp" size={size}>
    <path d="M6 26 L32 14 L58 26 L32 38 Z" />
    <path d="M18 32 L18 44 C18 48 46 48 46 44 L46 32" />
    <path d="M52 28 L52 42" />
    <circle cx="52" cy="46" r="2.6" />
  </Base>
);

/** США: звезда. */
export const IconUsa: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="us" size={size}>
    <path d="M32 8 L38.5 23 L54 24.5 L42 35 L45.8 51 L32 42.5 L18.2 51 L22 35 L10 24.5 L25.5 23 Z" />
  </Base>
);

/** Онлайн: ноутбук с сигналом. */
export const IconOnline: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="on" size={size}>
    <rect x="14" y="18" width="36" height="24" rx="3" />
    <path d="M8 50 L56 50" />
    <path d="M26 30 C29 27 35 27 38 30" />
    <circle cx="32" cy="35" r="1.6" />
  </Base>
);

/** Календарь: 6 месяцев курсов. */
export const IconCalendar: React.FC<{ size?: number }> = ({ size }) => (
  <Base id="cal" size={size}>
    <rect x="10" y="14" width="44" height="38" rx="5" />
    <path d="M10 26 L54 26 M22 8 L22 18 M42 8 L42 18" />
    <path d="M20 36 L26 42 L36 32" />
  </Base>
);

/** Чат-пузырь WhatsApp-стиля (телефонная трубка в облачке). */
export const IconChat: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = "#FFFFFF",
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <g stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 8 C18 8 8 18 8 30 C8 36 10.5 41.5 14.5 45.5 L12 56 L23 53 C26 54.3 29 55 32 55 C46 55 56 44 56 32 C56 19 46 8 32 8 Z" />
      <path d="M24 24 C24 24 22 26 24 30 C26 34 30 38 34 40 C38 42 40 40 40 40 L42 36 L36 33 L34 35 C32 34 30 32 29 30 L31 28 Z" fill={color} strokeWidth={1.5} />
    </g>
  </svg>
);
