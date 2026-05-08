import { corsHeaders }
  from "./utils/cors";

import { feedbackRoutes }
  from "./routes/feedback";

export default {

  async fetch(request, env) {

    // Handle preflight
    if (
      request.method === "OPTIONS"
    ) {
      return new Response(
        null,
        {
          headers:
            corsHeaders,
        }
      );
    }

    const url =
      new URL(request.url);

    const pathname =
      url.pathname;

    // Feedback routes
    const response =
      await feedbackRoutes(
        request,
        env,
        pathname
      );

    if (response) {
      return response;
    }

    return new Response(
      "Not Found",
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  },
};