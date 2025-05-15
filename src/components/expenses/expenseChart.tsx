import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button"; // use seu botão com variants

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

export function ExpenseChart({ data }: any) {
  const [showChart, setShowChart] = useState(true);

  return (
    <Card className="mb-6 p-2 md:p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gráfico por categoria</h2>
        <Button
          variant="outline"
          className="text-sm px-3 py-1"
          onClick={() => setShowChart((prev) => !prev)}
        >
          {showChart ? "Ocultar" : "Mostrar"}
        </Button>
      </div>

      {showChart && (
        <div className="mt-2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
