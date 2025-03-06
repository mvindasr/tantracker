import { getAuth } from "@clerk/tanstack-start/server";
import { createMiddleware } from "@tanstack/start";
import { getWebRequest } from "vinxi/http";

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuth(getWebRequest());

  if (!user?.userId) {
    throw new Error("Unauthorized");
  }

  // We can chain middlewares, so we can pass the user id to the next middleware
  const result = await next({
    context: {
      userId: user.userId,
    },
  });
  return result;
});

export default authMiddleware;
