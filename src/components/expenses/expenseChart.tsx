import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

type ExpenseChartProps = {
  data: {
    category: string;
    amount: number;
  }[];
};

export function ExpenseChart({ data }: ExpenseChartProps) {
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
          {!data.length && <p>Cadastre uma despesa para gerar o gráfico</p>}
          {data.length > 0 && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount">
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </Card>
  );
}
