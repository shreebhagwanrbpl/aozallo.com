import { adminFetch } from "@/lib/admin-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function catalogSignature() {
  const json = await adminFetch("/api/catalog");
  const products = Array.isArray(json?.products) ? json.products : [];
  return JSON.stringify({
    count: products.length,
    latest: products
      .map((p) => `${p.id || p.uid || p.productId || p.slug}:${p.updatedAt || p.updated_at || ""}`)
      .sort(),
  });
}

export async function GET(request) {
  const encoder = new TextEncoder();
  let timer;
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event, data) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      let last = "";
      try {
        last = await catalogSignature();
        send("ready", { updatedAt: last });
      } catch (error) {
        send("error", { message: error.message });
      }

      timer = setInterval(async () => {
        try {
          const current = await catalogSignature();
          if (current !== last) {
            last = current;
            send("catalog-changed", { updatedAt: current });
          }
        } catch (error) {
          send("error", { message: error.message });
        }
      }, 3000);

      request.signal?.addEventListener("abort", () => {
        closed = true;
        clearInterval(timer);
        try { controller.close(); } catch {}
      });
    },
    cancel() {
      closed = true;
      clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
