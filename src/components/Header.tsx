"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { links, nav } from "@/content/site";
import { DESKTOP_QUERY } from "@/lib/media";

const WHATSAPP_LABEL = "Consultar por WhatsApp";

/** v2/Header: fixed black bar that hides when scrolling down past 80px and returns when scrolling up. */
export function Header() {
  const [scrolledDown, setScrolledDown] = useState(false);
  const [active, setActive] = useState<string>(nav[0].href);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (Math.abs(y - last) < 4) return;
        setScrolledDown(y > 80 && y > last);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Scrollspy: the section crossing the middle of the viewport is the active link.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(`#${entry.target.id}`);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const { href } of nav) {
      const section = document.querySelector(href);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = matchMedia(DESKTOP_QUERY);
    const onDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const hidden = scrolledDown && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-black text-white transition-transform duration-300 ease-io [--ring:var(--color-lime)] ${hidden ? "-translate-y-full" : ""}`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 lg:px-wrap">
        <a href="#inicio" className="shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo width={88} className="h-auto w-[72px] lg:w-[88px]" />
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex gap-8">
            {nav.map(({ href, label }) => {
              const current = active === href;
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current || undefined}
                    className="group flex flex-col items-center gap-1.5 pt-2 type-body leading-none"
                  >
                    <span className={`transition-colors duration-200 ease-io ${current ? "text-white" : "text-white/70 group-hover:text-white"}`}>
                      {label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-0.5 w-full bg-lime transition-opacity duration-200 ease-io ${current ? "opacity-100" : "opacity-0"}`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href={links.whatsapp} variant="lime" size="sm" icon="whatsapp" target="_blank" rel="noopener noreferrer">
            {WHATSAPP_LABEL}
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu-movil"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid size-11 place-content-center bg-lime text-black lg:hidden"
        >
          <Icon name={menuOpen ? "x" : "menu"} className="size-[22px]" />
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-[65px] bottom-0 overflow-y-auto overscroll-contain bg-black px-4 pt-6 pb-10 lg:hidden"
      >
        <nav aria-label="Principal">
          <ul>
            {nav.map(({ href, label }, i) => (
              <li key={href} className="border-b border-white/20">
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  aria-current={active === href || undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-4 type-section ${active === href ? "text-lime" : "text-white"}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button href={links.whatsapp} variant="lime" icon="whatsapp" target="_blank" rel="noopener noreferrer" className="mt-8 w-full">
          {WHATSAPP_LABEL}
        </Button>
      </div>
    </header>
  );
}
