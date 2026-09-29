"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CatalogRealtimeSync() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || typeof EventSource === "undefined") return;

    const source = new EventSource("/api/catalog/stream");
    const refresh = () => router.refresh();

    source.addEventListener("catalog-changed", refresh);
    return () => {
      source.removeEventListener("catalog-changed", refresh);
      source.close();
    };
  }, [router]);

  return null;
}
