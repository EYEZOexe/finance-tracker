import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "../../transaction-form";
import { updateTransaction, getTransaction } from "../../actions";

export const metadata = {
  title: "Edit Transaction",
};

interface EditTransactionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTransactionPage({ params }: EditTransactionPageProps) {
  const { id } = await params;
  const transaction = await getTransaction(id);

  if (!transaction) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Transaction</h1>
      </div>

      <div className="border rounded-lg p-6">
        <TransactionForm
          action={updateTransaction}
          defaultValues={{
            id: transaction.id,
            accountId: transaction.accountId,
            categoryId: transaction.categoryId || undefined,
            amount: transaction.amount,
            date: transaction.date,
            payee: transaction.payee || undefined,
            notes: transaction.notes || undefined,
            isRecurring: transaction.isRecurring,
            rrule: transaction.rrule || undefined,
          }}
          submitLabel="Update Transaction"
        />
      </div>
    </div>
  );
}
