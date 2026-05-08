const CACHE_KEY = "latest_messages";

export async function getCachedMessages(env) {
  return await env.FEEDBACK_KV.get(CACHE_KEY);
}

export async function setCachedMessages(
  env,
  messages
) {
  await env.FEEDBACK_KV.put(
    CACHE_KEY,
    JSON.stringify(messages)
  );
}