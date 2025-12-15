"use client";

import { Expense } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const getExpenses = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/expenses`,
    );
    const data = await response.json();
    setExpenses(data.expenses);
  };

  useEffect(() => {
    const fetchExpenses = async () => await getExpenses();
    fetchExpenses();
  }, []);

  console.log("expenses", expenses);
  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          <div>
            <span>{expense.description}</span>
            <span>{format(expense.date, "MM/dd/yyyy")}</span>
            <span>{expense.amount}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
