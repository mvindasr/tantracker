import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { addDays } from "date-fns";
import { z } from "zod";

const transactionSchema = z.object({
  categoryId: z.coerce.number().positive("Please select a category"),
  transactionDate: z.string().refine((value) => {
    const parsedDate = new Date(value);
    return !isNaN(parsedDate.getTime()) && parsedDate <= addDays(new Date(), 1);
  }),
  amount: z.coerce.number().positive("Amount must be greater then 0"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(300, "Description must contain a maximum of 300 characters"),
});

export const createTransaction = createServerFn({
  method: "POST",
  // We need a authMiddleware before validator and handler to check if user is currently logged in
})
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof transactionSchema>) =>
    transactionSchema.parse(data)
  )
  .handler(async ({ data, context }) => {
    // We can now access the userId from the context
    const userId = context.userId;
    const transaction = await db
      .insert(transactionsTable)
      .values({
        userId,
        // When passing a numeric record, we need to convert it to a string first
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId,
        transactionDate: data.transactionDate,
      })
      .returning();
    return transaction;
  });
