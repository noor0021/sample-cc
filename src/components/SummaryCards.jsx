import { formatMoney, formatSignedMoney } from '../lib/format.js'

export function SummaryCards({ totalIncome, totalExpenses, balance, periodLabel }) {
  const balanceState = balance > 0 ? 'positive' : balance < 0 ? 'negative' : 'neutral'

  return (
    <section className="summary" aria-label={`Summary for ${periodLabel}`}>
      <article className="card">
        <h2 className="card-label">Total income</h2>
        <p className="card-value">{formatMoney(totalIncome)}</p>
        <p className="card-note">{periodLabel}</p>
      </article>

      <article className="card">
        <h2 className="card-label">Total expenses</h2>
        <p className="card-value">{formatMoney(totalExpenses)}</p>
        <p className="card-note">{periodLabel}</p>
      </article>

      <article className="card card-balance" data-state={balanceState}>
        <h2 className="card-label">Remaining balance</h2>
        <p className="card-value card-hero">{formatSignedMoney(balance)}</p>
        <p className="card-note">
          {balanceState === 'negative'
            ? 'Overspending this period'
            : balanceState === 'positive'
              ? 'Left over this period'
              : 'Income matches expenses'}
        </p>
      </article>
    </section>
  )
}
