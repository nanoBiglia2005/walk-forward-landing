"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { BASE_PATH } from "@/lib/base-path";
import type { SizedEntity } from "@/lib/logo-size";

type Row = { items: readonly SizedEntity[]; direction: "left" | "right" };

type MarqueeGroupProps = {
  rows: Row[];
  /** Used in the pause button label, e.g. "marcas". */
  label: string;
  tone: "brands" | "clients";
  /** On desktop, show the items as fixed centred rows (no loop, no line, no pause button). */
  staticOnDesktop?: boolean;
  className?: string;
  controlClassName?: string;
};

const tones = {
  brands: { line: "bg-black", item: "bg-lime text-black" },
  clients: { line: "bg-navy-700", item: "bg-white text-navy" },
};

/**
 * Logos (or names, while a logo is missing) running over their trace (40s per loop). Pauses on
 * hover, on keyboard focus and with an accessible button; with reduced motion the rows become manually
 * scrollable.
 */
export function MarqueeGroup({ rows, label, tone, staticOnDesktop, className, controlClassName }: MarqueeGroupProps) {
  const [paused, setPaused] = useState(false);
  const colors = tones[tone];
  // The second copy only makes the loop seamless: hidden from screen readers and out of the Tab
  // order, but its links still respond to clicks because it is on screen half of the cycle.
  const list = (items: readonly SizedEntity[], hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map(({ name, logo, url, dark, width, height }) =>
        logo && url && width && height ? (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={hidden ? -1 : undefined}
              className={`flex h-11 items-center border-2 border-black px-4 transition-[scale] duration-200 ease-io hover:scale-105 focus-visible:scale-105 motion-reduce:transition-none lg:h-14 lg:px-5 ${dark ? "bg-navy" : "bg-white"}`}
            >
              {/* Real size read at build time: the space reserved before loading is final, so the
                  row keeps its width while it moves (a percentage transform would jump otherwise). */}
              <Image
                src={`${BASE_PATH}${logo}`}
                alt={name}
                width={width}
                height={height}
                className="h-6 w-auto max-w-[120px] object-contain lg:h-8 lg:max-w-[160px]"
              />
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </li>
        ) : (
          <li key={name} className={`px-3 type-heading-sm whitespace-nowrap lg:px-5 lg:type-item ${colors.item}`}>
            {name}
          </li>
        ),
      )}
    </ul>
  );

  return (
    // The layout switch lives in globals.css ([data-static="desktop"]): one markup for both widths.
    <div className={className} data-paused={paused} data-static={staticOnDesktop ? "desktop" : undefined}>
      <div className="flex flex-col gap-8">
        {rows.map((row, i) => (
          <div
            key={i}
            className="marquee h-14 [--marquee-gap:32px] lg:h-[72px] lg:[--marquee-gap:48px]"
            data-direction={row.direction}
          >
            <span aria-hidden="true" className={`marquee-line ${colors.line}`} />
            <div className="marquee-track">
              {list(row.items, false)}
              {list(row.items, true)}
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-6 motion-reduce:hidden ${staticOnDesktop ? "lg:hidden" : ""} ${controlClassName ?? ""}`}>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={`${paused ? "Reanudar" : "Pausar"} el carrusel de ${label}`}
          className="link-underline inline-flex items-center gap-2 type-strong-sm motion-reduce:hidden"
        >
          <Icon name={paused ? "play" : "pause"} className="size-4" />
          {paused ? "Reanudar" : "Pausar"}
        </button>
      </div>
    </div>
  );
}
