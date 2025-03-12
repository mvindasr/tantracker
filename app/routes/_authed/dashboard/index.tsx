import { createFileRoute } from "@tanstack/react-router";
import { RecentTransactions } from "./-recent-transactions";
import {
  getAnnualCashflow,
  getRecentTransactions,
  getTransactionYearsRange,
  translations,
} from "@/data";
import { Cashflow } from "./-cashflow";
import { z } from "zod";
import LoadingSkeleton from "@/components/loading-skeleton";

const today = new Date();

const searchSchema = z.object({
  cfyear: z
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear())
    .catch(today.getFullYear())
    .optional(),
});

export const Route = createFileRoute("/_authed/dashboard/")({
  pendingComponent: () => (
    <div className="px-20 mx-auto py-5">
      <h1 className="text-3xl font-semibold pb-5">{translations.dashboard}</h1>
      <LoadingSkeleton />
    </div>
  ),
  validateSearch: searchSchema,
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ cfyear: search.cfyear }),
  loader: async ({ deps }) => {
    const [transactions, cashflow, yearsRange] = await Promise.all([
      getRecentTransactions(),
      getAnnualCashflow({
        data: {
          year: deps.cfyear ?? today.getFullYear(),
        },
      }),
      getTransactionYearsRange(),
    ]);

    return {
      cfyear: deps.cfyear ?? today.getFullYear(),
      cashflow,
      transactions,
      yearsRange,
    };
  },
});

function RouteComponent() {
  const { transactions, cashflow, yearsRange, cfyear } = Route.useLoaderData();

  return (
    <div className="px-20 mx-auto py-7">
      <h1 className="text-3xl font-semibold pb-5">{translations.dashboard}</h1>
      <Cashflow
        yearsRage={yearsRange}
        year={cfyear}
        annualCashflow={cashflow}
      />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
