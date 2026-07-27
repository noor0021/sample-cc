# Budget Tracker

A personal budget tracker: log income and expenses by category, see your totals at a
glance, and view a breakdown of where your money is going.

## Features

- Add, edit, and delete income and expense transactions
- Categories — nine built-in ones (Food, Rent, Transport, Entertainment, …) plus your
  own custom categories, which you can rename or delete
- Dashboard with total income, total expenses, and remaining balance
- Spending-by-category chart, sorted largest first, with a table view
- Month filter — narrow the whole dashboard to a single month, or view all time

## Running it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Where your data lives

Everything is stored in your browser's `localStorage` on this device only. There is no
server and no account — nothing leaves your machine, but the data is also not shared
between browsers or devices, and clearing your browser data will erase it.

Two keys are used:

- `budget.transactions.v1`
- `budget.categories.v1`

**To reset the app**, open devtools → Console and run:

```js
localStorage.removeItem('budget.transactions.v1')
localStorage.removeItem('budget.categories.v1')
location.reload()
```

## Notes

- Deleting a custom category does not delete its transactions — they move to
  `Uncategorized`. Built-in categories can be renamed but not deleted.
- Renaming a category updates every transaction that used it.
- All totals are derived from the transaction list on every render, so they can't
  drift out of sync with the underlying data.
- Amounts are formatted as USD via `Intl.NumberFormat`. To change the currency, edit
  the `currency` formatter at the top of `src/lib/format.js`.
