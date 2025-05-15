import { Expense } from "../types/Expense";

export const ALL_CATEGORIES = "__all__";

export const groupByMonth = (expenses: Expense[]) => {
  return expenses.reduce((acc: Record<string, Expense[]>, item) => {
    const month = item.date.slice(0, 7);
    if (!acc[month]) acc[month] = [];
    acc[month].push(item);
    return acc;
  }, {});
};

export const mergeExpenses = (
  firebase: Expense[],
  local: Expense[]
): Expense[] => {
  const key = (e: Expense) => `${e.name}-${e.amount}-${e.date}`;
  const localMap = new Map(local.map((e) => [key(e), e]));
  const firebaseMap = new Map(firebase.map((e) => [key(e), e]));

  const merged = [...firebase];
  for (const [k, e] of localMap) {
    if (!firebaseMap.has(k)) merged.push(e);
  }
  return merged;
};
