import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "../category-form";
import { createCategory } from "../actions";

export const metadata = {
  title: "New Category",
};

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/categories">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
      </div>

      <div className="border rounded-lg p-6">
        <CategoryForm action={createCategory} submitLabel="Create Category" />
      </div>
    </div>
  );
}
