import { getAuthToken } from "../../../auth/api-client";

export const dynamic = "force-dynamic";

export const GET = async () => {
  const token = await getAuthToken();

  if (!token) {
    return new Response("unauthorized", { status: 401 });
  }

  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!apiRes.ok || !apiRes.body) {
    return new Response("failed to connect to events stream", {
      status: 502,
    });
  }

  return new Response(apiRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
};
