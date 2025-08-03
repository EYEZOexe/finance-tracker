"use client";

import { useState, useEffect } from "react";
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
import { getAccountsForSelect, getCategoriesForSelect } from "./actions";
import { getCategoryVisual } from "@/lib/category-constants";
import { formatDateForInput } from "@/lib/transaction-utils";

interface TransactionFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    id?: string;
    accountId?: string;
    categoryId?: string;
    amount?: number;
    date?: Date;
    payee?: string;
    notes?: string;
    isRecurring?: boolean;
    rrule?: string;
  };
  submitLabel: string;
}

export function TransactionForm({
  action,
  defaultValues,
  submitLabel,
}: TransactionFormProps) {
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
  const [selectedAccount, setSelectedAccount] = useState(defaultValues?.accountId || "");
  const [selectedCategory, setSelectedCategory] = useState(defaultValues?.categoryId || "");
  const [amount, setAmount] = useState(
    defaultValues?.amount ? (defaultValues.amount / 100).toString() : ""
  );

  useEffect(() => {
    Promise.all([
      getAccountsForSelect(),
      getCategoriesForSelect(),
    ]).then(([accountsData, categoriesData]) => {
      setAccounts(accountsData);
      setCategories(categoriesData);
    });
  }, []);

  const isIncome = parseFloat(amount) > 0;
  const filteredCategories = isIncome 
    ? categories.filter(cat => cat.kind === "income")
    : categories.filter(cat => cat.kind === "expense");

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payee">Payee</Label>
          <Input
            id="payee"
            name="payee"
            defaultValue={defaultValues?.payee}
            placeholder="e.g., Starbucks, Salary, Grocery Store"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            name="amount"
            required
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Use positive numbers for income, negative for expenses
          </p>
          {/* Hidden field with amount in cents */}
          <input
            type="hidden"
            name="amount"
            value={Math.round(parseFloat(amount || "0") * 100)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="account">Account *</Label>
          <Select
            name="accountId"
            value={selectedAccount}
            onValueChange={setSelectedAccount}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ backgroundColor: account.color || "#6b7280" }}
                    >
                      {account.icon || "💳"}
                    </div>
                    <div>
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({account.type})
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category ({isIncome ? "Income" : "Expense"})
          </Label>
          <Select
            name="categoryId"
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category (optional)" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((category) => {
                const visual = getCategoryVisual(category.name, category.kind);
                return (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: visual?.color || "#6b7280" }}
                      >
                        {visual?.icon || "📁"}
                      </div>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {amount && (
            <p className="text-xs text-muted-foreground">
              Showing {isIncome ? "income" : "expense"} categories based on amount
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={
            defaultValues?.date
              ? formatDateForInput(defaultValues.date)
              : formatDateForInput(new Date())
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input
          id="notes"
          name="notes"
          defaultValue={defaultValues?.notes}
          placeholder="Additional details about this transaction"
        />
      </div>

      {/* Transaction Preview */}
      {amount && selectedAccount && (
        <div className="p-4 border rounded-lg">
          <Label>Preview</Label>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ 
                    backgroundColor: accounts.find(a => a.id === selectedAccount)?.color || "#6b7280" 
                  }}
                >
                  {accounts.find(a => a.id === selectedAccount)?.icon || "💳"}
                </div>
                <span className="font-medium">
                  {accounts.find(a => a.id === selectedAccount)?.name}
                </span>
              </div>
              {selectedCategory && (
                <>
                  <span>→</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                      style={{ 
                        backgroundColor: getCategoryVisual(
                          categories.find(c => c.id === selectedCategory)?.name || "",
                          categories.find(c => c.id === selectedCategory)?.kind || "expense"
                        )?.color || "#6b7280" 
                      }}
                    >
                      {getCategoryVisual(
                        categories.find(c => c.id === selectedCategory)?.name || "",
                        categories.find(c => c.id === selectedCategory)?.kind || "expense"
                      )?.icon || "📁"}
                    </div>
                    <span className="font-medium">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className={`font-mono font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
              {isIncome ? "+" : "-"}${Math.abs(parseFloat(amount || "0")).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
