"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const categories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Outros"];
const allCategoriesValue = "__all__";
const TODAY = new Date().toISOString().split("T")[0];

export function ExpenseFilters({ filters, setFilters }: any) {
  return (
    <div>
      <h3 className="text-md font-semibold mb-2">Filtrar dispesas</h3>

      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Input
            type="date"
            value={filters.start}
            onChange={(e) => setFilters({ ...filters, start: e.target.value })}
            id="start-date"
            label="Data início"
          />
          <Input
            type="date"
            value={filters.start && !filters.end ? TODAY : filters.end}
            onChange={(e) => setFilters({ ...filters, end: e.target.value })}
            id="end-date"
            label="Data fim"
          />
          <Select
            onChange={({ target }) =>
              setFilters({ ...filters, category: target.value })
            }
            id="category-to-filter"
            label="Categoria"
          >
            <SelectTrigger>
              {filters.category === allCategoriesValue
                ? "Todas"
                : filters.category}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allCategoriesValue}>
                Todas as categorias
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}
