import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.category.findMany();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Get expense categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense categories" },
      { status: 500 },
    );
  }
}
