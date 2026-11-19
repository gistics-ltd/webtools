import { statSync } from "node:fs";
import path from "node:path";

export function versionedPublicAsset(src: string) {
  if (!src.startsWith("/") || src.includes("?")) return src;

  try {
    const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    const { mtimeMs } = statSync(filePath);
    return `${src}?v=${Math.round(mtimeMs)}`;
  } catch {
    return src;
  }
}
