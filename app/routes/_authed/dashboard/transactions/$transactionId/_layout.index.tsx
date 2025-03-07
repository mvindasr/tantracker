import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories, getTransaction, updateTransaction } from "@/data";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="text-3xl text-muted-foreground py-10">
        Oops! Transaction not found.
      </div>
    );
  },
  loader: async ({ params }) => {
    const [categories, transaction] = await Promise.all([
      getCategories(),
      getTransaction({
        data: { transactionId: Number(params.transactionId) },
      }),
    ]);
    return {
      transaction,
      categories,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { categories, transaction } = Route.useLoaderData();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await updateTransaction({
      data: {
        id: transaction.id,
        amount: data.amount,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
        categoryId: data.categoryId,
        description: data.description,
      },
    });

    toast.message("Success!", {
      description: "Transaction updated",
      closeButton: true,
      classNames: {
        toast: "!bg-green-600 !text-white !border-green-600",
        description: "ps-2 text-xs",
        title: "ps-2 !font-semibold",
        closeButton: "!bg-white !text-green-600 !border-green-600",
      },
      duration: 3000,
    });

    navigate({
      to: "/dashboard/transactions",
      search: {
        month: data.transactionDate.getMonth() + 1,
        year: data.transactionDate.getFullYear(),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle>Edit transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm
          categories={categories}
          onSubmit={handleSubmit}
          defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType:
              categories.find(
                (category) => category.id === transaction.categoryId
              )?.type ?? "income",
          }}
        />
      </CardContent>
    </Card>
  );
}
