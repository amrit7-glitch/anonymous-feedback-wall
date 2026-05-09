export async function checkRateLimit(
  request,
  env
) {

  const ip =
    request.headers.get(
      "CF-Connecting-IP"
    ) || "unknown";

  const key =
    `rate_limit:${ip}`;

  const limit = 5;

  // Check existing count
  const existing =
    await env.FEEDBACK_KV.get(
      key
    );

  const count =
    existing
      ? parseInt(existing)
      : 0;

  // Limit exceeded
  if (count >= limit) {

    return {
      allowed: false,
    };
  }

  // Increment count
  await env.FEEDBACK_KV.put(
    key,
    String(count + 1),
    {
      expirationTtl: 60,
    }
  );

  return {
    allowed: true,
  };
}