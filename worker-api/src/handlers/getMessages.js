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

//      console.log(
//     "Serving from KV cache"
//   );

    return new Response(cached, {
      headers: {
        "Content-Type":
          "application/json",
        ...corsHeaders,
      },
    });
  }

//    console.log(
//     "Serving from KV cache"
//   );

  const supabase =
    getSupabase(env);

  // Fetch from Supabase
  const { data, error } =
    await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(10);

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  // Save cache
  await setCachedMessages(
    env,
    data
  );

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type":
          "application/json",
        ...corsHeaders,
      },
    }
  );
}