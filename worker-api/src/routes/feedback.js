import { getMessages }
  from "../handlers/getMessages";

import { submitFeedback }
  from "../handlers/submitFeedback";

export async function feedbackRoutes(
  request,
  env,
  pathname
) {

  // GET messages
  if (
    pathname === "/api/messages" &&
    request.method === "GET"
  ) {
    return getMessages(env);
  }

  // POST feedback
  if (
    pathname === "/api/submit" &&
    request.method === "POST"
  ) {
    return submitFeedback(
      request,
      env
    );
  }

  return null;
}