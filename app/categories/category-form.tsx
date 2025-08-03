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
import { getCategoryVisual, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/category-constants";

interface CategoryFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    id?: string;
    name?: string;
    kind?: string;
  };
  submitLabel: string;
}

export function CategoryForm({
  action,
  defaultValues,
  submitLabel,
}: CategoryFormProps) {
  const [selectedKind, setSelectedKind] = useState(
    (defaultValues?.kind as "income" | "expense") || "expense"
  );
  const [categoryName, setCategoryName] = useState(defaultValues?.name || "");

  const predefinedCategories = selectedKind === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const visual = getCategoryVisual(categoryName, selectedKind);

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="space-y-2">
        <Label htmlFor="kind">Category Type</Label>
        <Select
          name="kind"
          value={selectedKind}
          onValueChange={(value) => setSelectedKind(value as "income" | "expense")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>Income</span>
              </div>
            </SelectItem>
            <SelectItem value="expense">
              <div className="flex items-center gap-2">
                <span>💸</span>
                <span>Expense</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          required
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
      </div>

      {/* Quick Select from Predefined Categories */}
      <div className="space-y-2">
        <Label>Quick Select ({selectedKind} categories)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {predefinedCategories.map((category) => (
            <button
              key={category.name}
              type="button"
              className={`p-3 rounded-lg border text-left hover:bg-accent ${
                categoryName === category.name
                  ? "border-primary bg-primary/10"
                  : "border-border"
              }`}
              onClick={() => setCategoryName(category.name)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ backgroundColor: category.color }}
                >
                  {category.icon}
                </span>
                <span className="text-sm font-medium">{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Preview */}
      {categoryName && (
        <div className="p-4 border rounded-lg">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: visual?.color || "#6b7280" }}
            >
              {visual?.icon || "📁"}
            </div>
            <div>
              <div className="font-medium">{categoryName}</div>
              <div className="text-sm text-muted-foreground capitalize">
                {selectedKind} category
              </div>
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
