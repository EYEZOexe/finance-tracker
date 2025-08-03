import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "../transaction-form";
import { createTransaction } from "../actions";

export const metadata = {
  title: "New Transaction",
};

export default function NewTransactionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Transaction</h1>
      </div>

      <div className="border rounded-lg p-6">
        <TransactionForm action={createTransaction} submitLabel="Create Transaction" />
      </div>
    </div>
  );
}
