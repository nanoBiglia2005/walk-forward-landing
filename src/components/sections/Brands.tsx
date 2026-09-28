import { TraceLayer } from "@/components/trace/TraceLayer";
import { brands } from "@/content/site";
import { MarqueeGroup } from "./MarqueeGroup";

export function Brands() {
  return (
    <section id="marcas" className="relative bg-lime px-plain py-16 [--ring:#000] lg:px-0 lg:pt-28 lg:pb-[68px]">
      <div className="lg:px-wrap">
        <h2 className="pr-8 type-heading lg:max-w-[760px] lg:pr-0 lg:type-title">{brands.title}</h2>
      </div>
      <MarqueeGroup
        label="marcas"
        tone="brands"
        rows={[
          { items: brands.rows[0], direction: "left" },
          { items: brands.rows[1], direction: "right" },
        ]}
        className="mt-8 lg:mt-[72px]"
        controlClassName="lg:px-wrap"
      />
      <TraceLayer name="brands" />
    </section>
  );
}
