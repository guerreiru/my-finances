"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Outros"];

export function ExpenseForm({
  formData,
  setFormData,
  addExpense,
  adding,
}: any) {
  return (
    <Card className="mb-6">
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        <Input
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          id="name"
          label="name"
        />
        <Input
          type="number"
          placeholder="Valor"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          id="value"
          label="Valor"
        />
        <Select
          onChange={({ target }) =>
            setFormData({ ...formData, category: target.value })
          }
          id="category"
          label="Categoria"
        >
          <SelectTrigger>{formData.category || "Categoria"}</SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          min={1}
          placeholder="Parcelas"
          value={formData.installments}
          onChange={(e) =>
            setFormData({ ...formData, installments: e.target.value })
          }
          id="installments"
          label="Parcelas"
        />
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          id="expanse-date"
          label="Data"
        />
        <div className="self-end flex">
          <Button onClick={addExpense} className="flex-1" disabled={adding}>
            {adding ? "Adicionando..." : "Adicionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
