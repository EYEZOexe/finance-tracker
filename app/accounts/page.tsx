import { Suspense } from "react";
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
import { getAccounts } from "./actions";
import { DeleteAccountButton } from "./delete-account-button";

export const metadata = {
  title: "Accounts",
};

function formatCurrency(cents: number | null) {
  if (cents === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

async function AccountsList() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <Button asChild>
          <Link href="/accounts/new">Add Account</Link>
        </Button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No accounts found</p>
          <Button asChild>
            <Link href="/accounts/new">Create your first account</Link>
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: account.color || "#6b7280" }}
                      >
                        {account.icon || "💳"}
                      </div>
                      <div>
                        <div className="font-medium">{account.name}</div>
                        {account.numberMasked && (
                          <div className="text-sm text-muted-foreground">
                            {account.numberMasked}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{account.type}</Badge>
                  </TableCell>
                  <TableCell>{account.institution || "—"}</TableCell>
                  <TableCell className="font-mono">
                    {formatCurrency(account.balanceCached)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {account._count.transactions} transactions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/accounts/${account.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteAccountButton
                        accountId={account.id}
                        hasTransactions={account._count.transactions > 0}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div>Loading accounts...</div>}>
      <AccountsList />
    </Suspense>
  );
}
