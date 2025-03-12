import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { translations } from "@/data";
import { cn } from "@/lib/utils";
import { SelectContent } from "@radix-ui/react-select";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export function Cashflow({
  year,
  yearsRage,
  annualCashflow,
}: {
  year: number;
  yearsRage: number[];
  annualCashflow: { month: number; income: number; expenses: number }[];
}) {
  const totalAnnualIncome = annualCashflow.reduce(
    (prevResult: number, { income }) => {
      return prevResult + income;
    },
    0
  );
  const totalAnnualExpenses = annualCashflow.reduce(
    (prevResult: number, { expenses }) => {
      return prevResult + expenses;
    },
    0
  );
  const balance = totalAnnualIncome - totalAnnualExpenses;

  const navigate = useNavigate();
  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{translations.cashflow}</span>
          <div>
            <Select
              defaultValue={year.toString()}
              onValueChange={(value) => {
                navigate({
                  to: "/dashboard",
                  search: { cfyear: Number(value) },
                });
              }}
            >
              <SelectTrigger className="w-[5.5rem] focus:border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border rounded-md shadow-lg p-2">
                {yearsRage.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <ChartContainer
          config={{
            income: {
              label: translations.incomes,
              color: "#90c147",
            },
            expenses: {
              label: translations.expenses,
              color: "#f97316",
            },
          }}
          className="w-full h-[300px]"
        >
          <BarChart data={annualCashflow}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => {
                return `${translations.currency}${numeral(value).format("0,0")}`;
              }}
            />
            <XAxis
              dataKey="month"
              className="capitalize"
              tickFormatter={(value) => {
                return format(new Date(year, value - 1, 1), "MMM", {
                  locale: es,
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    return (
                      <div className="capitalize" key={value}>
                        {format(
                          new Date(year, payload[0]?.payload?.month - 1, 1),
                          "MMM",
                          { locale: es }
                        )}
                      </div>
                    );
                  }}
                  formatter={(value, name) => {
                    const color = name === "income" ? "#84cc16" : "#f97316";
                    return [
                      <div
                        key={`${name}-container`}
                        className="flex flex-row justify-between w-full space-x-3"
                      >
                        <div className="flex items-center">
                          <div
                            key={`${name}-color`}
                            className="w-2.5 h-2.5 mr-2 rounded-[2px]"
                            style={{ backgroundColor: color }}
                          ></div>
                          <div
                            key={`${name}-text`}
                            className="capitalize text-gray-600"
                          >
                            {name === "income"
                              ? translations.incomes
                              : translations.expenses}
                          </div>
                        </div>
                        <div
                          key={`${name}-value`}
                          className="text-right w-full"
                        >
                          {translations.currency}{" "}
                          {numeral(value).format("0,0[.]00")}
                        </div>
                      </div>,
                    ];
                  }}
                />
              }
            />
            <Legend
              align="right"
              verticalAlign="top"
              formatter={(value) => {
                return value === "income"
                  ? translations.incomes
                  : translations.expenses;
              }}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
        <div className="border-l px-4 flex flex-col gap-4 justify-center">
          <div className="space-y-1">
            <span className="text-muted-foreground font-bold text-sm ">
              {translations.incomes}
            </span>
            <h2 className="text-3xl">
              {translations.currency}{" "}
              {numeral(totalAnnualIncome).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div className="space-y-1">
            <span className="text-muted-foreground font-bold text-sm ">
              {translations.expenses}
            </span>
            <h2 className="text-3xl">
              {translations.currency}{" "}
              {numeral(totalAnnualExpenses).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div className="space-y-1">
            <span className="text-muted-foreground font-bold text-sm ">
              {translations.balance}
            </span>
            <h2
              className={cn(
                "text-3xl font-bold",
                balance >= 0 ? "text-[#90c147]" : "text-orange-500"
              )}
            >
              {translations.currency} {numeral(balance).format("0,0[.]00")}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
