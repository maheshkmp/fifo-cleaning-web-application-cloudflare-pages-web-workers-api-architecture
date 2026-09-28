import { describe, expect, it } from "bun:test";
import { createQuoteRequestSchema } from "../src/zod/quote-requests";

describe("createQuoteRequestSchema Validation", () => {
  it("should validate a correct quote request payload", () => {
    const validData = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+46701234567",
      serviceType: "house_cleaning",
      propertySizeSqft: 120,
      message: "Looking forward to working with you.",
    };

    const result = createQuoteRequestSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid email and property size", () => {
    const invalidData = {
      name: "J",
      email: "not-an-email",
      phone: "123",
      serviceType: "invalid_service",
      propertySizeSqft: 10,
    };

    const result = createQuoteRequestSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
