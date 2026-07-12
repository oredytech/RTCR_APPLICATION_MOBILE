import type { CSSProperties } from "react";

export function Icon({
  name,
  filled = false,
  className = "",
  style,
}: {
  name: string;
  filled?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden
      className={`material-symbols-outlined ${filled ? "msf" : ""} ${className}`}
      style={style}
    >
      {name}
    </span>
  );
}
