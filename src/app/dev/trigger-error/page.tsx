import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Development-only error boundary test route. It is disabled in production and
 * is disallowed in robots.ts.
 */
export default function TriggerErrorPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  throw new Error("Dev-only error boundary test");
}
