import Image from "next/image";
import { BASE_PATH } from "@/lib/base-path";

type LogoProps = {
  width: number;
  className?: string;
  decorative?: boolean;
};

/** Official logotype (vectorised "Logo Wordmark / Lime"), ratio 178.5 × 112. */
export function Logo({ width, className, decorative = false }: LogoProps) {
  return (
    <Image
      src={`${BASE_PATH}/brand/walk-forward-lime.svg`}
      alt={decorative ? "" : "Walk Forward"}
      width={width}
      height={Math.round((width * 112) / 178.5)}
      className={className}
      priority={!decorative}
    />
  );
}
