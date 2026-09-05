import { z } from "zod";

export const serviceRequestSchema = z.object({
  clientName: z.string().min(2, "Name is required"),
  clientEmail: z.string().email("Valid email required"),
  clientCompany: z.string().optional(),
  clientWebsite: z.string().url().optional().or(z.literal("")),
  projectType: z.enum(["saas", "landing", "ecommerce", "tool", "portfolio", "other"]),
  projectTitle: z.string().min(3, "Give your project a name"),
  projectDescription: z
    .string()
    .min(50, "Please describe your project in detail (50+ chars)"),
  budgetRange: z.enum(["under500", "500to1k", "1kto3k", "3kto5k", "5kplus"]),
  timeline: z.enum(["asap", "1month", "3months", "flexible"]),
  referralSource: z
    .enum(["google", "social", "friend", "ghostcod_tool", "other"])
    .optional(),
});

export const serviceMessageSchema = z.object({
  requestId: z.string(),
  content: z.string().min(1, "Message cannot be empty"),
  messageType: z
    .enum(["text", "payment_request", "status_update"])
    .default("text"),
  paypalLink: z.string().url().optional(),
  paymentAmount: z.string().optional(),
  paymentDescription: z.string().optional(),
});

export const adminReviewSchema = z.object({
  requestId: z.string(),
  action: z.enum(["approve", "reject"]),
  adminNote: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export const adminUpdateStatusSchema = z.object({
  requestId: z.string(),
  status: z.enum([
    "pending",
    "approved",
    "in_discussion",
    "quoted",
    "paid",
    "in_progress",
    "delivered",
    "rejected",
  ]),
});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;
export type ServiceMessage = z.infer<typeof serviceMessageSchema>;
export type AdminReview = z.infer<typeof adminReviewSchema>;
