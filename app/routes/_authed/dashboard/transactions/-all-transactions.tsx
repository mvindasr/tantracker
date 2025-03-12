import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { translations } from "@/data";
import { Link, useRouter } from "@tanstack/react-router";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import numeral from "numeral";

import { useState } from "react";
import { translateCategory } from "@/utils";

export function AllTransactions({
  transactions,
  yearsRange,
  month,
  year,
}: {
  transactions: {
    id: number;
    description: string;
    amount: string;
    transactionDate: string;
    category: string | null;
    transactionType: "income" | "expense" | null;
  }[];
  yearsRange: number[];
  month: number;
  year: number;
}) {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const selectedDate = new Date(year, month - 1, 1);
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span className="capitalize">
            {format(selectedDate, "MMM yyyy", { locale: es })} -{" "}
            {translations.transactions}
          </span>
          <div className="flex gap-3">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger className="capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem className="capitalize" value={`${i + 1}`} key={i}>
                    {format(new Date(selectedDate.getFullYear(), i, 1), "MMM", {
                      locale: es,
                    })}
                  </SelectItem>
                ))}
                ;
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearsRange.map((year) => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild>
              <Link
                to="/dashboard/transactions"
                search={{
                  month: selectedMonth,
                  year: selectedYear,
                }}
              >
                {translations.go}
              </Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/dashboard/transactions/new">
            {translations.newTransaction}
          </Link>
        </Button>
        {!transactions.length && (
          <p className="text-center py-10 text-lg text-muted-foreground">
            {translations.noTransactionsForMonth}
          </p>
        )}
        {!!transactions.length && (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>{translations.date}</TableHead>
                <TableHead>{translations.description}</TableHead>
                <TableHead>{translations.type}</TableHead>
                <TableHead>{translations.category}</TableHead>
                <TableHead>{translations.amount}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(transaction.transactionDate, "do MMM yyyy", {
                      locale: es,
                    })}
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
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit transaction"
                      asChild
                    >
                      <Link
                        onClick={() => {
                          router.clearCache({
                            filter: (route) =>
                              route.pathname !==
                              `/dashboard/transactions/${transaction.id}`,
                          });
                        }}
                        to={`/dashboard/transactions/$transactionId`}
                        params={{ transactionId: transaction.id.toString() }}
                      >
                        <PencilIcon />
                      </Link>
                    </Button>
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
