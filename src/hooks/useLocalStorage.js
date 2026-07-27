import { useEffect, useState } from 'react'

/**
 * State mirrored to localStorage. Corrupt or unreadable storage falls back to
 * `initialValue` instead of throwing during render.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === null) return initialValue
      const parsed = JSON.parse(stored)
      // Both stores hold arrays; anything else means the entry is unusable.
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return initialValue
      return parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded or storage disabled — keep the in-memory state usable.
    }
  }, [key, value])

  return [value, setValue]
}
