import { render, screen } from "@testing-library/react";
import React from "react";
import Page from "@/app/page";

describe("app", () => {
  it("renders homepage heading", () => {
    render(<Page />);
    expect(screen.getByText(/Finance Tracker/i)).toBeInTheDocument();
  });

  it("renders navigation to accounts", () => {
    render(<Page />);
    expect(screen.getByText("Accounts")).toBeInTheDocument();
  });

  it("renders navigation to categories", () => {
    render(<Page />);
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("renders navigation to transactions", () => {
    render(<Page />);
    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  it("shows all main features as accessible", () => {
    render(<Page />);
    // Check that implemented features are no longer marked as "coming soon"
    expect(screen.queryByText("Accounts (Coming Soon)")).not.toBeInTheDocument();
    expect(screen.queryByText("Categories (Coming Soon)")).not.toBeInTheDocument();
    expect(screen.queryByText("Transactions (Coming Soon)")).not.toBeInTheDocument();
  });

  it("has proper navigation structure", () => {
    render(<Page />);
    // Check that we have navigation buttons for implemented features
    const accountsButton = screen.getByRole("link", { name: /accounts/i });
    const categoriesButton = screen.getByRole("link", { name: /categories/i });
    const transactionsButton = screen.getByRole("link", { name: /transactions/i });
    
    expect(accountsButton).toHaveAttribute("href", "/accounts");
    expect(categoriesButton).toHaveAttribute("href", "/categories");
    expect(transactionsButton).toHaveAttribute("href", "/transactions");
  });
});