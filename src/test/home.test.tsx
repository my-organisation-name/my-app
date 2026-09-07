import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it } from "vitest";
import { MockAuthProvider } from "@/lib/auth/mock-auth-context";
import Home from "@/app/page";

beforeEach(() => {
  window.localStorage.clear();
});

it("renders the public home page with a sign in button", async () => {
  render(
    <MockAuthProvider>
      <Home />
    </MockAuthProvider>,
  );

  expect(
    await screen.findByRole("button", { name: /sign in/i }),
  ).toBeInTheDocument();
});
