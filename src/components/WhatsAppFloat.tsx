import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { links } from "@/content/site";

/** v2/WhatsApp Button: appears 400ms after load and expands with its label on hover (300ms). */
export function WhatsAppFloat() {
  return (
    <a
      href={links.whatsapp ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="rise group fixed right-4 bottom-4 z-40 flex h-[60px] items-center rounded-full border-2 border-lime bg-black text-lime shadow-[0_4px_4px_-4px_rgb(12_12_13/0.05),0_16px_32px_-4px_rgb(12_12_13/0.1)] [--ring:var(--color-lime)] lg:right-8 lg:bottom-8"
      style={{ "--i": 4 } as CSSProperties}
    >
      <span className="grid size-14 place-content-center">
        <Icon name="whatsapp" className="size-7" />
      </span>
      <span className="max-w-0 overflow-hidden type-strong whitespace-nowrap transition-[max-width,padding] duration-300 ease-io group-hover:max-w-32 group-hover:pr-6 group-focus-visible:max-w-32 group-focus-visible:pr-6">
        WhatsApp
      </span>
    </a>
  );
}
