import type { ViaVariant } from "@/components/ui/Via";
import type { Pt } from "./geometry";

/*
 * Each section describes its part of the circuit from the real position of its content
 * (elements marked with data-a="…"), following the Figma frames "Landing v2 — Desktop 1440"
 * and "Landing v2 — Mobile 375". Colours follow the surface: lime on navy/black, black on lime,
 * navy on white.
 */

export type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  cx: number;
  cy: number;
};

export type Found = { el: HTMLElement; box: Box };

export type Measure = {
  /** Section size. */
  w: number;
  h: number;
  desktop: boolean;
  one(selector: string): Box | null;
  all(selector: string): Found[];
};

export type Tone = "lime" | "ink" | "navy";

export type TracePathSpec = {
  pts: Pt[];
  tone: Tone;
  /** scroll: drawn with the pen · reveal: drawn whole once reached · load: drawn on page load. */
  mode: "scroll" | "reveal" | "load";
  group?: string;
  /** Load mode timing, in ms. Without a delay, a load trace starts when an earlier one reaches its start. */
  delay?: number;
  dur?: number;
};

export type TraceViaSpec = { x: number; y: number; variant: ViaVariant; group?: string };

export type TraceSpec = {
  paths: TracePathSpec[];
  vias: TraceViaSpec[];
  /** Content revealed when a load-mode trace reaches the given point. */
  cues?: { el: HTMLElement; at: Pt }[];
};

// Rails — keep in sync with the px-rail-* / px-wrap utilities in globals.css.
const mobilePad = (w: number) => Math.max(48, (w - 576) / 2);
const railLeft = (w: number) => mobilePad(w) - 27.5;
const railRight = (w: number) => w - railLeft(w);
const wrapPad = (w: number) => Math.max(88, (w - 1200) / 2);
const deskRail = (w: number) => wrapPad(w) - 56;
const deskBus = (w: number) => w - wrapPad(w) - 340;

/** Hero bus timing: drawn in 1000ms after a short pause. */
const BUS_DELAY = 200;
const BUS_DURATION = 1000;

function hero(m: Measure): TraceSpec | null {
  const band = m.one('[data-a="band"]');
  const items = m.all('[data-a="featured-item"]');
  if (!band) return null;
  // Links sit on their first line (24px); the SGM chip on its centre.
  const lineY = ({ el, box }: Found) => (el.hasAttribute("data-center") ? box.cy : box.top + 12);

  if (m.desktop) {
    const featured = m.one('[data-a="featured"]');
    const label = m.one('[data-a="featured-label"]');
    if (!featured || !label) return null;
    const bus = featured.left - 64;
    const y0 = label.cy;
    const stubEnd = featured.left - 32;
    return {
      paths: [
        { pts: [[bus, y0], [bus, band.top]], tone: "ink", mode: "load", delay: BUS_DELAY, dur: BUS_DURATION },
        { pts: [[bus, band.top], [bus, band.bottom]], tone: "lime", mode: "load", delay: BUS_DELAY + BUS_DURATION, dur: 250 },
        ...items.map((it): TracePathSpec => {
          const y = lineY(it);
          // No delay: starts when the bus reaches it.
          return { pts: [[bus, y], [stubEnd, y]], tone: "ink", mode: "load", dur: 120 };
        }),
      ],
      vias: [
        { x: bus, y: y0, variant: "lime" },
        ...items.map((it): TraceViaSpec => ({ x: featured.left - 24, y: lineY(it), variant: "lime" })),
        { x: bus, y: band.top, variant: "lime" },
      ],
      cues: items.map((it) => ({ el: it.el, at: [featured.left - 24, lineY(it)] as Pt })),
    };
  }

  const x = railLeft(m.w);
  const eyebrow = m.one('[data-a="eyebrow"]');
  return {
    paths: [
      { pts: [[x, 0], [x, band.top]], tone: "ink", mode: "load", delay: BUS_DELAY, dur: BUS_DURATION },
      { pts: [[x, band.top], [x, band.bottom]], tone: "lime", mode: "load", delay: BUS_DELAY + BUS_DURATION, dur: 250 },
    ],
    vias: [
      ...(eyebrow ? [{ x, y: eyebrow.cy, variant: "lime" as const }] : []),
      ...items.map((it): TraceViaSpec => ({ x, y: lineY(it), variant: "lime" })),
    ],
    cues: items.map((it) => ({ el: it.el, at: [x, lineY(it)] as Pt })),
  };
}

function services(m: Measure): TraceSpec | null {
  const chip = m.one('[data-a="chip"]');
  const zone = (id: string) => m.one(`[data-zone-box="${id}"]`);
  if (!chip) return null;

  if (m.desktop) {
    const head = m.one('[data-a="services-head"]');
    const hw = zone("hardware");
    const sw = zone("software");
    const ex = zone("experts");
    const rows = m.all('[data-a="row-via"]');
    if (!head || !hw || !sw || !ex || !rows.length) return null;
    const x = deskRail(m.w);
    const bus = deskBus(m.w);
    const branch = head.top - 52;
    const hwY = hw.top + 40;
    const exY = ex.top + 40;
    const exBus = rows[0].box.cx;
    return {
      paths: [
        { pts: [[bus, 0], [bus, sw.top]], tone: "lime", mode: "scroll", group: "software" },
        { pts: [[bus, branch], [x + 24, branch], [x, branch + 24], [x, m.h]], tone: "lime", mode: "scroll" },
        { pts: [[x, hwY], [hw.left, hwY]], tone: "lime", mode: "scroll", group: "hardware" },
        {
          pts: [[x, exY], [exBus - 24, exY], [exBus, exY + 24], [exBus, rows[rows.length - 1].box.cy]],
          tone: "lime",
          mode: "scroll",
          group: "experts",
        },
        // Ends at the notch on the chip's left edge.
        { pts: [[x, chip.cy], [chip.left - 14, chip.cy]], tone: "lime", mode: "scroll" },
      ],
      vias: [
        { x: bus, y: branch, variant: "navy" },
        { x: bus, y: sw.top, variant: "navy", group: "software" },
        { x, y: hwY, variant: "navy" },
        { x: hw.left, y: hwY, variant: "navy", group: "hardware" },
        { x, y: exY, variant: "navy" },
        ...rows.map(({ box }): TraceViaSpec => ({ x: box.cx, y: box.cy, variant: "navy", group: "experts" })),
        { x, y: chip.cy, variant: "navy" },
      ],
    };
  }

  // Mobile: the rail crosses from the left to the right edge with 45° chamfers.
  const l = railLeft(m.w);
  const r = railRight(m.w);
  // Zones hidden by the category filter collapse and lose their via.
  const zones = m
    .all("[data-zone-box]")
    .filter(({ el }) => !el.closest('[data-open="false"]'))
    .map(({ el, box }) => ({ id: el.dataset.zoneBox, box }));
  return {
    paths: [{ pts: [[l, 0], [l, 16], [l + 16, 32], [r - 16, 32], [r, 48], [r, m.h]], tone: "lime", mode: "scroll" }],
    vias: [
      { x: r, y: 48, variant: "navy" },
      ...zones.map((z): TraceViaSpec => ({ x: r, y: z.box.top + 32, variant: "navy", group: z.id })),
      { x: r, y: chip.cy, variant: "navy" },
    ],
  };
}

function brands(m: Measure): TraceSpec | null {
  const line = m.one('[data-a="marquee-line"]');
  if (!line) return null;
  const x = m.desktop ? deskRail(m.w) : railRight(m.w);
  return {
    paths: [{ pts: [[x, 0], [x, line.cy]], tone: "ink", mode: "scroll" }],
    vias: [{ x, y: line.cy, variant: "lime" }],
  };
}

function clients(m: Measure): TraceSpec | null {
  const line = m.one('[data-a="marquee-line"]');
  if (!line) return null;
  if (m.desktop) return { paths: [], vias: [{ x: wrapPad(m.w) - 33, y: line.cy, variant: "white" }] };
  const x = railRight(m.w);
  return {
    paths: [{ pts: [[x, line.cy], [x, m.h]], tone: "navy", mode: "scroll" }],
    vias: [{ x, y: line.cy, variant: "white" }],
  };
}

function contact(m: Measure): TraceSpec | null {
  const button = m.one('[data-a="submit"]');
  const info = m.one('[data-a="contact-info"]');
  if (!button || !info) return null;

  if (m.desktop) {
    const x = deskRail(m.w);
    const y = m.h - 56;
    const split = m.w / 2;
    const bx = button.left;
    return {
      paths: [
        { pts: [[x, 0], [x, y], [split, y]], tone: "lime", mode: "scroll" },
        // Climbs to "Enviar consulta": the circuit ends at the form's action.
        {
          pts: [[split, y], [bx - 40, y], [bx - 16, y - 24], [bx - 16, button.cy + 24], [bx - 8, button.cy]],
          tone: "ink",
          mode: "reveal",
        },
      ],
      vias: [{ x: bx - 8, y: button.cy, variant: "lime" }],
    };
  }

  const l = railLeft(m.w);
  const r = railRight(m.w);
  return {
    paths: [
      { pts: [[r, 0], [r, 16], [r - 16, 32], [l + 16, 32], [l, 48], [l, info.bottom]], tone: "lime", mode: "scroll" },
      { pts: [[l, info.bottom], [l, button.cy], [button.left, button.cy]], tone: "ink", mode: "scroll" },
    ],
    vias: [
      { x: l, y: 48, variant: "navy" },
      { x: l, y: button.cy, variant: "lime" },
    ],
  };
}

export const builders = { hero, services, brands, clients, contact };

export type TraceName = keyof typeof builders;
