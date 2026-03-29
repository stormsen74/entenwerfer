import { useState, useEffect } from 'react'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
const playersEndpoint = `${apiBaseUrl}/api/players.php`

const usePlayers = () => {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetch(playersEndpoint)
      .then(r => r.json())
      .then(setPlayers)
  }, [])

  const save = updated => {
    setPlayers(updated)
    fetch(playersEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
  }

  const addPlayer = player => {
    save([...players, { ...player, id: Date.now().toString() }])
  }

  const updatePlayer = (id, data) => {
    save(players.map(p => (p.id === id ? { ...p, ...data } : p)))
  }

  const deletePlayer = id => {
    save(players.filter(p => p.id !== id))
  }

  return { players, addPlayer, updatePlayer, deletePlayer }
}

export default usePlayers
