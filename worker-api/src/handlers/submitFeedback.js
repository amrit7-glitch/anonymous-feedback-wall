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

  // Insert into Supabase
  const {
    data: insertedMessage,
    error,
  } = await supabase
    .from("feedbacks")
    .insert([
      {
        name,
        message,
      },
    ])
    .select()
    .single();

  if (error) {

    return new Response(
      JSON.stringify({
        error:
          error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  // Fetch latest messages
  const {
    data: latestMessages,
  } = await supabase
    .from("feedbacks")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false,
      }
    )
    .limit(10);

  // Update KV cache
  await setCachedMessages(
    env,
    latestMessages
  );

  return new Response(
    JSON.stringify({
      success: true,
      message:
        insertedMessage,
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