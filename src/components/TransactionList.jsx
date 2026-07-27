import { useState } from 'react'
import { formatMoney, formatShortDate } from '../lib/format.js'

export function TransactionList({ transactions, editingId, onEdit, onDelete }) {
  // id of the row awaiting delete confirmation — a misclick can't destroy data.
  const [confirmingId, setConfirmingId] = useState(null)

  if (transactions.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel-title">Transactions</h2>
        <p className="empty">No transactions for this period yet. Add one to get started.</p>
      </section>
    )
  }

  return (
    <section className="panel">
      <h2 className="panel-title">
        Transactions <span className="panel-count">{transactions.length}</span>
      </h2>

      <div className="table-scroll">
        <table className="txn-table">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Category</th>
              <th scope="col">Note</th>
              <th scope="col" className="num">
                Amount
              </th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} data-editing={t.id === editingId}>
                <td className="num-cell">{formatShortDate(t.date)}</td>
                <td>
                  <span className="chip">{t.category}</span>
                </td>
                <td className="note-cell">{t.note || <span className="muted">—</span>}</td>
                <td className="num num-cell" data-type={t.type}>
                  {t.type === 'income' ? '+' : '−'}
                  {formatMoney(t.amount)}
                </td>
                <td className="actions-cell">
                  {confirmingId === t.id ? (
                    <span className="confirm">
                      <span className="confirm-text">Delete?</span>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          onDelete(t.id)
                          setConfirmingId(null)
                        }}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => setConfirmingId(null)}
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <span className="confirm">
                      <button type="button" className="btn btn-small" onClick={() => onEdit(t)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => setConfirmingId(t.id)}
                      >
                        Delete
                      </button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
