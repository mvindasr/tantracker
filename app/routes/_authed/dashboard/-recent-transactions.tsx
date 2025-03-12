import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { translations } from "@/data";
import { translateCategory } from "@/utils";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import numeral from "numeral";

export function RecentTransactions({
  transactions,
}: {
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: "income" | "expense" | null;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{translations.recentTransactions}</span>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/transactions">{translations.viewAll}</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/transactions/new">
                {translations.createNew}
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!transactions.length && (
          <p className="text-center py-10 text-lg text-muted-foreground">
            {translations.noTransactionsForMonth}
          </p>
        )}
        {!!transactions.length && (
          <Table className="mt-2">
            <TableHeader className="text-muted-background">
              <TableRow>
                <TableHead>{translations.date}</TableHead>
                <TableHead>{translations.description}</TableHead>
                <TableHead>{translations.type}</TableHead>
                <TableHead>{translations.category}</TableHead>
                <TableHead>{translations.amount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(transaction.transactionDate, "do MMM yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <Badge
                      className={`${
                        transaction.transactionType === "income"
                          ? "bg-lime-500"
                          : "bg-orange-500"
                      } w-20 flex flex-row justify-center items-center`}
                    >
                      {transaction.transactionType === "income"
                        ? translations.income
                        : translations.expense}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {translateCategory(transaction.category)}
                  </TableCell>
                  <TableCell>
                    {translations.currency}{" "}
                    {numeral(transaction.amount).format("0,0[.]00")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
