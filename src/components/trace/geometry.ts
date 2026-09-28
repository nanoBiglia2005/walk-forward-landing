export type Pt = readonly [number, number];

export type Polyline = {
  pts: readonly Pt[];
  /** Cumulative length at each point. */
  cum: number[];
  total: number;
};

export function polyline(pts: readonly Pt[]): Polyline {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return { pts, cum, total: cum[cum.length - 1] };
}

export function toPathD(pts: readonly Pt[]): string {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${round(x)} ${round(y)}`).join(" ");
}

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * Length drawn once the pen reaches `y`: segments going down follow the pen,
 * horizontal ones complete as soon as the pen passes them.
 */
export function lengthAtY(line: Polyline, y: number): number {
  const { pts, cum } = line;
  for (let i = 1; i < pts.length; i++) {
    const y0 = pts[i - 1][1];
    const y1 = pts[i][1];
    if (y1 > y0) {
      if (y < y1) return y <= y0 ? cum[i - 1] : cum[i - 1] + ((cum[i] - cum[i - 1]) * (y - y0)) / (y1 - y0);
    } else if (y < y0) {
      return cum[i - 1];
    }
  }
  return line.total;
}

/** Closest point of the polyline to `q`: its distance and the length along the line where it sits. */
export function project(line: Polyline, q: Pt): { distance: number; at: number } {
  let best = { distance: Infinity, at: 0 };
  for (let i = 1; i < line.pts.length; i++) {
    const [ax, ay] = line.pts[i - 1];
    const [bx, by] = line.pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, ((q[0] - ax) * dx + (q[1] - ay) * dy) / len2)) : 0;
    const distance = Math.hypot(q[0] - (ax + t * dx), q[1] - (ay + t * dy));
    if (distance < best.distance) best = { distance, at: line.cum[i - 1] + t * Math.sqrt(len2) };
  }
  return best;
}

/** Time fraction at which a cubic-bezier(0.42, 0, 0.58, 1) animation reaches `progress`. */
export function easeInOutTimeAt(progress: number): number {
  const p = Math.max(0, Math.min(1, progress));
  const bez = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bez(mid, 0, 1) < p) lo = mid;
    else hi = mid;
  }
  return bez((lo + hi) / 2, 0.42, 0.58);
}
