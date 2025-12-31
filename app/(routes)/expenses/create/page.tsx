"use client";
import BackButton from "@/app/components/buttons/BackButton";
import { Category } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import styles from "./CreateExpense.module.css";

export default function CreateExpense() {
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringPeriod, setRecurringPeriod] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const getExpenseCategories = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/expenses/categories`,
    );
    const data = await response.json();
    setExpenseCategories(data);
  };

  useEffect(() => {
    const fetchCategories = async () => await getExpenseCategories();
    fetchCategories();
  }, []);

  console.log("selectedCategory", selectedCategory);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          date: new Date(date).toISOString(),
          categoryId: Number(selectedCategory),
          description: description || undefined,
          notes: notes || undefined,
          paymentMethod: paymentMethod || undefined,
          isRecurring,
          recurringPeriod: recurringPeriod || undefined,
          tags: tags || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Expense created successfully:", data);
        // Reset form or redirect
      } else {
        const error = await response.json();
        console.error("Error response:", error);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    } finally {
      //   setLoading(false);
    }
  }

  return (
    <>
      <BackButton />
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="amount" className={styles.label}>
              Amount *
            </label>
            <CurrencyInput
              id="amount"
              name="amount"
              placeholder="$0.00"
              prefix="$"
              decimalsLimit={2}
              value={amount}
              onValueChange={(value) => setAmount(value || "")}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="date" className={styles.label}>
              Date *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Expense Category *</legend>
            <div className={styles.categoryGrid}>
              {expenseCategories.map((category) => (
                <label key={category.id} className={styles.categoryLabel}>
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={Number(selectedCategory) === Number(category.id)}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className={styles.categoryRadio}
                  />
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={styles.fieldGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="paymentMethod" className={styles.label}>
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className={styles.select}
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="digital_wallet">Digital Wallet</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="notes" className={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or details"
              rows={3}
              className={styles.textarea}
            />
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className={styles.checkbox}
            />
            <span className={styles.label}>Recurring Expense</span>
          </label>

          {isRecurring && (
            <div className={styles.fieldGroup}>
              <label htmlFor="recurringPeriod" className={styles.label}>
                Recurring Period
              </label>
              <select
                id="recurringPeriod"
                name="recurringPeriod"
                value={recurringPeriod}
                onChange={(e) => setRecurringPeriod(e.target.value)}
                className={styles.select}
              >
                <option value="">Select period</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}

          <div className={styles.fieldGroup}>
            <label htmlFor="tags" className={styles.label}>
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
