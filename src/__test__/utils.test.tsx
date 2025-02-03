import { calculateTotals } from "@/utils/calculateTotals";
import { checkRole } from "@/utils/checkRol";
import { formatterCoin } from "@/utils/formaterCoin";
import { describe, expect, test } from "vitest";

describe("calculateTotals", () => {
  test("should correctly calculate the balance", () => {
    const transactions = [
      { type: "INCOME", amount: 1000 },
      { type: "EXPENSE", amount: 300 },
      { type: "INCOME", amount: 500 },
      { type: "EXPENSE", amount: 200 },
    ];

    expect(calculateTotals(transactions)).toBe(1000);
  });

  test("should return 0 if there are no transactions", () => {
    expect(calculateTotals([])).toBe(0);
  });

  test("should handle only income transactions", () => {
    const transactions = [{ type: "INCOME", amount: 700 }];
    expect(calculateTotals(transactions)).toBe(700);
  });

  test("should handle only expense transactions", () => {
    const transactions = [{ type: "EXPENSE", amount: 700 }];
    expect(calculateTotals(transactions)).toBe(-700);
  });
});

describe("checkRole", () => {
  test("should throw an error if the user does not have the required role", () => {
    expect(() => checkRole({ role: "USER" }, "ADMIN")).toThrow("Unauthorized");
  });

  test("should throw an error if the user is undefined", () => {
    expect(() => checkRole(undefined, "ADMIN")).toThrow("No Authenticated");
  });

  test("should not throw an error if the user has the correct role", () => {
    expect(() => checkRole({ role: "ADMIN" }, "ADMIN")).not.toThrow();
  });
});

describe("formatterCoin", () => {
  test("should correctly format Colombian pesos", () => {
    expect(formatterCoin.format(1000).replace(/\s/g, " ")).toBe("$ 1.000");
    expect(formatterCoin.format(5000000).replace(/\s/g, " ")).toBe(
      "$ 5.000.000"
    );
  });

  test("should correctly handle negative numbers", () => {
    expect(formatterCoin.format(-1500).replace(/\s/g, " ")).toBe("-$ 1.500");
  });

  test("should correctly format numbers without decimals", () => {
    expect(formatterCoin.format(123456).replace(/\s/g, " ")).toBe("$ 123.456");
  });
});
