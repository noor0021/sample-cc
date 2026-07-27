import { useEffect, useState } from 'react'
import { parseAmount, todayIso } from '../lib/format.js'
import { UNCATEGORIZED } from '../lib/seed.js'

function blankDraft(categories) {
  return {
    type: 'expense',
    amount: '',
    category: categories[0]?.name ?? UNCATEGORIZED,
    note: '',
    date: todayIso(),
  }
}

export function TransactionForm({ categories, editing, onSubmit, onCancelEdit }) {
  const [draft, setDraft] = useState(() => blankDraft(categories))
  const [error, setError] = useState('')

  // Prefill when an edit starts; reset to a blank draft when it ends.
  useEffect(() => {
    if (editing) {
      setDraft({
        type: editing.type,
        amount: String(editing.amount),
        category: editing.category,
        note: editing.note ?? '',
        date: editing.date,
      })
    } else {
      setDraft(blankDraft(categories))
    }
    setError('')
    // `categories` is only read for its first entry as a fallback default.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }))

  function handleSubmit(e) {
    e.preventDefault()
    const amount = parseAmount(draft.amount)
    if (amount === null) {
      setError('Enter an amount greater than zero.')
      return
    }
    if (!draft.date) {
      setError('Pick a date.')
      return
    }
    setError('')
    onSubmit({
      type: draft.type,
      amount,
      category: draft.category || UNCATEGORIZED,
      note: draft.note.trim(),
      date: draft.date,
    })
    if (!editing) setDraft(blankDraft(categories))
  }

  // A category the user deleted can still be referenced by the row being edited.
  const options = categories.some((c) => c.name === draft.category)
    ? categories
    : [{ id: 'missing', name: draft.category }, ...categories]

  return (
    <form className="panel form" onSubmit={handleSubmit}>
      <h2 className="panel-title">{editing ? 'Edit transaction' : 'Add transaction'}</h2>

      <fieldset className="type-toggle">
        <legend className="sr-only">Transaction type</legend>
        {['expense', 'income'].map((type) => (
          <label key={type} className="type-option" data-active={draft.type === type}>
            <input
              type="radio"
              name="type"
              value={type}
              checked={draft.type === type}
              onChange={set('type')}
            />
            {type === 'expense' ? 'Expense' : 'Income'}
          </label>
        ))}
      </fieldset>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          className="control"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={draft.amount}
          onChange={set('amount')}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" className="control" value={draft.category} onChange={set('category')}>
          {options.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          className="control"
          type="date"
          value={draft.date}
          onChange={set('date')}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          className="control"
          type="text"
          placeholder="e.g. groceries"
          value={draft.note}
          onChange={set('note')}
        />
      </div>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editing ? 'Save changes' : 'Add transaction'}
        </button>
        {editing ? (
          <button type="button" className="btn" onClick={onCancelEdit}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
