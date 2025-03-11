import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTransaction } from "@/data/createTransaction";
import { getCategories } from "@/data/getCategories";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/new/_layout/"
)({
  component: RouteComponent,
  loader: async () => {
    const categories = await getCategories();
    return {
      categories,
    };
  },
});

function RouteComponent() {
  const { categories } = Route.useLoaderData();
  const navigate = useNavigate();
  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    await createTransaction({
      data: {
        amount: data.amount,
        categoryId: data.categoryId,
        description: data.description,
        transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      },
    });

    toast.message("Success!", {
      description: "Transaction created",
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
        <CardTitle>New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
