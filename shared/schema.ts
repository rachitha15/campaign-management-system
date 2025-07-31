import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "trigger-based" | "one-time"
  status: text("status").notNull().default("Active"),
  programId: text("program_id"), // reference to programs table for trigger-based campaigns
  triggerEvent: text("trigger_event"), // event name for trigger-based campaigns
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const burnRules = pgTable("burn_rules", {
  id: serial("id").primaryKey(),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  expiryDays: integer("expiry_days").notNull(),
  expiryPeriod: text("expiry_period").notNull(),
  minimumOrderValue: real("minimum_order_value"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  campaignId: text("campaign_id").notNull().references(() => campaigns.id, { onDelete: "cascade" }),
  partnerUserId: text("partner_user_id"),
  contact: text("contact"),
  amount: real("amount").default(0),
  loadId: text("load_id"),
  errorReason: text("error_reason"),
  processed: boolean("processed").notNull().default(false),
});

export const programs = pgTable("programs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  purpose: text("purpose").notNull(), // "promotions" | "loyalty"
  inputType: text("input_type").notNull(), // "event" | "file"
  expiryDays: integer("expiry_days").notNull(),
  minimumOrderValue: real("minimum_order_value"),
  fileFormatId: text("file_format_id"), // for file-based programs
  status: text("status").notNull().default("active"), // "active" | "inactive"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  name: true,
  type: true,
  programId: true,
  triggerEvent: true,
});

export const insertBurnRuleSchema = createInsertSchema(burnRules).pick({
  campaignId: true,
  expiryDays: true,
  expiryPeriod: true,
  minimumOrderValue: true,
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  campaignId: true,
  partnerUserId: true,
  contact: true,
  amount: true,
  loadId: true,
  errorReason: true,
});

export const insertProgramSchema = createInsertSchema(programs).pick({
  name: true,
  purpose: true,
  inputType: true,
  expiryDays: true,
  minimumOrderValue: true,
  fileFormatId: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertBurnRule = z.infer<typeof insertBurnRuleSchema>;
export type BurnRule = typeof burnRules.$inferSelect;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;
