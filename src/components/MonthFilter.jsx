import { ALL_MONTHS } from '../hooks/useBudgetData.js'
import { formatMonthKey } from '../lib/format.js'

export function MonthFilter({ months, value, onChange }) {
  return (
    <div className="filter-row">
      <label className="filter-label" htmlFor="month-filter">
        Period
      </label>
      <select
        id="month-filter"
        className="control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={ALL_MONTHS}>All time</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {formatMonthKey(m)}
          </option>
        ))}
      </select>
    </div>
  )
}
