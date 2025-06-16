import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, categoryEmojis, categoryColors, expenseCategories, incomeCategories } from "@/lib/utils";
import { List, Edit, Trash2 } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({
        title: "支出を削除しました",
        description: "支出が正常に削除されました。",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "エラーが発生しました",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "all" || expense.category === categoryFilter;
    
    let matchesTime = true;
    if (timeFilter === "today") {
      const today = new Date();
      const expenseDate = new Date(expense.date);
      matchesTime = today.toDateString() === expenseDate.toDateString();
    } else if (timeFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesTime = new Date(expense.date) >= weekAgo;
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  const filteredTotal = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDelete = (id: number, type: string) => {
    const recordType = type === "income" ? "収入" : "支出";
    if (confirm(`この${recordType}を削除してもよろしいですか？`)) {
      deleteExpenseMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <List className="text-primary mr-2" />
              支出履歴
            </h2>
            <div className="flex space-x-2">
              <Button
                variant={timeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("all")}
              >
                すべて
              </Button>
              <Button
                variant={timeFilter === "today" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("today")}
              >
                今日
              </Button>
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("week")}
              >
                今週
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="支出を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="すべてのカテゴリ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのカテゴリ</SelectItem>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
                {incomeCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredExpenses.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {expenses.length === 0 ? "まだ支出が記録されていません" : "条件に一致する支出がありません"}
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">{categoryEmojis[expense.category]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Badge className={`mr-2 ${categoryColors[expense.category]}`}>
                          {expense.category}
                        </Badge>
                        <span>{formatDate(expense.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-semibold text-lg ${
                      expense.type === "income" ? "text-green-600" : "text-gray-900"
                    }`}>
                      {expense.type === "income" ? "+" : "-"}{formatCurrency(expense.amount)}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-primary"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-destructive"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleteExpenseMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              合計: {filteredExpenses.length}件の支出
            </span>
            <span className="font-semibold text-lg">{formatCurrency(filteredTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
