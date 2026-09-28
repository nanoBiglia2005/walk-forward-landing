import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { footer, links, nav, sgm } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-black text-white [--ring:var(--color-lime)]">
      <div className="flex flex-col gap-8 px-plain pt-16 pb-5 lg:gap-12 lg:px-wrap lg:pt-24 lg:pb-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <p className="type-body text-white/80 lg:flex-1">{footer.tagline}</p>
          <nav aria-label="Secciones">
            <ul className="flex flex-col gap-3 type-body">
              {nav.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="link-underline">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <a href={links.sgm} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {sgm.title}
                  <span className="sr-only"> (se abre en otra pestaña)</span>
                </a>
              </li>
            </ul>
          </nav>
          <a
            href={links.arca}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 self-start lg:w-40 lg:flex-col lg:items-start lg:gap-3"
          >
            <Image src="/arca/data-fiscal.png" alt="" width={239} height={327} className="h-auto w-20 lg:w-24" />
            <span className="link-underline type-body-sm text-white/80">
              {footer.arcaLabel}
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-8 border-t border-white/20 pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:py-[18px]">
          <div className="flex flex-col gap-3 type-body-sm text-white/80 lg:max-w-[934px] lg:gap-0">
            {footer.legal.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Logo width={224} decorative className="h-auto w-[215px] self-center lg:w-[224px] lg:self-start" />
        </div>
      </div>
    </footer>
  );
}
