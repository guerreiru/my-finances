"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { addMonths, format, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import Header from "@/components/ui/header";

interface Expense {
  name: string;
  amount: number;
  category: string;
  date: string;
  fromFirebase?: boolean;
}

function mergeExpenses(firebase: Expense[], local: Expense[]): Expense[] {
  const key = (e: Expense) => `${e.name}-${e.amount}-${e.date}`;

  const localMap = new Map(local.map((e) => [key(e), e]));
  const firebaseMap = new Map(firebase.map((e) => [key(e), e]));

  // Inclui tudo do Firebase
  const merged = [...firebase];

  // Adiciona do localStorage apenas os que não estão no Firebase
  for (const [k, e] of localMap) {
    if (!firebaseMap.has(k)) {
      merged.push(e);
    }
  }

  return merged;
}

function getExpenseKey(e: Expense) {
  return `${e.name}-${e.amount}-${e.date}`;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];
const categories = ["Alimentação", "Transporte", "Moradia", "Lazer", "Outros"];
const allCategoriesValue = "__all__";
const today = new Date().toISOString().split("T")[0];

export default function Home() {
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      window.location.href = "/login"; // redireciona se não estiver logado
    }
  }, []);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    installments: "1",
    date: today,
  });
  const [filters, setFilters] = useState({
    start: "",
    end: "",
    category: allCategoriesValue,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("expenses");
    let storedParsed: Expense[] = [];

    if (stored) {
      storedParsed = JSON.parse(stored);
      setExpenses(storedParsed); // Mostrar algo imediatamente
    }

    const fetchFirebaseData = async () => {
      setIsLoading(true); // Mostra loading enquanto busca do Firebase

      const snapshot = await getDocs(collection(db, "expenses"));
      const firebaseExpenses: Expense[] = [];
      snapshot.forEach((doc) => {
        firebaseExpenses.push(doc.data() as Expense);
      });

      const merged = mergeExpenses(firebaseExpenses, storedParsed);
      localStorage.setItem("expenses", JSON.stringify(merged));
      setExpenses(merged);

      setIsLoading(false); // Loading termina após a mesclagem
    };

    fetchFirebaseData();
  }, []);

  const addExpense = async () => {
    const installments = parseInt(formData.installments || "1", 10);
    const totalAmount = parseFloat(formData.amount || "0");

    if (
      !formData.name ||
      isNaN(totalAmount) ||
      !formData.category ||
      isNaN(installments)
    ) {
      return; // validação básica
    }

    const amountPerInstallment = parseFloat(
      (totalAmount / installments).toFixed(2)
    );
    const startDate = new Date(formData.date);

    const newExpenses: Expense[] = Array.from({ length: installments }).map(
      (_, i) => ({
        name:
          formData.name +
          (installments > 1 ? ` (${i + 1}/${installments})` : ""),
        amount: amountPerInstallment,
        category: formData.category,
        date: addMonths(startDate, i).toISOString(),
      })
    );

    setAdding(true);
    // Salva no Firestore
    for (const expense of newExpenses) {
      await addDoc(collection(db, "expenses"), expense);
    }

    // Atualiza localStorage e estado
    const updatedExpenses = [...expenses, ...newExpenses];
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    setFormData({
      name: "",
      amount: "",
      category: "",
      installments: "1",
      date: today,
    });

    setAdding(false);
  };

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const withinInterval =
      !filters.start ||
      !filters.end ||
      isWithinInterval(date, {
        start: new Date(filters.start),
        end: new Date(filters.end),
      });
    const categoryOk =
      filters.category === allCategoriesValue ||
      e.category === filters.category;
    return withinInterval && categoryOk;
  });

  const expensesByCategory = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({ category, amount })
  );

  const expensesByMonth = filteredExpenses.reduce((acc, e) => {
    const month = format(new Date(e.date), "yyyy-MM");
    acc[month] = acc[month] || [];
    acc[month].push(e);
    return acc;
  }, {} as Record<string, Expense[]>);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Header />

      <h1 className="text-2xl font-bold mb-4">Gestor de despesas</h1>

      {/* Form */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Input
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            id="name"
            label="Nome"
          />
          <Input
            type="number"
            placeholder="Valor"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
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
            onChange={({ target }) =>
              setFormData({ ...formData, installments: target.value })
            }
            id="installments"
            label="Parcelas"
          />
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            id="date"
            label="Data"
          />
          <div className="self-end flex">
            <Button onClick={addExpense} className="flex-1" disabled={adding}>
              {adding ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          <Input
            type="date"
            value={filters.start}
            onChange={(e) => setFilters({ ...filters, start: e.target.value })}
            id="startDate"
            label="Data início"
          />
          <Input
            type="date"
            value={filters.end}
            onChange={(e) => setFilters({ ...filters, end: e.target.value })}
            id="endDate"
            label="Data Fim"
          />
          <Select
            onChange={({ target }) =>
              setFilters({ ...filters, category: target.value })
            }
            id="categoryFilter"
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

      {/* Chart */}
      <Card className="mb-6 p-2 md:p-4">
        <h2 className="text-xl font-semibold mb-2">Gráfico por categoria</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  fontSize={10}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* List per month */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-200 rounded-lg h-24" />
          ))}
        </div>
      ) : (
        Object.entries(expensesByMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, list]) => (
            <Card key={month} className="mb-4 p-4">
              <h3 className="font-bold text-lg mb-1 capitalize">
                {format(new Date(month + "-01"), "MMMM yyyy", { locale: ptBR })}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Total: R${" "}
                {list.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
              </p>
              <ul className="space-y-1">
                {list.map((e, i) => (
                  <li key={i} className="flex justify-between">
                    <span>
                      {e.name} ({e.category})
                    </span>
                    <span>R$ {e.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))
      )}
    </div>
  );
}
