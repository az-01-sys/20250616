import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export const categoryEmojis: Record<string, string> = {
  '食費': '🍽️',
  '交通費': '🚊',
  '娯楽': '🎮',
  '光熱費': '💡',
  '通信費': '📱',
  '医療費': '🏥',
  '衣類': '👕',
  'その他': '📦',
  '給与': '💰',
  '副業': '💼',
  '投資': '📈',
  'ボーナス': '🎁',
  '年金': '🏛️',
  '収入その他': '💵',
};

export const categoryColors: Record<string, string> = {
  '食費': 'bg-blue-100 text-blue-800',
  '交通費': 'bg-green-100 text-green-800',
  '娯楽': 'bg-purple-100 text-purple-800',
  '光熱費': 'bg-yellow-100 text-yellow-800',
  '通信費': 'bg-indigo-100 text-indigo-800',
  '医療費': 'bg-red-100 text-red-800',
  '衣類': 'bg-pink-100 text-pink-800',
  'その他': 'bg-gray-100 text-gray-800',
  '給与': 'bg-emerald-100 text-emerald-800',
  '副業': 'bg-teal-100 text-teal-800',
  '投資': 'bg-cyan-100 text-cyan-800',
  'ボーナス': 'bg-amber-100 text-amber-800',
  '年金': 'bg-slate-100 text-slate-800',
  '収入その他': 'bg-lime-100 text-lime-800',
};

export const expenseCategories = [
  { value: '食費', label: '🍽️ 食費' },
  { value: '交通費', label: '🚊 交通費' },
  { value: '娯楽', label: '🎮 娯楽' },
  { value: '光熱費', label: '💡 光熱費' },
  { value: '通信費', label: '📱 通信費' },
  { value: '医療費', label: '🏥 医療費' },
  { value: '衣類', label: '👕 衣類' },
  { value: 'その他', label: '📦 その他' },
];

export const incomeCategories = [
  { value: '給与', label: '💰 給与' },
  { value: '副業', label: '💼 副業' },
  { value: '投資', label: '📈 投資' },
  { value: 'ボーナス', label: '🎁 ボーナス' },
  { value: '年金', label: '🏛️ 年金' },
  { value: '収入その他', label: '💵 収入その他' },
];
