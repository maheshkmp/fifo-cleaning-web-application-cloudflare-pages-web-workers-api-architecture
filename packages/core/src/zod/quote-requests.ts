import { z } from "zod";

// ── Service type enum ──────────────────────────────────────────────────────

export const serviceTypeEnum = z.enum([
  "house_cleaning",
  "office_cleaning",
  "moving_cleaning",
  "deep_cleaning",
]);

export type ServiceType = z.infer<typeof serviceTypeEnum>;

// Human-readable labels for use in UI selects / API responses
export const serviceTypeLabels: Record<ServiceType, string> = {
  house_cleaning:   "House Cleaning",
  office_cleaning:  "Office Cleaning",
  moving_cleaning:  "Moving Cleaning",
  deep_cleaning:    "Deep Cleaning",
};

// ── Quote request status enum ──────────────────────────────────────────────

export const quoteStatusEnum = z.enum(["pending", "quoted", "closed"]);
export type QuoteStatus = z.infer<typeof quoteStatusEnum>;

// ── Create schema (form → API) ─────────────────────────────────────────────

export const createQuoteRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("A valid email address is required"),
  phone: z.string().min(7, "A valid phone number is required"),
  serviceType: serviceTypeEnum,
  propertySizeSqft: z
    .number()
    .int("Property size must be a whole number")
    .min(50, "Property size must be at least 50 sq ft")
    .max(50000, "Property size must be 50 000 sq ft or less"),
  message: z.string().max(2000, "Message must be 2000 characters or fewer").optional(),
});

export type CreateQuoteRequest = z.infer<typeof createQuoteRequestSchema>;

// ── Read schema (DB row → API response) ───────────────────────────────────

export const quoteRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  serviceType: serviceTypeEnum,
  propertySizeSqft: z.number().int().positive(),
  message: z.string().nullable(),
  status: quoteStatusEnum,
  // Admin quote fields — null until an admin sends a quote
  quotedAmount: z.number().int().nullable(),   // stored in öre (1/100 SEK)
  quotedMessage: z.string().nullable(),
  quotedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

// ── Admin: update status ───────────────────────────────────────────────────

export const updateQuoteStatusSchema = z.object({
  status: quoteStatusEnum,
});

export type UpdateQuoteStatus = z.infer<typeof updateQuoteStatusSchema>;

// ── Admin: send quote (attach amount + message) ───────────────────────────
// quotedAmount is required and must be a positive integer in öre (1/100 SEK).
// Example: to quote 1 500 SEK, send quotedAmount: 150000.

export const sendQuoteSchema = z.object({
  quotedAmount: z
    .number()
    .int("Amount must be a whole number of öre")
    .positive("Amount must be greater than zero"),
  quotedMessage: z
    .string()
    .max(2000, "Message must be 2000 characters or fewer")
    .optional(),
});

export type SendQuote = z.infer<typeof sendQuoteSchema>;

// ── List / filter ──────────────────────────────────────────────────────────

export const listQuoteRequestsQuerySchema = z.object({
  status: quoteStatusEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ListQuoteRequestsQuery = z.infer<typeof listQuoteRequestsQuerySchema>;
