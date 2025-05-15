"use client";

import { addMonths, isWithinInterval } from "date-fns";
import { useState } from "react";

import { useExpenses } from "@/hooks/useExpenses";
import { useUser } from "@/hooks/useUser";

import { ALL_CATEGORIES, groupByMonth } from "@/lib/expenses";

import { ExpenseChart } from "@/components/expenses/expenseChart";
import { ExpenseFilters } from "@/components/expenses/expenseFilters";
import { ExpenseForm } from "@/components/expenses/expenseForm";
import { ExpenseList } from "@/components/expenses/expenseList";
import { LoadingPlaceholder } from "@/components/expenses/loadingPlaceholder";

import { Expense } from "@/types/Expense";
import { Header } from "@/components/ui/header";

const TODAY = new Date().toISOString().split("T")[0];
const DEFAULT_FORM = {
  name: "",
  amount: "",
  category: "",
  installments: "1",
  date: TODAY,
};

export default function ExpenseManagerPage() {
  const user = useUser();
  const { expenses, isLoading, saveExpenses } = useExpenses(user?.uid);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [adding, setAdding] = useState(false);

  const [filters, setFilters] = useState({
    start: "",
    end: "",
    category: ALL_CATEGORIES,
  });

  const addExpense = async () => {
    if (!user?.uid) return;

    const totalAmount = parseFloat(formData.amount);
    const installments = parseInt(formData.installments, 10);
    if (
      !formData.name ||
      isNaN(totalAmount) ||
      !formData.category ||
      isNaN(installments)
    )
      return;

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
    await saveExpenses([...expenses, ...newExpenses]);
    setFormData(DEFAULT_FORM);
    setAdding(false);
  };

  const filteredExpenses = expenses.filter((e) => {
    const date = new Date(e.date);
    const inRange =
      !filters.start ||
      !filters.end ||
      isWithinInterval(date, {
        start: new Date(filters.start),
        end: new Date(filters.end),
      });
    const inCategory =
      filters.category === ALL_CATEGORIES || e.category === filters.category;
    return inRange && inCategory;
  });

  const expensesByCategory = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  if (!user?.uid) return null;

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <Header />
      <h1 className="text-3xl font-bold mb-6">Gerenciador de Despesas</h1>

      <ExpenseForm
        formData={formData}
        setFormData={setFormData}
        addExpense={addExpense}
        adding={adding}
      />

      <ExpenseFilters filters={filters} setFilters={setFilters} />

      {isLoading ? (
        <LoadingPlaceholder />
      ) : (
        <>
          <ExpenseChart data={chartData} />
          <ExpenseList expensesByMonth={groupByMonth(filteredExpenses)} />
        </>
      )}
    </main>
  );
}
