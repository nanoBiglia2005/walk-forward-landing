import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Icon } from "./Icon";
import type { IconName } from "./icon-paths";

type Variant = "ink" | "lime" | "outline-ink" | "outline-light";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  ink: "bg-black text-lime hover:bg-navy",
  lime: "bg-lime text-black hover:bg-lime-400",
  "outline-ink": "border-2 border-black text-black hover:bg-[rgb(12_12_13/0.05)]",
  "outline-light": "border-2 border-white text-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  md: "px-8 py-[18px]",
  sm: "px-8 py-3",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  children: ReactNode;
  className?: string;
};

type AsLink = Common &
  Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "className"> & {
    /** `null` renders the button without a destination (e.g. WhatsApp until the link is enabled). */
    href: string | null;
  };

type AsButton = Common &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className"> & {
    href?: undefined;
  };

/** v2/Button: square corners; hover changes the background and underlines the label (200ms). */
export function Button(props: AsLink | AsButton) {
  const { variant = "ink", size = "md", icon, children, className, ...rest } = props;
  const classes = [
    "btn inline-flex items-center justify-center gap-3 type-strong whitespace-nowrap",
    "transition-colors duration-200 ease-io",
    "disabled:cursor-not-allowed disabled:opacity-35",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");
  const content = (
    <>
      {icon && <Icon name={icon} className="size-5 shrink-0" />}
      <span className="btn-label">{children}</span>
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchor } = rest as Omit<AsLink, keyof Common>;
    return (
      <a {...anchor} href={href ?? undefined} className={classes}>
        {content}
      </a>
    );
  }

  const { type = "button", ...button } = rest as Omit<AsButton, keyof Common>;
  return (
    <button {...button} type={type} className={classes}>
      {content}
    </button>
  );
}
