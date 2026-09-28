import { TraceLayer } from "@/components/trace/TraceLayer";
import { Icon } from "@/components/ui/Icon";
import { Via } from "@/components/ui/Via";
import { contact, links } from "@/content/site";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative lg:bg-[linear-gradient(to_right,var(--color-navy)_50%,var(--color-lime)_50%)]"
    >
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-40 lg:px-wrap lg:py-[120px]">
        <div
          data-a="contact-info"
          className="flex flex-col gap-8 bg-navy px-rail-l pt-24 pb-16 text-white [--ring:var(--color-lime)] lg:gap-12 lg:bg-transparent lg:p-0"
        >
          <h2 className="type-section">{contact.title}</h2>
          <p className="type-body text-white/70 lg:type-lead">{contact.description}</p>
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 lg:gap-3">
              <Icon name="whatsapp" className="size-6 shrink-0 text-lime lg:size-8" />
              <span className="type-heading whitespace-nowrap lg:type-title">{contact.whatsappNumber}</span>
            </p>
            <p className="type-body text-white/70">{contact.whatsappNote}</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="type-strong-block">{contact.officeLabel}</h3>
            <address className="type-body text-white/70 not-italic">{contact.office}</address>
          </div>
          <div className="relative h-[200px] lg:h-[280px]">
            <svg className="absolute inset-0 size-full" aria-hidden="true" focusable="false">
              <rect width="100%" height="100%" fill="none" stroke="var(--color-navy-600)" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <Via variant="navy" size={24} />
              <p className="type-strong-sm text-white/70">{contact.officeShort}</p>
            </div>
            <iframe
              src={links.map}
              title={`Mapa de la oficina: ${contact.officeShort}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-px h-[calc(100%-2px)] w-[calc(100%-2px)] border-0 grayscale"
            />
          </div>
        </div>

        <div data-a="contact-form" className="bg-lime px-rail-l py-16 [--ring:#000] lg:bg-transparent lg:p-0">
          <ContactForm />
        </div>
      </div>
      <TraceLayer name="contact" />
    </section>
  );
}
