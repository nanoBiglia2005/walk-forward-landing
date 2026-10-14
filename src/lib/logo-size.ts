import { readFileSync } from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import type { Entity } from "@/content/site";

/** An entity whose logo carries its real size, so the carousel can reserve its final space. */
export type SizedEntity = Entity & { width?: number; height?: number };

/**
 * Real width and height of a file in `public/`, read at build time (server components only).
 * Fails the build when the file is missing or unreadable, so a wrong path is caught early.
 */
export function getLogoSize(publicPath: string): { width: number; height: number } {
  const file = path.join(process.cwd(), "public", publicPath);
  let size: { width?: number; height?: number };
  try {
    size = imageSize(readFileSync(file));
  } catch (error) {
    throw new Error(`Logo "${publicPath}" could not be read at ${file}`, { cause: error });
  }
  if (!size.width || !size.height) throw new Error(`Logo "${publicPath}" has no width/height`);
  return { width: size.width, height: size.height };
}

export function withLogoSizes(entities: readonly Entity[]): SizedEntity[] {
  return entities.map((entity) => (entity.logo ? { ...entity, ...getLogoSize(entity.logo) } : entity));
}
