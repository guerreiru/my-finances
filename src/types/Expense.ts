export interface Expense {
  name: string;
  amount: number;
  category: string;
  date: string;
  fromFirebase?: boolean;
}
