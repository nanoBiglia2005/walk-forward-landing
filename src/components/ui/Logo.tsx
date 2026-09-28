import Image from "next/image";

type LogoProps = {
  width: number;
  className?: string;
  decorative?: boolean;
};

/** Official logotype (vectorised "Logo Wordmark / Lime"), ratio 178.5 × 112. */
export function Logo({ width, className, decorative = false }: LogoProps) {
  return (
    <Image
      src="/brand/walk-forward-lime.svg"
      alt={decorative ? "" : "Walk Forward"}
      width={width}
      height={Math.round((width * 112) / 178.5)}
      className={className}
      priority={!decorative}
    />
  );
}
