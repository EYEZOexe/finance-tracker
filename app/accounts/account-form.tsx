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
  ACCOUNT_TYPES,
  ACCOUNT_COLORS,
  ACCOUNT_ICONS,
  CURRENCIES,
} from "@/lib/account-constants";

interface AccountFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    id?: string;
    name?: string;
    type?: string;
    currency?: string;
    institution?: string;
    numberMasked?: string;
    color?: string;
    icon?: string;
  };
  submitLabel: string;
}

export function AccountForm({
  action,
  defaultValues,
  submitLabel,
}: AccountFormProps) {
  const [selectedType, setSelectedType] = useState(
    defaultValues?.type || "CHECKING"
  );
  const [selectedColor, setSelectedColor] = useState(
    defaultValues?.color ||
      ACCOUNT_TYPES.find((t) => t.value === selectedType)?.color ||
      ACCOUNT_COLORS[0]
  );
  const [selectedIcon, setSelectedIcon] = useState(
    defaultValues?.icon ||
      ACCOUNT_TYPES.find((t) => t.value === selectedType)?.icon ||
      ACCOUNT_ICONS[0]
  );

  function handleTypeChange(value: string) {
    setSelectedType(value);
    const accountType = ACCOUNT_TYPES.find((t) => t.value === value);
    if (accountType && !defaultValues?.color) {
      setSelectedColor(accountType.color);
    }
    if (accountType && !defaultValues?.icon) {
      setSelectedIcon(accountType.icon);
    }
  }

  return (
    <form action={action} className="space-y-6">
      {defaultValues?.id && (
        <input type="hidden" name="id" value={defaultValues.id} />
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Account Name</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="My Checking Account"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Account Type</Label>
        <Select
          name="type"
          value={selectedType}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution (Optional)</Label>
          <Input
            id="institution"
            name="institution"
            defaultValue={defaultValues?.institution}
            placeholder="Bank of America"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberMasked">Account Number (Optional)</Label>
          <Input
            id="numberMasked"
            name="numberMasked"
            defaultValue={defaultValues?.numberMasked}
            placeholder="****1234"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select name="currency" defaultValue={defaultValues?.currency || "USD"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Color & Icon</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Color Selection */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <input type="hidden" name="color" value={selectedColor} />
            <div className="grid grid-cols-5 gap-2">
              {ACCOUNT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-foreground"
                      : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <input type="hidden" name="icon" value={selectedIcon} />
            <div className="grid grid-cols-4 gap-2">
              {ACCOUNT_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`w-10 h-10 rounded border flex items-center justify-center text-lg ${
                    selectedIcon === icon
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                  onClick={() => setSelectedIcon(icon)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 border rounded-lg">
          <Label>Preview</Label>
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: selectedColor }}
            >
              {selectedIcon}
            </div>
            <div>
              <div className="font-medium">
                {defaultValues?.name || "Account Name"}
              </div>
              <div className="text-sm text-muted-foreground">
                {ACCOUNT_TYPES.find((t) => t.value === selectedType)?.label}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
