export type ViaVariant = "lime" | "navy" | "white";

type ViaProps = {
  variant?: ViaVariant;
  size?: number;
  className?: string;
};

/** v2/Via: the only round element of the system. Lime on lime surfaces, Navy on dark ones, White on white. */
export function Via({ variant = "lime", size = 16, className }: ViaProps) {
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`via-${variant} shrink-0 ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      <circle className="via" cx={c} cy={c} r={c - 2} />
    </svg>
  );
}
