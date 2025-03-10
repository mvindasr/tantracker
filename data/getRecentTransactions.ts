import authMiddleware from "@/authMiddleware";
import { db } from "@/db";
import { categoriesTable, transactionsTable } from "@/db/schema";
import { createServerFn } from "@tanstack/start";
import { desc, eq } from "drizzle-orm";

export const getRecentTransactions = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const transactions = await db
      .select({
        id: transactionsTable.id,
        amount: transactionsTable.amount,
        description: transactionsTable.description,
        transactionDate: transactionsTable.transactionDate,
        category: categoriesTable.name,
        transactionType: categoriesTable.type,
      })
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, context.userId))
      .orderBy(desc(transactionsTable.transactionDate))
      .leftJoin(
        categoriesTable,
        eq(transactionsTable.categoryId, categoriesTable.id)
      )
      .limit(5);

    return transactions;
  });
