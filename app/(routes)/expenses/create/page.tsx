"use client";
import BackButton from "@/app/components/buttons/BackButton";
import { Category } from "@/app/generated/prisma";
import Link from "next/link";
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
      <BackButton />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <fieldset className="border border-gray-300 rounded-lg p-4 dark:border-gray-600">
            <legend className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2">
              Expense Category *
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {expenseCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 has-checked:bg-blue-50 has-checked:border-blue-500 dark:border-gray-700 dark:hover:bg-gray-800 dark:has-checked:bg-blue-900/20"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={Number(selectedCategory) === Number(category.id)}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                    className="w-4 h-4 text-blue-600 cursor-pointer"
                  />
                  <span className="text-xl">{category.icon}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description
            </label>
            <input
              id="description"
              name="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="paymentMethod"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Payment Method
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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

          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or details"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Recurring Expense
            </span>
          </label>

          {isRecurring && (
            <div className="flex flex-col gap-2">
              <label
                htmlFor="recurringPeriod"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Recurring Period
              </label>
              <select
                id="recurringPeriod"
                name="recurringPeriod"
                value={recurringPeriod}
                onChange={(e) => setRecurringPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
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

          <div className="flex flex-col gap-2">
            <label
              htmlFor="tags"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tags
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
