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
import { cn } from "@/lib/utils";
import { SelectContent } from "@radix-ui/react-select";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
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
          <span>Cashflow</span>
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
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              label: "Income",
              color: "#84cc16",
            },
            expenses: {
              label: "Expenses",
              color: "#f97316",
            },
          }}
          className="w-full h-[300px]"
        >
          <BarChart data={annualCashflow}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickFormatter={(value) => {
                return `$${numeral(value).format("0,0")}`;
              }}
            />
            <XAxis
              dataKey="month"
              tickFormatter={(value) => {
                return format(new Date(year, value - 1, 1), "MMM");
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    return (
                      <div key={value}>
                        {format(
                          new Date(year, payload[0]?.payload?.month - 1, 1),
                          "MMM"
                        )}
                      </div>
                    );
                  }}
                  formatter={(value, name) => {
                    const color = name === "income" ? "#84cc16" : "#f97316";
                    return [
                      <div className="flex flex-row justify-between w-full space-x-3">
                        <div className="flex items-center">
                          <div
                            className="w-2.5 h-2.5 mr-2 rounded-[2px]"
                            style={{ backgroundColor: color }}
                          ></div>
                          <div className="capitalize text-gray-600">{name}</div>
                        </div>
                        <div className="text-right w-full">
                          ${numeral(value).format("0,0[.]00")}
                        </div>
                      </div>,
                    ];
                  }}
                />
              }
            />
            <Legend align="right" verticalAlign="top" />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
        <div className="border-l px-4 flex flex-col gap-4 justify-center">
          <div>
            <span className="text-muted-foreground font-bold text-sm ">
              Income
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualIncome).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div>
            <span className="text-muted-foreground font-bold text-sm ">
              Expenses
            </span>
            <h2 className="text-3xl">
              ${numeral(totalAnnualExpenses).format("0,0[.]00")}
            </h2>
          </div>
          <div className="border-t" />
          <div>
            <span className="text-muted-foreground font-bold text-sm ">
              Balance
            </span>
            <h2
              className={cn(
                "text-3xl font-bold",
                balance >= 0 ? "text-lime-500" : "text-orange-500"
              )}
            >
              ${numeral(balance).format("0,0[.]00")}
            </h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
