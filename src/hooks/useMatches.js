import { useState, useEffect } from 'react'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const matchesEndpoint = `${apiBaseUrl}/api/matches.php`

const useMatches = () => {
  const [matches, setMatches] = useState([])

  useEffect(() => {
    fetch(matchesEndpoint)
      .then(r => r.json())
      .then(setMatches)
  }, [])

  const save = updated => {
    setMatches(updated)
    fetch(matchesEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  const addMatch = match => {
    save([match, ...matches])
  }

  const updateMatch = (id, data) => {
    save(matches.map(m => (m.id === id ? { ...m, ...data } : m)))
  }

  const deleteMatch = id => {
    save(matches.filter(m => m.id !== id))
  }

  const updateAndAddMatch = (id, data, newMatch) => {
    const updated = matches.map(m => (m.id === id ? { ...m, ...data } : m))
    save([newMatch, ...updated])
  }

  return { matches, addMatch, updateMatch, deleteMatch, updateAndAddMatch }
}

export default useMatches
