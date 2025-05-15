import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Expense } from "../../types/Expense";
import { formatCurrencyBR } from "@/lib/utils";

type ExpenseListProps = {
  expensesByMonth: Record<string, Expense[]>;
};

export function ExpenseList({ expensesByMonth }: ExpenseListProps) {
  return (
    <>
      {Object.entries(expensesByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, list]) => {
          const total = list.reduce((sum: number, e: any) => sum + e.amount, 0);

          return (
            <Card key={month} className="mb-4 p-4">
              <h3 className="font-bold text-lg mb-1 capitalize">
                {format(new Date(month + "-01"), "MMMM yyyy", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Total: {formatCurrencyBR(total)}
              </p>
              <ul className="space-y-1">
                {list.map((e: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {e.name} ({e.category})
                    </span>
                    <span>{formatCurrencyBR(e.amount)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
    </>
  );
}
