import { corsHeaders } from "../utils/cors";
import { getSupabase } from "../services/supabase";
import {
  setCachedMessages,
} from "../services/cache";

export async function submitFeedback(
  request,
  env
) {

  const body =
    await request.json();

  const name =
    body.name || "Anonymous";

  const message =
    body.message;

  // Validation
  if (
    !message ||
    message.trim() === ""
  ) {
    return new Response(
      JSON.stringify({
        error:
          "Message is required",
      }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const supabase =
    getSupabase(env);

  // Insert
  const { error } =
    await supabase
      .from("feedbacks")
      .insert([
        {
          name,
          message,
        },
      ]);

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

  // Refresh cache
  const {
    data: latestMessages,
  } = await supabase
    .from("feedbacks")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  await setCachedMessages(
    env,
    latestMessages
  );

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: {
        "Content-Type":
          "application/json",
        ...corsHeaders,
      },
    }
  );
}