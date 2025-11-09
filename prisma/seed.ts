// prisma/seed.ts
import { PrismaClient } from "../app/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Seed default categories
  const categories = [
    { name: "Housing", icon: "🏠", color: "#FF6B6B", isCustom: false },
    { name: "Food", icon: "🍔", color: "#4ECDC4", isCustom: false },
    { name: "Transport", icon: "🚗", color: "#45B7D1", isCustom: false },
    { name: "Utilities", icon: "💡", color: "#FFA07A", isCustom: false },
    { name: "Entertainment", icon: "🎬", color: "#98D8C8", isCustom: false },
    { name: "Healthcare", icon: "🏥", color: "#F7DC6F", isCustom: false },
    { name: "Education", icon: "📚", color: "#BB8FCE", isCustom: false },
    { name: "Shopping", icon: "🛍️", color: "#85C1E2", isCustom: false },
    { name: "Other", icon: "📦", color: "#D5DBDB", isCustom: false },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log("✅ Seeded default categories");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
