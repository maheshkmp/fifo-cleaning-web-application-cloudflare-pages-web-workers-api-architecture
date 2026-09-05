ALTER TABLE "quote_requests" ADD COLUMN "quoted_amount" integer;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "quoted_message" text;--> statement-breakpoint
ALTER TABLE "quote_requests" ADD COLUMN "quoted_at" timestamp;