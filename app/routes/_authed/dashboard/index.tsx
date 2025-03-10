import { createFileRoute } from "@tanstack/react-router";
import { RecentTransactions } from "./-recent-transactions";
import { getRecentTransactions } from "@/data";

export const Route = createFileRoute("/_authed/dashboard/")({
  component: RouteComponent,
  loader: async () => {
    const transactions = await getRecentTransactions();
    return {
      transactions,
    };
  },
});

function RouteComponent() {
  const { transactions } = Route.useLoaderData();
  return (
    <div className="px-20 mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <RecentTransactions transactions={transactions} />
    </div>
  );
}
