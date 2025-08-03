import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AccountForm } from "../../account-form";
import { updateAccount, getAccount } from "../../actions";

export const metadata = {
  title: "Edit Account",
};

interface EditAccountPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAccountPage({ params }: EditAccountPageProps) {
  const { id } = await params;
  const account = await getAccount(id);

  if (!account) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/accounts">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Account</h1>
      </div>

      <div className="border rounded-lg p-6">
        <AccountForm
          action={updateAccount}
          defaultValues={{
            id: account.id,
            name: account.name,
            type: account.type,
            currency: account.currency,
            institution: account.institution || undefined,
            numberMasked: account.numberMasked || undefined,
            color: account.color || undefined,
            icon: account.icon || undefined,
          }}
          submitLabel="Update Account"
        />
      </div>
    </div>
  );
}
