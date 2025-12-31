"use client";

import { Expense } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import styles from "./Expenses.module.css";

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
    <div className={styles.container}>
      <ul className={styles.expenseList}>
        {expenses.map((expense) => (
          <li key={expense.id} className={styles.expenseItem}>
            <div className={styles.expenseContent}>
              <span className={styles.description}>{expense.description}</span>
              <span className={styles.date}>
                {format(expense.date, "MM/dd/yyyy")}
              </span>
              <span className={styles.amount}>${expense.amount}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
