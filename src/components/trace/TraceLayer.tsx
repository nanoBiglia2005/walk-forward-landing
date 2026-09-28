"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { ViaVariant } from "@/components/ui/Via";
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/lib/media";
import { builders, type Box, type Found, type Measure, type TraceName, type Tone } from "./builders";
import { registerTrace, type ScrollTrace, type TraceVia } from "./engine";
import { easeInOutTimeAt, polyline, project, toPathD, type Polyline, type Pt } from "./geometry";

type LaidPath = {
  d: string;
  line: Polyline;
  tone: Tone;
  mode: "scroll" | "reveal" | "load";
  group?: string;
  delay: number;
  dur: number;
};

type LaidVia = {
  x: number;
  y: number;
  variant: ViaVariant;
  group?: string;
  /** Index of the trace the via sits on, if any. */
  path: number | null;
  at: number;
  /** For load-mode traces: when the trace reaches the via. */
  ms: number;
};

type Layout = {
  key: string;
  w: number;
  h: number;
  paths: LaidPath[];
  vias: LaidVia[];
  cues: { el: HTMLElement; ms: number }[];
};

/** A via counts as "on" a trace up to its radius past the trace end. */
const VIA_REACH = 9;

/** Ask the traces to re-measure after a layout change that does not resize their section. */
export function requestTraceRefresh() {
  window.dispatchEvent(new Event("trace:refresh"));
}

/** Position of `el` inside `section`, ignoring transforms (entrance animations must not bend the traces). */
function locate(section: HTMLElement, el: HTMLElement): Box | null {
  if (!el.offsetParent) return null;
  let left = 0;
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== section) {
    left += node.offsetLeft;
    top += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (parent && parent !== section) {
      left += parent.clientLeft;
      top += parent.clientTop;
    }
    node = parent;
  }
  if (node !== section) return null;
  const width = el.offsetWidth;
  const height = el.offsetHeight;
  return { left, top, width, height, right: left + width, bottom: top + height, cx: left + width / 2, cy: top + height / 2 };
}

function measure(section: HTMLElement, desktop: boolean): Measure {
  const all = (selector: string) =>
    [...section.querySelectorAll<HTMLElement>(selector)]
      .map((el) => ({ el, box: locate(section, el) }))
      .filter((f): f is Found => f.box !== null);
  return { w: section.clientWidth, h: section.offsetHeight, desktop, one: (s) => all(s)[0]?.box ?? null, all };
}

function layoutFor(name: TraceName, section: HTMLElement, desktop: boolean): Layout | null {
  const m = measure(section, desktop);
  const spec = builders[name](m);
  if (!spec) return null;

  const paths: LaidPath[] = [];
  const attach = (q: Pt) => {
    let best: { path: number; at: number; distance: number } | null = null;
    paths.forEach((p, i) => {
      const { distance, at } = project(p.line, q);
      if (distance <= VIA_REACH && (!best || distance < best.distance - 0.01)) best = { path: i, at, distance };
    });
    return best as { path: number; at: number; distance: number } | null;
  };
  const timeAt = (p: LaidPath, at: number) => p.delay + p.dur * easeInOutTimeAt(p.line.total ? at / p.line.total : 1);
  const timeAtPoint = (q: Pt) => {
    const hit = attach(q);
    return hit && paths[hit.path].mode === "load" ? timeAt(paths[hit.path], hit.at) : 0;
  };

  for (const p of spec.paths) {
    const delay = p.mode === "load" && p.delay === undefined ? timeAtPoint(p.pts[0]) : (p.delay ?? 0);
    paths.push({ d: toPathD(p.pts), line: polyline(p.pts), tone: p.tone, mode: p.mode, group: p.group, delay, dur: p.dur ?? 0 });
  }

  const vias = spec.vias.map((v): LaidVia => {
    const hit = attach([v.x, v.y]);
    const on = hit ? paths[hit.path] : null;
    return { ...v, path: hit?.path ?? null, at: hit?.at ?? 0, ms: on?.mode === "load" ? timeAt(on, hit!.at) : 0 };
  });

  const cues = (spec.cues ?? []).map(({ el, at }) => ({ el, ms: Math.round(timeAtPoint(at)) }));
  const key = [m.w, m.h, ...paths.map((p) => p.d), ...vias.map((v) => `${v.x},${v.y}`)].join("|");
  return { key, w: m.w, h: m.h, paths, vias, cues };
}

/** Circuit traces of one section. Must be a direct child of a `position: relative` section. */
export function TraceLayer({ name }: { name: TraceName }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const drawn = useRef<number[]>([]);

  useEffect(() => {
    const section = svgRef.current?.parentElement;
    if (!section) return;
    const desktop = matchMedia(DESKTOP_QUERY);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = layoutFor(name, section, desktop.matches);
        setLayout((prev) => (prev?.key === next?.key ? prev : next));
      });
    };
    const resize = new ResizeObserver(update);
    resize.observe(section);
    section.querySelectorAll("[data-a]").forEach((el) => resize.observe(el));
    desktop.addEventListener("change", update);
    window.addEventListener("trace:refresh", update);
    document.fonts?.ready.then(update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      desktop.removeEventListener("change", update);
      window.removeEventListener("trace:refresh", update);
    };
  }, [name]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    const section = svg?.parentElement;
    if (!layout || !svg || !section) return;

    for (const { el, ms } of layout.cues) {
      el.style.setProperty("--cue", `${ms}ms`);
      el.classList.add("is-cued");
    }
    if (matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const progress = drawn.current;
    const pathEls = svg.querySelectorAll<SVGPathElement>("path");
    const circles = svg.querySelectorAll<SVGCircleElement>("circle");
    const viasOn = (index: number | null): TraceVia[] =>
      layout.vias.flatMap((v, j) => (v.path === index ? [{ el: circles[j], at: v.at, y: v.y, live: false }] : []));

    const registered: { trace: ScrollTrace; index: number; unregister: () => void }[] = [];
    layout.paths.forEach((p, index) => {
      if (p.mode === "load") return;
      const trace: ScrollTrace = {
        section,
        path: pathEls[index],
        line: p.line,
        mode: p.mode,
        drawn: progress[index] ?? 0,
        vias: viasOn(index),
      };
      registered.push({ trace, index, unregister: registerTrace(trace) });
    });
    const loose = viasOn(null);
    if (loose.length) {
      const trace: ScrollTrace = { section, path: null, line: null, mode: "scroll", drawn: 0, vias: loose };
      registered.push({ trace, index: -1, unregister: registerTrace(trace) });
    }

    return () => {
      for (const { trace, index, unregister } of registered) {
        if (index >= 0) progress[index] = trace.drawn;
        unregister();
      }
    };
  }, [layout]);

  return (
    <svg
      ref={svgRef}
      className="trace"
      width={layout?.w ?? 0}
      height={layout?.h ?? 0}
      aria-hidden="true"
      focusable="false"
    >
      {layout?.paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          className={`trace-path tone-${p.tone} mode-${p.mode}`}
          data-group={p.group}
          pathLength={p.mode === "load" ? 1 : undefined}
          style={
            p.mode === "load"
              ? ({ "--delay": `${Math.round(p.delay)}ms`, "--dur": `${p.dur}ms` } as CSSProperties)
              : { strokeDasharray: p.line.total }
          }
        />
      ))}
      {layout?.vias.map((v, i) => {
        const load = v.path !== null && layout.paths[v.path].mode === "load";
        return (
          <circle
            key={i}
            cx={v.x}
            cy={v.y}
            r={6}
            className={`via via-${v.variant} ${load ? "via-load" : "via-scroll"}`}
            data-group={v.group}
            style={load ? ({ "--at": `${Math.round(v.ms)}ms` } as CSSProperties) : undefined}
          />
        );
      })}
    </svg>
  );
}
