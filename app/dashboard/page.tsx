import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/components/auth/authenticated-layout";

export default function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Finance Tracker</h1>
          <p className="text-muted-foreground mt-2">Welcome. Start by setting up accounts, categories, and importing CSVs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button asChild className="h-24 flex flex-col gap-2">
            <Link href="/accounts">
              <span className="text-2xl">🏦</span>
              <span>Accounts</span>
            </Link>
          </Button>
          
          <Button asChild className="h-24 flex flex-col gap-2">
            <Link href="/categories">
              <span className="text-2xl">📊</span>
              <span>Categories</span>
            </Link>
          </Button>
          
          <Button asChild className="h-24 flex flex-col gap-2">
            <Link href="/transactions">
              <span className="text-2xl">💳</span>
              <span>Transactions</span>
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-24 flex flex-col gap-2">
            <Link href="/import">
              <span className="text-2xl">📥</span>
              <span>Import CSV</span>
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-24 flex flex-col gap-2">
            <Link href="/budgets">
              <span className="text-2xl">💰</span>
              <span>Budgets</span>
            </Link>
          </Button>
          
          <Button asChild variant="secondary" className="h-24 flex flex-col gap-2">
            <Link href="/reports">
              <span className="text-2xl">📈</span>
              <span>Reports</span>
            </Link>
          </Button>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
