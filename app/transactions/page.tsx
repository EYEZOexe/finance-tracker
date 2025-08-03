import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactions } from "./actions";
import { DeleteTransactionButton } from "./delete-transaction-button";
import { QuickAddTransaction } from "./quick-add-transaction";
import { formatTransactionAmount } from "@/lib/transaction-utils";
import { getCategoryVisual } from "@/lib/category-constants";

export const metadata = {
  title: "Transactions",
};

interface TransactionsListProps {
  searchParams: Promise<{ page?: string }>;
}

async function TransactionsList({ searchParams }: TransactionsListProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const { transactions, pagination } = await getTransactions(currentPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/transactions/new">Add Transaction</Link>
          </Button>
        </div>
      </div>

      {/* Quick Add Transaction */}
      <QuickAddTransaction />

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No transactions found</p>
          <Button asChild>
            <Link href="/transactions/new">Add your first transaction</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => {
                  const { formatted, type } = formatTransactionAmount(transaction.amount);
                  const categoryVisual = transaction.category 
                    ? getCategoryVisual(transaction.category.name, transaction.category.kind)
                    : null;

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="font-mono text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.payee || "—"}</div>
                          {transaction.notes && (
                            <div className="text-sm text-muted-foreground">
                              {transaction.notes}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: transaction.account.color || "#6b7280" }}
                          >
                            {transaction.account.icon || "💳"}
                          </div>
                          <span className="text-sm">{transaction.account.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaction.category ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: categoryVisual?.color || "#6b7280" }}
                            >
                              {categoryVisual?.icon || "📁"}
                            </div>
                            <span className="text-sm">{transaction.category.name}</span>
                          </div>
                        ) : (
                          <Badge variant="outline">Uncategorized</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <span className={type === "income" ? "text-green-600" : "text-red-600"}>
                          {formatted}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/transactions/${transaction.id}/edit`}>Edit</Link>
                          </Button>
                          <DeleteTransactionButton transactionId={transaction.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} transactions
              </p>
              <div className="flex gap-2">
                {pagination.page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/transactions?page=${pagination.page - 1}`}>Previous</Link>
                  </Button>
                )}
                {pagination.page < pagination.totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/transactions?page=${pagination.page + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function TransactionsPage(props: TransactionsListProps) {
  return (
    <Suspense fallback={<div>Loading transactions...</div>}>
      <TransactionsList {...props} />
    </Suspense>
  );
}
