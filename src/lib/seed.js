export const TRANSACTIONS_KEY = 'budget.transactions.v1'
export const CATEGORIES_KEY = 'budget.categories.v1'

// Transactions whose category is deleted land here rather than being orphaned.
export const UNCATEGORIZED = 'Uncategorized'

export const DEFAULT_CATEGORIES = [
  { id: 'cat-food', name: 'Food', isDefault: true },
  { id: 'cat-rent', name: 'Rent', isDefault: true },
  { id: 'cat-transport', name: 'Transport', isDefault: true },
  { id: 'cat-entertainment', name: 'Entertainment', isDefault: true },
  { id: 'cat-utilities', name: 'Utilities', isDefault: true },
  { id: 'cat-health', name: 'Health', isDefault: true },
  { id: 'cat-shopping', name: 'Shopping', isDefault: true },
  { id: 'cat-income', name: 'Salary', isDefault: true },
  { id: 'cat-other', name: UNCATEGORIZED, isDefault: true },
]

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
