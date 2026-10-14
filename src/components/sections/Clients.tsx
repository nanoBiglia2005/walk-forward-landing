import { clients } from "@/content/site";
import { withLogoSizes } from "@/lib/logo-size";
import { MarqueeGroup } from "./MarqueeGroup";

// No circuit trace here: on desktop the clients are fixed rows and on mobile the contact trace
// enters from its own top edge.
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
        staticOnDesktop
        rows={[{ items: withLogoSizes(clients.items), direction: "left" }]}
        className="mt-6 lg:mt-10"
        controlClassName="pl-8 text-navy"
      />
    </section>
  );
}
