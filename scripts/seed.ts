import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";

// Account types with realistic colors and icons
const ACCOUNT_TYPES = [
  { type: "CHECKING", color: "#3b82f6", icon: "🏦" },
  { type: "SAVINGS", color: "#10b981", icon: "💰" },
  { type: "CREDIT", color: "#ef4444", icon: "💳" },
  { type: "INVESTMENT", color: "#8b5cf6", icon: "📈" },
  { type: "CASH", color: "#f59e0b", icon: "💵" },
] as const;

// Standard expense categories
const EXPENSE_CATEGORIES = [
  { name: "Housing", icon: "🏠", color: "#3b82f6" },
  { name: "Transportation", icon: "🚗", color: "#ef4444" },
  { name: "Food & Dining", icon: "🍽️", color: "#f59e0b" },
  { name: "Groceries", icon: "🛒", color: "#10b981" },
  { name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Healthcare", icon: "⚕️", color: "#06b6d4" },
  { name: "Utilities", icon: "⚡", color: "#84cc16" },
  { name: "Insurance", icon: "🛡️", color: "#6366f1" },
  { name: "Education", icon: "📚", color: "#f97316" },
];

// Income categories
const INCOME_CATEGORIES = [
  { name: "Salary", icon: "💼", color: "#059669" },
  { name: "Freelance", icon: "💻", color: "#7c3aed" },
  { name: "Investment Income", icon: "📊", color: "#dc2626" },
  { name: "Side Hustle", icon: "🚀", color: "#ea580c" },
  { name: "Gifts", icon: "🎁", color: "#be185d" },
];

// Common payees for realistic transactions
const PAYEES = {
  groceries: ["Walmart", "Target", "Kroger", "Safeway", "Whole Foods"],
  restaurants: ["McDonald's", "Starbucks", "Chipotle", "Subway", "Pizza Hut"],
  gas: ["Shell", "Exxon", "BP", "Chevron", "Mobil"],
  utilities: ["Pacific Gas & Electric", "ConEd", "Duke Energy", "ComEd"],
  subscription: ["Netflix", "Spotify", "Amazon Prime", "Adobe", "Microsoft"],
  shopping: ["Amazon", "Best Buy", "Home Depot", "Costco", "Macy's"],
};

async function seedUsers() {
  console.log("🔄 Seeding users...");
  
  const users = [];
  for (let i = 0; i < 3; i++) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        passwordHash: hashedPassword,
      },
    });
    users.push(user);
  }
  
  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function seedCategories(userId: string) {
  console.log("🔄 Seeding categories...");
  
  const categories = [];
  
  // Create expense categories
  for (const cat of EXPENSE_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        kind: "expense",
        userId,
      },
    });
    categories.push(category);
  }
  
  // Create income categories
  for (const cat of INCOME_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        kind: "income",
        userId,
      },
    });
    categories.push(category);
  }
  
  console.log(`✅ Created ${categories.length} categories for user ${userId}`);
  return categories;
}

async function seedAccounts(userId: string) {
  console.log("🔄 Seeding accounts...");
  
  const accounts = [];
  
  // Create 3-5 accounts per user
  const accountCount = faker.number.int({ min: 3, max: 5 });
  for (let i = 0; i < accountCount; i++) {
    const accountType = faker.helpers.arrayElement(ACCOUNT_TYPES);
    
    const account = await prisma.account.create({
      data: {
        name: `${accountType.type.toLowerCase()} ${faker.finance.accountName()}`,
        type: accountType.type,
        currency: "USD",
        balanceCached: faker.number.int({ min: 10000, max: 500000 }), // $100 to $5000 in cents
        color: accountType.color,
        icon: accountType.icon,
        userId,
      },
    });
    accounts.push(account);
  }
  
  console.log(`✅ Created ${accounts.length} accounts for user ${userId}`);
  return accounts;
}

async function seedTransactions(userId: string, accounts: any[], categories: any[]) {
  console.log("🔄 Seeding transactions...");
  
  const transactions = [];
  const expenseCategories = categories.filter(c => c.kind === "expense");
  const incomeCategories = categories.filter(c => c.kind === "income");
  
  // Generate transactions for the last 6 months
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  // Create 50-100 transactions per user
  const transactionCount = faker.number.int({ min: 50, max: 100 });
  
  for (let i = 0; i < transactionCount; i++) {
    const isIncome = faker.datatype.boolean(0.2); // 20% income, 80% expense
    const category = isIncome 
      ? faker.helpers.arrayElement(incomeCategories)
      : faker.helpers.arrayElement(expenseCategories);
    
    const account = faker.helpers.arrayElement(accounts);
    const date = faker.date.between({ from: startDate, to: endDate });
    
    // Generate realistic amounts based on category
    let amount: number;
    let payee: string;
    
    if (isIncome) {
      amount = faker.number.int({ min: 200000, max: 800000 }); // $2000-$8000
      payee = category.name === "Salary" ? "Acme Corp" : faker.company.name();
    } else {
      // Different amounts for different expense types
      switch (category.name) {
        case "Housing":
          amount = -faker.number.int({ min: 120000, max: 300000 }); // $1200-$3000
          payee = "Landlord Property Management";
          break;
        case "Groceries":
          amount = -faker.number.int({ min: 5000, max: 15000 }); // $50-$150
          payee = faker.helpers.arrayElement(PAYEES.groceries);
          break;
        case "Food & Dining":
          amount = -faker.number.int({ min: 1500, max: 8000 }); // $15-$80
          payee = faker.helpers.arrayElement(PAYEES.restaurants);
          break;
        case "Transportation":
          amount = -faker.number.int({ min: 3000, max: 8000 }); // $30-$80
          payee = faker.helpers.arrayElement(PAYEES.gas);
          break;
        case "Utilities":
          amount = -faker.number.int({ min: 8000, max: 25000 }); // $80-$250
          payee = faker.helpers.arrayElement(PAYEES.utilities);
          break;
        case "Shopping":
          amount = -faker.number.int({ min: 2000, max: 50000 }); // $20-$500
          payee = faker.helpers.arrayElement(PAYEES.shopping);
          break;
        case "Entertainment":
          amount = -faker.number.int({ min: 1500, max: 15000 }); // $15-$150
          payee = faker.helpers.arrayElement(PAYEES.subscription);
          break;
        default:
          amount = -faker.number.int({ min: 2000, max: 20000 }); // $20-$200
          payee = faker.company.name();
      }
    }
    
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        payee,
        notes: faker.lorem.sentence({ min: 3, max: 8 }),
        date: date.toISOString(),
        userId,
        accountId: account.id,
        categoryId: category.id,
      },
    });
    transactions.push(transaction);
  }
  
  console.log(`✅ Created ${transactions.length} transactions for user ${userId}`);
  return transactions;
}

async function seedBudgets(userId: string, categories: any[]) {
  console.log("🔄 Seeding budgets...");
  
  const budgets = [];
  const expenseCategories = categories.filter(c => c.kind === "expense");
  
  // Create budgets for most expense categories
  for (const category of expenseCategories.slice(0, 7)) {
    let amount: number;
    
    // Realistic budget amounts by category
    switch (category.name) {
      case "Housing":
        amount = faker.number.int({ min: 150000, max: 350000 }); // $1500-$3500
        break;
      case "Food & Dining":
        amount = faker.number.int({ min: 40000, max: 80000 }); // $400-$800
        break;
      case "Groceries":
        amount = faker.number.int({ min: 30000, max: 60000 }); // $300-$600
        break;
      case "Transportation":
        amount = faker.number.int({ min: 20000, max: 50000 }); // $200-$500
        break;
      default:
        amount = faker.number.int({ min: 10000, max: 30000 }); // $100-$300
    }
    
    const budget = await prisma.budget.create({
      data: {
        month: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        plannedAmount: amount,
        userId,
        categoryId: category.id,
      },
    });
    budgets.push(budget);
  }
  
  console.log(`✅ Created ${budgets.length} budgets for user ${userId}`);
  return budgets;
}

async function seedGoals(userId: string) {
  console.log("🔄 Seeding goals...");
  
  const goals = [];
  const goalTypes = [
    { name: "Emergency Fund", amount: 1000000, icon: "🚨" }, // $10,000
    { name: "Vacation", amount: 500000, icon: "✈️" }, // $5,000
    { name: "New Car", amount: 2500000, icon: "🚗" }, // $25,000
    { name: "Home Down Payment", amount: 5000000, icon: "🏠" }, // $50,000
  ];
  
  // Create 2-3 goals per user
  const selectedGoals = faker.helpers.arrayElements(goalTypes, { min: 2, max: 3 });
  
  for (const goalType of selectedGoals) {
    const targetDate = faker.date.future({ years: 2 });
    const progress = faker.number.int({ min: 0, max: goalType.amount * 0.6 });
    
    const goal = await prisma.goal.create({
      data: {
        name: goalType.name,
        targetAmount: goalType.amount,
        progressCached: progress,
        targetDate: targetDate.toISOString(),
        userId,
      },
    });
    goals.push(goal);
  }
  
  console.log(`✅ Created ${goals.length} goals for user ${userId}`);
  return goals;
}

async function seedBills(userId: string, categories: any[]) {
  console.log("🔄 Seeding bills...");
  
  const bills = [];
  const recurringCategories = categories.filter(c => 
    ["Utilities", "Insurance", "Housing"].includes(c.name)
  );
  
  for (const category of recurringCategories) {
    let amount: number;
    let name: string;
    
    switch (category.name) {
      case "Housing":
        amount = faker.number.int({ min: 120000, max: 300000 }); // $1200-$3000
        name = "Rent/Mortgage";
        break;
      case "Utilities":
        amount = faker.number.int({ min: 8000, max: 20000 }); // $80-$200
        name = "Electric Bill";
        break;
      case "Insurance":
        amount = faker.number.int({ min: 15000, max: 40000 }); // $150-$400
        name = "Car Insurance";
        break;
      default:
        amount = faker.number.int({ min: 5000, max: 15000 }); // $50-$150
        name = category.name;
    }
    
    const dueDate = faker.number.int({ min: 1, max: 28 }); // Day of month
    
    const bill = await prisma.bill.create({
      data: {
        name,
        amount,
        dueDay: dueDate,
        userId,
      },
    });
    bills.push(bill);
  }
  
  console.log(`✅ Created ${bills.length} bills for user ${userId}`);
  return bills;
}

async function main() {
  console.log("🚀 Starting database seed...");
  
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🔄 Clearing existing data...");
    await prisma.transaction.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.bill.deleteMany();
    await prisma.category.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    
    const users = await seedUsers();
    
    for (const user of users) {
      console.log(`\n👤 Seeding data for user: ${user.email}`);
      
      const categories = await seedCategories(user.id);
      const accounts = await seedAccounts(user.id);
      const transactions = await seedTransactions(user.id, accounts, categories);
      const budgets = await seedBudgets(user.id, categories);
      const goals = await seedGoals(user.id);
      const bills = await seedBills(user.id, categories);
    }
    
    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Categories: ${EXPENSE_CATEGORIES.length + INCOME_CATEGORIES.length} per user`);
    console.log(`   Accounts: 3-5 per user`);
    console.log(`   Transactions: 50-100 per user`);
    console.log(`   Budgets: ~7 per user`);
    console.log(`   Goals: 2-3 per user`);
    console.log(`   Bills: 3-4 per user`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { main as seed };
