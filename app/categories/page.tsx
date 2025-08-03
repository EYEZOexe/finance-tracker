import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "./actions";
import { DeleteCategoryButton } from "./delete-category-button";
import { getCategoryVisual } from "@/lib/category-constants";
import AuthenticatedLayout from "@/components/auth/authenticated-layout";

export const metadata = {
  title: "Categories",
};

async function CategoriesList() {
  const categories = await getCategories();

  const incomeCategories = categories.filter(cat => cat.kind === "income");
  const expenseCategories = categories.filter(cat => cat.kind === "expense");

  function CategoryTable({ categories: cats, type }: { categories: typeof categories; type: "income" | "expense" }) {
    if (cats.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No {type} categories found</p>
          <Button asChild>
            <Link href="/categories/new">Create your first {type} category</Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Budgets</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cats.map((category) => {
              const visual = getCategoryVisual(category.name, category.kind);
              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: visual?.color || "#6b7280" }}
                      >
                        {visual?.icon || "📁"}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <Badge variant={category.kind === "income" ? "default" : "secondary"} className="text-xs">
                          {category.kind}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {category._count.txns} transactions
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {category._count.budgets} budgets
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/categories/${category.id}/edit`}>Edit</Link>
                      </Button>
                      <DeleteCategoryButton
                        categoryId={category.id}
                        hasTransactions={category._count.txns > 0}
                        hasBudgets={category._count.budgets > 0}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <Button asChild>
          <Link href="/categories/new">Add Category</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All ({categories.length})</TabsTrigger>
          <TabsTrigger value="income">Income ({incomeCategories.length})</TabsTrigger>
          <TabsTrigger value="expense">Expense ({expenseCategories.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <CategoryTable categories={categories} type="income" />
        </TabsContent>
        
        <TabsContent value="income">
          <CategoryTable categories={incomeCategories} type="income" />
        </TabsContent>
        
        <TabsContent value="expense">
          <CategoryTable categories={expenseCategories} type="expense" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<div>Loading categories...</div>}>
        <CategoriesList />
      </Suspense>
    </AuthenticatedLayout>
  );
}
