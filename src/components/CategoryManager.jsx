import { useState } from 'react'

export function CategoryManager({
  categories,
  onAdd,
  onRename,
  onDelete,
  countForCategory,
}) {
  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)

  function handleAdd(e) {
    e.preventDefault()
    const result = onAdd(newName)
    if (result.ok) {
      setNewName('')
      setError('')
    } else {
      setError(result.error)
    }
  }

  function commitRename(id) {
    const result = onRename(id, editingName)
    if (result.ok) {
      setEditingId(null)
      setError('')
    } else {
      setError(result.error)
    }
  }

  return (
    <section className="panel">
      <h2 className="panel-title">Categories</h2>

      <form className="inline-form" onSubmit={handleAdd}>
        <label className="sr-only" htmlFor="new-category">
          New category name
        </label>
        <input
          id="new-category"
          className="control"
          type="text"
          placeholder="Add a category…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="category-list">
        {categories.map((c) => {
          const count = countForCategory(c.name)
          return (
            <li key={c.id} className="category-item">
              {editingId === c.id ? (
                <>
                  <input
                    className="control"
                    type="text"
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(c.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                  />
                  <span className="confirm">
                    <button
                      type="button"
                      className="btn btn-small btn-primary"
                      onClick={() => commitRename(c.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </span>
                </>
              ) : (
                <>
                  <span className="category-name">
                    {c.name}
                    <span className="muted category-count">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </span>
                  </span>
                  {confirmingId === c.id ? (
                    <span className="confirm">
                      <span className="confirm-text">
                        {count > 0
                          ? `Move ${count} to Uncategorized?`
                          : 'Delete?'}
                      </span>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => {
                          onDelete(c.id)
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
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => {
                          setEditingId(c.id)
                          setEditingName(c.name)
                          setError('')
                        }}
                      >
                        Rename
                      </button>
                      {c.isDefault ? (
                        <span className="muted category-locked">Built-in</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-small"
                          onClick={() => setConfirmingId(c.id)}
                        >
                          Delete
                        </button>
                      )}
                    </span>
                  )}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
