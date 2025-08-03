import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CategoryForm } from "../../category-form";
import { updateCategory, getCategory } from "../../actions";

export const metadata = {
  title: "Edit Category",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/categories">← Back</Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
      </div>

      <div className="border rounded-lg p-6">
        <CategoryForm
          action={updateCategory}
          defaultValues={{
            id: category.id,
            name: category.name,
            kind: category.kind,
          }}
          submitLabel="Update Category"
        />
      </div>
    </div>
  );
}
