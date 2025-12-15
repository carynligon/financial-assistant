import { NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const {
    amount,
    date,
    categoryId,
    description,
    notes,
    paymentMethod,
    isRecurring,
    recurringPeriod,
    tags,
    transactions,
  } = await request.json();
  try {
    const expense = {
      amount,
      date,
      categoryId,
      description,
      notes,
      paymentMethod,
      isRecurring,
      recurringPeriod,
      tags,
      transactions,
    };
    const createdExpense = await prisma.expense.create({
      data: expense,
    });

    return NextResponse.json({
      expense: createdExpense,
    });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany();

    return NextResponse.json({
      expenses,
    });
  } catch (error) {
    console.error("Error fetching expenses", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}
