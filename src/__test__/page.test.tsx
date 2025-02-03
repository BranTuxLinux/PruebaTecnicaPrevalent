import { render} from "@testing-library/react";
import { describe, expect, Mock, test, vi } from "vitest";
import { Navigation } from "@/components/template/sidebar";
import Home from "@/app/page";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("Home Component ", () => {
  test("Test Home with auth - ADMIN - SERVER", async () => {
    
    (auth as Mock).mockResolvedValue({
      data: { user: { role: "ADMIN" } },
    });
    const home = await Home();
    const welcomeText = home.props.children.find(
      (child: any) =>
        child.props?.children === "Welcome to Financial Management System"
    );
    expect(welcomeText).toBeTruthy();
  });
  test("Test Home with auth - USER - SERVER", async () => {
    
    (auth as Mock).mockResolvedValue({
      data: { user: { role: "USER" } },
    });
    const home = await Home();
    const welcomeText = home.props.children.find(
      (child: any) =>
        child.props?.children === "Welcome to Financial Management System"
    );
    expect(welcomeText).toBeTruthy();
  });

  test("Test Navigation with Session - ADMIN - CLIENT", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: "ADMIN" } },
    });
    const components = render(<Navigation />);

    const welcomeText = await components.findByText(/Users/i);
    expect(welcomeText).toBeInTheDocument();
  });
  test("Test Navigation with Session - USER - CLIENT ", async () => {
    (useSession as Mock).mockReturnValue({
      data: { user: { role: "USER" } },
    });
    const components = render(<Navigation />);

    const welcomeText = await components.queryByText(/Users/i);
    expect(welcomeText).toBeNull();
  });
});

