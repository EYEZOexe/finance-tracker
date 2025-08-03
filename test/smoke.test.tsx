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

  it("shows transactions as coming soon", () => {
    render(<Page />);
    expect(screen.getByText("Transactions (Coming Soon)")).toBeInTheDocument();
  });

  it("has proper navigation structure", () => {
    render(<Page />);
    // Check that we have navigation buttons for implemented features
    const accountsButton = screen.getByRole("link", { name: /accounts/i });
    const categoriesButton = screen.getByRole("link", { name: /categories/i });
    
    expect(accountsButton).toHaveAttribute("href", "/accounts");
    expect(categoriesButton).toHaveAttribute("href", "/categories");
  });
});