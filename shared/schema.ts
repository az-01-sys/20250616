import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull().default("expense"), // "expense" or "income"
  date: timestamp("date").notNull().defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  date: true,
}).extend({
  amount: z.number().min(1, "金額は1円以上である必要があります"),
  description: z.string().min(1, "説明を入力してください"),
  category: z.string().min(1, "カテゴリを選択してください"),
  type: z.enum(["expense", "income"], { required_error: "タイプを選択してください" }),
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;
