"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { TraceLayer } from "@/components/trace/TraceLayer";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Via } from "@/components/ui/Via";
import { links, services, servicesSection, sgm, type Category, type Service } from "@/content/site";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/lib/media";

type Filter = "all" | Category;

const zones: { id: Category; label: string }[] = [
  { id: "hardware", label: "Hardware" },
  { id: "software", label: "Software" },
  { id: "experts", label: "Servicios expertos TIC" },
];

export function Services() {
  const [filter, setFilter] = useState<Filter>("all");
  // Mobile accordion: one service open at a time in the whole board, the first one by default.
  const [openId, setOpenId] = useState<string | null>(services[0].id);

  // Hero links scroll to a service; on mobile they also open it.
  useEffect(() => {
    const desktop = matchMedia(DESKTOP_QUERY);
    const reducedMotion = matchMedia(REDUCED_MOTION_QUERY);
    let timer = 0;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#servicio-"]');
      const service = link && services.find((s) => link.getAttribute("href") === `#servicio-${s.id}`);
      if (!service) return;
      setFilter((f) => (f === "all" || f === service.category ? f : "all"));
      if (desktop.matches) return;
      event.preventDefault();
      setOpenId(service.id);
      // Wait for the previously open service to collapse (300ms) so the target does not move while scrolling.
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document
          .getElementById(`servicio-${service.id}`)
          ?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      }, 320);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      window.clearTimeout(timer);
    };
  }, []);

  const item = (service: Service, index: number, layout: "stack" | "row") => (
    <ServiceItem
      key={service.id}
      service={service}
      index={index}
      layout={layout}
      open={openId === service.id}
      onToggle={() => setOpenId((id) => (id === service.id ? null : service.id))}
    />
  );
  const inZone = (id: Category) => services.filter((s) => s.category === id);
  const zoneOpen = (id: Category) => filter === "all" || filter === id;

  return (
    <section id="servicios" data-filter={filter} className="relative bg-navy text-white [--ring:var(--color-lime)]">
      <div className="flex flex-col px-rail-r pt-24 pb-16 lg:gap-16 lg:px-wrap lg:pt-[136px] lg:pb-40">
        {/* On desktop the bus coming from the hero runs to the right of the heading. */}
        <div data-a="services-head" className="flex flex-col gap-6 lg:max-w-[calc(100%-380px)] lg:gap-8">
          <h2 className="type-section lg:max-w-[760px]">{servicesSection.title}</h2>
          <fieldset className="min-w-0">
            <legend className="sr-only">{servicesSection.filtersLabel}</legend>
            <div className="-m-[5px] flex gap-2 overflow-x-auto p-[5px] [scrollbar-width:none] lg:gap-3 lg:overflow-visible">
              {servicesSection.categories.map((category) => (
                <label key={category.id} className="shrink-0 cursor-pointer">
                  <input
                    type="radio"
                    name="categoria"
                    value={category.id}
                    checked={filter === category.id}
                    onChange={() => setFilter(category.id)}
                    className="peer sr-only sr-focus"
                  />
                  <span className="block border-2 border-white/40 px-6 py-3 type-strong whitespace-nowrap transition-colors duration-200 ease-io hover:border-white peer-checked:border-lime peer-checked:bg-lime peer-checked:text-black">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-6">
          {zones.slice(0, 2).map((zone) => (
            <Zone key={zone.id} id={zone.id} label={zone.label} open={zoneOpen(zone.id)}>
              {inZone(zone.id).map((s, i) => item(s, i, "stack"))}
            </Zone>
          ))}
        </div>
        <Zone id="experts" label={zones[2].label} open={zoneOpen("experts")}>
          {inZone("experts").map((s, i) => item(s, i, "row"))}
        </Zone>

        <SgmChip />
      </div>
      <TraceLayer name="services" />
    </section>
  );
}

function Zone({ id, label, open, children }: { id: Category; label: string; open: boolean; children: ReactNode }) {
  return (
    <div className="collapse" data-open={open} data-zone={id}>
      <div className="pt-12 lg:h-full lg:pt-0">
        <div data-zone-box={id} data-reveal="" className="relative px-5 pt-7 pb-2 lg:h-full lg:p-12">
          {/* Silkscreen outline of the zone, drawn on entry. */}
          <svg className="zone-outline absolute inset-0 size-full" aria-hidden="true" focusable="false">
            <rect width="100%" height="100%" fill="none" stroke="var(--color-navy-600)" strokeWidth="2" strokeDasharray="4 4" />
          </svg>
          <h3 className="absolute -top-2.5 left-4 bg-navy px-2 type-strong text-lime lg:left-10">{label}</h3>
          <div className="relative">{children}</div>
        </div>
      </div>
    </div>
  );
}

type ServiceItemProps = {
  service: Service;
  index: number;
  layout: "stack" | "row";
  open: boolean;
  onToggle: () => void;
};

/** One markup for both layouts: accordion on mobile, open board item (stack or row) on desktop. */
function ServiceItem({ service, index, layout, open, onToggle }: ServiceItemProps) {
  const textId = `servicio-${service.id}-texto`;
  const row = layout === "row";
  return (
    <article
      id={`servicio-${service.id}`}
      data-row=""
      style={{ "--i": index } as CSSProperties}
      className={[
        "scroll-mt-20 border-navy-700 not-first:border-t",
        row ? "lg:flex lg:gap-8 lg:py-8" : "lg:flex lg:flex-col lg:gap-6",
      ].join(" ")}
    >
      {row && <span data-a="row-via" aria-hidden="true" className="hidden h-[29px] w-4 shrink-0 lg:block" />}
      {!row && <Icon name={service.icon} className="hidden size-10 text-lime lg:block" />}
      <h4 className={row ? "lg:w-[380px] lg:shrink-0" : undefined}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={textId}
          onClick={onToggle}
          className="flex w-full items-center gap-3 py-4 text-left lg:hidden"
        >
          <Icon name={service.icon} className="size-7 shrink-0 text-lime" />
          <span className="flex-1 type-heading-sm">{service.title}</span>
          <Icon
            name="chevronDown"
            className={`size-5 shrink-0 transition-[rotate,color] duration-200 ease-io ${open ? "rotate-180 text-lime" : "text-white/70"}`}
          />
        </button>
        <span className={`hidden lg:block ${row ? "type-heading" : "type-item"}`}>{service.title}</span>
      </h4>
      <div id={textId} className={`collapse ${row ? "lg:min-w-0 lg:flex-1" : ""}`} data-open={open}>
        <div>
          <div className="flex flex-col gap-3 pb-5 pl-10 type-body text-white/70 lg:p-0 lg:type-lead">
            {service.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function SgmChip() {
  return (
    <div
      id="sgm"
      data-a="chip"
      data-reveal=""
      className="relative mt-12 scroll-mt-24 bg-black px-6 py-10 lg:mt-0 lg:flex lg:items-center lg:gap-16 lg:p-16"
    >
      <span aria-hidden="true" className="pins pins-top" />
      <span aria-hidden="true" className="pins pins-bottom" />
      {/* Orientation notch where the rail meets the chip. */}
      <span aria-hidden="true" className="absolute top-1/2 -left-3.5 hidden size-7 -translate-y-1/2 rounded-full bg-navy lg:block" />
      <div className="flex flex-col gap-6 lg:min-w-0 lg:flex-1">
        <p className="type-strong text-lime">{sgm.eyebrow}</p>
        <h3 className="type-section">{sgm.title}</h3>
        <p className="type-body text-white/80 lg:type-subheading">{sgm.description}</p>
        <ul className="flex flex-col gap-6 lg:gap-3">
          {sgm.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 lg:items-center">
              <Via variant="navy" className="mt-1 lg:mt-0" />
              <span className="type-body">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button
          href={links.sgm}
          variant="lime"
          icon="externalLink"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full lg:w-auto lg:self-start"
        >
          {sgm.cta}
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </Button>
      </div>
      <p aria-hidden="true" className="hidden shrink-0 select-none type-wordmark text-white/5 lg:block">
        SGM
      </p>
    </div>
  );
}
