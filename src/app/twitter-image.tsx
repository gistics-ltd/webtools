import { OG_IMAGE_ALT } from "@/lib/seo";
import { ogSize, renderOgImage } from "@/components/seo/OgImage";

export const alt = OG_IMAGE_ALT;
export const size = ogSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderOgImage();
}
