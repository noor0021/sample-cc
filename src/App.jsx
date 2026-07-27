import { useState } from 'react'
import { ALL_MONTHS, useBudgetData } from './hooks/useBudgetData.js'
import { formatMonthKey, monthKeyOf } from './lib/format.js'
import { SummaryCards } from './components/SummaryCards.jsx'
import { MonthFilter } from './components/MonthFilter.jsx'
import { TransactionForm } from './components/TransactionForm.jsx'
import { TransactionList } from './components/TransactionList.jsx'
import { CategoryChart } from './components/CategoryChart.jsx'
import { CategoryManager } from './components/CategoryManager.jsx'

export default function App() {
  const data = useBudgetData()
  const [editingId, setEditingId] = useState(null)

  const editing = data.transactions.find((t) => t.id === editingId) ?? null
  const periodLabel =
    data.selectedMonth === ALL_MONTHS ? 'All time' : formatMonthKey(data.selectedMonth)

  function handleSubmit(draft) {
    if (editingId) {
      data.updateTransaction(editingId, draft)
      setEditingId(null)
    } else {
      data.addTransaction(draft)
    }
    // Don't let the active filter hide the row the user just touched.
    const month = monthKeyOf(draft.date)
    if (data.selectedMonth !== ALL_MONTHS && data.selectedMonth !== month) {
      data.setSelectedMonth(month)
    }
  }

  function handleDelete(id) {
    if (id === editingId) setEditingId(null)
    data.deleteTransaction(id)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Budget Tracker</h1>
          <p className="app-sub">Track income and expenses, and see where your money goes.</p>
        </div>
        <MonthFilter
          months={data.availableMonths}
          value={data.selectedMonth}
          onChange={data.setSelectedMonth}
        />
      </header>

      <SummaryCards
        totalIncome={data.totalIncome}
        totalExpenses={data.totalExpenses}
        balance={data.balance}
        periodLabel={periodLabel}
      />

      <div className="layout">
        <div className="col-side">
          <TransactionForm
            categories={data.categories}
            editing={editing}
            onSubmit={handleSubmit}
            onCancelEdit={() => setEditingId(null)}
          />
          <CategoryManager
            categories={data.categories}
            onAdd={data.addCategory}
            onRename={data.renameCategory}
            onDelete={data.deleteCategory}
            countForCategory={data.countForCategory}
          />
        </div>

        <div className="col-main">
          <CategoryChart
            rows={data.spendingByCategory}
            total={data.totalExpenses}
            periodLabel={periodLabel}
          />
          <TransactionList
            transactions={data.filteredTransactions}
            editingId={editingId}
            onEdit={(t) => setEditingId(t.id)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <footer className="app-footer">
        Data is stored only in this browser, on this device.
      </footer>
    </div>
  )
}
