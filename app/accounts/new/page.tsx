import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AccountForm } from "../account-form";
import { createAccount } from "../actions";

export const metadata = {
  title: "New Account",
};

export default function NewAccountPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/accounts">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Account</h1>
      </div>

      <div className="border rounded-lg p-6">
        <AccountForm action={createAccount} submitLabel="Create Account" />
      </div>
    </div>
  );
}
