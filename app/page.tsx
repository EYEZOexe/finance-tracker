import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
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
        
        <Button asChild variant="outline" className="h-24 flex flex-col gap-2" disabled>
          <div>
            <span className="text-2xl">💳</span>
            <span>Transactions (Coming Soon)</span>
          </div>
        </Button>
      </div>
    </main>
  );
}
