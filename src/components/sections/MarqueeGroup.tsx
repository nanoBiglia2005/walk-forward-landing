"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Row = { items: readonly string[]; direction: "left" | "right" };

type MarqueeGroupProps = {
  rows: Row[];
  /** Used in the pause button label, e.g. "marcas". */
  label: string;
  tone: "brands" | "clients";
  className?: string;
  controlClassName?: string;
};

const tones = {
  brands: { line: "bg-black", item: "bg-lime text-black" },
  clients: { line: "bg-navy-700", item: "bg-white text-navy" },
};

/**
 * Names running over their trace (40s per loop). Pauses on hover and with an accessible button;
 * with reduced motion the rows become manually scrollable.
 */
export function MarqueeGroup({ rows, label, tone, className, controlClassName }: MarqueeGroupProps) {
  const [paused, setPaused] = useState(false);
  const colors = tones[tone];
  const list = (items: readonly string[], hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((name) => (
        <li key={name} className={`px-3 type-heading-sm whitespace-nowrap lg:px-5 lg:type-item ${colors.item}`}>
          {name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={className} data-paused={paused}>
      <div className="flex flex-col gap-8">
        {rows.map((row, i) => (
          <div
            key={i}
            className="marquee h-14 [--marquee-gap:32px] lg:h-[72px] lg:[--marquee-gap:48px]"
            data-direction={row.direction}
          >
            <span aria-hidden="true" className={`marquee-line ${colors.line}`} data-a={i === 0 ? "marquee-line" : undefined} />
            <div className="marquee-track">
              {list(row.items, false)}
              {list(row.items, true)}
            </div>
          </div>
        ))}
      </div>
      <div className={`mt-6 motion-reduce:hidden ${controlClassName ?? ""}`}>
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
