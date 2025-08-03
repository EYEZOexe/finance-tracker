import { render, screen } from "@testing-library/react";
import React from "react";
import Page from "@/app/page";

describe("app", () => {
  it("renders homepage heading", () => {
    render(<Page />);
    expect(screen.getByText(/Finance Tracker/i)).toBeInTheDocument();
  });
});