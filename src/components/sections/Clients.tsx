import { TraceLayer } from "@/components/trace/TraceLayer";
import { clients } from "@/content/site";
import { MarqueeGroup } from "./MarqueeGroup";

export function Clients() {
  return (
    <section id="clientes" className="relative bg-white px-plain py-16 [--ring:var(--color-navy-700)] lg:px-0 lg:pt-[88px] lg:pb-14">
      <div className="flex flex-col gap-4 pl-8 lg:items-center lg:px-wrap">
        <h2 className="type-section text-black lg:w-full lg:max-w-[526px]">{clients.title}</h2>
        <p className="type-body text-gray-700 lg:w-full lg:max-w-[417px] lg:type-lead">{clients.description}</p>
      </div>
      <MarqueeGroup
        label="clientes"
        tone="clients"
        rows={[{ items: clients.items, direction: "left" }]}
        className="mt-6 lg:mt-10"
        controlClassName="pl-8 text-navy lg:flex lg:justify-center lg:pl-0"
      />
      <TraceLayer name="clients" />
    </section>
  );
}
