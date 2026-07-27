import { useCallback, useMemo, useState } from 'react'
import { useLocalStorage } from './useLocalStorage.js'
import {
  CATEGORIES_KEY,
  DEFAULT_CATEGORIES,
  TRANSACTIONS_KEY,
  UNCATEGORIZED,
  newId,
} from '../lib/seed.js'
import { monthKeyOf } from '../lib/format.js'

export const ALL_MONTHS = 'all'

/**
 * Single source of truth for the app: both stores, all CRUD, and every derived
 * total. Totals are computed from the transaction list, never held in state.
 */
export function useBudgetData() {
  const [transactions, setTransactions] = useLocalStorage(TRANSACTIONS_KEY, [])
  const [categories, setCategories] = useLocalStorage(CATEGORIES_KEY, DEFAULT_CATEGORIES)
  const [selectedMonth, setSelectedMonth] = useState(ALL_MONTHS)

  const addTransaction = useCallback(
    (draft) => {
      setTransactions((prev) => [{ ...draft, id: newId() }, ...prev])
    },
    [setTransactions],
  )

  const updateTransaction = useCallback(
    (id, draft) => {
      setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...draft, id } : t)))
    },
    [setTransactions],
  )

  const deleteTransaction = useCallback(
    (id) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    },
    [setTransactions],
  )

  const addCategory = useCallback(
    (name) => {
      const trimmed = name.trim()
      if (!trimmed) return { ok: false, error: 'Category name cannot be empty.' }
      const clash = categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())
      if (clash) return { ok: false, error: `"${trimmed}" already exists.` }
      setCategories((prev) => [...prev, { id: newId(), name: trimmed, isDefault: false }])
      return { ok: true }
    },
    [categories, setCategories],
  )

  const renameCategory = useCallback(
    (id, nextName) => {
      const trimmed = nextName.trim()
      if (!trimmed) return { ok: false, error: 'Category name cannot be empty.' }
      const current = categories.find((c) => c.id === id)
      if (!current) return { ok: false, error: 'Category not found.' }
      if (current.name === trimmed) return { ok: true }
      const clash = categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === trimmed.toLowerCase(),
      )
      if (clash) return { ok: false, error: `"${trimmed}" already exists.` }

      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c)))
      // Transactions reference categories by name, so carry them across the rename.
      setTransactions((prev) =>
        prev.map((t) => (t.category === current.name ? { ...t, category: trimmed } : t)),
      )
      return { ok: true }
    },
    [categories, setCategories, setTransactions],
  )

  const deleteCategory = useCallback(
    (id) => {
      const target = categories.find((c) => c.id === id)
      if (!target || target.isDefault) return { ok: false, error: 'This category cannot be deleted.' }
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setTransactions((prev) =>
        prev.map((t) => (t.category === target.name ? { ...t, category: UNCATEGORIZED } : t)),
      )
      return { ok: true }
    },
    [categories, setCategories, setTransactions],
  )

  /** How many transactions a category currently holds — drives the delete warning. */
  const countForCategory = useCallback(
    (name) => transactions.filter((t) => t.category === name).length,
    [transactions],
  )

  const availableMonths = useMemo(() => {
    const keys = new Set()
    for (const t of transactions) {
      const key = monthKeyOf(t.date)
      if (key) keys.add(key)
    }
    return [...keys].sort().reverse()
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const list =
      selectedMonth === ALL_MONTHS
        ? transactions
        : transactions.filter((t) => monthKeyOf(t.date) === selectedMonth)
    return [...list].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
  }, [transactions, selectedMonth])

  const { totalIncome, totalExpenses } = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of filteredTransactions) {
      const amount = Number(t.amount) || 0
      if (t.type === 'income') income += amount
      else expenses += amount
    }
    return {
      totalIncome: Math.round(income * 100) / 100,
      totalExpenses: Math.round(expenses * 100) / 100,
    }
  }, [filteredTransactions])

  const balance = useMemo(
    () => Math.round((totalIncome - totalExpenses) * 100) / 100,
    [totalIncome, totalExpenses],
  )

  /** Expenses grouped by category, largest first, with each share of the total. */
  const spendingByCategory = useMemo(() => {
    const totals = new Map()
    for (const t of filteredTransactions) {
      if (t.type !== 'expense') continue
      const amount = Number(t.amount) || 0
      totals.set(t.category, (totals.get(t.category) || 0) + amount)
    }
    const rows = [...totals.entries()].map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }))
    rows.sort((a, b) => b.amount - a.amount)
    const sum = rows.reduce((acc, r) => acc + r.amount, 0)
    return rows.map((r) => ({ ...r, percent: sum > 0 ? (r.amount / sum) * 100 : 0 }))
  }, [filteredTransactions])

  return {
    transactions,
    categories,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    filteredTransactions,
    totalIncome,
    totalExpenses,
    balance,
    spendingByCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    renameCategory,
    deleteCategory,
    countForCategory,
  }
}
