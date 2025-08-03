"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategory } from "./actions";

interface DeleteCategoryButtonProps {
  categoryId: string;
  hasTransactions: boolean;
  hasBudgets: boolean;
}

export function DeleteCategoryButton({
  categoryId,
  hasTransactions,
  hasBudgets,
}: DeleteCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canDelete = !hasTransactions && !hasBudgets;
  const disabledReason = hasTransactions 
    ? "Cannot delete category with transactions"
    : hasBudgets
    ? "Cannot delete category with budgets"
    : "";

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteCategory(categoryId);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!canDelete}
          title={canDelete ? "Delete category" : disabledReason}
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            category.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
