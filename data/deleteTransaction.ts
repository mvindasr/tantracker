import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  transactionId: z.number(),
});

export const deleteTransaction = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof schema>) => schema.parse(data))
  .handler(async ({ data, context }) => {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.userId, context.userId),
          eq(transactionsTable.id, data.transactionId)
        )
      );
  });
