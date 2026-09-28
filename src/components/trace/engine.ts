import { lengthAtY, type Polyline } from "./geometry";

/** The pen sits at 72% of the viewport: a trace is drawn up to that line as the page scrolls. */
const PEN = 0.72;
/** Easing towards the target on every frame (ease-in-out feel without a fixed duration). */
const FOLLOW = 0.16;

export type TraceVia = {
  el: SVGCircleElement;
  /** Length along the trace where the via sits. */
  at: number;
  /** Via position inside the section. */
  y: number;
  live: boolean;
};

export type ScrollTrace = {
  section: HTMLElement;
  path: SVGPathElement | null;
  line: Polyline | null;
  /** "scroll" follows the pen; "reveal" draws completely once the pen passes the start. */
  mode: "scroll" | "reveal";
  drawn: number;
  vias: TraceVia[];
};

const traces = new Set<ScrollTrace>();
let frame = 0;
let listening = false;

function tick() {
  frame = 0;
  const pen = window.innerHeight * PEN;
  const list = [...traces];
  const tops = list.map((t) => t.section.getBoundingClientRect().top);
  let moving = false;

  list.forEach((trace, i) => {
    const y = pen - tops[i];
    const { line } = trace;
    let target = 0;
    if (line) target = trace.mode === "reveal" ? (y >= line.pts[0][1] ? line.total : 0) : lengthAtY(line, y);

    let drawn = trace.drawn + (target - trace.drawn) * FOLLOW;
    if (Math.abs(target - drawn) < 0.5) drawn = target;
    else moving = true;

    if (trace.path && line && (drawn !== trace.drawn || !trace.path.hasAttribute("data-live"))) {
      trace.path.style.strokeDashoffset = String(line.total - drawn);
      trace.path.setAttribute("data-live", "");
    }
    trace.drawn = drawn;

    for (const via of trace.vias) {
      const live = y >= via.y - 0.5 && (!line || drawn >= via.at - 0.5);
      if (live !== via.live) {
        via.live = live;
        via.el.classList.toggle("is-live", live);
      }
    }
  });

  if (moving) frame = requestAnimationFrame(tick);
}

function kick() {
  if (!frame) frame = requestAnimationFrame(tick);
}

export function registerTrace(trace: ScrollTrace): () => void {
  traces.add(trace);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
  }
  kick();
  return () => {
    traces.delete(trace);
  };
}
