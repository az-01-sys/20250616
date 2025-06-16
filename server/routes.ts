import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all expenses
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "支出データの取得に失敗しました" });
    }
  });

  // Get single expense
  app.get("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      const expense = await storage.getExpense(id);
      if (!expense) {
        return res.status(404).json({ message: "支出が見つかりません" });
      }

      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "支出データの取得に失敗しました" });
    }
  });

  // Create new expense
  app.post("/api/expenses", async (req, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "入力データが無効です",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "支出の作成に失敗しました" });
    }
  });

  // Update expense
  app.put("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      const updateSchema = insertExpenseSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      
      const expense = await storage.updateExpense(id, validatedData);
      if (!expense) {
        return res.status(404).json({ message: "支出が見つかりません" });
      }

      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "入力データが無効です",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "支出の更新に失敗しました" });
    }
  });

  // Delete expense
  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "無効なIDです" });
      }

      const deleted = await storage.deleteExpense(id);
      if (!deleted) {
        return res.status(404).json({ message: "支出が見つかりません" });
      }

      res.json({ message: "支出を削除しました" });
    } catch (error) {
      res.status(500).json({ message: "支出の削除に失敗しました" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
