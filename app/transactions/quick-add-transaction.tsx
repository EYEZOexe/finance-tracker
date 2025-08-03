"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { quickAddTransaction, getAccountsForSelect, getCategoriesForSelect } from "./actions";
import { getCategoryVisual } from "@/lib/category-constants";
import { useEffect } from "react";

export function QuickAddTransaction() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accounts, setAccounts] = useState<Array<{
    id: string;
    name: string;
    type: string;
    color: string | null;
    icon: string | null;
  }>>([]);
  const [categories, setCategories] = useState<Array<{
    id: string;
    name: string;
    kind: "income" | "expense";
  }>>([]);

  useEffect(() => {
    if (open) {
      Promise.all([
        getAccountsForSelect(),
        getCategoriesForSelect(),
      ]).then(([accountsData, categoriesData]) => {
        setAccounts(accountsData);
        setCategories(categoriesData);
      });
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      await quickAddTransaction(formData);
      setOpen(false);
      // Reset form
      event.currentTarget.reset();
    } catch (error) {
      console.error("Failed to add transaction:", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          ⚡ Quick Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Transaction</DialogTitle>
          <DialogDescription>
            Quickly add a transaction with today&apos;s date.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-payee">Payee *</Label>
            <Input
              id="quick-payee"
              name="payee"
              required
              placeholder="e.g., Starbucks, Grocery Store"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-amount">Amount *</Label>
            <Input
              id="quick-amount"
              name="amount"
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Use positive numbers for income, negative for expenses
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-account">Account *</Label>
            <Select name="accountId" required>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: account.color || "#6b7280" }}
                      >
                        {account.icon || "💳"}
                      </div>
                      <span>{account.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-category">Category (optional)</Label>
            <Select name="categoryId">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  const visual = getCategoryVisual(category.name, category.kind);
                  return (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                          style={{ backgroundColor: visual?.color || "#6b7280" }}
                        >
                          {visual?.icon || "📁"}
                        </div>
                        <span>{category.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({category.kind})
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
