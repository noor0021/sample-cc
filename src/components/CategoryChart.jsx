import { useState } from 'react'
import { formatMoney, formatPercent } from '../lib/format.js'

/**
 * Spending by category as a horizontal bar chart, sorted largest first.
 *
 * The reader's job here is comparing magnitude ("where is my money going?"),
 * so bar length carries the value and color is a single sequential hue —
 * hue is not asked to encode identity. Every bar is direct-labeled with its
 * amount and share, and a table view is available, so nothing rests on color.
 */
export function CategoryChart({ rows, total, periodLabel }) {
  const [hovered, setHovered] = useState(null)
  const [asTable, setAsTable] = useState(false)

  if (rows.length === 0) {
    return (
      <section className="panel">
        <h2 className="panel-title">Spending by category</h2>
        <p className="empty">No expenses recorded for {periodLabel.toLowerCase()} yet.</p>
      </section>
    )
  }

  const max = rows[0].amount

  return (
    <section className="panel">
      <div className="panel-head">
        <div>
          <h2 className="panel-title">Spending by category</h2>
          <p className="panel-sub">
            {formatMoney(total)} across {rows.length}{' '}
            {rows.length === 1 ? 'category' : 'categories'} · {periodLabel}
          </p>
        </div>
        <button type="button" className="btn btn-small" onClick={() => setAsTable((v) => !v)}>
          {asTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {asTable ? (
        <div className="table-scroll">
          <table className="txn-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col" className="num">
                  Amount
                </th>
                <th scope="col" className="num">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  <td className="num num-cell">{formatMoney(row.amount)}</td>
                  <td className="num num-cell">{formatPercent(row.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="chart">
          {rows.map((row) => (
            <li
              key={row.category}
              className="chart-row"
              onMouseEnter={() => setHovered(row.category)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(row.category)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              data-hovered={hovered === row.category}
            >
              <span className="chart-label" title={row.category}>
                {row.category}
              </span>
              <span className="chart-track">
                <span
                  className="chart-bar"
                  style={{ width: `${max > 0 ? (row.amount / max) * 100 : 0}%` }}
                />
              </span>
              <span className="chart-value">
                {formatMoney(row.amount)}
                <span className="chart-percent">{formatPercent(row.percent)}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
