import type { CSSProperties } from "react";
import { TraceLayer } from "@/components/trace/TraceLayer";
import { Button } from "@/components/ui/Button";
import { Via } from "@/components/ui/Via";
import { hero, links, services, sgm } from "@/content/site";

const stagger = (i: number) => ({ "--i": i }) as CSSProperties;

export function Hero() {
  return (
    <section id="inicio" className="relative bg-lime [--ring:#000]">
      <div className="grid gap-12 px-rail-l pt-12 pb-16 lg:grid-cols-[minmax(0,780px)_276px] lg:justify-between lg:gap-x-24 lg:px-wrap lg:py-[104px]">
        <div className="flex flex-col gap-6 lg:gap-8">
          <p data-a="eyebrow" className="rise flex items-center gap-3 type-strong" style={stagger(0)}>
            <Via className="hidden lg:block" />
            <span aria-hidden="true" className="hidden h-[3px] w-10 bg-black lg:block" />
            {hero.eyebrow}
          </p>
          <h1 className="rise type-display" style={stagger(1)}>
            {hero.title}
          </h1>
          <p className="rise type-body lg:max-w-[600px] lg:type-lead" style={stagger(2)}>
            {hero.description}
          </p>
          <div className="rise flex flex-col gap-3 lg:flex-row lg:gap-4" style={stagger(3)}>
            <Button href={links.whatsapp} icon="whatsapp" target="_blank" rel="noopener noreferrer">
              {hero.whatsappCta}
            </Button>
            <Button href="#servicios" variant="outline-ink">
              {hero.servicesCta}
            </Button>
          </div>
        </div>

        <nav aria-labelledby="destacados" data-a="featured" className="flex flex-col gap-4 lg:self-start">
          <p id="destacados" data-a="featured-label" className="type-strong-sm">
            {hero.featuredLabel}
          </p>
          <ul className="flex flex-col gap-4">
            {services.map((service) => (
              <li key={service.id}>
                <a href={`#servicio-${service.id}`} data-a="featured-item" data-cue="" className="link-underline block type-body">
                  {service.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#sgm"
                data-a="featured-item"
                data-center=""
                data-cue=""
                className="btn inline-flex bg-black px-3 py-2 type-strong text-lime [--ring:#000]"
              >
                <span className="btn-label">{sgm.title}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <ul
        data-a="band"
        aria-label="Datos destacados"
        className="bg-black px-rail-l py-2 text-lime lg:grid lg:h-40 lg:grid-cols-[42fr_44fr_340px] lg:px-wrap lg:py-0"
      >
        {hero.highlights.map((text, i) => (
          <li
            key={text}
            className={[
              "relative flex items-center py-5 type-heading-sm lg:py-0 lg:type-heading",
              i > 0 ? "border-t-2 border-lime lg:border-t-0 lg:pl-10" : "",
              i === 1 ? "lg:before:absolute lg:before:inset-y-0 lg:before:-left-[1.5px] lg:before:w-[3px] lg:before:bg-lime" : "",
            ].join(" ")}
          >
            <span className={["block", ["lg:max-w-[380px]", "lg:max-w-[360px]", "lg:max-w-[300px]"][i]].join(" ")}>{text}</span>
          </li>
        ))}
      </ul>

      <TraceLayer name="hero" />
    </section>
  );
}
