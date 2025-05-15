import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Expense } from "../types/Expense";
import { mergeExpenses } from "../lib/expenses";
import { db } from "../../firebase.config";

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const stored = localStorage.getItem(`expenses-${userId}`);
    const localExpenses = stored ? JSON.parse(stored) : [];
    setExpenses(localExpenses);

    const fetchData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "expenses", userId));
        const firebaseExpenses: Expense[] = docSnap.exists()
          ? docSnap.data().expenses || []
          : [];

        const merged = mergeExpenses(firebaseExpenses, localExpenses);
        setExpenses(merged);
        localStorage.setItem(`expenses-${userId}`, JSON.stringify(merged));
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const saveExpenses = async (newExpenses: Expense[]) => {
    if (!userId) return;
    await setDoc(doc(db, "expenses", userId), { expenses: newExpenses });
    localStorage.setItem(`expenses-${userId}`, JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  return { expenses, setExpenses, isLoading, saveExpenses };
}
