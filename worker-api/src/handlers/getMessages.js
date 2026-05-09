import { corsHeaders } from "../utils/cors";

import { getSupabase } from "../services/supabase";

import {
  getCachedMessages,
  setCachedMessages,
} from "../services/cache";

export async function getMessages(env) {

  // Try cache first
  const cached =
    await getCachedMessages(env);

  if (cached) {

    const parsedCache =
      JSON.parse(cached);

    const normalizedCache =
      parsedCache.map((msg) => ({
        ...msg,

        created_at:
          new Date(
            msg.created_at
          ).toISOString(),
      }));

    return new Response(
      JSON.stringify(
        normalizedCache
      ),
      {
        headers: {
          "Content-Type":
            "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  const supabase =
    getSupabase(env);

  // Fetch from Supabase
  const { data, error } =
    await supabase
      .from("feedbacks")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(10);

  if (error) {

    return new Response(
      JSON.stringify({
        error:
          error.message,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  // Normalize timestamps
  const normalizedData =
    data.map((msg) => ({
      ...msg,

      created_at:
        new Date(
          msg.created_at
        ).toISOString(),
    }));

  // Save normalized cache
  await setCachedMessages(
    env,
    normalizedData
  );

  return new Response(
    JSON.stringify(
      normalizedData
    ),
    {
      headers: {
        "Content-Type":
          "application/json",
        ...corsHeaders,
      },
    }
  );
}