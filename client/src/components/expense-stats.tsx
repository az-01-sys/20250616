import type { Expense } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Calendar, Settings, Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseStatsProps {
  expenses: Expense[];
}

export default function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const { toast } = useToast();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalMonthly = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageDaily = totalMonthly / new Date().getDate();
  const highestExpense = Math.max(...monthlyExpenses.map(e => e.amount), 0);

  const categoryColors = {
    '食費': 'bg-blue-500',
    '交通費': 'bg-green-500',
    '娯楽': 'bg-purple-500',
    '光熱費': 'bg-yellow-500',
    '通信費': 'bg-indigo-500',
    '医療費': 'bg-red-500',
    '衣類': 'bg-pink-500',
    'その他': 'bg-orange-500',
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "データをエクスポートしました",
      description: "支出データがダウンロードされました。",
    });
  };

  const handleClearData = () => {
    if (confirm("すべてのデータを削除してもよろしいですか？この操作は元に戻せません。")) {
      localStorage.removeItem('expenses');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="text-primary mr-2" />
            カテゴリ別支出
          </h3>

          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => {
                const percentage = totalMonthly > 0 ? (amount / totalMonthly) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${categoryColors[category as keyof typeof categoryColors]} rounded-full`}></div>
                        <span className="text-sm">{category}</span>
                      </div>
                      <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`${categoryColors[category as keyof typeof categoryColors]} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="text-primary mr-2" />
            今月の概要
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">総支出</span>
              <span className="font-semibold text-blue-900">{formatCurrency(totalMonthly)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">平均日額</span>
              <span className="font-semibold text-green-900">{formatCurrency(Math.round(averageDaily))}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm text-purple-700">支出回数</span>
              <span className="font-semibold text-purple-900">{monthlyExpenses.length}回</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-sm text-orange-700">最高額</span>
              <span className="font-semibold text-orange-900">{formatCurrency(highestExpense)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="text-primary mr-2" />
            設定
          </h3>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={handleExportData}
            >
              <span className="text-sm">データをエクスポート</span>
              <Download className="h-4 w-4 text-gray-400" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between"
              onClick={() => toast({
                title: "機能準備中",
                description: "インポート機能は準備中です。",
              })}
            >
              <span className="text-sm">データをインポート</span>
              <Upload className="h-4 w-4 text-gray-400" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between text-destructive hover:bg-red-50"
              onClick={handleClearData}
            >
              <span className="text-sm">すべてのデータを削除</span>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
