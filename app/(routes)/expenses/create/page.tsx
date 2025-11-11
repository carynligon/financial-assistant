"use client";
import { Category } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

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
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount *</label>
          <CurrencyInput
            id="amount"
            name="amount"
            placeholder="$0.00"
            prefix="$"
            decimalsLimit={2}
            value={amount}
            onValueChange={(value) => setAmount(value || "")}
            required
          />
        </div>

        <div>
          <label htmlFor="date">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <fieldset>
          <legend>Expense Category *</legend>
          {expenseCategories.map((category) => (
            <div key={category.id}>
              <label>
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={Number(selectedCategory) === Number(category.id)}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                />
                {category.icon}
                {category.name}
              </label>
            </div>
          ))}
        </fieldset>

        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description"
          />
        </div>

        <div>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
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

        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes or details"
            rows={3}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            Recurring Expense
          </label>
        </div>

        {isRecurring && (
          <div>
            <label htmlFor="recurringPeriod">Recurring Period</label>
            <select
              id="recurringPeriod"
              name="recurringPeriod"
              value={recurringPeriod}
              onChange={(e) => setRecurringPeriod(e.target.value)}
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

        <div>
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
