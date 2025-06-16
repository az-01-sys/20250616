import { useQuery } from "@tanstack/react-query";
import type { Expense } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "lucide-react";
import ExpenseForm from "@/components/expense-form";
import ExpenseList from "@/components/expense-list";
import ExpenseStats from "@/components/expense-stats";

export default function ExpenseDashboard() {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             expense.type === "expense";
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyIncome = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             expense.type === "income";
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const netAmount = monthlyIncome - monthlyExpenses;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="text-2xl" />
              <h1 className="text-2xl font-bold">家計管理</h1>
            </div>
            <div className="grid grid-cols-3 gap-4 text-right">
              <div>
                <p className="text-sm opacity-90">今月の収入</p>
                <p className="text-xl font-bold text-green-300">+{formatCurrency(monthlyIncome)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">今月の支出</p>
                <p className="text-xl font-bold text-red-300">-{formatCurrency(monthlyExpenses)}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">収支</p>
                <p className={`text-xl font-bold ${netAmount >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {netAmount >= 0 ? '+' : ''}{formatCurrency(netAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ExpenseForm />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseList expenses={expenses} />
          </div>
          <div>
            <ExpenseStats expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}
