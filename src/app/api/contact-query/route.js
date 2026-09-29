import { postAdminQuery } from "@/lib/admin-api";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await postAdminQuery("/api/contact-query", payload);
    return Response.json(
      { success: true, data: result },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Contact submission failed:", error);
    return Response.json(
      { success: false, error: error.message || "Submission failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
