import { getSqliteDb } from "@/lib/sqliteDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function latestUpdatedAt() {
  const db = getSqliteDb();
  return db.prepare("SELECT COALESCE(MAX(updated_at), '') AS updated_at FROM documents").get()?.updated_at || "";
}

export async function GET(request) {
  const encoder = new TextEncoder();
  let timer;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event, data) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      let last = "";
      try {
        last = latestUpdatedAt();
        send("ready", { updatedAt: last });
      } catch (error) {
        send("error", { message: error.message });
      }

      timer = setInterval(() => {
        try {
          const current = latestUpdatedAt();
          if (current && current !== last) {
            last = current;
            send("catalog-changed", { updatedAt: current });
          }
        } catch (error) {
          send("error", { message: error.message });
        }
      }, 500);

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
