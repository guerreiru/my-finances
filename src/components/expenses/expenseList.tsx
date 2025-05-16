import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Expense } from "../../types/Expense";
import { formatCurrencyBR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

type ExpenseListProps = {
  expensesByMonth: Record<string, Expense[]>;
  onDelete?: (id: string) => void;
};

export function ExpenseList({ expensesByMonth, onDelete }: ExpenseListProps) {
  return (
    <>
      {Object.entries(expensesByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, list]) => {
          const total = list.reduce((sum, e) => sum + e.amount, 0);

          return (
            <Card key={month} className="mb-4 p-4">
              <h3 className="font-bold text-lg mb-1 capitalize">
                {format(new Date(month + -1), "MMMM yyyy", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Total: {formatCurrencyBR(total)}
              </p>
              <ul className="space-y-2">
                {list.map((e) => (
                  <li key={e.id} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{e.name}</span>{" "}
                      <span className="text-sm text-muted-foreground">
                        ({e.category})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-right font-medium">
                        {formatCurrencyBR(e.amount)}
                      </span>
                      {onDelete && (
                        <Button
                          variant="ghost"
                          onClick={() => onDelete(e.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={16} />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
    </>
  );
}
