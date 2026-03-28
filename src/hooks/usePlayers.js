import { useState, useEffect } from 'react'
import seedPlayers from '../data/players.json'

const STORAGE_KEY = 'entenwerfer_players'

const loadFromStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  return seedPlayers
}

const saveToStorage = players => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
}

const usePlayers = () => {
  const [players, setPlayers] = useState(loadFromStorage)

  useEffect(() => {
    saveToStorage(players)
  }, [players])

  const addPlayer = player => {
    const newPlayer = { ...player, id: Date.now().toString() }
    setPlayers(prev => [...prev, newPlayer])
  }

  const updatePlayer = (id, data) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, ...data } : p)))
  }

  const deletePlayer = id => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  return { players, addPlayer, updatePlayer, deletePlayer }
}

export default usePlayers
