import {
  TransactionForm,
  transactionFormSchema,
} from "@/components/transaction-form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteTransaction,
  getCategories,
  getTransaction,
  translations,
  updateTransaction,
} from "@/data";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute(
  "/_authed/dashboard/transactions/$transactionId/_layout/"
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="text-3xl text-muted-foreground py-10">
        {translations.transactionNotFound}
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
  const [deleting, setDeleting] = useState(false);
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

    toast.message(translations.successToast, {
      description: translations.transactionUpdated,
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

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await deleteTransaction({
      data: { transactionId: transaction.id },
    });

    toast.message(translations.successToast, {
      description: translations.transactionDeleted,
      closeButton: true,
      classNames: {
        toast: "!bg-green-600 !text-white !border-green-600",
        description: "ps-2 text-xs",
        title: "ps-2 !font-semibold",
        closeButton: "!bg-white !text-green-600 !border-green-600",
      },
      duration: 3000,
    });

    setDeleting(false);
    navigate({
      to: "/dashboard/transactions",
      search: {
        month: Number(transaction.transactionDate.split("-")[1]),
        year: Number(transaction.transactionDate.split("-")[0]),
      },
    });
  };

  return (
    <Card className="max-w-screen-md mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{translations.editTransaction}</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2Icon />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogTitle>
                {translations.deletedTransactionConfirmHeader}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {translations.deletedTransactionConfirmDescription}
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
                <Button
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  variant="destructive"
                >
                  {translations.delete}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
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
          type="edit"
        />
      </CardContent>
    </Card>
  );
}
